// Get the canvas element
const canvas = document.getElementById('threeCanvas');

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const width = 450;
const height = 100;
const camera = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setSize(width, height);
renderer.setClearColor(0x000000, 0); // Transparent background

// Grid settings
const cellSize = 25; // Fixed cell size
const gridWidth = Math.floor(width / cellSize);
const gridHeight = Math.floor(height / cellSize);

// ASCII characters to use
const asciiChars = ['·', ':', '+', '×', '▢', '▣', '◯', '◉', '█'];

// Create canvas for sprite texture
const charCanvas = document.createElement('canvas');
charCanvas.width = 64;
charCanvas.height = 64;
const charCtx = charCanvas.getContext('2d');

// Custom color palettes
const lightModePalette = [
    0x8ecae6, // Light Blue
    0x219ebc, // Teal
    0x023047, // Dark Blue
    0xffb703, // Yellow
    0xfb8500  // Orange
];

const darkModePalette = [
    0x390099, // Deep Purple
    0x9e0059, // Magenta
    0xff0054, // Pink
    0xff5400, // Orange
    0xffbd00  // Yellow
];

let currentPalette = lightModePalette;

// Grid class
class Grid {
    constructor() {
        this.cells = [];
        for (let x = 0; x < gridWidth; x++) {
            for (let y = 0; y < gridHeight; y++) {
                const cell = {
                    sprite: this.createSprite(asciiChars[0], x, y),
                    age: 0,
                    maxAge: 100 + Math.random() * 200,
                    colorIndex: Math.floor(Math.random() * currentPalette.length)
                };
                this.cells.push(cell);
                scene.add(cell.sprite);
            }
        }
    }

    createSprite(char, x, y) {
        charCtx.fillStyle = 'white';
        charCtx.fillRect(0, 0, 64, 64);
        charCtx.fillStyle = 'black';
        charCtx.font = '48px Arial';
        charCtx.textAlign = 'center';
        charCtx.textBaseline = 'middle';
        charCtx.fillText(char, 32, 32);

        const texture = new THREE.Texture(charCanvas);
        texture.needsUpdate = true;
        texture.userData = { char: char }; // Store the character for later use

        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(cellSize, cellSize, 1);
        sprite.position.set(
            (x - gridWidth / 2 + 0.5) * cellSize,
            (y - gridHeight / 2 + 0.5) * cellSize,
            0
        );
        return sprite;
    }

    updateCell(cell) {
        cell.age++;
        if (cell.age > cell.maxAge) {
            const newChar = asciiChars[Math.floor(Math.random() * asciiChars.length)];
            const x = Math.floor((cell.sprite.position.x + width/2) / cellSize);
            const y = Math.floor((cell.sprite.position.y + height/2) / cellSize);
            scene.remove(cell.sprite);
            cell.sprite = this.createSprite(newChar, x, y);
            scene.add(cell.sprite);
            cell.age = 0;
            cell.maxAge = 100 + Math.random() * 200;
            cell.colorIndex = (cell.colorIndex + 1) % currentPalette.length;
        }

        // Change color based on age and palette
        const t = cell.age / cell.maxAge;
        const color = new THREE.Color(currentPalette[cell.colorIndex]);
        color.multiplyScalar(0.3 + t * 0.7); // Adjust brightness based on age
        cell.sprite.material.color = color;
    }

    update() {
        this.cells.forEach(cell => this.updateCell(cell));
    }
}

// Create grid
const grid = new Grid();

// Set camera position
camera.position.z = 10;

// Animation function
function animate() {
    requestAnimationFrame(animate);
    grid.update();
    renderer.render(scene, camera);
}

// Start the animation
animate();

// Handle window resizing
function onWindowResize() {
    renderer.setSize(width, height);
}
window.addEventListener('resize', onWindowResize, false);

// Function to update colors based on dark mode
function updateColors(isDarkMode) {
    currentPalette = isDarkMode ? darkModePalette : lightModePalette;
    
    grid.cells.forEach(cell => {
        const texture = cell.sprite.material.map;
        charCtx.fillStyle = isDarkMode ? 'black' : 'white';
        charCtx.fillRect(0, 0, 64, 64);
        charCtx.fillStyle = isDarkMode ? 'white' : 'black';
        charCtx.font = '48px Arial';
        charCtx.textAlign = 'center';
        charCtx.textBaseline = 'middle';
        charCtx.fillText(texture.userData.char, 32, 32);
        texture.needsUpdate = true;

        // Reset cell age to trigger color update
        cell.age = 0;
    });
}

// Expose updateColors function to global scope
window.updateThreeJsColors = updateColors;