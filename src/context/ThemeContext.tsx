import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'dark' | 'light';
export type Language = 'ko' | 'en';

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
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode;
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark'; // Default: cyber dark
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
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
    'nav.about': 'About',
    'nav.journey': 'Journey',
    'nav.awards': 'Awards',
    'nav.skills': 'Skills',
    'nav.experience': 'Experience',
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
    'modal.specs': '하드웨어 & 상세 기술 사양',
    'modal.controller': '컨트롤러 / MCU',
    'modal.physical': '물리 규격',
    'modal.stack': '소프트웨어 & 펌웨어 스택',
    'modal.close': '닫기',
    'modal.verified': 'STATUS: VERIFIED_DATA',

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
    'nav.about': 'About',
    'nav.journey': 'Journey',
    'nav.awards': 'Awards',
    'nav.skills': 'Skills',
    'nav.experience': 'Experience',
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
    'projects.addPlaceholder': 'Register New Project',
    'projects.awaitingSummary': 'Currently architecting and prototyping next-generation robotics systems.',
    'projects.statusCompleted': 'COMPLETED',
    'projects.statusInProgress': 'IN PROGRESS',
    'projects.statusAwaiting': 'AWAITING',
    'projects.edit': 'Edit',
    'projects.delete': 'Delete',
    'projects.deleteConfirm': 'Are you sure you want to delete this project?',

    // Project Modal
    'modal.abstract': 'System Abstract & Objectives',
    'modal.highlights': 'Key Innovations & Technical Feats',
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
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LANG_STORAGE_KEY) as Language;
      if (saved === 'ko' || saved === 'en') return saved;
    }
    return 'ko'; // Default: Korean
  });

  useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => {
    setLangState((prev) => (prev === 'ko' ? 'en' : 'ko'));
  };

  const setLanguage = (newLang: Language) => {
    setLangState(newLang);
  };

  const t = (key: string, defaultText?: string): string => {
    const translation = TRANSLATIONS[lang]?.[key];
    if (translation) return translation;
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
