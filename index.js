/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-phoenix-channel',

  init: function(name) {
    var assets_path = require('path').join('phoenix-socket','dist','socket.js');
    this.treePaths['vendor'] = require.resolve('phoenix-socket').replace(assets_path, '');
  },
  //
  //included: function(app) {
  //  var options = this.app.options.phoenixChannelOptions || {enabled: true};
  //
  //  if (options.enabled) {
  //    this.app.import('vendor/ic-ajax/dist/named-amd/main.js', {
  //      exports: {
  //        'ic-ajax': [
  //          'default',
  //          'defineFixture',
  //          'lookupFixture',
  //          'raw',
  //          'request',
  //        ]
  //      }
  //    });
  //  }
  //}
};
