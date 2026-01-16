
import React, { useEffect, useRef } from 'react';

interface GoldCoinEffectProps {
  isActive: boolean;
}

const GoldCoinEffect: React.FC<GoldCoinEffectProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 200;
    const radius = 100;

    class Particle {
      x: number = 0;
      y: number = 0;
      z: number = 0;
      angle: number;
      phi: number;
      speed: number;
      color: string;

      constructor() {
        this.angle = Math.random() * Math.PI * 2;
        this.phi = Math.acos(Math.random() * 2 - 1);
        this.speed = 0.01 + Math.random() * 0.02;
        this.color = Math.random() > 0.5 ? '#FFD700' : '#C5A028';
      }

      update(rotationX: number, rotationY: number) {
        this.angle += this.speed;
        
        // Sphere coordinates
        const x = radius * Math.sin(this.phi) * Math.cos(this.angle);
        const y = radius * Math.sin(this.phi) * Math.sin(this.angle);
        const z = radius * Math.cos(this.phi);

        // Rotation logic
        const y1 = y * Math.cos(rotationX) - z * Math.sin(rotationX);
        const z1 = y * Math.sin(rotationX) + z * Math.cos(rotationX);
        
        const x2 = x * Math.cos(rotationY) + z1 * Math.sin(rotationY);
        const z2 = -x * Math.sin(rotationY) + z1 * Math.cos(rotationY);

        this.x = x2;
        this.y = y1;
        this.z = z2;
      }

      draw(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number) {
        const perspective = 300 / (300 - this.z);
        const drawX = centerX + this.x * perspective;
        const drawY = centerY + this.y * perspective;
        const size = (perspective * 2) * (isActive ? 1.5 : 1);

        ctx.beginPath();
        ctx.arc(drawX, drawY, size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = (this.z + radius) / (2 * radius);
        ctx.fill();
      }
    }

    const init = () => {
      particles = Array.from({ length: particleCount }, () => new Particle());
    };

    let rotX = 0;
    let rotY = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      rotX += 0.005;
      rotY += 0.01;

      particles.forEach(p => {
        p.update(rotX, rotY);
        p.draw(ctx, centerX, centerY, isActive ? 1.5 : 1);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 400;
      canvas.height = canvas.parentElement?.clientHeight || 400;
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    init();
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isActive]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full pointer-events-none opacity-80"
    />
  );
};

export default GoldCoinEffect;
