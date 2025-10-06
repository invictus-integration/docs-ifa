<#
.SYNOPSIS
    Disables older revisions of Azure Container Apps in a resource group while keeping a configurable number of the most recent revisions.

.DESCRIPTION
    Retrieves Azure Container Apps from the specified resource group and disables revisions that exceed the retention threshold.

.PARAMETER ResourceGroupName
    The name of the resource group that hosts the Azure Container Apps.

.PARAMETER RevisionsToKeep
    The number of the most recent revisions to retain for each container app. Defaults to 1.

.EXAMPLE
    .\Invictus-RemoveOldRevisions.ps1 -ResourceGroupName "rg-apps"

    Keeps only the most recent revision for every container app in the "rg-apps" resource group.

.EXAMPLE
    .\Invictus-RemoveOldRevisions.ps1 -ResourceGroupName "rg-apps" -RevisionsToKeep 2

    Retains the two most recent revisions for every container app in the "rg-apps" resource group.
#>

[CmdletBinding(SupportsShouldProcess = $true, ConfirmImpact = "Medium")]
param (
    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$ResourceGroupName,

    [Parameter()]
    [int]$RevisionsToKeep = 1
)

try {
    $null = Get-AzContext -ErrorAction Stop
}
catch {
    Write-Error "No active Azure context detected. Run Connect-AzAccount (and Select-AzSubscription if needed) before executing this script."
    exit 1
}

try {
    $containerApps = Get-AzContainerApp -ResourceGroupName $ResourceGroupName -ErrorAction Stop
}
catch {
    Write-Error "Failed to retrieve container apps for resource group '$ResourceGroupName'. $_"
    exit 1
}

if (-not $containerApps) {
    Write-Warning "No container apps found in resource group '$ResourceGroupName'."
    return
}

foreach ($app in $containerApps) {
    Write-Host "Processing container app: $($app.Name)"

    try {
        $revisions = Get-AzContainerAppRevision -ResourceGroupName $ResourceGroupName -ContainerAppName $app.Name -ErrorAction Stop
    }
    catch {
        Write-Error "Unable to retrieve revisions for container app '$($app.Name)'. $_"
        continue
    }

    if (-not $revisions) {
        Write-Verbose "No revisions found for container app '$($app.Name)'."
        continue
    }

    $orderedRevisions = $revisions | Sort-Object -Property CreatedTime -Descending

    if ($orderedRevisions.Count -le $RevisionsToKeep) {
        Write-Host "Skipping '$($app.Name)' - only $($orderedRevisions.Count) revision(s) present."
        continue
    }

    $revisionsToDisable = $orderedRevisions | Select-Object -Skip $RevisionsToKeep
    Write-Verbose ("Found {0} revision(s) to disable for app '{1}'." -f $revisionsToDisable.Count, $app.Name)

    foreach ($revision in $revisionsToDisable) {
        $targetDescription = "revision '$($revision.Name)' for app '$($app.Name)'"

        try {
            Disable-AzContainerAppRevision -ResourceGroupName $ResourceGroupName -ContainerAppName $app.Name -RevisionName $revision.Name -ErrorAction Stop
            Write-Host "Disabled $targetDescription."
        }
        catch {
            Write-Error "Failed to disable revision '$($revision.Name)' for app '$($app.Name)'. $_"
        }
    }
}