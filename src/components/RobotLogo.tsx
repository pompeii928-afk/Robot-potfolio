import React from 'react';
import roboticsLogoImg from '../assets/images/robotics_logo_1787409963826.jpg';

interface RobotLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export const RobotLogo: React.FC<RobotLogoProps> = ({
  size = 34,
  showText = false,
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div
        className="relative flex items-center justify-center rounded-xl bg-[#091529] border border-cyan-500/40 p-0.5 shadow-[0_0_18px_rgba(6,182,212,0.45)] overflow-hidden group transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_24px_rgba(6,182,212,0.65)]"
        style={{ width: size + 8, height: size + 8 }}
      >
        {/* Sleek High-Tech Emblem Image */}
        <img
          src={roboticsLogoImg}
          alt="K.F.C.Code Chaser Robotics Emblem"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-[10px] transform transition-transform duration-500 group-hover:scale-105"
        />

        {/* Ambient Corner Flare Overlay */}
        <div className="absolute inset-0 rounded-[10px] bg-gradient-to-tr from-cyan-500/10 via-transparent to-white/15 pointer-events-none" />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-display text-cyan-400 font-extrabold tracking-wider text-glow-cyan text-sm sm:text-base">
            WRO_BAE
          </span>
          <span className="text-[10px] text-cyan-200/70 font-mono tracking-tight uppercase">
            Autonomous Robotics Engineer
          </span>
        </div>
      )}
    </div>
  );
};
