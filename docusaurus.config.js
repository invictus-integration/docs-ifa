const lightCodeTheme = require('./src/prism/light');
const darkCodeTheme = require('./src/prism/dark');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Invictus - Integration',
  url: 'https://invictus-integration.github.io/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'invictus-integration', // Usually your GitHub org/user name.
  projectName: 'Invictus - Integration', // Usually your repo name.
  themeConfig: {
    image: 'images/v2_logo_horizontal.png',
    navbar: {
      title: 'Integration',
      logo: {
        alt: 'Invictus',
        src: 'images/v2_logo_horizontal.png',
        srcDark: 'images/v2_logo_horizontal.png',
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
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Community',
          items: [
            {
              label: 'Invictus Integration Github',
              href: 'https://github.com/invictus-integration/docs-ifa',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()}, Invictus - Integration maintained by Codit`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: ['csharp', 'fsharp', 'diff', 'json', 'powershell', 'yaml'],
    },
  },
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
          editUrl: 'https://github.com/invictus-integration/docs-ifa/edit/master',
          includeCurrentVersion: process.env.CONTEXT !== 'production',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  stylesheets: [
    'https://fonts.googleapis.com/css2?family=Bitter:wght@700&family=Inter:wght@400;500&display=swap',
  ],
};
