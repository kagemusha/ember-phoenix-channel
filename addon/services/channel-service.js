import { isBlank } from '@ember/utils';
import { assert } from '@ember/debug';
import { Promise as EmberPromise } from 'rsvp';
import Evented from '@ember/object/evented';
import Service from '@ember/service';
import Ember from 'ember';
import { Socket } from '../phoenix';

const { log } = Ember.Logger;

export default Service.extend(Evented, {
  socket:               null,
  host:                 "ws:/localhost:4000/socket",
  channels:             undefined,
  channelTopicHandlers: undefined,

  init() {
    this._super(...arguments);

    this.channels = {};
    this.channelTopicHandlers = [];
  },

  getChannel(name) {
    return this.get('channels')[name];
  },

  connect(host, options) {
    let socket = this.get('socket');
    if (socket) {
      return new EmberPromise(resolve=> { resolve(socket); });
    }

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
    return new EmberPromise((resolve, reject) => {

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
      return new EmberPromise(resolve => { resolve(channel) });
    }

    const socket = this.get('socket');
    assert('You must connect to a socket before joining a channel (call channelService.connect(..)', socket);

    this.set('name', name);
    let done = false;
    return new EmberPromise((resolve, reject)=> {
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
    });
  },

  loadTopicHandlers(channelType, channel) {
    const channelHandlers = this.get('channelTopicHandlers');
    const topicHandlers = channelHandlers && channelHandlers[channelType];
    if (isBlank(topicHandlers) || isBlank(channel)){
      return;
    }
    Object.keys(topicHandlers).forEach((topic) => {
      channel.on(topic, (response)=> {
        topicHandlers[topic].call(this, response);
      });
    });
  }
});
