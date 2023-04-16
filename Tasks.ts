import "./Utils & Constants";

// Main function
async function CreateMealPlanTasks() {
  // Main task
  const mealPlanTaskList = GetOrCreateMealPlanTaskList();
  // const nextMondayDate = getNextMonday();

  // Sub tasks
  const fridaySubTasks = CreateSubTasks(FridayCol);
  const thursdaySubTasks = CreateSubTasks(ThursdayCol);
  const wednesdaySubTasks = CreateSubTasks(WednesdayCol);
  const tuesdaySubTasks = CreateSubTasks(TuesdayCol);
  const mondaySubTasks = CreateSubTasks(MondayCol);

  let errs = new Array();
  // Add artificial sleep so we don't exceed quota 
  Utilities.sleep(7500);

  [ mondaySubTasks, tuesdaySubTasks, wednesdaySubTasks, thursdaySubTasks, fridaySubTasks ]
    .forEach((daySubTasks, index) => {
      daySubTasks.forEach((task) => {
        let date = getNextMonday();
        date.setDate(date.getDate() + index - 1);
        console.log(index.toLocaleString(), date);
        task.due = date.toISOString();
        try { task = Tasks.Tasks.update(task, mealPlanTaskList.id, task.id); } catch (err) { errs.push(err); }
      });
    });
  // console.log(errs)
}

const ingredientsToSubTasks = (parentTask, ingredientsArr) => {
  const taskList = GetTaskList(MealPlansTaskName);
  ingredientsArr.forEach(ingredient => {
    let ingredientTask = Tasks.newTask();
    ingredientTask.title = ingredient;
    ingredientTask = Tasks.Tasks.insert(ingredientTask, taskList.id, { parent: parentTask.id });
    // console.log(parentTask)
    // console.log(ingredientTask)
  });
};


function CreateSubTasks(dayCol) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Weekly Meal Plan");
  const taskList = GetTaskList(MealPlansTaskName);

  let treatTask = Tasks.newTask();
  treatTask.title = sheet.getRange(TreatRow, dayCol).getValue();
  if (treatTask.title != NoIncludeTBD) {
    treatTask = Tasks.Tasks.insert(treatTask, taskList.id);
    ingredientsToSubTasks(treatTask, GetIngredients(treatTask.title, TreatsDBCol));
  }

  let snacksTask = Tasks.newTask();
  snacksTask.title = sheet.getRange(SnacksRow, dayCol).getValue();
  if (snacksTask.title != NoIncludeTBD) {
    snacksTask = Tasks.Tasks.insert(snacksTask, taskList.id);
    ingredientsToSubTasks(snacksTask, GetIngredients(snacksTask.title, SnacksDBCol));
  }

  let dinnerTask = Tasks.newTask();
  dinnerTask.title = sheet.getRange(DinnerRow, dayCol).getValue();
  if (dinnerTask.title != NoIncludeTBD) {
    dinnerTask = Tasks.Tasks.insert(dinnerTask, taskList.id);
    ingredientsToSubTasks(dinnerTask, GetIngredients(dinnerTask.title, LunchAndDinnerDBCol));
  }

  let lunchTask = Tasks.newTask();
  lunchTask.title = sheet.getRange(LunchRow, dayCol).getValue();
  if (lunchTask.title != NoIncludeTBD) {
    lunchTask = Tasks.Tasks.insert(lunchTask, taskList.id);
    ingredientsToSubTasks(lunchTask, GetIngredients(lunchTask.title, LunchAndDinnerDBCol));
  }
  // Add artificial sleep so we don't exceed quota 
  Utilities.sleep(750);
  return [ lunchTask, dinnerTask, snacksTask, treatTask ];
}

function GetOrCreateMealPlanTaskList() {
  try { return GetTaskList(MealPlansTaskName); }
  catch {
    const mealPlanTaskList = Tasks.newTaskList();
    mealPlanTaskList.title = MealPlansTaskName;
    Tasks.Tasklists.insert(mealPlanTaskList);
    return GetTaskList(MealPlansTaskName);
  }
}

function GetTaskList(taskListName) {
  const taskList = Tasks.Tasklists.list().items.find(taskList => taskList.title == taskListName);
  if (taskList == undefined) throw new Error(`${taskListName} could not be found`);
  return taskList;
}

function GetTask(taskName, taskListName) {
  const task = Tasks.Tasks.list(GetTaskList(taskListName).id).items.find(task => task.title == taskName);
  if (task == undefined) throw new Error(`${taskName} could not be found`);
  return task;
}

function GetIngredients(mealName, dbColumn) {
  const ingredientSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Database");
  const ingredientRange = ingredientSheet.getRange(2, dbColumn, ingredientSheet.getLastRow(), 2);

  let ingredients = new Array();
  ingredientRange
    .getValues()
    .forEach(row => {
      if (row[ 0 ] != mealName) return;
      else ingredients.push(row[ 1 ]);
    });
  return ingredients.sort().reverse();
}
