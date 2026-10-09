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

  if (
    !amountInput.value.trim() ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    showMessage(result, "Please enter an amount greater than zero.");
    return;
  }

  let base;
  let gst;
  let total;

  if (type === "add") {
    base = amount;
    gst = base * rate / 100;
    total = base + gst;
  } else {
    total = amount;
    base = total * 100 / (100 + rate);
    gst = total - base;
  }

  result.hidden = false;
  result.innerHTML = resultCards("GST Summary", [
    { value: money(base), label: "Base Amount" },
    { value: money(gst), label: `GST (${rate}%)` },
    { value: money(total), label: "Final Amount" }
  ]) +
    `<button type="button" onclick="copyGSTResult()">Copy Result</button>`;
}

function resetGST() {
  if (getElement("gstAmount")) getElement("gstAmount").value = "";
  if (getElement("gstRate")) getElement("gstRate").value = "18";
  if (getElement("gstType")) getElement("gstType").value = "add";

  clearResult("gstResult");
}

function copyGSTResult() {
  const result = getElement("gstResult");
  if (result && !result.hidden) {
    copyText(result.innerText, "GST result copied!");
  }
}

// ---------- Discount Calculator ----------

function calcDiscount() {
  const priceInput = getElement("price");
  const discInput = getElement("disc");

  if (!priceInput || !discInput) return;

  if (!priceInput.value.trim() || !discInput.value.trim()) {
    out("<p>Please enter price and discount percentage.</p>");
    return;
  }

  const price = Number(priceInput.value);
  const disc = Number(discInput.value);

  if (
    !Number.isFinite(price) || price <= 0 ||
    !Number.isFinite(disc) || disc < 0 || disc > 100
  ) {
    out("<p>Price must be positive and discount must be between 0% and 100%.</p>");
    return;
  }

  const saved = price * disc / 100;
  const finalPrice = price - saved;

  out(`
    <h3>Discount Summary</h3>
    <div class="age-result-grid">
      <div class="age-result-card">
        <strong>${money(saved)}</strong>
        <span>You Save</span>
      </div>
      <div class="age-result-card">
        <strong>${money(finalPrice)}</strong>
        <span>Final Price</span>
      </div>
    </div>
    <button type="button" onclick="copyText('${finalPrice.toFixed(2)}', 'Final price copied!')">Copy Final Price</button>
  `);
}

function resetDiscount() {
  resetFields(["price", "disc"]);
  out("");
}

// ---------- BMI Calculator ----------

function calcBMI() {
  const weightInput = getElement("weight");
  const heightInput = getElement("height");

  if (!weightInput || !heightInput) return;

  if (!weightInput.value.trim() || !heightInput.value.trim()) {
    out("<p>Please enter weight and height.</p>");
    return;
  }

  const weight = Number(weightInput.value);
  const height = Number(heightInput.value);

  if (
    !Number.isFinite(weight) || weight <= 0 ||
    !Number.isFinite(height) || height <= 0
  ) {
    out("<p>Please enter valid positive measurements.</p>");
    return;
  }

  const bmi = weight / Math.pow(height / 100, 2);
  let category;

  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Normal range";
  else if (bmi < 30) category = "Overweight";
  else category = "Obesity range";

  out(`
    <h3>BMI Result</h3>
    <div class="age-result-grid">
      <div class="age-result-card">
        <strong>${bmi.toFixed(1)}</strong>
        <span>BMI</span>
      </div>
      <div class="age-result-card">
        <strong>${category}</strong>
        <span>Category</span>
      </div>
    </div>
    <p class="age-note">BMI is a screening measure, not a medical diagnosis.</p>
    <button type="button" onclick="copyText('${bmi.toFixed(1)}', 'BMI copied!')">Copy BMI</button>
  `);
}

function resetBMI() {
  resetFields(["weight", "height"]);
  out("");
}

// ---------- Image Compressor ----------

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image loading failed"));
    image.src = src;
  });
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("File reading failed"));
    reader.readAsDataURL(file);
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error("Image compression failed"));
    }, type, quality);
  });
}

async function compressImage() {
  const fileInput = getElement("imageFile");
  const qualityInput = getElement("imageQuality");

  if (!fileInput || !qualityInput) return;

  const file = fileInput.files && fileInput.files[0];
  const quality = Number(qualityInput.value);

  if (!file) {
    out("<p>Please select an image first.</p>");
    return;
  }

  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    out("<p>Please select a JPG, PNG or WebP image.</p>");
    return;
  }

  if (file.size > 30 * 1024 * 1024) {
    out("<p>Please choose an image smaller than 30 MB.</p>");
    return;
  }

  out("<p>Compressing image… please wait.</p>");

  try {
    const data = await readFileAsDataURL(file);
    const image = await loadImage(data);

    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth || image.width;
    canvas.height = image.naturalHeight || image.height;

    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Canvas is unavailable");

    // JPEG does not support transparency, so use a white background.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);

    const blob = await canvasToBlob(canvas, "image/jpeg", quality);

    if (currentImageURL) URL.revokeObjectURL(currentImageURL);
    currentImageURL = URL.createObjectURL(blob);

    const saved = file.size > 0
      ? ((1 - blob.size / file.size) * 100)
      : 0;

    const sizeMessage = blob.size < file.size
      ? `File size reduced by ${saved.toFixed(1)}%.`
      : "The compressed file is not smaller at this quality setting.";

    out(`
      <h3>Compressed Image Ready</h3>
      <div class="age-result-grid">
        <div class="age-result-card">
          <strong>${(file.size / 1024).toFixed(1)} KB</strong>
          <span>Original Size</span>
        </div>
        <div class="age-result-card">
          <strong>${(blob.size / 1024).toFixed(1)} KB</strong>
          <span>Compressed Size</span>
        </div>
      </div>
      <p>${sizeMessage}</p>
      <a class="download-link" href="${currentImageURL}" download="IndiaToolHub-compressed.jpg">Download Compressed Image</a>
    `);
  } catch (error) {
    console.error(error);
    out("<p>Image process nahi hui. Please try another image.</p>");
  }
}

// ---------- JPG / PNG to PDF ----------

async function createPDF() {
  const input = getElement("pdfFiles");

  if (!input) return;

  const files = Array.from(input.files || []).filter(file =>
    ["image/jpeg", "image/png"].includes(file.type)
  );

  if (!files.length) {
    out("<p>Please select at least one JPG or PNG image.</p>");
    return;
  }

  if (!window.jspdf || !window.jspdf.jsPDF) {
    out("<p>PDF library load nahi hui. Internet connection aur index.html mein jsPDF script check karein.</p>");
    return;
  }

  if (files.some(file => file.size > 25 * 1024 * 1024)) {
    out("<p>Please use images smaller than 25 MB each.</p>");
    return;
  }

  out("<p>Creating PDF… please wait.</p>");

  try {
    const { jsPDF } = window.jspdf;
    let pdf = null;

    for (const file of files) {
      const data = await readFileAsDataURL(file);
      const image = await loadImage(data);

      const orientation = image.width > image.height
        ? "landscape"
        : "portrait";

      if (!pdf) {
        pdf = new jsPDF({
          orientation,
          unit: "mm",
          format: "a4"
        });
      } else {
        pdf.addPage("a4", orientation);
      }

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 8;
      const maxWidth = pageWidth - margin * 2;
      const maxHeight = pageHeight - margin * 2;

      const scale = Math.min(
        maxWidth / image.width,
        maxHeight / image.height
      );

      const width = image.width * scale;
      const height = image.height * scale;
      const x = (pageWidth - width) / 2;
      const y = (pageHeight - height) / 2;

      pdf.addImage(
        data,
        file.type === "image/png" ? "PNG" : "JPEG",
        x,
        y,
        width,
        height
      );
    }

    if (!pdf) {
      out("<p>No supported images were found.</p>");
      return;
    }

    pdf.save("IndiaToolHub-images.pdf");

    out(`
      <h3>PDF Created Successfully!</h3>
      <p>${files.length} image(s) added to your PDF.</p>
    `);
  } catch (error) {
    console.error(error);
    out("<p>PDF create nahi hua. Please try with different JPG/PNG images.</p>");
  }
}

// ---------- Hindi Typing ----------
// Basic common-word conversion, not a full transliteration engine.

const hindiWords = {
  namaste: "नमस्ते",
  namaskar: "नमस्कार",
  mera: "मेरा",
  meri: "मेरी",
  mere: "मेरे",
  naam: "नाम",
  hai: "है",
  hain: "हैं",
  ho: "हो",
  ka: "का",
  ki: "की",
  ke: "के",
  ko: "को",
  se: "से",
  mein: "में",
  mai: "मैं",
  main: "मैं",
  hum: "हम",
  ham: "हम",
  aap: "आप",
  tum: "तुम",
  kya: "क्या",
  kyu: "क्यों",
  kyon: "क्यों",
  kaise: "कैसे",
  kaisi: "कैसी",
  accha: "अच्छा",
  achha: "अच्छा",
  achhi: "अच्छी",
  bahut: "बहुत",
  nahi: "नहीं",
  nahin: "नहीं",
  haan: "हाँ",
  han: "हाँ",
  ji: "जी",
  shukriya: "शुक्रिया",
  dhanyavad: "धन्यवाद",
  pyaar: "प्यार",
  pyar: "प्यार",
  dost: "दोस्त",
  dosti: "दोस्ती",
  ghar: "घर",
  paani: "पानी",
  khana: "खाना",
  khao: "खाओ",
  peena: "पीना",
  aaj: "आज",
  kal: "कल",
  ab: "अब",
  bharat: "भारत",
  india: "इंडिया",
  hindustan: "हिंदुस्तान",
  ram: "राम",
  shree: "श्री",
  shri: "श्री",
  bhagwan: "भगवान",
  mata: "माता",
  pita: "पिता",
  papa: "पापा",
  maa: "माँ",
  beta: "बेटा",
  beti: "बेटी",
  bhai: "भाई",
  behen: "बहन",
  behan: "बहन",
  aapka: "आपका",
  aapki: "आपकी",
  aapke: "आपके",
  "kaise ho": "कैसे हो",
  "kaise hain": "कैसे हैं",
  "theek ho": "ठीक हो",
  "thik hai": "ठीक है",
  "theek hai": "ठीक है",
  "mera naam": "मेरा नाम",
  "mera naam abhishek hai": "मेरा नाम अभिषेक है"
};

// ---------- Gujarati Typing ----------

const gujaratiWords = {
  namaste: "નમસ્તે",
  namaskar: "નમસ્કાર",
  maru: "મારું",
  maro: "મારો",
  mari: "મારી",
  naam: "નામ",
  che: "છે",
  chhe: "છે",
  hu: "હું",
  hun: "હું",
  mane: "મને",
  tame: "તમે",
  tamne: "તમને",
  aap: "આપ",
  shu: "શું",
  su: "શું",
  kem: "કેમ",
  cho: "છો",
  chho: "છો",
  majama: "મજામાં",
  maja: "મજા",
  saru: "સારું",
  saras: "સરસ",
  bahu: "બહુ",
  nathi: "નથી",
  ha: "હા",
  haa: "હા",
  na: "ના",
  pani: "પાણી",
  paani: "પાણી",
  ghar: "ઘર",
  prem: "પ્રેમ",
  dost: "દોસ્ત",
  bhai: "ભાઈ",
  ben: "બેન",
  mata: "માતા",
  pita: "પિતા",
  pappa: "પપ્પા",
  maa: "મા",
  beta: "બેટા",
  dikro: "દીકરો",
  dikri: "દીકરી",
  aaje: "આજે",
  aavjo: "આવજો",
  abhar: "આભાર",
  dhanyavad: "ધન્યવાદ",
  ram: "રામ",
  shree: "શ્રી",
  bhagwan: "ભગવાન",
  bharat: "ભારત",
  gujarat: "ગુજરાત",
  "kem cho": "કેમ છો",
  "majama cho": "મજામાં છો",
  "maru naam": "મારું નામ",
  "maru naam abhishek che": "મારું નામ અભિષેક છે"
};

function convertWords(text, dictionary) {
  const phrases = Object.keys(dictionary)
    .filter(key => key.includes(" "))
    .sort((a, b) => b.length - a.length);

  let converted = text;

  // Convert known phrases before individual words.
  for (const phrase of phrases) {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    converted = converted.replace(
      new RegExp(`\\b${escaped}\\b`, "gi"),
      dictionary[phrase]
    );
  }

  return converted.split(/(\s+)/).map(part => {
    if (!part || /^\s+$/.test(part)) return part;

    // Keep punctuation attached to each word.
    const match = part.match(/^([^.,!?;:]+)([.,!?;:]*)$/);

    if (!match) return part;

    const word = match[1];
    const punctuation = match[2];
    const key = word.toLowerCase();

    return (dictionary[key] || word) + punctuation;
  }).join("");
}

function convertHindi() {
  const input = getElement("romanHindi");
  const output = getElement("hindiOutput");

  if (!input || !output) return;

  const text = input.value.trim();

  if (!text) {
    output.textContent = "Please enter some text first.";
    return;
  }

  output.textContent = convertWords(text, hindiWords);
}

function copyHindi() {
  const output = getElement("hindiOutput");

  if (output && output.textContent.trim()) {
    copyText(output.textContent, "Hindi text copied!");
  }
}

function downloadHindi() {
  const output = getElement("hindiOutput");

  if (output && output.textContent.trim()) {
    downloadText(output.textContent, "IndiaToolHub-Hindi.txt");
  }
}

function clearHindi() {
  if (getElement("romanHindi")) getElement("romanHindi").value = "";
  if (getElement("hindiOutput")) getElement("hindiOutput").textContent = "";
}

// ---------- Gujarati Functions ----------

function convertGujarati() {
  const input = getElement("romanGujarati");
  const output = getElement("gujaratiOutput");

  if (!input || !output) return;

  const text = input.value.trim();

  if (!text) {
    output.textContent = "Please enter some text first.";
    return;
  }

  output.textContent = convertWords(text, gujaratiWords);
}

function copyGujarati() {
  const output = getElement("gujaratiOutput");

  if (output && output.textContent.trim()) {
    copyText(output.textContent, "Gujarati text copied!");
  }
}

function downloadGujarati() {
  const output = getElement("gujaratiOutput");

  if (output && output.textContent.trim()) {
    downloadText(output.textContent, "IndiaToolHub-Gujarati.txt");
  }
}

function clearGujarati() {
  if (getElement("romanGujarati")) getElement("romanGujarati").value = "";
  if (getElement("gujaratiOutput")) getElement("gujaratiOutput").textContent = "";
}

// ---------- End of IndiaToolHub app.js ----------
