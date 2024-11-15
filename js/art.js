// Create a single shared AudioContext at the top level
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Create a master channel with effects chain
const masterChannel = audioContext.createGain();
const masterCompressor = audioContext.createDynamicsCompressor();
const masterReverb = audioContext.createConvolver();
const masterDryGain = audioContext.createGain();
const masterWetGain = audioContext.createGain();

// Set up master channel
masterChannel.gain.value = 0.1;
masterCompressor.threshold.value = -24;
masterCompressor.knee.value = 30;
masterCompressor.ratio.value = 12;
masterCompressor.attack.value = 0.003;
masterCompressor.release.value = 0.25;

// Connect master channel
masterChannel.connect(masterCompressor);
masterCompressor.connect(masterDryGain);
masterCompressor.connect(masterReverb);
masterReverb.connect(masterWetGain);
masterDryGain.connect(audioContext.destination);
masterWetGain.connect(audioContext.destination);

// Define sound controls at the top level
const soundControls = {
  attack: 0.00,
  decay: 0.5,
  sustain: 0.2,
  release: 0.12,
  reverb: 1,
};

// Add impulse response creation and loading
function createImpulseResponse() {
    const sampleRate = audioContext.sampleRate;
    const length = sampleRate * 3; // 3 seconds
    const impulse = audioContext.createBuffer(2, length, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
        const channelData = impulse.getChannelData(channel);
        for (let i = 0; i < length; i++) {
            const decay = Math.exp(-i / (sampleRate * 0.5)); // Slower decay
            channelData[i] = (Math.random() * 2 - 1) * decay;
        }
    }
    
    return impulse;
}

// Load the impulse response into the reverb
masterReverb.buffer = createImpulseResponse();

// Adjust initial wet/dry mix
masterDryGain.gain.value = 0.8;
masterWetGain.gain.value = 0.2;

function playNote(frequency) {
  const now = audioContext.currentTime;

  // Create oscillator and envelope
  const oscillator = audioContext.createOscillator();
  const envelope = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;

  // Connect to master channel instead of directly to destination
  oscillator.connect(envelope);
  envelope.connect(masterChannel);

  // ADSR envelope
  const sustainLevel = Math.max(0.0001, soundControls.sustain);

  envelope.gain.setValueAtTime(0.0001, now);
  envelope.gain.exponentialRampToValueAtTime(0.4, now + soundControls.attack);
  envelope.gain.exponentialRampToValueAtTime(
    sustainLevel,
    now + soundControls.attack + soundControls.decay,
  );
  envelope.gain.exponentialRampToValueAtTime(
    0.0001,
    now + soundControls.attack + soundControls.decay + soundControls.release,
  );

  // Update reverb amount with better balanced mix
  const reverbAmount = soundControls.reverb;
  masterWetGain.gain.value = reverbAmount * 0.4;  // Reduced from 0.5
  masterDryGain.gain.value = 1 - (reverbAmount * 0.2);  // Better dry/wet balance

  // Start oscillator
  oscillator.start(now);
  oscillator.stop(
    now +
      soundControls.attack +
      soundControls.decay +
      soundControls.release +
      0.1,
  );

  // Clean up when done
  oscillator.onended = () => {
    oscillator.disconnect();
    envelope.disconnect();
  };
}

// Resume AudioContext on first user interaction
document.addEventListener(
  "click",
  () => {
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
  },
  { once: true },
);

// Main initialization
document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("threeCanvas");
  const ctx = canvas.getContext("2d");

  // Grid settings
  const cellSize = 25; // Fixed cell size

  // Function to calculate responsive width and height
  function calculateDimensions() {
    return {
      width: 22 * cellSize, // Fixed 22 columns
      height: 2 * cellSize, // Fixed 2 rows
    };
  }

  // Initial dimensions
  let { width, height } = calculateDimensions();
  canvas.width = width;
  canvas.height = height;

  // Grid dimensions
  let gridWidth = 22; // Fixed width
  let gridHeight = 2; // Fixed height

  // ASCII characters to use
  const asciiChars = ["·", ":", "+", "×", "▢", "▣", "◯", "◉", "█"];

  // Water-inspired color palettes
  const lightModePalette = ["rgba(0, 0, 0, 1)"]; // Fully opaque black for characters

  const darkModePalette = [
    "rgba(139, 0, 0, 1)", // Dark Red
    "rgba(85, 107, 47, 1)", // Dark Olive Green
    "rgba(70, 130, 180, 1)", // Steel Blue
    "rgba(205, 133, 63, 1)", // Peru
    "rgba(112, 128, 144, 1)", // Slate Gray
  ];

  let currentPalette = lightModePalette;

  // Define notes back down an octave (C4)
  const notes = [
    261.62, // C4
    261.62, // C4
    293.66, // D4
    329.62, // E4
    329.62, // E4
    392.0, // G4
    440.0, // A4
    261.62, // C4
    261.62, // C4
    261.62, // C4
    293.66, // D4
    329.62, // E4
    329.62, // E4
    349.22, // F4
    329.62, // E4
    261.62, // C4
  ];

  // Grid class
  class Grid {
    constructor() {
      this.cells = [];

      // Create the note mapping grid
      for (let x = 0; x < gridWidth; x++) {
        // Ensure we start with the first note (C3) for the first column
        const noteIndex = x % notes.length; // This ensures we wrap around if we have more columns than notes
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
            note: notes[noteIndex], // This will now start with the first note (C3) for x=0
            isActive: false,
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
      this.cells.forEach((cell) => this.updateCell(cell, time));
    }

    draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${cellSize * 0.8}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      this.cells.forEach((cell) => {
        // First draw the white background and character
        if (cell.isActive) {
          ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
          ctx.shadowBlur = 10;
        } else {
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${cell.opacity})`;
        ctx.fillRect(cell.x, cell.y, cellSize, cellSize);

        const color = currentPalette[cell.colorIndex];
        ctx.fillStyle = color.replace(/[\d.]+\)$/g, `${cell.opacity})`);
        ctx.fillText(cell.char, cell.x + cellSize / 2, cell.y + cellSize / 2);

        // Then draw the sky blue highlight on top if active
        if (cell.isActive) {
          ctx.fillStyle = "rgba(135, 206, 235, 0.3)";
          ctx.fillRect(cell.x, cell.y, cellSize, cellSize);
        }
      });
    }

    recreateGrid() {
      gridWidth = Math.floor(width / cellSize);
      gridHeight = Math.floor(height / cellSize);
      this.cells = [];
      for (let x = 0; x < gridWidth; x++) {
        const noteIndex = x % notes.length; // Use the same note assignment pattern
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
            note: notes[noteIndex], // Assign note based on column position
            isActive: false,
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
        this.cells.forEach((cell) => (cell.isActive = false));

        // Set all cells in the clicked column to active
        this.cells.forEach((cell) => {
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
          this.cells.forEach((cell) => (cell.isActive = false));
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
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / rect.width;

    const dimensions = calculateDimensions();
    width = dimensions.width;
    height = dimensions.height;
    canvas.width = width;
    canvas.height = height;
    grid.recreateGrid();

    return scale;
  }

  // Get initial scale
  let currentScale = onWindowResize();

  // Debounce resize events for performance
  let resizeTimeout;
  window.addEventListener(
    "resize",
    () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        currentScale = onWindowResize();
      }, 150);
    },
    false,
  );

  // Function to update colors based on dark mode
  function updateColors(isDarkMode) {
    currentPalette = isDarkMode ? darkModePalette : lightModePalette;
    grid.cells.forEach((cell) => {
      cell.colorIndex = Math.floor(Math.random() * currentPalette.length);
    });
  }

  // Expose updateColors function to global scope
  window.updateThreeJsColors = updateColors;

  // Add touch event listener
  canvas.addEventListener("touchstart", (event) => {
    event.preventDefault();

    // Start audio context on first touch (required by browsers)
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    const rect = canvas.getBoundingClientRect();
    const touch = event.touches[0];
    const mouseX = (touch.clientX - rect.left) * (canvas.width / rect.width);
    const mouseY = (touch.clientY - rect.top) * (canvas.height / rect.height);
    grid.handleClick(mouseX, mouseY);
  });

  // Add click event listener
  canvas.addEventListener("click", (event) => {
    // Start audio context on first click (required by browsers)
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    const rect = canvas.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left) * (canvas.width / rect.width);
    const mouseY = (event.clientY - rect.top) * (canvas.height / rect.height);
    grid.handleClick(mouseX, mouseY);
  });

  // Add hover effect
  canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = ((event.clientX - rect.left) * canvas.width) / rect.width;
    const mouseY = ((event.clientY - rect.top) * canvas.height) / rect.height;

    const x = Math.floor(mouseX / cellSize);
    const y = Math.floor(mouseY / cellSize);

    grid.cells.forEach((cell) => {
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
