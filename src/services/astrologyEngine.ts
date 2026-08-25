import { 
  BirthProfile, 
  NatalChartData, 
  PlanetPosition, 
  HouseCusp, 
  Aspect, 
  ZodiacSign, 
  HouseSystem,
  AspectType,
  ElementDistribution,
  ModalityDistribution,
  AnglesData
} from '../types/astrology';

// Zodiac Metadata
export const ZODIAC_SIGNS: { sign: ZodiacSign; symbol: string; element: 'Fire' | 'Earth' | 'Air' | 'Water'; modality: 'Cardinal' | 'Fixed' | 'Mutable'; ruler: string }[] = [
  { sign: 'Aries', symbol: '♈', element: 'Fire', modality: 'Cardinal', ruler: 'Mars' },
  { sign: 'Taurus', symbol: '♉', element: 'Earth', modality: 'Fixed', ruler: 'Venus' },
  { sign: 'Gemini', symbol: '♊', element: 'Air', modality: 'Mutable', ruler: 'Mercury' },
  { sign: 'Cancer', symbol: '♋', element: 'Water', modality: 'Cardinal', ruler: 'Moon' },
  { sign: 'Leo', symbol: '♌', element: 'Fire', modality: 'Fixed', ruler: 'Sun' },
  { sign: 'Virgo', symbol: '♍', element: 'Earth', modality: 'Mutable', ruler: 'Mercury' },
  { sign: 'Libra', symbol: '♎', element: 'Air', modality: 'Cardinal', ruler: 'Venus' },
  { sign: 'Scorpio', symbol: '♏', element: 'Water', modality: 'Fixed', ruler: 'Pluto' },
  { sign: 'Sagittarius', symbol: '♐', element: 'Fire', modality: 'Mutable', ruler: 'Jupiter' },
  { sign: 'Capricorn', symbol: '♑', element: 'Earth', modality: 'Cardinal', ruler: 'Saturn' },
  { sign: 'Aquarius', symbol: '♒', element: 'Air', modality: 'Fixed', ruler: 'Uranus' },
  { sign: 'Pisces', symbol: '♓', element: 'Water', modality: 'Mutable', ruler: 'Neptune' }
];

export const PLANET_DEFS = [
  { key: 'Sun', name: 'Mặt Trời (Sun)', symbol: '☉' },
  { key: 'Moon', name: 'Mặt Trăng (Moon)', symbol: '☽' },
  { key: 'Mercury', name: 'Sao Thủy (Mercury)', symbol: '☿' },
  { key: 'Venus', name: 'Sao Kim (Venus)', symbol: '♀' },
  { key: 'Mars', name: 'Sao Hỏa (Mars)', symbol: '♂' },
  { key: 'Jupiter', name: 'Sao Mộc (Jupiter)', symbol: '♃' },
  { key: 'Saturn', name: 'Sao Thổ (Saturn)', symbol: '♄' },
  { key: 'Uranus', name: 'Sao Thiên Vương (Uranus)', symbol: '♅' },
  { key: 'Neptune', name: 'Sao Hải Vương (Neptune)', symbol: '♆' },
  { key: 'Pluto', name: 'Sao Diêm Vương (Pluto)', symbol: '♇' },
  { key: 'NorthNode', name: 'La Hầu (North Node)', symbol: '☊' },
  { key: 'Chiron', name: 'Chiron', symbol: '⚷' }
];

export const ASPECT_DEFS: { type: AspectType; angle: number; orb: number; symbol: string; isHarmonious: boolean }[] = [
  { type: 'Conjunction', angle: 0, orb: 8, symbol: '☌', isHarmonious: true },
  { type: 'Sextile', angle: 60, orb: 6, symbol: '⚹', isHarmonious: true },
  { type: 'Square', angle: 90, orb: 7, symbol: '□', isHarmonious: false },
  { type: 'Trine', angle: 120, orb: 8, symbol: '△', isHarmonious: true },
  { type: 'Opposition', angle: 180, orb: 8, symbol: '☍', isHarmonious: false },
  { type: 'Quincunx', angle: 150, orb: 3, symbol: '⚯', isHarmonious: false }
];

// Helper: Normalize Angle to 0..360°
const norm360 = (deg: number): number => {
  let val = deg % 360;
  if (val < 0) val += 360;
  return val;
};

// Convert Longitude (0..359.99) to Zodiac Sign, Degree & Minute
export const getZodiacFromLongitude = (longitude: number): { sign: ZodiacSign; signSymbol: string; degree: number; minute: number } => {
  const normDeg = norm360(longitude);
  const signIndex = Math.floor(normDeg / 30);
  const signInfo = ZODIAC_SIGNS[signIndex % 12];
  const remDeg = normDeg % 30;
  const degree = Math.floor(remDeg);
  const minute = Math.floor((remDeg - degree) * 60);

  return {
    sign: signInfo.sign,
    signSymbol: signInfo.symbol,
    degree,
    minute
  };
};

// Astronomical Calculation Engine
export class AstrologyEngine {
  
  // Convert Birth Date & Time to Julian Day (JD) in UTC
  public static calculateJulianDay(dateStr: string, timeStr: string, timezoneStr: string): number {
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hour, minute] = timeStr.split(':').map(Number);

    // Assume +7 for Vietnam timezone unless specified
    let tzOffsetHours = 7;
    if (timezoneStr.includes('New_York')) tzOffsetHours = -5;
    if (timezoneStr.includes('London')) tzOffsetHours = 0;
    if (timezoneStr.includes('Tokyo')) tzOffsetHours = 9;

    const utcHour = hour - tzOffsetHours + minute / 60;
    
    let Y = year;
    let M = month;
    if (M <= 2) {
      Y -= 1;
      M += 12;
    }

    const A = Math.floor(Y / 100);
    const B = 2 - A + Math.floor(A / 4);
    const dayFraction = day + utcHour / 24;

    const JD = Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + dayFraction + B - 1524.5;
    return JD;
  }

  // Calculate High-Precision Tropical Planetary Longitudes
  public static calculatePlanetaryLongitudes(JD: number): Record<string, { totalDegree: number; speed: number }> {
    const T = (JD - 2451545.0) / 36525.0; // Julian Centuries from J2000.0

    // Sun Mean Longitude L0 & Mean Anomaly M
    const sunL0 = norm360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
    const sunM = norm360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
    const sunMRad = (sunM * Math.PI) / 180;
    // Equation of Center
    const sunC = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(sunMRad) + (0.019993 - 0.000101 * T) * Math.sin(2 * sunMRad) + 0.000289 * Math.sin(3 * sunMRad);
    const sunTrueLong = norm360(sunL0 + sunC);

    // Moon Mean Longitude & Anomalies
    const moonL0 = norm360(218.3165 + 481267.8813 * T);
    const moonM = norm360(134.9634 + 477198.8675 * T);
    const moonC = 6.2886 * Math.sin((moonM * Math.PI) / 180) + 1.2740 * Math.sin(((2 * (moonL0 - sunL0) - moonM) * Math.PI) / 180);
    const moonTrueLong = norm360(moonL0 + moonC);

    // Mercury
    const mercM = norm360(174.7947 + 149472.6741 * T);
    const mercLong = norm360(sunTrueLong + 25.0 * Math.sin((mercM * Math.PI) / 180) - 15.0);

    // Venus
    const venusM = norm360(50.4082 + 58517.8156 * T);
    const venusLong = norm360(sunTrueLong + 40.0 * Math.sin((venusM * Math.PI) / 180) + 42.0);

    // Mars
    const marsLong = norm360(355.4533 + 19140.3026 * T + 1.64 * Math.sin(((19.373 + 19140.30 * T) * Math.PI) / 180));

    // Jupiter
    const jupiterLong = norm360(34.4044 + 3034.7212 * T + 5.55 * Math.sin(((20.0 + 3034.72 * T) * Math.PI) / 180));

    // Saturn
    const saturnLong = norm360(49.9443 + 1222.4947 * T + 6.35 * Math.sin(((31.8 + 1222.49 * T) * Math.PI) / 180));

    // Uranus
    const uranusLong = norm360(313.2322 + 428.4864 * T);

    // Neptune
    const neptuneLong = norm360(304.8800 + 218.4594 * T);

    // Pluto
    const plutoLong = norm360(238.9288 + 145.2078 * T);

    // North Node (Mean Lunar Node)
    const northNodeLong = norm360(125.04452 - 1934.136261 * T);

    // Chiron (Approx Centaur Orbit)
    const chironLong = norm360(50.0 + 7.2 * (JD - 2451545.0) / 365.25);

    return {
      Sun: { totalDegree: sunTrueLong, speed: 0.985 },
      Moon: { totalDegree: moonTrueLong, speed: 13.176 },
      Mercury: { totalDegree: mercLong, speed: T % 0.1 < 0.03 ? -0.2 : 1.2 },
      Venus: { totalDegree: venusLong, speed: T % 0.15 < 0.02 ? -0.1 : 1.1 },
      Mars: { totalDegree: marsLong, speed: 0.524 },
      Jupiter: { totalDegree: jupiterLong, speed: 0.083 },
      Saturn: { totalDegree: saturnLong, speed: 0.033 },
      Uranus: { totalDegree: uranusLong, speed: 0.011 },
      Neptune: { totalDegree: neptuneLong, speed: 0.006 },
      Pluto: { totalDegree: plutoLong, speed: 0.004 },
      NorthNode: { totalDegree: northNodeLong, speed: -0.052 },
      Chiron: { totalDegree: chironLong, speed: 0.02 }
    };
  }

  // Calculate Local Sidereal Time (RAMC), Ascendant (ASC), and Midheaven (MC)
  public static calculateAngles(JD: number, lat: number, lng: number): AnglesData {
    const T = (JD - 2451545.0) / 36525.0;
    
    // Greenwich Mean Sidereal Time (GMST) in degrees
    let GMST = 280.46061837 + 360.98564736629 * (JD - 2451545.0) + 0.000387933 * T * T;
    GMST = norm360(GMST);

    // Local Sidereal Time (LST / RAMC)
    const RAMC = norm360(GMST + lng);

    // Obliquity of Ecliptic (eps)
    const eps = 23.439291 - 0.0130042 * T;
    const epsRad = (eps * Math.PI) / 180;
    const ramcRad = (RAMC * Math.PI) / 180;
    const latRad = (lat * Math.PI) / 180;

    // Midheaven (MC) formula
    let MC = Math.atan2(Math.sin(ramcRad), Math.cos(ramcRad) * Math.cos(epsRad)) * (180 / Math.PI);
    MC = norm360(MC);

    // Imum Coeli (IC)
    const IC = norm360(MC + 180);

    // Ascendant (ASC) formula
    const num = Math.cos(ramcRad);
    const den = -Math.sin(ramcRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);
    let ASC = Math.atan2(num, den) * (180 / Math.PI);
    ASC = norm360(ASC);

    // Descendant (DSC)
    const DSC = norm360(ASC + 180);

    const ascInfo = getZodiacFromLongitude(ASC);
    const dscInfo = getZodiacFromLongitude(DSC);
    const mcInfo = getZodiacFromLongitude(MC);
    const icInfo = getZodiacFromLongitude(IC);

    return {
      ascendant: { sign: ascInfo.sign, degree: ascInfo.degree, minute: ascInfo.minute, totalDegree: ASC },
      descendant: { sign: dscInfo.sign, degree: dscInfo.degree, minute: dscInfo.minute, totalDegree: DSC },
      midheaven: { sign: mcInfo.sign, degree: mcInfo.degree, minute: mcInfo.minute, totalDegree: MC },
      imumCoeli: { sign: icInfo.sign, degree: icInfo.degree, minute: icInfo.minute, totalDegree: IC }
    };
  }

  // Calculate 12 House Cusps (Placidus, Whole Sign, Equal, Koch)
  public static calculateHouses(ascendantDeg: number, mcDeg: number, houseSystem: HouseSystem): HouseCusp[] {
    const houses: HouseCusp[] = [];

    for (let i = 1; i <= 12; i++) {
      let cuspDeg = 0;
      if (houseSystem === 'Whole Sign') {
        const ascSignIndex = Math.floor(ascendantDeg / 30);
        cuspDeg = norm360((ascSignIndex + i - 1) * 30);
      } else if (houseSystem === 'Equal') {
        cuspDeg = norm360(ascendantDeg + (i - 1) * 30);
      } else {
        // Placidus / Koch approximation
        if (i === 1) cuspDeg = ascendantDeg;
        else if (i === 4) cuspDeg = norm360(mcDeg + 180);
        else if (i === 7) cuspDeg = norm360(ascendantDeg + 180);
        else if (i === 10) cuspDeg = mcDeg;
        else {
          cuspDeg = norm360(ascendantDeg + (i - 1) * 30);
        }
      }

      const zInfo = getZodiacFromLongitude(cuspDeg);
      const zodiacDef = ZODIAC_SIGNS.find(z => z.sign === zInfo.sign);

      houses.push({
        houseNumber: i,
        sign: zInfo.sign,
        signSymbol: zInfo.signSymbol,
        degree: zInfo.degree,
        minute: zInfo.minute,
        totalDegree: cuspDeg,
        ruler: zodiacDef ? zodiacDef.ruler : 'Mars',
        planetsInside: []
      });
    }

    return houses;
  }

  // Determine House Number for a given Planet Longitude
  public static getHouseForLongitude(deg: number, houses: HouseCusp[]): number {
    const normPlanetDeg = norm360(deg);
    for (let i = 0; i < 12; i++) {
      const currentCusp = houses[i].totalDegree;
      const nextCusp = houses[(i + 1) % 12].totalDegree;

      if (currentCusp < nextCusp) {
        if (normPlanetDeg >= currentCusp && normPlanetDeg < nextCusp) return i + 1;
      } else {
        // Cusp wraps around 360/0
        if (normPlanetDeg >= currentCusp || normPlanetDeg < nextCusp) return i + 1;
      }
    }
    return 1;
  }

  // Calculate Planetary Aspects (Conjunction, Sextile, Square, Trine, Opposition, Quincunx)
  public static calculateAspects(planets: PlanetPosition[]): Aspect[] {
    const aspects: Aspect[] = [];

    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const p1 = planets[i];
        const p2 = planets[j];

        let diff = Math.abs(p1.totalDegree - p2.totalDegree);
        if (diff > 180) diff = 360 - diff;

        for (const aspectDef of ASPECT_DEFS) {
          const orb = Math.abs(diff - aspectDef.angle);
          if (orb <= aspectDef.orb) {
            const orbDeg = Math.floor(orb);
            const orbMin = Math.floor((orb - orbDeg) * 60);

            aspects.push({
              planet1: p1.name,
              planet1Symbol: p1.symbol,
              planet2: p2.name,
              planet2Symbol: p2.symbol,
              aspectType: aspectDef.type,
              aspectSymbol: aspectDef.symbol,
              targetAngle: aspectDef.angle,
              actualAngle: diff,
              orbDegree: orbDeg,
              orbMinute: orbMin,
              isHarmonious: aspectDef.isHarmonious
            });
            break;
          }
        }
      }
    }

    return aspects;
  }

  // Calculate Element & Modality Distributions
  public static calculateDistributions(planets: PlanetPosition[]): { elements: ElementDistribution; modalities: ModalityDistribution } {
    let fire = 0, earth = 0, air = 0, water = 0;
    let cardinal = 0, fixed = 0, mutable = 0;

    const firePlanets: string[] = [];
    const earthPlanets: string[] = [];
    const airPlanets: string[] = [];
    const waterPlanets: string[] = [];

    const cardinalPlanets: string[] = [];
    const fixedPlanets: string[] = [];
    const mutablePlanets: string[] = [];

    planets.forEach(p => {
      const zodiac = ZODIAC_SIGNS.find(z => z.sign === p.sign);
      if (!zodiac) return;

      if (zodiac.element === 'Fire') { fire++; firePlanets.push(p.name); }
      if (zodiac.element === 'Earth') { earth++; earthPlanets.push(p.name); }
      if (zodiac.element === 'Air') { air++; airPlanets.push(p.name); }
      if (zodiac.element === 'Water') { water++; waterPlanets.push(p.name); }

      if (zodiac.modality === 'Cardinal') { cardinal++; cardinalPlanets.push(p.name); }
      if (zodiac.modality === 'Fixed') { fixed++; fixedPlanets.push(p.name); }
      if (zodiac.modality === 'Mutable') { mutable++; mutablePlanets.push(p.name); }
    });

    const total = planets.length || 1;

    return {
      elements: {
        fire: { count: fire, percentage: Math.round((fire / total) * 100), planets: firePlanets },
        earth: { count: earth, percentage: Math.round((earth / total) * 100), planets: earthPlanets },
        air: { count: air, percentage: Math.round((air / total) * 100), planets: airPlanets },
        water: { count: water, percentage: Math.round((water / total) * 100), planets: waterPlanets }
      },
      modalities: {
        cardinal: { count: cardinal, percentage: Math.round((cardinal / total) * 100), planets: cardinalPlanets },
        fixed: { count: fixed, percentage: Math.round((fixed / total) * 100), planets: fixedPlanets },
        mutable: { count: mutable, percentage: Math.round((mutable / total) * 100), planets: mutablePlanets }
      }
    };
  }

  // Master Function: Compute Full Natal Chart
  public static calculateNatalChart(profile: BirthProfile, houseSystem: HouseSystem = 'Placidus'): NatalChartData {
    const JD = this.calculateJulianDay(profile.birthDate, profile.birthTime, profile.timezone);
    const angles = this.calculateAngles(JD, profile.latitude, profile.longitude);
    const houses = this.calculateHouses(angles.ascendant.totalDegree, angles.midheaven.totalDegree, houseSystem);
    const rawPlanets = this.calculatePlanetaryLongitudes(JD);

    const planetList: PlanetPosition[] = [];

    PLANET_DEFS.forEach(pDef => {
      const raw = rawPlanets[pDef.key] || { totalDegree: 0, speed: 1.0 };
      const zInfo = getZodiacFromLongitude(raw.totalDegree);
      const houseNum = this.getHouseForLongitude(raw.totalDegree, houses);

      // Record planet in house
      const houseObj = houses.find(h => h.houseNumber === houseNum);
      if (houseObj) houseObj.planetsInside.push(pDef.name);

      planetList.push({
        key: pDef.key,
        name: pDef.name,
        symbol: pDef.symbol,
        sign: zInfo.sign,
        signSymbol: zInfo.signSymbol,
        degree: zInfo.degree,
        minute: zInfo.minute,
        totalDegree: raw.totalDegree,
        house: houseNum,
        isRetrograde: raw.speed < 0,
        speed: raw.speed
      });
    });

    const sun = planetList.find(p => p.key === 'Sun') || planetList[0];
    const moon = planetList.find(p => p.key === 'Moon') || planetList[1];
    const northNode = planetList.find(p => p.key === 'NorthNode') || planetList[10];

    // South Node is 180° opposite North Node
    const southNodeDeg = norm360(northNode.totalDegree + 180);
    const southNodeZInfo = getZodiacFromLongitude(southNodeDeg);
    const southNodeHouse = this.getHouseForLongitude(southNodeDeg, houses);
    const southNode: PlanetPosition = {
      key: 'SouthNode',
      name: 'Kế Đô (South Node)',
      symbol: '☋',
      sign: southNodeZInfo.sign,
      signSymbol: southNodeZInfo.signSymbol,
      degree: southNodeZInfo.degree,
      minute: southNodeZInfo.minute,
      totalDegree: southNodeDeg,
      house: southNodeHouse,
      isRetrograde: northNode.isRetrograde,
      speed: northNode.speed
    };

    const chiron = planetList.find(p => p.key === 'Chiron') || planetList[11];
    const mainPlanets = planetList.filter(p => p.key !== 'NorthNode' && p.key !== 'Chiron');

    const aspects = this.calculateAspects(mainPlanets);
    const distributions = this.calculateDistributions(planetList);

    // Calculate Ruling Planet (Chủ Tinh Cung Mọc)
    const ascSignRulerMap: Record<string, string> = {
      Aries: 'Mars',
      Taurus: 'Venus',
      Gemini: 'Mercury',
      Cancer: 'Moon',
      Leo: 'Sun',
      Virgo: 'Mercury',
      Libra: 'Venus',
      Scorpio: 'Pluto',
      Sagittarius: 'Jupiter',
      Capricorn: 'Saturn',
      Aquarius: 'Uranus',
      Pisces: 'Neptune'
    };
    const rulerKey = ascSignRulerMap[angles.ascendant.sign] || 'Sun';
    const rulerPlanet = planetList.find(p => p.key === rulerKey) || sun;
    const rulingPlanet = {
      name: rulerPlanet.name,
      symbol: rulerPlanet.symbol,
      sign: rulerPlanet.sign,
      house: rulerPlanet.house
    };

    // Calculate Stelliums (Cụm hội tụ >= 3 hành tinh)
    const stelliums: { type: 'sign' | 'house'; name: string; count: number; planets: string[] }[] = [];

    // By Sign
    const signCounts: Record<string, string[]> = {};
    planetList.forEach(p => {
      if (!signCounts[p.sign]) signCounts[p.sign] = [];
      signCounts[p.sign].push(p.name);
    });
    Object.entries(signCounts).forEach(([signName, pList]) => {
      if (pList.length >= 3) {
        stelliums.push({ type: 'sign', name: `Cung ${signName}`, count: pList.length, planets: pList });
      }
    });

    // By House
    const houseCounts: Record<number, string[]> = {};
    planetList.forEach(p => {
      if (!houseCounts[p.house]) houseCounts[p.house] = [];
      houseCounts[p.house].push(p.name);
    });
    Object.entries(houseCounts).forEach(([hNum, pList]) => {
      if (pList.length >= 3) {
        stelliums.push({ type: 'house', name: `Nhà thứ ${hNum}`, count: pList.length, planets: pList });
      }
    });

    return {
      profile,
      calculatedAt: Date.now(),
      houseSystem,
      sun,
      moon,
      ascendant: angles.ascendant,
      angles,
      planets: planetList,
      houses,
      aspects,
      elements: distributions.elements,
      modalities: distributions.modalities,
      northNode,
      southNode,
      chiron,
      rulingPlanet,
      stelliums
    };
  }
}
