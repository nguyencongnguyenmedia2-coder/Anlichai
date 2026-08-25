export type ZodiacSign = 
  | 'Aries' 
  | 'Taurus' 
  | 'Gemini' 
  | 'Cancer' 
  | 'Leo' 
  | 'Virgo' 
  | 'Libra' 
  | 'Scorpio' 
  | 'Sagittarius' 
  | 'Capricorn' 
  | 'Aquarius' 
  | 'Pisces';

export type ElementType = 'Fire' | 'Earth' | 'Air' | 'Water';
export type ModalityType = 'Cardinal' | 'Fixed' | 'Mutable';

export type AspectType = 
  | 'Conjunction' // 0°
  | 'Sextile'     // 60°
  | 'Square'      // 90°
  | 'Trine'       // 120°
  | 'Opposition'  // 180°
  | 'Quincunx';   // 150°

export type HouseSystem = 'Placidus' | 'Whole Sign' | 'Equal' | 'Koch';

export interface LocationCoords {
  name: string;
  country: string;
  lat: number;
  lng: number;
  timezone: string; // e.g. 'Asia/Ho_Chi_Minh'
}

export interface BirthProfile {
  id: string;
  fullName: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  unknownTime: boolean;
  locationName: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isDefault?: boolean;
  createdAt: number;
}

export interface PlanetPosition {
  key: string;
  name: string;
  symbol: string;
  sign: ZodiacSign;
  signSymbol: string;
  degree: number; // 0..29
  minute: number; // 0..59
  totalDegree: number; // 0..359.99
  house: number; // 1..12
  isRetrograde: boolean;
  speed: number;
}

export interface HouseCusp {
  houseNumber: number; // 1..12
  sign: ZodiacSign;
  signSymbol: string;
  degree: number;
  minute: number;
  totalDegree: number;
  ruler: string;
  planetsInside: string[];
}

export interface Aspect {
  planet1: string;
  planet1Symbol: string;
  planet2: string;
  planet2Symbol: string;
  aspectType: AspectType;
  aspectSymbol: string;
  targetAngle: number;
  actualAngle: number;
  orbDegree: number;
  orbMinute: number;
  isHarmonious: boolean;
}

export interface ElementDistribution {
  fire: { count: number; percentage: number; planets: string[] };
  earth: { count: number; percentage: number; planets: string[] };
  air: { count: number; percentage: number; planets: string[] };
  water: { count: number; percentage: number; planets: string[] };
}

export interface ModalityDistribution {
  cardinal: { count: number; percentage: number; planets: string[] };
  fixed: { count: number; percentage: number; planets: string[] };
  mutable: { count: number; percentage: number; planets: string[] };
}

export interface AnglesData {
  ascendant: { sign: ZodiacSign; degree: number; minute: number; totalDegree: number };
  descendant: { sign: ZodiacSign; degree: number; minute: number; totalDegree: number };
  midheaven: { sign: ZodiacSign; degree: number; minute: number; totalDegree: number };
  imumCoeli: { sign: ZodiacSign; degree: number; minute: number; totalDegree: number };
}

export interface NatalChartData {
  profile: BirthProfile;
  calculatedAt: number;
  houseSystem: HouseSystem;
  sun: PlanetPosition;
  moon: PlanetPosition;
  ascendant: AnglesData['ascendant'];
  angles: AnglesData;
  planets: PlanetPosition[];
  houses: HouseCusp[];
  aspects: Aspect[];
  elements: ElementDistribution;
  modalities: ModalityDistribution;
  northNode: PlanetPosition;
  southNode: PlanetPosition;
  chiron: PlanetPosition;
  rulingPlanet: { name: string; symbol: string; sign: ZodiacSign; house: number };
  stelliums: { type: 'sign' | 'house'; name: string; count: number; planets: string[] }[];
}

export interface AstrologyInterpretation {
  overview: string;
  personality: string;
  loveAndRelationships: string;
  careerAndAmbition: string;
  communicationStyle: string;
  personalGrowth: string;
  keyStrengths: string[];
  keyNoticePoints: string[];
  disclaimer: string;
}

export interface TransitAspect {
  transitPlanet: string;
  transitSymbol: string;
  natalPlanet: string;
  natalSymbol: string;
  aspectType: AspectType;
  aspectSymbol: string;
  orb: string;
  meaning: string;
}
