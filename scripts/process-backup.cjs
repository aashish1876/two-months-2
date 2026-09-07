// Extract base64 images from the backup and rewrite the JSON with file paths.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.resolve(__dirname, '..');
const srcPath = path.join(root, 'capsule-backup.json');
const assetsDir = path.join(root, 'public', 'assets', 'aistudio');
const outPath = path.join(root, 'capsule-backup.paths.json');

if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

const data = JSON.parse(fs.readFileSync(srcPath, 'utf-8'));

const usedNames = new Set();
function uniqueName(base) {
  let name = base;
  let i = 2;
  while (usedNames.has(name)) {
    name = base.replace(/(\.[^.]+)?$/, `-${i}$&`);
    i++;
  }
  usedNames.add(name);
  return name;
}

function getExt(mime) {
  if (!mime) return 'jpg';
  if (mime.includes('jpeg')) return 'jpg';
  if (mime.includes('png')) return 'png';
  if (mime.includes('webp')) return 'webp';
  if (mime.includes('gif')) return 'gif';
  return 'jpg';
}

const hashToFile = new Map(); // dedupe identical base64 payloads

function saveDataUrl(dataUrl, labelBase) {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) return dataUrl;
  const m = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!m) return dataUrl;
  const mime = m[1];
  const b64 = m[2];
  const buf = Buffer.from(b64, 'base64');
  const hash = crypto.createHash('sha1').update(buf).digest('hex').slice(0, 12);
  if (hashToFile.has(hash)) {
    return `./assets/aistudio/${hashToFile.get(hash)}`;
  }
  const ext = getExt(mime);
  const baseName = uniqueName(`${labelBase}-${hash}.${ext}`);
  fs.writeFileSync(path.join(assetsDir, baseName), buf);
  hashToFile.set(hash, baseName);
  return `./assets/aistudio/${baseName}`;
}

// Process friends
data.friends?.forEach(f => {
  f.portrait = saveDataUrl(f.portrait, 'friend');
  f.connectedPhotos = (f.connectedPhotos || []).map(p => saveDataUrl(p, 'friend'));
});

// Process memories
data.memories?.forEach(m => {
  m.imageUrl = saveDataUrl(m.imageUrl, `mem-${m.id}`);
});

// Process videos
data.videos?.forEach(v => {
  v.imageUrl = saveDataUrl(v.imageUrl, `vid-${v.id}`);
});

// Process snippets
data.snippets?.forEach(s => {
  s.imageUrl = saveDataUrl(s.imageUrl, `snippet-${s.id}`);
});

// Process hero, final scene, group config
['hero', 'finalScene', 'groupConfig'].forEach(key => {
  if (!data[key]) return;
  Object.keys(data[key]).forEach(k => {
    if (typeof data[key][k] === 'string' && data[key][k].startsWith('data:')) {
      data[key][k] = saveDataUrl(data[key][k], `${key}-${k}`);
    }
  });
});

fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
console.log('Wrote', outPath);
console.log('Files saved:', usedNames.size);
