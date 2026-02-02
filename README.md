# Blink & Back 🧠💻

Blink & Back is a Chrome Extension designed to encourage healthier screen habits by providing smart eye and posture reminders during long computer usage.

## ✨ Features
- 👀 Eye reminders every 20 minutes (20-20-20 rule + blinking)
- 🪑 Posture reminders every 65 minutes with a movement-first approach
- ⏸️ Snooze reminders for 5 minutes
- 🎯 Priority handling to avoid reminder collisions
- 🔁 Persistent timers across browser restarts
- 🔗 Guided posture exercises with per-exercise Learn links (YouTube Shorts)
- ⚙️ User-controlled toggles for eye and posture reminders

## 🛠️ Tech Stack
- JavaScript (ES Modules)
- Chrome Extensions (Manifest V3)
- Chrome Alarms API
- Chrome Storage API
- HTML & CSS

## 📂 Project Structure



## ⚙️ How It Works
- A background service worker tracks time using a minute-based alarm.
- Eye and posture reminders are scheduled at fixed intervals.
- Posture reminders are intentionally offset and prioritized to reduce overlap.
- Users can snooze or dismiss reminders freely.
- Reminder state is safely cleared if the popup is dismissed unintentionally.

## 🧪 Local Testing
1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the project folder

For testing, reminder intervals can be temporarily reduced.

## 📌 Status
This project is fully functional and ready for Chrome Web Store submission.  
Publishing is planned for a future update.

## 📜 License
MIT
