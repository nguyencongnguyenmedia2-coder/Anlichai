import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { NatalChartData, PlanetPosition } from '../../types/astrology';
import { ZODIAC_SIGNS } from '../../services/astrologyEngine';

interface NatalChartWheelProps {
  chartData: NatalChartData;
}

export const NatalChartWheel: React.FC<NatalChartWheelProps> = ({ chartData }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetPosition | null>(null);

  const { planets, houses, aspects, ascendant } = chartData;

  const size = 580;
  const center = size / 2;

  // Concentric Circle Radii
  const outerRadius = 265;
  const zodiacOuter = 260;
  const zodiacInner = 205;
  const houseInner = 95;

  // Orient wheel counter-clockwise starting with Ascendant at 9 o'clock (180° in Cartesian)
  const getAngleRad = (deg: number) => {
    // Relative angle from Ascendant
    const relDeg = (deg - ascendant.totalDegree + 360) % 360;
    // Map: 0° rel -> 180° (9 o'clock), growing counter-clockwise (90° -> 270°/6 o'clock, 180° -> 0°/3 o'clock)
    const angleInDeg = (180 + relDeg) % 360;
    return (angleInDeg * Math.PI) / 180;
  };

  const getXY = (deg: number, radius: number) => {
    const rad = getAngleRad(deg);
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad)
    };
  };

  // Element Color Mapping for Zodiac Ring
  const getElementColor = (element: string) => {
    switch (element) {
      case 'Fire': return '#8B1E1E';   // Deep Crimson Red
      case 'Earth': return '#6B4210';  // Deep Golden Bronze
      case 'Air': return '#0F5257';    // Deep Sapphire Teal
      case 'Water': return '#2C2A63';  // Deep Indigo
      default: return '#5B0E14';
    }
  };

  // Sort planets by total degree to handle collision / radial staggering
  const sortedPlanets = [...planets].sort((a, b) => a.totalDegree - b.totalDegree);
  const planetStaggeredRadius: Record<string, number> = {};

  sortedPlanets.forEach((p, idx) => {
    let radius = (zodiacInner + houseInner) / 2 + 10; // Default base radius ~160
    
    // Check if close to previous planet (< 7 degrees)
    if (idx > 0) {
      const prev = sortedPlanets[idx - 1];
      const diff = Math.abs(p.totalDegree - prev.totalDegree);
      if (diff < 8 || diff > 352) {
        const prevRad = planetStaggeredRadius[prev.key] || radius;
        radius = prevRad === 175 ? 135 : 175;
      }
    }
    planetStaggeredRadius[p.key] = radius;
  });

  return (
    <div className="bg-white/95 dark:bg-oriental-dark-card/95 rounded-3xl p-4 sm:p-6 border-2 border-amber-200/90 dark:border-oriental-dark-border shadow-2xl flex flex-col items-center relative overflow-hidden">
      
      {/* Header Bar */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-amber-200/70 dark:border-oriental-dark-border mb-3">
        <div>
          <h3 className="font-serif font-black text-base sm:text-lg text-oriental-red-900 dark:text-oriental-gold-400 tracking-wide">
            📜 Vòng Tròn Bản Đồ Sao (Natal Chart Wheel)
          </h3>
          <p className="text-[11px] text-amber-900/75 dark:text-amber-200/70">
            Cung Mọc (ASC) đặt tại vị trí 9 giờ • 12 Cung & 12 Nhà chính xác
          </p>
        </div>

        {/* Zoom & Reset Controls */}
        <div className="flex items-center space-x-1.5 bg-amber-100/70 dark:bg-oriental-dark-bg p-1 rounded-xl border border-oriental-gold-500/30 shrink-0">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.0))}
            className="p-1.5 rounded-lg text-amber-900 dark:text-amber-200 hover:bg-amber-200/60 dark:hover:bg-amber-900/60 transition-colors"
            title="Phóng to bản đồ"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
            className="p-1.5 rounded-lg text-amber-900 dark:text-amber-200 hover:bg-amber-200/60 dark:hover:bg-amber-900/60 transition-colors"
            title="Thu nhỏ bản đồ"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setZoomLevel(1); setSelectedPlanet(null); }}
            className="p-1.5 rounded-lg text-amber-900 dark:text-amber-200 hover:bg-amber-200/60 dark:hover:bg-amber-900/60 transition-colors"
            title="Đặt lại zoom gốc"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="w-full max-w-[580px] overflow-auto flex items-center justify-center py-2 custom-scrollbar">
        <div style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.2s ease-out' }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="select-none drop-shadow-md">
            
            {/* Background Base Circles */}
            <circle cx={center} cy={center} r={outerRadius} fill="#4A0B10" stroke="#D4AF37" strokeWidth="3" />
            <circle cx={center} cy={center} r={zodiacOuter} fill="#7A131B" stroke="#D4AF37" strokeWidth="2" />
            <circle cx={center} cy={center} r={zodiacInner} fill="#FFFDF7" className="dark:fill-[#1A0B0E]" stroke="#D4AF37" strokeWidth="2" />
            <circle cx={center} cy={center} r={houseInner} fill="#FFF9EA" className="dark:fill-[#12070A]" stroke="#7A131B" strokeWidth="1.5" />

            {/* 12 Zodiac Sign Sector Segments & Glyphs */}
            {ZODIAC_SIGNS.map((z, idx) => {
              const startDeg = idx * 30;
              const endDeg = (idx + 1) * 30;
              const midDeg = startDeg + 15;

              const pStartOuter = getXY(startDeg, zodiacOuter);
              const pStartInner = getXY(startDeg, zodiacInner);

              const pText = getXY(midDeg, (zodiacOuter + zodiacInner) / 2);

              // SVG Arc path for Zodiac Sign Sector Background
              const radStart = getAngleRad(startDeg);
              const radEnd = getAngleRad(endDeg);
              const x1 = center + zodiacOuter * Math.cos(radStart);
              const y1 = center + zodiacOuter * Math.sin(radStart);
              const x2 = center + zodiacOuter * Math.cos(radEnd);
              const y2 = center + zodiacOuter * Math.sin(radEnd);
              const x3 = center + zodiacInner * Math.cos(radEnd);
              const y3 = center + zodiacInner * Math.sin(radEnd);
              const x4 = center + zodiacInner * Math.cos(radStart);
              const y4 = center + zodiacInner * Math.sin(radStart);

              const arcPath = `M ${x1} ${y1} A ${zodiacOuter} ${zodiacOuter} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${zodiacInner} ${zodiacInner} 0 0 0 ${x4} ${y4} Z`;

              return (
                <g key={z.sign}>
                  {/* Colored Zodiac Arc Sector */}
                  <path d={arcPath} fill={getElementColor(z.element)} stroke="#D4AF37" strokeWidth="1" opacity="0.9" />

                  {/* Divider Line */}
                  <line x1={pStartInner.x} y1={pStartInner.y} x2={pStartOuter.x} y2={pStartOuter.y} stroke="#D4AF37" strokeWidth="1.5" />

                  {/* Zodiac Symbol Text */}
                  <text
                    x={pText.x}
                    y={pText.y}
                    fill="#F3E5AB"
                    fontSize="17"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {z.symbol}
                  </text>
                </g>
              );
            })}

            {/* 12 House Cusps & Lines */}
            {houses.map((h) => {
              const pStart = getXY(h.totalDegree, houseInner);
              const pEnd = getXY(h.totalDegree, zodiacInner);

              // House number text position
              const midHouseDeg = h.totalDegree + 15;
              const labelPos = getXY(midHouseDeg, houseInner + 18);

              const isAngleCusp = h.houseNumber === 1 || h.houseNumber === 4 || h.houseNumber === 7 || h.houseNumber === 10;

              return (
                <g key={`house_${h.houseNumber}`}>
                  {/* House Line from inner circle to zodiac ring */}
                  <line 
                    x1={pStart.x} 
                    y1={pStart.y} 
                    x2={pEnd.x} 
                    y2={pEnd.y} 
                    stroke={isAngleCusp ? '#D4AF37' : '#92400E'} 
                    strokeWidth={isAngleCusp ? '2.5' : '1'} 
                    strokeDasharray={isAngleCusp ? 'none' : '3,3'}
                    opacity={isAngleCusp ? '1' : '0.7'}
                  />

                  {/* House Number Badge */}
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    fill="#7A131B"
                    className="dark:fill-oriental-gold-400"
                    fontSize="11"
                    fontWeight="extrabold"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {h.houseNumber}
                  </text>
                </g>
              );
            })}

            {/* Aspect Lines inside Center Circle */}
            {aspects.map((asp, idx) => {
              const p1 = planets.find(p => p.name === asp.planet1);
              const p2 = planets.find(p => p.name === asp.planet2);
              if (!p1 || !p2) return null;

              const pos1 = getXY(p1.totalDegree, houseInner - 2);
              const pos2 = getXY(p2.totalDegree, houseInner - 2);

              let strokeColor = '#10B981'; // Emerald for Trine/Sextile
              if (asp.aspectType === 'Square' || asp.aspectType === 'Opposition') strokeColor = '#EF4444'; // Red
              if (asp.aspectType === 'Conjunction') strokeColor = '#F59E0B'; // Gold

              return (
                <line
                  key={`asp_${idx}`}
                  x1={pos1.x}
                  y1={pos1.y}
                  x2={pos2.x}
                  y2={pos2.y}
                  stroke={strokeColor}
                  strokeWidth={asp.aspectType === 'Conjunction' ? '2' : '1.2'}
                  strokeOpacity="0.75"
                />
              );
            })}

            {/* Planets Badges & Glyphs */}
            {planets.map((p) => {
              const radius = planetStaggeredRadius[p.key] || (zodiacInner + houseInner) / 2;
              const pos = getXY(p.totalDegree, radius);
              const isSelected = selectedPlanet?.key === p.key;

              return (
                <g
                  key={p.key}
                  className="cursor-pointer transition-transform hover:scale-125"
                  onClick={() => setSelectedPlanet(p)}
                >
                  {/* Planet Outer Circle */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="13"
                    fill={isSelected ? '#D4AF37' : '#7A131B'}
                    stroke={isSelected ? '#7A131B' : '#D4AF37'}
                    strokeWidth="1.8"
                  />
                  {/* Planet Symbol */}
                  <text
                    x={pos.x}
                    y={pos.y}
                    fill={isSelected ? '#7A131B' : '#F3E5AB'}
                    fontSize="12"
                    fontWeight="black"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {p.symbol}
                  </text>

                  {/* Retrograde Marker */}
                  {p.isRetrograde && (
                    <text
                      x={pos.x + 9}
                      y={pos.y - 9}
                      fill="#EF4444"
                      fontSize="9"
                      fontWeight="extrabold"
                    >
                      R
                    </text>
                  )}
                </g>
              );
            })}

            {/* Major Angle Labels: ASC, DSC, MC, IC */}
            {(() => {
              const pAsc = getXY(ascendant.totalDegree, zodiacOuter + 14);
              const pDsc = getXY((ascendant.totalDegree + 180) % 360, zodiacOuter + 14);
              const pMc = getXY(chartData.angles.midheaven.totalDegree, zodiacOuter + 14);
              const pIc = getXY((chartData.angles.midheaven.totalDegree + 180) % 360, zodiacOuter + 14);

              return (
                <g>
                  {/* ASC Line & Label */}
                  <text x={pAsc.x} y={pAsc.y} fill="#EF4444" fontSize="12" fontWeight="extrabold" textAnchor="middle" dominantBaseline="central">
                    ASC
                  </text>
                  {/* DSC Line & Label */}
                  <text x={pDsc.x} y={pDsc.y} fill="#3B82F6" fontSize="12" fontWeight="extrabold" textAnchor="middle" dominantBaseline="central">
                    DSC
                  </text>
                  {/* MC Line & Label */}
                  <text x={pMc.x} y={pMc.y} fill="#F59E0B" fontSize="12" fontWeight="extrabold" textAnchor="middle" dominantBaseline="central">
                    MC
                  </text>
                  {/* IC Line & Label */}
                  <text x={pIc.x} y={pIc.y} fill="#8B5CF6" fontSize="12" fontWeight="extrabold" textAnchor="middle" dominantBaseline="central">
                    IC
                  </text>
                </g>
              );
            })()}

          </svg>
        </div>
      </div>

      {/* Aspects Color Legend */}
      <div className="w-full flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-amber-200/60 dark:border-oriental-dark-border text-[11px] font-semibold text-slate-700 dark:text-amber-200">
        <span className="flex items-center gap-1">
          <span className="w-3 h-1 bg-emerald-500 rounded-full inline-block" /> Trine / Sextile (Hài Hòa)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-1 bg-rose-500 rounded-full inline-block" /> Square / Opposition (Thách Thức)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-1 bg-amber-500 rounded-full inline-block" /> Conjunction (Hợp Nhất)
        </span>
      </div>

      {/* Selected Planet Tooltip Banner */}
      {selectedPlanet && (
        <div className="mt-3 w-full bg-gradient-to-r from-amber-100 via-amber-50 to-amber-200 dark:from-oriental-dark-card dark:to-amber-950 p-3.5 rounded-2xl border-2 border-oriental-gold-500/60 flex items-center justify-between text-xs shadow-md animate-in fade-in">
          <div className="flex items-center space-x-3">
            <span className="w-9 h-9 rounded-xl bg-oriental-red-900 text-oriental-gold-300 flex items-center justify-center font-bold text-lg shadow-md shrink-0 border border-oriental-gold-400">
              {selectedPlanet.symbol}
            </span>
            <div>
              <div className="font-extrabold text-oriental-red-950 dark:text-oriental-gold-300 text-sm">
                {selectedPlanet.name} ({selectedPlanet.signSymbol} {selectedPlanet.sign} {selectedPlanet.degree}°{selectedPlanet.minute}')
              </div>
              <div className="text-[11px] text-amber-900/80 dark:text-amber-200/80 mt-0.5">
                Nằm ở Nhà thứ <strong>{selectedPlanet.house}</strong> {selectedPlanet.isRetrograde ? '• [Nghịch Hành ☌]' : '• [Thuận Hành ➔]'}
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedPlanet(null)}
            className="px-2.5 py-1 rounded-xl bg-oriental-red-800 text-oriental-gold-300 font-bold text-xs shadow-sm hover:brightness-110 shrink-0 ml-2"
          >
            Đóng ✕
          </button>
        </div>
      )}

    </div>
  );
};
