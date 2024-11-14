document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('threeCanvas');
    const ctx = canvas.getContext('2d');

    // Grid settings
    const cellSize = 25; // Fixed cell size

    // Function to calculate responsive width and height
    function calculateDimensions() {
        return { 
            width: 22 * cellSize,  // Fixed 22 columns
            height: 2 * cellSize   // Fixed 2 rows
        };
    }

    // Initial dimensions
    let { width, height } = calculateDimensions();
    canvas.width = width;
    canvas.height = height;

    // Grid dimensions
    let gridWidth = 22;  // Fixed width
    let gridHeight = 2;  // Fixed height

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

    // Audio setup
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Define the specific notes we want
    const notes = [
        130.81, // C3
        130.81, // C3
        146.83, // D3
        164.81, // E3
        164.81, // E3
        196.00, // G3
        220.00, // A3
        130.81, // C3
        130.81, // C3
        130.81, // C3
        146.83, // D3
        164.81, // E3
        164.81, // E3
        174.61, // F3
        164.81, // E3
        130.81, // C3
    ];

    function playNote(frequency) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    }

    // Grid class
    class Grid {
        constructor() {
            this.cells = [];
            
            // Create the note mapping grid
            for (let x = 0; x < gridWidth; x++) {
                // Ensure we start with the first note (C3) for the first column
                const noteIndex = x % notes.length;  // This ensures we wrap around if we have more columns than notes
                for (let y = 0; y < gridHeight; y++) {
                    const cell = {
                        char: asciiChars[0],
                        x: x * cellSize,
                        y: y * cellSize,
                        age: 0,
                        maxAge: 200 + Math.random() * 300,
                        colorIndex: Math.floor(Math.random() * currentPalette.length),
                        rhythm: Math.random() * Math.PI * 2,
                        opacity: 0,
                        note: notes[noteIndex],  // This will now start with the first note (C3) for x=0
                        isActive: false
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
                // First draw the white background and character
                if (cell.isActive) {
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                    ctx.shadowBlur = 10;
                } else {
                    ctx.shadowColor = 'transparent';
                    ctx.shadowBlur = 0;
                }
        
                ctx.fillStyle = `rgba(255, 255, 255, ${cell.opacity})`;
                ctx.fillRect(cell.x, cell.y, cellSize, cellSize);
                
                const color = currentPalette[cell.colorIndex];
                ctx.fillStyle = color.replace(/[\d.]+\)$/g, `${cell.opacity})`);
                ctx.fillText(cell.char, cell.x + cellSize / 2, cell.y + cellSize / 2);
        
                // Then draw the red highlight on top if active
                if (cell.isActive) {
                    ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
                    ctx.fillRect(cell.x, cell.y, cellSize, cellSize);
                }
            });
        }

        recreateGrid() {
            gridWidth = Math.floor(width / cellSize);
            gridHeight = Math.floor(height / cellSize);
            this.cells = [];
            for (let x = 0; x < gridWidth; x++) {
                const noteIndex = x % notes.length;  // Use the same note assignment pattern
                for (let y = 0; y < gridHeight; y++) {
                    const cell = {
                        char: asciiChars[0],
                        x: x * cellSize,
                        y: y * cellSize,
                        age: 0,
                        maxAge: 200 + Math.random() * 300,
                        colorIndex: Math.floor(Math.random() * currentPalette.length),
                        rhythm: Math.random() * Math.PI * 2,
                        opacity: 1,
                        note: notes[noteIndex],  // Assign note based on column position
                        isActive: false
                    };
                    this.cells.push(cell);
                }
            }
        }

        // Add click handling
        handleClick(mouseX, mouseY) {
            const x = Math.floor(mouseX / cellSize);
            const y = Math.floor(mouseY / cellSize);
            const index = x + y * gridWidth;
            
            if (this.cells[index]) {
                // Reset all cells' active state first
                this.cells.forEach(cell => cell.isActive = false);
                
                // Set all cells in the clicked column to active
                this.cells.forEach(cell => {
                    const cellX = Math.floor(cell.x / cellSize);
                    if (cellX === x) {
                        cell.isActive = true;
                    }
                });
                
                // Get the note based on the column position
                const noteIndex = x % notes.length;
                const noteToPlay = notes[noteIndex];
                
                const cell = this.cells[index];
                // Visual feedback
                cell.char = asciiChars[Math.floor(Math.random() * asciiChars.length)];
                cell.opacity = 1;
                
                // Play sound using the column-based note
                playNote(noteToPlay);
                
                // Reset after animation
                setTimeout(() => {
                    this.cells.forEach(cell => cell.isActive = false);
                }, 200);
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

    // Add click event listener
    canvas.addEventListener('click', (event) => {
        // Start audio context on first click (required by browsers)
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        grid.handleClick(mouseX, mouseY);
    });

    // Add hover effect
    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        
        const x = Math.floor(mouseX / cellSize);
        const y = Math.floor(mouseY / cellSize);
        
        grid.cells.forEach(cell => {
            const cellX = Math.floor(cell.x / cellSize);
            const cellY = Math.floor(cell.y / cellSize);
            if (cellX === x && cellY === y) {
                cell.opacity = Math.min(cell.opacity + 0.1, 1);
            } else {
                cell.opacity = Math.max(cell.opacity - 0.05, 0);
            }
        });
    });
});