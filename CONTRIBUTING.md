# Contributing to the Invictus feature documentation
First off, THANK YOU for taking the time to help improve the feature documentation of Invictus. 💗

* 🐞 **There's something wrong on the site!** <br/>
  Please [report the problem](https://github.com/invictus-integration/docs-ifa/issues/new/choose), or if you're up to it: fix it directly and [submit a PR](#repository-structure).
* ❔ **Questions or ideas** <br/>
  [GitHub discussions](https://github.com/invictus-integration/docs-ifa/discussions/new/choose) is the place to host discussions, questions, or ideas related to anything Invictus. Or [post a message on the Team's channel](https://teams.microsoft.com/l/channel/19%3A94dc05d412d84c16858094ff79af241d%40thread.skype/Invictus%20for%20Azure?groupId=f2ebbeb0-4e8b-4764-9835-98011ae154e9&tenantId=7517bc42-bcf8-4916-a677-b5753051f846).

## About this repository
This repository hosts the source for the [Invictus documentation site](https://invictus-integration.github.io/docs-ifa/), built with [Docusaurus](https://docusaurus.io/) and its built-in [versioning](https://docusaurus.io/docs/versioning) support. Every major released Invictus version has its own snapshot of documentation, so readers on an older version always see docs that match what they have installed. Deprecated/New badges handle differences between minor versions. 

Besides the Markdown/MDX content, the repository also contains:
* Custom React/TypeScript components (`/src/components`) used inside the docs, such as `ApiPlayground`, `ParameterTable`, diagrams, and the FAQ/glossary browsers.
* A local search index (`knowledge.json` / `src/data/search-index.json`) and a PowerShell script that keeps an Azure AI Search index in sync with the docs, used to power the search bar and the "Ask AI" feature.
* Cypress end-to-end tests, spell-checking, and prose-linting workflows that run on every pull request.

## Repository structure
```shell
preview # - - - - - - - - - # unpublished documentation:
├── dashboard               # the next/upcoming Invictus version is
├── framework               # prepared here. Empty until work on the next
├── support                 # version starts — see "Workflow contributing" below.
├── architecture-diagram.mdx
├── index.md
versioned_docs # - - - - -  # published documentation:
├── version-v6.0.0          # every released Invictus version gets its own
│   ├── dashboard           # folder here, mirroring the structure of /preview.
│   ├── framework           #
│   ├── support             #
│   ├── architecture-diagram.mdx
│   └── index.mdx
versioned_sidebars          # sidebar configuration, one file per version.
├── version-v6.0.0-sidebars.json
versions.json               # ordered list of published versions.
sidebars.js                 # sidebar config for the /preview version (auto-generated).
src # - - - - - - - - - - - # site source:
├── components              # shared React/TSX components used across docs pages.
├── css                     # global styles.
├── prism                   # syntax-highlighting theme.
├── data                    # generated/checked-in JSON, incl. search-index.json.
├── theme                   # swizzled Docusaurus theme overrides.
static # - - - - - - - - -  # files served as-is and usable from any .md/.mdx file:
├── images                  #
scripts # - - - - - - - - - # maintenance scripts:
├── refresh-search-index.ps1 # regenerates the search index — see below.
cypress # - - - - - - - - - # end-to-end tests (see "Continuous integration").
docusaurus.config.js # - -  # Docusaurus main config: theme, plugins, versioning.
```

## Workflow contributing

<details>
<summary><em>Fix something in the published documentation</em></summary>

* 🔎 Locate the `/versioned_docs` folder in the root of the repository.
* 📌 Pinpoint the released version folder where the problem is (versions map to `/version-vx.x.x` folders).
* 🧑‍🏭 Fix the issue in the relevant `.md`/`.mdx` files.
* 🔁 Repeat for any other affected versions, including `/preview`, so the fix carries forward into the next release too.

</details>

<details>
<summary><em>Add content for the next version, without publishing it yet</em></summary>

* 🔎 Locate the `/preview` folder in the root of the repository.
* ✨ Add or edit `.md`/`.mdx` files there. Content here is only shown on the in-progress version of the site (`includeCurrentVersion` is only enabled outside of production builds), so it stays hidden from the live site until publishing the version.

</details>

<details>
<summary><em>Publish a new version</em></summary>

When Invictus releases a new version and the site should reflect it, run this at the repository root:

```shell
npm run docusaurus docs:version v7.0.0
```

> ⚠️ Requires [Node.js](https://nodejs.org/) 20+ and [npm](https://www.npmjs.com/) installed locally (see `engines` in `package.json`).

Running this command does the following:
1. Copies the full `/preview` folder contents into a new `/versioned_docs/version-<version>` folder.
2. Creates a versioned sidebar file at `/versioned_sidebars/version-<version>-sidebars.json`.
3. Appends the new version number to `versions.json`.

Commit the generated changes and open a pull request. Once merged, [refresh the search index](#keeping-search-up-to-date) against the production index so the new version becomes searchable, and it then becomes the default version on the live site.

</details>

## Keeping search up to date
The search bar and "Ask AI" feature use an Azure AI Search index, generated from the docs by [`scripts/refresh-search-index.ps1`](./scripts/refresh-search-index.ps1). Run it whenever content that appears in search results changes (docs text, `versions.json`, or one of the Bicep parameter JSON files listed in the script's `$DataSources`).

The script:
1. Reads `versions.json` and scans every `versioned_docs/version-<ver>/` folder, extracting front matter and content from each `.md`/`.mdx` file (tagging each with `user_type`: `business`, `technical`, `both`, or none, based on where it sits in the sidebar).
2. Writes the combined result to `knowledge.json` (repository root) and `src/data/search-index.json` (the static, offline-search fallback bundled with the site).
3. Unless run with `-LocalOnly`, also creates/updates the Azure AI Search index and uploads every document to it.

**Regenerate the static index locally (no credentials needed):**
```powershell
./scripts/refresh-search-index.ps1 -LocalOnly
```

**Pushing to an Azure AI Search index** (for example your own development index, or production): copy `.env.example` to `.env` and fill in `AZURE_SEARCH_ENDPOINT`, `AZURE_SEARCH_INDEX`, and `AZURE_SEARCH_ADMIN_KEY` (values already set as environment variables take precedence over `.env`), then run:
```powershell
./scripts/refresh-search-index.ps1
```
> ⚠️ Use a dedicated development index name (for example `v6-docs-dev`) locally so you never overwrite the production index (`v6-docs`) by accident. CI/CD uses the production index name.

## MCP server for AI agents
The [`netlify/edge-functions/mcp.js`](./netlify/edge-functions/mcp.js) edge function exposes the same Azure AI Search index to [MCP](https://modelcontextprotocol.io/)-compatible AI agents (Copilot, Claude, custom bots, etc.) via a single read-only tool, `search_documentation`, at `/api/mcp`.

It reuses `AZURE_SEARCH_ENDPOINT`, `AZURE_SEARCH_INDEX`, and `AZURE_SEARCH_ADMIN_KEY` from `.env`. If it fails or is unreachable, it doesn't affect the site, search bar, or "Ask AI" feature.

Point an MCP client at `https://docs.invictus-integration.com/api/mcp` to connect. Test locally with `netlify dev` (see [Local development](#local-development)) and a JSON-RPC request, for example:
```powershell
$body = @{ 
  jsonrpc = "2.0";
  id = 1; 
  method = "tools/call"; 
  params = @{ 
    name = "search_documentation"; 
    arguments = @{ query = "your search terms" } }
} | ConvertTo-Json -Depth 5
Invoke-RestMethod -Uri "http://localhost:8888/api/mcp" -Method Post -ContentType "application/json" -Body $body
```

## Continuous integration
Every pull request runs the following checks automatically:

| Workflow                                                             | What it checks                                                                                                                                                           |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`vale-review.yml`](./.github/workflows/vale-review.yml)             | Lints prose in `versioned_docs` with [Vale](https://vale.sh/) and posts inline review comments.                                                                          |
| [`spell-check-on-pr.yml`](./.github/workflows/spell-check-on-pr.yml) | Checks spelling across the repository with [typos](https://github.com/crate-ci/typos).                                                                                   |
| [`doc-tests.yml`](./.github/workflows/doc-tests.yml)                 | Builds the site and runs the Cypress end-to-end tests (`cypress/e2e/*.cy.js`) against it, covering the search bar navigation, FAQ search, and the Bicep parameter table. |

Netlify publishes [a deploy preview](https://app.netlify.com/projects/invictus-for-azure/overview) for every pull request, so reviewers can check changes visually before merging.

## Local development
```shell
pnpm install         # install dependencies
pnpm run cy:open     # Opens Cypress UI to run the tests
pnpm run start       # Starts up the site without Netlify Edge functions running.
netlify dev          # Starts up the site as Netlify with all the Edge functions running.
```

See the [official Docusaurus docs](https://docusaurus.io/docs) to learn more about what's possible with Markdown ➡️ HTML conversion, in particular the [Markdown/MDX features](https://docusaurus.io/docs/markdown-features) reference.