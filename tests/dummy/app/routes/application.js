import Ember from 'ember';

export default Ember.Route.extend({
  channel: Ember.inject.service(),

  beforeModel() {
    console.log(`hellow`);
    this.get('channel');
  },

});
