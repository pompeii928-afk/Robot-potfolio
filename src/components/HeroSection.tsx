import React, { useState } from 'react';
import { Flag, Terminal, Cpu, Sparkles, Activity, ShieldCheck, Zap, Edit3 } from 'lucide-react';
import { AboutConfig } from '../types';

interface HeroSectionProps {
  aboutData: AboutConfig;
  isAdmin?: boolean;
  onEditAbout?: () => void;
  onExploreProjects?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  aboutData,
  isAdmin = false,
  onEditAbout,
  onExploreProjects,
}) => {
  const [activeTab, setActiveTab] = useState<'work' | 'about'>('work');
  const [isSimulating, setIsSimulating] = useState(false);
  const [jointAngle, setJointAngle] = useState(42.5);

  const toggleSimulation = () => {
    setIsSimulating(!isSimulating);
    if (!isSimulating) {
      setJointAngle((prev) => (prev > 70 ? 25.0 : prev + 15.2));
    }
  };

  return (
    <section id="about" className="relative pt-8 pb-16 sm:pt-14 sm:pb-24 overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Bio & Intro */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
            {/* Top Toolbar with Admin Edit Button */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 text-xs font-mono w-fit box-glow-cyan">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-semibold tracking-wider">v1.0.0_INITIALIZED</span>
              </div>

              {isAdmin && onEditAbout && (
                <button
                  onClick={onEditAbout}
                  id="edit-about-btn"
                  className="px-3 py-1 rounded-lg bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-400/50 text-cyan-300 text-xs font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>소개 & 이미지 수정</span>
                </button>
              )}
            </div>

            {/* Main Title */}
            <div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-white">
                {aboutData.title || 'MY ROBOT'}
              </h1>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                {aboutData.subtitle || 'PORTFOLIO'}
              </h1>
            </div>

            {/* Quote & Description Card */}
            <div className="p-6 sm:p-7 rounded-xl bg-[#0a1224]/80 backdrop-blur-md border border-cyan-500/20 shadow-[0_8px_30px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:border-cyan-500/40 transition-all">
              {/* Corner accent markers */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />

              {/* Quote */}
              <blockquote className="text-base sm:text-lg font-medium text-cyan-100/90 leading-relaxed mb-4 border-l-2 border-cyan-400/60 pl-3 italic">
                {aboutData.quote}
              </blockquote>

              {/* Bio Paragraphs */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-3 whitespace-pre-line">
                {aboutData.bio}
              </p>

              {aboutData.subBio && (
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-5 whitespace-pre-line">
                  {aboutData.subBio}
                </p>
              )}

              {/* Goal Box */}
              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs sm:text-sm text-cyan-300 font-medium">
                <Flag className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  <strong className="text-cyan-200">Goal:</strong> {aboutData.goal}
                </span>
              </div>
            </div>

            {/* Quick Status Bar */}
            <div className="grid grid-cols-3 gap-3 font-mono text-xs text-slate-400">
              <div className="p-2.5 rounded-lg bg-[#081020]/60 border border-slate-800 flex flex-col">
                <span className="text-slate-500 text-[10px]">CURRENT FOCUS</span>
                <span className="text-cyan-400 font-semibold">{aboutData.currentFocus || 'WRO 2026'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#081020]/60 border border-slate-800 flex flex-col">
                <span className="text-slate-500 text-[10px]">CORE DOMAIN</span>
                <span className="text-slate-200 font-semibold">{aboutData.coreDomain || 'Robotics & AI'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#081020]/60 border border-slate-800 flex flex-col">
                <span className="text-slate-500 text-[10px]">TEAM ROLE</span>
                <span className="text-purple-400 font-semibold">{aboutData.teamRole || 'Lead & Dev'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Cybernetic Robot Arm Visual Frame */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl bg-[#081022] border border-cyan-500/30 overflow-hidden shadow-[0_0_35px_rgba(6,182,212,0.25)] group">
              {/* Window Titlebar */}
              <div className="px-4 py-3 bg-[#060c1a] border-b border-cyan-500/20 flex items-center justify-between">
                {/* Traffic dots */}
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]" />
                  <span className="text-xs font-mono text-slate-400 ml-2">ROBOT_SYS_VIEWER</span>
                </div>

                {/* Tab buttons */}
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <button
                    onClick={() => setActiveTab('work')}
                    className={`px-3 py-1 rounded transition-all ${
                      activeTab === 'work'
                        ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 text-glow-cyan'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Work
                  </button>
                  <button
                    onClick={() => setActiveTab('about')}
                    className={`px-3 py-1 rounded transition-all ${
                      activeTab === 'about'
                        ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 text-glow-cyan'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    About
                  </button>
                </div>
              </div>

              {/* Main Visual Image Area */}
              <div className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden bg-slate-950">
                <img
                  src={aboutData.heroImage || '/src/assets/images/hero_robot_arm_1786764552106.jpg'}
                  alt="Robotic Manipulator Arm System"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Cyber HUD Grid & Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#060c1a] via-transparent to-transparent opacity-80" />
                <div className="absolute inset-0 bg-blueprint-dense opacity-20 pointer-events-none" />

                {/* Live Telemetry Box Top Right */}
                <div className="absolute top-3 right-3 px-3 py-2 rounded-lg bg-[#060e1d]/85 backdrop-blur-md border border-cyan-500/30 font-mono text-[11px] space-y-1 text-slate-300">
                  <div className="flex items-center justify-between gap-3 text-cyan-400">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
                      JOINT_J1
                    </span>
                    <span className="font-bold">{jointAngle.toFixed(1)}°</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-slate-400">
                    <span>TORQUE</span>
                    <span className="text-emerald-400">NORMAL</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-slate-400">
                    <span>STATUS</span>
                    <span className="text-cyan-300">ARMED</span>
                  </div>
                </div>

                {/* Bottom Left Tag */}
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 font-mono text-[11px] sm:text-xs text-slate-400 bg-[#060c1a]/80 px-2.5 py-1 rounded border border-slate-800">
                  PROJECT: SENTINEL // CIRCUIT FABRICATION
                </div>

                {/* Bottom Right System Status */}
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex items-center gap-2 font-mono text-xs sm:text-sm font-semibold text-cyan-400 bg-[#060c1a]/90 px-3 py-1.5 rounded-lg border border-cyan-500/40 box-glow-cyan">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="tracking-wider">SYS.RENDER_ACTIVE //</span>
                </div>
              </div>

              {/* Interactive Telemetry Trigger Footer */}
              <div className="px-4 py-2.5 bg-[#060c1a] border-t border-cyan-500/20 flex items-center justify-between text-xs font-mono text-slate-400">
                <button
                  onClick={toggleSimulation}
                  className="hover:text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span>[CLICK TO TEST SERVO ANGLE]</span>
                </button>
                <span className="text-[11px] text-slate-500">AUTONOMOUS FEED v2.4</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
