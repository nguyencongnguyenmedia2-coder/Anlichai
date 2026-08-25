import { BirthProfile, AstrologyInterpretation } from '../types/astrology';

const STORAGE_KEYS = {
  PROFILES: 'anlich_astrology_profiles_v1',
  DEFAULT_PROFILE: 'anlich_astrology_default_profile_id',
  AI_CACHE: 'anlich_astrology_ai_cache_v1',
};

export class AstrologyStorageService {
  // Get all saved birth profiles
  public getProfiles(): BirthProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  // Save a profile
  public saveProfile(profile: BirthProfile): BirthProfile {
    const profiles = this.getProfiles();
    const existingIndex = profiles.findIndex(p => p.id === profile.id);

    if (existingIndex >= 0) {
      profiles[existingIndex] = profile;
    } else {
      profiles.unshift(profile);
    }

    // Set default if first profile
    if (profiles.length === 1 || profile.isDefault) {
      profiles.forEach(p => p.isDefault = (p.id === profile.id));
      localStorage.setItem(STORAGE_KEYS.DEFAULT_PROFILE, profile.id);
    }

    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    return profile;
  }

  // Delete a profile
  public deleteProfile(id: string): void {
    let profiles = this.getProfiles();
    profiles = profiles.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
  }

  // Get Default Profile
  public getDefaultProfile(): BirthProfile | null {
    const profiles = this.getProfiles();
    if (profiles.length === 0) return null;
    const defaultId = localStorage.getItem(STORAGE_KEYS.DEFAULT_PROFILE);
    const found = profiles.find(p => p.id === defaultId);
    return found || profiles[0];
  }

  // Generate unique Hash key for chart interpretation caching
  public generateChartHash(profile: BirthProfile, houseSystem: string): string {
    return `${profile.fullName}_${profile.birthDate}_${profile.birthTime}_${profile.unknownTime}_${profile.latitude.toFixed(2)}_${profile.longitude.toFixed(2)}_${houseSystem}`;
  }

  // Get cached AI interpretation
  public getCachedAIInterpretation(chartHash: string): AstrologyInterpretation | null {
    try {
      const cacheData = localStorage.getItem(STORAGE_KEYS.AI_CACHE);
      if (!cacheData) return null;
      const cacheMap = JSON.parse(cacheData);
      return cacheMap[chartHash] || null;
    } catch {
      return null;
    }
  }

  // Save AI interpretation to cache
  public cacheAIInterpretation(chartHash: string, interpretation: AstrologyInterpretation): void {
    try {
      const cacheData = localStorage.getItem(STORAGE_KEYS.AI_CACHE);
      const cacheMap = cacheData ? JSON.parse(cacheData) : {};
      cacheMap[chartHash] = interpretation;
      localStorage.setItem(STORAGE_KEYS.AI_CACHE, JSON.stringify(cacheMap));
    } catch (e) {
      console.warn('Failed to cache AI astrology interpretation', e);
    }
  }
}

export const astrologyStorageService = new AstrologyStorageService();
