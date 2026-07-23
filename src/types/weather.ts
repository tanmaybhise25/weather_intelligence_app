export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  country?: string;
  timezone?: string;
  population?: number;
}

export interface OpenMeteoGeocodingResponse {
  results?: GeocodingResult[];
  generationtime_ms?: number;
}

export interface CurrentWeather {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  dew_point_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  precipitation: number[];
  rain: number[];
  showers: number[];
  snowfall: number[];
  weather_code: number[];
  pressure_msl: number[];
  surface_pressure: number[];
  cloud_cover: number[];
  visibility: number[];
  wind_speed_10m: number[];
  wind_direction_10m: number[];
  uv_index: number[];
  is_day: number[];
}

export interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: string[];
  sunset: string[];
  daylight_duration: number[];
  sunshine_duration: number[];
  uv_index_max: number[];
  uv_index_clear_sky_max: number[];
  precipitation_sum: number[];
  rain_sum: number[];
  showers_sum: number[];
  snowfall_sum: number[];
  precipitation_hours: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  wind_gusts_10m_max: number[];
  wind_direction_10m_dominant: number[];
}

export interface ForecastResponse {
  latitude: number;
  longitude: number;
  elevation: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  current?: CurrentWeather;
  hourly?: HourlyWeather;
  daily?: DailyWeather;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type SpeedUnit = 'kmh' | 'mph';

export interface LocationInfo {
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  country_code?: string;
}

export interface PlanningRecommendation {
  category: 'outdoor' | 'clothing' | 'travel' | 'health';
  title: string;
  status: 'excellent' | 'good' | 'caution' | 'warning';
  description: string;
  iconName: string;
  metrics?: { label: string; value: string }[];
}
