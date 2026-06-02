import React, { useState, useEffect } from "react";
import SolarSystemSVG from "./components/SolarSystemSVG";
import Dashboard from "./components/Dashboard";
import { 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  Globe, 
  Info, 
  Database,
  Calendar,
  XCircle,
  Maximize2
} from "lucide-react";
import { SOLAR_SYSTEM_DATA } from "./types";

export default function App() {
  // Navigation Options State
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [showOrbits, setShowOrbits] = useState<boolean>(true);
  const [showMoons, setShowMoons] = useState<boolean>(true);
  const [labelMode, setLabelMode] = useState<"both" | "cn" | "en" | "none">("both");
  const [showAsteroids, setShowAsteroids] = useState<boolean>(true);
  const [showKuiper, setShowKuiper] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  
  // Selected Star Focus
  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>("earth");

  // Panning & Interactive zoom
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Custom Simulated Cosmic Time Tracker
  const [simulatedDate, setSimulatedDate] = useState<Date>(new Date("2026-06-01T12:00:00Z"));

  // Advance state-based cosmic calendar dates
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setSimulatedDate((prev) => {
        // 1 second real-time = speedMultiplier * standard speed (e.g. 5 days per interval)
        const daysToAdvance = 0.45 * speedMultiplier;
        const nextDate = new Date(prev);
        nextDate.setTime(nextDate.getTime() + daysToAdvance * 24 * 60 * 60 * 1000);
        return nextDate;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [isPlaying, speedMultiplier]);

  // Handle Drag-to-Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanX(e.clientX - dragStart.x);
    setPanY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Double click resets pan and zoom
  const handleDoubleClick = () => {
    setZoomScale(1.0);
    setPanX(0);
    setPanY(0);
    setSelectedPlanetId(null);
  };

  // Keyboard shortcut handlers for deep dive
  const handleZoomIn = () => setZoomScale((z) => Math.min(z + 0.25, 4.0));
  const handleZoomOut = () => setZoomScale((z) => Math.max(z - 0.25, 0.5));
  const handleZoomReset = () => {
    setZoomScale(1.0);
    setPanX(0);
    setPanY(0);
  };

  // Find targeted descriptive focus node
  const activeFocusPlanetName = (() => {
    if (selectedPlanetId === "sun") return { cn: "太阳", en: "The Sun" };
    if (selectedPlanetId === "pluto") return { cn: "冥王星", en: "Pluto (Dwarf Planet)" };
    const match = SOLAR_SYSTEM_DATA.find((p) => p.id === selectedPlanetId);
    return match ? { cn: match.nameCN, en: match.nameEN } : null;
  })();

  // Find targeted descriptive focus node details for Right Panel Stats Overlay
  const selectedBody = (() => {
    if (selectedPlanetId === "sun") {
      return {
        nameCN: "太阳",
        nameEN: "Sun",
        distanceText: "0.00 AU",
        velocity: "—",
        type: "G-Type Star"
      };
    }
    if (selectedPlanetId === "pluto") {
      return {
        nameCN: "冥王星",
        nameEN: "Pluto",
        distanceText: "39.48 AU",
        velocity: "4.74",
        type: "Dwarf Planet"
      };
    }
    const match = SOLAR_SYSTEM_DATA.find((p) => p.id === selectedPlanetId);
    if (match) {
      // Approximate orbital velocities for the planets in km/s (standard values)
      const velocities: Record<string, string> = {
        mercury: "47.36",
        venus: "35.02",
        earth: "29.78",
        mars: "24.07",
        jupiter: "13.07",
        saturn: "9.68",
        uranus: "6.80",
        neptune: "5.43"
      };
      return {
        nameCN: match.nameCN,
        nameEN: match.nameEN,
        distanceText: match.distanceText,
        velocity: velocities[match.id] || "—",
        type: match.id === "jupiter" || match.id === "saturn" || match.id === "uranus" || match.id === "neptune" ? "Gas / Ice Giant" : "Terrestrial"
      };
    }
    // Default to Earth
    return {
      nameCN: "地球",
      nameEN: "Earth",
      distanceText: "1.00 AU",
      velocity: "29.78",
      type: "Terrestrial"
    };
  })();

  return (
    <div className="w-screen h-screen bg-[#020205] font-sans flex flex-col md:flex-row overflow-hidden text-slate-300 select-none">
      
      {/* 🌌 Left Interactive Visual Chamber */}
      <div className="flex-1 h-full flex flex-col relative overflow-hidden">
        
        {/* 📟 Header Geometric Balance Overlay */}
        <header className="absolute top-0 left-0 w-full z-10 p-6 md:px-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#020205]/90 backdrop-blur-md border-b border-white/10 pointer-events-auto">
          <div className="flex items-center gap-4">
            {/* Elegant Golden sun-emblem next to logo */}
            <div className="w-10 h-10 border border-yellow-500/50 rounded-full flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 text-yellow-500 animate-spin" style={{ animationDuration: "25s" }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-bold tracking-widest uppercase text-white font-sans">
                  太阳系天体运行仪 <span className="text-white/30 font-light font-mono text-[13px]">/ SOLAR SYSTEM OBSERVER</span>
                </h1>
              </div>
              <p className="text-[10px] text-slate-500 font-mono tracking-tighter">
                太阳系实时动态演绎系统 V2.4 • 基于 SMIL 规则物理轨道插值
              </p>
            </div>
          </div>

          {/* Atomic UTC Space Clock Indicator in Geometric Box */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded px-4 py-2 flex items-center gap-3 text-right">
            <Calendar className="w-4 h-4 text-yellow-500 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">
                模拟时间线 / Cosmic Time
              </span>
              <span className="text-xs font-semibold font-mono text-white">
                {simulatedDate.toISOString().split("T")[0]} {simulatedDate.toISOString().split("T")[1].slice(0, 5)} UTC
              </span>
            </div>
          </div>
        </header>

        {/* 📋 Side Info Panel Left (Geometric Balance overlay) */}
        <aside className="absolute left-8 lg:left-10 top-[40%] -translate-y-1/2 w-48 space-y-8 z-10 hidden xl:block pointer-events-none">
          <section className="pointer-events-auto">
            <h3 className="text-[10px] text-yellow-500 mb-2 uppercase font-bold tracking-widest">Star Data / 恒星数据</h3>
            <div className="border-l border-yellow-500/30 pl-4 space-y-1">
              <p className="text-sm font-semibold text-white">The Sun / 太阳</p>
              <p className="text-[11px] text-slate-500 font-mono">G-Type Main-Sequence</p>
              <p className="text-[11px] text-slate-500 italic font-mono">5,778 K Surface Temp</p>
            </div>
          </section>
          
          <section className="pointer-events-auto">
            <h3 className="text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-widest">System Stats / 系统统计</h3>
            <div className="grid grid-cols-2 gap-4 text-[11px]">
              <div><span className="block text-slate-500">Planets</span><span className="font-mono text-white">08</span></div>
              <div><span className="block text-slate-500">Moons</span><span className="font-mono text-white">200+</span></div>
              <div><span className="block text-slate-500">Asteroids</span><span className="font-mono text-white">1.1M</span></div>
              <div><span className="block text-slate-500">Radius</span><span className="font-mono text-white">30.1 AU</span></div>
            </div>
          </section>
        </aside>

        {/* 📋 Side Info Panel Right (Geometric Dynamic Context overlay) */}
        <aside className="absolute right-8 lg:right-10 top-[40%] -translate-y-1/2 w-48 space-y-4 z-10 hidden xl:block text-right pointer-events-auto">
          <div className="p-4 bg-white/5 border border-white/10 backdrop-blur-md rounded">
            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-wider">
              {activeFocusPlanetName ? `${activeFocusPlanetName.en} Velocity` : "Orbital Velocity"} / 公转速
            </p>
            <p className="text-lg font-mono text-white">
              {selectedBody.velocity} <span className="text-[10px] text-slate-500 uppercase">km/s</span>
            </p>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 backdrop-blur-md rounded">
            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-wider">
              {activeFocusPlanetName ? `${activeFocusPlanetName.en} Distance` : "Solar Distance"} / 日距
            </p>
            <p className="text-lg font-mono text-white">
              {selectedBody.distanceText.split(" ")[0]} <span className="text-[10px] text-slate-500 uppercase">AU</span>
            </p>
          </div>
          <div className="p-3 bg-white/5 border border-white/10 backdrop-blur-md rounded text-right">
            <span className="block text-[8px] text-slate-500 uppercase font-mono">Category / 天体类别</span>
            <span className="text-[11px] font-medium text-yellow-500">{selectedBody.type}</span>
          </div>
        </aside>

        {/* 🎛️ Left-Bottom Navigation & Interactive Aids */}
        <div className="absolute bottom-6 left-6 z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pointer-events-auto">
          {/* Zoom controls pod */}
          <div className="flex bg-[#020205]/90 backdrop-blur-md border border-white/10 rounded p-1 gap-1">
            <button
              onClick={handleZoomIn}
              className="p-2 rounded bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/5 transition"
              title="Zoom In (放大)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 rounded bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/5 transition"
              title="Zoom Out (缩小)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomReset}
              className="p-2 px-3 rounded bg-white/5 text-xs font-mono font-medium text-slate-400 hover:text-white hover:bg-white/10 border border-white/5 transition flex items-center gap-1"
              title="Reset Zoom & Pan (重置视角)"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{Math.round(zoomScale * 100)}%</span>
            </button>
          </div>

          {/* Active Target Indicator widget in Gold Theme style */}
          {activeFocusPlanetName && (
            <div className="bg-yellow-950/40 backdrop-blur-md border border-yellow-500/30 text-yellow-500 rounded p-2 px-4 text-xs font-semibold flex items-center gap-3 justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500 animate-ping" />
                <span>
                  当前锁定星体: <strong className="text-white">{activeFocusPlanetName.cn}</strong> ({activeFocusPlanetName.en})
                </span>
              </div>
              <button
                onClick={() => setSelectedPlanetId(null)}
                className="text-yellow-500/60 hover:text-white transition pl-2.5 border-l border-yellow-500/20"
                title="Clear Focus"
              >
                <XCircle className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          
          {/* Quick instructions indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-2 bg-white/5 border border-white/10 rounded text-[10.5px] text-slate-400 font-sans pointer-events-none">
            <span>💡 拖拽画布可全局平移，双击重置视角。</span>
          </div>
        </div>

        {/* 🌌 Simulated Visual Dome with React drag to pan */}
        <div
          className="w-full h-full flex-1 relative overflow-hidden flex items-center justify-center bg-[#020205]"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onDoubleClick={handleDoubleClick}
        >
          {/* Transforming SVG Container */}
          <div
            className="w-full h-full cursor-grab active:cursor-grabbing transform-gpu transition-all duration-300 ease-out"
            style={{
              transform: `scale(${zoomScale}) translate(${panX}px, ${panY}px)`,
              transformOrigin: `960px 480px`, // center around solar system
            }}
          >
            <SolarSystemSVG
              speedMultiplier={speedMultiplier}
              showOrbits={showOrbits}
              showMoons={showMoons}
              labelMode={labelMode}
              selectedPlanetId={selectedPlanetId}
              onSelectPlanet={setSelectedPlanetId}
              showAsteroids={showAsteroids}
              showKuiper={showKuiper}
              isPlaying={isPlaying}
            />
          </div>
        </div>

        {/* Elegant Bottom Footer inside simulator */}
        <footer className="absolute bottom-0 left-0 w-full z-10 px-8 py-4 bg-[#020205]/90 border-t border-white/10 flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-slate-500 pointer-events-auto">
          <div className="flex gap-6">
            <span>Time Scale: 1s ≈ 0.45 Days</span>
            <span className="text-yellow-500/80">● Live Simulation</span>
          </div>
          <div className="hidden sm:flex gap-6">
            <span onClick={handleDoubleClick} className="hover:text-white cursor-pointer transition-colors">Reset View / 重置</span>
            <span className="text-slate-700">|</span>
            <span onClick={() => {
              const activeLabelOptions: ("both" | "cn" | "en" | "none")[] = ["both", "cn", "en", "none"];
              const currentIndex = activeLabelOptions.indexOf(labelMode);
              setLabelMode(activeLabelOptions[(currentIndex + 1) % 4]);
            }} className="hover:text-white cursor-pointer transition-colors">Toggle Labels [L] / 标注</span>
          </div>
        </footer>

      </div>

      {/* 🧭 Right Control & Technical Documentation Drawer */}
      <aside className="w-full md:w-[420px] lg:w-[460px] h-[55%] md:h-full shrink-0 flex flex-col border-t md:border-t-0 md:border-l border-white/10 bg-[#020205]/95 backdrop-blur-xl relative z-10">
        <Dashboard
          speedMultiplier={speedMultiplier}
          setSpeedMultiplier={setSpeedMultiplier}
          showOrbits={showOrbits}
          setShowOrbits={setShowOrbits}
          showMoons={showMoons}
          setShowMoons={setShowMoons}
          labelMode={labelMode}
          setLabelMode={setLabelMode}
          showAsteroids={showAsteroids}
          setShowAsteroids={setShowAsteroids}
          showKuiper={showKuiper}
          setShowKuiper={setShowKuiper}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          selectedPlanetId={selectedPlanetId}
          setSelectedPlanetId={setSelectedPlanetId}
          svgElementId="solar-system-view"
        />
      </aside>

    </div>
  );
}
