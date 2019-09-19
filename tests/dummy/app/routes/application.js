import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  channelService: service(),

  beforeModel() {
    const channelService = this.get('channelService');
    channelService.connect({user_id: "123"});
    channelService.joinChannel("game:waiting-room");
  },

});
