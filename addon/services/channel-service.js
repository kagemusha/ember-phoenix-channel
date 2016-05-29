import Ember from 'ember';
import {Socket} from '../phoenix';

const { log } = Ember.Logger;

export default Ember.Service.extend(Ember.Evented, {
  socket: null,
  host: "ws:/localhost:4000/socket",
  channels: {},
  channelTopicHandlers: [],

  getChannel(name) {
    return this.get('channels')[name];
  },

  connect(host, options) {
    let socket = this.get('socket');
    if (socket) {
      return new Ember.RSVP.Promise(resolve=> { resolve(socket); });
    };

    host = host || this.get('host');
    socket = new Socket(host, {
      logger: ((kind, msg, data) => {
        let msgData = "";
        try {
          msgData = JSON.stringify(data)
        } catch(e) {
          //wasn't json -- ignore
        }
        this.trigger('socketMessage', {kind: kind, msg: msg, data: msgData });
      })
    });
    return new Ember.RSVP.Promise((resolve, reject) => {

      socket.connect(options);

      socket.onOpen(ev => {
        log("OPENER", ev);
        resolve(ev);
        this.set('socket', socket);
      });
      socket.onError(ev => {
        log("ERROR", ev)
        reject(ev);
      });
      socket.onClose(e => log("CLOSE", e))
    });
  },

  joinChannel(name, type) {
    let channel = this.get('channels')[name];
    if (channel) {
      return new Ember.RSVP.Promise(resolve => { resolve(channel) });
    }

    const socket = this.get('socket');
    Ember.assert('You must connect to a socket before joining a channel (call channelService.connect(..)', socket);

    this.set('name', name);
    let done = false;
    return new Ember.RSVP.Promise((resolve, reject)=> {
      channel = socket.channel(name, {});
      channel.join().receive("ok", (response) => {
        if (done) {
          // for some reason receiving an extra ok on the channel join
          return;
        }
        done = true;
        this.get('channels')[name] = channel
        log(`Joined channel ${this.get('name')}`, response);
        channel.onError(e => log(`Something went wrong (channel: ${name}`, e))
        channel.onClose(e => log(`Closed channel ${name}`, e))
        this.loadTopicHandlers(type, channel);
        resolve(channel);
      }).receive("ignore", (error) => {
        log(`Channel ${name}: auth error`)
        reject(error);
      })
    })
  },

  loadTopicHandlers(channelType, channel) {
    const channelHandlers = this.get('channelTopicHandlers');
    const topicHandlers = channelHandlers && channelHandlers[channelType];
    if (Ember.isBlank(topicHandlers) || Ember.isBlank(channel)){
      return;
    }
    Object.keys(topicHandlers).forEach((topic) => {
      channel.on(topic, (response)=> {
        topicHandlers[topic].call(this, response);
      });
    });
  }
});
