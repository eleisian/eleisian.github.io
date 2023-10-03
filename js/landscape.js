const container = document.getElementById("landscape");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
container.appendChild(renderer.domElement);

// Set clear color to transparent
renderer.setClearColor(0x000000, 0);

const dots = [];
let dotIndex = 0;
const numDots = 2000; // Total number of dots you want
const initialDotsCount = 400; // Number of dots to render initially
const initialRadius = 0.008;
const phi = (1 + Math.sqrt(5)) / 2;

const createDot = () => {
    if (dotIndex < numDots) {
        const i = dotIndex + 1;
        const theta = 2 * Math.PI * i / phi;
        const radius = initialRadius * Math.sqrt(i);
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);
        const z = 0;

        const dotGeometry = new THREE.SphereGeometry(0.005, 8, 8);
        const dotMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const dot = new THREE.Mesh(dotGeometry, dotMaterial);
        dot.position.set(x, y, z);
        scene.add(dot);
        dots.push(dot);

        dotIndex++;
    }
};

const handleWindowResize = () => {
    const { clientWidth, clientHeight } = container;

    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(clientWidth, clientHeight);
};
window.addEventListener("resize", handleWindowResize);

camera.position.z = 1;

// Render the initial 400 dots
for (let i = 1; i <= initialDotsCount; i++) {
    createDot();
}

const animate = () => {
    requestAnimationFrame(animate);

    // Render only the dots that have been added so far
    for (let i = 0; i < dotIndex; i++) {
        dots[i].visible = true;
    }

    if (dotIndex < numDots) {
        // Add dots gradually during the animation
        createDot();
    }

    renderer.render(scene, camera);
};

handleWindowResize();
animate();
