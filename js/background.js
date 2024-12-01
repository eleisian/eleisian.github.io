class Background {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();

        document.body.insertBefore(this.canvas, document.body.firstChild);
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '-1';

        this.characters = ['+'];
        this.characterPositions = [];

        this.initializeCharacterPositions();

        // Store the resize handler so we can remove it later
        this.resizeHandler = () => this.resize();
        window.addEventListener('resize', this.resizeHandler);
        
        // Store the animation frame ID
        this.animationFrameId = null;
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initializeCharacterPositions() {
        const gridSize = 50;
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            for (let y = 0; y < this.canvas.height; y += gridSize) {
                this.characterPositions.push({
                    x,
                    y,
                    char: this.characters[Math.floor(Math.random() * this.characters.length)],
                    offset: Math.random() * Math.PI * 2,
                });
            }
        }
    }

    drawGradient(time) {
        const computedStyle = getComputedStyle(document.documentElement);
        const backgroundColor = computedStyle.getPropertyValue('--color-background').trim();
        
        // Simply fill with solid background color
        this.ctx.fillStyle = backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawCharacters(time) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
        this.ctx.font = '20px Arial';

        this.characterPositions.forEach(pos => {
            const offset = 0;
            this.ctx.fillText(pos.char, pos.x + offset, pos.y + offset);
        });
    }

    // Add destroy method
    destroy() {
        // Remove event listener
        window.removeEventListener('resize', this.resizeHandler);
        
        // Cancel animation frame
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        // Remove canvas from DOM
        this.canvas.remove();
    }

    animate() {
        const time = Date.now();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGradient(time);
        this.drawCharacters(time);
        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }
}

// Wait for the DOM to be fully loaded before creating the background
document.addEventListener('DOMContentLoaded', () => {
    new Background();
});