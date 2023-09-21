const scene2 = new THREE.Scene();
const camera2 = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer2 = new THREE.WebGLRenderer({ alpha: true }); // Set alpha to true
const container = document.getElementById('animation-container');
let containerWidth, containerHeight;


function init() {
  container.appendChild(renderer2.domElement);

  // Function to update the renderer size
  function updateRendererSize() {
    containerWidth = container.clientWidth;
    containerHeight = container.clientHeight;
    renderer2.setSize(containerWidth, containerHeight);
    camera2.aspect = containerWidth / containerHeight;
    camera2.updateProjectionMatrix();
  }

  // Initial setup
  updateRendererSize();

  // Listen for window resize events and update renderer size
  window.addEventListener('resize', updateRendererSize, false);

  const lineCount = 100;
  const linesGroup2 = new THREE.Group();
  scene2.add(linesGroup2);

  const rotationSpeed = 0.099;
  const movementSpeed = 0.01;
  const mouse = new THREE.Vector2();
  const mouseMoveThreshold = 100;

  let previousMouseX = 0;
  let previousMouseY = 0;

  function createRandomLine() {
  const material = new THREE.LineBasicMaterial({ color: 0xffffff }); // Set color to white
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(6);

  positions.set([
    Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5,
    Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5
  ]);

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const line = new THREE.Line(geometry, material);
  linesGroup2.add(line);
}

// Initial line generation on website load
for (let i = 0; i < lineCount; i++) {
  createRandomLine();
}

document.addEventListener('mousemove', (event) => {
  const currentMouseX = event.clientX - renderer2.domElement.getBoundingClientRect().left;
  const currentMouseY = event.clientY - renderer2.domElement.getBoundingClientRect().top;

  // Calculate the distance moved
  const deltaX = currentMouseX - previousMouseX;
  const deltaY = currentMouseY - previousMouseY;

  // Check if the mouse has moved the threshold distance
  if (Math.abs(deltaX) > mouseMoveThreshold || Math.abs(deltaY) > mouseMoveThreshold) {
    mouse.x = (currentMouseX - 250) * 0.001;
    mouse.y = (currentMouseY - 250) * 0.001;

    // Clear previous lines and generate new ones on mouse movement
    linesGroup2.clear();
    for (let i = 0; i < lineCount; i++) {
      createRandomLine();
    }

    // Update previous mouse positions
    previousMouseX = currentMouseX;
    previousMouseY = currentMouseY;
  }
});

camera2.position.z = 10;

function animateScene2() {
  requestAnimationFrame(animateScene2);
  scene2.rotation.x += (mouse.y - scene2.rotation.x) * rotationSpeed;
  scene2.rotation.y += (mouse.x - scene2.rotation.y) * rotationSpeed;

  // Move the camera along the z-axis to create a sense of traversal
  camera2.position.z -= movementSpeed;

  // Reset the camera position when it goes too far
  if (camera2.position.z < 0) {
    camera2.position.z = 10;
  }

  renderer2.render(scene2, camera2);
}

animateScene2();
}
  
init();

   