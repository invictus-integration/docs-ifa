<#
.SYNOPSIS
    Regenerates the "Version" dropdown options in the issue templates from the
    minor versions documented in the release notes.

.DESCRIPTION
    Reads every <ReleaseVersion version="X.Y"> entry from every release-notes.mdx
    found under versioned_docs/*/support/ (all documented product versions, not
    just the latest one), sorts the minor versions newest-first, and rewrites
    the options list of the Version dropdown in every issue template that has
    one (currently the bug report and feature request templates) to match.
    An "Other / not sure" option is always kept first as a catch-all for
    unlisted or unknown versions.

    Run this locally after adding a new release, or let the
    "Update issue template version dropdowns" GitHub Action run it for you and
    open a PR.
#>

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$releaseNotesGlob = Join-Path $repoRoot 'versioned_docs\*\support\release-notes.mdx'
$templatePaths = @(
    Join-Path $repoRoot '.github\ISSUE_TEMPLATE\bug report.yml'
    Join-Path $repoRoot '.github\ISSUE_TEMPLATE\feature-request.yml'
)

$releaseNotesPaths = @(Get-ChildItem -Path $releaseNotesGlob -ErrorAction SilentlyContinue)

if ($releaseNotesPaths.Count -eq 0) {
    throw "No release-notes.mdx files found matching $releaseNotesGlob"
}
foreach ($templatePath in $templatePaths) {
    if (-not (Test-Path $templatePath)) {
        throw "Issue template not found at $templatePath"
    }
}

$versions = foreach ($releaseNotesPath in $releaseNotesPaths) {
    $releaseNotesContent = Get-Content -Raw $releaseNotesPath.FullName
    $versionMatches = [regex]::Matches($releaseNotesContent, '<ReleaseVersion\s+version="([\d.]+)"')
    $versionMatches | ForEach-Object { $_.Groups[1].Value }
}
$versions = $versions | Select-Object -Unique

if ($versions.Count -eq 0) {
    throw "No <ReleaseVersion version=`"...`"> entries found in any of: $($releaseNotesPaths.FullName -join ', ')"
}

$sortedVersions = $versions | Sort-Object -Descending { [version]$_ }

$options = @('Other / not sure') + ($sortedVersions | ForEach-Object { "`"$_.x`"" })
$optionsYaml = (($options | ForEach-Object { "        - $_" }) -join "`n") + "`n"

$pattern = '(?ms)(      label: Version\r?\n      description:.*?\r?\n      options:\r?\n)(?:        - .*\r?\n)+(      default: 0\r?\n)'

foreach ($templatePath in $templatePaths) {
    $templateContent = Get-Content -Raw $templatePath

    if ($templateContent -notmatch $pattern) {
        throw "Could not find the Version dropdown options block in $templatePath to update."
    }

    $newTemplateContent = [regex]::Replace(
        $templateContent,
        $pattern,
        { param($m) $m.Groups[1].Value + $optionsYaml + $m.Groups[2].Value }
    )

    if ($newTemplateContent -eq $templateContent) {
        Write-Host "$($templatePath): Version dropdown is already up to date: $($sortedVersions -join ', ')"
    }
    else {
        Set-Content -NoNewline -Path $templatePath -Value $newTemplateContent
        Write-Host "$($templatePath): updated Version dropdown with versions: $($sortedVersions -join ', ')"
    }
}
