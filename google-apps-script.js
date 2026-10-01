/**
 * Google Apps Script for Dynamic Consultation Inquiry Lead Capture
 * Marcella Mission Therapy — Holistic, Relational & Integrative Psychotherapy
 *
 * Instructions:
 * 1. Open your Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Replace all code with this script.
 * 4. To TEST locally in the Apps Script editor:
 *    - Select "testDoPost" from the function dropdown at the top.
 *    - Click "▷ Run". Check the Execution Log (View > Execution log) to verify row insertion.
 * 5. To DEPLOY as Web App:
 *    - Click "Deploy" > "New deployment".
 *    - Select type: "Web app".
 *    - Description: "Marcella Mission Therapy Inquiry Webhook"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 *    - Click "Deploy".
 *    - Copy the "Deployment ID" (e.g. AKfycbx123...).
 * 6. In your project environment (.env or Cloudflare Pages):
 *    - Set DEPLOYMENT_ID="your_deployment_id_here"
 */

/**
 * Main Webhook POST Handler
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  // Prevent concurrent write conflicts (wait up to 30 seconds)
  lock.tryLock(30000);

  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Invalid request: No postData payload received.");
    }

    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var lastRow = sheet.getLastRow();
    var lastColumn = sheet.getLastColumn();
    var headers = [];

    // Initialize default headers if sheet is brand new / blank
    if (lastRow === 0 || lastColumn === 0) {
      headers = ["Timestamp", "Recipient"];
      sheet.appendRow(headers);
      sheet
        .getRange(1, 1, 1, headers.length)
        .setFontWeight("bold")
        .setBackground("#f3f4f6");
      lastRow = 1;
      lastColumn = headers.length;
    } else {
      headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
    }

    var fields = data.fields || [];
    var fieldMap = {};

    // Map field label -> value
    fields.forEach(function (f) {
      if (f.label) {
        fieldMap[f.label.trim()] = f.value;
      }
    });

    // Auto-create new column headers for any new fields added in TinaCMS
    fields.forEach(function (f) {
      var label = f.label.trim();
      if (headers.indexOf(label) === -1) {
        headers.push(label);
        sheet
          .getRange(1, headers.length)
          .setValue(label)
          .setFontWeight("bold")
          .setBackground("#f3f4f6");
      }
    });

    // Build the row matching dynamic header positions
    var row = [];
    headers.forEach(function (header) {
      var h = header.trim();
      if (h === "Timestamp" || h === "Submitted At" || h === "Date") {
        row.push(data.submittedAt ? new Date(data.submittedAt) : new Date());
      } else if (h === "Recipient") {
        row.push(data.recipient || "");
      } else if (fieldMap.hasOwnProperty(h)) {
        row.push(fieldMap[h]);
      } else {
        row.push("");
      }
    });

    // Append new inquiry lead row
    sheet.appendRow(row);
    Logger.log(
      "✅ Row inserted successfully for: " +
        (fieldMap["First Name"] || fieldMap["Your Name"] || "Lead")
    );

    // Send email notification to therapist
    if (data.recipient) {
      try {
        var emailBody =
          "🌿 New Consultation Inquiry (Marcella Mission Therapy):\n\n";
        emailBody +=
          "Submitted At: " +
          (data.submittedAt || new Date().toISOString()) +
          "\n\n";
        fields.forEach(function (f) {
          emailBody += f.label + ":\n" + (f.value || "N/A") + "\n\n";
        });

        MailApp.sendEmail({
          to: data.recipient,
          subject:
            "🌿 New Therapy Consultation Request: " +
            (fieldMap["First Name"]
              ? fieldMap["First Name"] + " " + (fieldMap["Last Name"] || "")
              : "New Client"),
          body: emailBody,
        });
        Logger.log("📧 Notification email sent to: " + data.recipient);
      } catch (mailErr) {
        Logger.log("⚠️ Email notification error: " + mailErr.toString());
      }
    }

    return ContentService.createTextOutput(
      JSON.stringify({
        status: "success",
        message: "Consultation inquiry recorded successfully",
        timestamp: new Date().toISOString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    Logger.log("❌ doPost Error: " + err.toString());
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "error",
        message: err.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Health check GET Handler
 */
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: "active",
      endpoint: "Marcella Mission Therapy - Dynamic Google Sheets Webhook",
      timestamp: new Date().toISOString(),
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

/**
 * 🧪 Local Test Function (Run within Apps Script Editor)
 */
function testDoPost() {
  Logger.log("🚀 Starting local testDoPost execution...");

  var testPayload = {
    recipient:
      Session.getActiveUser().getEmail() ||
      "marcella.mission.therapy@gmail.com",
    submittedAt: new Date().toISOString(),
    fields: [
      { label: "First Name", value: "Test Client" },
      { label: "Last Name", value: "Ariel" },
      { label: "Email Address", value: "test.client@example.com" },
      { label: "Phone Number", value: "(415) 373-6223" },
      {
        label: "Preferred Session Format",
        value: "Telehealth (Online Video across California)",
      },
      {
        label: "What is bringing you to therapy at this moment?",
        value: "Exploring life transitions and mindfulness support.",
      },
      {
        label: "Communication Consent",
        value:
          "I consent to be contacted via text or email regarding this inquiry",
      },
    ],
  };

  var mockEvent = {
    postData: {
      contents: JSON.stringify(testPayload),
    },
  };

  var response = doPost(mockEvent);
  var responseText = response.getContent();
  Logger.log("📬 Result Output: " + responseText);

  var parsed = JSON.parse(responseText);
  if (parsed.status === "success") {
    Logger.log("🎉 TEST PASSED: Consultation lead row added to Google Sheet!");
  } else {
    Logger.log("❌ TEST FAILED: " + parsed.message);
  }

  return responseText;
}
