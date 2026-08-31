import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  KeyRound,
  AlertCircle,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Cpu,
  Radio,
  Terminal,
  Activity,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { useAuth, ADMIN_USERNAME } from '../firebase/AuthContext';
import { RobotLogo } from './RobotLogo';
import { CyberCanvasBackground } from './CyberCanvasBackground';
import { cyberAudio } from '../utils/cyberAudio';
import { useLanguage } from '../context/ThemeContext';

interface AdminLoginViewProps {
  onBackToPublic: () => void;
}

const BOOT_LOGS = [
  'INITIALIZING K.F.C. CODE CHASER NEURAL GATEWAY v4.2...',
  'ESTABLISHING SECURE WEBSOCKET & FIRESTORE ENCLAVE...',
  'DECRYPTING 256-BIT QUANTUM TLS PROTOCOLS...',
  'VERIFYING WRO ROBOTICS HARDWARE & TELEMETRY STREAM...',
  'CALIBRATING DUAL PID CONTROLLER & IMU SENSORS...',
  'SECURITY PROTOCOL LEVEL: OMEGA-5 [ACTIVE]',
  'ADMIN AUTHENTICATION PORTAL READY.',
];

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onBackToPublic }) => {
  const { lang, t } = useLanguage();
  const { loginWithAdminMaster, loginError, clearLoginError } = useAuth();

  // Boot sequence state
  const [isBooting, setIsBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootLogIndex, setBootLogIndex] = useState(0);

  // Audio mute state
  const [isMuted, setIsMuted] = useState(() => cyberAudio.getMuted());

  // Master key credentials state
  const [masterUsername, setMasterUsername] = useState(ADMIN_USERNAME);
  const [masterPassword, setMasterPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAccessGranted, setIsAccessGranted] = useState(false);

  // 3D Card Tilt state
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [cardTransform, setCardTransform] = useState({ rotateX: 0, rotateY: 0 });

  // Latency & System Pulse simulator
  const [liveLatency, setLiveLatency] = useState(14);
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  // Clock ticker
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTimeStr(
        d.toTimeString().split(' ')[0] + '.' + String(d.getMilliseconds()).padStart(3, '0')
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, []);

  // Latency random pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveLatency(Math.floor(10 + Math.random() * 12));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Boot Initializer Sequence (0 ~ 1.4s)
  useEffect(() => {
    cyberAudio.playBootSound();

    let p = 0;
    const interval = setInterval(() => {
      p += 4;
      if (p > 100) p = 100;
      setBootProgress(p);

      const logIdx = Math.min(
        BOOT_LOGS.length - 1,
        Math.floor((p / 100) * BOOT_LOGS.length)
      );
      setBootLogIndex(logIdx);

      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsBooting(false);
        }, 350);
      }
    }, 35);

    return () => clearInterval(interval);
  }, []);

  // Handle Card Mouse Move for 3D holographic tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotateX = -(y / (rect.height / 2)) * 6; // Max 6 deg
    const rotateY = (x / (rect.width / 2)) * 6;
    setCardTransform({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setCardTransform({ rotateX: 0, rotateY: 0 });
  };

  // Sound toggle
  const toggleSound = () => {
    const nextMuted = cyberAudio.toggleMuted();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      cyberAudio.playKeyTick();
    }
  };

  // Replay boot sequence
  const handleReplayBoot = () => {
    cyberAudio.playBootSound();
    setIsBooting(true);
    setBootProgress(0);
    setBootLogIndex(0);

    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      if (p > 100) p = 100;
      setBootProgress(p);
      const logIdx = Math.min(
        BOOT_LOGS.length - 1,
        Math.floor((p / 100) * BOOT_LOGS.length)
      );
      setBootLogIndex(logIdx);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => setIsBooting(false), 300);
      }
    }, 30);
  };

  // Handle Master Key Sign In
  const handleMasterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!masterUsername.trim() || !masterPassword) return;

    cyberAudio.playScanLaser();
    setIsSubmitting(true);
    if (loginError) clearLoginError();

    try {
      await loginWithAdminMaster(masterUsername.trim(), masterPassword);

      // Access Granted Visual & Audio Extravaganza
      setIsAccessGranted(true);
      cyberAudio.playAccessGranted();

      // Confetti laser burst
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#10b981', '#3b82f6', '#a855f7', '#ffffff'],
        });
      } catch {
        // Safe ignore
      }
    } catch {
      cyberAudio.playAccessDenied();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative selection:bg-cyan-500/30 selection:text-cyan-200 overflow-hidden font-sans">
      {/* 60fps Cyber Matrix & Constellation Background */}
      <CyberCanvasBackground />

      {/* Cyber Initializer Boot HUD Overlay */}
      <AnimatePresence>
        {isBooting && (
          <motion.div
            key="cyber-boot-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 bg-[#04060a]/90 backdrop-blur-md flex flex-col items-center justify-center p-6"
            onClick={() => setIsBooting(false)}
          >
            {/* Holographic scanner laser line */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.div
                animate={{ y: ['-10%', '110%'] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
                className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80 shadow-[0_0_20px_#06b6d4]"
              />
            </div>

            <div className="w-full max-w-lg space-y-6 relative z-10 text-center">
              {/* Circular Gauge */}
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    className="stroke-slate-800"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="56"
                    cy="56"
                    r="48"
                    className="stroke-cyan-400"
                    strokeWidth="4"
                    strokeDasharray={301.6}
                    strokeDashoffset={301.6 - (301.6 * bootProgress) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    style={{
                      filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.8))',
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-2xl font-black text-cyan-300 tracking-tight">
                    {bootProgress}%
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400 font-semibold tracking-wider">
                    SEC_BOOT
                  </span>
                </div>
              </div>

              {/* Console Stream */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span>K.F.C. CODE CHASER OS INITIALIZATION</span>
                </div>

                <div className="h-12 flex items-center justify-center">
                  <motion.p
                    key={bootLogIndex}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-mono text-xs text-slate-300 max-w-md px-4"
                  >
                    &gt; {BOOT_LOGS[bootLogIndex]}
                  </motion.p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-900/80 rounded-full h-1.5 overflow-hidden border border-slate-700/60 p-0.5">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-blue-500 rounded-full shadow-[0_0_12px_#06b6d4]"
                  style={{ width: `${bootProgress}%` }}
                />
              </div>

              {/* Skip hint */}
              <div className="text-[11px] font-mono text-slate-500 flex items-center justify-center gap-1 cursor-pointer hover:text-cyan-400 transition-colors">
                <span>클릭하여 즉시 진입하기 (Click to Skip)</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top HUD Controls Bar */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-md mb-4 flex justify-between items-center z-10"
      >
        <button
          onClick={onBackToPublic}
          onMouseEnter={() => cyberAudio.playKeyTick()}
          className="px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/70 hover:border-cyan-500/60 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-lg backdrop-blur-md group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
          <span>포트폴리오 메인으로</span>
        </button>

        {/* Right HUD quick toggles */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/70 hover:border-cyan-500/60 text-slate-300 text-xs transition-colors cursor-pointer shadow-md"
            title={isMuted ? '음향 켜기 (Sound On)' : '음향 끄기 (Mute)'}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            )}
          </button>

          {/* Replay Boot FX */}
          <button
            onClick={handleReplayBoot}
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/70 hover:border-cyan-500/60 text-slate-300 text-xs transition-colors cursor-pointer shadow-md"
            title="부팅 시퀀스 다시보기 (Replay Boot FX)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          <span className="text-[10px] font-mono px-2 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 flex items-center gap-1">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>SEC_PORTAL</span>
          </span>
        </div>
      </motion.div>

      {/* Main Holographic Cyber Terminal Card */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, scale: 0.94, y: 24, filter: 'blur(8px)' }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${cardTransform.rotateX}deg) rotateY(${cardTransform.rotateY}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
        className="w-full max-w-md bg-slate-900/85 border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] backdrop-blur-xl overflow-hidden relative z-10"
      >
        {/* Holographic Laser Scanner Line across the card */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          <motion.div
            animate={{ y: ['-100%', '300%'] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full h-16 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent border-b border-cyan-400/20"
          />
        </div>

        {/* Futuristic Corner Tech Brackets */}
        <div className="absolute top-2 left-2 text-cyan-500/60 font-mono text-[9px] pointer-events-none select-none">
          ┌──[SYS_01]
        </div>
        <div className="absolute top-2 right-2 text-cyan-500/60 font-mono text-[9px] pointer-events-none select-none">
          [TLS_OK]──┐
        </div>
        <div className="absolute bottom-2 left-2 text-cyan-500/60 font-mono text-[9px] pointer-events-none select-none">
          └──[ENC_256]
        </div>
        <div className="absolute bottom-2 right-2 text-cyan-500/60 font-mono text-[9px] pointer-events-none select-none">
          [NODE_443]──┘
        </div>

        {/* Card Header */}
        <div className="px-6 py-5 border-b border-cyan-500/20 bg-slate-950/60 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="relative">
              <RobotLogo size={28} />
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-sans font-bold text-white tracking-tight flex items-center gap-2">
                <span>K.F.C. Code Chaser</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                  ADMIN OS
                </span>
              </h2>
              <p className="text-[11px] font-mono text-slate-400">
                MASTER SECURITY AUTHENTICATION GATEWAY
              </p>
            </div>
          </div>

          <div className="text-right font-mono text-[10px] text-slate-400 space-y-0.5 hidden sm:block">
            <div className="text-cyan-400 font-semibold">{currentTimeStr}</div>
            <div className="text-emerald-400">{liveLatency}ms LATENCY</div>
          </div>
        </div>

        {/* Telemetry Live Bar */}
        <div className="px-6 py-2 bg-cyan-950/30 border-b border-cyan-500/15 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Activity className="w-3 h-3 animate-pulse" />
            <span>FIREWALL: ACTIVE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cyan-300">CORE: ONLINE</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">CLEARANCE: LV.5</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-7 space-y-5 relative">
          {/* Access Granted Flash Overlay */}
          <AnimatePresence>
            {isAccessGranted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 bg-emerald-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-3"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-[0_0_30px_#10b981]">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-mono text-base font-bold text-emerald-300 tracking-wider">
                    ACCESS GRANTED
                  </h3>
                  <p className="text-xs font-mono text-emerald-200">
                    권한 인증 완료: 관리자 모드로 전환 중...
                  </p>
                </div>
                <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Alert */}
          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs font-mono flex items-start gap-2.5 shadow-lg"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{loginError}</div>
            </motion.div>
          )}

          {/* Master Key Admin Form */}
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-950/50 border border-cyan-500/20 text-xs font-sans space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-cyan-300 font-semibold font-mono text-xs">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>MASTER CIPHER AUTH</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>READY</span>
                </div>
              </div>
              <p className="text-[11px] font-sans text-slate-400 leading-relaxed">
                포트폴리오 콘텐츠 실시간 편집 및 방문자 로그 조회를 위한 관리자 전용 인증입니다.
              </p>
            </div>

            <form onSubmit={handleMasterSubmit} className="space-y-4">
              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-semibold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                    <span>ADMIN IDENTIFIER</span>
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400/80">ID</span>
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    required
                    value={masterUsername}
                    onChange={(e) => {
                      setMasterUsername(e.target.value);
                      cyberAudio.playKeyTick();
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 focus:border-cyan-400 rounded-xl text-xs font-mono text-white placeholder-slate-500 outline-none transition-all shadow-inner focus:shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-semibold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>MASTER KEY (PASSWORD)</span>
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400/80">ENCRYPTED</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={masterPassword}
                    onChange={(e) => {
                      setMasterPassword(e.target.value);
                      cyberAudio.playKeyTick();
                    }}
                    placeholder="••••••••••••"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-950/80 border border-slate-700/80 focus:border-cyan-400 rounded-xl text-xs font-mono text-white placeholder-slate-500 outline-none transition-all shadow-inner focus:shadow-[0_0_15px_rgba(6,182,212,0.25)] tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowPassword(!showPassword);
                      cyberAudio.playKeyTick();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300 transition-colors p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button with High-tech Glow */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isSubmitting || !masterUsername.trim() || !masterPassword}
                onMouseEnter={() => cyberAudio.playScanLaser()}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-mono font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                {/* Button light sweep effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>AUTHENTICATING MASTER CIPHER...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-cyan-200 animate-pulse" />
                    <span>INITIALIZE ADMIN SESSION</span>
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </div>

        {/* Card Footer Telemetry */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-cyan-500/20 text-center flex items-center justify-between text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>SESSION: TLS_AES_256_GCM</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-400 font-semibold">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>READY FOR DEPLOY</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
