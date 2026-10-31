# Solkollen ☀️

En glad och enkel väderapp på svenska, byggd med React och Vite.

## Vad appen gör

- Sök efter en ort och se vädret just nu: temperatur, känns som, vind och luftfuktighet.
- Se prognosen för de kommande fem dagarna med högsta och lägsta temperatur och risk för nederbörd.
- Spara favoritorter med stjärnan och byt snabbt mellan dem. Favoriterna sparas i webbläsaren (localStorage).
- Fungerar lika bra på mobil som på dator.

Väderdata hämtas från [OpenWeatherMap](https://openweathermap.org/) via deras gratis-API:er för aktuellt väder, femdygnsprognos och Geocoding.

## Kom igång

1. Skaffa en gratis API-nyckel på [openweathermap.org](https://home.openweathermap.org/api_keys).
2. Kopiera `.env.example` till `.env.local` och fyll i nyckeln:
   ```
   VITE_OPENWEATHER_API_KEY=din-nyckel
   ```
   `.env.local` finns i `.gitignore` och checkas aldrig in.
3. Installera och starta:
   ```bash
   npm install
   npm run dev
   ```

## Bygga för GitHub Pages

```bash
npm run build
```

Resultatet hamnar i `dist/`. Vite är inställt med `base: './'` så att appen fungerar från en undermapp.

Workflowet i `.github/workflows/deploy.yml` bygger och publicerar appen på GitHub Pages vid varje push till `main`. Nyckeln läses då från repots secret `VITE_OPENWEATHER_API_KEY` (Settings → Secrets and variables → Actions).

Observera att nyckeln byggs in i JavaScript-filerna och blir synlig för alla som besöker sidan. Det är så webbläsarappar fungerar, så använd en gratisnyckel.
