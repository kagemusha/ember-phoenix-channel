import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('socket-message-log', 'Integration | Component | socket message log', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{socket-message-log}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#socket-message-log}}
      template block text
    {{/socket-message-log}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
