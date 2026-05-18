#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Generates v6-knowledge.json from versioned docs, then creates/updates
    the Azure AI Search index and uploads all documents.

.DESCRIPTION
    Scans versioned_docs/version-v6.0.0/, extracts frontmatter and content
    from each .md/.mdx file, annotates each document with user_type
    (business | technical | both | null) based on sidebar placement, writes
    v6-knowledge.json, and pushes everything to Azure AI Search.

.EXAMPLE
    # Set credentials, then run:
    $env:AZURE_SEARCH_ENDPOINT  = 'https://<your-service>.search.windows.net'
    $env:AZURE_SEARCH_INDEX     = '<your-index>'
    $env:AZURE_SEARCH_ADMIN_KEY = '<your-admin-key>'
    ./scripts/generate-and-push-search-index.ps1
#>

[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
$Root         = Split-Path $PSScriptRoot -Parent
$DocsVersion  = 'v6.0.0'
$DocsDir      = Join-Path $Root 'versioned_docs' "version-$DocsVersion"
$SidebarFile  = Join-Path $Root 'versioned_sidebars' "version-$DocsVersion-sidebars.json"
$OutputFile   = Join-Path $Root 'v6-knowledge.json'

# ---------------------------------------------------------------------------
# Load .env (values already in environment take precedence)
# ---------------------------------------------------------------------------
$envFile = Join-Path $Root '.env'
if (Test-Path $envFile) {
    foreach ($line in Get-Content $envFile) {
        if ($line -match '^([^#=\s][^=]*)=(.*)$') {
            $key   = $Matches[1].Trim()
            $value = $Matches[2].Trim() -replace '^[''"]|[''"]$', ''
            if ($value -and -not [System.Environment]::GetEnvironmentVariable($key)) {
                [System.Environment]::SetEnvironmentVariable($key, $value)
            }
        }
    }
}

# ---------------------------------------------------------------------------
# Azure config
# ---------------------------------------------------------------------------
$Endpoint = ($env:AZURE_SEARCH_ENDPOINT -replace '/$', '')
$Index    = $env:AZURE_SEARCH_INDEX
$AdminKey = $env:AZURE_SEARCH_ADMIN_KEY
$ApiVer   = '2024-05-01-preview'
$BatchSize = 500

if (-not $Endpoint -or -not $Index -or -not $AdminKey) {
    Write-Error (
        "Missing required environment variables.`n" +
        "Set AZURE_SEARCH_ENDPOINT, AZURE_SEARCH_INDEX, AZURE_SEARCH_ADMIN_KEY"
    )
    exit 1
}

# ---------------------------------------------------------------------------
# Index schema
# ---------------------------------------------------------------------------
$IndexSchema = [ordered]@{
    name   = $Index
    fields = @(
        [ordered]@{ name = 'id';            type = 'Edm.String'; key = $true;  searchable = $false; filterable = $true                    }
        [ordered]@{ name = 'title';         type = 'Edm.String'; key = $false; searchable = $true;  filterable = $false; analyzer = 'en.microsoft' }
        [ordered]@{ name = 'content';       type = 'Edm.String'; key = $false; searchable = $true;  filterable = $false; analyzer = 'en.microsoft' }
        [ordered]@{ name = 'filepath';      type = 'Edm.String'; key = $false; searchable = $false; filterable = $true;  retrievable = $true       }
        [ordered]@{ name = 'category';      type = 'Edm.String'; key = $false; searchable = $false; filterable = $true;  facetable = $true         }
        [ordered]@{ name = 'sidebar_label'; type = 'Edm.String'; key = $false; searchable = $true;  filterable = $false                    }
        [ordered]@{ name = 'version';       type = 'Edm.String'; key = $false; searchable = $false; filterable = $true;  facetable = $true         }
        [ordered]@{ name = 'user_type';     type = 'Edm.String'; key = $false; searchable = $false; filterable = $true;  facetable = $true         }
    )
}

# ---------------------------------------------------------------------------
# Document generation helpers
# ---------------------------------------------------------------------------

function Get-ParsedFrontmatter {
    param([string]$Raw)
    $fields = @{}
    $body   = $Raw
    if ($Raw -match '(?s)^---\r?\n(.*?)\r?\n---\r?\n?(.*)$') {
        $body = $Matches[2]
        foreach ($line in ($Matches[1] -split '\r?\n')) {
            if ($line -match '^([\w_-]+):\s*(.*)') {
                $fields[$Matches[1]] = $Matches[2] -replace '^[''"]|[''"]$', '' -replace '^\s+|\s+$', ''
            }
        }
    }
    return @{ Fields = $fields; Body = $body }
}

function Get-H1Title {
    param([string]$Body)
    if ($Body -match '(?m)^#\s+(.+)$') {
        return ($Matches[1] `
            -replace '<[A-Z]\w*[^>]*/>', '' `
            -replace '</[A-Z]\w*>', ''       `
            -replace '<[A-Z]\w*[^>]*>', ''   `
            -replace '</?[a-z]+[^>]*>', ''   `
            -replace '\s+', ' '
        ).Trim()
    }
    return $null
}

function Get-SearchContent {
    param([string]$Body)
    $c = $Body
    # Strip fenced code blocks — code is not useful for search snippets
    $c = $c -replace '(?s)```[\s\S]*?```', ''
    # Strip MDX import statements
    $c = $c -replace '(?m)^import\s+.+from\s+[''"][^\s''"]+[''"];?\s*$', ''
    # Strip JSX/HTML self-closing tags: <Component ... /> and <br/>
    $c = $c -replace '<[A-Za-z][^>]*/>', ' '
    # Strip JSX/HTML closing tags: </Component>
    $c = $c -replace '</[A-Za-z][A-Za-z0-9.]*>', ' '
    # Strip JSX/HTML opening tags: <Component ...> — must come after self-closing
    $c = $c -replace '<[A-Za-z][^>]*>', ' '
    # Strip remaining JSX expression blocks {expression} — covers props artifacts and {/* comments */}
    $c = $c -replace '\{[^{}]*\}', ' '
    # Strip admonition markers: :::tip, :::note, etc.
    $c = $c -replace '(?m)^:::[a-zA-Z]*.*$', ''
    # Strip markdown heading markers
    $c = $c -replace '(?m)^#{1,6}\s+', ''
    # Strip markdown bold/italic/inline-code
    $c = $c -replace '(\*\*|__)([^*_\r\n]+)\1', '$2'
    $c = $c -replace '(\*|_)([^*_\r\n]+)\1', '$2'
    $c = $c -replace '`([^`\r\n]+)`', '$1'
    # Strip markdown images and links (keep link text)
    $c = $c -replace '!\[[^\]]*\]\([^)]*\)', ''
    $c = $c -replace '\[([^\]]+)\]\([^)]+\)', '$1'
    # Strip list markers and blockquote markers
    $c = $c -replace '(?m)^[-*+]\s+', ''
    $c = $c -replace '(?m)^\d+\.\s+', ''
    $c = $c -replace '(?m)^>\s*', ''
    # Normalize whitespace
    $c = $c -replace '\s+', ' '
    return $c.Trim()
}

function Add-SidebarIds {
    param($Items, [System.Collections.Generic.HashSet[string]]$Ids)
    foreach ($item in $Items) {
        if ($item -is [string]) {
            [void]$Ids.Add($item)
        }
        elseif ($item.PSObject.Properties['type'] -and $item.type -eq 'category') {
            if ($item.PSObject.Properties['link'] -and $item.link.id) {
                [void]$Ids.Add($item.link.id)
            }
            if ($item.PSObject.Properties['items'] -and $item.items) {
                Add-SidebarIds -Items $item.items -Ids $Ids
            }
        }
        elseif ($item.PSObject.Properties['type'] -and $item.type -eq 'doc' -and $item.id) {
            [void]$Ids.Add($item.id)
        }
    }
}

function Get-SidebarId {
    param([string]$Filepath)
    return (($Filepath -replace '\.mdx?$', '') -split '/' |
        ForEach-Object { $_ -replace '^\d+_', '' }) -join '/'
}

function Get-DocId {
    param([string]$Filepath)
    return $Filepath -replace '[\s/.]', '-'
}

function Get-Category {
    param([string]$Filepath)
    $parts = $Filepath -split '/'
    return ($parts.Length -gt 1) ? $parts[0] : 'root'
}

# ---------------------------------------------------------------------------
# Step 1: Generate knowledge JSON
# ---------------------------------------------------------------------------
function Invoke-GenerateKnowledge {
    Write-Host "`n📄 Generating knowledge from docs..."
    Write-Host "   Source  : $DocsDir"
    Write-Host "   Sidebar : $SidebarFile"

    $sidebar     = Get-Content $SidebarFile -Raw | ConvertFrom-Json
    $businessIds = [System.Collections.Generic.HashSet[string]]::new()
    $technicalIds = [System.Collections.Generic.HashSet[string]]::new()
    Add-SidebarIds -Items $sidebar.business_users  -Ids $businessIds
    Add-SidebarIds -Items $sidebar.technical_users -Ids $technicalIds

    $files = Get-ChildItem -Path $DocsDir -Recurse -File -Include '*.md', '*.mdx'
    $docs  = [System.Collections.Generic.List[object]]::new()

    foreach ($file in $files) {
        $filepath  = $file.FullName.Substring($DocsDir.Length).TrimStart('\', '/') -replace '\\', '/'
        $raw       = Get-Content $file.FullName -Raw -Encoding utf8
        $parsed    = Get-ParsedFrontmatter -Raw $raw
        $fields    = $parsed.Fields
        $body      = $parsed.Body

        $title = if ($fields['title'])         { $fields['title'] }
                 elseif ($fields['sidebar_label']) { $fields['sidebar_label'] }
                 else { Get-H1Title -Body $body }
        if (-not $title) { $title = [System.IO.Path]::GetFileNameWithoutExtension($file.Name) }

        $sidebarId = Get-SidebarId -Filepath $filepath
        $inB       = $businessIds.Contains($sidebarId)
        $inT       = $technicalIds.Contains($sidebarId)
        $userType  = if ($inB -and $inT) { 'both' }
                     elseif ($inB)        { 'business' }
                     elseif ($inT)        { 'technical' }
                     else                 { $null }

        $docs.Add([ordered]@{
            id            = Get-DocId     -Filepath $filepath
            title         = $title
            content       = Get-SearchContent -Body $body
            filepath      = $filepath
            category      = Get-Category  -Filepath $filepath
            sidebar_label = if ($fields['sidebar_label']) { $fields['sidebar_label'] } else { '' }
            version       = $DocsVersion
            user_type     = $userType
        })
    }

    $output = [ordered]@{ value = $docs.ToArray() }
    $output | ConvertTo-Json -Depth 5 | Set-Content -Path $OutputFile -Encoding utf8
    Write-Host "   ✅ $($docs.Count) documents written → v6-knowledge.json"

    $dist = $docs | Group-Object { if ($_.user_type) { $_.user_type } else { 'none' } } |
        Select-Object @{ N='type'; E={ $_.Name } }, Count
    Write-Host "   📊 user_type distribution:"
    $dist | ForEach-Object { Write-Host "      $($_.type): $($_.Count)" }

    return ,$docs.ToArray()
}

# ---------------------------------------------------------------------------
# Azure helpers
# ---------------------------------------------------------------------------
function Invoke-AzureSearch {
    param([string]$Path, [string]$Method, $Body)
    $uri     = "${Endpoint}${Path}?api-version=${ApiVer}"
    $headers = @{ 'api-key' = $AdminKey; 'Content-Type' = 'application/json' }
    $params  = @{ Uri = $uri; Method = $Method; Headers = $headers }
    if ($Body) {
        $params.Body = ($Body | ConvertTo-Json -Depth 10 -Compress)
    }
    return Invoke-RestMethod @params
}

function Get-Chunks {
    param([object[]]$Array, [int]$Size)
    $result = [System.Collections.Generic.List[object[]]]::new()
    for ($i = 0; $i -lt $Array.Count; $i += $Size) {
        $end = [Math]::Min($i + $Size, $Array.Count) - 1
        $result.Add([object[]]$Array[$i..$end])
    }
    return ,$result
}

# ---------------------------------------------------------------------------
# Step 2: Create or update the index
# ---------------------------------------------------------------------------
function Invoke-EnsureIndex {
    Write-Host "`n🔍 Checking index `"$Index`"..."
    $current = $null
    try {
        $current = Invoke-AzureSearch -Path "/indexes/$Index" -Method 'GET'
    }
    catch { }

    if ($current) {
        Write-Host "   Index exists — checking schema..."

        # Merge: keep all existing fields, append any from our schema that aren't present yet
        $existingNames = $current.fields | ForEach-Object { $_.name }
        $newFields = $IndexSchema.fields | Where-Object { $_.name -notin $existingNames }
        $needsSemantic = $false  # handled below, only if semanticSettings is already present

        if ($newFields.Count -eq 0 -and -not $needsSemantic) {
            Write-Host "   ✅ Schema already up to date."
            return
        }

        # Build updated schema from the live schema + new fields; preserve all live settings
        $updatedSchema = @{
            name   = $current.name
            fields = @($current.fields) + @($newFields)
        }
        # Preserve any existing scoring profiles / analyzers / etc.
        if ($current.scoringProfiles)  { $updatedSchema.scoringProfiles  = $current.scoringProfiles }
        if ($current.suggesters)       { $updatedSchema.suggesters       = $current.suggesters }
        if ($current.analyzers)        { $updatedSchema.analyzers        = $current.analyzers }
        if ($current.corsOptions)      { $updatedSchema.corsOptions      = $current.corsOptions }

        # Add semantic configuration if not already present — required for AI spell correction
        # Note: only add if the service already recognises semanticSettings (GA 2024-07-01+).
        # Older preview-era indexes silently ignore or reject it, so we skip rather than fail.
        if ($current.semanticSettings) {
            $updatedSchema.semanticSettings = $current.semanticSettings
        }

        Invoke-AzureSearch -Path "/indexes/$Index" -Method 'PUT' -Body $updatedSchema | Out-Null
        $changes = @()
        if ($newFields.Count -gt 0) { $changes += "$($newFields.Count) new field(s): $($newFields.name -join ', ')" }
        if ($needsSemantic)         { $changes += "semantic configuration" }
        Write-Host "   ✅ Updated index — added $($changes -join '; ')."
    }
    else {
        Write-Host "   Index not found — creating..."
        Invoke-AzureSearch -Path '/indexes' -Method 'POST' -Body $IndexSchema | Out-Null
        Write-Host "   ✅ Index created."
    }
}

# ---------------------------------------------------------------------------
# Step 3: Upload documents in batches
# ---------------------------------------------------------------------------
function Invoke-UploadDocuments {
    param([object[]]$Docs)
    $totalBatches = [Math]::Ceiling($Docs.Count / $BatchSize)
    Write-Host "`n📤 Uploading $($Docs.Count) documents in $totalBatches batch(es)..."

    $uploaded = 0
    for ($b = 0; $b -lt $totalBatches; $b++) {
        $start = $b * $BatchSize
        $end   = [Math]::Min($start + $BatchSize, $Docs.Count) - 1
        $batch = [object[]]$Docs[$start..$end]

        $payload = @{
            value = @($batch | ForEach-Object {
                $doc = [ordered]@{ '@search.action' = 'mergeOrUpload' }
                foreach ($key in $_.Keys) { $doc[$key] = $_[$key] }
                $doc
            })
        }

        $result    = Invoke-AzureSearch -Path "/indexes/$Index/docs/index" -Method 'POST' -Body $payload
        $succeeded = ($result.value | Where-Object { $_.status }).Count
        $failed    = @($result.value | Where-Object { -not $_.status })

        $uploaded += $succeeded
        Write-Host -NoNewline "   Batch $($b + 1)/${totalBatches}: ${succeeded}/$($batch.Count) ok"

        if ($failed.Count -gt 0) {
            Write-Host " — ⚠️  $($failed.Count) failed:"
            $failed | Select-Object -First 5 | ForEach-Object {
                Write-Host "      • $($_.key): $($_.errorMessage)"
            }
        }
        else {
            Write-Host ''
        }
    }

    Write-Host "`n✅ Uploaded ${uploaded}/$($Docs.Count) documents."
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
Write-Host "Azure AI Search — generate & push"
Write-Host "  Endpoint : $Endpoint"
Write-Host "  Index    : $Index"
Write-Host "  Version  : $DocsVersion"

$docs = [object[]](Invoke-GenerateKnowledge)
Invoke-EnsureIndex
Invoke-UploadDocuments -Docs $docs

Write-Host "`n🎉 Done. Your Azure AI Search index is up to date."
