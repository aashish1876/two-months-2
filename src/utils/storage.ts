import { Friend, Memory, ChapterId, RememberedQuote, RandomSnippet, HeroConfig, FinalSceneConfig, GroupConfig, ChapterInfo, CapsuleAllData } from '../types';
import {
  INITIAL_FRIENDS,
  INITIAL_MEMORIES,
  VIDEO_MEMORIES,
  REMEMBERED_QUOTES,
  RANDOM_SNIPPETS,
  CHAPTERS_INFO,
  DEFAULT_HERO_CONFIG,
  DEFAULT_GROUP_CONFIG,
  DEFAULT_FINAL_SCENE_CONFIG
} from '../data/memoriesData';
import { dbSet, dbDelete, dbGetAll, isIDBAvailable } from './db';

const FRIENDS_KEY = 'two_months_friends_v2';
const MEMORIES_KEY = 'two_months_memories_v2';
const VIDEOS_KEY = 'two_months_videos_v2';
const QUOTES_KEY = 'two_months_quotes_v2';
const SNIPPETS_KEY = 'two_months_snippets_v2';
const HERO_KEY = 'two_months_hero_v2';
const FINAL_KEY = 'two_months_final_v2';
const GROUP_KEY = 'two_months_group_v2';
const CHAPTERS_KEY = 'two_months_chapters_v2';
const EDIT_MODE_KEY = 'two_months_edit_mode_active';

// In-memory fallback
const memoryStore: Record<string, string> = {};
const idbSupported = isIDBAvailable();

function getItem(key: string): string | null {
  return memoryStore[key] !== undefined ? memoryStore[key] : null;
}

function setItem(key: string, value: string): void {
  memoryStore[key] = value;
  if (idbSupported) {
    dbSet(key, value).catch((err) => console.warn('IndexedDB write failed (kept in memory):', key, err));
  }
}

function removeItem(key: string): void {
  delete memoryStore[key];
  if (idbSupported) dbDelete(key).catch((err) => console.warn('IndexedDB delete failed:', key, err));
}

const ALL_KEYS = [FRIENDS_KEY, MEMORIES_KEY, VIDEOS_KEY, QUOTES_KEY, SNIPPETS_KEY,
                  HERO_KEY, FINAL_KEY, GROUP_KEY, CHAPTERS_KEY, EDIT_MODE_KEY];

export async function initStorage(): Promise<void> {
  if (!idbSupported) return;
  try {
    const stored = await dbGetAll();
    for (const [k, v] of Object.entries(stored)) memoryStore[k] = v;

    for (const key of ALL_KEYS) {
      if (stored[key] !== undefined) continue;
      let legacy: string | null = null;
      try { legacy = window.localStorage.getItem(key); } catch { /* ignore */ }
      if (legacy !== null && legacy !== undefined) {
        memoryStore[key] = legacy;
        try { await dbSet(key, legacy); window.localStorage.removeItem(key); } catch (e) { console.warn('Failed to migrate key', key, e); }
      }
    }
  } catch (err) {
    console.warn('initStorage failed; continuing with in-memory/session data', err);
  }
}

// EDIT MODE STATE (default to true so user can edit immediately)
export function getStoredEditMode(): boolean {
  const saved = getItem(EDIT_MODE_KEY);
  if (saved !== null) {
    return saved === 'true';
  }
  return true; // Default ON so the user sees the requested edit tools right away
}

export function saveStoredEditMode(active: boolean): void {
  setItem(EDIT_MODE_KEY, active ? 'true' : 'false');
}

// FRIENDS
export function getStoredFriends(): Friend[] {
  try {
    const saved = getItem(FRIENDS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse friends from storage', e);
  }
  return INITIAL_FRIENDS;
}

export function saveStoredFriends(friends: Friend[]): void {
  setItem(FRIENDS_KEY, JSON.stringify(friends));
}

// MEMORIES
export function getStoredMemories(): Memory[] {
  try {
    const saved = getItem(MEMORIES_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse memories from storage', e);
  }
  return INITIAL_MEMORIES;
}

export function saveStoredMemories(memories: Memory[]): void {
  setItem(MEMORIES_KEY, JSON.stringify(memories));
}

// VIDEOS
export function getStoredVideos(): Memory[] {
  try {
    const saved = getItem(VIDEOS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse videos from storage', e);
  }
  return VIDEO_MEMORIES;
}

export function saveStoredVideos(videos: Memory[]): void {
  setItem(VIDEOS_KEY, JSON.stringify(videos));
}

// QUOTES
export function getStoredQuotes(): RememberedQuote[] {
  try {
    const saved = getItem(QUOTES_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse quotes from storage', e);
  }
  return REMEMBERED_QUOTES;
}

export function saveStoredQuotes(quotes: RememberedQuote[]): void {
  setItem(QUOTES_KEY, JSON.stringify(quotes));
}

// SNIPPETS
export function getStoredSnippets(): RandomSnippet[] {
  try {
    const saved = getItem(SNIPPETS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse snippets from storage', e);
  }
  return RANDOM_SNIPPETS;
}

export function saveStoredSnippets(snippets: RandomSnippet[]): void {
  setItem(SNIPPETS_KEY, JSON.stringify(snippets));
}

// HERO CONFIG
export function getStoredHeroConfig(): HeroConfig {
  try {
    const saved = getItem(HERO_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to parse hero config', e);
  }
  return DEFAULT_HERO_CONFIG;
}

export function saveStoredHeroConfig(hero: HeroConfig): void {
  setItem(HERO_KEY, JSON.stringify(hero));
}

// GROUP CONFIG
export function getStoredGroupConfig(): GroupConfig {
  try {
    const saved = getItem(GROUP_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_GROUP_CONFIG,
        ...parsed,
        groupPhotoUrl: parsed.groupPhotoUrl || DEFAULT_GROUP_CONFIG.groupPhotoUrl,
        groupPhotoCaption: parsed.groupPhotoCaption || parsed.quote || DEFAULT_GROUP_CONFIG.groupPhotoCaption,
        statText: parsed.statText || parsed.mileMarker || DEFAULT_GROUP_CONFIG.statText,
        headline: parsed.headline || DEFAULT_GROUP_CONFIG.headline,
        subheadline: parsed.subheadline || DEFAULT_GROUP_CONFIG.subheadline,
        description: parsed.description || DEFAULT_GROUP_CONFIG.description,
      };
    }
  } catch (e) {
    console.warn('Failed to parse group config', e);
  }
  return DEFAULT_GROUP_CONFIG;
}

export function saveStoredGroupConfig(cfg: GroupConfig): void {
  const merged: GroupConfig = {
    ...DEFAULT_GROUP_CONFIG,
    ...cfg,
    quote: cfg.groupPhotoCaption || cfg.quote || DEFAULT_GROUP_CONFIG.quote,
    caption: cfg.groupPhotoCaption || cfg.caption || DEFAULT_GROUP_CONFIG.caption,
    groupPhotoCaption: cfg.groupPhotoCaption || cfg.quote || DEFAULT_GROUP_CONFIG.groupPhotoCaption,
    mileMarker: cfg.statText || cfg.mileMarker || DEFAULT_GROUP_CONFIG.mileMarker,
    statText: cfg.statText || cfg.mileMarker || DEFAULT_GROUP_CONFIG.statText,
  };
  setItem(GROUP_KEY, JSON.stringify(merged));
}

// FINAL SCENE CONFIG
export function getStoredFinalSceneConfig(): FinalSceneConfig {
  try {
    const saved = getItem(FINAL_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to parse final scene config', e);
  }
  return DEFAULT_FINAL_SCENE_CONFIG;
}

export function saveStoredFinalSceneConfig(cfg: FinalSceneConfig): void {
  setItem(FINAL_KEY, JSON.stringify(cfg));
}

// CHAPTERS CONFIG
export function getStoredChapters(): Record<ChapterId, ChapterInfo> {
  try {
    const saved = getItem(CHAPTERS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to parse chapters config', e);
  }
  return CHAPTERS_INFO;
}

export function saveStoredChapters(chapters: Record<ChapterId, ChapterInfo>): void {
  setItem(CHAPTERS_KEY, JSON.stringify(chapters));
}

// EXPORT ALL DATA
export function exportAllDataJSON(): string {
  const allData: CapsuleAllData = {
    version: 2,
    exportedAt: new Date().toISOString(),
    hero: getStoredHeroConfig(),
    friends: getStoredFriends(),
    groupConfig: getStoredGroupConfig(),
    memories: getStoredMemories(),
    videos: getStoredVideos(),
    quotes: getStoredQuotes(),
    snippets: getStoredSnippets(),
    finalScene: getStoredFinalSceneConfig(),
    chapters: getStoredChapters()
  };
  return JSON.stringify(allData, null, 2);
}

// IMPORT ALL DATA
export function importAllDataJSON(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') return false;

    if (parsed.hero) saveStoredHeroConfig(parsed.hero);
    if (parsed.friends && Array.isArray(parsed.friends)) saveStoredFriends(parsed.friends);
    if (parsed.groupConfig) saveStoredGroupConfig(parsed.groupConfig);
    if (parsed.memories && Array.isArray(parsed.memories)) saveStoredMemories(parsed.memories);
    if (parsed.videos && Array.isArray(parsed.videos)) saveStoredVideos(parsed.videos);
    if (parsed.quotes && Array.isArray(parsed.quotes)) saveStoredQuotes(parsed.quotes);
    if (parsed.snippets && Array.isArray(parsed.snippets)) saveStoredSnippets(parsed.snippets);
    if (parsed.finalScene) saveStoredFinalSceneConfig(parsed.finalScene);
    if (parsed.chapters) saveStoredChapters(parsed.chapters);

    return true;
  } catch (e) {
    console.error('Failed to import capsule JSON', e);
    return false;
  }
}

// RESET ALL TO DEFAULT
export function resetAllToDefault(): void {
  [
    FRIENDS_KEY,
    MEMORIES_KEY,
    VIDEOS_KEY,
    QUOTES_KEY,
    SNIPPETS_KEY,
    HERO_KEY,
    FINAL_KEY,
    GROUP_KEY,
    CHAPTERS_KEY
  ].forEach(removeItem);
}
