const MealPlansTaskName = "Meal Plans";
const NoIncludeTBD = "TBD";
const LunchRow = 2;
const DinnerRow = 4;
const SnacksRow = 6;
const TreatRow = 8;

const MondayCol = 2;
const TuesdayCol = 6;
const WednesdayCol = 10;
const ThursdayCol = 14;
const FridayCol = 18;

const LunchAndDinnerDBCol = 1;
const SnacksDBCol = 4;
const TreatsDBCol = 7;

function getNextMonday() {
  var nextMonday = new Date();
  nextMonday.setDate(nextMonday.getDate() + (7 - nextMonday.getDay()) % 7 + 1);
  return nextMonday;
}

function logNextMonday() {
  console.log(getNextMonday())
}