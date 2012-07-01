
var EventEmitter = require('events');

function World() {
  EventEmitter.call(this);
  this.gadgets = {};
}

World.prototype.__proto__ = EventEmitter.prototype;
