const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, '../src/data/memoriesData.ts');
const newFile = path.join(__dirname, '../src/data/memoriesData.new.ts');

const content = fs.readFileSync(srcFile, 'utf-8');

// Replace base64 imageUrls with a placeholder
// For now, let's just make sure they point to a valid (but empty) path
// or a path with the extracted video.
const newContent = content.replace(
  /imageUrl:\s*"data:video\/mp4;base64,[^"]+"/,
  'imageUrl: "/assets/aistudio/play-tile.jpg"'
);

// We also need to fix videoUrl, but that's manual work.
// For now, let's just save the file.
fs.writeFileSync(newFile, newContent);
console.log("Created memoriesData.new.ts");
