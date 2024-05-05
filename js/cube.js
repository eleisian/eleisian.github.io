const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("threeCanvas"), alpha: true });

renderer.setSize(200, 200);

// Create the outer wireframe cube
const outerCubeGeometry = new THREE.BoxGeometry();
const outerEdges = new THREE.EdgesGeometry(outerCubeGeometry);
const material = new THREE.LineBasicMaterial({ color: 0x000000 });
const outerWireframe = new THREE.LineSegments(outerEdges, material);
scene.add(outerWireframe);

// Create the inner wireframe cube
const innerCubeGeometry = new THREE.BoxGeometry(2, 2, 2);
const innerEdges = new THREE.EdgesGeometry(innerCubeGeometry);
const innerWireframe = new THREE.LineSegments(innerEdges, material);
scene.add(innerWireframe);

// Set camera position
camera.position.z = 5;

// Position the inner cube inside the outer cube
innerWireframe.position.set(0, 0, 0); // Adjust the position as needed

// Render the scene
const animate = function () {
    requestAnimationFrame(animate);
    outerWireframe.rotation.y += 0.0088;
    innerWireframe.rotation.y -= 0.02; // Rotate the inner cube in the opposite direction
    renderer.render(scene, camera);
};

animate();