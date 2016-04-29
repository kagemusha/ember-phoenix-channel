module.exports = {

  normalizeEntityName: function() {
    // no-op
  },

  // if npm linking locally, must run ember generate to
  // to manually add this file to your consuming apps
  // bower.js file
  afterInstall: function() {
    return this.addBowerPackagesToProject([
      { name: 'phoenix_js', target: '0.0.2' },
    ]);
  }

};