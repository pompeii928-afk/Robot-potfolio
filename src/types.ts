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

export interface ProjectItem {
  id: string;
  projectId: string;
  title: string;
  summary: string;
  detailedDescription: string;
  image: string;
  tags: string[];
  status: 'COMPLETED' | 'IN_PROGRESS' | 'AWAITING';
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
  order?: number;
  updatedAt?: string;
}

export interface YouTubeVideoItem {
  id: string;
  title: string;
  titleKo?: string;
  description: string;
  youtubeUrl: string;
  videoId?: string;
  thumbnail?: string;
  duration?: string;
  tags?: string[];
  category?: string;
  views?: string;
  isFeatured?: boolean;
  order?: number;
  updatedAt?: string;
}

