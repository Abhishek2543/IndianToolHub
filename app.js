"use strict";

// =====================================================
// IndiaToolHub - Complete Corrected app.js
// 10 tools | Responsive UI hooks | Validation | Downloads
// =====================================================

const modal = document.getElementById("modal");
const content = document.getElementById("toolContent");

let activeTool = "";
let currentImageURL = null;

// ---------- Shared Helpers ----------

function getElement(id) {
  return document.getElementById(id);
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

// Find the result element belonging to the currently open tool.
function out(message) {
  if (!content) return;

  const result = content.querySelector("#result");
  if (result) result.innerHTML = message;
}

function money(value) {
  return "₹" + Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function showMessage(element, message) {
  if (!element) return;

  element.hidden = false;
  element.innerHTML = `<p class="tool-message">${escapeHTML(message)}</p>`;
}

function todayISO() {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
}

function clearResult(id = "result") {
  const element = getElement(id);

  if (element) {
    element.innerHTML = "";
    if ("hidden" in element) element.hidden = true;
  }
}

function toolShell(icon, title, subtitle, fields) {
  return `
    <div class="pro-tool">
      <div class="pro-tool-icon">${icon}</div>
      <h2>${title}</h2>
      ${subtitle ? `<p class="tool-subtitle">${subtitle}</p>` : ""}
      ${fields}
    </div>`;
}

function resultCards(title, cards, note = "") {
  return `
    <h3>${title}</h3>
    <div class="age-result-grid">
      ${cards.map(card => `
        <div class="age-result-card">
          <strong>${card.value}</strong>
          <span>${card.label}</span>
        </div>
      `).join("")}
    </div>
    ${note ? `<p class="age-note">${note}</p>` : ""}
  `;
}

function actionButtons(primaryText, primaryFunction, resetFunction) {
  return `
    <div class="tool-actions">
      <button type="button" onclick="${primaryFunction}()">${primaryText}</button>
      <button type="button" class="reset-btn" onclick="${resetFunction}()">Reset</button>
    </div>`;
}

async function copyText(text, message = "Copied successfully!") {
  if (!text || !text.trim()) {
    alert("Copy karne ke liye koi text nahi hai.");
    return;
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";

      document.body.appendChild(textarea);
      textarea.select();

      const success = document.execCommand("copy");
      textarea.remove();

      if (!success) throw new Error("Copy failed");
    }

    alert(message);
  } catch {
    alert("Copy nahi hua. Text ko select karke manually copy karein.");
  }
}

function fallbackCopy(text) {
  copyText(text);
}

function downloadText(text, filename) {
  const blob = new Blob([text], {
    type: "text/plain;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function resetFields(ids) {
  ids.forEach(id => {
    const element = getElement(id);
    if (element) element.value = "";
  });
}

// ---------- Open / Close Tools ----------

function openTool(type) {
  if (!modal || !content) return;

  activeTool = type;

  // Release a previously generated image URL.
  if (currentImageURL) {
    URL.revokeObjectURL(currentImageURL);
    currentImageURL = null;
  }

  const tools = {
    age: toolShell("🎂", "Age Calculator",
      "Calculate your exact age in years, months and days.",
      `
        <label for="dob">Date of Birth</label>
        <input type="date" id="dob" max="${todayISO()}">
        ${actionButtons("Calculate Age", "calcAge", "resetAge")}
        <div id="ageResult" class="age-results" hidden></div>
      `),

    emi: toolShell("💰", "EMI Calculator",
      "Estimate your monthly loan payment.",
      `
        <label for="loan">Loan Amount (₹)</label>
        <input type="number" id="loan" min="1" step="any" placeholder="e.g. 500000">

        <label for="rate">Annual Interest Rate (%)</label>
        <input type="number" id="rate" min="0" step="any" placeholder="e.g. 8.5">

        <label for="years">Loan Tenure (Years)</label>
        <input type="number" id="years" min="0.0833" max="50" step="any" placeholder="e.g. 5">

        ${actionButtons("Calculate EMI", "calcEMI", "resetEMI")}
        <div id="emiResult" class="age-results" hidden></div>
      `),

    percent: toolShell("％", "Percentage Calculator",
      "Find a percentage of any number.",
      `
        <label for="p">Percentage (%)</label>
        <input type="number" id="p" step="any" placeholder="e.g. 20">

        <label for="n">Number</label>
        <input type="number" id="n" step="any" placeholder="e.g. 500">

        ${actionButtons("Calculate", "calcPercent", "resetPercent")}
        <div id="result" class="tool-result"></div>
      `),

    gst: toolShell("🧾", "GST Calculator",
      "Calculate GST or extract GST from an inclusive price.",
      `
        <label for="gstAmount">Amount (₹)</label>
        <input type="number" id="gstAmount" min="0.01" step="any" placeholder="e.g. 1000">

        <label for="gstRate">GST Rate</label>
        <select id="gstRate">
          <option value="5">5% GST</option>
          <option value="12">12% GST</option>
          <option value="18" selected>18% GST</option>
          <option value="28">28% GST</option>
        </select>

        <label for="gstType">Calculation Type</label>
        <select id="gstType">
          <option value="add">Add GST to amount</option>
          <option value="remove">Remove GST from total</option>
        </select>

        ${actionButtons("Calculate GST", "calcGST", "resetGST")}
        <div id="gstResult" class="age-results" hidden></div>
      `),

    discount: toolShell("🏷️", "Discount Calculator",
      "Calculate savings and the final price.",
      `
        <label for="price">Original Price (₹)</label>
        <input type="number" id="price" min="0.01" step="any" placeholder="e.g. 1000">

        <label for="disc">Discount (%)</label>
        <input type="number" id="disc" min="0" max="100" step="any" placeholder="e.g. 20">

        ${actionButtons("Calculate Discount", "calcDiscount", "resetDiscount")}
        <div id="result" class="tool-result"></div>
      `),

    bmi: toolShell("⚖️", "BMI Calculator",
      "Calculate Body Mass Index from weight and height.",
      `
        <label for="weight">Weight (kg)</label>
        <input type="number" id="weight" min="0.1" step="any" placeholder="e.g. 70">

        <label for="height">Height (cm)</label>
        <input type="number" id="height" min="1" step="any" placeholder="e.g. 170">

        ${actionButtons("Calculate BMI", "calcBMI", "resetBMI")}
        <div id="result" class="tool-result"></div>
      `),

    image: toolShell("🖼️", "Image Compressor",
      "Compress an image and download the result.",
      `
        <label for="imageFile">Select Image</label>
        <input type="file" id="imageFile" accept="image/jpeg,image/png,image/webp">

        <label for="imageQuality">Image Quality</label>
        <input type="range" id="imageQuality" min="0.1" max="1" step="0.1" value="0.7">
        <p class="tool-hint">Lower quality usually produces a smaller JPEG file.</p>

        <button type="button" onclick="compressImage()">Compress Image</button>
        <div id="result" class="tool-result"></div>
      `),

    pdf: toolShell("📄", "JPG to PDF",
      "Combine images into a PDF document.",
      `
        <label for="pdfFiles">Select JPG / PNG Images</label>
        <input type="file" id="pdfFiles" accept="image/jpeg,image/png" multiple>

        <p class="tool-hint">Each image will be placed on a separate A4 PDF page.</p>

        <button type="button" onclick="createPDF()">Create PDF</button>
        <div id="result" class="tool-result"></div>
      `),

    hindi: toolShell("🇮🇳", "Hindi Typing",
      "Type common Hindi words using English letters.",
      `
        <label for="romanHindi">Type in English letters</label>
        <textarea id="romanHindi" rows="5" placeholder="mera naam abhishek hai"></textarea>

        ${actionButtons("Convert to Hindi", "convertHindi", "clearHindi")}

        <label>Hindi Output</label>
        <div id="hindiOutput" class="typing-output" aria-live="polite"></div>

        <div class="tool-actions">
          <button type="button" onclick="copyHindi()">Copy Hindi</button>
          <button type="button" onclick="downloadHindi()">Download Text</button>
        </div>
      `),

    gujarati: toolShell("🪷", "Gujarati Typing",
      "Type common Gujarati words using English letters.",
      `
        <label for="romanGujarati">Type in English letters</label>
        <textarea id="romanGujarati" rows="5" placeholder="maru naam abhishek che"></textarea>

        ${actionButtons("Convert to Gujarati", "convertGujarati", "clearGujarati")}

        <label>Gujarati Output</label>
        <div id="gujaratiOutput" class="typing-output" aria-live="polite"></div>

        <div class="tool-actions">
          <button type="button" onclick="copyGujarati()">Copy Gujarati</button>
          <button type="button" onclick="downloadGujarati()">Download Text</button>
        </div>
      `)
  };

  content.innerHTML = tools[type] || "<p>Tool not found.</p>";
  modal.hidden = false;

  // Make each opened tool start from the top.
  const box = modal.querySelector(".modal-box");
  if (box) box.scrollTop = 0;
}

function closeTool() {
  if (currentImageURL) {
    URL.revokeObjectURL(currentImageURL);
    currentImageURL = null;
  }

  if (modal) modal.hidden = true;
  if (content) content.innerHTML = "";

  activeTool = "";
}

// Close modal when the backdrop is clicked.
if (modal) {
  modal.addEventListener("click", event => {
    if (event.target === modal) closeTool();
  });
}

// ---------- Age Calculator ----------

function calcAge() {
  const input = getElement("dob");
  const result = getElement("ageResult");

  if (!input || !result) return;

  if (!input.value || input.value > todayISO()) {
    showMessage(result, "Please select a valid date of birth.");
    return;
  }

  const dob = new Date(input.value + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (Number.isNaN(dob.getTime()) || dob > today) {
    showMessage(result, "Please select a valid date of birth.");
    return;
  }

  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    days += new Date(
      today.getFullYear(),
      today.getMonth(),
      0
    ).getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  result.hidden = false;
  result.innerHTML = resultCards("Your Exact Age", [
    { value: years, label: "Years" },
    { value: months, label: "Months" },
    { value: days, label: "Days" }
  ], "Calculated as of today.") +
    `<button type="button" onclick="copyAgeResult()">Copy Result</button>`;
}

function resetAge() {
  if (getElement("dob")) getElement("dob").value = "";
  clearResult("ageResult");
}

function copyAgeResult() {
  const result = getElement("ageResult");
  if (result && !result.hidden) {
    copyText(result.innerText, "Age result copied!");
  }
}

// ---------- EMI Calculator ----------

function calcEMI() {
  const loanInput = getElement("loan");
  const rateInput = getElement("rate");
  const yearsInput = getElement("years");
  const result = getElement("emiResult");

  if (!loanInput || !rateInput || !yearsInput || !result) return;

  const loan = Number(loanInput.value);
  const rate = Number(rateInput.value);
  const years = Number(yearsInput.value);

  if (
    !loanInput.value.trim() ||
    !rateInput.value.trim() ||
    !yearsInput.value.trim() ||
    !Number.isFinite(loan) || loan <= 0 ||
    !Number.isFinite(rate) || rate < 0 ||
    !Number.isFinite(years) || years <= 0 || years > 50
  ) {
    showMessage(result, "Enter a valid loan amount, interest rate and tenure up to 50 years.");
    return;
  }

  const months = Math.round(years * 12);
  const monthlyRate = rate / 1200;

  let emi;

  if (monthlyRate === 0) {
    emi = loan / months;
  } else {
    const factor = Math.pow(1 + monthlyRate, months);
    emi = loan * monthlyRate * factor / (factor - 1);
  }

  const totalPayment = emi * months;
  const totalInterest = totalPayment - loan;

  result.hidden = false;
  result.innerHTML = resultCards("Your Loan Summary", [
    { value: money(emi), label: "Monthly EMI" },
    { value: money(totalInterest), label: "Total Interest" },
    { value: money(totalPayment), label: "Total Payment" }
  ], `Loan Amount: ${money(loan)} | Tenure: ${months} months`) +
    `<button type="button" onclick="copyEMIResult()">Copy Result</button>`;
}

function resetEMI() {
  resetFields(["loan", "rate", "years"]);
  clearResult("emiResult");
}

function copyEMIResult() {
  const result = getElement("emiResult");
  if (result && !result.hidden) {
    copyText(result.innerText, "EMI result copied!");
  }
}

// ---------- Percentage Calculator ----------

function calcPercent() {
  const pInput = getElement("p");
  const nInput = getElement("n");

  if (!pInput || !nInput) return;

  if (!pInput.value.trim() || !nInput.value.trim()) {
    out("<p>Please enter both percentage and number.</p>");
    return;
  }

  const p = Number(pInput.value);
  const n = Number(nInput.value);

  if (!Number.isFinite(p) || !Number.isFinite(n)) {
    out("<p>Please enter valid numbers.</p>");
    return;
  }

  const answer = p / 100 * n;

  out(`
    <h3>Percentage Result</h3>
    <div class="age-result-grid">
      <div class="age-result-card">
        <strong>${answer.toLocaleString("en-IN", {
          maximumFractionDigits: 4
        })}</strong>
        <span>${p}% of ${n}</span>
      </div>
    </div>
    <button type="button" onclick="copyText('${escapeHTML(String(answer))}', 'Result copied!')">Copy Result</button>
  `);
}

function resetPercent() {
  resetFields(["p", "n"]);
  out("");
}

// ---------- GST Calculator ----------

function calcGST() {
  const amountInput = getElement("gstAmount");
  const rateInput = getElement("gstRate");
  const typeInput = getElement("gstType");
  const result = getElement("gstResult");

  if (!amountInput || !rateInput || !typeInput || !result) return;

  const amount = Number(amountInput.value);
  const rate = Number(rateInput.value);
  const type = typeInput.value;
