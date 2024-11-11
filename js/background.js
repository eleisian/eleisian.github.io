class Background {
    constructor() {
        this.elvishChars = ['⚜', '✧', '❈', '✺', '❋', '⚝', '✤', '❆', '✳', '✻', 'ᚠ', 'ᚻ', 'ᚹ', 'ᚣ', 'ᛟ', 'ᛗ', 'ᚦ', 'ᚱ'];
        this.gradientColors = ['var(--color-background)', 'var(--color-sky)'];
        
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.cellSize = 20;
        this.grid = [];
        this.nextGrid = [];

        document.body.insertBefore(this.canvas, document.body.firstChild);
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.zIndex = '-1';

        this.resize();
        
        this.resizeHandler = () => this.resize();
        this.scrollHandler = () => {
            this.scrollOffset = window.scrollY * 0.5;
        };

        window.addEventListener('resize', this.resizeHandler);
        window.addEventListener('scroll', this.scrollHandler);
        
        this.animate();
    }

    destroy() {
        window.removeEventListener('resize', this.resizeHandler);
        window.removeEventListener('scroll', this.scrollHandler);
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        this.canvas = null;
        this.ctx = null;
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.ctx.scale(dpr, dpr);
        
        this.cellSize = Math.min(20, window.innerWidth / 40);
        
        this.initializeGrid();
    }

    initializeGrid() {
        this.columns = Math.ceil(window.innerWidth / this.cellSize) + 2;
        this.rows = Math.ceil(window.innerHeight / this.cellSize) + 2;
        
        this.grid = Array(this.rows).fill().map(() => Array(this.columns).fill().map(() => ({
            alive: Math.random() < 0.15,
            char: this.elvishChars[Math.floor(Math.random() * this.elvishChars.length)],
            opacity: Math.random() * 0.3 + 0.1,
            falling: true,
            speed: 0.5 + Math.random(),
            createdAt: Date.now()
        })));
        
        this.nextGrid = Array(this.rows).fill().map(() => Array(this.columns).fill().map(() => ({
            alive: false,
            char: '',
            opacity: 0,
            falling: true,
            speed: 0,
            createdAt: 0
        })));
    }

    countNeighbors(row, col) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < this.rows && newCol >= 0 && newCol < this.columns) {
                    if (this.grid[newRow][newCol].alive) count++;
                }
            }
        }
        return count;
    }

    updateGrid() {
        const currentTime = Date.now();
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const cell = this.grid[row][col];
                const neighbors = this.countNeighbors(row, col);
                
                this.nextGrid[row][col] = { ...cell };
                
                if (cell.alive) {
                    const age = currentTime - cell.createdAt;
                    const lifespan = 800; // 5 seconds total lifespan
                    const fadeProgress = Math.min(1, age / lifespan);
                    const startOpacity = 0.4; // Starting opacity
                    
                    this.nextGrid[row][col].opacity = startOpacity * (1 - fadeProgress);
                    
                    if (this.nextGrid[row][col].opacity <= 0) {
                        this.nextGrid[row][col].alive = false;
                        this.nextGrid[row][col].char = '';
                        continue;
                    }
                }

                if (cell.alive) {
                    if (neighbors < 2 || neighbors > 3) {
                        this.nextGrid[row][col].alive = false;
                        this.nextGrid[row][col].opacity = 0;
                        this.nextGrid[row][col].char = '';
                    }
                } else if (neighbors === 3) {
                    this.nextGrid[row][col].alive = true;
                    this.nextGrid[row][col].char = this.elvishChars[Math.floor(Math.random() * this.elvishChars.length)];
                    this.nextGrid[row][col].opacity = 0.4;
                    this.nextGrid[row][col].createdAt = currentTime;
                }
                
                if (cell.falling && row < this.rows - 1) {
                    const targetRow = Math.min(this.rows - 1, Math.floor(row + cell.speed));
                    if (!this.grid[targetRow][col].alive) {
                        this.nextGrid[targetRow][col] = { ...cell };
                        this.nextGrid[row][col] = {
                            alive: false,
                            char: '',
                            opacity: 0,
                            falling: true,
                            speed: 1 + Math.random(),
                            createdAt: 0
                        };
                    }
                }
            }
        }

        [this.grid, this.nextGrid] = [this.nextGrid, this.grid];
        
        if (Math.random() < 0.1) {
            const col = Math.floor(Math.random() * this.columns);
            this.grid[0][col] = {
                alive: true,
                char: this.elvishChars[Math.floor(Math.random() * this.elvishChars.length)],
                opacity: 0.4,
                falling: true,
                speed: 1 + Math.random(),
                createdAt: currentTime
            };
        }
    }

    drawGrid() {
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const cell = this.grid[row][col];
                if (cell.alive) {
                    this.ctx.font = `${this.cellSize * 0.8}px Arial`;
                    this.ctx.fillStyle = `rgba(0, 0, 0, ${cell.opacity})`;
                    const x = col * this.cellSize;
                    const y = row * this.cellSize;
                    this.ctx.fillText(cell.char, x, y);
                }
            }
        }
    }

    drawGradient() {
        const computedStyle = getComputedStyle(document.documentElement);
        const color1 = computedStyle.getPropertyValue('--color-background').trim();
        const color2 = computedStyle.getPropertyValue('--color-sky').trim();
        
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    animate() {
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.drawGradient();
        this.updateGrid();
        this.drawGrid();
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.background = new Background();
});