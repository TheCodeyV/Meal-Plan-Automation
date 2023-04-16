function onOpen(e) {
  SpreadsheetApp.getUi()
    .createMenu("Automation")
    // .addItem("Login to Google OAuth2.0", "showSidebar")
    .addItem("Create Meal Plan Tasks", "CreateMealPlanTasks")
    .addToUi();
}