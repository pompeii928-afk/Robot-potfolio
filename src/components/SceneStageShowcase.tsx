import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  ChevronDown,
  RotateCcw,
  Play,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  AboutConfig,
  ProjectItem,
  JourneyItem,
  AwardItem,
  SkillItem,
  YouTubeVideoItem,
  ExternalSiteItem,
  CompetitionReviewItem,
} from '../types';
import { cyberAudio } from '../utils/cyberAudio';

interface SceneStageShowcaseProps {
  sceneIndex: number;
  totalScenes: number;
  onNavigate: (sectionId: string) => void;
  onNextScene: () => void;
  onPrevScene?: () => void;
  onSelectScene?: (index: number) => void;
  aboutData: AboutConfig;
  projects: ProjectItem[];
  journeys: JourneyItem[];
  awards: AwardItem[];
  skills: SkillItem[];
  youtubeVideos: YouTubeVideoItem[];
  websites: ExternalSiteItem[];
  reviews: CompetitionReviewItem[];
  isAdmin?: boolean;
  onEditAbout?: () => void;
  onOpenProjectDetail?: (project: ProjectItem) => void;
}

export const SceneStageShowcase: React.FC<SceneStageShowcaseProps> = ({
  sceneIndex,
  totalScenes,
  onNavigate,
  onNextScene,
  onPrevScene,
  onSelectScene,
  aboutData,
  projects,
  journeys,
  awards,
  skills,
  youtubeVideos,
  websites,
  reviews,
}) => {
  // Alche Studio Quaternion Telemetry values
  const [quat, setQuat] = useState({ x: 0.3, y: -0.86, z: 0.3, w: 0.27 });

  // Update telemetry smoothly based on sceneIndex
  useEffect(() => {
    const rot = sceneIndex * 0.48;
    setQuat({
      x: Number((Math.sin(rot) * 0.42).toFixed(2)),
      y: Number((-0.86 + Math.cos(rot) * 0.25).toFixed(2)),
      z: Number((Math.sin(rot * 1.5) * 0.35).toFixed(2)),
      w: Number((Math.cos(rot * 0.8) * 0.38 + 0.2).toFixed(2)),
    });
  }, [sceneIndex]);

  // Exact 8 Category Cards as written by the user (matching top navbar categories)
  const stages = [
    {
      index: 1,
      id: 'about',
      categoryId: 'about',
      title: '소개 & 비전',
      subtitle: 'K.F.C. Code Chaser Autonomous Robotics',
      date: '2026 // MISSION',
      summary: 'WRO(World Robot Olympiad) 로봇 공학 아카이브 및 미래 비전',
      description:
        aboutData.bio ||
        'WRO 로봇 대회 참가와 자율주행 로봇 구조 연구, 메카넘/옴니 제어 알고리즘 개발을 목표로 하는 공식 로봇 공학 아카이브입니다.',
      image: aboutData.heroImage || '/kfc_codechaser_logo.png',
      tags: ['WRO-Korea', 'Autonomous-Robot', 'Neural-Control'],
      detailsPreview: '로봇 기구 설계 및 자율주행 알고리즘 연구 배경과 팀 철학 소개',
    },
    {
      index: 2,
      id: 'experience',
      categoryId: 'experience',
      title: '로봇 시스템',
      subtitle: projects[0]?.title || 'Mecanum 4WD Autonomous Mission Robot',
      date: 'HARDWARE & SYSTEMS',
      summary: '실전 대회에 투입된 메카넘 4WD 및 옴니휠 구동계 자율주행 로봇 하드웨어',
      description:
        projects[0]?.summary ||
        '고정밀 옴니/메카넘 휠 구동계와 비전 센서 기반 실전 로봇 아키텍처 및 3D 기구 설계',
      image: projects[0]?.image || '/kfc_codechaser_logo.png',
      tags: ['Mecanum-4WD', 'PID-LineTracker', 'Dual-Vision', 'Custom-Chassis'],
      detailsPreview: `${projects.length}개 실전 로봇 하드웨어 상세 스펙 및 회로 다이어그램`,
    },
    {
      index: 3,
      id: 'journey',
      categoryId: 'journey',
      title: '대회 여정',
      subtitle: journeys[0]?.title || 'WRO 한국대회 및 국가대표 선발전 도전기',
      date: '2021 ~ 2026 JOURNEY',
      summary: '대회 준비 과정, 필드 캘리브레이션 위기 극복 및 팀워크 성장 마일스톤',
      description:
        journeys[0]?.description ||
        '수백 회의 실전 런 테스트와 경기장 조명·마찰력 변수에 대응한 실전 트러블슈팅 일지',
      image: '/wro-oc-regular-apac-india-2026.webp',
      tags: ['Competition-Journey', 'Milestone-Log', 'Field-Calibration', 'Teamwork'],
      detailsPreview: `${journeys.length}개의 시즌별 실전 대회 도전 및 성장 마일스톤 기록`,
    },
    {
      index: 4,
      id: 'awards',
      categoryId: 'awards',
      title: '수상 내역',
      subtitle: awards[0]?.title || 'WRO 전국대회 및 정규종목 공인 수상',
      date: 'HONORS & AWARDS',
      summary: 'WRO 전국대회 및 공인 로봇 경진대회 공식 수상 실적과 상장 증빙',
      description:
        awards[0]?.description ||
        '미션 완수율 99.8% 달성 및 전국 공인 로봇 경진대회 대상, 금상, 기술상 수상 기록',
      image: projects[1]?.image || aboutData.heroImage || '/kfc_codechaser_logo.png',
      tags: ['Grand-Prix', 'Gold-Medal', 'Verified-Honor', 'Certified-Score'],
      detailsPreview: `${awards.length}개 공인 대회 수상 실적 및 공식 스코어 기록`,
    },
    {
      index: 5,
      id: 'skills',
      categoryId: 'skills',
      title: '핵심 역량',
      subtitle: '기구 설계, 임베디드 펌웨어, 비전 AI, 관제 소프트웨어',
      date: 'CORE CAPABILITIES',
      summary: '4대 엔지니어링 핵심 기술 스택 및 풀스택 로보틱스 아키텍처',
      description:
        '하드웨어 링크 구조부터 상위 알고리즘까지 전 과정을 관통하는 풀스택 로보틱스',
      image: projects[1]?.image || aboutData.heroImage || '/kfc_codechaser_logo.png',
      tags: ['Robotics-Control', 'OpenCV-Vision', 'Embedded-MCU', 'FullStack-Web'],
      detailsPreview: `${skills.length}개 전문 기술 스택 및 라이브러리 숙련도`,
    },
    {
      index: 6,
      id: 'youtube',
      categoryId: 'youtube',
      title: '유튜브 채널',
      subtitle: youtubeVideos[0]?.title || 'K.F.C. Code Chaser Match Run Analysis',
      date: 'BROADCAST & 4K MEDIA',
      summary: '공식 유튜브 채널을 통한 경기장 실전 주행 및 미션 완수 풀영상 스트리밍',
      description:
        youtubeVideos[0]?.title ||
        '공식 채널을 통해 경기장 실전 주행 및 미션 완수 풀 영상을 실시간 시청',
      image: youtubeVideos[0]?.thumbnail || '/kfc_codechaser_logo.png',
      tags: ['YouTube-Channel', 'Match-Clips', 'Autonomous-Driving', 'Clear-Run'],
      detailsPreview: `${youtubeVideos.length}개 실전 경기 주행 영상 및 미션 완수 풀버전`,
    },
    {
      index: 7,
      id: 'reviews',
      categoryId: 'reviews',
      title: '대회 후기',
      subtitle: reviews[0]?.title || '2026 WRO 대회 참가 총평 및 피드백',
      date: 'TESTIMONIALS & REVIEWS',
      summary: '대회를 함께 치른 팀원들과 지도 멘토의 솔직한 협업 소감 및 추천평',
      description:
        reviews[0]?.overviewSummary ||
        '대회를 함께한 팀원·멘토들의 기술 검증 추천평과 대회장 위기 극복 생생한 후기',
      image: reviews[0]?.coverImage || '/kfc_codechaser_logo.png',
      tags: ['Team-Reviews', 'Mentor-Feedback', 'Collaboration', 'Retrospective'],
      detailsPreview: `${reviews.length}개의 진솔한 대회 참가 후기 및 기술 추천평`,
    },
    {
      index: 8,
      id: 'external-site',
      categoryId: 'external-site',
      title: '다른 왭사이트',
      subtitle: websites[0]?.title || 'wro-2026-selling-site & Ecosystem Portals',
      date: 'ECOSYSTEM & LINKS',
      summary: '로봇 부품 공식 판매 포털 및 연계 에코시스템 사이트',
      description:
        websites[0]?.description ||
        '로봇 부품 공식 판매 포털(wro-2026-selling-site) 및 관련 연계 플랫폼 바로가기',
      image: projects[0]?.image || '/kfc_codechaser_logo.png',
      tags: ['Official-Store', 'Ecosystem-Portals', 'External-Links', 'Parts-Market'],
      detailsPreview: `${websites.length}개 연계 공식 웹사이트 및 부품 판매 스토어`,
    },
  ];

  const currentStage = stages.find((s) => s.index === sceneIndex) || stages[0];

  return (
    <div className="relative w-full h-full flex-1 flex flex-col justify-between overflow-hidden select-none">
      {/* Top right Quaternion Telemetry HUD */}
      <div className="absolute top-2 right-4 sm:right-8 z-30 hidden md:flex items-center gap-3 py-1.5 px-3 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white font-mono text-[11px] pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-zinc-400 uppercase tracking-wider text-[10px]">Quat:</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-300">
          <span>x:{quat.x}</span>
          <span>y:{quat.y}</span>
          <span>z:{quat.z}</span>
          <span>w:{quat.w}</span>
        </div>
      </div>

      {/* =========================================================================
          CONTINUOUS 3D CURVED TRACK (모든 카드가 한 트랙에 이어져서 3D 곡면으로 흐름)
          ========================================================================= */}
      <div
        className="relative flex-1 w-full flex items-center justify-center overflow-visible"
        style={{ perspective: '1400px', transformStyle: 'preserve-3d' }}
      >
        {/* =====================================================================
            STAGE 0: HERO OPENING (처음 화면: 로고만 있고 스크롤 대기)
            ===================================================================== */}
        <div
          className={`absolute inset-0 flex flex-col justify-between items-center px-4 py-8 pointer-events-none transition-all duration-700 ${
            sceneIndex === 0
              ? 'opacity-100 scale-100 z-20'
              : 'opacity-0 scale-95 pointer-events-none -z-10'
          }`}
        >
          {/* Top minimal subtitle */}
          <div className="w-full max-w-7xl mx-auto flex items-center justify-between text-xs font-mono text-zinc-700 font-bold">
            <span className="tracking-widest uppercase font-bold text-zinc-700">
              [ 00 // INITIAL ]
            </span>
            <span className="tracking-widest uppercase font-bold text-zinc-900">
              AUTONOMOUS ROBOTICS // ARCHIVE
            </span>
          </div>

          {/* Center Space is 100% open for the 3D Logo! (Hero3DLogo floats in full glory) */}
          <div className="flex-1 w-full flex items-center justify-center" />

          {/* Bottom Prominent Scroll Prompt */}
          <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto">
            <div className="space-y-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight font-sans">
                K.F.C. CODE CHASER
              </h1>
              <p className="text-xs font-mono text-zinc-800 font-semibold">
                WRO Robot Engineering &amp; Autonomous Systems Archive
              </p>
            </div>

            <button
              onClick={() => {
                cyberAudio.playScanLaser();
                onNextScene();
              }}
              className="px-6 py-3 rounded-full bg-zinc-900 text-white hover:bg-black transition-all flex items-center gap-3 font-mono text-xs font-semibold shadow-lg hover:shadow-cyan-500/20 cursor-pointer group border border-zinc-700/50"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="tracking-wider uppercase">카테고리 둘러보기 ↓</span>
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform text-cyan-400" />
            </button>
          </div>
        </div>

        {/* =====================================================================
            ALL 8 CARDS RENDERED SIMULTANEOUSLY ON CONNECTED 3D CURVED TRACK
            새로운 페이지 로드 느낌 없이 카드가 하나로 이어져서 오른쪽에서 나옴
            ===================================================================== */}
        {stages.map((stage) => {
          const diff = stage.index - sceneIndex;
          const isCenter = diff === 0;
          const isPrev = diff === -1;
          const isNext = diff === 1;

          // 3D Cylindrical placement calculation (Continuous smooth curve)
          // When sceneIndex === 0: all cards have diff >= 1 (positioned on the right side)
          let translateX = diff * 84; // %
          let rotateY = diff * -25; // deg
          let translateZ = -Math.abs(diff) * 110; // px
          let scale = 1;
          let opacity = 1;

          if (isCenter) {
            translateX = 0;
            rotateY = -2;
            translateZ = 0;
            scale = 1;
            opacity = 1;
          } else if (isPrev) {
            translateX = -82;
            rotateY = 26;
            translateZ = -100;
            scale = 0.88;
            opacity = 0.65;
          } else if (isNext) {
            translateX = 82;
            rotateY = -26;
            translateZ = -100;
            scale = 0.88;
            opacity = 0.65;
          } else if (diff > 1) {
            translateX = 82 + (diff - 1) * 35;
            rotateY = -34;
            translateZ = -220 - (diff - 1) * 60;
            scale = 0.76;
            opacity = diff === 2 ? 0.3 : 0;
          } else if (diff < -1) {
            translateX = -82 + (diff + 1) * 35;
            rotateY = 34;
            translateZ = -220 - (Math.abs(diff) - 1) * 60;
            scale = 0.76;
            opacity = diff === -2 ? 0.3 : 0;
          }

          const zIndex = 20 - Math.abs(diff) * 4;

          return (
            <div
              key={stage.id}
              onClick={() => {
                if (isCenter) {
                  cyberAudio.playScanLaser();
                  onNavigate(stage.categoryId);
                } else if (isPrev && onPrevScene) {
                  cyberAudio.playKeyTick();
                  onPrevScene();
                } else if (isNext) {
                  cyberAudio.playScanLaser();
                  onNextScene();
                } else if (onSelectScene) {
                  onSelectScene(stage.index);
                }
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  cyberAudio.playScanLaser();
                  onNavigate(stage.categoryId);
                }
              }}
              className={`absolute w-full max-w-2xl sm:max-w-3xl aspect-[16/9] sm:aspect-[16/8.8] rounded-3xl overflow-hidden border-2 border-zinc-800/10 shadow-[0_25px_60px_rgba(0,0,0,0.18)] cursor-pointer group bg-zinc-950 select-none ${
                isCenter ? 'pointer-events-auto hover:scale-[1.01]' : 'pointer-events-auto hover:opacity-90'
              }`}
              style={{
                transform: `translateX(${translateX}%) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`,
                opacity: sceneIndex === 0 ? (diff === 1 ? 0.4 : 0) : opacity,
                zIndex,
                transformStyle: 'preserve-3d',
                transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease',
                visibility: opacity <= 0.05 ? 'hidden' : 'visible',
              }}
              title={isCenter ? `클릭하여 ${stage.title} 상세 페이지로 이동` : `${stage.title} 카드로 이동`}
            >
              {/* Featured Visual Image with Cylindrical Curved Shading */}
              <img
                src={stage.image}
                alt={stage.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-105"
              />

              {/* Cylindrical Curved Screen Bevel / Specular Reflection Gradient */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_120%_100%_at_50%_0%,rgba(255,255,255,0.22),transparent_60%)]" />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/85 via-black/30 to-black/30" />
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.4)]" />

              {/* Center Play Icon for Video Stage */}
              {stage.id === 'youtube' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="w-16 h-16 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 fill-white ml-1" />
                  </span>
                </div>
              )}

              {/* Top-Left Category Tag */}
              <div className="absolute top-4 left-4 sm:top-5 sm:left-6 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/95 text-black shadow-xs">
                  {stage.title}
                </span>
                <span className="hidden sm:inline-block px-3 py-1 rounded-full text-[10px] font-mono text-zinc-300 bg-black/60 border border-white/10">
                  {stage.date}
                </span>
              </div>

              {/* Top-Right Link */}
              <div className="absolute top-4 right-4 sm:top-5 sm:right-6 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-black/80 text-white border border-white/20 group-hover:bg-cyan-500 group-hover:text-black group-hover:border-cyan-400 transition-colors shadow-xs">
                <span>자세히 보기</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>

              {/* Card Bottom Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-black via-black/80 to-transparent text-white space-y-2 pointer-events-none">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight font-sans text-white">
                    {stage.title}
                  </h3>
                  <span className="text-[11px] font-mono text-zinc-300">
                    {stage.detailsPreview}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 font-sans">
                  {stage.summary}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {stage.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-white/10 text-cyan-300 border border-white/15 backdrop-blur-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================================================
          BOTTOM BAR: EXACT CATEGORY TITLE, SUMMARY & "MORE WORKS ↗"
          스크롤 시 카드가 이어지며 현재 선택된 카테고리의 정보가 자연스럽게 갱신됨
          ========================================================================= */}
      {sceneIndex >= 1 && (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 pt-2 pb-4 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
          {/* Bottom-Left Information Metadata */}
          <div className="space-y-1 max-w-2xl">
            <div className="font-mono text-xs sm:text-sm text-zinc-800 font-bold tracking-wider">
              {currentStage.date}
            </div>
            <h2
              onClick={() => onNavigate(currentStage.categoryId)}
              className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight font-sans hover:text-cyan-700 transition-colors cursor-pointer"
            >
              {currentStage.title}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-800 font-medium line-clamp-1 font-sans">
              {currentStage.summary}
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-zinc-700 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
              <span>
                상단 바에서 세부사항을 선택하거나, 카드를 클릭하면 해당 카테고리로 바로 이동합니다.
              </span>
            </div>
          </div>

          {/* Bottom-Right "More Works ↗" Link */}
          <div className="flex items-center gap-4 shrink-0 mt-2 sm:mt-0">
            <button
              onClick={() => {
                cyberAudio.playScanLaser();
                onNavigate(currentStage.categoryId);
              }}
              className="group flex items-center gap-2 font-mono text-sm sm:text-base font-bold text-zinc-900 hover:text-cyan-700 transition-colors cursor-pointer"
            >
              <span>{currentStage.title} 자세히 보기</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
