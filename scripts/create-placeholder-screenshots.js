import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const screenshotsDir = join(__dirname, '..', 'public', 'screenshots');

async function createPlaceholderScreenshot(width, height, filename, label) {
  try {
    // Create a simple gradient background with text
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg)"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#3b82f6" text-anchor="middle" dominant-baseline="middle">
          ${label}
        </text>
        <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="16" fill="#94a3b8" text-anchor="middle" dominant-baseline="middle">
          ${width}x${height} - Replace with actual screenshot
        </text>
      </svg>
    `;
    
    await sharp(Buffer.from(svg))
      .png()
      .toFile(join(screenshotsDir, filename));
    
    console.log(`✓ Created placeholder: ${filename} (${width}x${height})`);
  } catch (error) {
    console.error(`✗ Error creating ${filename}:`, error.message);
  }
}

async function main() {
  console.log('Creating placeholder PWA screenshots...');
  
  await Promise.all([
    createPlaceholderScreenshot(1280, 800, 'desktop-wide.png', 'Portfolio - Desktop View'),
    createPlaceholderScreenshot(390, 844, 'mobile-narrow.png', 'Portfolio - Mobile View'),
  ]);
  
  console.log('Placeholder screenshots created!');
  console.log('NOTE: Replace these with actual screenshots of your application.');
}

main().catch(console.error);
