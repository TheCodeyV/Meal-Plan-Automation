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

function ResetMeals() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Weekly Meal Plan");
  const MaxRows = TreatRow - BreakfastRow + 1;
  [ MondayCol, TuesdayCol, WednesdayCol, ThursdayCol, FridayCol ]
    .forEach(dayCol => {
      const dayrange = sheet.getRange(BreakfastRow, dayCol - 1, MaxRows, 2);
      let dayRangeValues: string[][] = dayrange.getValues();
      dayRangeValues.forEach(row => row[ 1 ] = row[ 0 ]);
      dayrange.setValues(dayRangeValues);
    });
}

function getNextMonday() {
  var nextMonday = new Date();
  nextMonday.setDate(nextMonday.getDate() + (7 - nextMonday.getDay()) % 7 + 1);
  return nextMonday;
}

function logNextMonday() {
  console.log(getNextMonday());
}