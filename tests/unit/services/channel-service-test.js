import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | channel service', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('Socket connection must exist before join channel', function(assert) {
    let service = this.owner.lookup('service:channel-service');
    assert.throws(
      function(){
        service.joinChannel('the unconnected');
      } ,
      Error("Assertion Failed: You must connect to a socket before joining a channel (call channelService.connect(..)"),
      'Throws error if socket not connected'
    );
  });
});
