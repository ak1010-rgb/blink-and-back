import { eyeRules } from "../data/eyeRules.js";
import { postureRules } from "../data/postureRules.js";

const title = document.getElementById("title");
const content = document.getElementById("content");
const nextBtn = document.getElementById("nextBtn");
const snoozeBtn = document.getElementById("snoozeBtn");

const eyeToggle = document.getElementById("eyeToggle");
const postureToggle = document.getElementById("postureToggle");

let step = 1;

/* ---------------- TOGGLES ---------------- */

// Load user preferences
chrome.storage.local.get(
  { eyeEnabled: true, postureEnabled: true },
  (prefs) => {
    eyeToggle.checked = prefs.eyeEnabled;
    postureToggle.checked = prefs.postureEnabled;
  }
);

// Save preferences
eyeToggle.addEventListener("change", () => {
  chrome.storage.local.set({ eyeEnabled: eyeToggle.checked });
});

postureToggle.addEventListener("change", () => {
  chrome.storage.local.set({ postureEnabled: postureToggle.checked });
});

/* ---------------- DECIDE VIEW ---------------- */

chrome.storage.local.get(["showPosture", "showEye"], (data) => {
  if (data.showPosture) {
    showPostureRule1();
  } else if (data.showEye) {
    showEye();
  } else {
    showDefault();
  }
});

/* ---------------- POSTURE ---------------- */
/* Rule 1: Quick exercises FIRST */

function showPostureRule1() {
  step = 1;
  title.innerText = postureRules.title;
  snoozeBtn.style.display = "block";

  let html = `<strong>${postureRules.rule1.heading}</strong><br><br>`;

  postureRules.rule1.exercises.forEach((exercise, index) => {
    html += `
      ${exercise.name}<br>
      <button class="learn-btn" data-index="${index}">
        Learn
      </button><br><br>
    `;
  });

  content.innerHTML = html;
  nextBtn.innerText = "Next";
  nextBtn.style.display = "block";

  // Learn buttons for Rule 1
  document.querySelectorAll(".learn-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = btn.getAttribute("data-index");
      chrome.tabs.create({
        url: postureRules.rule1.exercises[idx].url
      });
    });
  });
}

/* Rule 2: Walk / stairs SECOND */

function showPostureRule2() {
  title.innerText = postureRules.title;
  snoozeBtn.style.display = "block";

  content.innerHTML = `
    <strong>${postureRules.rule2.heading}</strong><br><br>
    ${postureRules.rule2.text}
  `;

  nextBtn.innerText = "Done";
}

/* ---------------- EYE ---------------- */

function showEye() {
  title.innerText = eyeRules.title;
  snoozeBtn.style.display = "block";

  content.innerHTML = eyeRules.rules
    .map(rule => `${rule}<br><br>`)
    .join("");

  nextBtn.innerText = "Done";
  nextBtn.style.display = "block";
}

/* ---------------- DEFAULT ---------------- */

function showDefault() {
  title.innerText = "Blink & Back";
  content.innerHTML = `
    Stay healthy while working 💪<br><br>
    ⭐ Eye reminder every 20 minutes<br>
    ⭐ Posture reminder every 65 minutes
  `;
  nextBtn.style.display = "none";
  snoozeBtn.style.display = "none";
}

/* ---------------- BUTTONS ---------------- */

// Next / Done
nextBtn.addEventListener("click", () => {
  if (step === 1 && title.innerText === postureRules.title) {
    step = 2;
    showPostureRule2();
    return;
  }

  chrome.storage.local.remove(["showPosture", "showEye"]);
  window.close();
});

// Snooze (5 minutes)
snoozeBtn.addEventListener("click", () => {
  chrome.storage.local.set({
    snoozeUntil: Date.now() + 5 * 60 * 1000
  });

  chrome.storage.local.remove(["showPosture", "showEye"]);
  window.close();
});
// Handle popup auto-close (user clicked outside)
window.addEventListener("unload", () => {
  chrome.storage.local.remove(["showPosture", "showEye"]);
});
