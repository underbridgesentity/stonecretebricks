/**
 * Rebuilds favicon.ico, apple-icon.png and the Open Graph image from the mark.
 *
 *   pnpm brand:icons
 *
 * The favicon is a THIRD CUT of the mark, not a scaled copy: at 16px the two
 * courses do not resolve into anything readable, so it is a single brick, one
 * top face plus its side face. See docs/brand.md.
 */

import { mkdir, writeFile } from "node:fs/promises";

import pngToIco from "png-to-ico";
import sharp from "sharp";

const OXIDE = "#D35A2A";
const GRAPHITE = "#1A1A1A";
const LIMESTONE = "#F2EFEA";

const { brick, iso, VIEW_W, VIEW_H } = await import("../../src/lib/iso.ts");

/** The full two-course mark. */
function markSvg({ background = "none" } = {}) {
  const lower = brick(0, 0, 0);
  const upper = brick(0, 1, 1);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW_W} ${VIEW_H}">
  ${background === "none" ? "" : `<rect width="${VIEW_W}" height="${VIEW_H}" fill="${background}"/>`}
  <polygon points="${lower.side}" fill="${GRAPHITE}"/>
  <polygon points="${lower.end}" fill="${OXIDE}"/>
  <polygon points="${lower.top}" fill="${OXIDE}"/>
  <polygon points="${upper.side}" fill="${GRAPHITE}"/>
  <polygon points="${upper.top}" fill="${OXIDE}"/>
</svg>`;
}

/**
 * The small cut: one brick on a limestone tile, padded so it reads at 16px.
 * A single 3 x 1 x 1 volume spans a in [0,3], d in [0,1], c in [0,1].
 */
function iconSvg(size) {
  const one = brick(0, 0, 0);
  const [, topY] = iso(0, 1, 1);
  const [, bottomY] = iso(3, 0, 0);
  const w = 4 * (VIEW_W / 5);
  const h = bottomY - topY;
  const pad = w * 0.14;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${-pad} ${topY - pad} ${w + pad * 2} ${h + pad * 2}">
  <rect x="${-pad}" y="${topY - pad}" width="${w + pad * 2}" height="${h + pad * 2}" fill="${LIMESTONE}"/>
  <polygon points="${one.side}" fill="${GRAPHITE}"/>
  <polygon points="${one.end}" fill="${OXIDE}"/>
  <polygon points="${one.top}" fill="${OXIDE}"/>
</svg>`;
}

/** Open Graph card: mark, wordmark and the standards line, on graphite. */
function ogSvg() {
  const lower = brick(0, 0, 0);
  const upper = brick(0, 1, 1);
  const scale = 300 / VIEW_H;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${GRAPHITE}"/>
  <g transform="translate(880 120) scale(${scale})">
    <polygon points="${lower.side}" fill="${LIMESTONE}" opacity="0.55"/>
    <polygon points="${lower.end}" fill="${OXIDE}"/>
    <polygon points="${lower.top}" fill="${OXIDE}"/>
    <polygon points="${upper.side}" fill="${LIMESTONE}" opacity="0.55"/>
    <polygon points="${upper.top}" fill="${OXIDE}"/>
  </g>
  <text x="90" y="300" font-family="Montserrat, Arial, sans-serif" font-size="96" font-weight="800" letter-spacing="-3" fill="${LIMESTONE}">STRENGTH IN</text>
  <text x="90" y="392" font-family="Montserrat, Arial, sans-serif" font-size="96" font-weight="800" letter-spacing="-3" fill="${LIMESTONE}">EVERY BRICK</text>
  <rect x="90" y="440" width="72" height="4" fill="${OXIDE}"/>
  <text x="90" y="500" font-family="Montserrat, Arial, sans-serif" font-size="30" font-weight="400" fill="${LIMESTONE}" opacity="0.72">Stonecrete Bricks. Concrete bricks, blocks and pavers.</text>
  <text x="90" y="544" font-family="Montserrat, Arial, sans-serif" font-size="24" font-weight="400" letter-spacing="4" fill="${OXIDE}">SANS 1215 . SANS 1058</text>
  ${bondBars(90, 580, 1020)}
</svg>`;
}

function bondBars(x, y, width) {
  const widths = [70, 120, 46, 96, 140, 70, 120];
  let cursor = x;
  const bars = [];
  for (const w of widths) {
    if (cursor + w > x + width) break;
    bars.push(`<rect x="${cursor}" y="${y}" width="${w}" height="12" fill="${OXIDE}"/>`);
    cursor += w + 10;
  }
  return bars.join("\n  ");
}

const buf = (svg) => Buffer.from(svg);

await mkdir("brand", { recursive: true });
await writeFile("src/app/icon.svg", markSvg());
await writeFile("brand/monogram.svg", markSvg());

const icoSizes = [16, 32, 48];
const icoBuffers = await Promise.all(
  icoSizes.map((size) => sharp(buf(iconSvg(size)), { density: 384 }).resize(size, size).png().toBuffer()),
);
await writeFile("src/app/favicon.ico", await pngToIco(icoBuffers));

await sharp(buf(iconSvg(180)), { density: 384 }).resize(180, 180).png().toFile("src/app/apple-icon.png");
await sharp(buf(ogSvg()), { density: 144 }).png().toFile("src/app/opengraph-image.png");

console.log("Wrote icon.svg, favicon.ico, apple-icon.png, opengraph-image.png, brand/monogram.svg");
