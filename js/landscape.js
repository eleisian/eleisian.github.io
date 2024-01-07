// Set up scene
var scene = new THREE.Scene();

// Set up camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;

// Set up renderer with alpha: true for a clear background
var renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('landscape'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Function to create a planet with its orbit
function Planet(radius, color, orbitRadiusX, orbitRadiusY, orbitSegments, orbitSpeed, zAngle) {
  // Orbit
  this.orbitGeometry = new THREE.EllipseCurve(0, 0, orbitRadiusX, orbitRadiusY, 0, 2 * Math.PI, false, zAngle);
  this.orbitPoints = this.orbitGeometry.getPoints(orbitSegments);
  this.orbitMaterial = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.5 });

  this.orbit = new THREE.Line(new THREE.BufferGeometry().setFromPoints(this.orbitPoints), this.orbitMaterial);

  // Planet
  this.planetGeometry = new THREE.SphereGeometry(radius, 32);
  this.planetMaterial = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });

  this.planet = new THREE.Mesh(this.planetGeometry, this.planetMaterial);

  // Initial setup for orbit rotation
  this.orbit.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);

  scene.add(this.orbit);
  scene.add(this.planet);

  this.orbitRadiusX = orbitRadiusX;
  this.orbitRadiusY = orbitRadiusY;
  this.orbitSpeed = orbitSpeed;
  this.zAngle = zAngle;
  this.angle = Math.random() * Math.PI * 2; // Random initial angle
}

// Create individual planets with orbits
var planets = [
  new Planet(0.2, 0x00FF00, 3, 2, 64, 0.01, 0.1),
  new Planet(0.3, 0xFF0000, 5, 4, 64, 0.008, 0.2),
  new Planet(0.25, 0x0000FF, 7, 6, 64, 0.005, 0.3),
  new Planet(0.35, 0xFFFF00, 9, 8, 64, 0.003, 0.4),
  new Planet(0.18, 0xFF00FF, 11, 10, 64, 0.002, 0.5)
];

// Event listener for mousemove
document.addEventListener('mousemove', function(event) {
  // Calculate the rotation based on the mouse position
  var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  
  scene.rotation.y = mouseX * Math.PI;
});

// Set up animation
function animate() {
  requestAnimationFrame(animate);

  // Rotate the planets around the sun
  planets.forEach((planet) => {
    planet.angle += planet.orbitSpeed;

    // Calculate the position based on the ellipse equation
    var x = planet.orbitRadiusX * Math.cos(planet.angle);
    var y = planet.orbitRadiusY * Math.sin(planet.angle);

    // Set the position of the planet along the ellipse
    planet.planet.position.set(x, y, 0);

    // Apply rotation to the orbit
    planet.orbit.rotation.x += 0.01;
    planet.orbit.rotation.y += 0.01;
    planet.orbit.rotation.z += 0.01;
  });

  renderer.render(scene, camera);
}

// Initial setup
animate();
