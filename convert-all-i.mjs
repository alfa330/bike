import { execFileSync } from 'child_process';
import ffmpegPath from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputVideo = path.join(__dirname, 'public', 'bike-rotation.mp4');
const outputDir = path.join(__dirname, 'public', 'frames');

if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}
fs.mkdirSync(outputDir, { recursive: true });

console.log('Extracting frames at 1440p for optimal Canvas performance...');
try {
  execFileSync(ffmpegPath, [
    '-i', inputVideo,
    '-vf', 'fps=60,scale=-1:1440', // Downscale to 1440p to prevent VRAM exhaustion
    '-c:v', 'libwebp',
    '-q:v', '85', 
    path.join(outputDir, 'frame-%04d.webp')
  ], { stdio: 'inherit' });
  console.log('Extraction complete.');
} catch (error) {
  console.error('Error during extraction:', error);
}
