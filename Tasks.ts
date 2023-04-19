import "./Utils & Constants";

/**
 * Generates Tasks from the selected meals (mon - fri) in the "Weekly Meal Plan" sheet
*/
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
        date.setDate(date.getDate() + index);
        console.log(index.toLocaleString(), date);
        try {
          task.due = date.toISOString();
          task = Tasks.Tasks.update(task, mealPlanTaskList.id, task.id);
        } catch (err) { errs.push(err); }
      });
    });
  // console.log(errs)
}

/**
 * Generates new tasks from ingredients as a child of the given parent task
 * @param parentTask The parent Task to
 * @param ingredientsArr The ingredients
 */
const ingredientsToSubTasks = (parentTask: GoogleAppsScript.Tasks.Schema.Task, ingredientsArr: Array<string>) => {
  const taskList = GetTaskList(MealPlansTaskName);
  ingredientsArr.forEach(ingredient => {
    let ingredientTask = Tasks.newTask();
    ingredientTask.title = ingredient;
    ingredientTask = Tasks.Tasks.insert(ingredientTask, taskList.id, { parent: parentTask.id });
  });
};

/**
 * Generates Tasks for each given day
 * @param dayCol Day sheet column number (A is 1, B is 2, etc.)
 * @returns Array of created Tasks
 */
function CreateSubTasks(dayCol: number) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Weekly Meal Plan");
  const taskList = GetTaskList(MealPlansTaskName);

  const createMealTask = (mealRow: number, dbCol: number): GoogleAppsScript.Tasks.Schema.Task => {
    let task = Tasks.newTask();
    task.title = sheet.getRange(mealRow, dayCol).getValue();
    // If the meal name is the default value (e.g. Lunch is Lunch), don't make task
    if (task.title == sheet.getRange(mealRow, dayCol - 1).getValue()) return;
    task = Tasks.Tasks.insert(task, taskList.id);
    ingredientsToSubTasks(task, GetIngredients(task.title, dbCol));
    return task;
  };

  let treatTask = createMealTask(TreatRow, TreatsDBCol);
  let snacksTask = createMealTask(SnacksRow, SnacksDBCol);
  let dinnerSideTask = createMealTask(DinnerSideRow, SidesDBCol);
  let dinnerTask = createMealTask(DinnerRow, DinnerDBCol);
  let lunchSideTask = createMealTask(LunchSideRow, SidesDBCol);
  let lunchTask = createMealTask(LunchRow, LunchDBCol);
  let breakfastTask = createMealTask(BreakfastRow, BreakfastDBCol);

  // Add artificial sleep so we don't exceed quota 
  Utilities.sleep(750);
  return [ breakfastTask, lunchTask, lunchSideTask, dinnerTask, dinnerSideTask, snacksTask, treatTask ];
}

/**
 * Grabs or creates a TaskList with the MealPlansTaskName
 * @returns The created or grabbed TaskList
 */
function GetOrCreateMealPlanTaskList() {
  try { return GetTaskList(MealPlansTaskName); }
  catch {
    const mealPlanTaskList = Tasks.newTaskList();
    mealPlanTaskList.title = MealPlansTaskName;
    Tasks.Tasklists.insert(mealPlanTaskList);
    return GetTaskList(MealPlansTaskName);
  }
}

/**
 * Grabs the TaskList with the given name, if it exists
 * @param taskListName 
 * @returns TaskList, if it exists
 */
function GetTaskList(taskListName: string) {
  const taskList = Tasks.Tasklists.list().items.find(taskList => taskList.title == taskListName);
  if (taskList == undefined) throw new Error(`${taskListName} could not be found`);
  return taskList;
}

/**
 * Grabs the Task with the given name, if it exists
 * @param taskName 
 * @param taskListName The parent TaskList name
 * @returns Task, if it exists
 */
function GetTask(taskName: string, taskListName: string) {
  const task = Tasks.Tasks.list(GetTaskList(taskListName).id).items.find(task => task.title == taskName);
  if (task == undefined) throw new Error(`${taskName} could not be found`);
  return task;
}

/**
 * Grabs ingredients from the Database sheet given the database column
 * @param mealName The meal name to grab ingredients from
 * @param dbColumn The Database column to grab ingredients from
 * @returns Array<string> of ingredients 
 */
function GetIngredients(mealName: string, dbColumn: number): Array<string> {
  const ingredientSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Database");
  const ingredientRange = ingredientSheet.getRange(2, dbColumn, ingredientSheet.getLastRow(), 2);

  let ingredients = new Array<string>();
  ingredientRange
    .getValues()
    .forEach(row => {
      if (row[ 0 ] != mealName) return;
      else ingredients.push(row[ 1 ]);
    });
  return ingredients.sort().reverse();
}
