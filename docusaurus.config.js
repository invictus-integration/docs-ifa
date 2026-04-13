const lightCodeTheme = require('./src/prism/light');
const darkCodeTheme = require('./src/prism/dark');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
const config = {
  title: 'Invictus for Azure',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  url: 'https://invictus-integration.github.io/',
  baseUrl: '/',

  organizationName: 'invictus-integration',
  projectName: 'Invictus for Azure',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  onBrokenAnchors: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          path: 'preview',
          sidebarCollapsible: false,
          includeCurrentVersion: true,
          admonitions: {
            keywords: ['praise'],
            extendDefaults: true,
          },
          lastVersion: 'v6.0.0',
          versions: {
            'v6.0.0': {
              label: 'v6',
              badge: false,
            }
          }
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      {
        // `hashed` is recommended as long-term-cache of index file is possible.
        hashed: true,
        docsRouteBasePath: '/',
        language: ["en", "zh"],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,

        // For Docs using Chinese, it is recommended to set:
        // language: ["en", "zh"],

        // Customize the keyboard shortcut to focus search bar (default is "mod+k"):
        // searchBarShortcutKeymap: "s", // Use 'S' key
        // searchBarShortcutKeymap: "ctrl+shift+f", // Use Ctrl+Shift+F

        // If you're using `noIndex: true`, set `forceIgnoreNoIndex` to enable local index:
        // forceIgnoreNoIndex: true,

        // Enable Ask AI integration:
        // askAi: {
        //   project: "your-project-name",
        //   apiUrl: "https://your-api-url.com/api/stream",
        //   hotkey: "cmd+I", // Optional: keyboard shortcut to trigger Ask AI
        // },
      }
    ],
  ],

  themeConfig: {
    image: 'img/invictus.jpg',
    navbar: {
      title: 'Invictus for Azure',
      logo: {
        alt: 'Invictus for Azure logo',
        src: 'img/logo.dark.png',
        srcDark: 'img/logo.dark.png',
      },
      items: [
        {
          type: 'custom-user-type-switcher',
          position: 'left',
        },
        {
          type: 'docsVersionDropdown',

          //// Optional
          position: 'right',
          // Add additional dropdown items at the beginning/end of the dropdown.
          dropdownItemsBefore: [],
          // Do not add the link active class when browsing docs.
          dropdownActiveClassDisabled: true,
          docsPluginId: 'default',
        },
        {
          type: 'search',
          position: 'right',
        },
        {
          href: 'https://github.com/invictus-integration/docs-ifa',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Business users',
          items: [
            {
              html: '<a class="footer-link" data-cy-footer-link="view-flows" href="/dashboard/flows">How to view your flows</a>',
            },
            {
              html: '<a class="footer-link" data-cy-footer-link="create-flows" href="/dashboard/flows/add">How to create flows</a>',
            },
            {
              html: '<a class="footer-link" data-cy-footer-link="search-flows" href="/dashboard/flows/search">How to search for flow traces</a>',
            }
          ]
        },
        {
          title: 'Technical users',
          items: [
            {
              html: '<a class="footer-link" data-cy-footer-link="dashboard-installation" href="/dashboard/installation">Dashboard installation</a>'
            },
            {
              html: '<a class="footer-link" data-cy-footer-link="framework-installation" href="/framework/installation">Framework installation</a>'
            }
          ]
        },
        {
          title: 'Support',
          items: [
            {
              label: 'Create a support ticket',
              href: 'https://github.com/invictus-integration/docs-ifa/issues/new/choose',
            },
            {
              html: '<a class="footer-link" data-cy-footer-link="migrate-v4-to-v5" href="/support/migrate-v4-to-v5">Migrate v4 to v5</a>'
            },
            {
              html: '<a class="footer-link" data-cy-footer-link="migrate-v5-to-v6" href="/support/migrate-v5-to-v6">Migrate v5 to v6</a>'
            }
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()}, Invictus for Azure maintained by Codit.`,
    },

    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: ['csharp', 'diff', 'json', 'powershell', 'yaml'],
    },
  },

  stylesheets: [
    'https://fonts.googleapis.com/css2?family=Bitter:wght@700&family=Inter:wght@400;500&display=swap'
  ],
};

module.exports = config;