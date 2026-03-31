# Prompt Enhancer App

## Stack

Next.js App Router (latest stable), React, Tailwind CSS,
OpenAI API (gpt-4o-mini), npm only

## Bezwzględne zasady

- Wszystkie wywołania OpenAI TYLKO przez /app/api/ — nigdy z frontendu
- Klucz API wyłącznie z process.env.OPENAI_API_KEY
- Model: gpt-4o-mini (nie gpt-4, nie gpt-3.5)
- npm install + npm run dev musi działać bez błędów
- Bez zewnętrznych bibliotek UI — tylko Tailwind CSS
- Bez bazy danych, bez auth
- TypeScript wszędzie

## Struktura katalogów

/app → pages, layout, api routes
/components → komponenty React
/lib → logika AI (promptBuilder.ts)
/app/api/generate → endpoint POST

## Zwracany format z API

{ masterPrompt, shortVersion, variations: string[] }

## Model OpenAI

gpt-4o-mini — zawsze, nie zmieniaj