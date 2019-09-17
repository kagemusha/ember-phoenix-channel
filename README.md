# Ember-phoenix-channel [![Build Status](https://travis-ci.org/kagemusha/ember-phoenix-channel.svg?branch=master)](https://travis-ci.org/kagemusha/ember-phoenix-channel)

A wrapper for the Phoenix Channels JavaScript client

## Installation

* `git clone` this repository
* `npm install`

## Running

You can see example usage in an implementation of the classic game [Timeline](https://github.com/kagemusha/timeline).

You can test this against Chris McCord's [Phoenix chat example project](https://github.com/chrismccord/phoenix_chat_example).

* Start the Phoenix chat example server as described in the repo
* Start your Ember server with `ember server`
* Open your browser console then visit your app at http://localhost:4200
* You should see the channel communication in the console

## Installation

      your-ember-app> ember install ember-phoenix-channel

## Usage

### Basic Usage

    const channelService = this.get('channelService');
    channelService.connect().then(()=> {
      return channelService.joinChannel('someChannel', 'someTopicType'); #see below for info about topic type
    }).then((channel) => {
       ...
    });

    // some up a handler
    channel.on(someTopic, (response)=> {
      // do something
    });

    // push a message to the channel
    channel.push("some-event", {payload: somePayload}).receive("error", e=> console.log(e));

### Setting up Handlers

To organize your channel responses in a convenient manner, you can subclass the channel service and override the

    # app/services/my-channel-service.js

    import Ember from 'ember';
    import ChannelService from 'ember-phoenix-channel/services/channel-service';

    const { computed, inject } = Ember;

    export default ChannelService.extend({
      channelTopicHandlers: {

        someTopicType: {
          "some-event1": function(message) {
            ...
          },
          "some-event2": function(someObject) {
            this.get('store').pushPayload(someObject);
            ...
          },
        }
      }
    }

  When you join the channel, add the topic to attach the appropriate handlers. For example to use the handlers above:

       const channel = channelService.joinChannel(`game:${gameId}`, "someTopicType");


## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
