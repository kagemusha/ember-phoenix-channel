import Ember from 'ember';
import layout from '../templates/components/socket-message-log';

export default Ember.Component.extend({
  layout,
  classNames: ['SocketLog'],

  didInsertElement() {
    this._super(...arguments);
    if (this.get('channelService')) {
      this.get('channelService').on('socketMessage',(msg)=> {
        const output = `<strong>${msg.kind}</strong>: ${msg.msg}<br/>${msg.data}`;
        this.push(output);
      });
    } else {
      const msg = "Need to specify a channel service to receive messages, i.e: " +
        "{{socket-message-log channelService=myChannel}}";
      this.push(msg);
    }
  },

  push(msg) {
    const logItem  = `<li>${msg}</li>`
    Ember.$('.SocketLogMessages').append(logItem);
  },

  actions: {
    pushMessage(msg) {
      this.push(msg);
    }
  }
});
