/******************************************
 *  Author : Author   
 *  Created On : Mon Mar 25 2019
 *  File : sfere.js
 *******************************************/

 function Group() {
   this.clock = new THREE.Clock();
   this.move = this.move.bind(this);
   this.followMouse = this.followMouse.bind(this);
   this.randomMove = this.randomMove.bind(this);
   this.bounce = this.bounce.bind(this);

    this.object = new THREE.Group();
    
    return this;
 }

 Group.prototype = {
    move: function(x, y, z) {
      this.object.position.x += x;
      this.object.position.y += y;
      this.object.position.z += z;
   },

   moveTo: function(x, y, z) {
      this.object.position.x = x;
      this.object.position.y = y;
      this.object.position.z = z;
   },

    bounce: function (x, y, z) {
      boundery = this.object.position.z > 0 ? 0.5 / this.object.position.z : 0.5 * -(this.object.position.z);

      if (this.object.position.x < -boundery || this.object.position.x > boundery) {
        x = -x;
      }
      if (this.object.position.y < -boundery || this.object.position.y > boundery) {
        y = -y;
      }

      this.move(x, y, z);

      return { x: x, y: y, z: z };
    },

  followMouse: function (e) {

    this.moveTo(
      parseFloat(-(((window.innerWidth / 2) / e.clientX) - 1).toFixed(2)),
      parseFloat((((window.innerHeight / 2) / e.clientY) - 1).toFixed(2)),
      parseFloat(-((((window.innerHeight / 2) / e.clientY) - 1).toFixed(2)))
    );
  },

  randomMove: function() {
    var x, y, z;
    z = 0;
    x = _.random(-0.002, 0.002);
    y = _.random(-0.002, 0.002);

    var internalMove = function() {
      var position = this.bounce(x, y, z);
      x = position.x;
      y = position.y;
      z = position.z;
    }.bind(this);

    internalMove();
  },

  randomRotate: function(r) {
    this.object.rotation.y += this.clock.getDelta() * 0.1;
  }
 };