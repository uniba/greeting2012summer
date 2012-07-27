
var duino = require('duino');

module.exports = Neck;

function Neck(pin, debug) {
  this.board = new duino.Board({ debug: true });
  this.servo = new duino.Servo({ board: this.board, pin: pin });
  this.move(90);  // set to front
}

Neck.prototype.move = function(val) {
  this.value = val;
  this.servo.write(val);
  return this;
};

Neck.prototype.right = function(diff) {
  var val = this.value + diff;
  this.move(val);
  return this;
};

Neck.prototype.left = function(diff) {
  var val = this.value - diff;
  this.move(val);
  return this;
};
