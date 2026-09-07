# User Stories

## Story 1: Start a Daily Session

As a user, I want to start a new day so that the app can track today's food separately from previous days.

### Acceptance Criteria

- The user can start a new day manually.
- Starting a new day creates a new active day session.
- Food entered after that point belongs to the active session.
- Starting another new day closes the previous session and begins a fresh one.

## Story 2: Log Food

As a user, I want to add foods and approximate amounts throughout the day so that the app can keep a running record of what I have eaten.

### Acceptance Criteria

- The user can search for a food.
- The user can select the correct food result.
- The user can enter an amount and unit.
- The app stores the selected food under the active day session.
- The user can add more food later without re-entering earlier records.

## Story 3: Review Nutrient Intake

As a user, I want to see my recorded nutrient intake, the recommended daily amount, and how much I still need so that I can understand what remains for the day.

### Acceptance Criteria

- The app calculates nutrient intake from all foods in the active day session.
- The app shows the amount consumed for each tracked nutrient.
- The app shows the official recommended daily amount.
- The app calculates and shows the remaining amount.
- Remaining values are shown in the nutrient's normal unit, such as g, mg, or mcg.

## Story 4: Get Food Suggestions

As a user, I want food suggestions with practical amounts so that I know what and how much I could eat to cover my remaining nutrient needs.

### Acceptance Criteria

- The app suggests foods for nutrients that still have a remaining need.
- Each suggestion includes a food amount, not only a food name.
- Suggested amounts are calculated from nutrient data rather than fixed manually.
- The app shows a small set of suggestions by default.
- The user can request more food options.
- The app avoids suggesting impractical amounts when possible.

## Story 5: Review the Day

As a user, I want a summary based on the foods I logged so that I can review my recorded intake before starting a new day.

### Acceptance Criteria

- The summary lists the foods recorded in the current day session.
- The summary is based only on foods the user actually logged.
- The user can add missing food entries before starting a new day.
- Adding food automatically recalculates the summary.
- If no more food is added, the existing summary remains unchanged.
- Starting a new day archives the current session and begins a fresh calculation.
