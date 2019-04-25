/******************************************
 *  Author : Author   
 *  Created On : Mon Mar 25 2019
 *  File : sfere.js
 *******************************************/

 function Sphere(radius, width, height, texture) {
    this.clock = new THREE.Clock();
    this.move = this.move.bind(this);
    this.moveTo = this.moveTo.bind(this);
    this.rotate = this.rotate.bind(this);
    this.followMouse = this.followMouse.bind(this);
    this.randomMove = this.randomMove.bind(this);
    this.randomRotate = this.randomRotate.bind(this);
    this.bounce = this.bounce.bind(this);
    this.orbit = this.orbit.bind(this);
    
    var materialBasic = new THREE.MeshNormalMaterial();
    var materiaTexture = new THREE.MeshBasicMaterial({ map: texture });
    
    var geometry = new THREE.SphereGeometry(radius, width, height, 0, Math.PI * 2, 0, Math.PI * 2);
    var material = texture ? materiaTexture : materialBasic;

    this.mesh = new THREE.Mesh(geometry, material);
    
    return this;
 }

Sphere.prototype = {
  move: function(x, y, z) {
    this.mesh.position.x += x || 0;
    this.mesh.position.y += y || 0;
    this.mesh.position.z += z || 0;

  },

  moveTo: function(x, y, z) {
      this.mesh.position.x = x || this.mesh.position.x;
      this.mesh.position.y = y || this.mesh.position.y;
      this.mesh.position.z = z || this.mesh.position.z;
  },

  rotate: function (x, y, z) {
    this.mesh.rotation.x += x || 0;
    this.mesh.rotation.y += y || 0;
    this.mesh.rotation.z += z || 0;
  },

  bounce: function (velocityX, velocityY, velocityZ) {
    boundery = this.mesh.position.z > 0 ? 0.5 / this.mesh.position.z : 0.5 * -(this.mesh.position.z);
    x = velocityX;
    y = velocityY;
    z = velocityZ; // for now ignore

    if (this.mesh.position.x < -boundery || this.mesh.position.x > boundery) {
      x = -x;
    }
    if (this.mesh.position.y < -boundery || this.mesh.position.y > boundery) {
      y = -y;
    }
    if (this.mesh.position.z < -100 || this.mesh.position.z > 100) {
      z = -z;
    }

    this.move(x, y, z);

    return { x: x, y: y, z: z };
  },

  followMouse: function (e) {

    this.moveTo(
      -((((window.innerWidth / 2) / e.clientX) - 1)).toFixed(2),
      ((((window.innerHeight / 2) / e.clientY) - 1)).toFixed(2),
      -(((((window.innerHeight / 2) / e.clientY) - 1)).toFixed(2))
    );
  },

  randomMove: function() {
    var x, y, z;
    z = _.random(-0.002, 0.2);
    x = _.random(-0.002, 0.002);
    y = _.random(-0.002, 0.002);

    var internalMove = function() {
      requestAnimationFrame(internalMove);

      var movement = this.bounce(x, y, z);
      x = movement.x;
      y = movement.y;
      z = movement.z;
    }.bind(this);

    internalMove();
  },

  randomRotate: function (s) {
    var internalRotate = function () {
      requestAnimationFrame(internalRotate);
      var speed = s || 0.1;
      var rotate = this.clock.getDelta() * speed;
      
      this.rotate(0, rotate);
    }.bind(this);

    internalRotate();
  },

  orbit: function(speed) {
    requestAnimationFrame();
    // this.move()0.1;
    this.orbit(speed);
  }
};