import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('socket-message-log', 'Integration | Component | socket message log', {
  integration: true
});

const noChannelErrorMsgFragment = "Need to specify a channel service to receive messages";


const mockChannel = Ember.Object.create({
  on: Ember.K
});

test('must specify channel', function(assert) {
  this.set('someChannel', mockChannel);
  this.render(hbs`{{socket-message-log channelService=someChannel}}`);
  assert.equal(this.$().text().trim(), "Socket Message Log");

});
test('must specify channel', function(assert) {
  this.render(hbs`{{socket-message-log}}`);
  assert.ok(this.$().text().indexOf(noChannelErrorMsgFragment) > -1);

});
