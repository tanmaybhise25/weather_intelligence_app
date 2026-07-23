import React from 'react';
import {
  Compass,
  Activity,
  Shirt,
  Car,
  SunMedium,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info
} from 'lucide-react';
import { ForecastResponse } from '../types/weather';
import { generatePlanningRecommendations } from '../utils/weatherUtils';

interface PlanningRecommendationsProps {
  forecast: ForecastResponse;
}

export const PlanningRecommendations: React.FC<PlanningRecommendationsProps> = ({ forecast }) => {
  const recommendations = generatePlanningRecommendations(forecast);

  if (!recommendations || recommendations.length === 0) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          icon: CheckCircle2,
          label: 'Favorable'
        };
      case 'good':
        return {
          bg: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
          icon: Info,
          label: 'Good'
        };
      case 'caution':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          icon: AlertTriangle,
          label: 'Caution'
        };
      case 'warning':
        return {
          bg: 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
          icon: AlertCircle,
          label: 'Advisory'
        };
      default:
        return {
          bg: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          icon: Info,
          label: 'Info'
        };
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity':
        return Activity;
      case 'Shirt':
        return Shirt;
      case 'Car':
        return Car;
      case 'SunMedium':
        return SunMedium;
      default:
        return Compass;
    }
  };

  return (
    <div id="planning-recommendations-card" className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="h-4 w-4 text-sky-500" /> Smart Activity & Planning Guidance
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Tailored wardrobe, outdoor, travel, and health advice based on live weather physics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec, idx) => {
          const statusInfo = getStatusBadge(rec.status);
          const StatusIcon = statusInfo.icon;
          const CategoryIcon = getCategoryIcon(rec.iconName);

          return (
            <div
              key={`rec-${idx}-${rec.category}`}
              className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-sky-100/70 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
                      <CategoryIcon className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {rec.title}
                    </span>
                  </div>

                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusInfo.bg}`}>
                    <StatusIcon className="h-3 w-3" />
                    {statusInfo.label}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                  {rec.description}
                </p>
              </div>

              {rec.metrics && rec.metrics.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center gap-4 text-[11px]">
                  {rec.metrics.map((m, mIdx) => (
                    <div key={`m-${mIdx}`} className="flex items-center gap-1.5">
                      <span className="text-slate-400 font-medium">{m.label}:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{m.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
