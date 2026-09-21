# User Stories

These user stories define the core V1 user flows and acceptance criteria. The project brief remains the main product reference; this file focuses on user behavior and what counts as complete.

## Story 1: Start a Daily Session

As a user, I want to start a new day intentionally so that I can begin tracking food when I am ready, without the app creating a new day for me automatically.

### Acceptance Criteria

- A day session is associated with a calendar date.
- The user must explicitly choose **Start New Day** to create a new day session.
- The app never creates a new day session automatically.
- **Start New Day** is not available before 5:00 AM local time.
- At or after 5:00 AM, the user can start the current calendar day's session if one does not already exist.
- Only one day session can exist for the same user and calendar date.
- If the previous day's session is still unfinished after the 5:00 AM cutoff, it is considered closed before a new day is started.

## Story 2: Create Meals and Log Food

As a user, I want to group foods into separate meals and log approximate amounts so that I can see what I ate in each meal as well as across the whole day.

### Acceptance Criteria

- The user can create multiple meal sessions inside the active day.
- The user can add foods to a specific meal.
- Each food entry stores its food name, amount, unit, and calculated nutrient data.
- A food entry belongs to the selected meal session and its parent day session.
- Foods logged in one meal do not appear as foods in another meal.
- The user can continue adding foods to an existing meal later.
- The user can delete an incorrect food entry.
- The user can delete a meal, including the food entries contained in that meal.

## Story 3: Review Meal Nutrition

As a user, I want to see the nutrient subtotal for each meal so that I can understand what that meal contributed to my intake.

### Acceptance Criteria

- After food is added, the meal displays the foods currently logged in that meal.
- The app calculates the meal's nutrient subtotal from only the food entries in that meal.
- Nutrients with the same nutrient key are added together within the meal.
- Meal nutrition updates when food is added or removed.
- The interface can show a defined set of key nutrients by default and support additional tracked nutrients as the product expands.

## Story 4: View Daily Remaining Nutrition

As a user, I want to check how much nutrition I still need for the day so that I can decide what to eat next.

### Acceptance Criteria

- Daily intake is calculated from all foods in all meals belonging to the active day session.
- For tracked nutrients, the app can show consumed amount, daily target, and remaining amount.
- Daily targets are personalized when the user has completed the required profile information.
- If the user has no complete profile, food logging and meal nutrition still work, but personalized remaining values are unavailable.
- Daily remaining nutrition is not required to be permanently visible on every meal.
- The user can choose to reveal the current daily remaining values when needed.
- Displayed numeric values are formatted for readability rather than exposing floating-point artifacts.

## Story 5: Finish or Automatically Close the Day

As a user, I want to finish a day when I am done logging so that I can review a final summary without being forced into a new day at midnight.

### Acceptance Criteria

- The user can choose **Finish the Day** to close the active day session manually.
- Finishing the day makes the final daily summary available.
- Midnight does not automatically create a new day session.
- If the user does not finish manually, the previous day's session is considered closed after 5:00 AM local time.
- V1 may use lazy auto-close: if the app is not open at 5:00 AM, the session is closed the next time the user opens the app or makes a relevant request after the cutoff.
- Automatic closing does not automatically create the next day.
- After the previous day is closed, the app can show a **View Previous Day Summary** action.
- The next day begins only after the user explicitly chooses **Start New Day**.

## Story 6: Get Food Suggestions

As a user, I want practical food suggestions for nutrients I still need so that I do not have to search elsewhere for what to eat.

### Acceptance Criteria

- The app identifies nutrients that still have a remaining need.
- The app suggests foods that can help cover those needs.
- Each suggestion includes a practical food amount, not only a food name.
- Suggested amounts are calculated from nutrient data rather than fixed manually.
- A small set of suggestions is shown first.
- The user can request more food options.
- The app avoids impractical serving amounts when possible.

## Story 7: Review Daily History

As a user, I want to review previous days by calendar date so that I can understand my nutrition over time.

### Acceptance Criteria

- Finished or automatically closed day sessions remain associated with their calendar date.
- The user can browse previous day sessions by date.
- A daily summary is calculated from the foods actually logged for that day.
- The summary can show consumed amounts, daily targets, and remaining amounts where personalized targets are available.
- The user can also review individual food-entry history.
- Crossing midnight does not cause previous-day records to be reassigned to an ambiguous custom session.
