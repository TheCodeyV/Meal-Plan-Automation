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
const MondayCol = 2;
const TuesdayCol = 5;
const WednesdayCol = 8;
const ThursdayCol = 11;
const FridayCol = 14;

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