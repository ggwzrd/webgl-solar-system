// environment
var camera, scene, renderer, hemiLight, dirLight, loader, clock;
// mesh
var geometry, material, mesh, group, texture;
// int
var stepX, stepY, stepZ, boundery, zoom, movementX, movementY;
// bool
var isGrabbing;
// array
var spheres;
// DOM element
var canvas, context, context2d, contextWebGL;

// initial state
stepX = 0.01;
stepY = 0.02;
zoom = 20;
backgroundSpheres = [];
movementX = 0;
movementY = 0;
var EARTH = planets[3];
var timer = null;

function moveCamera(e) {
  if (isGrabbing) return;

  clearTimeout(timer);
  if (!clock.running) clock.start();
  var zoomStep = 1;
  var rotateStep = 0.1;

  if (zoom > 1000) {
    zoomStep = 10;
  } else if (zoom > 720) {
    zoomStep = 4;
  } else if (zoom > 250) {
    zoomStep = 2;
    rotateStep = 0.2;
  }

  if (zoom > 20 || (zoom <= 20 && e.deltaY < 0)) {
    zoom += e.deltaY < 0 ? zoomStep : - zoomStep;
  }

  rotation = e.deltaY < 0 ? rotateStep : - rotateStep;

  if (
      (rotation < 0 && group.object.rotation.y <= 0)
      || (rotation > 0 && group.object.rotation.y >= 1.5)
      || (zoom > 720)
    ) {
    rotation = 0;
  }

  camera.position.z = zoom;
  group.object.rotation.y += clock.getDelta() * rotation;

  timer = setTimeout(function () {
    clock.stop();
  }, 250);
}

function rotateCamera(e) {
  if (!isGrabbing) return;
  
  
  var rotationX = 0;
  var rotationY = 0;
  
  if (Math.abs(e.movementY) > 0) {
    rotationX = e.movementY < 0 ? -0.01 : 0.01;
  }

  if (Math.abs(e.movementX) > 0) {
    rotationY = e.movementX < 0 ? -1 : 1;
  }  

  camera.rotation.y += clock.getDelta() * rotationY;  
  camera.rotation.x += clock.getDelta() * rotationX;
}

var createPlanet = function(index) {
  return (function (texture) {
    var planet = planets[index];
    var radius = planet.radius;
    var speed = 1 / planet.radius;
    var x, y, z;

    x = 0;
    // X = 0;
    y = 0;
    z = index <= 3 ? planet.distance - EARTH.distance - radius : planet.distance - EARTH.distance + radius;

    var sphere = new Sphere(radius, 50, 50, texture);
    scene.add(sphere.mesh);
    
    if (index !== 2) {
      sphere.moveTo(x, y, z);
    }

    if (index !== 0) {
      sphere.moveTo(x, y, z);
      sphere.rotate(0, 0, planet.rotation);
      // sphere.orbit(speed);
      sphere.randomRotate(speed);
    }
    group.object.add(sphere.mesh);
  });
};

// DOM modification & event listeners
document.addEventListener("mousemove", _.throttle(rotateCamera, 20));
document.addEventListener("touchmove", _.throttle(rotateCamera, 0.1));
document.addEventListener("mouseleave", _.throttle(handleRelease, 20));
document.addEventListener("mouseup", _.throttle(handleRelease, 20));
document.addEventListener("touchend", _.throttle(handleRelease, 20));
document.addEventListener("touchstart", _.throttle(handleGrab, 20));
document.addEventListener("mousedown", _.throttle(handleGrab, 20));
document.addEventListener("mousewheel", _.throttle(moveCamera, 0.1));

function init() {
  // camera
  clock = new THREE.Clock();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000000);
  camera.position.z = zoom;
  camera.position.y = movementY;
  camera.position.x = movementX;
  camera.rotation.y = 0;

  // scene

  scene = new THREE.Scene();
  scene.background = { color: 0x000000 };


  new THREE.TextureLoader().load("images/8320.jpg", function(texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set(0, 0);
    texture.repeat.set(2, 2);
    var sphere = new Sphere(100000, 50, 50, texture);
    scene.add(sphere.mesh);
  });
  
  
  // texture.repeat.set(4, 4);

  // scene.fog = new THREE.Fog(0xcccccc, 100, 1500);

  // lights
  hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 1000, 0);
  scene.add(hemiLight);
  dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(- 3000, 1000, - 1000);
  scene.add(dirLight);

  // sphere group
  group = new Group();

  for(var i = 0; i < textures.length; i++) {
    loader = new THREE.TextureLoader();
    // var randomIdx = _.random(0, textures.length);
    loader.load(textures[i], createPlanet(i));
  }

  scene.add(group.object);

  //
  canvas = document.createElement('canvas');
  contextWebGL = canvas.getContext('webgl2', { antialias: false });

  renderer = new THREE.WebGLRenderer({ canvas: canvas, context: contextWebGL });
  renderer.autoClear = false;
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  //

  var parameters = {
    format: THREE.RGBFormat,
    stencilBuffer: false
  };
  var size = renderer.getDrawingBufferSize( new THREE.Vector2() );
  var renderTarget = new THREE.WebGLMultisampleRenderTarget( size.width, size.height, parameters );
  var renderPass = new THREE.RenderPass( scene, camera );
  // var copyPass = new THREE.ShaderPass( THREE.CopyShader );
  // copyPass.renderToScreen = true;
  //
  composer = new THREE.EffectComposer( renderer, renderTarget );
  composer.addPass(renderPass);
  // composer.addPass(copyPass);
  group.object.rotation.y = 0;
  animate();
}

function animate() {

  requestAnimationFrame(animate);
  
  // if (isGrabbing) mainSphere.move();

  // camera.rotation.y += clock.getDelta() * 0.1;
  // group.object.rotation.y += clock.getDelta() * 0.1;
  // group.randomRotate();
  renderer.render(scene, camera);
}

function handleGrab() {
  isGrabbing = true;
  clock.start();
}
function handleRelease() {
  isGrabbing = false;
  clock.stop();
}