# AGENTS.md – Solkollen

## Vad appen gör

Solkollen är en enkel väderapp på svenska. Man söker efter en ort och ser vädret just nu (temperatur, känns som, vind, luftfuktighet) och en prognos för fem dagar. Orter kan sparas som favoriter. Favoriterna och den senast valda orten sparas i webbläsarens localStorage, under nycklarna `solkollen.favoriter` och `solkollen.senasteOrt`.

Väderdata kommer från OpenWeatherMaps gratis-API:er: Geocoding, aktuellt väder och femdygnsprognos.

## Teknik

- React 19 och Vite 7, med vanlig JavaScript (JSX). Det finns ingen TypeScript, ingen router och inget state-bibliotek.
- `src/App.jsx`: appens state, laddning och felvisning.
- `src/api/openweather.js`: alla anrop till API:et, felkoder (`WeatherError`) och sammanslagning av 3-timmarsprognosen till en rad per dag.
- `src/components/`: `SearchBar`, `Favorites`, `CurrentWeather` och `Forecast`.
- `src/hooks/useLocalStorage.js`: fungerar som `useState` men sparar värdet i localStorage.
- `src/index.css`: all styling.
- `vite.config.js` har `base: './'` så att appen fungerar från en undermapp på GitHub Pages.

All text i gränssnittet och alla kodkommentarer är på svenska. Fortsätt så.

## Starta

1. Kopiera `.env.example` till `.env.local` och fyll i `VITE_OPENWEATHER_API_KEY`. `.env.local` är gitignorerad och får aldrig checkas in.
2. Kör `npm install` och sedan `npm run dev`. Appen startar på http://localhost:5173 (konfigurationen finns också i `.claude/launch.json`).

Utan nyckel startar appen ändå, men visar ett meddelande om att API-nyckel saknas.

## Testa

- `npm test` kör testerna en gång med Vitest, React Testing Library och jsdom. Inställningarna finns under `test` i `vite.config.js`.
- Testfilerna ligger bredvid koden de testar (`*.test.js` och `*.test.jsx`). Gemensam setup och påhittade API-svar finns i `src/test/`.
- Testerna når aldrig OpenWeatherMap: `fetch` mockas med `mockWeatherApi()` från `src/test/fixtures.js`, och nyckeln är en låtsasnyckel. Ingen `.env.local` behövs.
- `.github/workflows/test.yml` kör testerna (jobbet `test`) på varje pull request.

Det finns ingen linter. Kontrollera också:

- `npm run build` ska gå igenom utan fel. Resultatet hamnar i `dist/`.
- Starta `npm run dev` och prova i webbläsaren: sök efter en ort, kontrollera aktuellt väder och prognosen, och lägg till och ta bort en favorit. Ladda om sidan och kontrollera att favoriterna finns kvar.
- `npm run preview` visar det byggda resultatet lokalt.

## Publicering

`.github/workflows/deploy.yml` bygger och publicerar appen på GitHub Pages vid varje push till `main`. Nyckeln hämtas från repots secret `VITE_OPENWEATHER_API_KEY`. Nyckeln byggs in i JavaScript-filerna och blir synlig för alla, så använd bara en gratisnyckel.

## Arbetssätt

- Jobba alltid på en ny branch, aldrig direkt på main.
- Kör testerna innan du öppnar en pull request. De ska gå igenom.
- När du är klar: pusha branchen och öppna en pull request med gh.