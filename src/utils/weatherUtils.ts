import { ForecastResponse, TemperatureUnit, SpeedUnit, PlanningRecommendation } from '../types/weather';

export function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  if (unit === 'fahrenheit') {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function formatTempVal(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatSpeed(kmh: number, unit: SpeedUnit): string {
  if (unit === 'mph') {
    const mph = kmh * 0.621371;
    return `${Math.round(mph)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}

export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    ...options
  };
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
}

export function formatTime(timeString: string): string {
  const date = new Date(timeString);
  if (isNaN(date.getTime())) return timeString;
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

export function getUVRating(uvIndex: number): { label: string; colorClass: string } {
  if (uvIndex <= 2) return { label: 'Low', colorClass: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200' };
  if (uvIndex <= 5) return { label: 'Moderate', colorClass: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200' };
  if (uvIndex <= 7) return { label: 'High', colorClass: 'text-orange-600 bg-orange-50 dark:bg-orange-950/50 dark:text-orange-400 border-orange-200' };
  if (uvIndex <= 10) return { label: 'Very High', colorClass: 'text-red-600 bg-red-50 dark:bg-red-950/50 dark:text-red-400 border-red-200' };
  return { label: 'Extreme', colorClass: 'text-purple-600 bg-purple-50 dark:bg-purple-950/50 dark:text-purple-400 border-purple-200' };
}

export function generatePlanningRecommendations(forecast: ForecastResponse): PlanningRecommendation[] {
  const current = forecast.current;
  const daily = forecast.daily;
  const recommendations: PlanningRecommendation[] = [];

  if (!current || !daily) return recommendations;

  const tempC = current.temperature_2m;
  const precipProb = daily.precipitation_probability_max?.[0] ?? current.precipitation ?? 0;
  const windKmh = current.wind_speed_10m;
  const uvIndex = daily.uv_index_max?.[0] ?? 0;
  const weatherCode = current.weather_code;

  // 1. Outdoor Activities (Running / Cycling / Dining)
  let outdoorScore = 'excellent';
  let outdoorDesc = 'Great weather for outdoor workouts, walking, and patio dining.';
  if (precipProb > 60 || weatherCode >= 60) {
    outdoorScore = 'warning';
    outdoorDesc = 'Rain or storm expected. Better to plan indoor activities or bring waterproof gear.';
  } else if (tempC > 35 || tempC < -5) {
    outdoorScore = 'caution';
    outdoorDesc = 'Extreme temperatures. Limit intense outdoor physical activity.';
  } else if (windKmh > 35) {
    outdoorScore = 'caution';
    outdoorDesc = 'Breezy to high wind speeds. Expect wind resistance during cycling or outdoor sports.';
  }

  recommendations.push({
    category: 'outdoor',
    title: 'Outdoor & Sports',
    status: outdoorScore as any,
    description: outdoorDesc,
    iconName: 'Activity',
    metrics: [
      { label: 'Rain Chance', value: `${precipProb}%` },
      { label: 'Wind Impact', value: windKmh > 25 ? 'High' : windKmh > 12 ? 'Moderate' : 'Low' }
    ]
  });

  // 2. Clothing & Wardrobe
  let clothingStatus = 'good';
  let clothingDesc = '';
  if (tempC < 5) {
    clothingStatus = 'caution';
    clothingDesc = 'Cold condition. Wear thermal base layers, an insulated winter coat, beanie, and gloves.';
  } else if (tempC < 15) {
    clothingDesc = 'Cool breeze. A sweater, medium jacket, or fleece zip-up recommended.';
  } else if (tempC < 25) {
    clothingDesc = 'Comfortable temperature. Light long-sleeves, t-shirts, or casual layers work best.';
  } else {
    clothingDesc = 'Warm to hot weather. Breathable cotton or linen clothes with a hat.';
  }

  if (precipProb > 40 || weatherCode >= 51) {
    clothingDesc += ' Carry an umbrella or water-resistant coat ☔.';
  }

  recommendations.push({
    category: 'clothing',
    title: 'Wardrobe & Gear',
    status: clothingStatus as any,
    description: clothingDesc,
    iconName: 'Shirt',
    metrics: [
      { label: 'Feels Like', value: `${Math.round(current.apparent_temperature)}°C` },
      { label: 'Precipitation', value: `${current.precipitation} mm` }
    ]
  });

  // 3. Travel & Commuting
  let travelStatus = 'excellent';
  let travelDesc = 'Clear transit conditions. Good roads and visibility for smooth driving.';
  if (weatherCode >= 95) {
    travelStatus = 'warning';
    travelDesc = 'Thunderstorm warning! Allow extra commute time, watch for slippery roads or reduced visibility.';
  } else if (weatherCode === 45 || weatherCode === 48) {
    travelStatus = 'caution';
    travelDesc = 'Foggy conditions present. Use low-beam headlights and maintain extra braking distance.';
  } else if (precipProb > 50) {
    travelStatus = 'caution';
    travelDesc = 'Wet roads likely during peak hours. Moderate traffic slowdowns expected.';
  }

  recommendations.push({
    category: 'travel',
    title: 'Travel & Commute',
    status: travelStatus as any,
    description: travelDesc,
    iconName: 'Car',
    metrics: [
      { label: 'Visibility', value: forecast.hourly?.visibility?.[0] ? `${(forecast.hourly.visibility[0] / 1000).toFixed(1)} km` : 'Good' }
    ]
  });

  // 4. Health & Sun Care
  let healthStatus = 'good';
  let healthDesc = 'Favorable weather conditions.';
  if (uvIndex >= 6) {
    healthStatus = 'caution';
    healthDesc = `High UV index (${uvIndex}). Apply SPF 30+ sunscreen, wear sunglasses and seek shade between 11 AM - 3 PM.`;
  } else if (current.relative_humidity_2m > 80) {
    healthDesc = 'High humidity levels. Stay well-hydrated and take breaks in air-conditioned spaces if active.';
  } else if (current.relative_humidity_2m < 25) {
    healthDesc = 'Low humidity. Consider using lip balm or moisturizer to prevent dry skin.';
  } else {
    healthDesc = 'Optimal outdoor comfort level. Moderate humidity and manageable UV levels.';
  }

  recommendations.push({
    category: 'health',
    title: 'Sun Protection & Health',
    status: healthStatus as any,
    description: healthDesc,
    iconName: 'SunMedium',
    metrics: [
      { label: 'Max UV Index', value: `${uvIndex}` },
      { label: 'Humidity', value: `${current.relative_humidity_2m}%` }
    ]
  });

  return recommendations;
}
