ALTER TABLE meals
RENAME TO meal_sessions;

ALTER TABLE food_entries
RENAME COLUMN meal_id TO meal_session_id;