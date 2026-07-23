# Weather Intelligence App

A responsive Weather Intelligence single-page web application built using Google AI Studio, React, Vite, and Tailwind CSS. The application provides real-time weather information, 7-day forecasts, temperature trends, and automated planning recommendations using open-access APIs.

## Features
- **City Search:** Search for any major city worldwide.
- **Current Conditions:** Real-time display of current temperature, weather conditions, and wind speed.
- **7-Day Forecast:** Daily forecast cards displaying min/max temperatures.
- **Planning Recommendations:** Smart tips based on current weather conditions.
- **Error Handling:** Clear notification when an invalid city or API error occurs.

## APIs Used
- **Open-Meteo Geocoding API:** `https://geocoding-api.open-meteo.com/v1/search` (Converts city names into latitude & longitude)
- **Open-Meteo Forecast API:** `https://api.open-meteo.com/v1/forecast` (Fetches live weather and forecast data)

## AI Studio & GitHub Workflow
1. App prototype generated using **Google AI Studio App Build**.
2. Connected directly to GitHub from AI Studio to push source code into the repository.

## Cloudflare Pages Deployment Configuration
- **Deployment Platform:** Cloudflare Pages
- **Framework Preset:** Vite / React
- **Build Command:** `npm run build`
- **Build Output Directory:** `dist`
- **Production Branch:** `main`
