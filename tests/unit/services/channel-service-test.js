import { moduleFor, test } from 'ember-qunit';

moduleFor('service:channel-service', 'Unit | Service | channel service', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

// Replace this with your real tests.
test('Socket connection must exist before join channel', function(assert) {
  let service = this.subject();
  assert.throws(
    function(){
      service.joinChannel('the unconnected');
    } ,
    Error("Assertion Failed: You must connect to a socket before joining a channel (call channelService.connect(..)"),
    'Throws error if socket not connected'
  );
});
