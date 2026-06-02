import React from "react";
import { PlanetData, SOLAR_SYSTEM_DATA } from "../types";

interface SolarSystemSVGProps {
  speedMultiplier: number;
  showOrbits: boolean;
  showMoons: boolean;
  labelMode: "both" | "cn" | "en" | "none";
  selectedPlanetId: string | null;
  onSelectPlanet: (id: string | null) => void;
  showAsteroids: boolean;
  showKuiper: boolean;
  isPlaying: boolean;
}

export default function SolarSystemSVG({
  speedMultiplier,
  showOrbits,
  showMoons,
  labelMode,
  selectedPlanetId,
  onSelectPlanet,
  showAsteroids,
  showKuiper,
  isPlaying,
}: SolarSystemSVGProps) {
  const cx = 960;
  const cy = 540;

  // Render a planet orbit path line
  const renderOrbitPath = (rx: number, ry: number, strokeColor = "rgba(255, 255, 255, 0.08)", dash = "none", key?: string) => {
    if (!showOrbits) return null;
    return (
      <ellipse
        key={key}
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.2"
        strokeDasharray={dash}
        className="transition-all duration-500 ease-in-out pointer-events-none"
      />
    );
  };

  // Convert orbit details to a d-path for animateMotion
  // Stretches clockwise starting at the leftmost point (cx - rx, cy)
  const getEllipsePath = (rx: number, ry: number) => {
    return `M ${cx - rx},${cy} a ${rx},${ry} 0 1,1 ${rx * 2},0 a ${rx},${ry} 0 1,1 ${-rx * 2},0`;
  };

  return (
    <svg
      viewBox="0 0 1920 1080"
      className="w-full h-full bg-slate-950 text-slate-100 select-none cursor-grab active:cursor-grabbing transition-colors duration-500"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Deep Space Background / Nebula Layers with Solid Color Blending */}
      <rect width="1920" height="1080" fill="#020006" />
      <circle cx={cx} cy={cy} r="950" fill="#1e1b4b" opacity="0.12" />
      <circle cx={cx} cy={cy} r="250" fill="#ea580c" opacity="0.06" />
      <circle cx={cx} cy={cy} r="130" fill="#fef08a" opacity="0.1" />

      {/* Embedded High-Quality Fixed Constellation Stars */}
      <g opacity="0.6" className="pointer-events-none">
        {/* Constellations and clusters */}
        <circle cx="150" cy="180" r="1.5" fill="#ffffff" />
        <circle cx="180" cy="220" r="1.0" fill="#cbd5e1" />
        <circle cx="140" cy="280" r="0.8" fill="#94a3b8" />
        <circle cx="280" cy="140" r="1.2" fill="#ffffff" opacity="0.8" />
        <circle cx="320" cy="190" r="2.0" fill="#fed7aa" /> {/* red dwarf star */}
        
        <circle cx="1700" cy="120" r="1.0" fill="#ffffff" />
        <circle cx="1780" cy="210" r="1.8" fill="#93c5fd" /> {/* blue bright giant */}
        <circle cx="1630" cy="250" r="1.2" fill="#ffffff" />
        <circle cx="1820" cy="180" r="0.7" fill="#cbd5e1" />

        <circle cx="220" cy="850" r="1.2" fill="#ffffff" />
        <circle cx="110" cy="920" r="2.0" fill="#ffffff" opacity="0.9" />
        <circle cx="340" cy="880" r="0.9" fill="#94a3b8" />

        <circle cx="1750" cy="890" r="1.5" fill="#fef08a" />
        <circle cx="1680" cy="940" r="1.1" fill="#ffffff" />
        <circle cx="1810" cy="810" r="0.8" fill="#e2e8f0" />
        <circle cx="1580" cy="850" r="2.2" fill="#fca5a5" />

        {/* Galaxy scattered background dust */}
        <path d="M 400,200 Q 560,350 720,250 T 1100,400" fill="none" stroke="rgba(147, 197, 253, 0.05)" strokeWidth="60" strokeLinecap="round" />
        <path d="M 1200,800 Q 1400,900 1600,750" fill="none" stroke="rgba(192, 132, 252, 0.04)" strokeWidth="80" strokeLinecap="round" />
      </g>

      {/* Orbit Grid Overlay lines */}
      {SOALR_SYSTEM_STATIC_ORBITS()}

      {/* ==================== ASTEROID BELT (火木小行星带) ==================== */}
      {showAsteroids && (
        <g className="pointer-events-none">
          {/* Main Belt Ring 1 - Clockwise Rotation */}
          <g>
            {isPlaying && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 960 540"
                to="360 960 540"
                dur={`${180 / speedMultiplier}s`}
                repeatCount="indefinite"
              />
            )}
            <ellipse
              cx={cx}
              cy={cy}
              rx="365"
              ry="325"
              fill="none"
              stroke="#52525b"
              strokeWidth="10"
              strokeDasharray="2 18 1 12 3 22 1 15 2 28 4 10 1 20"
              opacity="0.5"
            />
          </g>

          {/* Main Belt Ring 2 - Clockwise slightly faster */}
          <g>
            {isPlaying && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="45 960 540"
                to="405 960 540"
                dur={`${220 / speedMultiplier}s`}
                repeatCount="indefinite"
              />
            )}
            <ellipse
              cx={cx}
              cy={cy}
              rx="380"
              ry="342"
              fill="none"
              stroke="#71717a"
              strokeWidth="14"
              strokeDasharray="1 14 3 25 1 10 2 30 1 12 3 20"
              opacity="0.45"
            />
          </g>

          {/* Main Belt Ring 3 - Counter Clockwise rotation */}
          <g>
            {isPlaying && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="280 960 540"
                to="-80 960 540"
                dur={`${270 / speedMultiplier}s`}
                repeatCount="indefinite"
              />
            )}
            <ellipse
              cx={cx}
              cy={cy}
              rx="395"
              ry="358"
              fill="none"
              stroke="#3f3f46"
              strokeWidth="8"
              strokeDasharray="2 25 1 18 3 14 1 35 2 10"
              opacity="0.55"
            />
          </g>
        </g>
      )}

      {/* ==================== KUIPER BELT (柯伊伯带) ==================== */}
      {showKuiper && (
        <g className="pointer-events-none">
          {/* Dust halo background ring */}
          <ellipse
            cx={cx}
            cy={cy}
            rx="920"
            ry="820"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="60"
            opacity="0.12"
          />

          {/* Kuiper Ring 1 - slow icy debris rotation */}
          <g>
            {isPlaying && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 960 540"
                to="360 960 540"
                dur={`${450 / speedMultiplier}s`}
                repeatCount="indefinite"
              />
            )}
            <ellipse
              cx={cx}
              cy={cy}
              rx="890"
              ry="790"
              fill="none"
              stroke="#0891b2"
              strokeWidth="12"
              strokeDasharray="3 35 1 20 2 40 4 15 1 50 2 25 3 45 1 30"
              opacity="0.55"
            />
          </g>

          {/* Kuiper Ring 2 - slower, outer band */}
          <g>
            {isPlaying && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="120 960 540"
                to="480 960 540"
                dur={`${600 / speedMultiplier}s`}
                repeatCount="indefinite"
              />
            )}
            <ellipse
              cx={cx}
              cy={cy}
              rx="925"
              ry="825"
              fill="none"
              stroke="#0e7490"
              strokeWidth="16"
              strokeDasharray="2 45 4 20 1 55 2 30 3 40 1 60 2 25"
              opacity="0.45"
            />
          </g>

          {/* Kuiper Ring 3 - Counter Clockwise rotating icy rocks */}
          <g>
            {isPlaying && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="270 960 540"
                to="-90 960 540"
                dur={`${550 / speedMultiplier}s`}
                repeatCount="indefinite"
              />
            )}
            <ellipse
              cx={cx}
              cy={cy}
              rx="950"
              ry="850"
              fill="none"
              stroke="#155e75"
              strokeWidth="10"
              strokeDasharray="1 30 3 45 2 25 1 60 4 15"
              opacity="0.6"
            />
          </g>
        </g>
      )}

      {/* ==================== THE SUN (太阳) ==================== */}
      <g className="cursor-pointer" onClick={() => onSelectPlanet("sun")}>
        {/* Pulsating solar flare rings */}
        <circle cx={cx} cy={cy} r="42" fill="#ea580c" opacity="0.25">
          {isPlaying && (
            <animate
              attributeName="r"
              values="40;46;40"
              dur="4s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        <circle cx={cx} cy={cy} r="35" fill="#facc15" opacity="0.8">
          {isPlaying && (
            <animate
              attributeName="opacity"
              values="0.9;1;0.9"
              dur="2.5s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        
        {/* Solar core */}
        <circle cx={cx} cy={cy} r="28" fill="#fffbeb" />

        {/* Sun Bilingual Labels */}
        {labelMode !== "none" && (
          <g transform={`translate(${cx}, ${cy - 48})`} className="pointer-events-none">
            <rect x="-42" y="-14" width="84" height="24" rx="4" fill="rgba(8, 2, 20, 0.72)" stroke="rgba(234, 179, 8, 0.4)" strokeWidth="0.75" />
            <text
              textAnchor="middle"
              className="font-sans font-semibold tracking-wide"
              fill="#fef08a"
              fontSize="11"
              y="2"
            >
              {labelMode === "both" && "太阳 / Sun"}
              {labelMode === "cn" && "太阳"}
              {labelMode === "en" && "Sun"}
            </text>
          </g>
        )}
      </g>

      {/* ==================== DYNAMIC PLANETS & SATELLITES SYSTEM ==================== */}
      <g>
        {SOLAR_SYSTEM_DATA.map((planet) => {
          const isSelected = selectedPlanetId === planet.id;

          return (
            <g key={planet.id}>
              {/* Entire planet system orbits and translates together */}
              <g className="cursor-pointer" onClick={(e) => {
                e.stopPropagation();
                onSelectPlanet(planet.id);
              }}>
                {/* 1. Core animateMotion driving the orbital travel */}
                {isPlaying && (
                  <animateMotion
                    path={getEllipsePath(planet.orbitRx, planet.orbitRy)}
                    dur={`${planet.orbitSpeed / speedMultiplier}s`}
                    repeatCount="indefinite"
                    rotate="0"
                  />
                )}
                {/* Fallback translation when paused */}
                {!isPlaying && (
                  <g transform={`translate(${cx - planet.orbitRx}, ${cy})`} />
                )}

                {/* 2. Selection Ring Highlight */}
                {isSelected && (
                  <circle
                    cx="0"
                    cy="0"
                    r={planet.size + 14}
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="1.5"
                    strokeDasharray="4, 2"
                    className="animate-pulse"
                  />
                )}

                {/* 3. Planets rings system (Saturn / Uranus vertical) */}
                {planet.hasRings && planet.ringsRadius && (
                  <g transform={`rotate(${planet.ringsTilt || 15})`} className="pointer-events-none">
                    {/* Saturn's wide rich rings */}
                    {planet.id === "saturn" ? (
                      <>
                        {/* Back Ring half */}
                        <ellipse
                          cx="0"
                          cy="0"
                          rx={planet.ringsRadius + 5}
                          ry={planet.ringsRadius / 2.5 + 2}
                          fill="none"
                          stroke={planet.ringsColor}
                          strokeWidth="6"
                          opacity="0.8"
                        />
                        <ellipse
                          cx="0"
                          cy="0"
                          rx={planet.ringsRadius - 1}
                          ry={planet.ringsRadius / 3}
                          fill="none"
                          stroke="rgba(100, 75, 40, 0.4)"
                          strokeWidth="2"
                        />
                      </>
                    ) : (
                      /* Uranus vertical/tilted ring system */
                      <ellipse
                        cx="0"
                        cy="0"
                        rx={planet.ringsRadius}
                        ry={planet.ringsRadius / 4}
                        fill="none"
                        stroke={planet.ringsColor}
                        strokeWidth="1.5"
                      />
                    )}
                  </g>
                )}

                {/* 4. Planet Sphere drawing */}
                <circle
                  cx="0"
                  cy="0"
                  r={planet.size}
                  fill={planet.color}
                  filter="drop-shadow(0px 1px 4px rgba(0,0,0,0.6))"
                />

                {/* Jupiter Great Red Spot detail */}
                {planet.id === "jupiter" && (
                  <ellipse
                    cx={planet.size / 3}
                    cy={planet.size / 3}
                    rx="3.5"
                    ry="2.0"
                    fill="#991b1b"
                    opacity="0.85"
                  />
                )}

                {/* Planet Atmosphere Glow Overlay */}
                <circle
                  cx="0"
                  cy="0"
                  r={planet.size}
                  fill="none"
                  stroke={planet.baseColor}
                  className="opacity-20"
                  strokeWidth="0.75"
                />

                {/* 5. Major Satellites and their Orbits under JZ rules */}
                {showMoons && planet.moons && planet.moons.length > 0 && (
                  <g>
                    {planet.moons.map((moon) => (
                      <g key={moon.id}>
                        {/* Satellite orbit ellipse */}
                        <circle
                          cx="0"
                          cy="0"
                          r={moon.orbitRadius}
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.08)"
                          strokeWidth="0.6"
                          strokeDasharray="2, 2"
                        />

                        {/* Moon animated translation orbit around planet center (0,0) */}
                        <g>
                          {isPlaying && (
                            <animateTransform
                              attributeName="transform"
                              type="rotate"
                              from="0"
                              to="360"
                              dur={moon.speed}
                              repeatCount="indefinite"
                            />
                          )}
                          
                          {/* Mini moon sphere representation */}
                          <circle
                            cx={moon.orbitRadius}
                            cy="0"
                            r={moon.size}
                            fill={moon.color}
                          />

                          {/* Tiny subtle Moon trail or orbit highlight spot */}
                          <circle
                            cx={moon.orbitRadius}
                            cy="0"
                            r={moon.size + 1.5}
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.2)"
                            strokeWidth="0.25"
                          />
                        </g>
                      </g>
                    ))}
                  </g>
                )}

                {/* 6. Bilingual Labels Following the Star Exactly! */}
                {labelMode !== "none" && (
                  <g
                    transform={`translate(0, ${planet.size + (planet.id === "jupiter" || planet.id === "saturn" ? 18 : 14)})`}
                    className="pointer-events-none"
                  >
                    {/* Shadow tag container for readability */}
                    <rect
                      x={-45}
                      y={-9}
                      width={90}
                      height={labelMode === "both" ? 22 : 14}
                      rx="3"
                      fill="rgba(2, 4, 18, 0.65)"
                      className="backdrop-blur-sm"
                    />

                    {labelMode === "both" && (
                      <>
                        <text
                          textAnchor="middle"
                          fontSize="9"
                          className="font-medium tracking-wide font-sans text-[10px] sm:text-[9px]"
                          fill="#ffffff"
                          y="0"
                        >
                          {planet.nameCN}
                        </text>
                        <text
                          textAnchor="middle"
                          fontSize="7"
                          className="font-sans text-[8px] sm:text-[7px]"
                          fill="#94a3b8"
                          y="9"
                        >
                          {planet.nameEN}
                        </text>
                      </>
                    )}

                    {labelMode === "cn" && (
                      <text
                        textAnchor="middle"
                        fontSize="9.5"
                        className="font-semibold font-sans fill-slate-200"
                        y="1"
                      >
                        {planet.nameCN}
                      </text>
                    )}

                    {labelMode === "en" && (
                      <text
                        textAnchor="middle"
                        fontSize="8.5"
                        className="font-medium font-sans fill-slate-200"
                        y="1.5"
                      >
                        {planet.nameEN}
                      </text>
                    )}
                  </g>
                )}
              </g>
            </g>
          );
        })}

        {/* ==================== PLUTO DWARF PLANET IN ECCENTRIC ORBIT ==================== */}
        {/* Pluto orbits with distinct high eccentric tilt to show complex Kuiper Belt member */}
        <g className="cursor-pointer" onClick={() => onSelectPlanet("pluto")}>
          <g>
            {isPlaying && (
              <animateMotion
                path={getEllipsePath(870, 710)} // Tilted visual range
                dur={`${230 / speedMultiplier}s`}
                repeatCount="indefinite"
                rotate="0"
              />
            )}
            
            {/* selection pulse */}
            {selectedPlanetId === "pluto" && (
              <circle
                cx="0"
                cy="0"
                r="15"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="1.5"
                strokeDasharray="3, 2"
                className="animate-pulse"
              />
            )}

            {/* Pluto Sphere */}
            <circle cx="0" cy="0" r="3.2" fill="#cbd5e1" />

            {/* Pluto label */}
            {labelMode !== "none" && (
              <g transform="translate(0, 11)" className="pointer-events-none">
                <rect x="-35" y="-9" width="70" height={labelMode === "both" ? 22 : 14} rx="3" fill="rgba(2, 4, 18, 0.72)" />
                {labelMode === "both" && (
                  <>
                    <text textAnchor="middle" fontSize="8" className="font-sans" fill="#cbd5e1" y="0">冥王星</text>
                    <text textAnchor="middle" fontSize="6.5" className="font-sans" fill="#64748b" y="8">Pluto</text>
                  </>
                )}
                {labelMode === "cn" && (
                  <text textAnchor="middle" fontSize="8.5" className="font-sans fill-slate-300" y="1">冥王星</text>
                )}
                {labelMode === "en" && (
                  <text textAnchor="middle" fontSize="8" className="font-sans fill-slate-300" y="1.5">Pluto</text>
                )}
              </g>
            )}
          </g>
        </g>
      </g>
    </svg>
  );

  // Helper static orbits
  function SOALR_SYSTEM_STATIC_ORBITS() {
    return (
      <g className="pointer-events-none">
        {/* Axis grids relative to viewport center */}
        {showOrbits && (
          <g opacity="0.1" stroke="#ffffff" strokeWidth="0.5">
            <line x1={cx} y1="0" x2={cx} y2="1080" strokeDasharray="5,5" />
            <line x1="0" y1={cy} x2="1920" y2={cy} strokeDasharray="5,5" />
            
            {/* Center concentric radar indices */}
            <circle cx={cx} cy={cy} r="100" fill="none" />
            <circle cx={cx} cy={cy} r="400" fill="none" />
            <circle cx={cx} cy={cy} r="800" fill="none" />
          </g>
        )}

        {/* Major planet static orbit ovals */}
        {SOLAR_SYSTEM_DATA.map((planet) =>
          renderOrbitPath(
            planet.orbitRx,
            planet.orbitRy,
            selectedPlanetId === planet.id ? "rgba(34, 211, 238, 0.4)" : "rgba(255, 255, 255, 0.08)",
            "none",
            planet.id
          )
        )}

        {/* Pluto skewed orbit representing Kuiper Belt's 3D eccentricity */}
        {showOrbits && (
          <ellipse
            cx={cx}
            cy={cy + 15} // slightly offset center
            rx="870"
            ry="710"
            fill="none"
            stroke={selectedPlanetId === "pluto" ? "rgba(34, 211, 238, 0.4)" : "rgba(148, 163, 184, 0.06)"}
            strokeWidth="1.2"
            strokeDasharray="4, 4"
            transform="rotate(-15 960 540)"
            className="transition-all duration-500 ease-in-out"
          />
        )}
      </g>
    );
  }
}
