// Set up scene
var scene = new THREE.Scene();

// Set up camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;

// Set up renderer with alpha: true for a clear background
var renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('landscape'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Function to create a planet with its orbit
function createPlanet(radius, color, orbitRadiusX, orbitRadiusY, orbitSegments, orbitSpeed, zAngle) {
  // Orbit
  var orbitGeometry = new THREE.EllipseCurve(0, 0, orbitRadiusX, orbitRadiusY, 0, 2 * Math.PI, false, zAngle);
  var orbitPoints = orbitGeometry.getPoints(orbitSegments);
  var orbitMaterial = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.5 });

  var orbit = new THREE.Line(new THREE.BufferGeometry().setFromPoints(orbitPoints), orbitMaterial);
  scene.add(orbit);

  // Planet
  var planetGeometry = new THREE.CircleGeometry(radius, 32);
  var planetMaterial = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });

  var planet = new THREE.Mesh(planetGeometry, planetMaterial);
  scene.add(planet);

  return { orbit: orbit, planet: planet, orbitRadiusX: orbitRadiusX, orbitRadiusY: orbitRadiusY, angle: 0, orbitSpeed: orbitSpeed, zAngle: zAngle };
}

// Create individual planets with orbits
var planets = [
  createPlanet(0.2, 0x00FF00, 3, 2, 64, 0.01, 0.1),
  createPlanet(0.3, 0xFF0000, 5, 4, 64, 0.008, 0.2),
  createPlanet(0.25, 0x0000FF, 7, 6, 64, 0.005, 0.3),
  createPlanet(0.35, 0xFFFF00, 9, 8, 64, 0.003, 0.4),
  createPlanet(0.18, 0xFF00FF, 11, 10, 64, 0.002, 0.5)
];

// Set up animation
function animate() {
  requestAnimationFrame(animate);

  // Rotate the planets around the sun
  planets.forEach((planet) => {
    planet.angle += planet.orbitSpeed; // Adjusted to ensure different speeds

    // Calculate the position based on the ellipse equation
    var x = planet.orbitRadiusX * Math.cos(planet.angle);
    var y = planet.orbitRadiusY * Math.sin(planet.angle);

    // Apply rotation to the orbit
    planet.orbit.rotation.x += 0.01;
    planet.orbit.rotation.y += 0.01;
    planet.orbit.rotation.z += 0.01;

    // Set the position of the planet along the ellipse
    planet.planet.position.x = x;
    planet.planet.position.y = y;

    // Reset z position to zero
    planet.planet.position.z = 0;
  });

  renderer.render(scene, camera);
}

// Initial setup
planets.forEach((planet) => {
  // Randomize initial rotations for orbits
  planet.orbit.rotation.x = Math.random() * Math.PI * 2;
  planet.orbit.rotation.y = Math.random() * Math.PI * 2;
  planet.orbit.rotation.z = Math.random() * Math.PI * 2;

  scene.add(planet.orbit);
  scene.add(planet.planet);
});

animate();
