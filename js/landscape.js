// Initialize Three.js scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a wireframe material
const material = new THREE.MeshBasicMaterial({ wireframe: true, color: 0x00ff00 });

// Create a grid of vertices for the landscape
const gridSize = 10;
const geometry = new THREE.PlaneGeometry(gridSize, gridSize, 50, 50);

// Manipulate the vertices for a landscape effect
for (let i = 0; i < geometry.vertices.length; i++) {
    const vertex = geometry.vertices[i];
    vertex.z = Math.random() * 2;
}

// Create a mesh from the geometry and material
const wireframe = new THREE.Mesh(geometry, material);
scene.add(wireframe);

// Position the camera
camera.position.z = 5;

// Add animation
const animate = () => {
    requestAnimationFrame(animate);
    wireframe.rotation.x += 0.005;
    wireframe.rotation.y += 0.005;
    renderer.render(scene, camera);
};

// Handle window resize
window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(newWidth, newHeight);
});

animate();
