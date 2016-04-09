import Ember from 'ember';
import {Socket} from 'phoenix_js';

export default Ember.Service.extend({
  socket: null,
  host: "ws:/localhost:4000/socket",
  channels: {},

  getChannel(name) {
    return this.get('channels')[name];
  },

  connect(host, options) {
    if (this.get('socket')) {
      return;
    };

    host = host || this.get('host');
    let socket = new Socket(host, {
      logger: ((kind, msg, data) => {
        console.log(`${kind}: ${msg}`, data)
      })
    });

    socket.connect(options);

    socket.onOpen(ev => console.log("OPEN", ev))
    socket.onError(ev => console.log("ERROR", ev))
    socket.onClose(e => console.log("CLOSE", e))
    this.set('socket', socket);
  },

  joinChannel(name) {
    const socket = this.get('socket')
    const channel = socket.channel(name, {});
    this.get('channels')[name] = channel

    channel.join().receive("ignore", () => console.log(`Channel ${name}: auth error`))
      .receive("ok", () => console.log(`Joined channel ${name}`))
      .after(10000, () => console.log(`Channel ${name} Connection interruption`))
    channel.onError(e => console.log(`Something went wrong (channel: ${name}`, e))
    channel.onClose(e => console.log(`Closed channel ${name}`, e))
  },

  setChannelCallback(channelName, topic, callback) {
    const channel = this.getChannel(channelName)
    channel.on(topic, msg => {
      callback(msg);
    })
  },

});
