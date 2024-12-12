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

        this.characters = ['+', '×', '·', '∙', '•'];
        this.characterPositions = [];
        this.waves = [];

        this.initializeCharacterPositions();

        // Store the resize handler so we can remove it later
        this.resizeHandler = () => this.resize();
        window.addEventListener('resize', this.resizeHandler);
        
        // Store the animation frame ID
        this.animationFrameId = null;
        this.animate();

        // Store the click handler reference so we can remove it later
        this.clickHandler = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.waves.push(this.createWave(x, y, 1.0));
        };
        document.addEventListener('click', this.clickHandler);

        // Modified physics constants for slower, more granular movement
        this.waveSpeed = 0.1;
        this.dampening = 0.998;
        this.minStrength = 0.05;
        this.waveInterval = 2000;
        this.lastWaveTime = Date.now();
        this.interferenceStrength = 0.1;
        this.maxVelocity = 0.2;
        this.numPoints = 36;
        this.elasticity = 0.015;
        this.nextWaveDelay = this.getRandomDelay();

        // Clear any existing intervals
        this.clearCharactersInterval = setInterval(() => {
            this.initializeCharacterPositions();
        }, 60000); // Reinitialize every minute to prevent memory buildup
    }

    getRandomDelay() {
        return Math.random() * 1500 + 500; // Random delay between 500ms and 2000ms
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = Math.max(window.innerHeight, document.documentElement.scrollHeight);
    }

    initializeCharacterPositions() {
        // Clear existing positions
        this.characterPositions = [];
        
        const gridSize = 25;
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
        const computedStyle = getComputedStyle(document.documentElement);
        const textColor = computedStyle.getPropertyValue('--color-text').trim();
        
        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = textColor;
        this.ctx.font = '15px Arial';

        this.characterPositions.forEach(pos => {
            let waveInfluence = 0;
            let wavePhase = 0;

            this.waves.forEach(wave => {
                // Find closest point on deformed wave to character
                let minDist = Infinity;
                wave.points.forEach(point => {
                    const waveX = wave.x + Math.cos(point.angle) * point.radius;
                    const waveY = wave.y + Math.sin(point.angle) * point.radius;
                    const dx = pos.x - waveX;
                    const dy = pos.y - waveY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    minDist = Math.min(minDist, dist);
                });

                const waveWidth = 15;
                if (minDist < waveWidth) {
                    const phase = 1 - minDist / waveWidth;
                    const influence = phase * wave.strength;
                    
                    // Combine wave influences using interference
                    wavePhase += phase;
                    waveInfluence = Math.max(waveInfluence, influence);
                }
            });

            if (waveInfluence > 0) {
                // Apply interference pattern to visibility
                const interference = Math.sin(wavePhase * Math.PI) * 0.5 + 0.5;
                this.ctx.globalAlpha = Math.min(1, waveInfluence * interference);
                this.ctx.fillText(pos.char, pos.x, pos.y);
            }
        });
    }

    // Add destroy method
    destroy() {
        // Remove event listeners
        window.removeEventListener('resize', this.resizeHandler);
        document.removeEventListener('click', this.clickHandler);
        
        // Cancel animation frame
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        // Clear interval
        if (this.clearCharactersInterval) {
            clearInterval(this.clearCharactersInterval);
            this.clearCharactersInterval = null;
        }

        // Properly clear arrays
        this.characterPositions.length = 0;
        this.waves.length = 0;
        
        // Clear canvas before removal
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Remove canvas from DOM
        if (this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }

        // Null out references
        this.canvas = null;
        this.ctx = null;
        this.characterPositions = null;
        this.waves = null;
    }

    createWave(x, y, strength = 1) {
        // Create wave with multiple points around circumference
        const points = [];
        for (let i = 0; i < this.numPoints; i++) {
            const angle = (i / this.numPoints) * Math.PI * 2;
            points.push({
                angle,
                radius: 0,
                baseRadius: 0, // Target radius for restoration force
                velocity: this.waveSpeed * (0.8 + Math.random() * 0.4)
            });
        }

        return {
            x,
            y,
            points,
            startTime: Date.now(),
            maxRadius: Math.max(this.canvas.width, this.canvas.height),
            isReflecting: false,
            strength
        };
    }

    animate() {
        const time = Date.now();
        const deltaTime = 32;
        
        // Add new waves periodically with randomized timing
        if (time - this.lastWaveTime > this.nextWaveDelay) {
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            
            this.waves.push(this.createWave(centerX, centerY, 0.8));
            this.lastWaveTime = time;
            this.nextWaveDelay = this.getRandomDelay(); // Set next random delay
        }

        // Update wave physics
        this.waves = this.waves.filter(wave => {
            // Update each point of the wave
            wave.points.forEach(point => {
                point.baseRadius += point.velocity * deltaTime;
            });

            // Calculate collisions with other waves
            this.waves.forEach(otherWave => {
                if (wave === otherWave) return;

                wave.points.forEach((point, i) => {
                    const angle = point.angle;
                    const x1 = wave.x + Math.cos(angle) * point.baseRadius;
                    const y1 = wave.y + Math.sin(angle) * point.baseRadius;

                    // Check collision with nearby points on other wave
                    for (let j = 0; j < otherWave.points.length; j++) {
                        const otherPoint = otherWave.points[j];
                        const x2 = otherWave.x + Math.cos(otherPoint.angle) * otherPoint.baseRadius;
                        const y2 = otherWave.y + Math.sin(otherPoint.angle) * otherPoint.baseRadius;

                        const dx = x2 - x1;
                        const dy = y2 - y1;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < 40) { // Increased collision radius
                            const pushForce = (40 - distance) * 0.2; // Increased force
                            const pushAngle = Math.atan2(dy, dx);
                            
                            // Apply deformation
                            point.radius = point.baseRadius - pushForce * Math.cos(pushAngle - angle);
                            otherPoint.radius = otherPoint.baseRadius - pushForce * Math.cos(pushAngle - otherPoint.angle);
                        }
                    }
                });
            });

            // Apply elastic restoration force
            wave.points.forEach(point => {
                if (typeof point.radius === 'undefined') {
                    point.radius = point.baseRadius;
                }
                const radiusDiff = point.baseRadius - point.radius;
                point.radius += radiusDiff * this.elasticity;
            });

            // Handle reflection
            if (!wave.isReflecting && wave.points[0].baseRadius >= wave.maxRadius) {
                wave.isReflecting = true;
                wave.points.forEach(point => {
                    point.velocity = -point.velocity * 0.8;
                });
                wave.strength *= 0.7;
            }

            wave.strength *= this.dampening;
            return wave.strength > this.minStrength;
        });

        this.drawWaves();
        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    drawWaves() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGradient(Date.now());

        const computedStyle = getComputedStyle(document.documentElement);
        const textColor = computedStyle.getPropertyValue('--color-text').trim();
        
        this.characterPositions.forEach(pos => {
            let waveInfluence = 0;

            this.waves.forEach(wave => {
                // Find closest point on deformed wave to character
                let minDist = Infinity;
                wave.points.forEach(point => {
                    const waveX = wave.x + Math.cos(point.angle) * point.radius;
                    const waveY = wave.y + Math.sin(point.angle) * point.radius;
                    const dx = pos.x - waveX;
                    const dy = pos.y - waveY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    minDist = Math.min(minDist, dist);
                });

                if (minDist < 20) {
                    const influence = (20 - minDist) / 20 * wave.strength;
                    waveInfluence = Math.max(waveInfluence, influence);
                }
            });

            if (waveInfluence > 0) {
                this.ctx.globalAlpha = Math.min(0.6, waveInfluence * 0.6);
                this.ctx.fillStyle = textColor;
                this.ctx.fillText(pos.char, pos.x, pos.y);
            }
        });
    }
}

// Modify the DOMContentLoaded handler to better handle cleanup
document.addEventListener('DOMContentLoaded', () => {
    let backgroundInstance = new Background();

    // Improve visibility change handling
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (backgroundInstance) {
                backgroundInstance.destroy();
                backgroundInstance = null;
            }
        } else {
            if (!backgroundInstance) {
                backgroundInstance = new Background();
            }
        }
    });

    // Add window unload handler
    window.addEventListener('unload', () => {
        if (backgroundInstance) {
            backgroundInstance.destroy();
            backgroundInstance = null;
        }
    });

    // Add click handler for dice face
    const diceface = document.querySelector('.dice-face');
    const container = document.querySelector('.profile-pic-container');
    
    diceface.addEventListener('click', () => {
        container.classList.add('animate');
        
        // Remove animation class after it completes
        setTimeout(() => {
            container.classList.remove('animate');
        }, 300); // matches the animation duration
    });
});