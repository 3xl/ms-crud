'use strict';

const Rx = require('rx');
const socket = require('socket.io');

/**
 * 
 * 
 * @class Socket
 */
class Socket {

  /**
   * Creates an instance of Socket.
   * 
   * @param {Object} http
   * @param {Object} config 
   * 
   * @memberOf Socket
   */
  constructor(http, config) {
    this.io = http ? socket(http) : null;

    if(config) {
      this.setupPrivateEvents(config);
      this.setupGlobalEvents(config);
    }
  };

  /**
   * Init socket connection
   * 
   * @returns 
   * 
   * @memberOf Socket
   */
  init() {
    return Rx.Observable.fromEvent(this.io, 'connection')
  };

  /**
   * Setup private events handlers
   * 
   * @param {Object} config 
   * 
   * @memberOf Socket
   */
  setupPrivateEvents(config) {
    if(config.private && config.private.events.length) {
      config.private.events.forEach(event => {
        this.init()
          .flatMap(socket => Rx.Observable.fromEvent(socket, event.name))
          .flatMap(event.handler)
          .subscribe(
            () => {},
            error => console.log(error)
          )
      });
    }
  }

  /**
   * Setup global events handlers
   * 
   * @param {Object} config 
   * 
   * @memberOf Socket
   */
  setupGlobalEvents(config) {
    if(config.global && config.global.events.length) {
      config.global.events.forEach(event => {
        this.init()
          .flatMap(() => Rx.Observable.fromEvent(this.io, event.name))
          .flatMap(event.handler)
          .subscribe(
            () => {},
            error => console.log(error)
          )
      });
    }
  }
};

module.exports = Socket;
