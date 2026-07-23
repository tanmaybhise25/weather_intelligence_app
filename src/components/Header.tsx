import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Compass, Star, X, Loader2, Sparkles, Navigation } from 'lucide-react';
import { GeocodingResult, LocationInfo, TemperatureUnit, SpeedUnit } from '../types/weather';
import { searchCities } from '../services/openMeteo';

interface HeaderProps {
  currentLocation: LocationInfo | null;
  onSelectLocation: (loc: LocationInfo) => void;
  tempUnit: TemperatureUnit;
  onToggleTempUnit: (unit: TemperatureUnit) => void;
  speedUnit: SpeedUnit;
  onToggleSpeedUnit: (unit: SpeedUnit) => void;
  favorites: LocationInfo[];
  onToggleFavorite: (loc: LocationInfo) => void;
  isFavorite: boolean;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
}

const DEFAULT_POPULAR_CITIES: LocationInfo[] = [
  { name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503, country_code: 'JP' },
  { name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, country_code: 'GB' },
  { name: 'New York', country: 'United States', admin1: 'New York', latitude: 40.7128, longitude: -74.0060, country_code: 'US' },
  { name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522, country_code: 'FR' },
  { name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093, country_code: 'AU' },
  { name: 'Mumbai', country: 'India', latitude: 19.0760, longitude: 72.8777, country_code: 'IN' }
];

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  onSelectLocation,
  tempUnit,
  onToggleTempUnit,
  speedUnit,
  onToggleSpeedUnit,
  favorites,
  onToggleFavorite,
  isFavorite,
  onUseCurrentLocation,
  isLocating
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const cityResults = await searchCities(query);
        setResults(cityResults);
        setIsOpen(true);
      } catch (err) {
        console.error('Error fetching geocoding results:', err);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCity = (item: GeocodingResult) => {
    const loc: LocationInfo = {
      name: item.name,
      country: item.country,
      admin1: item.admin1,
      latitude: item.latitude,
      longitude: item.longitude,
      country_code: item.country_code
    };
    onSelectLocation(loc);
    setQuery('');
    setIsOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      handleSelectCity(results[0]);
    } else if (query.trim()) {
      // Trigger search with literal name if needed
      onSelectLocation({
        name: query.trim(),
        latitude: 0,
        longitude: 0
      });
      setIsOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Current Location Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div id="weather-logo" className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Compass className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  Weather Intelligence
                </h1>
                {currentLocation && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                    <MapPin className="h-3 w-3 text-sky-500" />
                    <span>{currentLocation.name}{currentLocation.country ? `, ${currentLocation.country}` : ''}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                id="mobile-unit-celsius-btn"
                onClick={() => onToggleTempUnit(tempUnit === 'celsius' ? 'fahrenheit' : 'celsius')}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              >
                °{tempUnit === 'celsius' ? 'C' : 'F'}
              </button>
            </div>
          </div>

          {/* Search Bar & Auto-complete */}
          <div className="flex-1 max-w-xl relative" ref={dropdownRef}>
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                id="city-search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => results.length > 0 && setIsOpen(true)}
                placeholder="Search city, region, or country (e.g. Tokyo, Munich, Sydney)..."
                className="w-full pl-10 pr-24 py-2.5 text-sm bg-slate-100/90 dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl border border-slate-200/80 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-xs"
              />
              
              <div className="absolute right-2 flex items-center gap-1">
                {query && (
                  <button
                    id="clear-search-btn"
                    type="button"
                    onClick={() => { setQuery(''); setResults([]); }}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                {isSearching ? (
                  <Loader2 className="h-4 w-4 text-sky-500 animate-spin mr-1" />
                ) : (
                  <button
                    id="current-location-btn"
                    type="button"
                    onClick={onUseCurrentLocation}
                    disabled={isLocating}
                    title="Use Current Location"
                    className="p-1.5 text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
                  >
                    <Navigation className={`h-4 w-4 ${isLocating ? 'animate-spin text-sky-500' : ''}`} />
                  </button>
                )}
              </div>
            </form>

            {/* Dropdown Suggestions */}
            {isOpen && results.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 max-h-80 overflow-y-auto z-50 divide-y divide-slate-100 dark:divide-slate-700/50">
                {results.map((item) => (
                  <button
                    key={`${item.id}-${item.latitude}-${item.longitude}`}
                    onClick={() => handleSelectCity(item)}
                    className="w-full px-4 py-3 text-left hover:bg-sky-50/80 dark:hover:bg-slate-700/60 flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700/50 text-slate-500 group-hover:text-sky-600 group-hover:bg-sky-100/60 dark:group-hover:bg-sky-900/40 transition-colors">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-slate-900 dark:text-white">
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {[item.admin1, item.country].filter(Boolean).join(', ')}
                        </div>
                      </div>
                    </div>
                    {item.country_code && (
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {item.country_code}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Controls: Unit Toggles & Favorite Pin */}
          <div className="hidden md:flex items-center gap-3">
            {/* Favorite Pin Button */}
            {currentLocation && (
              <button
                id="toggle-favorite-city-btn"
                onClick={() => onToggleFavorite(currentLocation)}
                className={`p-2 rounded-xl border text-sm font-medium flex items-center gap-1.5 transition-all ${
                  isFavorite
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-amber-500'
                }`}
                title={isFavorite ? 'Saved to Favorites' : 'Save City to Favorites'}
              >
                <Star className={`h-4 w-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span className="text-xs">{isFavorite ? 'Saved' : 'Save'}</span>
              </button>
            )}

            {/* Temperature Unit Toggle */}
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
              <button
                id="unit-celsius-btn"
                onClick={() => onToggleTempUnit('celsius')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  tempUnit === 'celsius'
                    ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                °C
              </button>
              <button
                id="unit-fahrenheit-btn"
                onClick={() => onToggleTempUnit('fahrenheit')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  tempUnit === 'fahrenheit'
                    ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                °F
              </button>
            </div>

            {/* Speed Unit Toggle */}
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
              <button
                id="unit-kmh-btn"
                onClick={() => onToggleSpeedUnit('kmh')}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  speedUnit === 'kmh'
                    ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                km/h
              </button>
              <button
                id="unit-mph-btn"
                onClick={() => onToggleSpeedUnit('mph')}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  speedUnit === 'mph'
                    ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                mph
              </button>
            </div>
          </div>
        </div>

        {/* Quick Popular / Favorite Cities Chips */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-medium whitespace-nowrap flex items-center gap-1 mr-1">
            <Sparkles className="h-3 w-3 text-sky-500" /> Popular:
          </span>
          {DEFAULT_POPULAR_CITIES.map((city) => {
            const isSelected = currentLocation?.name.toLowerCase() === city.name.toLowerCase();
            return (
              <button
                key={city.name}
                id={`quick-city-${city.name.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => onSelectLocation(city)}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-sky-500 text-white border-sky-500 font-semibold shadow-xs'
                    : 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {city.name}
              </button>
            );
          })}

          {favorites.length > 0 && (
            <>
              <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1" />
              <span className="text-amber-500 font-medium whitespace-nowrap flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400" /> Saved:
              </span>
              {favorites.map((fav) => (
                <button
                  key={`fav-${fav.name}-${fav.latitude}`}
                  onClick={() => onSelectLocation(fav)}
                  className="px-3 py-1 rounded-full whitespace-nowrap transition-all bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50"
                >
                  {fav.name}
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </header>
  );
};
