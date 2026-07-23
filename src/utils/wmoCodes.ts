import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudRainWind,
  CloudLightning,
  Sparkles,
  LucideIcon
} from 'lucide-react';

export interface WMOCodeInfo {
  description: string;
  icon: LucideIcon;
  bgGradient: string;
  badgeBg: string;
  badgeText: string;
  themeColor: string;
}

export const WMO_CODES: Record<number, WMOCodeInfo> = {
  0: {
    description: 'Clear Sky',
    icon: Sun,
    bgGradient: 'from-amber-500/20 via-sky-500/10 to-blue-500/10',
    badgeBg: 'bg-amber-100 dark:bg-amber-950/60',
    badgeText: 'text-amber-800 dark:text-amber-300',
    themeColor: '#f59e0b'
  },
  1: {
    description: 'Mainly Clear',
    icon: CloudSun,
    bgGradient: 'from-sky-500/20 via-indigo-500/10 to-slate-500/10',
    badgeBg: 'bg-sky-100 dark:bg-sky-950/60',
    badgeText: 'text-sky-800 dark:text-sky-300',
    themeColor: '#0ea5e9'
  },
  2: {
    description: 'Partly Cloudy',
    icon: CloudSun,
    bgGradient: 'from-blue-500/20 via-sky-400/10 to-slate-500/10',
    badgeBg: 'bg-blue-100 dark:bg-blue-950/60',
    badgeText: 'text-blue-800 dark:text-blue-300',
    themeColor: '#3b82f6'
  },
  3: {
    description: 'Overcast',
    icon: Cloud,
    bgGradient: 'from-slate-500/20 via-gray-500/15 to-slate-700/10',
    badgeBg: 'bg-slate-200 dark:bg-slate-800',
    badgeText: 'text-slate-800 dark:text-slate-300',
    themeColor: '#64748b'
  },
  45: {
    description: 'Foggy',
    icon: CloudFog,
    bgGradient: 'from-slate-400/20 via-zinc-500/15 to-slate-600/10',
    badgeBg: 'bg-zinc-200 dark:bg-zinc-800',
    badgeText: 'text-zinc-800 dark:text-zinc-300',
    themeColor: '#71717a'
  },
  48: {
    description: 'Depositing Rime Fog',
    icon: CloudFog,
    bgGradient: 'from-slate-400/20 via-cyan-500/15 to-slate-600/10',
    badgeBg: 'bg-cyan-100 dark:bg-cyan-950/60',
    badgeText: 'text-cyan-800 dark:text-cyan-300',
    themeColor: '#06b6d4'
  },
  51: {
    description: 'Light Drizzle',
    icon: CloudDrizzle,
    bgGradient: 'from-sky-400/20 via-blue-500/15 to-slate-600/10',
    badgeBg: 'bg-sky-100 dark:bg-sky-950/60',
    badgeText: 'text-sky-800 dark:text-sky-300',
    themeColor: '#38bdf8'
  },
  53: {
    description: 'Moderate Drizzle',
    icon: CloudDrizzle,
    bgGradient: 'from-sky-500/20 via-blue-600/15 to-slate-700/10',
    badgeBg: 'bg-sky-200 dark:bg-sky-900',
    badgeText: 'text-sky-900 dark:text-sky-200',
    themeColor: '#0284c7'
  },
  55: {
    description: 'Dense Drizzle',
    icon: CloudDrizzle,
    bgGradient: 'from-sky-600/25 via-blue-700/20 to-slate-800/10',
    badgeBg: 'bg-sky-200 dark:bg-sky-900',
    badgeText: 'text-sky-900 dark:text-sky-200',
    themeColor: '#0369a1'
  },
  56: {
    description: 'Light Freezing Drizzle',
    icon: CloudDrizzle,
    bgGradient: 'from-cyan-400/20 via-blue-500/15 to-slate-600/10',
    badgeBg: 'bg-cyan-100 dark:bg-cyan-950/60',
    badgeText: 'text-cyan-800 dark:text-cyan-300',
    themeColor: '#22d3ee'
  },
  57: {
    description: 'Dense Freezing Drizzle',
    icon: CloudDrizzle,
    bgGradient: 'from-cyan-500/25 via-blue-600/20 to-slate-700/10',
    badgeBg: 'bg-cyan-200 dark:bg-cyan-900',
    badgeText: 'text-cyan-900 dark:text-cyan-200',
    themeColor: '#0891b2'
  },
  61: {
    description: 'Slight Rain',
    icon: CloudRain,
    bgGradient: 'from-blue-500/20 via-sky-600/15 to-slate-700/10',
    badgeBg: 'bg-blue-100 dark:bg-blue-950/60',
    badgeText: 'text-blue-800 dark:text-blue-300',
    themeColor: '#3b82f6'
  },
  63: {
    description: 'Moderate Rain',
    icon: CloudRain,
    bgGradient: 'from-blue-600/25 via-indigo-600/20 to-slate-800/10',
    badgeBg: 'bg-blue-200 dark:bg-blue-900',
    badgeText: 'text-blue-900 dark:text-blue-200',
    themeColor: '#2563eb'
  },
  65: {
    description: 'Heavy Rain',
    icon: CloudRainWind,
    bgGradient: 'from-blue-700/30 via-indigo-700/25 to-slate-900/15',
    badgeBg: 'bg-blue-300 dark:bg-blue-800',
    badgeText: 'text-blue-950 dark:text-blue-100',
    themeColor: '#1d4ed8'
  },
  66: {
    description: 'Light Freezing Rain',
    icon: CloudRain,
    bgGradient: 'from-cyan-500/25 via-blue-600/20 to-slate-700/10',
    badgeBg: 'bg-cyan-100 dark:bg-cyan-950/60',
    badgeText: 'text-cyan-800 dark:text-cyan-300',
    themeColor: '#06b6d4'
  },
  67: {
    description: 'Heavy Freezing Rain',
    icon: CloudRainWind,
    bgGradient: 'from-cyan-600/30 via-blue-700/25 to-slate-800/15',
    badgeBg: 'bg-cyan-200 dark:bg-cyan-900',
    badgeText: 'text-cyan-900 dark:text-cyan-100',
    themeColor: '#0e7490'
  },
  71: {
    description: 'Slight Snow Fall',
    icon: CloudSnow,
    bgGradient: 'from-sky-300/20 via-indigo-400/15 to-slate-500/10',
    badgeBg: 'bg-sky-100 dark:bg-sky-950/60',
    badgeText: 'text-sky-800 dark:text-sky-300',
    themeColor: '#38bdf8'
  },
  73: {
    description: 'Moderate Snow Fall',
    icon: CloudSnow,
    bgGradient: 'from-sky-400/25 via-indigo-500/20 to-slate-600/10',
    badgeBg: 'bg-sky-200 dark:bg-sky-900',
    badgeText: 'text-sky-900 dark:text-sky-200',
    themeColor: '#0284c7'
  },
  75: {
    description: 'Heavy Snow Fall',
    icon: CloudSnow,
    bgGradient: 'from-indigo-400/30 via-blue-500/25 to-slate-700/15',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-950/60',
    badgeText: 'text-indigo-800 dark:text-indigo-300',
    themeColor: '#6366f1'
  },
  77: {
    description: 'Snow Grains',
    icon: CloudSnow,
    bgGradient: 'from-sky-300/20 via-slate-400/15 to-slate-600/10',
    badgeBg: 'bg-slate-100 dark:bg-slate-800',
    badgeText: 'text-slate-800 dark:text-slate-300',
    themeColor: '#94a3b8'
  },
  80: {
    description: 'Slight Rain Showers',
    icon: CloudRain,
    bgGradient: 'from-sky-500/20 via-blue-500/15 to-slate-600/10',
    badgeBg: 'bg-sky-100 dark:bg-sky-950/60',
    badgeText: 'text-sky-800 dark:text-sky-300',
    themeColor: '#0ea5e9'
  },
  81: {
    description: 'Moderate Rain Showers',
    icon: CloudRain,
    bgGradient: 'from-blue-500/25 via-indigo-600/20 to-slate-700/10',
    badgeBg: 'bg-blue-200 dark:bg-blue-900',
    badgeText: 'text-blue-900 dark:text-blue-200',
    themeColor: '#2563eb'
  },
  82: {
    description: 'Violent Rain Showers',
    icon: CloudRainWind,
    bgGradient: 'from-blue-700/35 via-indigo-800/30 to-slate-900/20',
    badgeBg: 'bg-blue-300 dark:bg-blue-800',
    badgeText: 'text-blue-950 dark:text-blue-100',
    themeColor: '#1e40af'
  },
  85: {
    description: 'Slight Snow Showers',
    icon: CloudSnow,
    bgGradient: 'from-cyan-400/20 via-blue-500/15 to-slate-600/10',
    badgeBg: 'bg-cyan-100 dark:bg-cyan-950/60',
    badgeText: 'text-cyan-800 dark:text-cyan-300',
    themeColor: '#06b6d4'
  },
  86: {
    description: 'Heavy Snow Showers',
    icon: CloudSnow,
    bgGradient: 'from-indigo-500/30 via-slate-600/25 to-slate-800/15',
    badgeBg: 'bg-indigo-200 dark:bg-indigo-900',
    badgeText: 'text-indigo-900 dark:text-indigo-200',
    themeColor: '#4f46e5'
  },
  95: {
    description: 'Thunderstorm',
    icon: CloudLightning,
    bgGradient: 'from-amber-600/25 via-purple-700/20 to-slate-900/20',
    badgeBg: 'bg-amber-100 dark:bg-amber-950/60',
    badgeText: 'text-amber-800 dark:text-amber-300',
    themeColor: '#d97706'
  },
  96: {
    description: 'Thunderstorm with Hail',
    icon: CloudLightning,
    bgGradient: 'from-purple-600/30 via-slate-800/25 to-amber-700/20',
    badgeBg: 'bg-purple-100 dark:bg-purple-950/60',
    badgeText: 'text-purple-800 dark:text-purple-300',
    themeColor: '#9333ea'
  },
  99: {
    description: 'Heavy Thunderstorm with Hail',
    icon: CloudLightning,
    bgGradient: 'from-purple-700/35 via-slate-900/30 to-red-900/20',
    badgeBg: 'bg-purple-200 dark:bg-purple-900',
    badgeText: 'text-purple-900 dark:text-purple-200',
    themeColor: '#7e22ce'
  }
};

export function getWMOInfo(code: number): WMOCodeInfo {
  return WMO_CODES[code] || {
    description: 'Unknown Weather',
    icon: Sparkles,
    bgGradient: 'from-slate-500/15 via-gray-500/10 to-slate-600/10',
    badgeBg: 'bg-gray-100 dark:bg-gray-800',
    badgeText: 'text-gray-800 dark:text-gray-300',
    themeColor: '#64748b'
  };
}
