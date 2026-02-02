module.exports = {
  ci: {
    collect: {
      staticDirFileDiscoveryDepth: 10,
    },
    assert: {
      preset: 'lighthouse:recommended'
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};