param (
    [Parameter(Mandatory=$true)][string]$StorageAccountName = $(throw "StorageAccountName is required"),
	[Parameter(Mandatory=$true)][string]$StorageContainerName = $(throw "StorageContainerName is required"),
	[Parameter(Mandatory=$true)][string]$StorageSasToken = $(throw "StorageSasToken is required"),
    [Parameter(Mandatory=$false)][string]$Version = "*",
    [Parameter(Mandatory=$false)][bool]$UseBeta = $false,
	[Parameter(Mandatory=$true)][string]$SaveLocation = $(throw "SaveLocation is required")
)

If(![string]::IsNullOrEmpty($SaveLocation) -and !(test-path $SaveLocation))
{
      New-Item -ItemType Directory -Force -Path $SaveLocation
}
Write-Output "Installing latest Az.Storage module"
Install-Module Az.Storage -Force -AllowClobber

$blobCtx = New-AzStorageContext -StorageAccountName "$StorageAccountName" -SasToken "$StorageSasToken"

#Get all blobs in container
$resources = Get-AzStorageBlob -Container $StorageContainerName -Context $blobCtx | Sort-Object -Property LastModified -Descending
$prefix = "prod"
if ($UseBeta) {
    $prefix = "staging"
}
$latestVersion = [version]"0.0.0.0"
$toDownload = @()
foreach ($resource in $resources | Where-Object { $_.Name.StartsWith($prefix) }) {
    $folderPrefix = ($resource.Name.Split('/') | Select-Object -First 1)
    $folderPrefixVersion = ($resource.Name.Split('/') | Select-Object -Skip 1 | Select-Object -First 1)
    $fileName = ($resource.Name.Split('/') | Select-Object -Last 1)
    $fileDirectory = ($resource.Name.Replace($folderPrefix, "").Replace($folderPrefixVersion, "").Replace($fileName, "").Replace("/","").Trim() )

    if($fileDirectory){
        $path = $SaveLocation + "\" + $fileDirectory

        if(!(test-path -PathType container $path))
        {
            Write-Host "Creating directory at path $path"
            New-Item -ItemType Directory -Path $path
        }

        $destination  = $SaveLocation + "\" + $fileDirectory + "\" + $fileName
    }
    else{
        $destination  = $SaveLocation + "\" + $fileName
    }
    
    $folderVersion = [version]$folderPrefixVersion

    if ($prefix -ne $folderPrefix) {
        continue
    }

    if ($Version -eq "*") {
        if ($folderVersion -eq $latestVersion) {
            $toDownload += ,($resource.Name, $destination)
        }
        if ($folderVersion -gt $latestVersion) {
            $latestVersion = $folderVersion
            $toDownload = ,($resource.Name, $destination)
        }
    }
    else {
        $requestedVersion = [version]$Version
        $latestVersion = $requestedVersion
        if ($requestedVersion -eq $folderVersion) {
            $toDownload += ,($resource.Name, $destination)
        }
    }
}

Write-Host "Setting Invictus.Installation.Version to $latestVersion"
Write-Host "##vso[task.setvariable variable=Invictus.Installation.Version]$latestVersion"

foreach ($d in $toDownload) {
    #Download and save file to specified location
    Write-Host "Downloading " + $d[0] + " to destination" + $d[1] + "..."
    Get-AzStorageBlobContent -Context $blobCtx -Container $StorageContainerName -Blob $d[0] -Destination $d[1] -Force
}
