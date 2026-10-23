export interface AboutConfig {
  title: string;
  subtitle: string;
  quote: string;
  bio: string;
  subBio: string;
  goal: string;
  heroImage: string;
  currentFocus: string;
  coreDomain: string;
  teamRole: string;
  updatedAt?: string;
}

export interface JourneyItem {
  id: string;
  season?: string;
  title?: string;
  team?: string;
  competition?: string;
  year?: string;
  teamName?: string;
  award?: string;
  step?: number;
  period?: string;
  roles: string[];
  summary?: string;
  strengths: string;
  improvements: string;
  quote: string;
  date?: string;
  description?: string;
  members?: string[];
  detailedPoints?: string[];
  metrics?: { label: string; value: string }[];
  order?: number;
  updatedAt?: string;
}

export interface AwardItem {
  id: string;
  title: string;
  competition: string;
  date: string;
  category: string;
  description: string;
  highlight?: boolean;
  score?: string;
  rank?: string;
  order?: number;
  updatedAt?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  description: string;
  category: 'HARDWARE' | 'ACTUATION' | 'PERCEPTION' | 'FRAMEWORK' | 'ALGORITHM' | 'AI/VISION' | 'SOFT_SKILL';
  proficiency?: number; // 0 - 100
  iconName: string;
  highlighted?: boolean;
  order?: number;
  updatedAt?: string;
}

export interface ProjectCodeFile {
  id: string;
  name: string;
  size?: number; // bytes
  language?: string; // 'python' | 'cpp' | 'c' | 'arduino' | 'json' | 'yaml' | 'markdown' | 'text' | 'shell' | 'other'
  description?: string;
  content?: string; // Text content for code viewer and clipboard copy
  dataUrl?: string; // Base64 or download data URL
  uploadedAt?: string;
}

export interface ProjectResearchLog {
  id: string;
  date: string; // e.g., '2026-03-15'
  title: string; // e.g., '엔코더-자이로 EKF 융합 및 슬립 오차 보정 실험'
  category?: string; // 'CALIBRATION' | 'ALGORITHM' | 'HARDWARE' | 'TEST_RUN' | 'TROUBLESHOOTING'
  status?: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  author?: string;
  objective: string; // 연구 목적 및 가설 (Objective & Hypothesis)
  process: string; // 실험 및 구현 과정 (Method & Implementation)
  results: string; // 실험 결과 및 데이터 분석 (Findings & Results)
  nextAction?: string; // 후속 조치 및 개선 과제 (Next Steps / Actions)
  metrics?: { label: string; value: string; unit?: string }[];
  codeSnippet?: string;
  codeLanguage?: string;
  updatedAt?: string;
}

export interface ProjectItem {
  id: string;
  projectId: string;
  title: string;
  summary: string;
  detailedDescription: string;
  image: string;
  tags: string[];
  status: 'COMPLETED' | 'IN_PROGRESS' | 'AWAITING';
  projectType?: 'standard' | 'research-log'; // 'standard' for system CAD/specs, 'research-log' for lab journals
  researchLogs?: ProjectResearchLog[];
  specs?: {
    microcontroller?: string;
    sensors?: string[];
    actuators?: string[];
    softwareStack?: string[];
    dimensions?: string;
    weight?: string;
    speed?: string;
  };
  highlights?: string[];
  blueprintAnnotations?: {
    x: number; // percentage
    y: number;
    title: string;
    detail: string;
  }[];
  codeFiles?: ProjectCodeFile[];
  order?: number;
  updatedAt?: string;
}

export interface YouTubeVideoItem {
  id: string;
  title: string;
  titleKo?: string;
  description: string;
  descriptionKo?: string;
  youtubeUrl: string;
  videoId?: string;
  thumbnail?: string;
  duration?: string;
  tags?: string[];
  tagsKo?: string[];
  category?: string;
  views?: string;
  isFeatured?: boolean;
  order?: number;
  updatedAt?: string;
}

export interface CompetitionReviewItem {
  id: string;
  title: string;
  competition: string;
  period: string;
  location: string;
  teamName: string;
  members: string[];
  officialUrl?: string;
  scoringUrl?: string;
  notionUrl?: string;
  coverImage?: string;
  icon?: string;
  rankBadge?: string;
  finalScore?: string;
  overviewSummary?: string;
  day1: {
    title: string;
    subtitle: string;
    fixes: string[];
    fixesDetailed?: { problem: string; solution?: string }[];
    strategy: string;
    strategyReason?: string;
    codeSummary?: string;
    codeFile?: { name: string; path: string };
    result: string;
  };
  day2: {
    title: string;
    subtitle: string;
    rank: string;
    scores: { round: string; score: number | string }[];
    scoresDetailed?: { round: string; score: number | string; cause?: string; lesson?: string }[];
    surpriseMission?: {
      title: string;
      rules: string;
      scoring: string[];
      reason?: string;
      disadvantage?: string;
      lesson?: string;
      images?: { name: string; src: string }[];
    };
    strategy: string;
    codeSummary?: string;
    codeFile?: { name: string; path: string };
    problemAndFix?: { problem: string; solution: string };
    mustFix?: string;
  };
  day3: {
    title: string;
    subtitle: string;
    rank: string;
    scores: { round: string; score: number | string }[];
    scoresDetailed?: { round: string; score: number | string; cause?: string; lesson?: string }[];
    challengeMission?: {
      title: string;
      tasks: { taskNumber: number; name: string; description: string; score: string }[];
      images?: { name: string; src: string }[];
    };
    strategy: string;
    strategyTasks?: string[];
    codeSummary?: string;
    codeFile?: { name: string; path: string };
    problemAndFix?: { problem: string; solution: string };
    mustFix?: string;
  };
  libraryFile?: { name: string; path: string };
  reflections: {
    strengths: string;
    regrets: string;
    improvements: string;
    mistakesList?: string[];
  };
  competitionDetails: {
    venueAndDate: string;
    criticalRules: string;
    ruleLessonLearned: string;
    differencesFromPrevious: string;
  };
  order?: number;
  updatedAt?: string;
  lastSyncedAt?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  providerId: string; // 'google.com' | 'password' | 'custom'
  role: 'admin' | 'visitor';
  loginCount: number;
  lastLoginAt: string;
  createdAt: string;
}

export interface VisitorCheckin {
  id: string;
  name: string;
  organization?: string;
  roleOrRelation?: string;
  message?: string;
  platform?: string;
  userAgent?: string;
  timestamp: string;
  status?: 'active' | 'checked_out';
  checkoutTimestamp?: string;
}

export interface LoginLog {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  providerId: string;
  userAgent?: string;
  platform?: string;
  timestamp: string;
}

export interface ExternalSiteItem {
  id: string;
  title: string;
  url: string;
  description?: string;
  category?: string;
  previewImage?: string;
  isDefault?: boolean;
  order?: number;
  updatedAt?: string;
}


