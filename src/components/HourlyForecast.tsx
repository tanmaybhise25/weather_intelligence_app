import React from 'react';
import { Clock, Umbrella } from 'lucide-react';
import { HourlyWeather, TemperatureUnit } from '../types/weather';
import { getWMOInfo } from '../utils/wmoCodes';
import { formatTemperature, formatTime } from '../utils/weatherUtils';

interface HourlyForecastProps {
  hourly: HourlyWeather;
  tempUnit: TemperatureUnit;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly, tempUnit }) => {
  if (!hourly || !hourly.time || hourly.time.length === 0) return null;

  // Take the next 24 hours starting from current hour or index 0
  const hourlyItems = hourly.time.slice(0, 24).map((timeStr, idx) => {
    const wmo = getWMOInfo(hourly.weather_code[idx]);
    const isNow = idx === 0;
    return {
      timeStr,
      formattedTime: isNow ? 'Now' : formatTime(timeStr),
      temp: hourly.temperature_2m[idx],
      precipProb: hourly.precipitation_probability[idx] ?? 0,
      wmo,
      isDay: hourly.is_day[idx] === 1
    };
  });

  return (
    <div id="hourly-forecast-container" className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="h-4 w-4 text-sky-500" /> 24-Hour Forecast
        </h3>
        <span className="text-xs font-medium text-slate-400">Hourly Timeline</span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
        {hourlyItems.map((item, idx) => {
          const IconComponent = item.wmo.icon;
          return (
            <div
              key={`hourly-${item.timeStr}-${idx}`}
              className={`flex-none w-20 p-3 rounded-xl flex flex-col items-center justify-between transition-all border ${
                idx === 0
                  ? 'bg-sky-50/90 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800 shadow-2xs'
                  : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
              }`}
            >
              <span className={`text-xs font-semibold ${idx === 0 ? 'text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                {item.formattedTime}
              </span>

              <div className="my-2.5 flex items-center justify-center p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 shadow-2xs">
                <IconComponent className={`h-6 w-6 ${idx === 0 ? 'text-sky-500' : 'text-slate-700 dark:text-slate-300'}`} />
              </div>

              <span className="text-base font-bold text-slate-900 dark:text-white">
                {formatTemperature(item.temp, tempUnit)}
              </span>

              {item.precipProb > 10 ? (
                <span className="mt-1.5 flex items-center gap-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                  <Umbrella className="h-3 w-3" />
                  {item.precipProb}%
                </span>
              ) : (
                <span className="mt-1.5 text-[10px] text-slate-400 font-medium">0%</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
