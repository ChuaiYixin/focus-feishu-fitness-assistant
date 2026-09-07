import { mkdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderSummaryPng } from "./render.js";

const currentDir = dirname(fileURLToPath(import.meta.url));
const projectDir = resolve(currentDir, "..");
const data = JSON.parse(await readFile(resolve(projectDir, "data/demo.json"), "utf8"));
const outputDir = resolve(projectDir, "output");
const outputPath = resolve(outputDir, "demo-summary.png");

await mkdir(outputDir, { recursive: true });
await renderSummaryPng(data, outputPath);
console.log(`Demo image generated: ${outputPath}`);
