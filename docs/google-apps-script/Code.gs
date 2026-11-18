/**
 * Ashadeep Computer Institute: enquiry receiver (Google Apps Script web app)
 *
 * The website sends every enquiry here. This script
 *   1. checks the shared secret,
 *   2. saves the enquiry as a new row in the Google Sheet this script is attached to,
 *   3. emails a notification to the Ashadeep Google account.
 *
 * Setup steps are in DEPLOY.md (section "Step 2"). Nothing in this file is secret:
 * the secret lives in Project Settings > Script properties > WEBHOOK_SECRET.
 */

// Sheet tab that stores the enquiries (created automatically).
var SHEET_NAME = 'Enquiries';

// Leave empty to send the notification to the Google account that owns this script
// (the Ashadeep account). Put another address here only if you want mail elsewhere.
var NOTIFY_EMAIL = '';

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var secret = PropertiesService.getScriptProperties().getProperty('WEBHOOK_SECRET');
    var data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (!secret || data.secret !== secret) {
      return reply_({ ok: false, error: 'unauthorized' });
    }

    var name = clip_(data.name, 100);
    var mobile = clip_(data.mobile, 20);
    var course = clip_(data.course, 120);
    var message = clip_(data.message, 1000);
    var source = clip_(data.page, 60);
    if (!name || !mobile || !course) {
      return reply_({ ok: false, error: 'invalid' });
    }

    lock.waitLock(10000);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Date & time', 'Name', 'Mobile', 'Course', 'Message', 'Source']);
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([new Date(), safe_(name), safe_(mobile), safe_(course), safe_(message), safe_(source)]);

    var to = NOTIFY_EMAIL || Session.getEffectiveUser().getEmail();
    MailApp.sendEmail({
      to: to,
      subject: 'New enquiry: ' + course + ' - ' + name,
      body:
        'A new enquiry came from the website.\n\n' +
        'Name:    ' + name + '\n' +
        'Mobile:  ' + mobile + '\n' +
        'Course:  ' + course + '\n' +
        'Message: ' + (message || '-') + '\n\n' +
        'All enquiries are saved in the Google Sheet (tab "' + SHEET_NAME + '").'
    });

    return reply_({ ok: true });
  } catch (err) {
    console.error(err);
    return reply_({ ok: false, error: 'server' });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

// Opening the web app link in a browser shows this line (handy to check the deployment).
function doGet() {
  return ContentService.createTextOutput('Ashadeep enquiry endpoint is running.');
}

// Run this ONCE from the editor (Run > authorizeOnce) to give the script permission
// to use the Sheet and send mail. It does not send anything.
function authorizeOnce() {
  SpreadsheetApp.getActiveSpreadsheet();
  MailApp.getRemainingDailyQuota();
}

function clip_(value, max) {
  return String(value == null ? '' : value).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().substring(0, max);
}

// Stops spreadsheet formula injection: a cell starting with = + - @ would run as a formula.
function safe_(value) {
  value = String(value == null ? '' : value);
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
