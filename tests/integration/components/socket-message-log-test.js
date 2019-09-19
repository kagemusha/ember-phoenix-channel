import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | socket message log', function(hooks) {
  setupRenderingTest(hooks);

  const noChannelErrorMsgFragment = "Need to specify a channel service to receive messages";

  const mockChannel = EmberObject.create({
    on() {}
  });

  test('must specify channel', async function(assert) {
    this.set('someChannel', mockChannel);
    await render(hbs`{{socket-message-log channelService=someChannel}}`);
    assert.equal(find('*').textContent.trim(), "Socket Message Log");
  });

  test('must specify channel', async function(assert) {
    await render(hbs`{{socket-message-log}}`);
    assert.ok(find('*').textContent.indexOf(noChannelErrorMsgFragment) > -1);
  });
});
