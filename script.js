const themeOptions = [
  "Space",
  "Cyberpunk",
  "Retro",
  "Minimalist",
  "Nature",
  "Futuristic",
  "Mystery",
  "Adventure",
  "Fantasy",
  "Neon",
  "Steampunk",
  "Cartoon",
  "Abstract",
  "Luxury",
  "Tech",
  "Pop Art",
  "Street",
  "Surreal",
  "Anime",
  "Pixel Art",
];

const featuresOptions = [
  "Real-time Chat",
  "Push Notifications",
  "File Upload & Storage",
  "Payment Processing",
  "Social Media Integration",
  "Email Automation",
  "Maps & Geolocation",
  "Data Visualization",
  "Advanced Search",
  "Admin Dashboard",
  "REST API",
  "GraphQL API",
  "Multi-language Support",
  "Video/Audio Calls",
  "Calendar Integration",
  "Analytics & Reporting",
  "Data Export/Import",
  "Machine Learning",
  "AI Integration",
  "Blockchain Features",
  "IoT Connectivity",
  "Progressive Web App",
  "Accessibility Features",
  "SEO Optimization",
  "Content Management",
  "Subscription Management",
  "Team Collaboration",
  "Version Control",
];

let selectedTheme = null;
let selectedFeatures = [];

const themeContainer = document.getElementById("themeContainer");
const featuresContainer = document.getElementById("featuresContainer");
const generateBtn = document.getElementById("generateBtn");
const generateBtnText = document.getElementById("generateBtnText");
const loadingSpinner = document.getElementById("loadingSpinner");
const resultCard = document.getElementById("resultCard");
const aiResponse = document.getElementById("aiResponse");
const copyBtn = document.getElementById("copyBtn");
const generateAnotherBtn = document.getElementById("generateAnotherBtn");
const customGoal = document.getElementById("customGoal");
const md = window.markdownit();

function init() {
  populateThemes();
  populateFeatures();
  setupEventListeners();
}

function populateThemes() {
  themeOptions.forEach((theme) => {
    const button = createSelectableButton(
      theme,
      () => selectTheme(theme),
      "indigo",
    );
    themeContainer.appendChild(button);
  });
}

function populateFeatures() {
  featuresOptions.forEach((feature) => {
    const button = createSelectableButton(
      feature,
      () => toggleFeature(feature),
      "purple",
    );
    featuresContainer.appendChild(button);
  });
}

function createSelectableButton(text, onClick, color) {
  const button = document.createElement("button");
  button.textContent = text;
  button.className = `px-4 py-3 text-sm font-medium text-slate-600 bg-white border-2 border-slate-200 rounded-xl hover:border-${color}-300 hover:bg-${color}-50 transition-all duration-200 shadow-sm hover:shadow-md`;
  button.onclick = onClick;
  return button;
}

function selectTheme(theme) {
  selectedTheme = theme;
  Array.from(themeContainer.children).forEach((btn) => {
    btn.className =
      "px-4 py-3 text-sm font-medium text-slate-600 bg-white border-2 border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 shadow-sm hover:shadow-md";
  });
  event.target.className =
    "px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 border-2 border-indigo-600 rounded-xl shadow-md transform scale-105 transition-all duration-200";
}

function toggleFeature(feature) {
  const button = event.target;
  if (selectedFeatures.includes(feature)) {
    selectedFeatures = selectedFeatures.filter((f) => f !== feature);
    button.className =
      "px-4 py-3 text-sm font-medium text-slate-600 bg-white border-2 border-slate-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 shadow-sm hover:shadow-md";
  } else {
    if (selectedFeatures.length >= 3) {
      showNotification("You can only select up to 3 core features.", "warning");
      return;
    }
    selectedFeatures.push(feature);
    button.className =
      "px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 border-2 border-purple-600 rounded-xl shadow-md transform scale-105 transition-all duration-200";
  }
}

function setupEventListeners() {
  generateBtn.addEventListener("click", generateAppIdea);
  generateAnotherBtn.addEventListener("click", generateAppIdea);
  copyBtn.addEventListener("click", copyToClipboard);
}

async function generateAppIdea() {
  if (!selectedTheme) {
    showNotification("Please select a theme for your app idea.", "warning");
    return;
  }

  setLoadingState(true);

  try {
    const prompt = buildPrompt();
    const response = await callHackClubAI(prompt);
    displayResponse(response);
  } catch (error) {
    console.error("Error generating app idea:", error);
    displayError();
  } finally {
    setLoadingState(false);
  }
}

function buildPrompt() {
  let prompt = `Come up with a unique APP concept with a ${selectedTheme || "random"} theme.`;

  if (selectedFeatures.length > 0) {
    prompt += ` Include these features: ${selectedFeatures.join(", ")}.`;
  }

  return prompt;
}

async function callHackClubAI(prompt, retries = 5) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);
  try {
    const response = await fetch("https://ai.hackclub.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      throw new Error("Failed to get AI response");
    }
    const data = await response.json();
    let aiContent =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't process that request.";
    if (aiContent.includes("</think>")) {
      aiContent = aiContent.split("</think>")[1].trim();
    }
    aiContent = aiContent.replace(/<think>[\s\S]*?<\/think>/, "").trim();
    return md.render(aiContent);
  } catch (error) {
    clearTimeout(timeoutId);
    if (retries > 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return callHackClubAI(prompt, retries - 1);
    }
    throw error;
  }
}

function displayResponse(response) {
  aiResponse.innerHTML = formatResponse(response);
  resultCard.classList.remove("hidden");
  resultCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

function formatResponse(text) {
  return text
    .replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="text-slate-800 font-bold">$1</strong>',
    )
    .replace(/\*(.*?)\*/g, '<em class="text-slate-700 italic">$1</em>')
    .replace(
      /#{3}\s*(.*?)$/gm,
      '<h3 class="text-xl font-bold text-slate-800 mt-6 mb-3 border-b-2 border-blue-200 pb-2">$1</h3>',
    )
    .replace(
      /#{2}\s*(.*?)$/gm,
      '<h2 class="text-2xl font-bold text-slate-800 mt-8 mb-4 text-blue-700">$1</h2>',
    )
    .replace(
      /#{1}\s*(.*?)$/gm,
      '<h1 class="text-3xl font-bold text-slate-800 mt-8 mb-6 text-purple-700">$1</h1>',
    )
    .replace(
      /^\d+\.\s*(.*?)$/gm,
      '<div class="flex items-start mb-3"><span class="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full mr-3 mt-0.5 flex-shrink-0">•</span><span>$1</span></div>',
    )
    .replace(
      /^-\s*(.*?)$/gm,
      '<div class="flex items-start mb-2"><span class="text-purple-600 mr-3 mt-1">▸</span><span>$1</span></div>',
    )
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/\n/g, "<br>")
    .replace(/^/, '<p class="mb-4">')
    .replace(/$/, "</p>");
}

function displayError() {
  aiResponse.innerHTML = `
    <div class="text-center py-8">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-red-800 mb-2">Generation Failed</h3>
      <p class="text-red-600 mb-4">We tried 3 times but encountered an issue while generating your app idea. Please try again.</p>
      <button onclick="generateAppIdea()" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
        Try Again
      </button>
    </div>
  `;
  resultCard.classList.remove("hidden");
}

function setLoadingState(isLoading) {
  if (isLoading) {
    generateBtn.disabled = true;
    generateBtnText.classList.add("hidden");
    loadingSpinner.classList.remove("hidden");
  } else {
    generateBtn.disabled = false;
    generateBtnText.classList.remove("hidden");
    loadingSpinner.classList.add("hidden");
  }
}

async function copyToClipboard() {
  try {
    const textToCopy = aiResponse.textContent || aiResponse.innerText;
    await navigator.clipboard.writeText(textToCopy);

    const originalContent = copyBtn.innerHTML;
    copyBtn.innerHTML = `
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                        <span class="ml-2">Copied!</span>
                    `;
    copyBtn.classList.remove(
      "bg-slate-100",
      "hover:bg-slate-200",
      "text-slate-700",
    );
    copyBtn.classList.add("bg-green-100", "text-green-700");

    setTimeout(() => {
      copyBtn.innerHTML = originalContent;
      copyBtn.classList.add(
        "bg-slate-100",
        "hover:bg-slate-200",
        "text-slate-700",
      );
      copyBtn.classList.remove("bg-green-100", "text-green-700");
    }, 2000);
  } catch (err) {
    console.error("Failed to copy text: ", err);
    showNotification("Failed to copy to clipboard", "error");
  }
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  const bgColor =
    type === "warning"
      ? "bg-yellow-500"
      : type === "error"
        ? "bg-red-500"
        : "bg-blue-500";

  notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

document.addEventListener("DOMContentLoaded", init);
