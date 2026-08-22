/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { JourneySection } from './components/JourneySection';
import { AwardsSection } from './components/AwardsSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { Footer } from './components/Footer';
import { AdminBar } from './components/AdminBar';
import { AdminLoginView } from './components/AdminLoginView';
import { AuthProvider, useAuth } from './firebase/AuthContext';
import { ToastProvider, useToast } from './components/Toast';
import { ThemeProvider, LanguageProvider, useTheme, useLanguage } from './context/ThemeContext';
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
} from './firebase/firestoreService';
import {
  DEFAULT_ABOUT_CONFIG,
  JOURNEY_DATA,
  AWARDS_DATA,
  SKILLS_DATA,
  PROJECTS_DATA,
} from './data/portfolioData';
import { CACHE_KEYS, getCachedData } from './utils/localCache';
import { AboutConfig, AwardItem, JourneyItem, ProjectItem, SkillItem } from './types';
import { EditAboutModal } from './components/modals/EditAboutModal';
import { EditJourneyModal } from './components/modals/EditJourneyModal';
import { EditAwardModal } from './components/modals/EditAwardModal';
import { EditSkillModal } from './components/modals/EditSkillModal';
import { EditProjectModal } from './components/modals/EditProjectModal';

function PortfolioApp() {
  const { isAdmin, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const { theme } = useTheme();
  const { lang, t } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>('about');

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

  // Modal States
  const [isEditAboutOpen, setIsEditAboutOpen] = useState(false);

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

    return () => {
      unsubAbout();
      unsubJourneys();
      unsubAwards();
      unsubSkills();
      unsubProjects();
    };
  }, []);

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'journey', 'awards', 'skills', 'experience'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      const header = document.querySelector('header');
      const headerHeight = header ? header.getBoundingClientRect().height : 70;
      const elementTop = el.getBoundingClientRect().top + window.pageYOffset;
      const targetY = Math.max(0, elementTop - headerHeight - 12);

      window.scrollTo({
        top: targetY,
        behavior: 'smooth',
      });
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
      if (exists) {
        await updateJourney(data.id, data);
        showToast(
          lang === 'en' ? 'Competition journey updated.' : '대회 여정이 수정되었습니다.',
          'success',
          lang === 'en' ? 'Updated' : '수정 완료'
        );
      } else {
        await createJourney(data);
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
          lang === 'en' ? 'Award entry updated.' : '수상 내역이 수정되었습니다.',
          'success',
          lang === 'en' ? 'Updated' : '수정 완료'
        );
      } else {
        await createAward(data);
        showToast(
          lang === 'en' ? 'New award registered.' : '새 수상 내역이 등록되었습니다.',
          'success',
          lang === 'en' ? 'Added' : '등록 완료'
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
        lang === 'en' ? 'Award entry deleted.' : '수상 내역이 삭제되었습니다.',
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
          lang === 'en' ? 'Skill updated.' : '역량 항목이 수정되었습니다.',
          'success',
          lang === 'en' ? 'Updated' : '수정 완료'
        );
      } else {
        await createSkill(data);
        showToast(
          lang === 'en' ? 'New skill added.' : '새 역량 항목이 추가되었습니다.',
          'success',
          lang === 'en' ? 'Added' : '추가 완료'
        );
      }
    } catch (err) {
      console.error(err);
      showToast('역량 항목 저장에 실패했습니다.', 'error', '오류 발생');
      throw err;
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await deleteSkill(id);
      showToast(
        lang === 'en' ? 'Skill deleted.' : '역량 항목이 삭제되었습니다.',
        'info',
        lang === 'en' ? 'Deleted' : '삭제 완료'
      );
    } catch (err) {
      console.error(err);
      showToast('역량 항목 삭제에 실패했습니다.', 'error', '삭제 실패');
      throw err;
    }
  };

  const handleSaveProject = async (data: ProjectItem) => {
    try {
      const exists = projects.some((p) => p.id === data.id);
      if (exists) {
        await updateProject(data.id, data);
        showToast(
          lang === 'en' ? 'Project updated.' : '프로젝트가 수정되었습니다.',
          'success',
          lang === 'en' ? 'Updated' : '수정 완료'
        );
      } else {
        await createProject(data);
        showToast(
          lang === 'en' ? 'New project registered.' : '새 프로젝트가 등록되었습니다.',
          'success',
          lang === 'en' ? 'Added' : '등록 완료'
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
        lang === 'en' ? 'Project deleted.' : '프로젝트가 삭제되었습니다.',
        'info',
        lang === 'en' ? 'Deleted' : '삭제 완료'
      );
    } catch (err) {
      console.error(err);
      showToast('프로젝트 삭제에 실패했습니다.', 'error', '삭제 실패');
      throw err;
    }
  };

  // If user requested /admin route:
  // If not authenticated -> Show AdminLoginView
  // If authenticated -> Show Admin Portfolio with AdminBar & Edit controls
  if (currentPath === '/admin' && !isAdmin && !authLoading) {
    return <AdminLoginView onBackToPublic={() => navigateTo('/')} />;
  }

  const isEditingEnabled = currentPath === '/admin' && isAdmin;

  return (
    <div
      className={`min-h-screen bg-blueprint-grid relative transition-colors duration-300 ${
        theme === 'light'
          ? 'text-slate-800 selection:bg-sky-500 selection:text-white'
          : 'text-slate-200 selection:bg-cyan-500 selection:text-black'
      }`}
    >
      {/* Subtle scanline / ambient overlay */}
      <div
        className={`fixed inset-0 pointer-events-none z-40 ${
          theme === 'light'
            ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400/5 via-transparent to-transparent opacity-60'
            : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent opacity-60'
        }`}
      />

      {/* Sticky Header: AdminBar is only visible when at /admin and logged in */}
      <header className="sticky top-0 z-50 w-full shadow-2xl">
        {isEditingEnabled && <AdminBar onViewPublic={() => navigateTo('/')} />}
        <Navbar
          activeSection={activeSection}
          onNavigate={handleNavigate}
        />
      </header>

      {/* Main Content Sections */}
      <main className="relative z-10">
        <HeroSection
          aboutData={aboutData}
          isAdmin={isEditingEnabled}
          onEditAbout={() => setIsEditAboutOpen(true)}
          onExploreProjects={() => handleNavigate('experience')}
        />

        <JourneySection
          journeys={journeys}
          isAdmin={isEditingEnabled}
          onAddJourney={() => setJourneyModalData({ isOpen: true, item: null })}
          onEditJourney={(item) => setJourneyModalData({ isOpen: true, item })}
          onDeleteJourney={handleDeleteJourney}
        />

        <AwardsSection
          awards={awards}
          isAdmin={isEditingEnabled}
          onAddAward={() => setAwardModalData({ isOpen: true, item: null })}
          onEditAward={(award) => setAwardModalData({ isOpen: true, item: award })}
          onDeleteAward={handleDeleteAward}
        />

        <SkillsSection
          skills={skills}
          isAdmin={isEditingEnabled}
          onAddSkill={() => setSkillModalData({ isOpen: true, item: null })}
          onEditSkill={(skill) => setSkillModalData({ isOpen: true, item: skill })}
          onDeleteSkill={handleDeleteSkill}
        />

        <ProjectsSection
          projects={projects}
          isAdmin={isEditingEnabled}
          onAddProject={() => setProjectModalData({ isOpen: true, item: null })}
          onEditProject={(project) => setProjectModalData({ isOpen: true, item: project })}
          onDeleteProject={handleDeleteProject}
        />
      </main>

      {/* Footer */}
      <Footer />

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
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <PortfolioApp />
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
