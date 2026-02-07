/**
 * Lightweight Particle Animation for Hero Section
 * Creates floating "firefly" particles
 */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    const heroSection = document.getElementById('home');

    if (!heroSection) return;

    // Setup Canvas
    canvas.id = 'hero-particles';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1'; // Behind content but above bg image
    heroSection.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];

    // Resize handling
    let width, height;
    const resize = () => {
        width = canvas.width = heroSection.offsetWidth;
        height = canvas.height = heroSection.offsetHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Particle Class
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5; // Slow movement
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 3 + 1;
            this.alpha = Math.random() * 0.5 + 0.1;
            this.fadeSpeed = Math.random() * 0.005 + 0.002;
            this.fadingOut = Math.random() > 0.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Fade in/out
            if (this.fadingOut) {
                this.alpha -= this.fadeSpeed;
                if (this.alpha <= 0) {
                    this.fadingOut = false;
                    this.reset(); // Reset position when invisible
                    this.alpha = 0;
                }
            } else {
                this.alpha += this.fadeSpeed;
                if (this.alpha >= 0.6) this.fadingOut = true;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 223, 100, ${this.alpha})`; // Goldish color
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(255, 223, 100, 0.5)';
            ctx.fill();
        }
    }

    // Init Particles
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation Loop
    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    };
    animate();
});
