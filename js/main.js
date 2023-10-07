const canvas = document.getElementById("animation");
const scene = new THREE.Scene();
const camera2 = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

// Set clear color to transparent
renderer.setClearColor(0xffffff, 0);

function init() {
  // Function to update the renderer size
  function updateRendererSize() {
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;
    renderer.setSize(canvasWidth, canvasHeight);
    camera2.aspect = canvasWidth / canvasHeight;
    camera2.updateProjectionMatrix();
  }

  // Initial setup
  updateRendererSize();

  // Listen for canvas resize events and update renderer size
  window.addEventListener('resize', updateRendererSize, false);

  const lineCount = 100;
  const linesGroup2 = new THREE.Group();
  scene.add(linesGroup2);

  const rotationSpeed = 0.005; // Adjusted rotation speed
  const movementSpeed = 0.01;
  const mouse = new THREE.Vector2();
  const mouseMoveThreshold = 5; // Adjusted threshold

  let previousMouseX = 0;
  let previousMouseY = 0;

  function createRandomLine() {
    const material = new THREE.LineBasicMaterial({ color: 0x000000 }); // Use numeric color value
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

  canvas.addEventListener('mousemove', (event) => {
    const currentMouseX = event.clientX - canvas.getBoundingClientRect().left;
    const currentMouseY = event.clientY - canvas.getBoundingClientRect().top;

    // Calculate the distance moved
    const deltaX = currentMouseX - previousMouseX;
    const deltaY = currentMouseY - previousMouseY;

    // Check if the mouse has moved the threshold distance
    if (Math.abs(deltaX) > mouseMoveThreshold || Math.abs(deltaY) > mouseMoveThreshold) {
      mouse.x = (currentMouseX / canvas.clientWidth) * 2 - 1; // Normalize mouse position
      mouse.y = -(currentMouseY / canvas.clientHeight) * 2 + 1;

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
    scene.rotation.x += (mouse.y - scene.rotation.x) * rotationSpeed;
    scene.rotation.y += (mouse.x - scene.rotation.y) * rotationSpeed;

    // Move the camera along the z-axis to create a sense of traversal
    camera2.position.z -= movementSpeed;

    // Reset the camera position when it goes too far
    if (camera2.position.z < 0) {
      camera2.position.z = 10;
    }

    renderer.render(scene, camera2);
  }

  animateScene2();
}

init();
