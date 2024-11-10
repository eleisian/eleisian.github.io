function createGlobe() {
    // Get the canvas and set its size
    const canvas = document.getElementById('globeCanvas');
    const width = 150; // Match the profile pic width
    const height = 150; // Match the profile pic height
    
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        alpha: true, // Make background transparent
        antialias: true 
    });
    
    renderer.setSize(width, height);
    
    // Create sphere geometry
    const geometry = new THREE.SphereGeometry(2, 64, 64); // Increased segments for smoother sphere
    const texture = new THREE.TextureLoader().load('./assets/neptune_texture.png');
    const material = new THREE.MeshPhongMaterial({
        map: texture,
        shininess: 25,
        specular: new THREE.Color(0x2d4ea3), // Add blue-ish specular highlights
        bumpScale: 0.05
    });

    // Add atmosphere with more pronounced blue glow
    const atmosphereGeometry = new THREE.SphereGeometry(2.1, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.BackSide,
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec3 vNormal;
            void main() {
                float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
                gl_FragColor = vec4(0.1, 0.5, 1.0, intensity * 0.5);
            }
        `
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Add rings
    const ringGeometry = new THREE.RingGeometry(3, 4, 64);
    const ringTexture = new THREE.TextureLoader().load('./assets/ring_texture.jpg');
    const ringMaterial = new THREE.MeshBasicMaterial({
        map: ringTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
    });
    const rings = new THREE.Mesh(ringGeometry, ringMaterial);
    rings.rotation.x = Math.PI / 2;
    scene.add(rings);
    
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);
    
    // Adjust lights for better blue marble effect
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Reduced ambient light
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1.5); // Increased intensity
    pointLight.position.set(5, 3, 5);
    scene.add(pointLight);

    // Add a subtle blue point light on the opposite side
    const blueLight = new THREE.PointLight(0x0077ff, 0.5);
    blueLight.position.set(-5, -3, -5);
    scene.add(blueLight);
    
    // Position camera
    camera.position.z = 4; // Changed from 4 to better see the rings and atmosphere
    
    // Add controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2;
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    
    animate();
}

// Initialize globe when the page loads
window.addEventListener('load', createGlobe);