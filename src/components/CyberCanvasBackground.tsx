import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
  color: string;
}

interface TelemetryPacket {
  text: string;
  x: number;
  y: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
}

interface LaserLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  progress: number;
  speed: number;
  color: string;
}

const TELEMETRY_SNIPPETS = [
  'WRO_CORE::ONLINE',
  'SYSTEM_SEC::OMEGA-5',
  'ENCRYPTION::AES-GCM-256',
  'NEURAL_LINK::SYNCED',
  '0x7F4A9B2C',
  'PID_CONTROLLER::LOCKED',
  'MOTOR_PWM::98.4%',
  'CHASER_OS::v4.2.0',
  'IMU_HEADING::0.00°',
  'SENSOR_ARRAY::ACTIVE',
  'PORT::443/TLS1.3',
  'FIREWALL::ENFORCED',
  '01001011 01000110 01000011', // KFC in binary
  'QUANTUM_KEY::READY',
];

const COLORS = [
  '#10b981', // Emerald neon
  '#06b6d4', // Cyan neon
  '#3b82f6', // Cyber blue
  '#8b5cf6', // Electric purple
  '#14b8a6', // Teal
];

export const CyberCanvasBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes
    let particles: Particle[] = [];
    const particleCount = Math.min(65, Math.floor((width * height) / 18000));

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const baseAlpha = 0.25 + Math.random() * 0.45;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.65,
          vy: (Math.random() - 0.5) * 0.65,
          radius: 1.2 + Math.random() * 1.8,
          alpha: baseAlpha,
          baseAlpha,
          color,
        });
      }
    };

    initParticles();

    // Floating Telemetry Text Packets
    const telemetryList: TelemetryPacket[] = [];
    for (let i = 0; i < 14; i++) {
      telemetryList.push({
        text: TELEMETRY_SNIPPETS[Math.floor(Math.random() * TELEMETRY_SNIPPETS.length)],
        x: Math.random() * width,
        y: Math.random() * height,
        vy: -(0.25 + Math.random() * 0.4),
        alpha: 0.15 + Math.random() * 0.3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 9 + Math.floor(Math.random() * 3),
      });
    }

    // Laser Beam Pulses
    const lasers: LaserLine[] = [];
    const createLaser = () => {
      const isHorizontal = Math.random() > 0.4;
      if (isHorizontal) {
        const y = Math.random() * height;
        lasers.push({
          x1: 0,
          y1: y,
          x2: width,
          y2: y,
          progress: 0,
          speed: 0.008 + Math.random() * 0.015,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      } else {
        const x = Math.random() * width;
        lasers.push({
          x1: x,
          y1: 0,
          x2: x,
          y2: height,
          progress: 0,
          speed: 0.008 + Math.random() * 0.015,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
    };

    let laserTimer = 0;

    // Mouse handlers
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Animation Render Loop
    let gridOffset = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep Cyber Background Gradient
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        100,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );
      bgGrad.addColorStop(0, '#0a0e17');
      bgGrad.addColorStop(0.6, '#060911');
      bgGrad.addColorStop(1, '#020408');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Cyber Grid in perspective / floor
      gridOffset = (gridOffset + 0.3) % 40;
      ctx.save();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.04)';
      ctx.lineWidth = 1;

      // Vertical grid lines
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal grid lines with subtle scroll motion
      for (let y = gridOffset; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // Laser beams
      laserTimer++;
      if (laserTimer > 90 && lasers.length < 3) {
        createLaser();
        laserTimer = 0;
      }

      for (let i = lasers.length - 1; i >= 0; i--) {
        const l = lasers[i];
        l.progress += l.speed;
        if (l.progress >= 1) {
          lasers.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.strokeStyle = l.color;
        ctx.shadowColor = l.color;
        ctx.shadowBlur = 8;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = Math.sin(l.progress * Math.PI) * 0.45;

        const curX = l.x1 + (l.x2 - l.x1) * l.progress;
        const curY = l.y1 + (l.y2 - l.y1) * l.progress;
        const tailLength = 80;

        ctx.beginPath();
        if (l.x1 === 0 && l.x2 === width) {
          // Horizontal beam
          ctx.moveTo(Math.max(0, curX - tailLength), curY);
          ctx.lineTo(curX, curY);
        } else {
          // Vertical beam
          ctx.moveTo(curX, Math.max(0, curY - tailLength));
          ctx.lineTo(curX, curY);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Draw and update telemetry snippets
      ctx.save();
      ctx.font = '10px "JetBrains Mono", monospace';
      for (const item of telemetryList) {
        item.y += item.vy;
        if (item.y < -30) {
          item.y = height + 20;
          item.x = Math.random() * width;
          item.text = TELEMETRY_SNIPPETS[Math.floor(Math.random() * TELEMETRY_SNIPPETS.length)];
        }

        ctx.fillStyle = item.color;
        ctx.globalAlpha = item.alpha;
        ctx.fillText(item.text, item.x, item.y);
      }
      ctx.restore();

      // Update & Draw Constellation Particles
      const mouse = mouseRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse attraction / interaction
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            const force = (160 - dist) / 160;
            p.x += (dx / dist) * force * 1.2;
            p.y += (dy / dist) * force * 1.2;
            p.alpha = Math.min(1, p.baseAlpha + force * 0.5);
          } else {
            p.alpha = p.baseAlpha;
          }
        }

        // Draw particle dot
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Connect nearby particles with glowing cyber lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const lineAlpha = (1 - dist / 120) * 0.18;
            ctx.save();
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = lineAlpha;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.restore();
          }
        }

        // Connect to mouse if close
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.save();
            ctx.strokeStyle = '#06b6d4';
            ctx.globalAlpha = (1 - dist / 140) * 0.35;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // Mouse subtle glowing aura
      if (mouse.active) {
        ctx.save();
        const mouseGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 140);
        mouseGlow.addColorStop(0, 'rgba(6, 182, 212, 0.12)');
        mouseGlow.addColorStop(0.5, 'rgba(16, 185, 129, 0.04)');
        mouseGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = mouseGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 140, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* CRT Scanline and Vignette overlay */}
      <div
        className="absolute inset-0 bg-radial-[circle_at_center,transparent_0%,rgba(0,0,0,0.65)_100%] pointer-events-none"
        style={{ mixBlendMode: 'multiply' }}
      />
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, #000, #000 1px, transparent 1px, transparent 2px)',
        }}
      />
    </div>
  );
};
