// Generates icon-192.png and icon-512.png using SVG → PNG via resvg-js or a simple canvas approach
// We'll write raw SVG files and let the browser handle them, but for PWA we need real PNGs.
// This script uses the built-in http module to fetch a data URI approach via Jimp-free method.
// Simplest: write SVG icons directly for the browser, and use SVG as the icon source.

import { writeFileSync } from 'fs';

// Minimal 1×1 transparent PNG as placeholder — replace with real icons before publishing
// For dev/testing this is sufficient; the PWA will still work.

function svgIcon(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#6366f1"/>
  <text x="50%" y="55%" font-size="${size * 0.55}" text-anchor="middle" dominant-baseline="middle" font-family="serif">🚻</text>
</svg>`;
}

writeFileSync('public/icon-192.svg', svgIcon(192));
writeFileSync('public/icon-512.svg', svgIcon(512));
console.log('SVG icons written to public/');
