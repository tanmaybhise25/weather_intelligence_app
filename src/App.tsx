import React, { useState, useEffect, useCallback } from 'react';
import {
  ForecastResponse,
  LocationInfo,
  TemperatureUnit,
  SpeedUnit
} from './types/weather';
import { fetchForecast, reverseGeocode, searchCities } from './services/openMeteo';
import { Header } from './components/Header';
import { CurrentConditions } from './components/CurrentConditions';
import { HourlyForecast } from './components/HourlyForecast';
import { ForecastGrid } from './components/ForecastGrid';
import { TemperatureTrendChart } from './components/TemperatureTrendChart';
import { PlanningRecommendations } from './components/PlanningRecommendations';
import { ErrorMessage } from './components/ErrorMessage';
import { Loader2, RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';

const DEFAULT_LOCATION: LocationInfo = {
  name: 'Tokyo',
  country: 'Japan',
  latitude: 35.6762,
  longitude: 139.6503,
  country_code: 'JP'
};

const FAVORITES_STORAGE_KEY = 'weather_intelligence_favorites_v1';

export default function App() {
  const [currentLocation, setCurrentLocation] = useState<LocationInfo>(DEFAULT_LOCATION);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchedCity, setSearchedCity] = useState<string>('');

  // Unit preferences
  const [tempUnit, setTempUnit] = useState<TemperatureUnit>('celsius');
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>('kmh');

  // Favorites
  const [favorites, setFavorites] = useState<LocationInfo[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (err) {
      console.warn('Failed to save favorites to localStorage:', err);
    }
  }, [favorites]);

  // Load weather for a location
  const loadWeather = useCallback(async (loc: LocationInfo) => {
    setIsLoading(true);
    setError(null);
    setSearchedCity(loc.name);

    try {
      let targetLat = loc.latitude;
      let targetLon = loc.longitude;
      let locName = loc.name;
      let locCountry = loc.country;
      let locAdmin1 = loc.admin1;
      let locCountryCode = loc.country_code;

      // If latitude and longitude are missing or 0, geocode the city name first!
      if (!targetLat && !targetLon && loc.name) {
        const searchResults = await searchCities(loc.name);
        if (!searchResults || searchResults.length === 0) {
          setError(`No location results found for "${loc.name}". Please check spelling.`);
          setIsLoading(false);
          return;
        }
        const bestMatch = searchResults[0];
        targetLat = bestMatch.latitude;
        targetLon = bestMatch.longitude;
        locName = bestMatch.name;
        locCountry = bestMatch.country;
        locAdmin1 = bestMatch.admin1;
        locCountryCode = bestMatch.country_code;
      }

      const fullLoc: LocationInfo = {
        name: locName,
        country: locCountry,
        admin1: locAdmin1,
        latitude: targetLat,
        longitude: targetLon,
        country_code: locCountryCode
      };

      setCurrentLocation(fullLoc);

      const data = await fetchForecast(targetLat, targetLon);
      setForecast(data);
    } catch (err: any) {
      console.error('Failed to load forecast data:', err);
      setError(err?.message || 'Failed to fetch weather data from Open-Meteo API.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadWeather(DEFAULT_LOCATION);
  }, [loadWeather]);

  // Handle Geolocation
  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        try {
          const geoInfo = await reverseGeocode(lat, lon);
          const loc: LocationInfo = {
            name: geoInfo.name,
            country: geoInfo.country,
            latitude: lat,
            longitude: lon
          };
          await loadWeather(loc);
        } catch (err) {
          console.error('Error during reverse geocoding:', err);
          await loadWeather({
            name: 'Current Location',
            latitude: lat,
            longitude: lon
          });
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLocating(false);
        alert('Could not retrieve your location. Please check browser permissions or search manually.');
      },
      { timeout: 10000 }
    );
  }, [loadWeather]);

  // Toggle favorite city
  const handleToggleFavorite = (loc: LocationInfo) => {
    const exists = favorites.some((f) => f.name.toLowerCase() === loc.name.toLowerCase());
    if (exists) {
      setFavorites((prev) => prev.filter((f) => f.name.toLowerCase() !== loc.name.toLowerCase()));
    } else {
      setFavorites((prev) => [...prev, loc]);
    }
  };

  const isFavorite = favorites.some((f) => f.name.toLowerCase() === currentLocation.name.toLowerCase());

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors antialiased">
      
      {/* Top Navigation Header */}
      <Header
        currentLocation={currentLocation}
        onSelectLocation={loadWeather}
        tempUnit={tempUnit}
        onToggleTempUnit={setTempUnit}
        speedUnit={speedUnit}
        onToggleSpeedUnit={setSpeedUnit}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={isFavorite}
        onUseCurrentLocation={handleUseCurrentLocation}
        isLocating={isLocating}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Loading State */}
        {isLoading && (
          <div className="min-h-[400px] flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm">
            <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-500 mb-4 animate-spin">
              <Loader2 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Retrieving Weather Intelligence...
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
              Connecting to Open-Meteo Geocoding & High-Resolution Forecast APIs for {searchedCity || 'city'}
            </p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <ErrorMessage
            searchedCity={searchedCity}
            errorMessage={error}
            onRetry={() => loadWeather(currentLocation)}
            onSelectPopularCity={loadWeather}
          />
        )}

        {/* Success Weather Dashboard */}
        {!isLoading && !error && forecast && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Current Conditions Card */}
            <CurrentConditions
              location={currentLocation}
              forecast={forecast}
              tempUnit={tempUnit}
              speedUnit={speedUnit}
            />

            {/* 24-Hour Timeline */}
            {forecast.hourly && (
              <HourlyForecast
                hourly={forecast.hourly}
                tempUnit={tempUnit}
              />
            )}

            {/* 7-Day Forecast Grid & Temperature Trend Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7">
                {forecast.daily && (
                  <ForecastGrid
                    daily={forecast.daily}
                    tempUnit={tempUnit}
                    speedUnit={speedUnit}
                  />
                )}
              </div>

              <div className="lg:col-span-5 space-y-6">
                <TemperatureTrendChart
                  forecast={forecast}
                  tempUnit={tempUnit}
                />
              </div>
            </div>

            {/* Smart Planning Recommendations */}
            <PlanningRecommendations forecast={forecast} />

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>
              Powered by <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-sky-500 transition-colors">Open-Meteo Weather API</a>
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>High-Precision Forecast Engine</span>
            <span>•</span>
            <button
              onClick={() => loadWeather(currentLocation)}
              className="hover:text-sky-500 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="h-3 w-3" /> Refresh
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
