import React, { useState } from 'react';
import { Sparkles, MapPin, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { BirthProfile, HouseSystem } from '../../types/astrology';
import { ALL_LOCATIONS } from '../../data/geocodingData';

interface BirthProfileFormProps {
  onCalculate: (profile: BirthProfile, houseSystem: HouseSystem) => void;
  initialProfile?: BirthProfile | null;
}

export const BirthProfileForm: React.FC<BirthProfileFormProps> = ({ onCalculate, initialProfile }) => {
  const [fullName, setFullName] = useState<string>(initialProfile?.fullName || 'Nguyễn Văn A');
  const [birthDate, setBirthDate] = useState<string>(initialProfile?.birthDate || '2001-04-07');
  const [birthTime, setBirthTime] = useState<string>(initialProfile?.birthTime || '14:30');
  const [unknownTime, setUnknownTime] = useState<boolean>(initialProfile?.unknownTime || false);
  const [selectedLocation, setSelectedLocation] = useState<string>(initialProfile?.locationName || 'Quảng Ngãi');
  const [houseSystem, setHouseSystem] = useState<HouseSystem>('Placidus');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredLocations = ALL_LOCATIONS.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const loc = ALL_LOCATIONS.find(l => l.name === selectedLocation) || ALL_LOCATIONS[0];

    const profile: BirthProfile = {
      id: initialProfile?.id || 'profile_' + Date.now(),
      fullName: fullName.trim() || 'Người dùng',
      birthDate,
      birthTime: unknownTime ? '12:00' : birthTime,
      unknownTime,
      locationName: loc.name,
      country: loc.country,
      latitude: loc.lat,
      longitude: loc.lng,
      timezone: loc.timezone,
      createdAt: initialProfile?.createdAt || Date.now(),
    };

    onCalculate(profile, houseSystem);
  };

  return (
    <div className="bg-white/95 dark:bg-oriental-dark-card/95 rounded-3xl p-5 sm:p-8 border-2 border-amber-200/90 dark:border-oriental-dark-border shadow-2xl backdrop-blur-md">
      
      <div className="text-center max-w-xl mx-auto mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-oriental-red-800 to-oriental-red-950 text-oriental-gold-300 flex items-center justify-center font-extrabold text-2xl mx-auto mb-2 shadow-oriental border border-oriental-gold-400">
          🔮
        </div>
        <h2 className="text-xl sm:text-2xl font-serif font-black text-oriental-red-900 dark:text-oriental-gold-400 tracking-wide">
          THÔNG TIN SINH CỦA BẠN
        </h2>
        <p className="text-xs sm:text-sm text-amber-900/80 dark:text-amber-200/70 mt-1">
          Nhập chính xác ngày, giờ và nơi sinh để máy tính thiên văn lập bản đồ sao cá nhân.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
        
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-amber-200 mb-1">
            Họ và tên quý gia chủ:
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ví dụ: Nguyễn Văn A"
            className="w-full px-4 py-2.5 rounded-xl border border-amber-300 dark:border-oriental-dark-border bg-amber-50/50 dark:bg-oriental-dark-bg text-slate-800 dark:text-amber-100 font-semibold text-sm focus:ring-2 focus:ring-oriental-gold-500 focus:outline-none"
          />
        </div>

        {/* Date & Time Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Birth Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-amber-200 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-oriental-gold-600" />
              <span>Ngày tháng năm sinh:</span>
            </label>
            <input
              type="date"
              required
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-amber-300 dark:border-oriental-dark-border bg-amber-50/50 dark:bg-oriental-dark-bg text-slate-800 dark:text-amber-100 font-semibold text-sm focus:ring-2 focus:ring-oriental-gold-500 focus:outline-none"
            />
          </div>

          {/* Birth Time */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-amber-200 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-oriental-gold-600" />
                <span>Giờ sinh (Giờ : Phút):</span>
              </span>
            </label>
            <input
              type="time"
              disabled={unknownTime}
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border border-amber-300 dark:border-oriental-dark-border bg-amber-50/50 dark:bg-oriental-dark-bg text-slate-800 dark:text-amber-100 font-semibold text-sm focus:ring-2 focus:ring-oriental-gold-500 focus:outline-none ${
                unknownTime ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            />
          </div>
        </div>

        {/* Unknown Birth Time Checkbox */}
        <div className="flex items-center space-x-2 bg-amber-100/60 dark:bg-oriental-dark-bg p-3 rounded-xl border border-amber-200/80 dark:border-oriental-dark-border">
          <input
            type="checkbox"
            id="unknownTimeToggle"
            checked={unknownTime}
            onChange={(e) => setUnknownTime(e.target.checked)}
            className="w-4 h-4 text-oriental-red-800 rounded-xs focus:ring-oriental-gold-500"
          />
          <label htmlFor="unknownTimeToggle" className="text-xs font-bold text-amber-950 dark:text-amber-200 cursor-pointer">
            Tôi không biết chính xác giờ sinh
          </label>
        </div>

        {unknownTime && (
          <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-400/50 text-amber-900 dark:text-amber-300 text-xs flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Bạn chưa cung cấp giờ sinh chính xác, do đó Cung Mọc (Ascendant) và vị trí 12 Nhà có thể không hoàn toàn chính xác. Hệ thống sẽ tính toán vị trí các hành tinh vào giữa ngày (12:00).
            </p>
          </div>
        )}

        {/* Location Picker */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-amber-200 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-oriental-gold-600" />
            <span>Nơi sinh (Tỉnh/Thành phố/Quốc gia):</span>
          </label>

          <input
            type="text"
            placeholder="Tìm nhanh tỉnh/thành phố..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-1.5 mb-2 rounded-lg border border-amber-200 dark:border-oriental-dark-border text-xs bg-white dark:bg-oriental-dark-card"
          />

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-amber-300 dark:border-oriental-dark-border bg-amber-50/50 dark:bg-oriental-dark-bg text-slate-800 dark:text-amber-100 font-semibold text-sm focus:ring-2 focus:ring-oriental-gold-500 focus:outline-none"
          >
            {filteredLocations.map((loc) => (
              <option key={loc.name} value={loc.name}>
                {loc.name} ({loc.country}) - [Lat: {loc.lat.toFixed(2)}, Lng: {loc.lng.toFixed(2)}]
              </option>
            ))}
          </select>
        </div>

        {/* House System Choice */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-amber-200 mb-1">
            Hệ thống nhà (House System):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['Placidus', 'Whole Sign', 'Equal', 'Koch'] as HouseSystem[]).map((hs) => (
              <button
                type="button"
                key={hs}
                onClick={() => setHouseSystem(hs)}
                className={`py-2 px-3 rounded-xl font-bold text-xs transition-all border ${
                  houseSystem === hs
                    ? 'bg-oriental-red-800 text-oriental-gold-300 border-oriental-gold-400 shadow-oriental'
                    : 'bg-amber-100/70 dark:bg-oriental-dark-bg text-slate-700 dark:text-amber-200 border-amber-300/60'
                }`}
              >
                {hs}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Action Button */}
        <button
          type="submit"
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-oriental-red-800 via-oriental-red-900 to-oriental-red-950 text-oriental-gold-300 font-serif font-black text-sm sm:text-base tracking-wide shadow-oriental hover:brightness-110 active:scale-98 transition-all border border-oriental-gold-400/50 flex items-center justify-center space-x-2 cursor-pointer mt-4"
        >
          <Sparkles className="w-5 h-5 text-oriental-gold-400" />
          <span>✨ TẠO BẢN ĐỒ SAO CHIÊM TINH</span>
        </button>

      </form>

    </div>
  );
};
