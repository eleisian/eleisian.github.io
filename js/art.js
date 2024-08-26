// Get the canvas element
const canvas = document.getElementById('threeCanvas');

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
let width, height;

// Function to set dimensions based on screen size
function setDimensions() {
    if (window.innerWidth <= 768) { // Mobile breakpoint
        width = window.innerWidth;
        height = 100; // Smaller height for mobile
    } else {
        width = 450;
        height = 100;
    }
}

setDimensions();

const camera = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setSize(width, height);
renderer.setClearColor(0x000000, 0); // Transparent background

// Grid settings
const cellSize = 25; // Fixed cell size
let gridWidth, gridHeight;

// Function to update grid dimensions
function updateGridDimensions() {
    gridWidth = Math.floor(width / cellSize);
    gridHeight = Math.floor(height / cellSize);
}

updateGridDimensions();

// ASCII characters to use
const asciiChars = ['·', ':', '+', '×', '▢', '▣', '◯', '◉', '█'];

// Create canvas for sprite texture
const charCanvas = document.createElement('canvas');
charCanvas.width = 64;
charCanvas.height = 64;
const charCtx = charCanvas.getContext('2d');

// Water-inspired color palettes
const lightModePalette = [
    0x66C3FF, // Light Blue
    0x4A90E2, // Sky Blue
    0x00A3E0, // Azure
    0x7FCDFF, // Carolina Blue
    0x4DB6AC  // Teal
];

const darkModePalette = [
    0x1A5F7A, // Deep Sea Blue
    0x002F40, // Midnight Blue
    0x034F84, // Navy Blue
    0x465362, // Slate Gray
    0x1E3A5F  // Dark Cerulean
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
                    maxAge: 200 + Math.random() * 300,
                    colorIndex: Math.floor(Math.random() * currentPalette.length),
                    rhythm: Math.random() * Math.PI * 2 // For dancer-like rhythm
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
        texture.userData = { char: char };

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

    updateCell(cell, time) {
        cell.age++;
        
        // Dancer-like rhythm
        const rhythmFactor = (Math.sin(time * 0.001 + cell.rhythm) + 1) / 2;
        
        if (cell.age > cell.maxAge) {
            const newChar = asciiChars[Math.floor(Math.random() * asciiChars.length)];
            const x = Math.floor((cell.sprite.position.x + width/2) / cellSize);
            const y = Math.floor((cell.sprite.position.y + height/2) / cellSize);
            scene.remove(cell.sprite);
            cell.sprite = this.createSprite(newChar, x, y);
            scene.add(cell.sprite);
            cell.age = 0;
            cell.maxAge = 200 + Math.random() * 300;
            cell.colorIndex = (cell.colorIndex + 1) % currentPalette.length;
            cell.rhythm = Math.random() * Math.PI * 2;
        }

        // Change color based on age and rhythm
        const t = cell.age / cell.maxAge;
        const color = new THREE.Color(currentPalette[cell.colorIndex]);
        color.multiplyScalar(0.3 + rhythmFactor * 0.7);
        cell.sprite.material.color = color;

        // Occasionally change character based on rhythm
        if (Math.random() < 0.01 * rhythmFactor) {
            const texture = cell.sprite.material.map;
            const newChar = asciiChars[Math.floor(Math.random() * asciiChars.length)];
            charCtx.fillStyle = 'white';
            charCtx.fillRect(0, 0, 64, 64);
            charCtx.fillStyle = 'black';
            charCtx.font = '48px Arial';
            charCtx.textAlign = 'center';
            charCtx.textBaseline = 'middle';
            charCtx.fillText(newChar, 32, 32);
            texture.needsUpdate = true;
        }
    }

    update(time) {
        this.cells.forEach(cell => this.updateCell(cell, time));
    }
}

// Create grid
const grid = new Grid();

// Set camera position
camera.position.z = 10;

// Animation function
function animate(time) {
    requestAnimationFrame(animate);
    grid.update(time);
    renderer.render(scene, camera);
}

// Start the animation
animate();

// Handle window resizing
function onWindowResize() {
    setDimensions();
    updateGridDimensions();
    camera.left = -width / 2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = -height / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    
    // Recreate the grid with new dimensions
    scene.remove(...grid.cells.map(cell => cell.sprite));
    grid = new Grid();
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

        // Update cell color
        cell.colorIndex = Math.floor(Math.random() * currentPalette.length);
        const color = new THREE.Color(currentPalette[cell.colorIndex]);
        cell.sprite.material.color = color;
    });
}

// Expose updateColors function to global scope
window.updateThreeJsColors = updateColors;