# Daily Nutrition App

A mobile-first full-stack web app for tracking daily food intake and estimating nutrient needs from logged foods.

## V1

Users can:

- create an account and manage a basic profile
- start a new day manually
- add foods and approximate amounts throughout the day
- keep a running record of foods logged in the current day
- calculate nutrient intake from all foods recorded in the current day
- compare intake with official daily nutrition targets
- see how much of each nutrient is still needed
- get food suggestions with practical amounts
- request more food options
- review a daily summary
- view recent history

## Stack

- React + TypeScript
- Node.js + Express
- PostgreSQL

## Platform

V1 is a mobile-first responsive web app designed for quick food logging throughout the day.

The interface should remain simple on small screens, with fast entry, clear nutrient summaries, and minimal navigation.

## Scope

V1 focuses on general nutrition guidance based on foods logged in the app.

The app estimates dietary intake only. Non-food sources such as sunlight exposure, supplements, medications, and individual absorption differences are not included.

The app does not assess nutrient status in the body or provide medical advice.

Pregnancy and lactation are out of scope for V1.

## Architecture

React frontend → Express API → PostgreSQL

External nutrition data is accessed through the backend.

## Data Model

- users
- profiles
- day_sessions
- food_entries

## Profile

The user profile includes:

- age
- sex
- height
- weight
- activity level

These values are used only where required by the official nutrition reference.

## Daily Sessions

A day is defined by the user, not by midnight or a fixed 24-hour window.

The user starts a new day manually.

All food entries remain part of the current day until the user starts another day.

Starting a new day archives the previous session and begins a fresh calculation.

## Nutrition Reference

Daily nutrient targets are based on official Dietary Reference Intake guidance published by Health Canada.

RDA is used when available. AI is used when no RDA is available.

Energy requirements are calculated separately using the official variables required for energy estimation.

## Nutrition Data

USDA FoodData Central provides food and nutrient data.

Food search is used to identify the correct food record.

Detailed nutrient data is retrieved using the selected food's FDC ID.

Food amounts are converted to the serving basis used by the source data for calculation, while the unit entered by the user is preserved for display.

## Results

The app calculates nutrients from all foods logged in the current day session.

When the same nutrient appears in multiple foods, the amounts are added together before comparison with the daily target.

For nutrients contributed by the logged foods, the app can show:

- total amount consumed
- official daily target
- remaining amount still needed

The app does not automatically display nutrient gaps that are unrelated to the foods the user has logged.

Users can choose to view:

- key remaining nutrients
- all remaining tracked nutrients

The key-nutrient view uses a predefined evidence-based subset of the most useful nutrients for daily attention rather than a dynamic ranking system.

## Food Suggestions

For nutrients that still have a remaining need, the app suggests foods that can help cover the gap.

Suggestions include both the food name and a practical amount.

Suggested amounts are calculated from nutrient data rather than fixed manually.

A small set of suggestions is shown first, with more options available on request.

## Daily Summary

The app keeps a running summary based on the foods logged in the current day session.

Users can add more food at any time, and nutrient totals are recalculated automatically.

Before starting a new day, users can review the current summary and add any missing food entries.

The summary reflects only foods recorded by the user.

## API

- POST /api/auth/register
- POST /api/auth/login
- GET /api/profile
- PUT /api/profile
- POST /api/days
- GET /api/days/current
- GET /api/foods/search
- POST /api/entries
- GET /api/entries
- GET /api/nutrition/current
