import fs from 'fs';
import convert from 'xml-js';

const SITEMAP_PATH = './build/sitemap.xml';
const SITE_URL = 'https://invictus-integration.github.io'

const data = fs.readFileSync(SITEMAP_PATH);
const result = convert.xml2json(data, { compact: true, spaces: 4 });
const json = JSON.parse(result);
const url = json.urlset.url.map((item) => item.loc._text.replace(SITE_URL, ""));

module.exports = {
  ci: {
    collect: {
      staticDirFileDiscoveryDepth: 10,
      url: url
    },
    assert: {
      preset: 'lighthouse:recommended'
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};