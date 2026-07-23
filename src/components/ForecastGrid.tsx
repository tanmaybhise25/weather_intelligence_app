import React, { useState } from 'react';
import { Calendar, Umbrella, Wind, Sun, ChevronDown, ChevronUp } from 'lucide-react';
import { DailyWeather, TemperatureUnit, SpeedUnit } from '../types/weather';
import { getWMOInfo } from '../utils/wmoCodes';
import { formatTemperature, formatDate, formatSpeed } from '../utils/weatherUtils';

interface ForecastGridProps {
  daily: DailyWeather;
  tempUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
}

export const ForecastGrid: React.FC<ForecastGridProps> = ({ daily, tempUnit, speedUnit }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!daily || !daily.time || daily.time.length === 0) return null;

  // Calculate global min & max for temperature bar visualization
  const allMax = Math.max(...daily.temperature_2m_max);
  const allMin = Math.min(...daily.temperature_2m_min);
  const tempRange = Math.max(1, allMax - allMin);

  return (
    <div id="7day-forecast-card" className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="h-4 w-4 text-sky-500" /> 7-Day Weather Forecast
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Upcoming weekly outlook and condition breakdown
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {daily.time.slice(0, 7).map((dateStr, idx) => {
          const wmo = getWMOInfo(daily.weather_code[idx]);
          const IconComponent = wmo.icon;
          const maxTemp = daily.temperature_2m_max[idx];
          const minTemp = daily.temperature_2m_min[idx];
          const precipProb = daily.precipitation_probability_max?.[idx] ?? 0;
          const windSpeed = daily.wind_speed_10m_max?.[idx] ?? 0;
          const maxUv = daily.uv_index_max?.[idx] ?? 0;
          const isToday = idx === 0;
          const isExpanded = expandedIndex === idx;

          // Bar calculation percentages
          const leftPercent = Math.max(0, Math.min(100, ((minTemp - allMin) / tempRange) * 100));
          const widthPercent = Math.max(10, Math.min(100 - leftPercent, ((maxTemp - minTemp) / tempRange) * 100));

          return (
            <div
              key={`daily-${dateStr}`}
              className={`rounded-xl transition-all border ${
                isToday
                  ? 'bg-sky-50/60 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800'
                  : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800/60 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <div
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
              >
                {/* Date & Weather Icon */}
                <div className="flex items-center gap-3 min-w-[180px]">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 shadow-2xs">
                    <IconComponent className="h-5 w-5 text-sky-500" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {isToday ? 'Today' : formatDate(dateStr, { weekday: 'long' })}
                      {isToday && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500 text-white uppercase tracking-wider">
                          Now
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(dateStr, { month: 'short', day: 'numeric' })} • {wmo.description}
                    </div>
                  </div>
                </div>

                {/* Rain Probability Badge */}
                <div className="flex items-center gap-4 sm:justify-end flex-1">
                  <div className="min-w-[70px] text-left sm:text-center">
                    {precipProb > 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                        <Umbrella className="h-3 w-3" />
                        {precipProb}%
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">0% rain</span>
                    )}
                  </div>

                  {/* Temperature Range Visual Bar */}
                  <div className="flex items-center gap-2 flex-1 max-w-[220px]">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 w-10 text-right">
                      {formatTemperature(minTemp, tempUnit)}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
                      <div
                        className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 via-sky-400 to-amber-500"
                        style={{
                          left: `${leftPercent}%`,
                          width: `${widthPercent}%`
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white w-10 text-left">
                      {formatTemperature(maxTemp, tempUnit)}
                    </span>
                  </div>

                  <button
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label="Toggle Details"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Expandable Daily Details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-200/50 dark:border-slate-700/50 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white/40 dark:bg-slate-900/40 rounded-b-xl">
                  <div className="p-2.5 rounded-lg bg-slate-100/60 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium">Precipitation Sum</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                      {daily.precipitation_sum?.[idx] ?? 0} mm
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-100/60 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Wind className="h-3 w-3 text-sky-500" /> Max Wind
                    </span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                      {formatSpeed(windSpeed, speedUnit)}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-100/60 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Sun className="h-3 w-3 text-amber-500" /> Max UV Index
                    </span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                      {maxUv}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-100/60 dark:bg-slate-800/60">
                    <span className="text-slate-400 font-medium">Apparent Range</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                      {formatTemperature(daily.apparent_temperature_min?.[idx] ?? minTemp, tempUnit)} - {formatTemperature(daily.apparent_temperature_max?.[idx] ?? maxTemp, tempUnit)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
