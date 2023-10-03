import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const canvas = document.querySelector('canvas.webgl');
const frequency_samples = 128;
const ACTX = new AudioContext();
const ANALYSER = ACTX.createAnalyser();
ANALYSER.fftSize = 4 * frequency_samples;
ANALYSER.smoothingTimeConstant = 0.5;
const DATA = new Uint8Array(ANALYSER.frequencyBinCount);
const audioElement = document.getElementById("myAudio");
console.log(audioElement);

const SOURCE = ACTX.createMediaElementSource(audioElement);
SOURCE.connect(ACTX.destination);
SOURCE.connect(ANALYSER);

/*playPauseButton.addEventListener("click", () => {
  if (audioElement.paused) {
    audioElement.play();
  } else {
    audioElement.pause();
  }
});*/

audioElement.play();
let requestId;
let camera, scene, renderer;
let heights, mesh, line, wf;
let time_samples = 1200;
let n_vertices = (frequency_samples + 1) * (time_samples + 1);
let xsegments = time_samples;
let ysegments = frequency_samples;
let xsize = 40;
let ysize = 20;
let xhalfSize = xsize / 2;
let yhalfSize = ysize / 2;
let xsegmentSize = xsize / xsegments;
let ysegmentSize = ysize / ysegments;
var raycaster;
var targetMesh;
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
var mouse = new THREE.Vector2();
let controls;

const windowX = window.innerWidth / 2;
const windowY = window.innerHeight / 2;

init();

function init() {
  camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 180;
  camera.position.y = -10;

  const canvas = document.querySelector('canvas.webgl');

  raycaster = new THREE.Raycaster();
  //raycaster.setFromCamera(mouseX, camera);
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas
  });
  renderer.setClearColor(0x000000);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 45;
  controls.maxDistance = 45;
  controls.minPolarAngle = Math.PI / 2;
  controls.maxPolarAngle = Math.PI / 2;
  //controls.enableDamping = true;
  controls.enablePan = false;
  renderer.setSize(canvas.width, canvas.height);
  document.body.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);

  window.addEventListener('mousemove', onDocumentMouseMove);

  scene = new THREE.Scene();
  let geometry = new THREE.BufferGeometry();

  let indices = [];
  heights = [];
  let vertices = [];
  // number of time samples
  let ypow_max = Math.log(ysize);
  let ybase = Math.E;
  // generate vertices and color data for a simple grid geometry
  for (let i = 0; i <= xsegments; i++) {
    let x = (i * xsegmentSize) - xhalfSize;
    for (let j = 0; j <= ysegments; j++) {
      let powr = (ysegments - j) / ysegments * ypow_max;
      let y = -Math.pow(ybase, powr) + yhalfSize + 1;
      vertices.push(x, y, 0);
      heights.push(0);
    }
  }
  // generate indices (data for element array buffer)
  for (let i = 0; i < xsegments; i++) {
    for (let j = 0; j < ysegments; j++) {
      let a = i * (ysegments + 1) + (j + 1);
      let b = i * (ysegments + 1) + j;
      let c = (i + 1) * (ysegments + 1) + j;
      let d = (i + 1) * (ysegments + 1) + (j + 1);

      // generate two faces (triangles) per iteration
      indices.push(a, b, d); // face one
      indices.push(b, c, d); // face two
    }
  }
  var lut = [];
  //for (let n=0;n<256;n++) {
  //lut.push(new THREE.Vector3((string[n][0]*255-49)/206., (string[n][1]*255-19)/236., (string[n][2]*255-50)/190.));
  //} 
  heights = new Uint8Array(heights);
  //
  geometry.setIndex(indices);
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('displacement', new THREE.Uint8BufferAttribute(heights, 1));
  // geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
  var vShader = document.getElementById('vertexshader');
  var fShader = document.getElementById('fragmentshader');
 var uniforms = {
  vLut: { type: "v3v", value: lut.map(vec3 => new THREE.Vector3(vec3[0], vec3[1], vec3[2])) }
};


  let material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vShader.text,
    fragmentShader: fShader.text

  });
  mesh = new THREE.Mesh(geometry, material);
  //mesh.minRotation.y = 0;
  //mesh.maxRotation.y = Math.PI/4;
  //mesh.geometry.computeFaceNormals();
  mesh.geometry.computeVertexNormals();
  targetMesh = mesh;
  mesh.position.y = 10;
  //wf = new THREE.WireframeGeometry(mesh.geometry);
  //line = new THREE.LineSegments(wf,material);
  scene.add(mesh);
  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function animate() {
  requestId = requestAnimationFrame(animate);
  targetY = mouse.y * 0.05;
  targetX = mouse.x * 0.05;
  //var newRotationY = THREE.Math.lerp(mesh.rotation.y, 0, 0.1);
  //var newRotationX = THREE.Math.lerp(mesh.rotation.x, 0, 0.1);

  /* raycaster.setFromCamera( mouse, camera );
          var isIntersected = raycaster.intersectObject(mesh);
          if (isIntersected.length > 0) {
              console.log('Mesh clicked!')
              mesh.rotation.y += -targetX;
          }
  */

  if (Math.abs(camera.rotation.y) > Math.PI / 2) {
    controls.reset();
  }
  //mesh.rotation.y += -targetX;
  //mesh.rotation.x += -targetY;

  //mesh.rotation.y += targetY;
  render();
}

function render() {
  update_geometry();
  renderer.render(scene, camera);
}

function update_geometry() {
  ANALYSER.getByteFrequencyData(DATA);
  let start_val = frequency_samples + 1;
  let end_val = n_vertices - start_val;
  heights.copyWithin(0, start_val, n_vertices + 1);

  heights.set(DATA, end_val - start_val);
  mesh.geometry.setAttribute('displacement', new THREE.Uint8BufferAttribute(heights, 1));

  //wf = mesh.geometry;
  //line.geometry = wf; 
}
