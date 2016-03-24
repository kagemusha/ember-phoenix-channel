import Ember from 'ember';
import {Socket, LongPoller} from 'ember-phoenix-channel/util/phoenix';

export default Ember.Service.extend({
  channel: null,

  init(){
    console.log(`initing channel!!!!!!`);
    let socket = new Socket("ws:/localhost:4000/socket", {
      logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) })
    });

    socket.connect({user_id: "123"})

    socket.onOpen( ev => console.log("OPEN", ev) )
    socket.onError( ev => console.log("ERROR", ev) )
    socket.onClose( e => console.log("CLOSE", e))

    let channel = socket.channel("rooms:lobby", {});
    this.set('channel', channel);

    channel.join().receive("ignore", () => console.log("auth error"))
      .receive("ok", () => console.log("join ok"))
      .after(10000, () => console.log("Connection interruption"))
    channel.onError(e => console.log("something went wrong", e))
    channel.onClose(e => console.log("channel closed", e))

    channel.on("new:msg", msg => {
      this.newMsgReceived(msg);
    }),

    channel.on("user:entered", msg => {
      this.userEntered(msg);
    })
  },

  newMsgReceived(msg) {
    console.log(`new msg`, msg);
  },

  userEntered(msg) {
    console.log(`user entered`, msg);
  }

});
