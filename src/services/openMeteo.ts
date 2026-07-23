import { OpenMeteoGeocodingResponse, GeocodingResult, ForecastResponse } from '../types/weather';

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast';

export async function searchCities(query: string): Promise<GeocodingResult[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const url = `${GEOCODING_API_URL}?name=${encodeURIComponent(query.trim())}&count=10&language=en&format=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Geocoding request failed with status ${response.status}`);
  }

  const data: OpenMeteoGeocodingResponse = await response.json();
  return data.results || [];
}

export async function fetchForecast(latitude: number, longitude: number): Promise<ForecastResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'rain',
      'showers',
      'snowfall',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m'
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'dew_point_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'rain',
      'showers',
      'snowfall',
      'weather_code',
      'pressure_msl',
      'surface_pressure',
      'cloud_cover',
      'visibility',
      'wind_speed_10m',
      'wind_direction_10m',
      'uv_index',
      'is_day'
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'daylight_duration',
      'sunshine_duration',
      'uv_index_max',
      'uv_index_clear_sky_max',
      'precipitation_sum',
      'rain_sum',
      'showers_sum',
      'snowfall_sum',
      'precipitation_hours',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'wind_gusts_10m_max',
      'wind_direction_10m_dominant'
    ].join(','),
    timezone: 'auto'
  });

  const url = `${FORECAST_API_URL}?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather forecast request failed with status ${response.status}`);
  }

  return await response.json();
}

/**
 * Perform reverse geocoding lookup using Open-Meteo or BigDataCloud free reverse geocode
 * if user requests Geolocation
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<{ name: string; country?: string }> {
  try {
    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
    if (response.ok) {
      const data = await response.json();
      const city = data.city || data.locality || data.principalSubdivision || 'Current Location';
      return {
        name: city,
        country: data.countryName
      };
    }
  } catch (err) {
    console.warn('Reverse geocoding warning:', err);
  }
  return { name: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°` };
}
