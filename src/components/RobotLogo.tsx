import React from 'react';
import kfcLogoImg from '../assets/images/kfc_codechaser_logo_1788080360188.jpg';

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
        className="relative flex items-center justify-center rounded-lg bg-white border border-[#e3e2de] p-0.5 shadow-2xs overflow-hidden group transition-all duration-300 hover:border-[#37352f]/40 hover:shadow-xs"
        style={{ width: size + 6, height: size + 6 }}
      >
        {/* KFC Code Chaser Crest Logo */}
        <img
          src={kfcLogoImg}
          alt="K.F.C. Code Chaser Crest Logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain rounded-md transform transition-transform duration-300 group-hover:scale-105"
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
