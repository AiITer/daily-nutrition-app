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
- meal_sessions
- food_entries

### Data-model note: food ownership path

`food_entries` currently stores both `day_session_id` and `meal_session_id`. This reflects the evolution of the project: foods originally belonged directly to a day, and the meal layer was added later.

In the current conceptual hierarchy, the cleaner relationship is `Day → Meal → Food`, so `meal_session_id` is the more natural direct parent relationship and a food's day could be derived through its meal. Keeping `day_session_id` on `food_entries` is therefore somewhat redundant, but it remains useful for existing daily aggregation and ownership queries.

For V1, this redundancy is intentionally retained to avoid unnecessary schema migration and query refactoring. A future cleanup could remove the direct day reference from `food_entries` and derive day ownership through `meal_sessions`, provided all daily-summary and authorization queries are updated accordingly.

## Profile

The user profile includes:

- age
- sex
- height
- weight
- activity level

These values are used only where required by the official nutrition reference.

## Daily Sessions

Day sessions follow the calendar for history and daily nutrition tracking, but the app uses a 5:00 AM rollover boundary to avoid forcing late-night users into a new day at midnight.

The user always starts a new day manually. The app never creates a new day session automatically, because starting a day should be an intentional action rather than a task imposed by the app.

A new day cannot be started before 5:00 AM local time. Before 5:00 AM, the previous calendar day's session remains the active session if it has not been finished.

Users can finish the day manually at any time. Finishing the day closes the session and makes its final daily summary available.

If the user does not finish the day manually, the previous day's session is automatically considered closed after 5:00 AM local time. V1 may implement this with lazy auto-close: if the website is not open at 5:00 AM, the session is closed the next time the user opens the app or makes a relevant request after the cutoff.

After a previous day has been closed, the interface can show a **View Previous Day Summary** action. The next day's session is still not created until the user chooses **Start New Day**.

Each day session remains associated with its calendar date for history, so users can review nutrition records by date without custom session boundaries making the calendar ambiguous.

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

Users can choose **Finish the Day** to close the current session and view its final summary. If they do not finish manually, the previous day's session is considered closed after the 5:00 AM local cutoff.

After a session has closed, the app can surface a **View Previous Day Summary** action when the user returns.

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
