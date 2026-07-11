import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pngToIco from 'png-to-ico';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = join(__dirname, '..', 'public');

async function convertSvgToPng(svgPath, pngPath, size) {
  try {
    const svgBuffer = readFileSync(svgPath);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(pngPath);
    console.log(`✓ Converted ${svgPath} to ${pngPath} (${size}x${size})`);
  } catch (error) {
    console.error(`✗ Error converting ${svgPath}:`, error.message);
  }
}

async function convertSvgToPngBuffer(svgPath, size) {
  try {
    const svgBuffer = readFileSync(svgPath);
    return await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toBuffer();
  } catch (error) {
    console.error(`✗ Error converting ${svgPath} to buffer:`, error.message);
    return null;
  }
}

async function generateFaviconIco() {
  try {
    console.log('Generating favicon.ico with multiple sizes...');
    
    const sizes = [16, 32, 48, 64];
    const pngBuffers = [];
    
    for (const size of sizes) {
      const buffer = await convertSvgToPngBuffer(
        join(publicDir, 'favicon.svg'),
        size
      );
      if (buffer) {
        pngBuffers.push(buffer);
        console.log(`✓ Generated ${size}x${size} PNG for favicon`);
      }
    }
    
    if (pngBuffers.length > 0) {
      const icoBuffer = await pngToIco(pngBuffers);
      writeFileSync(join(publicDir, 'favicon.ico'), icoBuffer);
      console.log('✓ Created favicon.ico with multiple sizes');
    }
  } catch (error) {
    console.error('✗ Error generating favicon.ico:', error.message);
  }
}

async function main() {
  console.log('Converting SVG logos to PNG format...');
  
  await Promise.all([
    convertSvgToPng(
      join(publicDir, 'logo192.svg'),
      join(publicDir, 'logo192.png'),
      192
    ),
    convertSvgToPng(
      join(publicDir, 'logo512.svg'),
      join(publicDir, 'logo512.png'),
      512
    ),
    convertSvgToPng(
      join(publicDir, 'logo192.svg'),
      join(publicDir, 'apple-touch-icon.png'),
      192
    ),
  ]);
  
  await generateFaviconIco();
  
  console.log('Logo conversion complete!');
}

main().catch(console.error);
