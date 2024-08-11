// Get the canvas element
const canvas = document.getElementById('threeCanvas');

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setSize(700, 200);
renderer.setClearColor(0x000000, 0); // Set clear color to transparent

// Create the line material
let material = new THREE.LineBasicMaterial({ color: 0x000000 }); // Start with black

// Set up the geometry for the line
const maxPoints = 420;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(maxPoints * 3);
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setDrawRange(0, 0);

// Create the line and add it to the scene
const line = new THREE.Line(geometry, material);
scene.add(line);

// Initialize variables for animation
let drawCount = 0;
let t = 0;
let currentDirection = new THREE.Vector3(1, 0, 0);
let currentPosition = new THREE.Vector3(0, 0, 0);

// Function to update the position of the line
function updatePosition() {
    t += 0.1;
    const noise = new THREE.Vector3(
        Math.sin(t * 2.1) + Math.cos(t * 3.3),
        Math.cos(t * 2.3) + Math.sin(t * 3.7),
        Math.sin(t * 2.7) + Math.cos(t * 3.2)
    ).normalize();
    currentDirection.lerp(noise, 0.1).normalize();
    const speed = 0.03 + 0.02 * Math.sin(t * 4.3);
    const movement = currentDirection.clone().multiplyScalar(speed);
    currentPosition.add(movement);
    const bound = 0.9;
    if (Math.abs(currentPosition.x) > bound) {
        currentPosition.x = Math.sign(currentPosition.x) * bound;
        currentDirection.x *= -0.8;
    }
    if (Math.abs(currentPosition.y) > bound) {
        currentPosition.y = Math.sign(currentPosition.y) * bound;
        currentDirection.y *= -0.8;
    }
    if (Math.abs(currentPosition.z) > bound) {
        currentPosition.z = Math.sign(currentPosition.z) * bound;
        currentDirection.z *= -0.8;
    }
    return currentPosition.clone();
}

// Set camera position
camera.position.z = 3;

// Animation function
function animate() {
    requestAnimationFrame(animate);
    const positions = line.geometry.attributes.position.array;
    const point = updatePosition();
    if (drawCount < maxPoints) {
        positions[drawCount * 3] = point.x;
        positions[drawCount * 3 + 1] = point.y;
        positions[drawCount * 3 + 2] = point.z;
        drawCount++;
        line.geometry.setDrawRange(0, drawCount);
    } else {
        for (let i = 0; i < maxPoints - 1; i++) {
            positions[i * 3] = positions[(i + 1) * 3];
            positions[i * 3 + 1] = positions[(i + 1) * 3 + 1];
            positions[i * 3 + 2] = positions[(i + 1) * 3 + 2];
        }
        positions[(maxPoints - 1) * 3] = point.x;
        positions[(maxPoints - 1) * 3 + 1] = point.y;
        positions[(maxPoints - 1) * 3 + 2] = point.z;
    }
    line.geometry.attributes.position.needsUpdate = true;
    line.rotation.x += 0.0001;
    line.rotation.y += 0.0001;
    renderer.render(scene, camera);
}

// Start the animation
animate();

// Handle window resizing
function onWindowResize() {
    camera.aspect = 1;
    camera.updateProjectionMatrix();
    renderer.setSize(700, 200);
}
window.addEventListener('resize', onWindowResize, false);

