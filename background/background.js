// Eye reminders every 20 minutes (testing: 2)
// Posture reminders every 65 minutes (testing: 5)
const EYE_INTERVAL = 20;
const POSTURE_INTERVAL = 65;

// Minute counter persisted across restarts
let eyeCounter = 0;

/*
 Restore counter when service worker starts
*/
chrome.storage.local.get({ eyeCounter: 0 }, (data) => {
  eyeCounter = data.eyeCounter;
});

/*
 Create alarm when extension is installed
*/
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("minuteTick", { periodInMinutes: 1 });
});

/*
 Recreate alarm on browser startup (MV3 safety)
*/
chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.create("minuteTick", { periodInMinutes: 1 });
});

/*
 Core timer logic
 Runs once every minute
*/
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== "minuteTick") return;

  eyeCounter++;
  chrome.storage.local.set({ eyeCounter });

  chrome.storage.local.get(
    {
      eyeEnabled: true,
      postureEnabled: true,
      showPosture: false,
      snoozeUntil: 0
    },
    (prefs) => {

      // ⏸️ Respect snooze
      if (Date.now() < prefs.snoozeUntil) {
        return;
      }

      const isEyeTime =
        prefs.eyeEnabled && eyeCounter % EYE_INTERVAL === 0;

      const isPostureTime =
        prefs.postureEnabled && eyeCounter % POSTURE_INTERVAL === 0;

      // If posture popup is already active, do nothing
      // if (prefs.showPosture) return;

      // 🪑 Posture has priority
      if (isPostureTime) {
        chrome.storage.local.set({
          showPosture: true,
          showEye: false
        });
        chrome.action.openPopup();
        return;
      }

      // 👀 Eye reminder (only if posture not active)
      if (isEyeTime) {
        chrome.storage.local.set({ showEye: true });
        chrome.action.openPopup();
      }
    }
  );
});
