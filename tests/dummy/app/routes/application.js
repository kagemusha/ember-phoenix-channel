import Ember from 'ember';

export default Ember.Route.extend({
  channelService: Ember.inject.service(),

  beforeModel() {
    const channelService = this.get('channelService');
    channelService.joinChannel("game:waiting-room");
  },

});
