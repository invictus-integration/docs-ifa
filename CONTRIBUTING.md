# Contributing to the Invictus feature documentation
First off, THANK YOU for taking the time to help improve the feature documentation of Invictus! 💗

* 🐞 **There's something wrong on the site!** <br/>
  Please [report the problem](https://github.com/invictus-integration/docs-ifa/issues/new/choose) so we can have a look, or if you're up to it: you can always fix it yourself and [submit a PR](#update-documentation-content).
* ❔ **I have a question or an idea** <br/>
  [GitHub discussions](https://github.com/invictus-integration/docs-ifa/discussions/new/choose) is the place to host discussions, questions, or ideas related to anything Invictus. Or [post a message on the Team's channel](https://teams.microsoft.com/l/channel/19%3A94dc05d412d84c16858094ff79af241d%40thread.skype/Invictus%20for%20Azure?groupId=f2ebbeb0-4e8b-4764-9835-98011ae154e9&tenantId=7517bc42-bcf8-4916-a677-b5753051f846).

## Update documentation content
The feature documentation site is a [versioned Docusaurus site](https://docusaurus.io/docs/versioning). The following pseudo file/folder structure should help navigate the repository's contents:

```shell
preview # - - - - - - - - - # preview documentation:
├── dashboard               # the next/upcoming Invictus version
├── framework               # is prepared here.
├── support                 # 
├── architecture-diagram    #
├── index.md                #
src # - - - - - - - - - - - # custom style/components:
├── prism                   # colors and custom React components are store here. 
├── css                     #
static # - - - - - - - - -  # globally available resources:
├── images                  # all files here are available in all .md files
versioned_docs # - - - - -  # published documentation:
├── version-v6.0.0          # ready and released Invictus versions
    ├── dashboard           # are stored here.
    ├── framework           #
    ├── support             #
    ├── architecture-diagram.md
    ├── index.md            #
versioned_sidebars          # the sidebar configuration for each version.
├── version-v6.0.0-sidebars.json
versions.json               # the available versions of the site.
sidebars.js                 # default sidebar config (which is auto-generated).
docusaurus.config.js # - -  # Docusaurus main file: theme, meta, info, plugins
```

<details>
<summary><em>'I want to fix something in the published documentation'</em></summary>

* 🔎 Locate the `/versioned_docs` folder in the root of the repository.
* 📌 Pinpoint the released version folder where the problem is.
  * Versions are mapped to `/version-vx.x.x` folders
* 🧑‍🏭 Fix the issue in any of the `.md` files in the folder.
* 🔁 Now do the same thing for any other lower versions where this problem also exists.
* 🔁 Now do the same thing for the `/preview` folder
  * *This will make sure that the fix is also included in the next version.*

</details>

<details>
<summary><em>'I want to add something for the next version, but not publish it just yet'</em></summary>

* 🔎 Locate the `/preview` folder in the root of the repository.
* ✨ Add the change to one of the `.md` files in the folder.
  * *This will make sure that the change will be included in the next version.*

</details>

## Publish new version
When a new version of Invictus is released, and the documentation site should reflect this, you can run this command at the root of the repository:

```shell
> npm run docusaurus docs:version v7.0.0
```

When running this command, the documentation versioning will:
1. Copy the full `/preview` folder contents into a new `/versioned_docs/version-[version_name]` folder.
2. Create a versioned sidebar file at `/versioned_sidebars/version-[version_name]-sidebars.json`
3. Append the new version number to `versions.json`

These local changes it generates can then be submitted as a pull request. Once the PR is merged, the new version will be available as the default one.

## Technical details
* See the [official Docusaurus site](https://docusaurus.io/docs) to learn more about what's possible with Markdown ➡️ HTML conversion. Specifically the [Markdown/MDX features](https://docusaurus.io/docs/markdown-features).
* When new pull requests are submitted, [a deploy preview is being published to Netlify](https://app.netlify.com/projects/invictus-for-azure/overview). This makes sure that each documentation change can first be looked at before actually merging.
* The final published site is published via [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) not from the main branch, but from the [`gh-pages`](https://github.com/invictus-integration/docs-ifa/tree/gh-pages) branch. There the final HTML-build result of the Docusaurus site can be found. Each pull request merged to the main branch will trigger [a GitHub workflow that pushes to the `gh-pages` branch](https://github.com/invictus-integration/docs-ifa/blob/master/.github/workflows/deploy-gh-pages.yml).