import React, { useState } from "react";
import { PlanetData, SOLAR_SYSTEM_DATA } from "../types";
import { 
  Play, 
  Pause, 
  Eye, 
  EyeOff, 
  Globe, 
  Coins, 
  Layers, 
  Sliders, 
  FileCode, 
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  Info,
  Calendar,
  Compass,
  Database,
  ArrowRight
} from "lucide-react";

interface DashboardProps {
  speedMultiplier: number;
  setSpeedMultiplier: (val: number) => void;
  showOrbits: boolean;
  setShowOrbits: (val: boolean) => void;
  showMoons: boolean;
  setShowMoons: (val: boolean) => void;
  labelMode: "both" | "cn" | "en" | "none";
  setLabelMode: (val: "both" | "cn" | "en" | "none") => void;
  showAsteroids: boolean;
  setShowAsteroids: (val: boolean) => void;
  showKuiper: boolean;
  setShowKuiper: (val: boolean) => void;
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  selectedPlanetId: string | null;
  setSelectedPlanetId: (val: string | null) => void;
  svgElementId: string;
}

// Special extra celestial bodies (Sun & Pluto) info
const SUN_INFO = {
  id: "sun",
  nameCN: "太阳",
  nameEN: "Sun",
  color: "#eab308",
  baseColor: "#eab308",
  distanceText: "0.00 AU",
  mass: "333,000 Earths",
  periodTextCN: "自转期 ~25 日",
  periodTextEN: "Rotation ~25 Days",
  descriptionCN: "太阳系的中心恒星，占太阳系总质量的 99.86%，提供支撑所有生命的辐射能量与引力联系。",
  descriptionEN: "The central yellow-dwarf star of our solar system, comprising 99.86% of its entire mass, providing life-sustaining radiation, light, and heat."
};

const PLUTO_INFO = {
  id: "pluto",
  nameCN: "冥王星",
  nameEN: "Pluto",
  color: "#94a3b8",
  baseColor: "#94a3b8",
  distanceText: "39.48 AU",
  mass: "0.002 Earths",
  periodTextCN: "248.0 地球年",
  periodTextEN: "248.0 Earth Years",
  descriptionCN: "柯伊伯带中最著名的冰质矮行星，拥有极具椭圆并高度倾斜的轨道（与黄道面相交约 17°）。",
  descriptionEN: "The most famous dwarf planet in the icy Kuiper Belt, sporting a highly eccentric and tilted orbit (inclined ~17° relative to the ecliptic)."
};

export default function Dashboard({
  speedMultiplier,
  setSpeedMultiplier,
  showOrbits,
  setShowOrbits,
  showMoons,
  setShowMoons,
  labelMode,
  setLabelMode,
  showAsteroids,
  setShowAsteroids,
  showKuiper,
  setShowKuiper,
  isPlaying,
  setIsPlaying,
  selectedPlanetId,
  setSelectedPlanetId,
  svgElementId,
}: DashboardProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "export">("info");

  const selectedBody = (() => {
    if (selectedPlanetId === "sun") return SUN_INFO;
    if (selectedPlanetId === "pluto") return PLUTO_INFO;
    return SOLAR_SYSTEM_DATA.find((p) => p.id === selectedPlanetId) || SOLAR_SYSTEM_DATA[2]; // Default to Earth
  })();

  // Retrieve all major moons for description
  const hasMoonsList = "moons" in selectedBody ? (selectedBody.moons as any[]) : [];

  // GenerateStandAloneSVG handles clean SMIL markup matching user configuration
  const generateStandaloneSVG = () => {
    const playState = isPlaying;
    
    // Create actual planet definitions
    const planetsString = SOLAR_SYSTEM_DATA.map((planet) => {
      const isSaturn = planet.id === "saturn";
      const isUranus = planet.id === "uranus";
      const ringsMarkup = planet.hasRings && planet.ringsRadius
        ? `<g transform="rotate(${planet.ringsTilt || 15})">
              <ellipse cx="0" cy="0" rx="${planet.ringsRadius + (isSaturn ? 5 : 0)}" ry="${planet.ringsRadius / 2.5}" fill="none" stroke="${planet.ringsColor}" stroke-width="${isSaturn ? 5 : 1.5}" opacity="0.8" />
           </g>`
        : "";

      const moonsMarkup = showMoons && planet.moons.map((m) => {
        return `
            <!-- ${m.nameCN} (${m.nameEN}) Orbit & Body -->
            <circle cx="0" cy="0" r="${m.orbitRadius}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="0.5" stroke-dasharray="1.5, 1.5" />
            <g>
              ${playState ? `<animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="${m.speed}" repeatCount="indefinite" />` : ""}
              <circle cx="${m.orbitRadius}" cy="0" r="${m.size}" fill="${m.color}" />
            </g>`;
      }).join("") || "";

      const textMarkup = labelMode !== "none" ? `
            <!-- Bilingual Label -->
            <g transform="translate(0, ${planet.size + (planet.id === "jupiter" ? 18 : 13)})">
              <rect x="-42" y="-9" width="84" height="${labelMode === "both" ? 21 : 13}" rx="3" fill="rgba(3, 1, 15, 0.7)" />
              ${labelMode === "both" ? `
                <text text-anchor="middle" font-size="8.5" font-family="sans-serif" fill="#ffffff" y="0">${planet.nameCN}</text>
                <text text-anchor="middle" font-size="6.5" font-family="sans-serif" fill="#94a3b8" y="8">${planet.nameEN}</text>
              ` : ""}
              ${labelMode === "cn" ? `<text text-anchor="middle" font-size="9" font-family="sans-serif" fill="#e2e8f0" y="1">${planet.nameCN}</text>` : ""}
              ${labelMode === "en" ? `<text text-anchor="middle" font-size="8" font-family="sans-serif" fill="#e2e8f0" y="1">${planet.nameEN}</text>` : ""}
            </g>
      ` : "";

      return `
        <!-- ==================== ${planet.nameEN.toUpperCase()} (${planet.nameCN}) ==================== -->
        <g>
          <g>
            ${playState ? `<animateMotion path="M ${960 - planet.orbitRx},540 a ${planet.orbitRx},${planet.orbitRy} 0 1,1 ${planet.orbitRx * 2},0 a ${planet.orbitRx},${planet.orbitRy} 0 1,1 ${-planet.orbitRx * 2},0" dur="${planet.orbitSpeed / speedMultiplier}s" repeatCount="indefinite" rotate="0" />` : ` <g transform="translate(${960 - planet.orbitRx}, 540)"/>`}
            
            ${ringsMarkup}
            <circle cx="0" cy="0" r="${planet.size}" fill="${planet.color}" />
            ${planet.id === "jupiter" ? `<ellipse cx="${planet.size / 3}" cy="${planet.size / 3}" rx="3.5" ry="2.0" fill="#991b1b" opacity="0.8" />` : ""}
            ${moonsMarkup}
            ${textMarkup}
          </g>
        </g>
      `;
    }).join("");

    // Create pluto
    const plutoMarkup = `
        <!-- ==================== PLUTO ==================== -->
        <g>
          <g>
            ${playState ? `<animateMotion path="M ${960 - 870},540 a 870,710 0 1,1 1740,0 a 870,710 0 1,1 -1740,0" dur="${230 / speedMultiplier}s" repeatCount="indefinite" rotate="0" />` : ""}
            <circle cx="0" cy="0" r="3.2" fill="#cbd5e1" />
            ${labelMode !== "none" ? `
            <g transform="translate(0, 11)">
              <rect x="-35" y="-9" width="70" height="${labelMode === "both" ? 21 : 13}" rx="3" fill="rgba(3, 1, 15, 0.72)" />
              ${labelMode === "both" ? `
                <text text-anchor="middle" font-size="8.5" font-family="sans-serif" fill="#cbd5e1" y="0">冥王星</text>
                <text text-anchor="middle" font-size="6.5" font-family="sans-serif" fill="#64748b" y="8">Pluto</text>
              ` : ""}
              ${labelMode === "cn" ? `<text text-anchor="middle" font-size="9" font-family="sans-serif" fill="#cbd5e1" y="1">冥王星</text>` : ""}
              ${labelMode === "en" ? `<text text-anchor="middle" font-size="8" font-family="sans-serif" fill="#cbd5e1" y="1">Pluto</text>` : ""}
            </g>
            ` : ""}
          </g>
        </g>
    `;

    // Static lines
    const staticOrbits = SOLAR_SYSTEM_DATA.map((planet) => {
      return showOrbits ? `<ellipse cx="960" cy="540" rx="${planet.orbitRx}" ry="${planet.orbitRy}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.2" />` : "";
    }).join("") + (showOrbits ? `<ellipse cx="960" cy="555" rx="870" ry="710" fill="none" stroke="rgba(148, 163, 184, 0.05)" stroke-width="1.2" stroke-dasharray="4,4" transform="rotate(-15 960 540)" />` : "");

    // Asteroids
    const asteroidsMarkup = showAsteroids ? `
        <!-- Asteroid Belt -->
        <g>
          <g>
            ${playState ? `<animateTransform attributeName="transform" type="rotate" from="0 960 540" to="360 960 540" dur="${180 / speedMultiplier}s" repeatCount="indefinite" />` : ""}
            <ellipse cx="960" cy="540" rx="365" ry="325" fill="none" stroke="#52525b" stroke-width="10" stroke-dasharray="2 18 1 12 3 22 1 15 2 28 4 10" opacity="0.5" />
          </g>
          <g>
            ${playState ? `<animateTransform attributeName="transform" type="rotate" from="45 960 540" to="405 960 540" dur="${220 / speedMultiplier}s" repeatCount="indefinite" />` : ""}
            <ellipse cx="960" cy="540" rx="380" ry="342" fill="none" stroke="#71717a" stroke-width="14" stroke-dasharray="1 14 3 25 1 10 2 30" opacity="0.45" />
          </g>
        </g>
    ` : "";

    // Kuiper Belt
    const kuiperMarkup = showKuiper ? `
        <!-- Kuiper Belt -->
        <g>
          <ellipse cx="960" cy="540" rx="920" ry="820" fill="none" stroke="#06b6d4" stroke-width="60" opacity="0.12" />
          <g>
            ${playState ? `<animateTransform attributeName="transform" type="rotate" from="0 960 540" to="360 960 540" dur="${450 / speedMultiplier}s" repeatCount="indefinite" />` : ""}
            <ellipse cx="960" cy="540" rx="890" ry="790" fill="none" stroke="#0891b2" stroke-width="12" stroke-dasharray="3 35 1 20 2 40 4 15 1 50" opacity="0.55" />
          </g>
        </g>` : "";

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>微信 / 网页太阳系3D动画 - Standard SVG Integration</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #020005;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      overflow: hidden;
    }
    .svg-container {
      width: 100%;
      height: 100vh;
      max-width: 100vw;
    }
    svg {
      width: 100%;
      height: 100%;
      display: block;
    }
  </style>
</head>
<body>
  <div class="svg-container">
    <svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer space backdrop -->
      <rect width="1920" height="1080" fill="#020005" />
      <circle cx="960" cy="540" r="950" fill="#1e1b4b" opacity="0.12" />
      <circle cx="960" cy="540" r="250" fill="#ea580c" opacity="0.06" />
      <circle cx="960" cy="540" r="130" fill="#fef08a" opacity="0.1" />

      <!-- Stellar backgrounds (Stars) -->
      <g opacity="0.65">
        <circle cx="150" cy="180" r="1.5" fill="#ffffff" />
        <circle cx="280" cy="140" r="1.2" fill="#ffffff" />
        <circle cx="320" cy="190" r="2.0" fill="#fed7aa" />
        <circle cx="1780" cy="210" r="1.8" fill="#93c5fd" />
        <circle cx="110" cy="920" r="2.0" fill="#ffffff" />
        <circle cx="1580" cy="850" r="2.2" fill="#fca5a5" />
      </g>

      <!-- Static Orbit Grids -->
      ${staticOrbits}

      <!-- Belts and Bands -->
      ${asteroidsMarkup}
      ${kuiperMarkup}

      <!-- Sun of Solar System -->
      <g>
        <circle cx="960" cy="540" r="42" fill="#ea580c" opacity="0.25">
          <animate attributeName="r" values="36;42;36" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="960" cy="540" r="35" fill="#facc15" opacity="0.8" />
        <circle cx="960" cy="540" r="28" fill="#fffbeb" />
        ${labelMode !== "none" ? `
        <g transform="translate(960, 495)">
          <rect x="-35" y="-9" width="70" height="${labelMode === "both" ? 21 : 13}" rx="3" fill="rgba(8, 2, 20, 0.72)" />
          <text text-anchor="middle" font-size="8.5" font-family="sans-serif" font-weight="bold" fill="#fef08a" y="0">${labelMode === "both" ? "太阳 / Sun" : (labelMode === "cn" ? "太阳" : "Sun")}</text>
        </g>
        ` : ""}
      </g>

      <!-- Dynamic Planets -->
      ${planetsString}

      <!-- Pluto tilted orbital travel -->
      ${plutoMarkup}

    </svg>
  </div>
</body>
</html>`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateStandaloneSVG());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generateStandaloneSVG()], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wechat-stars-system-${labelMode}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full bg-[#020205] border-l border-white/10 flex flex-col font-sans text-slate-300">
      
      {/* 🚀 Segmented Navigation Tabs */}
      <div className="flex border-b border-white/10 bg-[#020205] p-2 gap-2">
        <button
          onClick={() => setActiveTab("info")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
            activeTab === "info"
              ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
              : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>天体百科 / Catalog</span>
        </button>
        <button
          onClick={() => setActiveTab("export")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
            activeTab === "export"
              ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
              : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>SVG 微信代码导出</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {activeTab === "info" ? (
          /* ==================== TAB: ASTRONOMY INFOCARD ==================== */
          <div className="space-y-6 animate-fadeIn">
            {/* Quick-switch buttons */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
                快速星体定位 / Quick Locate
              </span>
              <div className="grid grid-cols-4 gap-1">
                <button
                  onClick={() => setSelectedPlanetId("sun")}
                  className={`py-1 text-[10px] rounded border uppercase font-medium transition-colors ${
                    selectedPlanetId === "sun" ? "bg-yellow-500 text-slate-950 border-yellow-400 font-bold" : "bg-[#020205] border-white/10 text-yellow-500 hover:bg-white/5"
                  }`}
                >
                  太阳
                </button>
                {SOLAR_SYSTEM_DATA.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlanetId(p.id)}
                    style={{ 
                      borderColor: selectedPlanetId === p.id ? p.baseColor : "rgba(255,255,255,0.1)",
                      ...(selectedPlanetId === p.id ? { backgroundColor: p.baseColor, color: "#000" } : {})
                    }}
                    className={`py-1 text-[10px] rounded border uppercase font-medium transition-all ${
                      selectedPlanetId === p.id 
                        ? "text-slate-950 font-bold" 
                        : "bg-[#020205] text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    {p.nameCN}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedPlanetId("pluto")}
                  className={`py-1 text-[10px] rounded border uppercase font-medium transition-colors ${
                    selectedPlanetId === "pluto" ? "bg-slate-300 text-slate-950 border-white font-bold" : "bg-[#020205] border-white/10 text-slate-400 hover:bg-white/5"
                  }`}
                >
                  冥王
                </button>
              </div>
            </div>

            {/* Selected Celestial Body Details */}
            <div className="bg-white/5 border border-white/10 rounded p-5 space-y-4 relative overflow-hidden backdrop-blur-md">
              {/* Planetary color bar indicator */}
              <div 
                className="absolute top-0 left-0 w-full h-[3px]" 
                style={{ backgroundColor: selectedBody.baseColor || selectedBody.color }}
              />

              {/* Title Section */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-1.5">
                    {selectedBody.nameCN}
                  </h2>
                  <p className="text-sm text-slate-500 font-mono tracking-wide">
                    {selectedBody.nameEN}
                  </p>
                </div>
                {/* Visual symbol placeholder */}
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 shadow-inner"
                  style={{ background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.5) 100%)` }}
                >
                  <div 
                    className="w-6 h-6 rounded-full" 
                    style={{ backgroundColor: selectedBody.baseColor || selectedBody.color }}
                  />
                </div>
              </div>

              {/* Description Paragraphs */}
              <div className="space-y-2 text-slate-300 text-xs leading-relaxed border-t border-white/10 pt-3">
                <p className="text-[12.5px] leading-relaxed border-l-2 pl-3 border-yellow-500/50">
                  {selectedBody.descriptionCN}
                </p>
                <p className="text-[11px] text-slate-500 pl-3 leading-normal font-sans italic">
                  {selectedBody.descriptionEN}
                </p>
              </div>

              {/* Telemetry Metrics */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[10.5px]">
                <div className="bg-[#020205]/40 p-2.5 rounded border border-white/10 flex flex-col">
                  <span className="text-[9px] text-slate-500 font-mono tracking-wider uppercase">日距 / Distance</span>
                  <span className="text-sm font-semibold font-mono text-yellow-500 mt-0.5">{selectedBody.distanceText}</span>
                </div>
                <div className="bg-[#020205]/40 p-2.5 rounded border border-white/10 flex flex-col">
                  <span className="text-[9px] text-slate-500 font-mono tracking-wider uppercase">质量 / Mass</span>
                  <span className="text-sm font-semibold font-mono text-yellow-500 mt-0.5">{selectedBody.mass}</span>
                </div>
                <div className="bg-[#020205]/40 p-2.5 rounded border border-white/10 col-span-2 flex flex-col">
                  <span className="text-[9px] text-slate-500 font-mono tracking-wide uppercase">公转/自转周期 Period</span>
                  <div className="flex justify-between items-baseline mt-0.5">
                    <span className="text-sm font-semibold font-sans text-yellow-500">{selectedBody.periodTextCN || (selectedBody as any).periodTextCN}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({selectedBody.periodTextEN || (selectedBody as any).periodTextEN})</span>
                  </div>
                </div>
              </div>

              {/* Satellites Orbit List - Detailed moon orbits */}
              {hasMoonsList.length > 0 && (
                <div className="border-t border-white/10 pt-3 space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
                      主要近地卫星 ({hasMoonsList.length}) / Moons
                    </span>
                    <span className="text-[9px] text-yellow-500/80 font-mono">
                      (轨道已同步演绎)
                    </span>
                  </div>
                  <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                    {hasMoonsList.map((m) => (
                      <div 
                        key={m.id} 
                        className="bg-white/5 hover:bg-white/10 border border-white/10 rounded p-1.5 px-3 text-[11px] flex justify-between items-center transition-all"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.color }} />
                          <span className="font-medium text-slate-200">{m.nameCN}</span>
                          <span className="text-slate-500 font-mono text-[9px]">({m.nameEN})</span>
                        </div>
                        <div className="flex items-center gap-2 text-[9.5px]">
                          <span className="text-slate-500 font-mono">径: {m.orbitRadius}0k km</span>
                          <span className="bg-yellow-950/40 font-mono text-yellow-500 border border-yellow-900/30 px-1 py-0.5 rounded text-[8px]">
                            {m.speed}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Technical notes */}
            <div className="bg-white/5 border border-white/10 rounded p-3 text-[11px] text-slate-400 leading-normal flex gap-3">
              <Info className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-500">微信 SVG 渲染兼容技术规格：</p>
                <p className="mt-1">
                  由于微信及很多移动场景禁止了 Javascript。本程序基于白名单的 <b>animateMotion</b> 与 <b>animateTransform</b> 完成物理轨道插值，确保无 JS 环境下实现完美顺畅自控。
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* ==================== TAB: SVG HTML EXPORTER ==================== */
          <div className="space-y-4 animate-fadeIn">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-yellow-500 flex items-center gap-1.5">
                <FileCode className="w-4 h-4" />
                <span>微信排版 / 各类无 JS 场景兼容</span>
              </h3>
              <p className="text-[11.5px] text-slate-400 leading-relaxed font-sans">
                点击导出获取自包含的 <code>&lt;svg&gt;</code> standalone HTML 文件。完全依靠 <b>SMIL 特性</b>：
              </p>
              <ul className="list-disc pl-4 text-[10.5px] text-slate-500 space-y-1 font-mono">
                <li>同步跟随：Label 元素绝对定位嵌套于运动 Group 下，同步跟随不颠倒。</li>
                <li>无损缩放：1920x1080 标准 ViewBox，支持完全自适应高宽。</li>
                <li>不依赖脚本：支持微信公众号直接导入、SVG 富媒体推送。</li>
              </ul>
            </div>

            {/* Quick Export Controls */}
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-1.5 bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800 text-slate-950 py-2.5 px-3 rounded text-xs font-bold tracking-wider uppercase transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "已复制！" : "复制 SVG 代码"}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-1.5 border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 py-2.5 px-3 rounded text-xs font-semibold tracking-wider transition-all"
                title="Download Standalone HTML"
              >
                <Download className="w-3.5 h-3.5" />
                <span>下载 HTML</span>
              </button>
            </div>

            {/* Live Source Code Preview Window */}
            <div className="space-y-1">
              <span className="text-[9.5px] text-slate-500 font-mono tracking-widest uppercase block">
                核心 SVG 框架代码预览 (部分)
              </span>
              <div className="bg-[#020205] border border-white/10 p-3 rounded font-mono text-[9.5px] space-y-1 text-slate-400 max-h-[300px] overflow-auto select-text scrollbar-thin">
                <div className="text-yellow-600">&lt;!-- 微信 SVG 白名单兼容太阳系动画 --&gt;</div>
                <div>&lt;<span className="text-amber-500">svg</span> xmlns=<span className="text-emerald-400">"http://www.w3.org/2000/svg"</span> viewBox=<span className="text-emerald-400">"0 0 1920 1080"</span>&gt;</div>
                <div className="pl-2 text-slate-500">&lt;!-- 2016-2025 attributeName 白名单规则 --&gt;</div>
                <div className="pl-2">&lt;<span className="text-amber-500">defs</span>&gt; ... &lt;/<span className="text-amber-500">defs</span>&gt;</div>
                <div className="pl-2 text-slate-500">&lt;!-- 静态轨道网格 --&gt;</div>
                {showOrbits && SOLAR_SYSTEM_DATA.slice(0, 3).map((p) => (
                  <div key={p.id} className="pl-4 text-slate-500">&lt;<span className="text-amber-400">ellipse</span> cx="960" cy="540" rx="{p.orbitRx}" ry="{p.orbitRy}" fill="none" stroke="rgba(...)" /&gt;</div>
                ))}
                <div className="pl-2 text-slate-500">&lt;!-- 自动动画跟随地球与月球系统 --&gt;</div>
                <div className="pl-2">&lt;<span className="text-amber-500">g</span>&gt;</div>
                <div className="pl-4">&lt;<span className="text-amber-500">g</span>&gt;</div>
                <div className="pl-6 text-emerald-500">&lt;<span className="text-amber-500">animateMotion</span> path="M 715,540 a 245,220 0 1,1 490,0 a 245,215 ..." ... /&gt;</div>
                <div className="pl-6 text-slate-500">&lt;!-- 卫星运行轨迹 --&gt;</div>
                <div className="pl-6">&lt;<span className="text-amber-500">g</span>&gt;</div>
                <div className="pl-8">&lt;<span className="text-amber-500">circle</span> r="1.5" fill="#fef"&gt;</div>
                <div className="pl-10 text-emerald-500">&lt;<span className="text-amber-500">animateTransform</span> attributeName="transform" type="rotate" dur="4s" repeatCount="indefinite" /&gt;</div>
                <div className="pl-8">&lt;/<span className="text-amber-500">circle</span>&gt;</div>
                <div className="pl-6">&lt;/<span className="text-amber-500">g</span>&gt;</div>
                <div className="pl-6 text-slate-500">&lt;!-- 完美自适应不颠倒 bilingual labels跟随 --&gt;</div>
                <div className="pl-6">&lt;<span className="text-amber-500">g</span> transform="translate(0, 20)"&gt;</div>
                <div className="pl-8">&lt;<span className="text-yellow-500">text</span> text-anchor="middle" fill="#fff"&gt;地球 / Earth&lt;/<span className="text-yellow-500">text</span>&gt;</div>
                <div className="pl-6">&lt;/<span className="text-amber-500">g</span>&gt;</div>
                <div className="pl-4">&lt;/<span className="text-amber-500">g</span>&gt;</div>
                <div className="pl-2">&lt;/<span className="text-amber-500">g</span>&gt;</div>
                <div>&lt;/<span className="text-amber-500">svg</span>&gt;</div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== BOTTOM: CONTROL PANEL POD ===================== */}
        <div className="border-t border-white/10 pt-5 space-y-4">
          <div className="flex justify-between items-baseline">
            <h4 className="text-xs font-semibold text-slate-400 font-mono tracking-widest uppercase flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-yellow-500" />
              <span>控制中枢 / Orbit Controls</span>
            </h4>
            <span className="text-[10px] text-yellow-500/80 font-mono">
              v2.4 Live
            </span>
          </div>

          {/* Time Warp and Flow Controls */}
          <div className="p-4 bg-white/5 rounded border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">运行流逝 / Orbit Flow</span>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`py-1.5 px-3 rounded text-xs font-medium flex items-center gap-1.5 transition-all ${
                  isPlaying 
                    ? "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/25" 
                    : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/25"
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3 h-3 fill-yellow-500" />
                    <span>暂停时间</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-emerald-500" />
                    <span>启动运行</span>
                  </>
                )}
              </button>
            </div>

            {/* Time Warp Warp Multiplier Selector */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline text-[10.5px]">
                <span className="text-slate-400 flex items-center gap-1">
                  公转时光加速 / Time dilation
                </span>
                <span className="font-mono text-yellow-500 font-semibold">{speedMultiplier === 0.1 ? "0.1" : speedMultiplier}x speed</span>
              </div>
              <div className="flex gap-1.5">
                {[0.1, 0.5, 1, 2, 4, 8].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSpeedMultiplier(s);
                      if(!isPlaying) setIsPlaying(true);
                    }}
                    className={`flex-1 py-1 rounded text-[10px] uppercase transition-colors ${
                      speedMultiplier === s 
                        ? "bg-yellow-500 text-slate-950 font-bold" 
                        : "bg-[#020205] border border-white/10 hover:bg-white/5 text-slate-400"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Visibility toggle widgets */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
              视觉图层控制 / Layers Toggles
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              
              {/* Orbits Switch */}
              <button
                onClick={() => setShowOrbits(!showOrbits)}
                className={`py-2 px-2.5 rounded border text-left flex justify-between items-center transition-all ${
                  showOrbits 
                    ? "bg-white/5 border-yellow-500/30 text-white font-medium" 
                    : "bg-transparent border-white/5 text-slate-500 hover:text-slate-300"
                }`}
              >
                <span>行星公转轨迹 (Orbits)</span>
                {showOrbits ? <Eye className="w-3.5 h-3.5 text-yellow-500" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>

              {/* Moons Switch */}
              <button
                onClick={() => setShowMoons(!showMoons)}
                className={`py-2 px-2.5 rounded border text-left flex justify-between items-center transition-all ${
                  showMoons 
                    ? "bg-white/5 border-yellow-500/30 text-white font-medium" 
                    : "bg-transparent border-white/5 text-slate-500 hover:text-slate-300"
                }`}
              >
                <span>卫星公转轨迹 (Moons)</span>
                {showMoons ? <Eye className="w-3.5 h-3.5 text-yellow-500" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>

              {/* Asteroid switch */}
              <button
                onClick={() => setShowAsteroids(!showAsteroids)}
                className={`py-2 px-2.5 rounded border text-left flex justify-between items-center transition-all ${
                  showAsteroids 
                    ? "bg-white/5 border-yellow-500/30 text-white font-medium" 
                    : "bg-transparent border-white/5 text-slate-500 hover:text-slate-300"
                }`}
              >
                <span>火木小行星带 (Asteroids)</span>
                {showAsteroids ? <Eye className="w-3.5 h-3.5 text-yellow-500" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>

              {/* Kuiper switch */}
              <button
                onClick={() => setShowKuiper(!showKuiper)}
                className={`py-2 px-2.5 rounded border text-left flex justify-between items-center transition-all ${
                  showKuiper 
                    ? "bg-white/5 border-yellow-500/30 text-white font-medium" 
                    : "bg-transparent border-white/5 text-slate-500 hover:text-slate-300"
                }`}
              >
                <span>柯伊伯带 (Kuiper Belt)</span>
                {showKuiper ? <Eye className="w-3.5 h-3.5 text-yellow-500" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Bilingual labels switcher */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
              文字注释模式 / Labels Display
            </span>
            <div className="grid grid-cols-4 gap-1 p-1 bg-white/5 border border-white/10 rounded">
              {[
                { id: "both", label: "双语 / Both" },
                { id: "cn", label: "中文 / CN" },
                { id: "en", label: "英文 / EN" },
                { id: "none", label: "无 / Hide" }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setLabelMode(opt.id as any)}
                  className={`py-1.5 rounded text-[10px] font-medium transition-all ${
                    labelMode === opt.id 
                      ? "bg-[#020205] text-yellow-500 border border-yellow-500/20 font-bold" 
                      : "text-slate-500 hover:text-slate-200"
                  }`}
                >
                  {opt.label.split(" / ")[0]}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Footer Info credit */}
      <div className="p-4 bg-[#020205] border-t border-white/10 text-[9.5px] text-slate-600 font-mono flex items-center justify-between px-5">
        <span>JZ Creative &copy; 2026</span>
        <span>WeChat SVG Whitelist Compliant</span>
      </div>

    </div>
  );
}
