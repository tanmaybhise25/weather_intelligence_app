# Weather Intelligence App

A responsive Weather Intelligence single-page web application built using Google AI Studio, React, Vite, and Tailwind CSS[cite: 1, 2]. The application provides real-time weather information, 7-day forecasts, temperature trends, and automated planning recommendations using open-access APIs.

## Features
- **City Search:** Search for any major city worldwide[cite: 1].
- **Current Conditions:** Real-time display of current temperature, weather conditions, and wind speed[cite: 1].
- **7-Day Forecast:** Daily forecast cards displaying min/max temperatures[cite: 1].
- **Planning Recommendations:** Smart tips based on current weather conditions[cite: 1].
- **Error Handling:** Clear notification when an invalid city or API error occurs[cite: 1].

## APIs Used
- **Open-Meteo Geocoding API:** `https://geocoding-api.open-meteo.com/v1/search` (Converts city names into latitude & longitude)[cite: 1]
- **Open-Meteo Forecast API:** `https://api.open-meteo.com/v1/forecast` (Fetches live weather and forecast data)[cite: 1]

## AI Studio & GitHub Workflow
1. App prototype generated using **Google AI Studio App Build**[cite: 1, 2].
2. Connected directly to GitHub from AI Studio to push source code into the repository[cite: 1, 2].

## Cloudflare Pages Deployment Configuration
- **Deployment Platform:** Cloudflare Pages[cite: 1, 2]
- **Framework Preset:** Vite / React[cite: 2]
- **Build Command:** `npm run build`[cite: 1, 2]
- **Build Output Directory:** `dist`[cite: 1, 2]
- **Production Branch:** `main`[cite: 2]
