import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { cyberAudio } from '../utils/cyberAudio';

interface LogoDrawingLoaderProps {
  onComplete?: () => void;
}

export const LogoDrawingLoader: React.FC<LogoDrawingLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('INITIALIZING 3D ENGINE...');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    // Play subtle audio cue
    cyberAudio.playBootSound();

    let isCancelled = false;
    const startTime = performance.now();
    const drawDuration = 2400; // 2.4s drawing phase

    const updateFrame = (now: number) => {
      if (isCancelled) return;
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.floor((elapsed / drawDuration) * 100));

      setProgress(pct);

      if (pct < 25) {
        setStatusText('INITIALIZING 3D VECTOR MATRIX...');
      } else if (pct < 55) {
        setStatusText('CALIBRATING DUAL SENSORS & PID...');
      } else if (pct < 85) {
        setStatusText('LOADING WRO ROBOTICS EMBLEM...');
      } else if (pct < 100) {
        setStatusText('ALL SYSTEMS NOMINAL // 100%');
      } else {
        setStatusText('SYSTEM ONLINE // LAUNCHING ARCHIVE');
      }

      if (elapsed < drawDuration) {
        requestAnimationFrame(updateFrame);
      } else {
        // Drawing is 100% finished. Hold for 700ms so user sees the complete drawn emblem!
        setIsCompleted(true);
        setTimeout(() => {
          if (!isCancelled && onComplete) {
            onComplete();
          }
        }, 750);
      }
    };

    const animId = requestAnimationFrame(updateFrame);

    return () => {
      isCancelled = true;
      cancelAnimationFrame(animId);
    };
  }, [onComplete]);

  const handleSkip = () => {
    cyberAudio.playKeyTick();
    if (onComplete) onComplete();
  };

  return (
    <motion.div
      key="loader-overlay"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.05,
        filter: 'blur(12px)',
        transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
      }}
      className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center select-none overflow-hidden px-4"
    >
      {/* Subtle Cyber Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,white_90%)]" />

      {/* Center Logo Drawing Canvas */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full">
        {/* Animated SVG Path Drawing: K.F.C. Code Chaser Emblem */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center">
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-sm"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 1. Outer Cyber Hexagon / Shield (Black) */}
            <motion.polygon
              points="100,10 180,55 180,145 100,190 20,145 20,55"
              stroke="#000000"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.4, ease: 'easeInOut' }}
            />

            {/* 2. Inner Ring (Black) */}
            <motion.circle
              cx="100"
              cy="100"
              r="64"
              stroke="#000000"
              strokeWidth="2"
              strokeDasharray="6 6"
              initial={{ pathLength: 0, rotate: 0, opacity: 0 }}
              animate={{ pathLength: 1, rotate: 360, opacity: 0.85 }}
              transition={{
                pathLength: { duration: 1.6, ease: 'easeInOut' },
                rotate: { duration: 10, repeat: Infinity, ease: 'linear' },
              }}
            />

            {/* 3. Tech Crosshairs & Target Ticks (Black) */}
            <motion.line
              x1="100"
              y1="25"
              x2="100"
              y2="42"
              stroke="#000000"
              strokeWidth="2.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            <motion.line
              x1="100"
              y1="158"
              x2="100"
              y2="175"
              stroke="#000000"
              strokeWidth="2.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            <motion.line
              x1="25"
              y1="100"
              x2="42"
              y2="100"
              stroke="#000000"
              strokeWidth="2.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            <motion.line
              x1="158"
              y1="100"
              x2="175"
              y2="100"
              stroke="#000000"
              strokeWidth="2.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />

            {/* 4. Code Brackets < / > and Geometric Monogram (Black) */}
            <motion.path
              d="M 68,78 L 50,100 L 68,122"
              stroke="#000000"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.0, delay: 0.5, ease: 'easeOut' }}
            />
            <motion.path
              d="M 132,78 L 150,100 L 132,122"
              stroke="#000000"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.0, delay: 0.5, ease: 'easeOut' }}
            />
            <motion.path
              d="M 108,70 L 92,130"
              stroke="#000000"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            />

            {/* 5. Center Core Robot Chip (Black) */}
            <motion.rect
              x="82"
              y="82"
              width="36"
              height="36"
              rx="6"
              stroke="#000000"
              strokeWidth="2.5"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.7, ease: 'backOut' }}
            />
            <motion.circle
              cx="100"
              cy="100"
              r="6"
              fill="#000000"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 1.0 }}
            />
          </svg>

          {/* Solid Black Actual KFC Center Logo Fade-in */}
          <motion.img
            src="/kfc_codechaser_logo.png"
            alt="K.F.C. Logo"
            className="absolute w-20 h-20 sm:w-24 sm:h-24 object-contain pointer-events-none"
            style={{ filter: 'brightness(0)' }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{
              opacity: progress > 50 ? 1 : progress * 0.02,
              scale: progress > 70 ? 1 : 0.8 + progress * 0.002,
            }}
            transition={{ duration: 0.4 }}
          />

          {/* High-speed Black Laser Scanning Sweep Line */}
          <motion.div
            className="absolute inset-x-4 h-[2px] bg-gradient-to-r from-transparent via-black/80 to-transparent shadow-[0_0_8px_rgba(0,0,0,0.3)]"
            animate={{ top: ['15%', '85%', '15%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Typography & Title */}
        <div className="text-center mt-5 space-y-1">
          <motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="font-black text-xl sm:text-2xl tracking-tight text-zinc-900 font-sans"
          >
            K.F.C. CODE CHASER
          </motion.h1>
          <p className="font-mono text-[11px] text-zinc-500 tracking-widest uppercase font-semibold">
            AUTONOMOUS ROBOTICS // WRO ARCHIVE
          </p>
        </div>

        {/* Precision Progress Bar & Status Feed */}
        <div className="w-full mt-6 space-y-2">
          <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
            <motion.div
              className="h-full rounded-full bg-black transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-600 font-medium">
            <span className="truncate max-w-[240px] text-zinc-500">{statusText}</span>
            <span className="font-bold text-zinc-900">{progress}%</span>
          </div>
        </div>

        {/* Quick Skip Button */}
        <button
          onClick={handleSkip}
          className="mt-6 px-3.5 py-1 rounded-full text-[11px] font-mono text-zinc-400 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
        >
          [ SKIP INTRO ]
        </button>
      </div>
    </motion.div>
  );
};
