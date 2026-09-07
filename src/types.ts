export type ChapterId = 
  | 'THE BEGINNING' 
  | 'THEN THIS HAPPENED...' 
  | 'THE CHAOS' 
  | 'THE LITTLE MOMENTS' 
  | 'THE LAST DAYS';

export interface Friend {
  id: string;
  name: string;
  role: string;
  portrait: string;
  personality: string;
  quote: string;
  connectedPhotos: string[];
  vibeTags: string[];
}

export interface Memory {
  id: string;
  title: string;
  caption: string;
  story?: string;
  date: string;
  time: string;
  location: string;
  type: 'photo' | 'video' | 'candid' | 'screenshot' | 'polaroid';
  imageUrl: string;
  videoUrl?: string;
  duration?: string;
  aspect?: 'portrait' | 'landscape' | 'square' | 'ultrawide';
  chapter: ChapterId;
  people: string[];
  isHero?: boolean;
  isRandomFavorite?: boolean;
  isVideo?: boolean;
  rotation?: number; // for scrapbook feel
}

export interface RememberedQuote {
  id: string;
  quote: string;
  author: string;
  context: string;
  timestamp: string;
  tag: string;
}

export interface RandomSnippet {
  id: string;
  type: 'chat' | 'receipt' | 'polaroid' | 'voice-note';
  title: string;
  subtitle?: string;
  content: string;
  date: string;
  imageUrl?: string;
  metadata?: string;
}

export interface HeroConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  bgImageUrl: string;
  statBadge: string;
}

export interface FinalSceneConfig {
  eyebrow: string;
  headline: string;
  bigQuote: string;
  noteLine1: string;
  noteLine2: string;
  closingSignoff: string;
  bgImageUrl: string;
}

export interface ChapterInfo {
  title: string;
  subtitle: string;
  dateRange: string;
  desc: string;
}

export interface GroupConfig {
  groupPhotoUrl: string;
  quote: string;
  caption: string;
  mileMarker: string;
  headline?: string;
  subheadline?: string;
  description?: string;
  groupPhotoCaption?: string;
  statText?: string;
}

export interface CapsuleAllData {
  version: number;
  exportedAt: string;
  hero: HeroConfig;
  friends: Friend[];
  groupConfig: GroupConfig;
  memories: Memory[];
  videos: Memory[];
  quotes: RememberedQuote[];
  snippets: RandomSnippet[];
  finalScene: FinalSceneConfig;
  chapters: Record<ChapterId, ChapterInfo>;
}
