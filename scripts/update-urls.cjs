const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, '../src/data/memoriesData.ts');

let content = fs.readFileSync(srcFile, 'utf-8');

// For extract entries (those that now have imageUrl /assets/aistudio/play-tile.jpg),
// update the videoUrl to point to their local .mp4 extracted in step 1.
// Map of ID to expected extracted filename.
const videoMap = {
  'mem-4': 'mem-4.mp4', 'mem-5': 'mem-5.mp4', 'mem-6': 'mem-6.mp4',
  'mem-7': 'mem-7.mp4', 'mem-8': 'mem-8.mp4', 'mem-9': 'mem-9.mp4',
  'mem-10': 'mem-10.mp4', 'mem-11': 'mem-11.mp4', 'mem-13': 'mem-13.mp4',
  'mem-14': 'mem-14.mp4', 'mem-15': 'mem-15.mp4',
  'vid-1': 'vid-1.mp4', 'vid-2': 'vid-2.mp4', 'vid-3': 'vid-3.mp4'
};

for (const [id, filename] of Object.entries(videoMap)) {
  // Find the block for this ID, e.g. id: "mem-4" ... imageUrl ...
  // and insert/update videoUrl
  const idRegex = new RegExp(`id:\\s*"${id}"[\\s\\S]*?type:\\s*"([^"]+)"`, 'g');
  const match = idRegex.exec(content);
  if (match) {
    const type = match[1];
    if (type === 'video') {
       // update existing videoUrl
       content = content.replace(new RegExp(`(id:\\s*"${id}"[\\s\\S]*?videoUrl:\\s*")([^"]+)(")`),
         `$1./assets/aistudio/videos/${filename}$3`);
    } else {
       // add videoUrl to a photo/candid type entry if it's meant to be a video
       content = content.replace(new RegExp(`(id:\\s*"${id}"[\\s\\S]*?imageUrl:\\s*"[^"]+")`),
         `$1,\n      videoUrl: "./assets/aistudio/videos/${filename}",\n      isVideo: true`);
    }
  }
}

fs.writeFileSync(srcFile, content);
console.log("Updated videoUrl paths in memoriesData.ts");
