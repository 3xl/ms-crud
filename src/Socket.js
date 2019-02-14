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
    this.io = socket(http);
    
    /**
     * Init private events
     * 
     */
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
};

module.exports = Socket;
