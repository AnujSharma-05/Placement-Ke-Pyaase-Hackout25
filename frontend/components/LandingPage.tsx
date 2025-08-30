import React, { useEffect, useRef, useCallback } from 'react';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  // Particle animation for the background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse = { x: -200, y: -200 };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    canvas.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    canvas.addEventListener('mouseleave', () => {
        mouse.x = -200;
        mouse.y = -200;
    });

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.2) this.size -= 0.01;
        if (this.x < 0 || this.x > canvas!.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.speedY *= -1;
      }
      draw() {
        ctx!.fillStyle = 'rgba(16, 185, 129, 0.5)'; // green-500
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    const init = () => {
      particles = [];
      const numberOfParticles = (canvas.width * canvas.height) / 9000;
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    };
    init();

    const connect = () => {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx!.strokeStyle = `rgba(52, 211, 153, ${1 - distance / 100})`; // green-400
                    ctx!.lineWidth = 0.2;
                    ctx!.beginPath();
                    ctx!.moveTo(particles[a].x, particles[b].y);
                    ctx!.lineTo(particles[b].x, particles[a].y);
                    ctx!.stroke();
                }
            }
        }
        // Connect to mouse
        for (let i = 0; i < particles.length; i++) {
            const dx = particles[i].x - mouse.x;
            const dy = particles[i].y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 150) {
                ctx!.strokeStyle = `rgba(110, 231, 183, ${1 - distance/150})`; // green-300
                ctx!.lineWidth = 0.5;
                ctx!.beginPath();
                ctx!.moveTo(particles[i].x, mouse.y);
                ctx!.lineTo(mouse.x, particles[i].y);
                ctx!.stroke();
            }
        }
    }

    const animate = () => {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      connect();
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
  
    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });
  
    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);
  
  const addToRefs = (el: HTMLElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };


  return (
    <div className="relative w-full bg-gray-950 text-gray-50 scroll-smooth">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />
      
      <header className="fixed top-0 left-0 right-0 z-50 p-4 bg-gray-950/30 backdrop-blur-sm transition-all duration-300">
        <div className="container mx-auto flex justify-between items-center">
            <div className="text-2xl font-bold text-white tracking-widest">
                H<span className="text-green-400">₂</span>OS
            </div>
            <div className="flex items-center space-x-6">
                <button onClick={onLogin} className="text-gray-300 hover:text-green-400 transition-colors duration-300 font-medium">
                    Login
                </button>
                <button onClick={onLogin} className="bg-green-500 text-white font-bold py-2 px-5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/30">
                    Launch Analysis
                </button>
            </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center p-4 z-10">
        <div ref={addToRefs} className="scroll-animate flex flex-col items-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center mb-8">
                <div className="absolute inset-0 border-2 border-green-500/20 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 border border-green-500/10 rounded-full animate-pulse animation-delay-500"></div>
                <div className="text-6xl md:text-8xl font-bold text-green-400" style={{ textShadow: '0 0 20px #10b981' }}>H₂</div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter" style={{ textShadow: '0 0 15px rgba(255,255,255,0.1)' }}>
                Powering Tomorrow with the <span className="text-green-400">Element of Life</span>.
            </h1>
        </div>
        <div className="absolute bottom-10 text-gray-400 flex flex-col items-center animate-bounce">
            <span>Scroll Down</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
      </section>

      {/* Impact Section */}
      <section ref={addToRefs} className="scroll-animate container mx-auto py-24 px-6 z-10 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-green-500/5 rounded-2xl p-8 border border-green-500/10 shadow-2xl shadow-green-900/20">
                <img src="https://images.unsplash.com/photo-1664424148168-53459c5d15a5?q=80&w=1974&auto=format&fit=crop" alt="Hydrogen Production Facility" className="rounded-lg object-cover w-full h-full" />
            </div>
            <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Real World Impact</h2>
                <div className="space-y-6">
                    <div className="p-4 border-l-4 border-green-400">
                        <span className="text-4xl font-bold text-green-400">1.2M</span>
                        <p className="text-gray-300">Tons of CO₂ Reduced Annually</p>
                    </div>
                    <div className="p-4 border-l-4 border-green-400">
                        <span className="text-4xl font-bold text-green-400">2.5 TWh</span>
                        <p className="text-gray-300">Clean Energy Generated</p>
                    </div>
                    <div className="p-4 border-l-4 border-green-400">
                        <span className="text-4xl font-bold text-green-400">30%</span>
                        <p className="text-gray-300">Reduction in Energy Costs</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Why Hydrogen Section */}
      <section ref={addToRefs} className="scroll-animate container mx-auto py-24 px-6 text-center z-10 relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">The Future is Elemental</h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-300">
              Green hydrogen is more than just fuel; it's a paradigm shift. By using renewable energy to split water, we create a powerful, clean energy carrier with zero carbon emissions. It's the key to decarbonizing heavy industry, transportation, and our global energy grid.
          </p>
      </section>
    </div>
  );
};

export default LandingPage;