const MealPlansTaskName = "Meal Plans";
// const NoIncludeTBD = "TBD";

// Meals / Sides
const BreakfastRow = 2;
const LunchRow = 4;
const LunchSideRow = 5;
const DinnerRow = 7;
const DinnerSideRow = 8;
const SnacksRow = 10;
const TreatRow = 12;

// Week Days
const MondayCol = 1;
const TuesdayCol = 4;
const WednesdayCol = 7;
const ThursdayCol = 10;
const FridayCol = 13;

// Database
const BreakfastDBCol = 1;
const LunchDBCol = 4;
const DinnerDBCol = 7;
const SidesDBCol = 10;
const SnacksDBCol = 13;
const TreatsDBCol = 16;

function getNextMonday() {
  var nextMonday = new Date();
  nextMonday.setDate(nextMonday.getDate() + (7 - nextMonday.getDay()) % 7 + 1);
  return nextMonday;
}

function logNextMonday() {
  console.log(getNextMonday());
}