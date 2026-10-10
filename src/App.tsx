/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { JourneySection } from './components/JourneySection';
import { AwardsSection } from './components/AwardsSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { YouTubeSection } from './components/YouTubeSection';
import { CompetitionReviewsSection } from './components/CompetitionReviewsSection';
import { ExternalSiteSection } from './components/ExternalSiteSection';
import { Footer } from './components/Footer';
import { AdminBar } from './components/AdminBar';
import { AdminLoginView } from './components/AdminLoginView';
import { Hero3DLogo } from './components/Hero3DLogo';
import { cyberAudio } from './utils/cyberAudio';
import { ChevronUp, ChevronDown, Layers } from 'lucide-react';
import { AuthProvider, useAuth } from './firebase/AuthContext';
import { ToastProvider, useToast } from './components/Toast';
import { ThemeProvider, LanguageProvider, useTheme, useLanguage } from './context/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CustomCursor } from './components/CustomCursor';
import { AnimatePresence, motion } from 'motion/react';
import {
  subscribeAboutConfig,
  saveAboutConfig,
  subscribeJourneys,
  createJourney,
  updateJourney,
  deleteJourney,
  subscribeAwards,
  createAward,
  updateAward,
  deleteAward,
  subscribeSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  subscribeProjects,
  createProject,
  updateProject,
  deleteProject,
  subscribeYouTubeVideos,
  saveYouTubeVideo,
  deleteYouTubeVideo,
  subscribeReviews,
  createReview,
  updateReview,
  deleteReview,
  subscribeWebsites,
  createWebsite,
  updateWebsite,
  deleteWebsite,
} from './firebase/firestoreService';
import {
  DEFAULT_ABOUT_CONFIG,
  JOURNEY_DATA,
  AWARDS_DATA,
  SKILLS_DATA,
  PROJECTS_DATA,
  DEFAULT_YOUTUBE_VIDEOS,
  DEFAULT_REVIEWS_DATA,
  DEFAULT_EXTERNAL_SITES,
} from './data/portfolioData';
import { CACHE_KEYS, getCachedData, setCachedData } from './utils/localCache';
import { AboutConfig, AwardItem, JourneyItem, ProjectItem, SkillItem, YouTubeVideoItem, CompetitionReviewItem, ExternalSiteItem } from './types';
import { EditAboutModal } from './components/modals/EditAboutModal';
import { EditJourneyModal } from './components/modals/EditJourneyModal';
import { EditAwardModal } from './components/modals/EditAwardModal';
import { EditSkillModal } from './components/modals/EditSkillModal';
import { EditProjectModal } from './components/modals/EditProjectModal';
import { EditYouTubeModal } from './components/modals/EditYouTubeModal';
import { EditReviewModal } from './components/modals/EditReviewModal';
import { EditWebsiteModal } from './components/EditWebsiteModal';
import { AdminUsersView } from './components/AdminUsersView';
import { VisitorCheckinModal } from './components/VisitorCheckinModal';

function PortfolioApp() {
  const { isAdmin, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const { theme } = useTheme();
  const { lang, t } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>('all');
  const [visitorName, setVisitorName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('kfc_visitor_name') || '';
    }
    return '';
  });

  // Helper to determine if current URL targets admin
  const checkIsAdminPath = () => {
    if (typeof window === 'undefined') return false;
    const pathname = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return (
      pathname === '/admin' ||
      pathname.startsWith('/admin/') ||
      hash === '#admin' ||
      hash === '#/admin' ||
      search.includes('admin')
    );
  };

  // URL Path Routing State ('/' vs '/admin')
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return checkIsAdminPath() ? '/admin' : '/';
  });

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen to browser Back/Forward (popstate & hashchange)
  useEffect(() => {
    const handleLocationChange = () => {
      if (checkIsAdminPath()) {
        setCurrentPath('/admin');
      } else {
        setCurrentPath('/');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Firestore Real-time States (Synchronous local cache initialization prevents flash of old content)
  const [aboutData, setAboutData] = useState<AboutConfig>(() =>
    getCachedData(CACHE_KEYS.ABOUT, DEFAULT_ABOUT_CONFIG)
  );
  const [journeys, setJourneys] = useState<JourneyItem[]>(() =>
    getCachedData(CACHE_KEYS.JOURNEYS, JOURNEY_DATA)
  );
  const [awards, setAwards] = useState<AwardItem[]>(() =>
    getCachedData(CACHE_KEYS.AWARDS, AWARDS_DATA)
  );
  const [skills, setSkills] = useState<SkillItem[]>(() =>
    getCachedData(CACHE_KEYS.SKILLS, SKILLS_DATA)
  );
  const [projects, setProjects] = useState<ProjectItem[]>(() =>
    getCachedData(CACHE_KEYS.PROJECTS, PROJECTS_DATA)
  );
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideoItem[]>(() =>
    getCachedData('cached_youtube_videos', DEFAULT_YOUTUBE_VIDEOS)
  );
  const [reviews, setReviews] = useState<CompetitionReviewItem[]>(() =>
    getCachedData(CACHE_KEYS.REVIEWS, DEFAULT_REVIEWS_DATA)
  );
  const [websites, setWebsites] = useState<ExternalSiteItem[]>(() =>
    getCachedData(CACHE_KEYS.WEBSITES, DEFAULT_EXTERNAL_SITES)
  );

  // Modal States
  const [isEditAboutOpen, setIsEditAboutOpen] = useState(false);

  const [websiteModalData, setWebsiteModalData] = useState<{
    isOpen: boolean;
    item: ExternalSiteItem | null;
  }>({ isOpen: false, item: null });

  const [reviewModalData, setReviewModalData] = useState<{
    isOpen: boolean;
    item: CompetitionReviewItem | null;
  }>({ isOpen: false, item: null });

  const [journeyModalData, setJourneyModalData] = useState<{
    isOpen: boolean;
    item: JourneyItem | null;
  }>({ isOpen: false, item: null });

  const [awardModalData, setAwardModalData] = useState<{
    isOpen: boolean;
    item: AwardItem | null;
  }>({ isOpen: false, item: null });

  const [skillModalData, setSkillModalData] = useState<{
    isOpen: boolean;
    item: SkillItem | null;
  }>({ isOpen: false, item: null });

  const [projectModalData, setProjectModalData] = useState<{
    isOpen: boolean;
    item: ProjectItem | null;
  }>({ isOpen: false, item: null });

  const [youtubeModalData, setYoutubeModalData] = useState<{
    isOpen: boolean;
    item: YouTubeVideoItem | null;
  }>({ isOpen: false, item: null });

  const [isUsersViewOpen, setIsUsersViewOpen] = useState(false);
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);

  // Prompt Visitor Check-in first when entering the site if not already checked in
  useEffect(() => {
    if (checkIsAdminPath()) return;
    const existingName =
      typeof window !== 'undefined'
        ? localStorage.getItem('kfc_visitor_name')
        : null;

    if (!existingName) {
      const timer = setTimeout(() => {
        setIsCheckinModalOpen(true);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, []);

  // Real-time Firestore Subscriptions
  useEffect(() => {
    const unsubAbout = subscribeAboutConfig(
      (data) => setAboutData(data),
      (err) => console.log('About stream:', err)
    );

    const unsubJourneys = subscribeJourneys(
      (items) => setJourneys(items),
      (err) => console.log('Journeys stream:', err)
    );

    const unsubAwards = subscribeAwards(
      (items) => setAwards(items),
      (err) => console.log('Awards stream:', err)
    );

    const unsubSkills = subscribeSkills(
      (items) => setSkills(items),
      (err) => console.log('Skills stream:', err)
    );

    const unsubProjects = subscribeProjects(
      (items) => setProjects(items),
      (err) => console.log('Projects stream:', err)
    );

    const unsubYouTube = subscribeYouTubeVideos((items) => setYoutubeVideos(items));

    const unsubReviews = subscribeReviews(
      (items) => setReviews(items),
      (err) => console.log('Reviews stream:', err)
    );

    const unsubWebsites = subscribeWebsites(
      (items) => setWebsites(items),
      (err) => console.log('Websites stream:', err)
    );

    return () => {
      unsubAbout();
      unsubJourneys();
      unsubAwards();
      unsubSkills();
      unsubProjects();
      unsubYouTube();
      unsubReviews();
    };
  }, []);

  // Alche Studio 3D Rotating Scene Manager
  const SCENES = [
    { id: 'hero', key: '01', title: 'MISSION & PHILOSOPHY', categoryId: 'about' },
    { id: 'projects', key: '02', title: 'SYSTEMS & PHYSICAL BUILDS', categoryId: 'experience' },
    { id: 'journey', key: '03', title: 'COMPETITION JOURNEY', categoryId: 'journey' },
    { id: 'awards', key: '04', title: 'HONORS & AWARDS', categoryId: 'awards' },
    { id: 'skills', key: '05', title: 'SYSTEM CAPABILITIES', categoryId: 'skills' },
    { id: 'youtube', key: '06', title: 'BROADCAST & MEDIA', categoryId: 'youtube' },
    { id: 'ecosystem', key: '07', title: 'ECOSYSTEM & REVIEWS', categoryId: 'external-site' },
  ];

  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [scrollDirection, setScrollDirection] = useState<number>(1);
  const [sceneRotation, setSceneRotation] = useState<number>(0);
  const [scrollMode, setScrollMode] = useState<'3d-scene' | 'continuous'>('3d-scene');
  const scrollCooldownRef = useRef<boolean>(false);

  // 3D Rotating Scene Wheel, Keyboard & Touch Listeners
  useEffect(() => {
    if (activeSection !== 'all' || scrollMode !== '3d-scene') return;

    let touchStartY = 0;

    const handleWheel = (e: WheelEvent) => {
      if (document.body.classList.contains('modal-open')) return;

      // Always intercept wheel when in 3D Scene Mode so the browser page NEVER scrolls down natively
      if (activeSection === 'all' && scrollMode === '3d-scene') {
        e.preventDefault();
      }

      if (Math.abs(e.deltaY) < 16) return;

      if (scrollCooldownRef.current) return;
      scrollCooldownRef.current = true;
      setTimeout(() => {
        scrollCooldownRef.current = false;
      }, 550);

      if (e.deltaY > 0) {
        // Scroll DOWN -> 3D logo rotates and screen turns to next scene
        setScrollDirection(1);
        setActiveSceneIndex((prev) => {
          if (prev < SCENES.length - 1) {
            setSceneRotation((r) => r + 1.2);
            cyberAudio.playScanLaser();
            return prev + 1;
          }
          return prev;
        });
      } else {
        // Scroll UP -> 3D logo rotates back and screen turns to previous scene
        setScrollDirection(-1);
        setActiveSceneIndex((prev) => {
          if (prev > 0) {
            setSceneRotation((r) => r - 1.2);
            cyberAudio.playKeyTick();
            return prev - 1;
          }
          return prev;
        });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault();
        setScrollDirection(1);
        setActiveSceneIndex((prev) => {
          if (prev < SCENES.length - 1) {
            setSceneRotation((r) => r + 1.2);
            cyberAudio.playScanLaser();
            return prev + 1;
          }
          return prev;
        });
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        setScrollDirection(-1);
        setActiveSceneIndex((prev) => {
          if (prev > 0) {
            setSceneRotation((r) => r - 1.2);
            cyberAudio.playKeyTick();
            return prev - 1;
          }
          return prev;
        });
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartY - touchEndY;
      if (Math.abs(diffY) > 35) {
        if (scrollCooldownRef.current) return;
        scrollCooldownRef.current = true;
        setTimeout(() => {
          scrollCooldownRef.current = false;
        }, 550);

        if (diffY > 0) {
          // Swipe Up -> Turn to Next Scene
          setScrollDirection(1);
          setActiveSceneIndex((prev) => {
            if (prev < SCENES.length - 1) {
              setSceneRotation((r) => r + 1.2);
              cyberAudio.playScanLaser();
              return prev + 1;
            }
            return prev;
          });
        } else {
          // Swipe Down -> Turn to Previous Scene
          setScrollDirection(-1);
          setActiveSceneIndex((prev) => {
            if (prev > 0) {
              setSceneRotation((r) => r - 1.2);
              cyberAudio.playKeyTick();
              return prev - 1;
            }
            return prev;
          });
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeSection, scrollMode, SCENES.length]);

  const handleNavigate = (sectionId: string) => {
    const mappedIndex = SCENES.findIndex(
      (s) => s.categoryId === sectionId || s.id === sectionId
    );
    if (mappedIndex !== -1) {
      setScrollDirection(mappedIndex >= activeSceneIndex ? 1 : -1);
      setActiveSceneIndex(mappedIndex);
      setSceneRotation((r) => r + 1.2);
      cyberAudio.playKeyTick();
      setActiveSection('all');
    } else {
      setActiveSection(sectionId);
    }
  };

  // CRUD Handlers with Toast Feedback (Real-time DB updates)
  const handleSaveAbout = async (data: AboutConfig) => {
    try {
      await saveAboutConfig(data);
      setAboutData(data);
      showToast(
        lang === 'en' ? 'About bio and image saved successfully.' : '소개 정보가 안전하게 저장되었습니다.',
        'success',
        lang === 'en' ? 'Saved' : '저장 완료'
      );
    } catch (err) {
      console.error(err);
      showToast(
        lang === 'en' ? 'Failed to save about configuration.' : '소개 정보 저장에 실패했습니다.',
        'error',
        'Error'
      );
      throw err;
    }
  };

  const handleSaveJourney = async (data: JourneyItem) => {
    try {
      const exists = journeys.some((j) => j.id === data.id);
      const itemWithUpdate = {
        ...data,
        updatedAt: data.updatedAt || new Date().toISOString(),
      };

      // Optimistic local state update for instant UI feedback
      setJourneys((prev) => {
        if (exists) {
          return prev.map((j) => (j.id === data.id ? { ...j, ...itemWithUpdate } : j));
        }
        return [...prev, itemWithUpdate];
      });

      if (exists) {
        await updateJourney(data.id, itemWithUpdate);
        showToast(
          lang === 'en' ? 'Competition journey updated.' : '대회 여정이 수정되었습니다.',
          'success',
          lang === 'en' ? 'Updated' : '수정 완료'
        );
      } else {
        await createJourney(itemWithUpdate);
        showToast(
          lang === 'en' ? 'New competition journey added.' : '새 대회 여정이 추가되었습니다.',
          'success',
          lang === 'en' ? 'Added' : '추가 완료'
        );
      }
    } catch (err) {
      console.error(err);
      showToast('대회 여정 저장에 실패했습니다.', 'error', '오류 발생');
      throw err;
    }
  };

  const handleDeleteJourney = async (id: string) => {
    try {
      setJourneys((prev) => prev.filter((j) => j.id !== id));
      await deleteJourney(id);
      showToast(
        lang === 'en' ? 'Competition journey deleted.' : '대회 여정이 삭제되었습니다.',
        'info',
        lang === 'en' ? 'Deleted' : '삭제 완료'
      );
    } catch (err) {
      console.error(err);
      showToast('대회 여정 삭제에 실패했습니다.', 'error', '삭제 실패');
      throw err;
    }
  };

  const handleSaveAward = async (data: AwardItem) => {
    try {
      const exists = awards.some((a) => a.id === data.id);
      if (exists) {
        await updateAward(data.id, data);
        showToast(
          lang === 'en' ? 'Award updated.' : '수상 내역이 수정되었습니다.',
          'success',
          lang === 'en' ? 'Updated' : '수정 완료'
        );
      } else {
        await createAward(data);
        showToast(
          lang === 'en' ? 'New award added.' : '새 수상 내역이 추가되었습니다.',
          'success',
          lang === 'en' ? 'Added' : '추가 완료'
        );
      }
    } catch (err) {
      console.error(err);
      showToast('수상 내역 저장에 실패했습니다.', 'error', '오류 발생');
      throw err;
    }
  };

  const handleDeleteAward = async (id: string) => {
    try {
      await deleteAward(id);
      showToast(
        lang === 'en' ? 'Award deleted.' : '수상 내역이 삭제되었습니다.',
        'info',
        lang === 'en' ? 'Deleted' : '삭제 완료'
      );
    } catch (err) {
      console.error(err);
      showToast('수상 내역 삭제에 실패했습니다.', 'error', '삭제 실패');
      throw err;
    }
  };

  const handleSaveSkill = async (data: SkillItem) => {
    try {
      const exists = skills.some((s) => s.id === data.id);
      if (exists) {
        await updateSkill(data.id, data);
        showToast(
          lang === 'en' ? 'Skill competency updated.' : '핵심 역량이 수정되었습니다.',
          'success',
          lang === 'en' ? 'Updated' : '수정 완료'
        );
      } else {
        await createSkill(data);
        showToast(
          lang === 'en' ? 'New skill added.' : '새 핵심 역량이 추가되었습니다.',
          'success',
          lang === 'en' ? 'Added' : '추가 완료'
        );
      }
    } catch (err) {
      console.error(err);
      showToast('기술 역량 저장에 실패했습니다.', 'error', '오류 발생');
      throw err;
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await deleteSkill(id);
      showToast(
        lang === 'en' ? 'Skill deleted.' : '핵심 역량이 삭제되었습니다.',
        'info',
        lang === 'en' ? 'Deleted' : '삭제 완료'
      );
    } catch (err) {
      console.error(err);
      showToast('기술 역량 삭제에 실패했습니다.', 'error', '삭제 실패');
      throw err;
    }
  };

  const handleSaveProject = async (data: ProjectItem) => {
    try {
      const exists = projects.some((p) => p.id === data.id);
      if (exists) {
        await updateProject(data.id, data);
        showToast(
          lang === 'en' ? 'Project system updated.' : '로봇 프로젝트가 수정되었습니다.',
          'success',
          lang === 'en' ? 'Updated' : '수정 완료'
        );
      } else {
        await createProject(data);
        showToast(
          lang === 'en' ? 'New project added.' : '새 로봇 프로젝트가 추가되었습니다.',
          'success',
          lang === 'en' ? 'Added' : '추가 완료'
        );
      }
    } catch (err) {
      console.error(err);
      showToast('프로젝트 저장에 실패했습니다.', 'error', '오류 발생');
      throw err;
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
      showToast(
        lang === 'en' ? 'Project deleted.' : '로봇 프로젝트가 삭제되었습니다.',
        'info',
        lang === 'en' ? 'Deleted' : '삭제 완료'
      );
    } catch (err) {
      console.error(err);
      showToast('프로젝트 삭제에 실패했습니다.', 'error', '삭제 실패');
      throw err;
    }
  };

  const handleSaveYouTubeVideo = async (data: YouTubeVideoItem) => {
    try {
      await saveYouTubeVideo(data);
      showToast(
        lang === 'en' ? 'YouTube video entry saved.' : '유튜브 영상 항목이 저장되었습니다.',
        'success',
        lang === 'en' ? 'Saved' : '저장 완료'
      );
    } catch (err) {
      console.error(err);
      showToast('유튜브 영상 저장에 실패했습니다.', 'error', '오류 발생');
      throw err;
    }
  };

  const handleDeleteYouTubeVideo = async (id: string) => {
    try {
      await deleteYouTubeVideo(id);
      showToast(
        lang === 'en' ? 'YouTube video entry deleted.' : '유튜브 영상 항목이 삭제되었습니다.',
        'info',
        lang === 'en' ? 'Deleted' : '삭제 완료'
      );
    } catch (err) {
      console.error(err);
      showToast('유튜브 영상 삭제에 실패했습니다.', 'error', '삭제 실패');
      throw err;
    }
  };

  const handleSaveReview = async (data: CompetitionReviewItem) => {
    try {
      const exists = reviews.some((r) => r.id === data.id);
      const itemWithUpdate = {
        ...data,
        updatedAt: data.updatedAt || new Date().toISOString(),
      };

      setReviews((prev) => {
        if (exists) {
          return prev.map((r) => (r.id === data.id ? { ...r, ...itemWithUpdate } : r));
        }
        return [itemWithUpdate, ...prev];
      });

      if (exists) {
        await updateReview(data.id, itemWithUpdate);
        showToast(
          lang === 'en' ? 'Competition review updated.' : '대회 후기가 수정되었습니다.',
          'success',
          lang === 'en' ? 'Updated' : '수정 완료'
        );
      } else {
        await createReview(itemWithUpdate);
        showToast(
          lang === 'en' ? 'New competition review added.' : '새 대회 후기가 추가되었습니다.',
          'success',
          lang === 'en' ? 'Added' : '추가 완료'
        );
      }
    } catch (err) {
      console.error(err);
      showToast('대회 후기 저장에 실패했습니다.', 'error', '오류 발생');
      throw err;
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      setReviews((prev) => prev.filter((r) => r.id !== id));
      await deleteReview(id);
      showToast(
        lang === 'en' ? 'Competition review deleted.' : '대회 후기가 삭제되었습니다.',
        'info',
        lang === 'en' ? 'Deleted' : '삭제 완료'
      );
    } catch (err) {
      console.error(err);
      showToast('대회 후기 삭제에 실패했습니다.', 'error', '삭제 실패');
      throw err;
    }
  };

  const handleSaveWebsite = async (data: Partial<ExternalSiteItem> & { title: string; url: string }) => {
    try {
      const isExisting = Boolean(data.id && websites.some((w) => w.id === data.id));
      if (isExisting && data.id) {
        await updateWebsite(data.id, data);
        setWebsites((prev) => prev.map((w) => (w.id === data.id ? { ...w, ...data } : w)));
        showToast(
          lang === 'en' ? 'Website updated.' : '웹사이트가 수정되었습니다.',
          'success',
          lang === 'en' ? 'Updated' : '수정 완료'
        );
      } else {
        const newId = await createWebsite({
          title: data.title,
          url: data.url,
          description: data.description || '',
          category: data.category || 'STORE',
        });
        const newItem: ExternalSiteItem = {
          id: newId,
          title: data.title,
          url: data.url,
          description: data.description || '',
          category: data.category || 'STORE',
        };
        setWebsites((prev) => [...prev, newItem]);
        showToast(
          lang === 'en' ? 'New website added.' : '새 웹사이트가 추가되었습니다.',
          'success',
          lang === 'en' ? 'Added' : '추가 완료'
        );
      }
    } catch (err) {
      console.error(err);
      showToast('웹사이트 저장에 실패했습니다.', 'error', '오류 발생');
      throw err;
    }
  };

  const handleDeleteWebsite = async (id: string) => {
    try {
      setWebsites((prev) => prev.filter((w) => w.id !== id));
      await deleteWebsite(id);
      showToast(
        lang === 'en' ? 'Website deleted.' : '웹사이트가 삭제되었습니다.',
        'info',
        lang === 'en' ? 'Deleted' : '삭제 완료'
      );
    } catch (err) {
      console.error(err);
      showToast('웹사이트 삭제에 실패했습니다.', 'error', '삭제 실패');
      throw err;
    }
  };

  // If user navigates to `/admin` and is not logged in, render the sleek login screen
  if (currentPath === '/admin' && !authLoading && !isAdmin) {
    return <AdminLoginView onBackToPublic={() => navigateTo('/')} />;
  }

  const isEditingEnabled = currentPath === '/admin' && isAdmin;

  return (
    <div
      className={`flex flex-col relative bg-white text-zinc-900 selection:bg-black selection:text-white antialiased font-sans ${
        activeSection === 'all' && scrollMode === '3d-scene'
          ? 'h-screen max-h-screen overflow-hidden'
          : 'min-h-screen'
      }`}
    >
      {/* Alche Studio Custom Solid White Cursor */}
      <CustomCursor />

      {/* Persistent 3D WebGL Logo (Rotating dynamically with scroll & scene transitions) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <Hero3DLogo
          sceneIndex={activeSection === 'all' && scrollMode === '3d-scene' ? activeSceneIndex : 0}
          rotationProgress={sceneRotation}
          isWhiteBg={true}
        />
      </div>

      {/* Subtle clean ambient gradient */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(0,0,0,0.02),transparent)]" />

      {/* Sticky Header with Integrated Category Bar (No lines) */}
      <div className="sticky top-0 z-50 w-full shrink-0">
        {isEditingEnabled && (
          <AdminBar
            onViewPublic={() => navigateTo('/')}
            onOpenUsersView={() => setIsUsersViewOpen(true)}
            onAddWebsite={() => setWebsiteModalData({ isOpen: true, item: null })}
            onOpenWebsites={() => handleNavigate('external-site')}
          />
        )}
        <Navbar
          activeSection={
            activeSection === 'all' && scrollMode === '3d-scene'
              ? SCENES[activeSceneIndex].categoryId === 'about'
                ? 'all'
                : SCENES[activeSceneIndex].categoryId
              : activeSection
          }
          onNavigate={handleNavigate}
          isAdmin={isAdmin}
          visitorName={visitorName}
          onOpenCheckin={() => setIsCheckinModalOpen(true)}
          onOpenAdmin={() => navigateTo('/admin')}
          onOpenUsersView={() => setIsUsersViewOpen(true)}
          counts={{
            reviews: reviews.length,
            journeys: journeys.length,
            awards: awards.length,
            skills: skills.length,
            projects: projects.length,
            videos: youtubeVideos.length,
            websites: websites.length,
          }}
        />
      </div>

      {/* Main Content Sections: 3D Rotating Scene Flow for 'All' View */}
      <main
        className={`relative z-10 flex-1 flex flex-col w-full ${
          activeSection === 'all' && scrollMode === '3d-scene' ? 'overflow-hidden' : ''
        }`}
      >
        {activeSection === 'all' && scrollMode === '3d-scene' ? (
          /* 3D Rotating Scene Transitions (Scroll triggers 3D screen rotation & reveals scene) */
          <div
            className="w-full flex-1 flex flex-col overflow-hidden"
            style={{ perspective: 1400 }}
          >
            <AnimatePresence mode="wait" custom={scrollDirection}>
              <motion.div
                key={activeSceneIndex}
                custom={scrollDirection}
                initial={(dir: number) => ({
                  opacity: 0,
                  rotateY: dir > 0 ? 38 : -38,
                  rotateX: dir > 0 ? 8 : -8,
                  translateZ: -140,
                  scale: 0.9,
                  filter: 'blur(8px)',
                })}
                animate={{
                  opacity: 1,
                  rotateY: 0,
                  rotateX: 0,
                  translateZ: 0,
                  scale: 1,
                  filter: 'blur(0px)',
                  transition: {
                    duration: 0.58,
                    ease: [0.16, 1, 0.3, 1],
                  },
                }}
                exit={(dir: number) => ({
                  opacity: 0,
                  rotateY: dir > 0 ? -38 : 38,
                  rotateX: dir > 0 ? -8 : 8,
                  translateZ: -140,
                  scale: 0.9,
                  filter: 'blur(8px)',
                  transition: {
                    duration: 0.46,
                    ease: [0.16, 1, 0.3, 1],
                  },
                })}
                style={{ transformStyle: 'preserve-3d' }}
                className="w-full flex-1 flex flex-col overflow-y-auto no-scrollbar scroll-smooth overscroll-contain"
              >
                {activeSceneIndex === 0 && (
                  <div className="flex-1 flex flex-col justify-between py-2 sm:py-6">
                    <HeroSection
                      aboutData={aboutData}
                      isAdmin={isEditingEnabled}
                      onEditAbout={() => setIsEditAboutOpen(true)}
                      onExploreProjects={() => {
                        setScrollDirection(1);
                        setActiveSceneIndex(1);
                        setSceneRotation((r) => r + 1.2);
                        cyberAudio.playScanLaser();
                      }}
                      onNavigate={handleNavigate}
                    />
                    {/* Alche Studio Scroll Cue */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-20 pt-4 flex justify-between items-center text-xs font-mono text-zinc-500">
                      <button
                        onClick={() => {
                          setScrollDirection(1);
                          setActiveSceneIndex(1);
                          setSceneRotation((r) => r + 1.2);
                          cyberAudio.playScanLaser();
                        }}
                        className="flex items-center gap-2 hover:text-black transition-colors cursor-pointer group"
                      >
                        <span className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse" />
                        <span className="tracking-widest uppercase font-semibold">
                          SCROLL DOWN TO ROTATE SCENE ↓
                        </span>
                      </button>
                      <span className="tracking-widest text-zinc-400 font-semibold">
                        [ 01 / 07 ] MISSION &amp; PHILOSOPHY
                      </span>
                    </div>
                  </div>
                )}

                {activeSceneIndex === 1 && (
                  <div className="flex-1 flex flex-col pb-24 pt-4">
                    <ProjectsSection
                      projects={projects}
                      isAdmin={isEditingEnabled}
                      onAddProject={() => setProjectModalData({ isOpen: true, item: null })}
                      onEditProject={(project) => setProjectModalData({ isOpen: true, item: project })}
                      onDeleteProject={handleDeleteProject}
                    />
                  </div>
                )}

                {activeSceneIndex === 2 && (
                  <div className="flex-1 flex flex-col pb-24 pt-4">
                    <JourneySection
                      journeys={journeys}
                      isAdmin={isEditingEnabled}
                      onAddJourney={() => setJourneyModalData({ isOpen: true, item: null })}
                      onEditJourney={(item) => setJourneyModalData({ isOpen: true, item })}
                      onDeleteJourney={handleDeleteJourney}
                    />
                  </div>
                )}

                {activeSceneIndex === 3 && (
                  <div className="flex-1 flex flex-col pb-24 pt-4">
                    <AwardsSection
                      awards={awards}
                      isAdmin={isEditingEnabled}
                      onAddAward={() => setAwardModalData({ isOpen: true, item: null })}
                      onEditAward={(award) => setAwardModalData({ isOpen: true, item: award })}
                      onDeleteAward={handleDeleteAward}
                    />
                  </div>
                )}

                {activeSceneIndex === 4 && (
                  <div className="flex-1 flex flex-col pb-24 pt-4">
                    <SkillsSection
                      skills={skills}
                      isAdmin={isEditingEnabled}
                      onAddSkill={() => setSkillModalData({ isOpen: true, item: null })}
                      onEditSkill={(skill) => setSkillModalData({ isOpen: true, item: skill })}
                      onDeleteSkill={handleDeleteSkill}
                    />
                  </div>
                )}

                {activeSceneIndex === 5 && (
                  <div className="flex-1 flex flex-col pb-24 pt-4">
                    <YouTubeSection
                      videos={youtubeVideos}
                      isAdmin={isEditingEnabled}
                      onAddVideo={() => setYoutubeModalData({ isOpen: true, item: null })}
                      onEditVideo={(video) => setYoutubeModalData({ isOpen: true, item: video })}
                      onDeleteVideo={handleDeleteYouTubeVideo}
                    />
                  </div>
                )}

                {activeSceneIndex === 6 && (
                  <div className="space-y-8 flex-1 flex flex-col justify-between pb-24 pt-4">
                    <div className="space-y-12">
                      <ExternalSiteSection
                        sites={websites}
                        isAdmin={isEditingEnabled}
                        onAddSite={() => setWebsiteModalData({ isOpen: true, item: null })}
                        onEditSite={(site) => setWebsiteModalData({ isOpen: true, item: site })}
                        onDeleteSite={handleDeleteWebsite}
                      />
                      <CompetitionReviewsSection
                        reviews={reviews}
                        isAdmin={isEditingEnabled}
                        onAddReview={() => setReviewModalData({ isOpen: true, item: null })}
                        onEditReview={(item) => setReviewModalData({ isOpen: true, item })}
                        onDeleteReview={handleDeleteReview}
                      />
                    </div>
                    <Footer onOpenAdmin={() => navigateTo('/admin')} isAdmin={isAdmin} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          /* Continuous Scroll or Single Section Mode */
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -16, filter: 'blur(4px)' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full space-y-6 flex-1 flex flex-col"
            >
              {(activeSection === 'all' || activeSection === 'about') && (
                <HeroSection
                  aboutData={aboutData}
                  isAdmin={isEditingEnabled}
                  onEditAbout={() => setIsEditAboutOpen(true)}
                  onExploreProjects={() => handleNavigate('experience')}
                  onNavigate={handleNavigate}
                />
              )}

              {(activeSection === 'all' || activeSection === 'experience') && (
                <ProjectsSection
                  projects={projects}
                  isAdmin={isEditingEnabled}
                  onAddProject={() => setProjectModalData({ isOpen: true, item: null })}
                  onEditProject={(project) => setProjectModalData({ isOpen: true, item: project })}
                  onDeleteProject={handleDeleteProject}
                />
              )}

              {(activeSection === 'all' || activeSection === 'journey') && (
                <JourneySection
                  journeys={journeys}
                  isAdmin={isEditingEnabled}
                  onAddJourney={() => setJourneyModalData({ isOpen: true, item: null })}
                  onEditJourney={(item) => setJourneyModalData({ isOpen: true, item })}
                  onDeleteJourney={handleDeleteJourney}
                />
              )}

              {(activeSection === 'all' || activeSection === 'awards') && (
                <AwardsSection
                  awards={awards}
                  isAdmin={isEditingEnabled}
                  onAddAward={() => setAwardModalData({ isOpen: true, item: null })}
                  onEditAward={(award) => setAwardModalData({ isOpen: true, item: award })}
                  onDeleteAward={handleDeleteAward}
                />
              )}

              {(activeSection === 'all' || activeSection === 'skills') && (
                <SkillsSection
                  skills={skills}
                  isAdmin={isEditingEnabled}
                  onAddSkill={() => setSkillModalData({ isOpen: true, item: null })}
                  onEditSkill={(skill) => setSkillModalData({ isOpen: true, item: skill })}
                  onDeleteSkill={handleDeleteSkill}
                />
              )}

              {(activeSection === 'all' || activeSection === 'youtube') && (
                <YouTubeSection
                  videos={youtubeVideos}
                  isAdmin={isEditingEnabled}
                  onAddVideo={() => setYoutubeModalData({ isOpen: true, item: null })}
                  onEditVideo={(video) => setYoutubeModalData({ isOpen: true, item: video })}
                  onDeleteVideo={handleDeleteYouTubeVideo}
                />
              )}

              {(activeSection === 'all' || activeSection === 'external-site') && (
                <ExternalSiteSection
                  sites={websites}
                  isAdmin={isEditingEnabled}
                  onAddSite={() => setWebsiteModalData({ isOpen: true, item: null })}
                  onEditSite={(site) => setWebsiteModalData({ isOpen: true, item: site })}
                  onDeleteSite={handleDeleteWebsite}
                />
              )}

              {(activeSection === 'all' || activeSection === 'reviews') && (
                <CompetitionReviewsSection
                  reviews={reviews}
                  isAdmin={isEditingEnabled}
                  onAddReview={() => setReviewModalData({ isOpen: true, item: null })}
                  onEditReview={(item) => setReviewModalData({ isOpen: true, item })}
                  onDeleteReview={handleDeleteReview}
                />
              )}

              {activeSection === 'all' && (
                <Footer onOpenAdmin={() => navigateTo('/admin')} isAdmin={isAdmin} />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Alche Studio Floating 3D Scene Controller HUD */}
      {activeSection === 'all' && (
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 sm:gap-4 bg-white/95 backdrop-blur-2xl border border-zinc-200/90 shadow-[0_10px_35px_rgba(0,0,0,0.12)] px-4 sm:px-6 py-2 rounded-full font-mono text-xs select-none">
          {/* Previous Scene Button */}
          <button
            onClick={() => {
              if (activeSceneIndex > 0) {
                setScrollDirection(-1);
                setActiveSceneIndex((prev) => prev - 1);
                setSceneRotation((r) => r - 1.2);
                cyberAudio.playKeyTick();
              }
            }}
            disabled={activeSceneIndex === 0 || scrollMode !== '3d-scene'}
            className="p-1.5 rounded-full text-zinc-700 hover:text-black hover:bg-zinc-100 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
            title="Previous Scene (Scroll Up)"
            aria-label="Previous Scene"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          {/* Current Scene Index & Title */}
          <div className="flex items-center gap-1.5 px-1 min-w-0">
            <span className="font-bold text-black">{SCENES[activeSceneIndex].key}</span>
            <span className="text-zinc-400">/</span>
            <span className="text-zinc-500">{`0${SCENES.length}`}</span>
            <span className="hidden md:inline font-semibold text-zinc-800 ml-1 truncate max-w-[200px]">
              [ {SCENES[activeSceneIndex].title} ]
            </span>
          </div>

          {/* 7 Interactive Stage Dots */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 border-x border-zinc-200">
            {SCENES.map((scene, idx) => (
              <button
                key={scene.id}
                onClick={() => {
                  setScrollDirection(idx >= activeSceneIndex ? 1 : -1);
                  setActiveSceneIndex(idx);
                  setSceneRotation((r) => r + 1.2);
                  cyberAudio.playKeyTick();
                }}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  activeSceneIndex === idx
                    ? 'w-6 bg-black'
                    : 'w-2 bg-zinc-300 hover:bg-zinc-500'
                }`}
                title={scene.title}
              />
            ))}
          </div>

          {/* Next Scene Button */}
          <button
            onClick={() => {
              if (activeSceneIndex < SCENES.length - 1) {
                setScrollDirection(1);
                setActiveSceneIndex((prev) => prev + 1);
                setSceneRotation((r) => r + 1.2);
                cyberAudio.playScanLaser();
              }
            }}
            disabled={activeSceneIndex === SCENES.length - 1 || scrollMode !== '3d-scene'}
            className="p-1.5 rounded-full text-zinc-700 hover:text-black hover:bg-zinc-100 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
            title="Next Scene (Scroll Down)"
            aria-label="Next Scene"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* 3D Scene Flow / Continuous Scroll Toggle */}
          <button
            onClick={() => {
              setScrollMode((prev) => (prev === '3d-scene' ? 'continuous' : '3d-scene'));
              cyberAudio.playKeyTick();
            }}
            className="ml-1 pl-2 sm:pl-3 border-l border-zinc-200 text-zinc-600 hover:text-black text-[11px] flex items-center gap-1 cursor-pointer font-semibold"
            title={scrollMode === '3d-scene' ? 'Switch to Continuous Scroll' : 'Switch to 3D Rotating Scenes'}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{scrollMode === '3d-scene' ? '3D SCENE' : 'CONTINUOUS'}</span>
          </button>
        </div>
      )}

      {/* Footer for single section views (when not in 'all' view) */}
      {activeSection !== 'all' && (
        <Footer onOpenAdmin={() => navigateTo('/admin')} isAdmin={isAdmin} />
      )}

      {/* Modals for Editing Content (Only operable when admin modal is opened) */}
      {isEditingEnabled && (
        <>
          <EditAboutModal
            isOpen={isEditAboutOpen}
            initialData={aboutData}
            onClose={() => setIsEditAboutOpen(false)}
            onSave={handleSaveAbout}
          />

          <EditJourneyModal
            isOpen={journeyModalData.isOpen}
            initialData={journeyModalData.item}
            onClose={() => setJourneyModalData({ isOpen: false, item: null })}
            onSave={handleSaveJourney}
            onDelete={handleDeleteJourney}
          />

          <EditAwardModal
            isOpen={awardModalData.isOpen}
            initialData={awardModalData.item}
            onClose={() => setAwardModalData({ isOpen: false, item: null })}
            onSave={handleSaveAward}
            onDelete={handleDeleteAward}
          />

          <EditSkillModal
            isOpen={skillModalData.isOpen}
            initialData={skillModalData.item}
            onClose={() => setSkillModalData({ isOpen: false, item: null })}
            onSave={handleSaveSkill}
            onDelete={handleDeleteSkill}
          />

          <EditProjectModal
            isOpen={projectModalData.isOpen}
            initialData={projectModalData.item}
            onClose={() => setProjectModalData({ isOpen: false, item: null })}
            onSave={handleSaveProject}
            onDelete={handleDeleteProject}
          />

          <EditYouTubeModal
            isOpen={youtubeModalData.isOpen}
            initialData={youtubeModalData.item}
            onClose={() => setYoutubeModalData({ isOpen: false, item: null })}
            onSave={handleSaveYouTubeVideo}
            onDelete={handleDeleteYouTubeVideo}
          />

          <EditReviewModal
            isOpen={reviewModalData.isOpen}
            initialData={reviewModalData.item}
            onClose={() => setReviewModalData({ isOpen: false, item: null })}
            onSave={handleSaveReview}
            onDelete={handleDeleteReview}
          />

          <EditWebsiteModal
            isOpen={websiteModalData.isOpen}
            initialData={websiteModalData.item}
            onClose={() => setWebsiteModalData({ isOpen: false, item: null })}
            onSave={handleSaveWebsite}
            onDelete={handleDeleteWebsite}
          />
        </>
      )}

      {/* Admin Users & Login Audit Logs Modal Overlay */}
      {isUsersViewOpen && (
        <div
          id="admin-users-modal-overlay"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsUsersViewOpen(false);
          }}
        >
          <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl animate-in zoom-in-95 duration-150">
            <AdminUsersView
              onClose={() => setIsUsersViewOpen(false)}
              websites={websites}
              onAddWebsite={() => setWebsiteModalData({ isOpen: true, item: null })}
              onEditWebsite={(site) => setWebsiteModalData({ isOpen: true, item: site })}
              onDeleteWebsite={handleDeleteWebsite}
            />
          </div>
        </div>
      )}

      {/* Visitor Check-in Modal (Instant Name/Message Entry) */}
      <VisitorCheckinModal
        isOpen={isCheckinModalOpen}
        onClose={() => setIsCheckinModalOpen(false)}
        onCheckinSuccess={(name) => setVisitorName(name)}
        onCheckoutSuccess={() => setVisitorName('')}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <ToastProvider>
              <PortfolioApp />
            </ToastProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
