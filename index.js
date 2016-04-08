/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-phoenix-channel',

  included: function(app) {
    this._super.included(app);
    app.import('bower_components/phoenix_js/dist/phoenix.amd.js', {
      exports: {
        'phoenix_js': [
          'Socket',
          'WebSocket',
          'LongPoll'
        ]
      }
    });
  }

};
