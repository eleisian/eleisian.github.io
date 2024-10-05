// Get the canvas element
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('threeCanvas');
    const ctx = canvas.getContext('2d');

    // Grid settings
    const cellSize = 25; // Fixed cell size

    // Function to calculate responsive width and height
    function calculateDimensions() {
        const isMobile = window.innerWidth < 600;
        const width = isMobile ? window.innerWidth * 0.9 : 550;
        const height = isMobile ? 2 * cellSize : 50;
        return { width, height };
    }

    // Initial dimensions
    let { width, height } = calculateDimensions();
    canvas.width = width;
    canvas.height = height;

    // Grid dimensions
    let gridWidth = Math.floor(width / cellSize);
    let gridHeight = Math.floor(height / cellSize);

    // ASCII characters to use
    const asciiChars = ['·', ':', '+', '×', '▢', '▣', '◯', '◉', '█'];

    // Water-inspired color palettes
    const lightModePalette = ['rgba(0, 0, 0, 1)']; // Fully opaque black for characters
    
    const darkModePalette = [
        'rgba(139, 0, 0, 1)',    // Dark Red
        'rgba(85, 107, 47, 1)',  // Dark Olive Green
        'rgba(70, 130, 180, 1)', // Steel Blue
        'rgba(205, 133, 63, 1)', // Peru
        'rgba(112, 128, 144, 1)' // Slate Gray
    ];

    let currentPalette = lightModePalette;

    // Grid class
    class Grid {
        constructor() {
            this.cells = [];
            for (let x = 0; x < gridWidth; x++) {
                for (let y = 0; y < gridHeight; y++) {
                    const cell = {
                        char: asciiChars[0],
                        x: x * cellSize,
                        y: y * cellSize,
                        age: 0,
                        maxAge: 200 + Math.random() * 300,
                        colorIndex: Math.floor(Math.random() * currentPalette.length),
                        rhythm: Math.random() * Math.PI * 2,
                        opacity: 0 // Start with fully transparent background
                    };
                    this.cells.push(cell);
                }
            }
        }

        updateCell(cell, time) {
            cell.age++;
            
            const rhythmFactor = (Math.sin(time * 0.001 + cell.rhythm) + 1) / 2;
            
            if (cell.age > cell.maxAge) {
                cell.char = asciiChars[Math.floor(Math.random() * asciiChars.length)];
                cell.age = 0;
                cell.maxAge = 200 + Math.random() * 500;
                cell.colorIndex = (cell.colorIndex + 1) % currentPalette.length;
                cell.rhythm = Math.random() * Math.PI * 2;
            }

            if (Math.random() < 0.01 * rhythmFactor) {
                cell.char = asciiChars[Math.floor(Math.random() * asciiChars.length)];
            }

            const t = cell.age / cell.maxAge;
            cell.opacity = (1 - t) * (0.3 + rhythmFactor * 0.7);
        }

        update(time) {
            this.cells.forEach(cell => this.updateCell(cell, time));
        }

        draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            ctx.font = `${cellSize * 0.8}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            this.cells.forEach(cell => {
                // Draw white background with fading opacity
                ctx.fillStyle = `rgba(255, 255, 255, ${cell.opacity})`;
                ctx.fillRect(cell.x, cell.y, cellSize, cellSize);
                
                // Draw ASCII character with full opacity
                const color = currentPalette[cell.colorIndex];
                ctx.fillStyle = color.replace(/[\d.]+\)$/g, `${cell.opacity})`);
                ctx.fillText(cell.char, cell.x + cellSize / 2, cell.y + cellSize / 2);
            });
        }

        recreateGrid() {
            gridWidth = Math.floor(width / cellSize);
            gridHeight = Math.floor(height / cellSize);
            this.cells = [];
            for (let x = 0; x < gridWidth; x++) {
                for (let y = 0; y < gridHeight; y++) {
                    const cell = {
                        char: asciiChars[0],
                        x: x * cellSize,
                        y: y * cellSize,
                        age: 0,
                        maxAge: 200 + Math.random() * 300,
                        colorIndex: Math.floor(Math.random() * currentPalette.length),
                        rhythm: Math.random() * Math.PI * 2,
                        opacity: 1
                    };
                    this.cells.push(cell);
                }
            }
        }
    }

    // Create grid
    const grid = new Grid();

    // Animation function
    function animate(time) {
        requestAnimationFrame(animate);
        grid.update(time);
        grid.draw();
    }

    // Start the animation
    animate();

    // Handle window resizing
    function onWindowResize() {
        const dimensions = calculateDimensions();
        width = dimensions.width;
        height = dimensions.height;
        canvas.width = width;
        canvas.height = height;
        grid.recreateGrid();
    }

    // Debounce resize events for performance
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(onWindowResize, 150);
    }, false);

    // Function to update colors based on dark mode
    function updateColors(isDarkMode) {
        currentPalette = isDarkMode ? darkModePalette : lightModePalette;
        grid.cells.forEach(cell => {
            cell.colorIndex = Math.floor(Math.random() * currentPalette.length);
        });
    }

    // Expose updateColors function to global scope
    window.updateThreeJsColors = updateColors;
});