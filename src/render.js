import sharp from "sharp";

const escapeXml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

function wrapText(text, maxChars) {
  const source = String(text ?? "").trim();
  if (!source) return ["—"];
  const lines = [];
  for (let index = 0; index < source.length; index += maxChars) {
    lines.push(source.slice(index, index + maxChars));
  }
  return lines;
}

function textLines(lines, x, y, options = {}) {
  const { size = 28, lineHeight = 44, color = "#F7F9FB", weight = 400 } = options;
  return lines.map((line, index) =>
    `<text x="${x}" y="${y + index * lineHeight}" fill="${color}" font-size="${size}" font-weight="${weight}" font-family="Noto Sans CJK SC, Noto Sans SC, Microsoft YaHei, Arial, sans-serif">${escapeXml(line)}</text>`
  ).join("\n");
}

export function createSummarySvg(data) {
  const goalLines = wrapText(data.goal, 27).slice(0, 2);
  const summaryLines = wrapText(data.summary, 27).slice(0, 4);
  const nextLines = wrapText(data.nextPlan, 27).slice(0, 2);
  const exercises = (data.exercises ?? []).slice(0, 6);

  const exerciseRows = exercises.map((item, index) => {
    const y = 625 + index * 72;
    return `
      <text x="92" y="${y}" class="body">${escapeXml(item.name)}</text>
      <text x="610" y="${y}" class="metric">${escapeXml(item.sets)} 组</text>
      <text x="745" y="${y}" class="metric">${escapeXml(item.reps)}</text>
      <text x="910" y="${y}" text-anchor="end" class="metric accent">${escapeXml(item.weight)}</text>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1440" viewBox="0 0 1080 1440">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0B1518"/>
        <stop offset="1" stop-color="#13272A"/>
      </linearGradient>
      <style>
        .label { font: 700 24px 'Noto Sans CJK SC', 'Noto Sans SC', 'Microsoft YaHei', Arial, sans-serif; fill: #8FE388; letter-spacing: 2px; }
        .body { font: 500 28px 'Noto Sans CJK SC', 'Noto Sans SC', 'Microsoft YaHei', Arial, sans-serif; fill: #F7F9FB; }
        .metric { font: 500 25px 'Noto Sans CJK SC', 'Noto Sans SC', 'Microsoft YaHei', Arial, sans-serif; fill: #B6C2C6; }
        .accent { fill: #8FE388; }
      </style>
    </defs>

    <rect width="1080" height="1440" fill="url(#bg)"/>
    <circle cx="960" cy="80" r="180" fill="#8FE388" opacity="0.08"/>
    <circle cx="80" cy="1390" r="230" fill="#55C8B4" opacity="0.06"/>

    <text x="76" y="86" class="label">TRAINING REPORT</text>
    <text x="76" y="174" font-size="62" font-weight="800" font-family="Noto Sans CJK SC, Noto Sans SC, Microsoft YaHei, Arial, sans-serif" fill="#FFFFFF">${escapeXml(data.studentName)}</text>
    <text x="76" y="224" font-size="27" font-family="Noto Sans CJK SC, Noto Sans SC, Microsoft YaHei, Arial, sans-serif" fill="#9DAEB3">${escapeXml(data.courseDate)}  ·  ${escapeXml(data.courseNumber)}</text>

    <rect x="64" y="275" width="952" height="190" rx="30" fill="#192B2F"/>
    <text x="92" y="330" class="label">本节目标</text>
    ${textLines(goalLines, 92, 388, { size: 31, lineHeight: 45 })}

    <rect x="64" y="493" width="952" height="490" rx="30" fill="#192B2F"/>
    <text x="92" y="548" class="label">训练内容</text>
    ${exerciseRows}

    <rect x="64" y="1011" width="952" height="240" rx="30" fill="#192B2F"/>
    <text x="92" y="1066" class="label">教练总结</text>
    ${textLines(summaryLines, 92, 1121, { size: 27, lineHeight: 40 })}

    <text x="76" y="1312" class="label">下节计划</text>
    ${textLines(nextLines, 76, 1360, { size: 25, lineHeight: 36, color: "#D6E0E3" })}
    <text x="1004" y="1384" text-anchor="end" font-size="22" font-family="Noto Sans CJK SC, Noto Sans SC, Microsoft YaHei, Arial, sans-serif" fill="#71858A">${escapeXml(data.coachName)}</text>
  </svg>`;
}

export async function renderSummaryPng(data, outputPath) {
  const svg = createSummarySvg(data);
  await sharp(Buffer.from(svg)).png().toFile(outputPath);
  return outputPath;
}

export async function renderSummaryBuffer(data) {
  const svg = createSummarySvg(data);
  return sharp(Buffer.from(svg)).png().toBuffer();
}
