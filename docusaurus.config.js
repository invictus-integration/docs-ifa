const lightCodeTheme = require('./src/prism/light');
const darkCodeTheme = require('./src/prism/dark');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Invictus - Integration',
  url: 'https://invictus-integration.github.io/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  onBrokenAnchors: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'invictus-integration', // Usually your GitHub org/user name.
  projectName: 'Invictus - Integration', // Usually your repo name.
  themeConfig: {
    image: 'img/invictus.jpg',
    navbar: {
      title: 'Invictus',
      logo: {
        alt: 'Invictus',
        src: 'img/logo.light.png',
        srcDark: 'img/logo.dark.png',
      },
      items: [
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
    zoom: {
      // (optional) The selector to use for the images to zoom.
      // selector: 'img-zoom',
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Community',
          items: [
            {
              label: 'Invictus Integration Github',
              href: 'https://github.com/invictus-integration',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()}, Invictus - Integration maintained by Codit`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: ['csharp', 'diff', 'json', 'powershell', 'yaml'],
    },
  },
  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      ({
        // `hashed` is recommended as long-term-cache of index file is possible.
        hashed: true,
        docsRouteBasePath: '/'
      }),
    ]
  ],
  plugins: [
     'docusaurus-plugin-image-zoom'
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          path: 'preview',
          sidebarCollapsible: false,
          // Please change this to your repo.
          editUrl: 'https://github.com/invictus-integration/docs-ifa/edit/master/docs',
          includeCurrentVersion: true,
          admonitions: {
            keywords: ['praise'],
            extendDefaults: true,
          },
          lastVersion: 'v6.0.0',
          versions: {
            'v6.0.0': {
              label: 'v6'
            }
          }
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  stylesheets: [
    'https://fonts.googleapis.com/css2?family=Bitter:wght@700&family=Inter:wght@400;500&display=swap'
  ],
};
