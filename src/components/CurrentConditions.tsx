import React from 'react';
import {
  Wind,
  Droplets,
  Gauge,
  Eye,
  Sun,
  Sunset as SunsetIcon,
  Sunrise as SunriseIcon,
  Cloud,
  Thermometer,
  Compass,
  ArrowDown,
  ArrowUp
} from 'lucide-react';
import { ForecastResponse, LocationInfo, TemperatureUnit, SpeedUnit } from '../types/weather';
import { getWMOInfo } from '../utils/wmoCodes';
import {
  formatTemperature,
  formatSpeed,
  getWindDirection,
  formatTime,
  getUVRating
} from '../utils/weatherUtils';

interface CurrentConditionsProps {
  location: LocationInfo;
  forecast: ForecastResponse;
  tempUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
}

export const CurrentConditions: React.FC<CurrentConditionsProps> = ({
  location,
  forecast,
  tempUnit,
  speedUnit
}) => {
  const current = forecast.current;
  const daily = forecast.daily;

  if (!current || !daily) return null;

  const wmo = getWMOInfo(current.weather_code);
  const WeatherIcon = wmo.icon;

  const todayHigh = daily.temperature_2m_max?.[0] ?? current.temperature_2m;
  const todayLow = daily.temperature_2m_min?.[0] ?? current.temperature_2m;
  const maxUv = daily.uv_index_max?.[0] ?? 0;
  const uvRating = getUVRating(maxUv);

  const sunriseTime = daily.sunrise?.[0] ? formatTime(daily.sunrise[0]) : '--:--';
  const sunsetTime = daily.sunset?.[0] ? formatTime(daily.sunset[0]) : '--:--';

  // Visibility from hourly data
  const visibilityMeters = forecast.hourly?.visibility?.[0] ?? 10000;
  const visibilityKm = (visibilityMeters / 1000).toFixed(1);

  // Dew point from hourly
  const dewPointC = forecast.hourly?.dew_point_2m?.[0] ?? current.temperature_2m - 3;

  return (
    <div id="current-conditions-card" className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${wmo.bgGradient} p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-lg transition-all`}>
      
      {/* Background Weather Accent Glow */}
      <div
        className="absolute -right-16 -top-16 w-72 h-72 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ backgroundColor: wmo.themeColor }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Primary Big Temperature & Condition */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${wmo.badgeBg} ${wmo.badgeText} border border-black/5 dark:border-white/10 shadow-2xs`}>
                <WeatherIcon className="h-4 w-4 animate-bounce-slow" />
                {wmo.description}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Updated {current.time ? formatTime(current.time) : 'Now'}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-4">
              <h2 id="current-temperature" className="text-6xl sm:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {formatTemperature(current.temperature_2m, tempUnit)}
              </h2>
              <div className="space-y-1">
                <p id="feels-like-temp" className="text-sm font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <Thermometer className="h-4 w-4 text-sky-500" />
                  Feels like {formatTemperature(current.apparent_temperature, tempUnit)}
                </p>
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                    <ArrowUp className="h-3 w-3 mr-0.5" /> High: {formatTemperature(todayHigh, tempUnit)}
                  </span>
                  <span className="flex items-center text-blue-600 dark:text-blue-400">
                    <ArrowDown className="h-3 w-3 mr-0.5" /> Low: {formatTemperature(todayLow, tempUnit)}
                  </span>
                </div>
              </div>
            </div>

            <p id="city-country-title" className="mt-3 text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>{location.name}</span>
              {location.admin1 && <span className="text-slate-400 font-normal">, {location.admin1}</span>}
              {location.country && <span className="text-slate-400 font-normal">, {location.country}</span>}
            </p>
          </div>

          {/* Sun Timeline Badge */}
          <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-around text-center">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <SunriseIcon className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-400 font-medium">Sunrise</p>
                <p id="sunrise-time" className="text-sm font-bold text-slate-800 dark:text-slate-200">{sunriseTime}</p>
              </div>
            </div>

            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700" />

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
                <SunsetIcon className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-400 font-medium">Sunset</p>
                <p id="sunset-time" className="text-sm font-bold text-slate-800 dark:text-slate-200">{sunsetTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Key Weather Metrics Grid */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
          
          {/* Wind Speed & Direction */}
          <div id="metric-wind-speed" className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold flex items-center gap-1.5">
                <Wind className="h-4 w-4 text-sky-500" /> Wind
              </span>
              <Compass className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <div className="mt-3">
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {formatSpeed(current.wind_speed_10m, speedUnit)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                Direction: {getWindDirection(current.wind_direction_10m)} ({current.wind_direction_10m}°)
              </p>
            </div>
          </div>

          {/* Humidity */}
          <div id="metric-humidity" className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold flex items-center gap-1.5">
                <Droplets className="h-4 w-4 text-blue-500" /> Humidity
              </span>
            </div>
            <div className="mt-3">
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {current.relative_humidity_2m}%
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Dew point: {formatTemperature(dewPointC, tempUnit)}
              </p>
            </div>
          </div>

          {/* UV Index */}
          <div id="metric-uv-index" className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold flex items-center gap-1.5">
                <Sun className="h-4 w-4 text-amber-500" /> UV Index
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-bold text-slate-900 dark:text-white">{maxUv}</p>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${uvRating.colorClass}`}>
                  {uvRating.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                Peak expected today
              </p>
            </div>
          </div>

          {/* Surface Pressure */}
          <div id="metric-pressure" className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold flex items-center gap-1.5">
                <Gauge className="h-4 w-4 text-indigo-500" /> Pressure
              </span>
            </div>
            <div className="mt-3">
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {Math.round(current.pressure_msl || current.surface_pressure)} hPa
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Sea level pressure
              </p>
            </div>
          </div>

          {/* Cloud Cover */}
          <div id="metric-cloud-cover" className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold flex items-center gap-1.5">
                <Cloud className="h-4 w-4 text-slate-500" /> Cloud Cover
              </span>
            </div>
            <div className="mt-3">
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {current.cloud_cover}%
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Sky coverage
              </p>
            </div>
          </div>

          {/* Visibility */}
          <div id="metric-visibility" className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold flex items-center gap-1.5">
                <Eye className="h-4 w-4 text-teal-500" /> Visibility
              </span>
            </div>
            <div className="mt-3">
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {visibilityKm} km
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Clear view distance
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
