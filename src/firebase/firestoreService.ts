import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import { db } from './config';
import { handleFirestoreError, OperationType } from './errorHandling';
import { AboutConfig, AwardItem, JourneyItem, ProjectItem, SkillItem } from '../types';
import {
  DEFAULT_ABOUT_CONFIG,
  JOURNEY_DATA,
  AWARDS_DATA,
  SKILLS_DATA,
  PROJECTS_DATA,
} from '../data/portfolioData';

const ABOUT_DOC_PATH = 'about/main';
const JOURNEYS_COLLECTION = 'journeys';
const AWARDS_COLLECTION = 'awards';
const SKILLS_COLLECTION = 'skills';
const PROJECTS_COLLECTION = 'projects';

// ========================
// ABOUT CONFIG CRUD
// ========================

export function subscribeAboutConfig(
  onUpdate: (data: AboutConfig) => void,
  onError?: (error: unknown) => void
) {
  const docRef = doc(db, 'about', 'main');
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data() as AboutConfig);
      } else {
        // Fallback to default
        onUpdate(DEFAULT_ABOUT_CONFIG);
      }
    },
    (error) => {
      console.error('Error listening to about config:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, ABOUT_DOC_PATH);
    }
  );
}

export async function saveAboutConfig(data: AboutConfig): Promise<void> {
  const path = 'about/main';
  try {
    const docRef = doc(db, 'about', 'main');
    await setDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ========================
// JOURNEYS CRUD
// ========================

export function subscribeJourneys(
  onUpdate: (items: JourneyItem[]) => void,
  onError?: (error: unknown) => void
) {
  const colRef = collection(db, JOURNEYS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(JOURNEY_DATA);
      } else {
        const items = snapshot.docs.map((docSnap) => ({
          ...docSnap.data(),
          id: docSnap.id,
        })) as JourneyItem[];
        // Sort by order or keep original
        items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        onUpdate(items);
      }
    },
    (error) => {
      console.error('Error listening to journeys:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, JOURNEYS_COLLECTION);
    }
  );
}

export async function createJourney(journey: Omit<JourneyItem, 'id'> & { id?: string }): Promise<string> {
  const id = journey.id || `journey-${Date.now()}`;
  const path = `${JOURNEYS_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, JOURNEYS_COLLECTION, id);
    const item: JourneyItem = {
      ...journey,
      id,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, item);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateJourney(id: string, updates: Partial<JourneyItem>): Promise<void> {
  const path = `${JOURNEYS_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, JOURNEYS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteJourney(id: string): Promise<void> {
  const path = `${JOURNEYS_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, JOURNEYS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ========================
// AWARDS CRUD
// ========================

export function subscribeAwards(
  onUpdate: (items: AwardItem[]) => void,
  onError?: (error: unknown) => void
) {
  const colRef = collection(db, AWARDS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(AWARDS_DATA);
      } else {
        const items = snapshot.docs.map((docSnap) => ({
          ...docSnap.data(),
          id: docSnap.id,
        })) as AwardItem[];
        items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        onUpdate(items);
      }
    },
    (error) => {
      console.error('Error listening to awards:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, AWARDS_COLLECTION);
    }
  );
}

export async function createAward(award: Omit<AwardItem, 'id'> & { id?: string }): Promise<string> {
  const id = award.id || `award-${Date.now()}`;
  const path = `${AWARDS_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, AWARDS_COLLECTION, id);
    const item: AwardItem = {
      ...award,
      id,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, item);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateAward(id: string, updates: Partial<AwardItem>): Promise<void> {
  const path = `${AWARDS_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, AWARDS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteAward(id: string): Promise<void> {
  const path = `${AWARDS_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, AWARDS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ========================
// SKILLS CRUD
// ========================

export function subscribeSkills(
  onUpdate: (items: SkillItem[]) => void,
  onError?: (error: unknown) => void
) {
  const colRef = collection(db, SKILLS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(SKILLS_DATA);
      } else {
        const items = snapshot.docs.map((docSnap) => ({
          ...docSnap.data(),
          id: docSnap.id,
        })) as SkillItem[];
        items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        onUpdate(items);
      }
    },
    (error) => {
      console.error('Error listening to skills:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, SKILLS_COLLECTION);
    }
  );
}

export async function createSkill(skill: Omit<SkillItem, 'id'> & { id?: string }): Promise<string> {
  const id = skill.id || `skill-${Date.now()}`;
  const path = `${SKILLS_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, SKILLS_COLLECTION, id);
    const item: SkillItem = {
      ...skill,
      id,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, item);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateSkill(id: string, updates: Partial<SkillItem>): Promise<void> {
  const path = `${SKILLS_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, SKILLS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteSkill(id: string): Promise<void> {
  const path = `${SKILLS_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, SKILLS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ========================
// PROJECTS CRUD
// ========================

export function subscribeProjects(
  onUpdate: (items: ProjectItem[]) => void,
  onError?: (error: unknown) => void
) {
  const colRef = collection(db, PROJECTS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(PROJECTS_DATA);
      } else {
        const items = snapshot.docs.map((docSnap) => ({
          ...docSnap.data(),
          id: docSnap.id,
        })) as ProjectItem[];
        items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        onUpdate(items);
      }
    },
    (error) => {
      console.error('Error listening to projects:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, PROJECTS_COLLECTION);
    }
  );
}

export async function createProject(project: Omit<ProjectItem, 'id'> & { id?: string }): Promise<string> {
  const id = project.id || `proj-${Date.now()}`;
  const path = `${PROJECTS_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, id);
    const item: ProjectItem = {
      ...project,
      id,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, item);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateProject(id: string, updates: Partial<ProjectItem>): Promise<void> {
  const path = `${PROJECTS_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteProject(id: string): Promise<void> {
  const path = `${PROJECTS_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ========================
// SEED & RESET DATA
// ========================

export async function seedAllPortfolioData(): Promise<void> {
  try {
    const batch = writeBatch(db);

    // About
    const aboutRef = doc(db, 'about', 'main');
    batch.set(aboutRef, {
      ...DEFAULT_ABOUT_CONFIG,
      updatedAt: new Date().toISOString(),
    });

    // Journeys
    JOURNEY_DATA.forEach((j, index) => {
      const ref = doc(db, JOURNEYS_COLLECTION, j.id);
      batch.set(ref, { ...j, order: index, updatedAt: new Date().toISOString() });
    });

    // Awards
    AWARDS_DATA.forEach((a, index) => {
      const ref = doc(db, AWARDS_COLLECTION, a.id);
      batch.set(ref, { ...a, order: index, updatedAt: new Date().toISOString() });
    });

    // Skills
    SKILLS_DATA.forEach((s, index) => {
      const ref = doc(db, SKILLS_COLLECTION, s.id);
      batch.set(ref, { ...s, order: index, updatedAt: new Date().toISOString() });
    });

    // Projects
    PROJECTS_DATA.forEach((p, index) => {
      const ref = doc(db, PROJECTS_COLLECTION, p.id);
      batch.set(ref, { ...p, order: index, updatedAt: new Date().toISOString() });
    });

    await batch.commit();
    console.log('[Firestore] All portfolio data successfully seeded!');
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'batch-seed');
  }
}
