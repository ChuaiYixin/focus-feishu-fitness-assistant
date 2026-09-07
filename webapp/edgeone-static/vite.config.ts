import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({ publicDir:"../public", plugins:[react()], resolve:{dedupe:["react","react-dom"],alias:{"@musclemap/assets":"E:/cursor/FOCUS/feishu-fitness-demo/webapp/edgeone-static/node_modules/@musclemap/assets/dist/index.js"}}, build:{ outDir:"dist" } });
