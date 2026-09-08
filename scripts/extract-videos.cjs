const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, '../src/data/memoriesData.ts');
const targetDir = path.join(__dirname, '../public/assets/aistudio/videos');

if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

async function extract() {
  const content = fs.readFileSync(srcFile, 'utf-8');

  // Using a regex to find memory objects and their base64 imageUrls
  // This is a bit fragile but since we control the source, it's efficient.
  const regex = /\{\s*[\s\S]*?id:\s*"([^"]+)"[\s\S]*?imageUrl:\s*"data:video\/mp4;base64,([^"]+)"[\s\S]*?\}/g;

  let match;
  const idsToProcess = [];

  // First pass: collect metadata
  while ((match = regex.exec(content)) !== null) {
    const id = match[1];
    const base64 = match[2];
    idsToProcess.push({ id, base64 });
  }

  console.log(`Found ${idsToProcess.length} embedded videos.`);

  for (const { id, base64 } of idsToProcess) {
    const buffer = Buffer.from(base64, 'base64');
    const filename = `${id}.mp4`;
    fs.writeFileSync(path.join(targetDir, filename), buffer);
    console.log(`Extracted: ${filename} (${buffer.length} bytes)`);
  }
}

extract().catch(console.error);
