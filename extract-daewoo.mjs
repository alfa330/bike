import { execFileSync } from 'child_process';
import ffmpegPath from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';

const inputVideo = path.join('public', 'Daewoo Nexia II.mp4');
const outputDir = path.join('public', 'daewoo-frames');

if (!fs.existsSync(inputVideo)) {
  console.error(`Video not found: ${inputVideo}`);
  process.exit(1);
}

if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}
fs.mkdirSync(outputDir, { recursive: true });

console.log('Extracting frames from Daewoo Nexia II video with motion interpolation...');
try {
  execFileSync(ffmpegPath, [
    '-i', inputVideo,
    '-vf', 'minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1',
    '-c:v', 'libwebp',
    '-q:v', '90',
    path.join(outputDir, 'frame-%04d.webp')
  ], { stdio: 'inherit' });

  const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.webp'));
  console.log(`Extraction complete. ${files.length} frames generated.`);
} catch (error) {
  console.error('Error extracting frames:', error);
}
