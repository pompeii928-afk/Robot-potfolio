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
import { AuthProvider, useAuth } from './firebase/AuthContext';
import { ToastProvider, useToast } from './components/Toast';
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
import { AboutConfig, AwardItem, JourneyItem, ProjectItem, SkillItem } from './types';
import { EditAboutModal } from './components/modals/EditAboutModal';
import { EditJourneyModal } from './components/modals/EditJourneyModal';
import { EditAwardModal } from './components/modals/EditAwardModal';
import { EditSkillModal } from './components/modals/EditSkillModal';
import { EditProjectModal } from './components/modals/EditProjectModal';
import { GoogleLoginModal } from './components/GoogleLoginModal';

function PortfolioApp() {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState<string>('about');

  // Firestore States
  const [aboutData, setAboutData] = useState<AboutConfig>(DEFAULT_ABOUT_CONFIG);
  const [journeys, setJourneys] = useState<JourneyItem[]>(JOURNEY_DATA);
  const [awards, setAwards] = useState<AwardItem[]>(AWARDS_DATA);
  const [skills, setSkills] = useState<SkillItem[]>(SKILLS_DATA);
  const [projects, setProjects] = useState<ProjectItem[]>(PROJECTS_DATA);

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
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // CRUD Handlers with Toast Feedback
  const handleSaveAbout = async (data: AboutConfig) => {
    try {
      await saveAboutConfig(data);
      setAboutData(data);
      showToast('소개 정보가 안전하게 저장되었습니다.', 'success', '저장 완료');
    } catch (err) {
      console.error(err);
      showToast('소개 정보 저장에 실패했습니다. 관리자 권한을 확인해주세요.', 'error', '저장 실패');
      throw err;
    }
  };

  const handleSaveJourney = async (data: JourneyItem) => {
    try {
      const exists = journeys.some((j) => j.id === data.id);
      if (exists) {
        await updateJourney(data.id, data);
        showToast('대회 여정이 수정되었습니다.', 'success', '수정 완료');
      } else {
        await createJourney(data);
        showToast('새 대회 여정이 추가되었습니다.', 'success', '추가 완료');
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
      showToast('대회 여정이 삭제되었습니다.', 'info', '삭제 완료');
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
        showToast('수상 내역이 수정되었습니다.', 'success', '수정 완료');
      } else {
        await createAward(data);
        showToast('새 수상 내역이 등록되었습니다.', 'success', '등록 완료');
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
      showToast('수상 내역이 삭제되었습니다.', 'info', '삭제 완료');
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
        showToast('역량 항목이 수정되었습니다.', 'success', '수정 완료');
      } else {
        await createSkill(data);
        showToast('새 역량 항목이 추가되었습니다.', 'success', '추가 완료');
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
      showToast('역량 항목이 삭제되었습니다.', 'info', '삭제 완료');
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
        showToast('프로젝트가 수정되었습니다.', 'success', '수정 완료');
      } else {
        await createProject(data);
        showToast('새 프로젝트가 등록되었습니다.', 'success', '등록 완료');
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
      showToast('프로젝트가 삭제되었습니다.', 'info', '삭제 완료');
    } catch (err) {
      console.error(err);
      showToast('프로젝트 삭제에 실패했습니다.', 'error', '삭제 실패');
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-blueprint-grid text-slate-200 relative selection:bg-cyan-500 selection:text-black">
      {/* Subtle scanline / ambient overlay */}
      <div className="fixed inset-0 pointer-events-none z-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent opacity-60" />

      {/* Combined Sticky Top Header: Admin Bar + Navbar */}
      <header className="sticky top-0 z-50 w-full shadow-2xl">
        <AdminBar />
        <Navbar
          activeSection={activeSection}
          onNavigate={handleNavigate}
        />
      </header>

      {/* Main Content Sections */}
      <main className="relative z-10">
        <HeroSection
          aboutData={aboutData}
          isAdmin={isAdmin}
          onEditAbout={() => setIsEditAboutOpen(true)}
          onExploreProjects={() => handleNavigate('experience')}
        />

        <JourneySection
          journeys={journeys}
          isAdmin={isAdmin}
          onAddJourney={() => setJourneyModalData({ isOpen: true, item: null })}
          onEditJourney={(item) => setJourneyModalData({ isOpen: true, item })}
          onDeleteJourney={handleDeleteJourney}
        />

        <AwardsSection
          awards={awards}
          isAdmin={isAdmin}
          onAddAward={() => setAwardModalData({ isOpen: true, item: null })}
          onEditAward={(award) => setAwardModalData({ isOpen: true, item: award })}
          onDeleteAward={handleDeleteAward}
        />

        <SkillsSection
          skills={skills}
          isAdmin={isAdmin}
          onAddSkill={() => setSkillModalData({ isOpen: true, item: null })}
          onEditSkill={(skill) => setSkillModalData({ isOpen: true, item: skill })}
          onDeleteSkill={handleDeleteSkill}
        />

        <ProjectsSection
          projects={projects}
          isAdmin={isAdmin}
          onAddProject={() => setProjectModalData({ isOpen: true, item: null })}
          onEditProject={(project) => setProjectModalData({ isOpen: true, item: project })}
          onDeleteProject={handleDeleteProject}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals for Editing Content */}
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

      <GoogleLoginModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <PortfolioApp />
      </ToastProvider>
    </AuthProvider>
  );
}
