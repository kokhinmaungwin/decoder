// main.js
import { decodeByType } from "./user.js";

const inputArea = document.getElementById("input");
const outputArea = document.getElementById("output");
const decodeBtn = document.getElementById("decodeBtn");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
let selectedDecodeType = "base64";

// ✅ ONLY option circles
const optionCircles = document.querySelectorAll(".circle.option");
optionCircles.forEach(circle => {
  circle.addEventListener("click", () => {
    optionCircles.forEach(c => c.classList.remove("active"));
    circle.classList.add("active");
    selectedDecodeType = circle.dataset.type;
    console.log("Selected type:", selectedDecodeType);
  });
});

// Button Actions
decodeBtn.onclick = async () => {
  const input = inputArea.value.trim();
  const decodeType = selectedDecodeType;

  console.log("[Decode click]", decodeType, input);

  if (!input) {
    outputArea.textContent = "⚠️ Please enter encoded text to decode!";
    return;
  }

  try {
    const res = await decodeByType(input, decodeType);
    console.log("[Decode result]", res);

    outputArea.textContent =
      "// Packers used:\n" +
      (res.history?.length ? res.history.map(p => "✔ " + p).join("\n") : "None") +
      "\n\n" +
      res.code;

  } catch (err) {
    outputArea.textContent = "❌ Decoding failed: " + err.message;
    console.error(err);
  }
};
copyBtn.onclick = () => {
  if (!outputArea.textContent) return;
  
  navigator.clipboard.writeText(outputArea.textContent)
    .then(() => alert("Copied to clipboard!"))
    .catch(() => alert("Copy failed."));
};

clearBtn.onclick = () => {
  inputArea.value = "";
  outputArea.textContent = "";
};

const installBtn = document.getElementById('installBtn');
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') {
    console.log('User accepted the install prompt');
  } else {
    console.log('User dismissed the install prompt');
  }
  deferredPrompt = null;
  installBtn.style.display = 'none';
});
