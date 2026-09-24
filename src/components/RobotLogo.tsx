import React from 'react';
import kfcLogoImg from '../assets/images/kfc_codechaser_logo_transparent.png';

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
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        className="relative flex items-center justify-center rounded-lg bg-black border border-zinc-800 p-0.5 shadow-xs overflow-hidden group transition-all duration-300 hover:scale-105"
        style={{ width: size + 6, height: size + 6 }}
      >
        {/* KFC Code Chaser YouTube Channel Logo */}
        <img
          src="/favicon.svg?v=4"
          alt="K.F.C. Code Chaser Logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-sans text-[#37352f] font-bold tracking-tight text-sm sm:text-base">
            K.F.C. Code Chaser
          </span>
          <span className="text-[10px] text-[#787774] font-mono tracking-tight uppercase">
            Autonomous Robotics Team
          </span>
        </div>
      )}
    </div>
  );
};
