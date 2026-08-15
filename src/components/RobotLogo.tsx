import React from 'react';

interface RobotLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export const RobotLogo: React.FC<RobotLogoProps> = ({
  size = 32,
  showText = false,
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div 
        className="relative flex items-center justify-center rounded-xl bg-[#091529]/80 border border-cyan-500/30 p-1.5 shadow-[0_0_15px_rgba(6,182,212,0.35)]"
        style={{ width: size + 12, height: size + 12 }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: size, height: size }}
          className="text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.9)]"
        >
          {/* Outer circle circuit head */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="opacity-90"
          />

          {/* Left antenna & ear */}
          <line x1="22" y1="36" x2="22" y2="48" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <rect x="17" y="44" width="7" height="18" rx="3.5" stroke="currentColor" strokeWidth="3" fill="#070b13" />

          {/* Right antenna with signal node & ear */}
          <line x1="78" y1="32" x2="78" y2="48" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <circle cx="78" cy="28" r="3.5" fill="currentColor" />
          <rect x="76" y="44" width="7" height="18" rx="3.5" stroke="currentColor" strokeWidth="3" fill="#070b13" />

          {/* Crown and forehead plates */}
          <path
            d="M 40 22 L 40 32 L 60 32 L 60 22"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 45 38 L 55 38"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Circuit nodes left & right */}
          <circle cx="34" cy="40" r="2.5" fill="currentColor" />
          <path d="M 34 40 L 26 48 L 26 62" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          
          <circle cx="66" cy="40" r="2.5" fill="currentColor" />
          <path d="M 66 40 L 74 48 L 74 62" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Eye visor screen */}
          <rect
            x="32"
            y="46"
            width="36"
            height="16"
            rx="8"
            stroke="currentColor"
            strokeWidth="3.5"
            fill="#061224"
          />

          {/* Glowing robotic eyes */}
          <line x1="38" y1="54" x2="46" y2="54" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="54" y1="54" x2="62" y2="54" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />

          {/* Mouth/chin chassis intake */}
          <path
            d="M 40 70 L 40 78 L 60 78 L 60 70"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="50" y1="70" x2="50" y2="78" stroke="currentColor" strokeWidth="2.5" />

          {/* Bottom circuit nodes */}
          <circle cx="36" cy="65" r="2.5" fill="currentColor" />
          <path d="M 36 65 L 36 78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

          <circle cx="64" cy="65" r="2.5" fill="currentColor" />
          <path d="M 64 65 L 64 78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-display text-cyan-400 font-bold tracking-wider text-glow-cyan text-sm sm:text-base">
            WRO_BAE
          </span>
          <span className="text-[10px] text-cyan-200/60 font-mono tracking-tight uppercase">
            Robot Engineer
          </span>
        </div>
      )}
    </div>
  );
};
