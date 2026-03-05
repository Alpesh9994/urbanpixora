/**
 * WebP Conversion Script
 * Converts all PNG images in public/ (sequence frames + who-we-are.png) to WebP.
 *
 * Run once: node scripts/convert-to-webp.mjs
 *
 * Requires: npm install --save-dev sharp
 */

import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PUBLIC_DIR = join(__dirname, '..', 'public');

const WEBP_QUALITY = 80;

async function convertDir(dir) {
    const entries = await readdir(dir);
    let totalSaved = 0;
    let count = 0;

    for (const entry of entries) {
        const fullPath = join(dir, entry);
        const info = await stat(fullPath);

        if (info.isDirectory()) {
            const { saved, files } = await convertDir(fullPath);
            totalSaved += saved;
            count += files;
            continue;
        }

        if (extname(entry).toLowerCase() !== '.png') continue;

        const outPath = join(dir, basename(entry, '.png') + '.webp');
        const originalSize = info.size;

        await sharp(fullPath)
            .webp({ quality: WEBP_QUALITY })
            .toFile(outPath);

        const newSize = (await stat(outPath)).size;
        const saved = originalSize - newSize;
        totalSaved += saved;
        count++;

        const pct = ((saved / originalSize) * 100).toFixed(1);
        console.log(`✓  ${entry.padEnd(20)} → ${basename(outPath).padEnd(22)} saved ${(saved / 1024).toFixed(0)} KB (${pct}%)`);
    }

    return { saved: totalSaved, files: count };
}

console.log('Converting PNGs to WebP …\n');
const { saved, files } = await convertDir(PUBLIC_DIR);
console.log(`\nDone! Converted ${files} files. Total savings: ${(saved / 1024 / 1024).toFixed(2)} MB`);
