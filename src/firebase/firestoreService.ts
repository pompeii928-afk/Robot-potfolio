import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
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
import { CACHE_KEYS, setCachedData } from '../utils/localCache';

const ABOUT_DOC_PATH = 'about/main';
const JOURNEYS_COLLECTION = 'journeys';
const AWARDS_COLLECTION = 'awards';
const SKILLS_COLLECTION = 'skills';
const PROJECTS_COLLECTION = 'projects';
const SYSTEM_COLLECTION = 'system';

// Helper to mark a collection as initialized in Firestore & local cache
async function markInitialized(collectionName: string) {
  try {
    localStorage.setItem(`kfc_init_${collectionName}`, 'true');
    const markerRef = doc(db, SYSTEM_COLLECTION, `${collectionName}_init`);
    await setDoc(markerRef, { initialized: true, updatedAt: new Date().toISOString() });
  } catch (err) {
    console.warn(`[Firestore] Mark initialized error (${collectionName}):`, err);
  }
}

async function isCollectionInitialized(collectionName: string): Promise<boolean> {
  if (typeof window !== 'undefined' && localStorage.getItem(`kfc_init_${collectionName}`) === 'true') {
    return true;
  }
  try {
    const markerRef = doc(db, SYSTEM_COLLECTION, `${collectionName}_init`);
    const snap = await getDoc(markerRef);
    if (snap.exists() && snap.data()?.initialized) {
      if (typeof window !== 'undefined') localStorage.setItem(`kfc_init_${collectionName}`, 'true');
      return true;
    }
  } catch (err) {
    console.warn(`[Firestore] Check initialized error (${collectionName}):`, err);
  }
  return false;
}

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
        const data = snapshot.data() as AboutConfig;
        setCachedData(CACHE_KEYS.ABOUT, data);
        onUpdate(data);
      } else {
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
    setCachedData(CACHE_KEYS.ABOUT, data);
    await markInitialized('about');
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
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
    async (snapshot) => {
      if (snapshot.empty) {
        const initialized = await isCollectionInitialized(JOURNEYS_COLLECTION);
        if (initialized) {
          setCachedData(CACHE_KEYS.JOURNEYS, []);
          onUpdate([]);
        } else {
          setCachedData(CACHE_KEYS.JOURNEYS, JOURNEY_DATA);
          onUpdate(JOURNEY_DATA);
        }
      } else {
        const items = snapshot.docs.map((docSnap) => ({
          ...docSnap.data(),
          id: docSnap.id,
        })) as JourneyItem[];
        items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setCachedData(CACHE_KEYS.JOURNEYS, items);
        onUpdate(items);
        if (typeof window !== 'undefined') localStorage.setItem(`kfc_init_${JOURNEYS_COLLECTION}`, 'true');
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
    const colRef = collection(db, JOURNEYS_COLLECTION);
    const snap = await getDocs(colRef);

    if (snap.empty) {
      const initialized = await isCollectionInitialized(JOURNEYS_COLLECTION);
      if (!initialized) {
        // Seed other default journeys so they aren't lost
        const batch = writeBatch(db);
        JOURNEY_DATA.forEach((j, idx) => {
          const jRef = doc(db, JOURNEYS_COLLECTION, j.id);
          batch.set(jRef, { ...j, order: idx, updatedAt: new Date().toISOString() });
        });
        const newRef = doc(db, JOURNEYS_COLLECTION, id);
        const itemWithOrder = { ...journey, id, order: JOURNEY_DATA.length, updatedAt: new Date().toISOString() };
        batch.set(newRef, itemWithOrder);
        await batch.commit();
        await markInitialized(JOURNEYS_COLLECTION);
        return id;
      }
    }

    const docRef = doc(db, JOURNEYS_COLLECTION, id);
    const item: JourneyItem = {
      ...journey,
      id,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, item);
    await markInitialized(JOURNEYS_COLLECTION);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

export async function updateJourney(id: string, updates: Partial<JourneyItem>): Promise<void> {
  const path = `${JOURNEYS_COLLECTION}/${id}`;
  try {
    const colRef = collection(db, JOURNEYS_COLLECTION);
    const snap = await getDocs(colRef);

    if (snap.empty) {
      // Seed all default journeys with updates
      const batch = writeBatch(db);
      JOURNEY_DATA.forEach((j, idx) => {
        const jRef = doc(db, JOURNEYS_COLLECTION, j.id);
        const itemData = j.id === id ? { ...j, ...updates } : j;
        batch.set(jRef, { ...itemData, order: idx, updatedAt: new Date().toISOString() });
      });
      await batch.commit();
      await markInitialized(JOURNEYS_COLLECTION);
      return;
    }

    const docRef = doc(db, JOURNEYS_COLLECTION, id);
    await setDoc(docRef, { ...updates, updatedAt: new Date().toISOString() }, { merge: true });
    await markInitialized(JOURNEYS_COLLECTION);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

export async function deleteJourney(id: string): Promise<void> {
  const path = `${JOURNEYS_COLLECTION}/${id}`;
  try {
    const colRef = collection(db, JOURNEYS_COLLECTION);
    const snap = await getDocs(colRef);

    if (snap.empty) {
      // If collection was empty, write remaining default items minus the deleted one
      const batch = writeBatch(db);
      JOURNEY_DATA.filter((j) => j.id !== id).forEach((item, idx) => {
        const jRef = doc(db, JOURNEYS_COLLECTION, item.id);
        batch.set(jRef, { ...item, order: idx, updatedAt: new Date().toISOString() });
      });
      await batch.commit();
    } else {
      const docRef = doc(db, JOURNEYS_COLLECTION, id);
      await deleteDoc(docRef);
    }
    await markInitialized(JOURNEYS_COLLECTION);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
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
    async (snapshot) => {
      if (snapshot.empty) {
        const initialized = await isCollectionInitialized(AWARDS_COLLECTION);
        if (initialized) {
          setCachedData(CACHE_KEYS.AWARDS, []);
          onUpdate([]);
        } else {
          setCachedData(CACHE_KEYS.AWARDS, AWARDS_DATA);
          onUpdate(AWARDS_DATA);
        }
      } else {
        const items = snapshot.docs.map((docSnap) => ({
          ...docSnap.data(),
          id: docSnap.id,
        })) as AwardItem[];
        items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setCachedData(CACHE_KEYS.AWARDS, items);
        onUpdate(items);
        if (typeof window !== 'undefined') localStorage.setItem(`kfc_init_${AWARDS_COLLECTION}`, 'true');
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
    const colRef = collection(db, AWARDS_COLLECTION);
    const snap = await getDocs(colRef);

    if (snap.empty) {
      const initialized = await isCollectionInitialized(AWARDS_COLLECTION);
      if (!initialized) {
        const batch = writeBatch(db);
        AWARDS_DATA.forEach((a, idx) => {
          const aRef = doc(db, AWARDS_COLLECTION, a.id);
          batch.set(aRef, { ...a, order: idx, updatedAt: new Date().toISOString() });
        });
        const newRef = doc(db, AWARDS_COLLECTION, id);
        batch.set(newRef, { ...award, id, order: AWARDS_DATA.length, updatedAt: new Date().toISOString() });
        await batch.commit();
        await markInitialized(AWARDS_COLLECTION);
        return id;
      }
    }

    const docRef = doc(db, AWARDS_COLLECTION, id);
    const item: AwardItem = {
      ...award,
      id,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, item);
    await markInitialized(AWARDS_COLLECTION);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

export async function updateAward(id: string, updates: Partial<AwardItem>): Promise<void> {
  const path = `${AWARDS_COLLECTION}/${id}`;
  try {
    const colRef = collection(db, AWARDS_COLLECTION);
    const snap = await getDocs(colRef);

    if (snap.empty) {
      const batch = writeBatch(db);
      AWARDS_DATA.forEach((a, idx) => {
        const aRef = doc(db, AWARDS_COLLECTION, a.id);
        const itemData = a.id === id ? { ...a, ...updates } : a;
        batch.set(aRef, { ...itemData, order: idx, updatedAt: new Date().toISOString() });
      });
      await batch.commit();
      await markInitialized(AWARDS_COLLECTION);
      return;
    }

    const docRef = doc(db, AWARDS_COLLECTION, id);
    await setDoc(docRef, { ...updates, updatedAt: new Date().toISOString() }, { merge: true });
    await markInitialized(AWARDS_COLLECTION);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

export async function deleteAward(id: string): Promise<void> {
  const path = `${AWARDS_COLLECTION}/${id}`;
  try {
    const colRef = collection(db, AWARDS_COLLECTION);
    const snap = await getDocs(colRef);

    if (snap.empty) {
      // If collection was empty, write remaining default items minus the deleted one
      const batch = writeBatch(db);
      AWARDS_DATA.filter((a) => a.id !== id).forEach((item, idx) => {
        const aRef = doc(db, AWARDS_COLLECTION, item.id);
        batch.set(aRef, { ...item, order: idx, updatedAt: new Date().toISOString() });
      });
      await batch.commit();
    } else {
      const docRef = doc(db, AWARDS_COLLECTION, id);
      await deleteDoc(docRef);
    }
    await markInitialized(AWARDS_COLLECTION);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
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
    async (snapshot) => {
      if (snapshot.empty) {
        const initialized = await isCollectionInitialized(SKILLS_COLLECTION);
        if (initialized) {
          setCachedData(CACHE_KEYS.SKILLS, []);
          onUpdate([]);
        } else {
          setCachedData(CACHE_KEYS.SKILLS, SKILLS_DATA);
          onUpdate(SKILLS_DATA);
        }
      } else {
        const items = snapshot.docs.map((docSnap) => ({
          ...docSnap.data(),
          id: docSnap.id,
        })) as SkillItem[];
        items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setCachedData(CACHE_KEYS.SKILLS, items);
        onUpdate(items);
        if (typeof window !== 'undefined') localStorage.setItem(`kfc_init_${SKILLS_COLLECTION}`, 'true');
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
    const colRef = collection(db, SKILLS_COLLECTION);
    const snap = await getDocs(colRef);

    if (snap.empty) {
      const initialized = await isCollectionInitialized(SKILLS_COLLECTION);
      if (!initialized) {
        const batch = writeBatch(db);
        SKILLS_DATA.forEach((s, idx) => {
          const sRef = doc(db, SKILLS_COLLECTION, s.id);
          batch.set(sRef, { ...s, order: idx, updatedAt: new Date().toISOString() });
        });
        const newRef = doc(db, SKILLS_COLLECTION, id);
        batch.set(newRef, { ...skill, id, order: SKILLS_DATA.length, updatedAt: new Date().toISOString() });
        await batch.commit();
        await markInitialized(SKILLS_COLLECTION);
        return id;
      }
    }

    const docRef = doc(db, SKILLS_COLLECTION, id);
    const item: SkillItem = {
      ...skill,
      id,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, item);
    await markInitialized(SKILLS_COLLECTION);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

export async function updateSkill(id: string, updates: Partial<SkillItem>): Promise<void> {
  const path = `${SKILLS_COLLECTION}/${id}`;
  try {
    const colRef = collection(db, SKILLS_COLLECTION);
    const snap = await getDocs(colRef);

    if (snap.empty) {
      const batch = writeBatch(db);
      SKILLS_DATA.forEach((s, idx) => {
        const sRef = doc(db, SKILLS_COLLECTION, s.id);
        const itemData = s.id === id ? { ...s, ...updates } : s;
        batch.set(sRef, { ...itemData, order: idx, updatedAt: new Date().toISOString() });
      });
      await batch.commit();
      await markInitialized(SKILLS_COLLECTION);
      return;
    }

    const docRef = doc(db, SKILLS_COLLECTION, id);
    await setDoc(docRef, { ...updates, updatedAt: new Date().toISOString() }, { merge: true });
    await markInitialized(SKILLS_COLLECTION);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

export async function deleteSkill(id: string): Promise<void> {
  const path = `${SKILLS_COLLECTION}/${id}`;
  try {
    const colRef = collection(db, SKILLS_COLLECTION);
    const snap = await getDocs(colRef);

    if (snap.empty) {
      const batch = writeBatch(db);
      SKILLS_DATA.filter((s) => s.id !== id).forEach((item, idx) => {
        const sRef = doc(db, SKILLS_COLLECTION, item.id);
        batch.set(sRef, { ...item, order: idx, updatedAt: new Date().toISOString() });
      });
      await batch.commit();
    } else {
      const docRef = doc(db, SKILLS_COLLECTION, id);
      await deleteDoc(docRef);
    }
    await markInitialized(SKILLS_COLLECTION);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
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
    async (snapshot) => {
      if (snapshot.empty) {
        const initialized = await isCollectionInitialized(PROJECTS_COLLECTION);
        if (initialized) {
          setCachedData(CACHE_KEYS.PROJECTS, []);
          onUpdate([]);
        } else {
          setCachedData(CACHE_KEYS.PROJECTS, PROJECTS_DATA);
          onUpdate(PROJECTS_DATA);
        }
      } else {
        const items = snapshot.docs.map((docSnap) => ({
          ...docSnap.data(),
          id: docSnap.id,
        })) as ProjectItem[];
        items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setCachedData(CACHE_KEYS.PROJECTS, items);
        onUpdate(items);
        if (typeof window !== 'undefined') localStorage.setItem(`kfc_init_${PROJECTS_COLLECTION}`, 'true');
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
    const colRef = collection(db, PROJECTS_COLLECTION);
    const snap = await getDocs(colRef);

    if (snap.empty) {
      const initialized = await isCollectionInitialized(PROJECTS_COLLECTION);
      if (!initialized) {
        const batch = writeBatch(db);
        PROJECTS_DATA.forEach((p, idx) => {
          const pRef = doc(db, PROJECTS_COLLECTION, p.id);
          batch.set(pRef, { ...p, order: idx, updatedAt: new Date().toISOString() });
        });
        const newRef = doc(db, PROJECTS_COLLECTION, id);
        batch.set(newRef, { ...project, id, order: PROJECTS_DATA.length, updatedAt: new Date().toISOString() });
        await batch.commit();
        await markInitialized(PROJECTS_COLLECTION);
        return id;
      }
    }

    const docRef = doc(db, PROJECTS_COLLECTION, id);
    const item: ProjectItem = {
      ...project,
      id,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, item);
    await markInitialized(PROJECTS_COLLECTION);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

export async function updateProject(id: string, updates: Partial<ProjectItem>): Promise<void> {
  const path = `${PROJECTS_COLLECTION}/${id}`;
  try {
    const colRef = collection(db, PROJECTS_COLLECTION);
    const snap = await getDocs(colRef);

    if (snap.empty) {
      const batch = writeBatch(db);
      PROJECTS_DATA.forEach((p, idx) => {
        const pRef = doc(db, PROJECTS_COLLECTION, p.id);
        const itemData = p.id === id ? { ...p, ...updates } : p;
        batch.set(pRef, { ...itemData, order: idx, updatedAt: new Date().toISOString() });
      });
      await batch.commit();
      await markInitialized(PROJECTS_COLLECTION);
      return;
    }

    const docRef = doc(db, PROJECTS_COLLECTION, id);
    await setDoc(docRef, { ...updates, updatedAt: new Date().toISOString() }, { merge: true });
    await markInitialized(PROJECTS_COLLECTION);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

export async function deleteProject(id: string): Promise<void> {
  const path = `${PROJECTS_COLLECTION}/${id}`;
  try {
    const colRef = collection(db, PROJECTS_COLLECTION);
    const snap = await getDocs(colRef);

    if (snap.empty) {
      const batch = writeBatch(db);
      PROJECTS_DATA.filter((p) => p.id !== id).forEach((item, idx) => {
        const pRef = doc(db, PROJECTS_COLLECTION, item.id);
        batch.set(pRef, { ...item, order: idx, updatedAt: new Date().toISOString() });
      });
      await batch.commit();
    } else {
      const docRef = doc(db, PROJECTS_COLLECTION, id);
      await deleteDoc(docRef);
    }
    await markInitialized(PROJECTS_COLLECTION);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
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
    setCachedData(CACHE_KEYS.ABOUT, DEFAULT_ABOUT_CONFIG);

    // Journeys
    JOURNEY_DATA.forEach((j, index) => {
      const ref = doc(db, JOURNEYS_COLLECTION, j.id);
      batch.set(ref, { ...j, order: index, updatedAt: new Date().toISOString() });
    });
    setCachedData(CACHE_KEYS.JOURNEYS, JOURNEY_DATA);

    // Awards
    AWARDS_DATA.forEach((a, index) => {
      const ref = doc(db, AWARDS_COLLECTION, a.id);
      batch.set(ref, { ...a, order: index, updatedAt: new Date().toISOString() });
    });
    setCachedData(CACHE_KEYS.AWARDS, AWARDS_DATA);

    // Skills
    SKILLS_DATA.forEach((s, index) => {
      const ref = doc(db, SKILLS_COLLECTION, s.id);
      batch.set(ref, { ...s, order: index, updatedAt: new Date().toISOString() });
    });
    setCachedData(CACHE_KEYS.SKILLS, SKILLS_DATA);

    // Projects
    PROJECTS_DATA.forEach((p, index) => {
      const ref = doc(db, PROJECTS_COLLECTION, p.id);
      batch.set(ref, { ...p, order: index, updatedAt: new Date().toISOString() });
    });
    setCachedData(CACHE_KEYS.PROJECTS, PROJECTS_DATA);

    // Initialize all markers
    const markers = [JOURNEYS_COLLECTION, AWARDS_COLLECTION, SKILLS_COLLECTION, PROJECTS_COLLECTION, 'about'];
    markers.forEach((name) => {
      const markerRef = doc(db, SYSTEM_COLLECTION, `${name}_init`);
      batch.set(markerRef, { initialized: true, updatedAt: new Date().toISOString() });
    });

    await batch.commit();

    markers.forEach((name) => {
      if (typeof window !== 'undefined') localStorage.setItem(`kfc_init_${name}`, 'true');
    });

    console.log('[Firestore] All portfolio data successfully seeded!');
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'batch-seed');
    throw error;
  }
}
