import React from 'react';
import { AlertCircle, Search, RefreshCw, Compass, MapPin } from 'lucide-react';
import { LocationInfo } from '../types/weather';

interface ErrorMessageProps {
  searchedCity?: string;
  errorMessage?: string;
  onRetry: () => void;
  onSelectPopularCity: (loc: LocationInfo) => void;
}

const POPULAR_SUGGESTIONS: LocationInfo[] = [
  { name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503, country_code: 'JP' },
  { name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, country_code: 'GB' },
  { name: 'New York', country: 'United States', admin1: 'New York', latitude: 40.7128, longitude: -74.0060, country_code: 'US' },
  { name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522, country_code: 'FR' },
  { name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093, country_code: 'AU' },
  { name: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198, country_code: 'SG' }
];

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  searchedCity,
  errorMessage,
  onRetry,
  onSelectPopularCity
}) => {
  return (
    <div id="error-message-card" className="max-w-xl mx-auto my-12 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center">
      
      <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/50 text-red-500 mx-auto flex items-center justify-center mb-5 border border-red-200 dark:border-red-900 shadow-2xs">
        <AlertCircle className="h-8 w-8" />
      </div>

      <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
        {searchedCity ? `City "${searchedCity}" Not Found` : 'Weather Data Unavailable'}
      </h2>

      <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
        {errorMessage || `We couldn't locate weather records for "${searchedCity}". Please verify the city spelling or try searching for a major city nearby.`}
      </p>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          id="retry-weather-btn"
          onClick={onRetry}
          className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold flex items-center gap-2 shadow-md shadow-sky-500/20 transition-all"
        >
          <RefreshCw className="h-4 w-4" /> Try Again
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-center gap-1.5">
          <Compass className="h-3.5 w-3.5 text-sky-500" /> Explore Major Cities
        </p>

        <div className="flex flex-wrap justify-center gap-2">
          {POPULAR_SUGGESTIONS.map((city) => (
            <button
              key={`err-suggest-${city.name}`}
              onClick={() => onSelectPopularCity(city)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-sky-100 dark:hover:bg-sky-950/60 hover:text-sky-600 dark:hover:text-sky-400 transition-colors flex items-center gap-1"
            >
              <MapPin className="h-3 w-3 text-sky-500" />
              {city.name}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
