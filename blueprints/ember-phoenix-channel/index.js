module.exports = {

  normalizeEntityName: function() {
    // no-op
  },

  afterInstall: function() {
    return this.addBowerPackagesToProject([
      { name: 'phoenix_js', target: '0.0.2' },
    ]);
  }
};