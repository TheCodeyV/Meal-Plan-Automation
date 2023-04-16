function getGoogleKeepService_() {
  return OAuth2.createService("Google Keep Login")
    .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
    .setTokenUrl('https://accounts.google.com/o/oauth2/token')
    .setClientId("991598991884-r8boj3d196fii3t6600a3t1ljh57ue95.apps.googleusercontent.com")
    .setClientSecret("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")
    .setCallbackFunction('authCallback')
    .setScope("https://www.googleapis.com/auth/drive")
    // .setScope("https://www.googleapis.com/auth/keep")
    // .setParam('prompt', 'consent')
    .setPropertyStore(PropertiesService.getUserProperties())
    .setCache(CacheService.getUserCache());
}

function showSidebar() {
  var driveService = getGoogleKeepService_();
  var authorizationUrl = driveService.getAuthorizationUrl();
  var template = HtmlService.createTemplate(
    '<a href="<?= authorizationUrl ?>" target="_blank">Authorize</a>. ' +
    'Reopen the sidebar when the authorization is complete.');
  template.authorizationUrl = authorizationUrl;
  console.log(authorizationUrl)
  var page = template.evaluate();
  SpreadsheetApp.getUi().showSidebar(page);
}

function authCallback(request) {
  var driveService = getGoogleKeepService_();
  var isAuthorized = driveService.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('Success! You can close this tab.');
  } else {
    return HtmlService.createHtmlOutput('Denied. You can close this tab');
  }
}