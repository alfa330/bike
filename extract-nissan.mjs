import ffmpegPath from 'ffmpeg-static';
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputVideo = path.join(__dirname, 'public', 'Nissan_Silvi_Transition_A_sleek_white_sports_car.mp4');
const outputDir = path.join(__dirname, 'public', 'nissan-frames');

if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}
fs.mkdirSync(outputDir, { recursive: true });

console.log('Extracting frames from Nissan Silvi Transition video...');
try {
  execFileSync(ffmpegPath, [
    '-i', inputVideo,
    '-vf', 'minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,scale=1920:1080',
    '-c:v', 'libwebp',
    '-q:v', '90',
    path.join(outputDir, 'frame-%04d.webp')
  ], { stdio: 'inherit' });

  const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.webp'));
  console.log(`Extraction complete. ${files.length} frames generated.`);
} catch (error) {
  console.error('Error extracting frames:', error);
}
