import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TrendingUp, BarChart2 } from 'lucide-react';
import { ForecastResponse, TemperatureUnit } from '../types/weather';
import { formatDate, formatTime, formatTempVal } from '../utils/weatherUtils';

interface TemperatureTrendChartProps {
  forecast: ForecastResponse;
  tempUnit: TemperatureUnit;
}

export const TemperatureTrendChart: React.FC<TemperatureTrendChartProps> = ({ forecast, tempUnit }) => {
  const [viewMode, setViewMode] = useState<'daily' | 'hourly'>('daily');

  const daily = forecast.daily;
  const hourly = forecast.hourly;

  if (!daily && !hourly) return null;

  // Prepare Daily Chart Data
  const dailyChartData = daily?.time.slice(0, 7).map((dateStr, idx) => {
    return {
      label: formatDate(dateStr, { weekday: 'short', month: 'numeric', day: 'numeric' }),
      maxTemp: formatTempVal(daily.temperature_2m_max[idx], tempUnit),
      minTemp: formatTempVal(daily.temperature_2m_min[idx], tempUnit),
      apparentMax: formatTempVal(daily.apparent_temperature_max?.[idx] ?? daily.temperature_2m_max[idx], tempUnit),
      precipProb: daily.precipitation_probability_max?.[idx] ?? 0
    };
  }) || [];

  // Prepare Hourly Chart Data (Next 24 Hours)
  const hourlyChartData = hourly?.time.slice(0, 24).map((timeStr, idx) => {
    return {
      label: idx === 0 ? 'Now' : formatTime(timeStr),
      temp: formatTempVal(hourly.temperature_2m[idx], tempUnit),
      apparent: formatTempVal(hourly.apparent_temperature[idx], tempUnit),
      precipProb: hourly.precipitation_probability[idx] ?? 0
    };
  }) || [];

  const data = viewMode === 'daily' ? dailyChartData : hourlyChartData;
  const unitSymbol = tempUnit === 'fahrenheit' ? '°F' : '°C';

  return (
    <div id="temperature-trend-chart-card" className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-6 shadow-sm">
      
      {/* Chart Header & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-sky-500" /> Temperature & Precipitation Trend
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {viewMode === 'daily' ? '7-Day high/low temperature trajectory' : '24-Hour continuous thermal curve'}
          </p>
        </div>

        <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 text-xs font-semibold self-start sm:self-auto">
          <button
            id="chart-view-daily-btn"
            onClick={() => setViewMode('daily')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'daily'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            7-Day Outlook
          </button>
          <button
            id="chart-view-hourly-btn"
            onClick={() => setViewMode('hourly')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'hourly'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            24-Hour Detail
          </button>
        </div>
      </div>

      {/* Recharts Area Container */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMaxTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorMinTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorPrecip" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#64748b' }}
              dy={5}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#64748b' }}
              unit={unitSymbol}
              domain={['auto', 'auto']}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#3b82f6' }}
              unit="%"
              domain={[0, 100]}
              hide={viewMode === 'hourly'}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-xs font-medium space-y-1">
                      <p className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-1 mb-1">
                        {label}
                      </p>
                      {payload.map((entry, idx) => (
                        <div key={`tooltip-${idx}`} className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            {entry.name}:
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {entry.value}{entry.name.includes('Rain') || entry.name.includes('Precip') ? '%' : unitSymbol}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />

            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />

            {viewMode === 'daily' ? (
              <>
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="maxTemp"
                  name="High Temp"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorMaxTemp)"
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="minTemp"
                  name="Low Temp"
                  stroke="#0ea5e9"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorMinTemp)"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="precipProb"
                  name="Precip Chance"
                  stroke="#3b82f6"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fillOpacity={0.1}
                  fill="url(#colorPrecip)"
                />
              </>
            ) : (
              <>
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="temp"
                  name="Temperature"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorMinTemp)"
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="apparent"
                  name="Feels Like"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  fill="none"
                />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
