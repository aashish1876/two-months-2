// Generate src/data/memoriesData.ts from capsule-backup.paths.json
const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(
  path.join(__dirname, '..', 'capsule-backup.paths.json'),
  'utf-8'
));

function escape(value) {
  if (value === null || value === undefined) return 'undefined';
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(value);
}

function renderObject(obj, indent = '  ') {
  const keys = Object.keys(obj);
  if (keys.length === 0) return '{}';
  const lines = keys.map(k => `${indent}${JSON.stringify(k)}: ${escape(obj[k])}`);
  return `{\n${lines.join(',\n')}\n}`;
}

function renderArray(arr, itemRender, indent = '  ') {
  if (arr.length === 0) return '[]';
  return '[\n' + arr.map((item, i) => {
    const isLast = i === arr.length - 1;
    return `${indent}${itemRender(item, indent)}${isLast ? '' : ','}`;
  }).join('\n') + '\n]';
}

const friendRender = (f) => {
  // friend has nested connectedPhotos
  return `{\n      ${[
    `id: ${escape(f.id)}`,
    `name: ${escape(f.name)}`,
    `role: ${escape(f.role)}`,
    `portrait: ${escape(f.portrait)}`,
    `personality: ${escape(f.personality)}`,
    `quote: ${escape(f.quote)}`,
    `vibeTags: ${JSON.stringify(f.vibeTags || [])}`,
    `connectedPhotos: ${JSON.stringify(f.connectedPhotos || [])}`
  ].join(',\n      ')}\n    }`;
};

const memoryRender = (m) => {
  const fields = [
    `id: ${escape(m.id)}`,
    `title: ${escape(m.title)}`,
    `caption: ${escape(m.caption)}`,
  ];
  if (m.story !== undefined) fields.push(`story: ${escape(m.story)}`);
  fields.push(
    `date: ${escape(m.date)}`,
    `time: ${escape(m.time)}`,
    `location: ${escape(m.location)}`,
    `type: ${escape(m.type)}`,
    `imageUrl: ${escape(m.imageUrl)}`
  );
  if (m.videoUrl) fields.push(`videoUrl: ${escape(m.videoUrl)}`);
  if (m.duration) fields.push(`duration: ${escape(m.duration)}`);
  if (m.aspect) fields.push(`aspect: ${escape(m.aspect)}`);
  fields.push(
    `chapter: ${escape(m.chapter)}`,
    `people: ${JSON.stringify(m.people || [])}`
  );
  if (m.isHero) fields.push(`isHero: true`);
  if (m.isRandomFavorite) fields.push(`isRandomFavorite: true`);
  if (m.isVideo) fields.push(`isVideo: true`);
  if (m.rotation !== undefined) fields.push(`rotation: ${m.rotation}`);

  return `{\n      ${fields.join(',\n      ')}\n    }`;
};

const quoteRender = (q) => {
  return `{\n      ${[
    `id: ${escape(q.id)}`,
    `quote: ${escape(q.quote)}`,
    `author: ${escape(q.author)}`,
    `context: ${escape(q.context)}`,
    `timestamp: ${escape(q.timestamp)}`,
    `tag: ${escape(q.tag)}`
  ].join(',\n      ')}\n    }`;
};

const snippetRender = (s) => {
  const fields = [
    `id: ${escape(s.id)}`,
    `type: ${escape(s.type)}`,
    `title: ${escape(s.title)}`,
  ];
  if (s.subtitle) fields.push(`subtitle: ${escape(s.subtitle)}`);
  fields.push(
    `content: ${escape(s.content)}`,
    `date: ${escape(s.date)}`
  );
  if (s.imageUrl) fields.push(`imageUrl: ${escape(s.imageUrl)}`);
  if (s.metadata) fields.push(`metadata: ${escape(s.metadata)}`);
  return `{\n      ${fields.join(',\n      ')}\n    }`;
};

const chapters = data.chapters;
const chapterRender = (c) => `{\n      ${[
    `title: ${escape(c.title)}`,
    `subtitle: ${escape(c.subtitle)}`,
    `dateRange: ${escape(c.dateRange)}`,
    `desc: ${escape(c.desc)}`
  ].join(',\n      ')}\n    }`;

let chaptersObj = '{\n';
Object.keys(chapters).forEach((k, i, arr) => {
  const isLast = i === arr.length - 1;
  chaptersObj += `  ${JSON.stringify(k)}: ${chapterRender(chapters[k]).replace(/\n/g, '\n  ')}${isLast ? '' : ','}\n`;
});
chaptersObj += '}';

const out = `// AUTO-GENERATED FROM capsule-backup.paths.json ON ${new Date().toISOString()}
// Source-of-truth data shipped with the production build.
// DO NOT edit by hand — regenerate via scripts/generate-data.cjs.
import { Friend, Memory, RememberedQuote, RandomSnippet, ChapterId, HeroConfig, FinalSceneConfig, GroupConfig, ChapterInfo } from '../types';

export const INITIAL_FRIENDS: Friend[] = ${renderArray(data.friends, friendRender)};

export const INITIAL_MEMORIES: Memory[] = ${renderArray(data.memories, memoryRender)};

export const VIDEO_MEMORIES: Memory[] = ${renderArray(data.videos, memoryRender)};

export const REMEMBERED_QUOTES: RememberedQuote[] = ${renderArray(data.quotes, quoteRender)};

export const RANDOM_SNIPPETS: RandomSnippet[] = ${renderArray(data.snippets, snippetRender)};

export const CHAPTERS_INFO: Record<ChapterId, { title: string; subtitle: string; dateRange: string; desc: string }> = ${chaptersObj};

export const DEFAULT_HERO_CONFIG: HeroConfig = ${renderObject(data.hero, '  ')};

export const DEFAULT_GROUP_CONFIG: GroupConfig = ${renderObject(data.groupConfig, '  ')};

export const DEFAULT_FINAL_SCENE_CONFIG: FinalSceneConfig = ${renderObject(data.finalScene, '  ')};
`;

const outPath = path.join(__dirname, '..', 'src', 'data', 'memoriesData.ts');
fs.writeFileSync(outPath, out);
console.log('Wrote', outPath);
console.log('Lines:', out.split('\n').length);
