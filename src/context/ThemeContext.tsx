import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'dark' | 'light';
export type Language = 'ko' | 'en' | 'ja' | 'zh' | 'es' | 'de' | 'fr';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'ko', label: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ja', label: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'zh', label: 'Chinese', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'es', label: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'French', nativeName: 'Français', flag: '🇫🇷' },
];

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultText?: string) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const THEME_STORAGE_KEY = 'kfc_theme_mode';
export const LANG_STORAGE_KEY = 'kfc_language';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme: ThemeMode = 'light';

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
  }, []);

  const toggleTheme = () => {
    // Kept for interface compatibility; no-op in clean Notion light mode
  };

  const setTheme = () => {
    // Kept for interface compatibility
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Dictionary of Translations
export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  ko: {
    // Navigation
    'nav.overview': '전체 보기',
    'nav.about': '소개 & 비전',
    'nav.journey': '대회 여정',
    'nav.awards': '수상 내역',
    'nav.skills': '핵심 역량',
    'nav.experience': '로봇 시스템',
    'nav.youtube': '유튜브 채널',
    'nav.contact': 'CONTACT',
    'nav.subtitle': 'ROBOTICS & AUTONOMOUS SYSTEMS',
    'nav.online': 'ONLINE',

    // Hero Section
    'hero.badge': 'ROBOTICS & AUTONOMOUS SYSTEMS',
    'hero.editAbout': '소개 & 이미지 수정',
    'hero.goalLabel': '목표',
    'hero.focusLabel': '주요 분야',
    'hero.domainLabel': '핵심 도메인',
    'hero.roleLabel': '팀 역할',
    'hero.exploreBtn': '프로젝트 및 여정 보기',
    'hero.robotFrameTitle': 'ROBOTIC MANIPULATOR',
    
    // Journey Section
    'journey.badge': 'CHRONOLOGICAL ARCHIVE',
    'journey.title': '대회 및 연구 여정',
    'journey.subtitle': '실패와 성공, 끊임없는 문제 해결을 통해 성장해 온 로봇 엔지니어링의 기록입니다.',
    'journey.addBtn': '+ 새 여정 기록 추가',
    'journey.roles': '담당 역할',
    'journey.strengths': '잘한 점 & 강점',
    'journey.improvements': '보완할 점 & 개선 사항',
    'journey.keyPoints': '주요 기술 및 문제 해결 과정',
    'journey.metrics': '성과 지표',
    'journey.expandDetails': '상세 기록 및 엔지니어링 분석 보기',
    'journey.collapseDetails': '접기',
    'journey.edit': '수정',
    'journey.delete': '삭제',
    'journey.deleteConfirm': '이 여정 기록을 삭제하시겠습니까?',

    // Awards Section
    'awards.badge': 'HONORS & RECOGNITION',
    'awards.title': '수상 및 성과 내역',
    'awards.subtitle': '국내외 로봇 경진대회 및 자율주행 챌린지에서 달성한 수상 기록입니다.',
    'awards.addBtn': '+ 새 수상 내역 추가',
    'awards.filterAll': '전체 보기',
    'awards.unlocked': '최고 성과 달성',
    'awards.category': '분야',
    'awards.score': '점수/기록',
    'awards.rank': '순위',
    'awards.edit': '수정',
    'awards.delete': '삭제',
    'awards.deleteConfirm': '이 수상 내역을 삭제하시겠습니까?',

    // Skills Section
    'skills.badge': 'CORE COMPETENCIES',
    'skills.title': '핵심 엔지니어링 역량',
    'skills.subtitle': '하드웨어 설계 및 제작부터 펌웨어, 자율주행 알고리즘까지 보유한 기술 스택입니다.',
    'skills.addBtn': '+ 새 기술 추가',
    'skills.all': '전체 기술',
    'skills.filterAll': '전체 기술',
    'skills.proficiency': '숙련도',
    'skills.edit': '수정',
    'skills.delete': '삭제',
    'skills.deleteConfirm': '이 역량을 삭제하시겠습니까?',

    // Experience / Projects Section
    'projects.badge': 'DEPLOYED SYSTEMS',
    'projects.title': '프로젝트 및 시스템',
    'projects.subtitle': '직접 설계하고 제작하여 대회 및 필드 테스트에서 검증한 로봇 시스템입니다.',
    'projects.addBtn': '+ 새 프로젝트 추가',
    'projects.viewDetails': '자세히 보기',
    'projects.details': '상세 분석 보기',
    'projects.addPlaceholder': '새 프로젝트 등록하기',
    'projects.awaitingSummary': '새로운 로봇 프로젝트를 구상하고 개발 중입니다.',
    'projects.statusCompleted': '완료',
    'projects.statusInProgress': '개발 중',
    'projects.statusAwaiting': '준비 중',
    'projects.edit': '수정',
    'projects.delete': '삭제',
    'projects.deleteConfirm': '이 프로젝트를 삭제하시겠습니까?',

    // Project Modal
    'modal.abstract': '시스템 개요 & 목적',
    'modal.highlights': '핵심 혁신점 & 기술적 성과',
    'modal.breakthroughs': '핵심 혁신점 & 기술적 성과',
    'modal.specs': '하드웨어 & 상세 기술 사양',
    'modal.controller': '컨트롤러 / MCU',
    'modal.physical': '물리 규격',
    'modal.stack': '소프트웨어 & 펌웨어 스택',
    'modal.close': '닫기',
    'modal.verified': 'STATUS: VERIFIED_DATA',

    // YouTube Section
    'youtube.badge': 'OFFICIAL MEDIA & RUNS',
    'youtube.title': '공식 유튜브 채널 및 실전 주행',
    'youtube.subtitle': 'World Robot Olympiad (WRO) 및 자율주행 주행 테스트, PID 제어 튜닝, 하드웨어 빌드 메이킹 영상 아카이브입니다.',
    'youtube.sectionTitle': '공식 유튜브 채널 및 실전 주행',
    'youtube.sectionDesc': 'World Robot Olympiad (WRO) 및 자율주행 주행 테스트, PID 제어 튜닝, 하드웨어 빌드 메이킹 영상 아카이브입니다.',
    'youtube.visit': '채널 방문',
    'youtube.visitChannel': '채널 방문',
    'youtube.share': '공유',
    'youtube.copied': '복사됨!',
    'youtube.copyLink': '채널 링크 복사',
    'youtube.addBtn': '+ 새 영상 추가',
    'youtube.addVideo': '새 영상 추가',
    'youtube.subscribe': '채널 구독 및 전체 영상 시청',
    'youtube.allVideos': '전체 영상',
    'youtube.catAll': '전체 영상',
    'youtube.catCompetition': '대회 및 실전 경기',
    'youtube.catAlgorithm': '알고리즘 및 제어',
    'youtube.catHardware': '하드웨어 및 기구',
    'youtube.catFieldTest': '필드 테스트',
    'youtube.play': '영상 재생',
    'youtube.watchVideo': '영상 재생',
    'youtube.openExternal': 'YouTube에서 보기',
    'youtube.delete': '영상 삭제',
    'youtube.deleteConfirm': '정말로 이 유튜브 영상 항목을 삭제하시겠습니까?',
    'youtube.deleting': '삭제 중...',
    'youtube.edit': '수정',
    'youtube.noVideos': '해당 카테고리에 영상이 없습니다.',

    // Footer
    'footer.copyright': 'All Rights Reserved. Autonomous Robotics Portfolio.',
    'footer.emailCopied': '이메일 주소가 복사되었습니다!',
    'footer.copyEmail': '이메일 복사',

    // Admin & Common
    'admin.login': '관리자 로그인',
    'admin.logout': '로그아웃',
    'admin.modeActive': '관리자 편집 모드 활성화됨',
    'admin.exit': '편집 모드 종료',
    'common.save': '저장하기',
    'common.cancel': '취소',
    'common.themeDark': '다크 모드',
    'common.themeLight': '라이트 모드',
    'common.langKo': '한국어',
    'common.langEn': 'English',
  },
  en: {
    // Navigation
    'nav.overview': 'Overview',
    'nav.about': 'About & Robot',
    'nav.journey': 'Journey',
    'nav.awards': 'Awards',
    'nav.skills': 'Skills',
    'nav.experience': 'Projects',
    'nav.youtube': 'YouTube & Media',
    'nav.contact': 'CONTACT',
    'nav.subtitle': 'ROBOTICS & AUTONOMOUS SYSTEMS',
    'nav.online': 'ONLINE',

    // Hero Section
    'hero.badge': 'ROBOTICS & AUTONOMOUS SYSTEMS',
    'hero.editAbout': 'Edit Bio & Image',
    'hero.goalLabel': 'Goal',
    'hero.focusLabel': 'Current Focus',
    'hero.domainLabel': 'Core Domain',
    'hero.roleLabel': 'Team Role',
    'hero.exploreBtn': 'Explore Missions & Journey',
    'hero.robotFrameTitle': 'ROBOTIC MANIPULATOR',
    
    // Journey Section
    'journey.badge': 'CHRONOLOGICAL ARCHIVE',
    'journey.title': 'Competition & Research Journey',
    'journey.subtitle': 'A chronological chronicle of breakthroughs, iterative engineering, and problem-solving through trials and triumphs.',
    'journey.addBtn': '+ Add Journey Log',
    'journey.roles': 'Assigned Roles',
    'journey.strengths': 'Strengths & Breakthroughs',
    'journey.improvements': 'Learnings & Next Steps',
    'journey.keyPoints': 'Key Engineering & Problem Solving',
    'journey.metrics': 'Performance Metrics',
    'journey.expandDetails': 'View Detailed Log & Technical Analysis',
    'journey.collapseDetails': 'Collapse Details',
    'journey.edit': 'Edit',
    'journey.delete': 'Delete',
    'journey.deleteConfirm': 'Are you sure you want to delete this journey item?',

    // Awards Section
    'awards.badge': 'HONORS & RECOGNITION',
    'awards.title': 'Honors & Awards',
    'awards.subtitle': 'Track record of accomplishments in national and international robotics olympiads and autonomous challenges.',
    'awards.addBtn': '+ Add Award',
    'awards.filterAll': 'All Awards',
    'awards.unlocked': 'TOP ACHIEVEMENT UNLOCKED',
    'awards.category': 'Category',
    'awards.score': 'Score / Record',
    'awards.rank': 'Standing',
    'awards.edit': 'Edit',
    'awards.delete': 'Delete',
    'awards.deleteConfirm': 'Are you sure you want to delete this award item?',

    // Skills Section
    'skills.badge': 'CORE COMPETENCIES',
    'skills.title': 'Engineering Matrix',
    'skills.subtitle': 'Full-stack engineering skill set spanning CAD design, firmware, precision actuation, and autonomous navigation algorithms.',
    'skills.addBtn': '+ Add Skill',
    'skills.all': 'All Skills',
    'skills.filterAll': 'All Skills',
    'skills.proficiency': 'Proficiency',
    'skills.edit': 'Edit',
    'skills.delete': 'Delete',
    'skills.deleteConfirm': 'Are you sure you want to delete this skill?',

    // Experience / Projects Section
    'projects.badge': 'DEPLOYED SYSTEMS',
    'projects.title': 'Robotic Systems & Projects',
    'projects.subtitle': 'Custom-engineered autonomous robots and precision manipulator mechanisms field-tested in competition environments.',
    'projects.addBtn': '+ Add Project',
    'projects.viewDetails': 'View Details',
    'projects.details': 'View Analysis',
    'projects.addPlaceholder': 'Register New Project',
    'projects.awaitingSummary': 'Currently architecting and prototyping next-generation robotics systems.',
    'projects.statusCompleted': 'COMPLETED',
    'projects.statusInProgress': 'IN PROGRESS',
    'projects.statusAwaiting': 'AWAITING',
    'projects.edit': 'Edit',
    'projects.delete': 'Delete',
    'projects.deleteConfirm': 'Are you sure you want to delete this project?',

    // YouTube Section
    'youtube.badge': 'OFFICIAL MEDIA & RUNS',
    'youtube.title': 'Official Channel & Match Archives',
    'youtube.subtitle': 'Autonomous run footage, PID control tuning, robotics hardware builds, and field test archives.',
    'youtube.sectionTitle': 'Official Channel & Match Archives',
    'youtube.sectionDesc': 'Autonomous run footage, PID control tuning, robotics hardware builds, and field test archives.',
    'youtube.visit': 'Visit Channel',
    'youtube.visitChannel': 'Visit Channel',
    'youtube.share': 'Share',
    'youtube.copied': 'Copied!',
    'youtube.copyLink': 'Copy Channel Link',
    'youtube.addBtn': '+ Add Video',
    'youtube.addVideo': 'Add Video',
    'youtube.subscribe': 'Subscribe & Watch All Videos',
    'youtube.allVideos': 'All Videos',
    'youtube.catAll': 'All Videos',
    'youtube.catCompetition': 'Competition & Matches',
    'youtube.catAlgorithm': 'Algorithms & Control',
    'youtube.catHardware': 'Hardware & Builds',
    'youtube.catFieldTest': 'Field Tests',
    'youtube.play': 'Play Video',
    'youtube.watchVideo': 'Watch Video',
    'youtube.openExternal': 'Watch on YouTube',
    'youtube.delete': 'Delete Video',
    'youtube.deleteConfirm': 'Are you sure you want to delete this YouTube video?',
    'youtube.deleting': 'Deleting...',
    'youtube.edit': 'Edit',
    'youtube.noVideos': 'No videos found in this category.',

    // Project Modal
    'modal.abstract': 'System Abstract & Objectives',
    'modal.highlights': 'Key Innovations & Technical Feats',
    'modal.breakthroughs': 'Key Innovations & Technical Feats',
    'modal.specs': 'Hardware & Engineering Specs',
    'modal.controller': 'Microcontroller / Mainboard',
    'modal.physical': 'Physical Dimensions',
    'modal.stack': 'Software & Firmware Stack',
    'modal.close': 'Close',
    'modal.verified': 'STATUS: VERIFIED_DATA',

    // Footer
    'footer.copyright': 'All Rights Reserved. Autonomous Robotics Portfolio.',
    'footer.emailCopied': 'Email address copied to clipboard!',
    'footer.copyEmail': 'Copy Email',

    // Admin & Common
    'admin.login': 'Admin Login',
    'admin.logout': 'Logout',
    'admin.modeActive': 'Admin Edit Mode Active',
    'admin.exit': 'Exit Admin',
    'common.save': 'Save Changes',
    'common.cancel': 'Cancel',
    'common.themeDark': 'Dark Mode',
    'common.themeLight': 'Light Mode',
    'common.langKo': '한국어',
    'common.langEn': 'English',
  },
  ja: {
    // Navigation
    'nav.overview': '概要',
    'nav.about': '紹介・ビジョン',
    'nav.journey': '大会の軌跡',
    'nav.awards': '受賞歴',
    'nav.skills': 'コアスキル',
    'nav.experience': 'ロボットシステム',
    'nav.youtube': 'YouTubeチャンネル',
    'nav.contact': 'CONTACT',
    'nav.subtitle': 'ROBOTICS & AUTONOMOUS SYSTEMS',
    'nav.online': 'ONLINE',

    // Hero Section
    'hero.badge': 'ROBOTICS & AUTONOMOUS SYSTEMS',
    'hero.editAbout': 'プロフィール・画像編集',
    'hero.goalLabel': '目標',
    'hero.focusLabel': '現在の焦点',
    'hero.domainLabel': 'コア領域',
    'hero.roleLabel': 'チームの役割',
    'hero.exploreBtn': 'プロジェクト・軌跡を見る',
    'hero.robotFrameTitle': 'ROBOTIC MANIPULATOR',
    
    // Journey Section
    'journey.badge': 'CHRONOLOGICAL ARCHIVE',
    'journey.title': '大会と研究の軌跡',
    'journey.subtitle': '試行錯誤と絶え間ない課題解決を通じて培ってきたロボット工学の歩みです。',
    'journey.addBtn': '+ 新しい記録を追加',
    'journey.roles': '担当役割',
    'journey.strengths': '強みと成果',
    'journey.improvements': '改善点と学び',
    'journey.keyPoints': '主要技術と課題解決プロセス',
    'journey.metrics': '実績指標',
    'journey.expandDetails': '詳細分析を見る',
    'journey.collapseDetails': '閉じる',
    'journey.edit': '編集',
    'journey.delete': '削除',
    'journey.deleteConfirm': 'この記録を削除してもよろしいですか？',

    // Awards Section
    'awards.badge': 'HONORS & RECOGNITION',
    'awards.title': '受賞および成果実績',
    'awards.subtitle': '国内外のロボット競技会および自律走行チャレンジでの受賞記録です。',
    'awards.addBtn': '+ 新しい受賞を追加',
    'awards.filterAll': 'すべて表示',
    'awards.unlocked': '最高実績達成',
    'awards.category': '分野',
    'awards.score': 'スコア・記録',
    'awards.rank': '順位',
    'awards.edit': '編集',
    'awards.delete': '削除',
    'awards.deleteConfirm': 'この受賞歴を削除してもよろしいですか？',

    // Skills Section
    'skills.badge': 'CORE COMPETENCIES',
    'skills.title': 'コアエンジニアリングスキル',
    'skills.subtitle': 'ハードウェア設計・製作からファームウェア、自律走行アルゴリズムまで網羅する技術スタックです。',
    'skills.addBtn': '+ 新しいスキルを追加',
    'skills.all': 'すべてのスキル',
    'skills.filterAll': 'すべてのスキル',
    'skills.proficiency': '習熟度',
    'skills.edit': '編集',
    'skills.delete': '削除',
    'skills.deleteConfirm': 'このスキルを削除してもよろしいですか？',

    // Experience / Projects Section
    'projects.badge': 'DEPLOYED SYSTEMS',
    'projects.title': 'ロボットシステム・プロジェクト',
    'projects.subtitle': '自ら設計・製作し、大会や実地テストで検証したロボットシステムです。',
    'projects.addBtn': '+ 新規プロジェクト追加',
    'projects.viewDetails': '詳細を見る',
    'projects.details': '詳細分析',
    'projects.addPlaceholder': '新規プロジェクト登録',
    'projects.awaitingSummary': '次世代ロボットシステムを構想・開発中です。',
    'projects.statusCompleted': '完了',
    'projects.statusInProgress': '開発中',
    'projects.statusAwaiting': '準備中',
    'projects.edit': '編集',
    'projects.delete': '削除',
    'projects.deleteConfirm': 'このプロジェクトを削除してもよろしいですか？',

    // YouTube Section
    'youtube.badge': 'OFFICIAL MEDIA & RUNS',
    'youtube.title': '公式YouTubeチャンネル・実走動画',
    'youtube.subtitle': 'World Robot Olympiad (WRO) や自律走行テスト、PID制御チューニング、機体製作動画のアーカイブです。',
    'youtube.sectionTitle': '公式YouTubeチャンネル・実走動画',
    'youtube.sectionDesc': 'World Robot Olympiad (WRO) や自律走行テスト、PID制御チューニング、機体製作動画のアーカイブです。',
    'youtube.visit': 'チャンネルを見る',
    'youtube.visitChannel': 'チャンネルを見る',
    'youtube.share': '共有',
    'youtube.copied': 'コピー完了！',
    'youtube.copyLink': 'リンクをコピー',
    'youtube.addBtn': '+ 動画を追加',
    'youtube.addVideo': '動画を追加',
    'youtube.subscribe': 'チャンネル登録＆動画を視聴',
    'youtube.allVideos': 'すべての動画',
    'youtube.catAll': 'すべての動画',
    'youtube.catCompetition': '大会・試合走行',
    'youtube.catAlgorithm': '制御・アルゴリズム',
    'youtube.catHardware': 'ハードウェア・機構',
    'youtube.catFieldTest': 'フィールドテスト',
    'youtube.play': '再生',
    'youtube.watchVideo': '動画を再生',
    'youtube.openExternal': 'YouTubeで見る',
    'youtube.delete': '動画削除',
    'youtube.deleteConfirm': 'この動画項目を削除してもよろしいですか？',
    'youtube.deleting': '削除中...',
    'youtube.edit': '編集',
    'youtube.noVideos': 'このカテゴリに動画はありません。',

    // Project Modal
    'modal.abstract': 'システムの概要・目的',
    'modal.highlights': 'コアイノベーション・技術成果',
    'modal.breakthroughs': 'コアイノベーション・技術成果',
    'modal.specs': 'ハードウェア・技術仕様',
    'modal.controller': 'マイコン / メインボード',
    'modal.physical': '寸法・重量',
    'modal.stack': 'ソフトウェア・ファームウェア',
    'modal.close': '閉じる',
    'modal.verified': 'STATUS: VERIFIED_DATA',

    // Footer
    'footer.copyright': 'All Rights Reserved. Autonomous Robotics Portfolio.',
    'footer.emailCopied': 'メールアドレスをコピーしました！',
    'footer.copyEmail': 'メールをコピー',

    // Admin & Common
    'admin.login': '管理者ログイン',
    'admin.logout': 'ログアウト',
    'admin.modeActive': '管理者編集モード作動中',
    'admin.exit': '編集モード終了',
    'common.save': '保存',
    'common.cancel': 'キャンセル',
    'common.themeDark': 'ダークモード',
    'common.themeLight': 'ライトモード',
    'common.langKo': '한국어',
    'common.langEn': 'English',
  },
  zh: {
    // Navigation
    'nav.overview': '总览',
    'nav.about': '关于与愿景',
    'nav.journey': '竞赛历程',
    'nav.awards': '荣誉奖项',
    'nav.skills': '核心技能',
    'nav.experience': '机器人系统',
    'nav.youtube': 'YouTube频道',
    'nav.contact': 'CONTACT',
    'nav.subtitle': 'ROBOTICS & AUTONOMOUS SYSTEMS',
    'nav.online': 'ONLINE',

    // Hero Section
    'hero.badge': 'ROBOTICS & AUTONOMOUS SYSTEMS',
    'hero.editAbout': '编辑简介与图片',
    'hero.goalLabel': '目标',
    'hero.focusLabel': '主攻方向',
    'hero.domainLabel': '核心领域',
    'hero.roleLabel': '团队角色',
    'hero.exploreBtn': '探索项目与历程',
    'hero.robotFrameTitle': 'ROBOTIC MANIPULATOR',
    
    // Journey Section
    'journey.badge': 'CHRONOLOGICAL ARCHIVE',
    'journey.title': '竞赛与研究历程',
    'journey.subtitle': '记录在失败与成功中不断解决问题、持续迭代的机器人工程历程。',
    'journey.addBtn': '+ 添加历程记录',
    'journey.roles': '负责角色',
    'journey.strengths': '优势与突破',
    'journey.improvements': '改进与收获',
    'journey.keyPoints': '核心技术与攻关过程',
    'journey.metrics': '成果指标',
    'journey.expandDetails': '查看详细分析',
    'journey.collapseDetails': '收起',
    'journey.edit': '编辑',
    'journey.delete': '删除',
    'journey.deleteConfirm': '确定要删除此条历程记录吗？',

    // Awards Section
    'awards.badge': 'HONORS & RECOGNITION',
    'awards.title': '荣誉与获奖成果',
    'awards.subtitle': '在国内外机器人竞赛及自动驾驶挑战赛中获得的荣誉记录。',
    'awards.addBtn': '+ 添加新奖项',
    'awards.filterAll': '全部奖项',
    'awards.unlocked': '解锁最高成就',
    'awards.category': '类别',
    'awards.score': '得分/记录',
    'awards.rank': '排名',
    'awards.edit': '编辑',
    'awards.delete': '删除',
    'awards.deleteConfirm': '确定要删除此奖项吗？',

    // Skills Section
    'skills.badge': 'CORE COMPETENCIES',
    'skills.title': '核心工程能力',
    'skills.subtitle': '涵盖结构设计、固件开发到自主导航算法的全栈技术体系。',
    'skills.addBtn': '+ 添加技能',
    'skills.all': '全部技能',
    'skills.filterAll': '全部技能',
    'skills.proficiency': '熟练度',
    'skills.edit': '编辑',
    'skills.delete': '删除',
    'skills.deleteConfirm': '确定要删除此项技能吗？',

    // Experience / Projects Section
    'projects.badge': 'DEPLOYED SYSTEMS',
    'projects.title': '机器人系统与项目',
    'projects.subtitle': '自主设计、制作并在竞赛和实地测试中验证的机器人系统。',
    'projects.addBtn': '+ 添加新项目',
    'projects.viewDetails': '查看详情',
    'projects.details': '详细分析',
    'projects.addPlaceholder': '注册新项目',
    'projects.awaitingSummary': '新一代机器人系统正在构思与研发中。',
    'projects.statusCompleted': '已完成',
    'projects.statusInProgress': '研发中',
    'projects.statusAwaiting': '准备中',
    'projects.edit': '编辑',
    'projects.delete': '删除',
    'projects.deleteConfirm': '确定要删除此项目吗？',

    // YouTube Section
    'youtube.badge': 'OFFICIAL MEDIA & RUNS',
    'youtube.title': '官方YouTube频道与实战运行',
    'youtube.subtitle': 'World Robot Olympiad (WRO) 与自动驾驶测试、PID控制调优、硬件制作视频存档。',
    'youtube.sectionTitle': '官方YouTube频道与实战运行',
    'youtube.sectionDesc': 'World Robot Olympiad (WRO) 与自动驾驶测试、PID控制调优、硬件制作视频存档。',
    'youtube.visit': '访问频道',
    'youtube.visitChannel': '访问频道',
    'youtube.share': '分享',
    'youtube.copied': '已复制！',
    'youtube.copyLink': '复制频道链接',
    'youtube.addBtn': '+ 添加视频',
    'youtube.addVideo': '添加视频',
    'youtube.subscribe': '订阅频道并观看全部视频',
    'youtube.allVideos': '全部视频',
    'youtube.catAll': '全部视频',
    'youtube.catCompetition': '竞赛与实战',
    'youtube.catAlgorithm': '算法与控制',
    'youtube.catHardware': '硬件与机构',
    'youtube.catFieldTest': '实地测试',
    'youtube.play': '播放视频',
    'youtube.watchVideo': '播放视频',
    'youtube.openExternal': '在YouTube观看',
    'youtube.delete': '删除视频',
    'youtube.deleteConfirm': '确定要删除此视频项吗？',
    'youtube.deleting': '删除中...',
    'youtube.edit': '编辑',
    'youtube.noVideos': '该分类下暂无视频。',

    // Project Modal
    'modal.abstract': '系统概述与目标',
    'modal.highlights': '核心创新与技术成果',
    'modal.breakthroughs': '核心创新与技术成果',
    'modal.specs': '硬件与技术规格',
    'modal.controller': '控制器 / 主板',
    'modal.physical': '物理尺寸',
    'modal.stack': '软件与固件栈',
    'modal.close': '关闭',
    'modal.verified': 'STATUS: VERIFIED_DATA',

    // Footer
    'footer.copyright': 'All Rights Reserved. Autonomous Robotics Portfolio.',
    'footer.emailCopied': '邮箱地址已复制到剪贴板！',
    'footer.copyEmail': '复制邮箱',

    // Admin & Common
    'admin.login': '管理员登录',
    'admin.logout': '退出登录',
    'admin.modeActive': '管理员编辑模式已激活',
    'admin.exit': '退出编辑',
    'common.save': '保存更改',
    'common.cancel': '取消',
    'common.themeDark': '深色模式',
    'common.themeLight': '浅色模式',
    'common.langKo': '한국어',
    'common.langEn': 'English',
  },
  es: {
    // Navigation
    'nav.overview': 'Resumen',
    'nav.about': 'Sobre mí',
    'nav.journey': 'Trayectoria',
    'nav.awards': 'Premios',
    'nav.skills': 'Habilidades',
    'nav.experience': 'Proyectos',
    'nav.youtube': 'Canal YouTube',
    'nav.contact': 'CONTACT',
    'nav.subtitle': 'ROBOTICS & AUTONOMOUS SYSTEMS',
    'nav.online': 'ONLINE',

    // Hero Section
    'hero.badge': 'ROBOTICS & AUTONOMOUS SYSTEMS',
    'hero.editAbout': 'Editar perfil e imagen',
    'hero.goalLabel': 'Meta',
    'hero.focusLabel': 'Enfoque principal',
    'hero.domainLabel': 'Dominio clave',
    'hero.roleLabel': 'Rol en equipo',
    'hero.exploreBtn': 'Explorar proyectos y trayectoria',
    'hero.robotFrameTitle': 'ROBOTIC MANIPULATOR',
    
    // Journey Section
    'journey.badge': 'CHRONOLOGICAL ARCHIVE',
    'journey.title': 'Trayectoria de Competición e Investigación',
    'journey.subtitle': 'Crónica de resolución de problemas, iteraciones y logros en ingeniería robótica.',
    'journey.addBtn': '+ Añadir registro',
    'journey.roles': 'Roles asignados',
    'journey.strengths': 'Fortalezas y logros',
    'journey.improvements': 'Aprendizajes y mejoras',
    'journey.keyPoints': 'Aspectos técnicos y soluciones',
    'journey.metrics': 'Métricas de rendimiento',
    'journey.expandDetails': 'Ver análisis detallado',
    'journey.collapseDetails': 'Plegar',
    'journey.edit': 'Editar',
    'journey.delete': 'Eliminar',
    'journey.deleteConfirm': '¿Estás seguro de eliminar este registro?',

    // Awards Section
    'awards.badge': 'HONORS & RECOGNITION',
    'awards.title': 'Premios y Reconocimientos',
    'awards.subtitle': 'Historial de logros en olimpiadas robóticas y desafíos autónomos nacionales e internacionales.',
    'awards.addBtn': '+ Añadir premio',
    'awards.filterAll': 'Todos los premios',
    'awards.unlocked': 'MÁXIMO LOGRO DESBLOQUEADO',
    'awards.category': 'Categoría',
    'awards.score': 'Puntuación/Registro',
    'awards.rank': 'Puesto',
    'awards.edit': 'Editar',
    'awards.delete': 'Eliminar',
    'awards.deleteConfirm': '¿Estás seguro de eliminar este premio?',

    // Skills Section
    'skills.badge': 'CORE COMPETENCIES',
    'skills.title': 'Competencias de Ingeniería',
    'skills.subtitle': 'Conjunto de habilidades en diseño CAD, firmware, control de actuadores y algoritmos autónomos.',
    'skills.addBtn': '+ Añadir habilidad',
    'skills.all': 'Todas las habilidades',
    'skills.filterAll': 'Todas las habilidades',
    'skills.proficiency': 'Dominio',
    'skills.edit': 'Editar',
    'skills.delete': 'Eliminar',
    'skills.deleteConfirm': '¿Estás seguro de eliminar esta habilidad?',

    // Experience / Projects Section
    'projects.badge': 'DEPLOYED SYSTEMS',
    'projects.title': 'Sistemas Robóticos y Proyectos',
    'projects.subtitle': 'Robots autónomos y mecanismos de precisión diseñados y probados en competición.',
    'projects.addBtn': '+ Añadir proyecto',
    'projects.viewDetails': 'Ver detalles',
    'projects.details': 'Ver análisis',
    'projects.addPlaceholder': 'Registrar nuevo proyecto',
    'projects.awaitingSummary': 'Diseñando y creando prototipos de sistemas robóticos de próxima generación.',
    'projects.statusCompleted': 'COMPLETADO',
    'projects.statusInProgress': 'EN PROCESO',
    'projects.statusAwaiting': 'EN ESPERA',
    'projects.edit': 'Editar',
    'projects.delete': 'Eliminar',
    'projects.deleteConfirm': '¿Estás seguro de eliminar este proyecto?',

    // YouTube Section
    'youtube.badge': 'OFFICIAL MEDIA & RUNS',
    'youtube.title': 'Canal Oficial y Carreras en Vivo',
    'youtube.subtitle': 'Videos de carreras WRO, pruebas de conducción autónoma, calibración PID y fabricación.',
    'youtube.sectionTitle': 'Canal Oficial y Carreras en Vivo',
    'youtube.sectionDesc': 'Videos de carreras WRO, pruebas de conducción autónoma, calibración PID y fabricación.',
    'youtube.visit': 'Visitar canal',
    'youtube.visitChannel': 'Visitar canal',
    'youtube.share': 'Compartir',
    'youtube.copied': '¡Copiado!',
    'youtube.copyLink': 'Copiar enlace',
    'youtube.addBtn': '+ Añadir video',
    'youtube.addVideo': 'Añadir video',
    'youtube.subscribe': 'Suscribirse y ver todos los videos',
    'youtube.allVideos': 'Todos los videos',
    'youtube.catAll': 'Todos los videos',
    'youtube.catCompetition': 'Competición y Carreras',
    'youtube.catAlgorithm': 'Algoritmos y Control',
    'youtube.catHardware': 'Hardware y Mecanismos',
    'youtube.catFieldTest': 'Pruebas de Campo',
    'youtube.play': 'Reproducir',
    'youtube.watchVideo': 'Reproducir video',
    'youtube.openExternal': 'Ver en YouTube',
    'youtube.delete': 'Eliminar video',
    'youtube.deleteConfirm': '¿Estás seguro de eliminar este video?',
    'youtube.deleting': 'Eliminando...',
    'youtube.edit': 'Editar',
    'youtube.noVideos': 'No hay videos en esta categoría.',

    // Project Modal
    'modal.abstract': 'Resumen del sistema y objetivos',
    'modal.highlights': 'Innovaciones clave y logros técnicos',
    'modal.breakthroughs': 'Innovaciones clave y logros técnicos',
    'modal.specs': 'Especificaciones técnicas',
    'modal.controller': 'Microcontrolador / Placa base',
    'modal.physical': 'Dimensiones físicas',
    'modal.stack': 'Software y firmware',
    'modal.close': 'Cerrar',
    'modal.verified': 'STATUS: VERIFIED_DATA',

    // Footer
    'footer.copyright': 'All Rights Reserved. Autonomous Robotics Portfolio.',
    'footer.emailCopied': '¡Dirección de correo copiada al portapapeles!',
    'footer.copyEmail': 'Copiar correo',

    // Admin & Common
    'admin.login': 'Acceso admin',
    'admin.logout': 'Cerrar sesión',
    'admin.modeActive': 'Modo de edición admin activo',
    'admin.exit': 'Salir de admin',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.themeDark': 'Modo oscuro',
    'common.themeLight': 'Modo claro',
    'common.langKo': '한국어',
    'common.langEn': 'English',
  },
  de: {
    // Navigation
    'nav.overview': 'Übersicht',
    'nav.about': 'Über mich',
    'nav.journey': 'Werdegang',
    'nav.awards': 'Auszeichnungen',
    'nav.skills': 'Kompetenzen',
    'nav.experience': 'Projekte',
    'nav.youtube': 'YouTube-Kanal',
    'nav.contact': 'CONTACT',
    'nav.subtitle': 'ROBOTICS & AUTONOMOUS SYSTEMS',
    'nav.online': 'ONLINE',

    // Hero Section
    'hero.badge': 'ROBOTICS & AUTONOMOUS SYSTEMS',
    'hero.editAbout': 'Biografie & Bild bearbeiten',
    'hero.goalLabel': 'Ziel',
    'hero.focusLabel': 'Fokus',
    'hero.domainLabel': 'Kernbereich',
    'hero.roleLabel': 'Teamrolle',
    'hero.exploreBtn': 'Projekte & Meilensteine',
    'hero.robotFrameTitle': 'ROBOTIC MANIPULATOR',
    
    // Journey Section
    'journey.badge': 'CHRONOLOGICAL ARCHIVE',
    'journey.title': 'Wettbewerbs- & Forschungsreise',
    'journey.subtitle': 'Eine Chronik von Erfolgen, iterativer Entwicklung und Problemlösung im Robotik-Bereich.',
    'journey.addBtn': '+ Meilenstein hinzufügen',
    'journey.roles': 'Rollen',
    'journey.strengths': 'Stärken & Durchbrüche',
    'journey.improvements': 'Erkenntnisse & Verbesserungen',
    'journey.keyPoints': 'Kerntechnologien & Problemlösungen',
    'journey.metrics': 'Leistungskennzahlen',
    'journey.expandDetails': 'Detaillierte Analyse anzeigen',
    'journey.collapseDetails': 'Einklappen',
    'journey.edit': 'Bearbeiten',
    'journey.delete': 'Löschen',
    'journey.deleteConfirm': 'Möchten Sie diesen Eintrag wirklich löschen?',

    // Awards Section
    'awards.badge': 'HONORS & RECOGNITION',
    'awards.title': 'Auszeichnungen & Erfolge',
    'awards.subtitle': 'Erfolgsbilanz bei nationalen und internationalen Robotik-Olympiaden und Wettbewerben.',
    'awards.addBtn': '+ Auszeichnung hinzufügen',
    'awards.filterAll': 'Alle Auszeichnungen',
    'awards.unlocked': 'SPITZENLEISTUNG ERREICHT',
    'awards.category': 'Kategorie',
    'awards.score': 'Punktzahl / Rekord',
    'awards.rank': 'Platzierung',
    'awards.edit': 'Bearbeiten',
    'awards.delete': 'Löschen',
    'awards.deleteConfirm': 'Möchten Sie diese Auszeichnung löschen?',

    // Skills Section
    'skills.badge': 'CORE COMPETENCIES',
    'skills.title': 'Ingenieur-Kompetenzen',
    'skills.subtitle': 'Umfassendes Wissen in CAD-Design, Firmware, Aktorik und autonomen Navigationsalgorithmen.',
    'skills.addBtn': '+ Skill hinzufügen',
    'skills.all': 'Alle Fähigkeiten',
    'skills.filterAll': 'Alle Fähigkeiten',
    'skills.proficiency': 'Kenntnisstand',
    'skills.edit': 'Bearbeiten',
    'skills.delete': 'Löschen',
    'skills.deleteConfirm': 'Möchten Sie diesen Skill löschen?',

    // Experience / Projects Section
    'projects.badge': 'DEPLOYED SYSTEMS',
    'projects.title': 'Robotersysteme & Projekte',
    'projects.subtitle': 'Eigenständig entwickelte und im Wettbewerbseinsatz erprobte autonome Robotersysteme.',
    'projects.addBtn': '+ Projekt hinzufügen',
    'projects.viewDetails': 'Details anzeigen',
    'projects.details': 'Analyse ansehen',
    'projects.addPlaceholder': 'Neues Projekt anlegen',
    'projects.awaitingSummary': 'Entwicklung der nächsten Generation autonomer Robotiksysteme.',
    'projects.statusCompleted': 'ABGESCHLOSSEN',
    'projects.statusInProgress': 'IN ENTWICKLUNG',
    'projects.statusAwaiting': 'IN VORBEREITUNG',
    'projects.edit': 'Bearbeiten',
    'projects.delete': 'Löschen',
    'projects.deleteConfirm': 'Möchten Sie dieses Projekt löschen?',

    // YouTube Section
    'youtube.badge': 'OFFICIAL MEDIA & RUNS',
    'youtube.title': 'Offizieller Kanal & Einsatzvideos',
    'youtube.subtitle': 'WRO-Wettbewerbsfahrten, autonome Fahrtests, PID-Abstimmung und Hardware-Bauten.',
    'youtube.sectionTitle': 'Offizieller Kanal & Einsatzvideos',
    'youtube.sectionDesc': 'WRO-Wettbewerbsfahrten, autonome Fahrtests, PID-Abstimmung und Hardware-Bauten.',
    'youtube.visit': 'Kanal besuchen',
    'youtube.visitChannel': 'Kanal besuchen',
    'youtube.share': 'Teilen',
    'youtube.copied': 'Kopiert!',
    'youtube.copyLink': 'Link kopieren',
    'youtube.addBtn': '+ Video hinzufügen',
    'youtube.addVideo': 'Video hinzufügen',
    'youtube.subscribe': 'Abonnieren & alle Videos ansehen',
    'youtube.allVideos': 'Alle Videos',
    'youtube.catAll': 'Alle Videos',
    'youtube.catCompetition': 'Wettbewerb & Fahrten',
    'youtube.catAlgorithm': 'Algorithmen & Regelung',
    'youtube.catHardware': 'Hardware & Mechanik',
    'youtube.catFieldTest': 'Feldtests',
    'youtube.play': 'Abspielen',
    'youtube.watchVideo': 'Video abspielen',
    'youtube.openExternal': 'Auf YouTube ansehen',
    'youtube.delete': 'Video löschen',
    'youtube.deleteConfirm': 'Möchten Sie dieses Video wirklich löschen?',
    'youtube.deleting': 'Wird gelöscht...',
    'youtube.edit': 'Bearbeiten',
    'youtube.noVideos': 'Keine Videos in dieser Kategorie gefunden.',

    // Project Modal
    'modal.abstract': 'Systemübersicht & Ziele',
    'modal.highlights': 'Wichtige Innovationen & Leistungen',
    'modal.breakthroughs': 'Wichtige Innovationen & Leistungen',
    'modal.specs': 'Hardware- & Technologiespezifikationen',
    'modal.controller': 'Mikrocontroller / Hauptplatine',
    'modal.physical': 'Abmessungen & Gewicht',
    'modal.stack': 'Software- & Firmware-Stack',
    'modal.close': 'Schließen',
    'modal.verified': 'STATUS: VERIFIED_DATA',

    // Footer
    'footer.copyright': 'All Rights Reserved. Autonomous Robotics Portfolio.',
    'footer.emailCopied': 'E-Mail-Adresse in Zwischenablage kopiert!',
    'footer.copyEmail': 'E-Mail kopieren',

    // Admin & Common
    'admin.login': 'Admin-Login',
    'admin.logout': 'Abmelden',
    'admin.modeActive': 'Admin-Bearbeitungsmodus aktiv',
    'admin.exit': 'Admin verlassen',
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.themeDark': 'Dunkelmodus',
    'common.themeLight': 'Hellmodus',
    'common.langKo': '한국어',
    'common.langEn': 'English',
  },
  fr: {
    // Navigation
    'nav.overview': 'Aperçu',
    'nav.about': 'À propos & Vision',
    'nav.journey': 'Parcours',
    'nav.awards': 'Prix & Titres',
    'nav.skills': 'Compétences',
    'nav.experience': 'Projets',
    'nav.youtube': 'Chaîne YouTube',
    'nav.contact': 'CONTACT',
    'nav.subtitle': 'ROBOTICS & AUTONOMOUS SYSTEMS',
    'nav.online': 'ONLINE',

    // Hero Section
    'hero.badge': 'ROBOTICS & AUTONOMOUS SYSTEMS',
    'hero.editAbout': 'Modifier bio et image',
    'hero.goalLabel': 'Objectif',
    'hero.focusLabel': 'Domaine clé',
    'hero.domainLabel': 'Spécialité',
    'hero.roleLabel': 'Rôle dans l\'équipe',
    'hero.exploreBtn': 'Explorer les projets et le parcours',
    'hero.robotFrameTitle': 'ROBOTIC MANIPULATOR',
    
    // Journey Section
    'journey.badge': 'CHRONOLOGICAL ARCHIVE',
    'journey.title': 'Parcours de Compétitions et Recherche',
    'journey.subtitle': 'Chronique des défis relevés, de la résolution de problèmes et de la progression en ingénierie.',
    'journey.addBtn': '+ Ajouter une étape',
    'journey.roles': 'Rôles assurés',
    'journey.strengths': 'Points forts et réussites',
    'journey.improvements': 'Axes d\'amélioration',
    'journey.keyPoints': 'Technologies clés et solutions',
    'journey.metrics': 'Indicateurs de performance',
    'journey.expandDetails': 'Voir l\'analyse détaillée',
    'journey.collapseDetails': 'Réduire',
    'journey.edit': 'Modifier',
    'journey.delete': 'Supprimer',
    'journey.deleteConfirm': 'Voulez-vous vraiment supprimer cet enregistrement ?',

    // Awards Section
    'awards.badge': 'HONORS & RECOGNITION',
    'awards.title': 'Distinctions et Palmarès',
    'awards.subtitle': 'Palmarès lors des olympiades de robotique et des défis autonomes nationaux et internationaux.',
    'awards.addBtn': '+ Ajouter un prix',
    'awards.filterAll': 'Tous les prix',
    'awards.unlocked': 'SUCCÈS MAJEUR DÉBLOQUÉ',
    'awards.category': 'Catégorie',
    'awards.score': 'Score / Record',
    'awards.rank': 'Classement',
    'awards.edit': 'Modifier',
    'awards.delete': 'Supprimer',
    'awards.deleteConfirm': 'Voulez-vous vraiment supprimer ce prix ?',

    // Skills Section
    'skills.badge': 'CORE COMPETENCIES',
    'skills.title': 'Compétences d\'Ingénierie',
    'skills.subtitle': 'Conception CAO, développement de micrologiciels et algorithmes de navigation autonome.',
    'skills.addBtn': '+ Ajouter une compétence',
    'skills.all': 'Toutes les compétences',
    'skills.filterAll': 'Toutes les compétences',
    'skills.proficiency': 'Maîtrise',
    'skills.edit': 'Modifier',
    'skills.delete': 'Supprimer',
    'skills.deleteConfirm': 'Voulez-vous vraiment supprimer cette compétence ?',

    // Experience / Projects Section
    'projects.badge': 'DEPLOYED SYSTEMS',
    'projects.title': 'Systèmes Robotiques et Projets',
    'projects.subtitle': 'Systèmes robotiques conçus, fabriqués et testés en conditions réelles de compétition.',
    'projects.addBtn': '+ Ajouter un projet',
    'projects.viewDetails': 'Voir les détails',
    'projects.details': 'Voir l\'analyse',
    'projects.addPlaceholder': 'Enregistrer un nouveau projet',
    'projects.awaitingSummary': 'Conception et prototypage de systèmes robotiques autonomes de nouvelle génération.',
    'projects.statusCompleted': 'TERMINÉ',
    'projects.statusInProgress': 'EN COURS',
    'projects.statusAwaiting': 'EN ATTENTE',
    'projects.edit': 'Modifier',
    'projects.delete': 'Supprimer',
    'projects.deleteConfirm': 'Voulez-vous vraiment supprimer ce projet ?',

    // YouTube Section
    'youtube.badge': 'OFFICIAL MEDIA & RUNS',
    'youtube.title': 'Chaîne Officielle et Essais Réels',
    'youtube.subtitle': 'Vidéos des courses WRO, essais de conduite autonome, réglage PID et fabrication de robots.',
    'youtube.sectionTitle': 'Chaîne Officielle et Essais Réels',
    'youtube.sectionDesc': 'Vidéos des courses WRO, essais de conduite autonome, réglage PID et fabrication de robots.',
    'youtube.visit': 'Visiter la chaîne',
    'youtube.visitChannel': 'Visiter la chaîne',
    'youtube.share': 'Partager',
    'youtube.copied': 'Copié !',
    'youtube.copyLink': 'Copier le lien',
    'youtube.addBtn': '+ Ajouter une vidéo',
    'youtube.addVideo': 'Ajouter une vidéo',
    'youtube.subscribe': 'S\'abonner et voir toutes les vidéos',
    'youtube.allVideos': 'Toutes les vidéos',
    'youtube.catAll': 'Toutes les vidéos',
    'youtube.catCompetition': 'Compétitions et Courses',
    'youtube.catAlgorithm': 'Algorithmes et Contrôle',
    'youtube.catHardware': 'Matériel et Mécanismes',
    'youtube.catFieldTest': 'Essais sur le Terrain',
    'youtube.play': 'Lire la vidéo',
    'youtube.watchVideo': 'Lire la vidéo',
    'youtube.openExternal': 'Regarder sur YouTube',
    'youtube.delete': 'Supprimer la vidéo',
    'youtube.deleteConfirm': 'Voulez-vous vraiment supprimer cette vidéo ?',
    'youtube.deleting': 'Suppression en cours...',
    'youtube.edit': 'Modifier',
    'youtube.noVideos': 'Aucune vidéo dans cette catégorie.',

    // Project Modal
    'modal.abstract': 'Présentation du système et objectifs',
    'modal.highlights': 'Innovations clés et prouesses techniques',
    'modal.breakthroughs': 'Innovations clés et prouesses techniques',
    'modal.specs': 'Spécifications techniques',
    'modal.controller': 'Microcontrôleur / Carte mère',
    'modal.physical': 'Dimensions et poids',
    'modal.stack': 'Pile logicielle et micrologiciel',
    'modal.close': 'Fermer',
    'modal.verified': 'STATUS: VERIFIED_DATA',

    // Footer
    'footer.copyright': 'All Rights Reserved. Autonomous Robotics Portfolio.',
    'footer.emailCopied': 'Adresse e-mail copiée dans le presse-papier !',
    'footer.copyEmail': 'Copier l\'e-mail',

    // Admin & Common
    'admin.login': 'Connexion Admin',
    'admin.logout': 'Déconnexion',
    'admin.modeActive': 'Mode édition admin actif',
    'admin.exit': 'Quitter l\'admin',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.themeDark': 'Mode sombre',
    'common.themeLight': 'Mode clair',
    'common.langKo': '한국어',
    'common.langEn': 'English',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LANG_STORAGE_KEY) as Language;
      if (['ko', 'en', 'ja', 'zh', 'es', 'de', 'fr'].includes(saved)) {
        return saved;
      }
    }
    return 'ko'; // Default: Korean
  });

  useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => {
    const order: Language[] = ['ko', 'en', 'ja', 'zh', 'es', 'de', 'fr'];
    const currentIndex = order.indexOf(lang);
    const nextLang = order[(currentIndex + 1) % order.length];
    setLangState(nextLang);
  };

  const setLanguage = (newLang: Language) => {
    setLangState(newLang);
  };

  const t = (key: string, defaultText?: string): string => {
    const translation = TRANSLATIONS[lang]?.[key];
    if (translation) return translation;
    // Fallback to English before defaultText
    const enFallback = TRANSLATIONS['en']?.[key];
    if (enFallback) return enFallback;
    return defaultText || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
