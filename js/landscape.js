const canvas = document.getElementById("landscape");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

// Set clear color to transparent
renderer.setClearColor(0xffffff, 0);

const dots = [];
const maxDots = 2000;
const initialDotsCount = 400;
const initialRadius = 0.008;
const phi = (1 + Math.sqrt(5)) / 2;

const createDot = () => {
    if (dots.length < maxDots) {
        const i = dots.length + 1;
        const theta = 2 * Math.PI * i / phi;
        const radius = initialRadius * Math.sqrt(i);
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);
        const z = 0;

        const dotGeometry = new THREE.SphereGeometry(0.005, 8, 8);
        const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xffaf1e });
        const dot = new THREE.Mesh(dotGeometry, dotMaterial);
        dot.position.set(x, y, z);
        scene.add(dot);
        dots.push(dot);
    } else {
        dots[dots.length % maxDots].position.set(0, 0, 0);
    }
};

const handleWindowResize = () => {
    const { clientWidth, clientHeight } = canvas;
    
    // Update the camera's aspect ratio
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();

    // Set the renderer's size to match the CSS size
    renderer.setSize(clientWidth, clientHeight);
};

window.addEventListener("resize", handleWindowResize);

// Set initial camera position and look at the scene center
camera.position.set(0, 0, 1);
camera.lookAt(0, 0, 0);

for (let i = 1; i <= initialDotsCount; i++) {
    createDot();
}

const animate = () => {
    requestAnimationFrame(animate);
    createDot();

    dots.forEach((dot) => {
        dot.visible = true;
    });

    renderer.render(scene, camera);
    scene.rotation.z += 0.0005;
};

handleWindowResize();
animate();
