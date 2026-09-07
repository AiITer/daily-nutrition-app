# Daily Nutrition App

A full-stack web app for customers to track daily nutrient intake and get simple food suggestions.

## V1

Users can:

- add foods and approximate amounts
- estimate daily nutrient intake
- see nutrients that may need attention
- get simple food suggestions
- create an account
- save daily records
- view recent history

## Stack

- React + TypeScript
- Node.js + Express
- PostgreSQL

## Scope

V1 focuses on general nutrition guidance only.

No medical advice, barcode scanning, or AI-generated health recommendations.

## Architecture

React frontend → Express API → PostgreSQL

## Data Model

- users
- profiles
- food_entries

## Data

USDA FoodData Central provides food and nutrient data.

Food amounts are converted to the serving basis used by the source data for calculation, while the original user-entered unit is preserved for display.

## API

- POST /api/auth/register
- POST /api/auth/login
- GET /api/profile
- PUT /api/profile
- GET /api/foods/search
- POST /api/entries
- GET /api/entries
- GET /api/nutrition/today
