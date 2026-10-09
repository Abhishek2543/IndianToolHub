
"use strict";

// =====================================================
// IndiaToolHub - Complete app.js
// =====================================================

const modal = document.getElementById("modal");
const content = document.getElementById("toolContent");

// ---------- Shared helpers ----------

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

function out(message) {
  const result = getElement("result");
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
  element.innerHTML = `<p>${escapeHTML(message)}</p>`;
}

async function copyText(text, message = "Copied successfully!") {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();

      const success = document.execCommand("copy");
      textarea.remove();

      if (!success) throw new Error("Copy failed");
    }
    alert(message);
  } catch {
    alert("Copy nahi hua. Text select karke manually copy karein.");
  }
}

function fallbackCopy(text) {
  copyText(text);
}

// ---------- Open tool ----------

function openTool(type) {
  if (!modal || !content) return;

  modal.hidden = false;

  const tools = {
    age: `
      <div class="pro-tool">
        <div class="pro-tool-icon">🎂</div>
        <h2>Age Calculator</h2>
        <p class="tool-subtitle">Calculate your exact age.</p>
        <label for="dob">Date of Birth</label>
        <input type="date" id="dob" max="${todayISO()}">
        <div class="tool-actions">
          <button onclick="calcAge()">Calculate Age</button>
          <button class="reset-btn" onclick="resetAge()">Reset</button>
        </div>
        <div id="ageResult" class="age-results" hidden></div>
      </div>`,

    emi: `
      <div class="pro-tool">
        <div class="pro-tool-icon">💰</div>
        <h2>EMI Calculator</h2>
        <p class="tool-subtitle">Estimate your monthly loan payment.</p>
        <label for="loan">Loan Amount (₹)</label>
        <input type="number" id="loan" min="1" placeholder="e.g. 500000">
        <label for="rate">Annual Interest Rate (%)</label>
        <input type="number" id="rate" min="0" step="0.01" placeholder="e.g. 8.5">
        <label for="years">Loan Tenure (Years)</label>
        <input type="number" id="years" min="0.0833" max="50" step="any" placeholder="e.g. 5">
        <div class="tool-actions">
          <button onclick="calcEMI()">Calculate EMI</button>
          <button class="reset-btn" onclick="resetEMI()">Reset</button>
        </div>
        <div id="emiResult" class="age-results" hidden></div>
      </div>`,

    percent: `
      <div class="pro-tool">
        <div class="pro-tool-icon">％</div>
        <h2>Percentage Calculator</h2>
        <label for="p">Percentage (%)</label>
        <input type="number" id="p" placeholder="e.g. 20">
        <label for="n">Number</label>
        <input type="number" id="n" placeholder="e.g. 500">
        <div class="tool-actions">
          <button onclick="calcPercent()">Calculate</button>
          <button class="reset-btn" onclick="resetPercent()">Reset</button>
        </div>
        <div id="result"></div>
      </div>`,

    gst: `
      <div class="pro-tool">
        <div class="pro-tool-icon">🧾</div>
        <h2>GST Calculator</h2>
        <p class="tool-subtitle">Calculate GST and final price.</p>
        <label for="gstAmount">Amount (₹)</label>
        <input type="number" id="gstAmount" min="0" step="0.01" placeholder="e.g. 1000">
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
        <div class="tool-actions">
          <button onclick="calcGST()">Calculate GST</button>
          <button class="reset-btn" onclick="resetGST()">Reset</button>
        </div>
        <div id="gstResult" class="age-results" hidden></div>
      </div>`,

    discount: `
      <div class="pro-tool">
        <div class="pro-tool-icon">🏷️</div>
        <h2>Discount Calculator</h2>
        <label for="price">Original Price (₹)</label>
        <input type="number" id="price" min="0" step="0.01" placeholder="1000">
        <label for="disc">Discount (%)</label>
        <input type="number" id="disc" min="0" max="100" step="any" placeholder="20">
        <div class="tool-actions">
          <button onclick="calcDiscount()">Calculate Discount</button>
          <button class="reset-btn" onclick="resetDiscount()">Reset</button>
        </div>
        <div id="result"></div>
      </div>`,

    bmi: `
      <div class="pro-tool">
        <div class="pro-tool-icon">⚖️</div>
        <h2>BMI Calculator</h2>
        <label for="weight">Weight (kg)</label>
        <input type="number" id="weight" min="1" step="0.1" placeholder="70">
        <label for="height">Height (cm)</label>
        <input type="number" id="height" min="1" step="0.1" placeholder="170">
        <div class="tool-actions">
          <button onclick="calcBMI()">Calculate BMI</button>
          <button class="reset-btn" onclick="resetBMI()">Reset</button>
        </div>
        <div id="result"></div>
      </div>`,

    image: `
      <div class="pro-tool">
        <div class="pro-tool-icon">🖼️</div>
        <h2>Image Compressor</h2>
        <label for="imageFile">Select Image</label>
        <input type="file" id="imageFile" accept="image/*">
        <label for="imageQuality">Image Quality</label>
        <input type="range" id="imageQuality" min="0.1" max="1" step="0.1" value="0.7">
        <p>Lower quality usually means a smaller file.</p>
        <button onclick="compressImage()">Compress Image</button>
        <div id="result"></div>
      </div>`,

    pdf: `
      <div class="pro-tool">
        <div class="pro-tool-icon">📄</div>
        <h2>JPG to PDF</h2>
        <label for="pdfFiles">Select JPG / PNG Images</label>
        <input type="file" id="pdfFiles" accept="image/jpeg,image/png" multiple>
        <p>Each image will be placed on a separate PDF page.</p>
        <button onclick="createPDF()">Create PDF</button>
        <div id="result"></div>
      </div>`,

    hindi: `
      <div class="pro-tool">
        <div class="pro-tool-icon">🇮🇳</div>
        <h2>Hindi Typing</h2>
        <p>English letters mein likhein. Basic common-word conversion available hai.</p>
        <textarea id="romanHindi" rows="5" placeholder="mera naam abhishek hai"></textarea>
        <div class="tool-actions">
          <button onclick="convertHindi()">Convert to Hindi</button>
          <button class="reset-btn" onclick="clearHindi()">Clear</button>
        </div>
        <div id="hindiOutput" class="typing-output"></div>
        <button onclick="copyHindi()">Copy Hindi</button>
        <button onclick="downloadHindi()">Download Text</button>
      </div>`,

    gujarati: `
      <div class="pro-tool">
        <div class="pro-tool-icon">🪷</div>
        <h2>Gujarati Typing</h2>
        <p>English letters mein likhein. Basic common-word conversion available hai.</p>
        <textarea id="romanGujarati" rows="5" placeholder="maru naam abhishek che"></textarea>
        <div class="tool-actions">
          <button onclick="convertGujarati()">Convert to Gujarati</button>
          <button class="reset-btn" onclick="clearGujarati()">Clear</button>
        </div>
        <div id="gujaratiOutput" class="typing-output"></div>
        <button onclick="copyGujarati()">Copy Gujarati</button>
        <button onclick="downloadGujarati()">Download Text</button>
      </div>`
  };

  content.innerHTML = tools[type] || "<p>Tool not found.</p>";
}

function closeTool() {
  if (modal) modal.hidden = true;
  if (content) content.innerHTML = "";
}

function todayISO() {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
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

  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  result.hidden = false;
  result.innerHTML = `
    <h3>Your Exact Age</h3>
    <div class="age-result-grid">
      <div class="age-result-card"><strong>${years}</strong><span>Years</span></div>
      <div class="age-result-card"><strong>${months}</strong><span>Months</span></div>
      <div class="age-result-card"><strong>${days}</strong><span>Days</span></div>
    </div>
    <p class="age-note">Calculated as of today.</p>
    <button onclick="copyAgeResult()">Copy Result</button>`;
}

function resetAge() {
  if (getElement("dob")) getElement("dob").value = "";
  const result = getElement("ageResult");
  if (result) {
    result.hidden = true;
    result.innerHTML = "";
  }
}

function copyAgeResult() {
  const result = getElement("ageResult");
  if (result && !result.hidden) copyText(result.innerText, "Age result copied!");
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
    loanInput.value.trim() === "" ||
    rateInput.value.trim() === "" ||
    yearsInput.value.trim() === "" ||
    !Number.isFinite(loan) || loan <= 0 ||
    !Number.isFinite(rate) || rate < 0 ||
    !Number.isFinite(years) || years <= 0 || years > 50
  ) {
    showMessage(result, "Enter a valid loan amount, interest rate and tenure (up to 50 years).");
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
  result.innerHTML = `
    <h3>Your Loan Summary</h3>
    <div class="age-result-grid">
      <div class="age-result-card"><strong style="font-size:18px">${money(emi)}</strong><span>Monthly EMI</span></div>
      <div class="age-result-card"><strong style="font-size:18px">${money(totalInterest)}</strong><span>Total Interest</span></div>
      <div class="age-result-card"><strong style="font-size:18px">${money(totalPayment)}</strong><span>Total Payment</span></div>
    </div>
    <p class="age-note">Loan Amount: ${money(loan)}<br>Tenure: ${months} months</p>
    <button onclick="copyEMIResult()">Copy Result</button>`;
}

function resetEMI() {
  ["loan", "rate", "years"].forEach(id => {
    if (getElement(id)) getElement(id).value = "";
  });
  const result = getElement("emiResult");
  if (result) {
    result.hidden = true;
    result.innerHTML = "";
  }
}

function copyEMIResult() {
  const result = getElement("emiResult");
  if (result && !result.hidden) copyText(result.innerText, "EMI result copied!");
}

// ---------- Percentage Calculator ----------

function calcPercent() {
  const pInput = getElement("p");
  const nInput = getElement("n");
  if (!pInput || !nInput) return;

  if (pInput.value.trim() === "" || nInput.value.trim() === "") {
    out("Please enter both numbers.");
    return;
  }

  const p = Number(pInput.value);
  const n = Number(nInput.value);

  if (!Number.isFinite(p) || !Number.isFinite(n)) {
    out("Please enter valid numbers.");
    return;
  }

  out(`<h3>Result</h3><p>${p}% of ${n} = <strong>${((p / 100) * n).toLocaleString("en-IN")}</strong></p>`);
}

function resetPercent() {
  ["p", "n"].forEach(id => {
    if (getElement(id)) getElement(id).value = "";
  });
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

  if (amountInput.value.trim() === "" || !Number.isFinite(amount) || amount <= 0) {
    showMessage(result, "Please enter an amount greater than zero.");
    return;
  }

  let base;
  let gst;
  let total;

  if (type === "add") {
    base = amount;
    gst = amount * rate / 100;
    total = amount + gst;
  } else {
    total = amount;
    base = amount * 100 / (100 + rate);
    gst = total - base;
  }

  result.hidden = false;
  result.innerHTML = `
    <h3>GST Summary</h3>
    <div class="age-result-grid">
      <div class="age-result-card"><strong style="font-size:18px">${money(base)}</strong><span>Base Amount</span></div>
      <div class="age-result-card"><strong style="font-size:18px">${money(gst)}</strong><span>GST (${rate}%)</span></div>
      <div class="age-result-card"><strong style="font-size:18px">${money(total)}</strong><span>${type === "add" ? "Final Amount" : "Total Amount"}</span></div>
    </div>
    <button onclick="copyGSTResult()">Copy Result</button>`;
}

function resetGST() {
  if (getElement("gstAmount")) getElement("gstAmount").value = "";
  if (getElement("gstRate")) getElement("gstRate").value = "18";
  if (getElement("gstType")) getElement("gstType").value = "add";
  const result = getElement("gstResult");
  if (result) {
    result.hidden = true;
    result.innerHTML = "";
  }
}

function copyGSTResult() {
  const result = getElement("gstResult");
  if (result && !result.hidden) copyText(result.innerText, "GST result copied!");
}

// ---------- Discount Calculator ----------

function calcDiscount() {
  const priceInput = getElement("price");
  const discInput = getElement("disc");
  if (!priceInput || !discInput) return;

  if (priceInput.value.trim() === "" || discInput.value.trim() === "") {
    out("Please enter price and discount.");
    return;
  }

  const price = Number(priceInput.value);
  const disc = Number(discInput.value);

  if (
    !Number.isFinite(price) || price <= 0 ||
    !Number.isFinite(disc) || disc < 0 || disc > 100
  ) {
    out("Price must be positive and discount must be between 0% and 100%.");
    return;
  }

  const saved = price * disc / 100;
  const finalPrice = price - saved;

  out(`<h3>Discount Summary</h3><p>Discount: <strong>${money(saved)}</strong></p><p>Final Price: <strong>${money(finalPrice)}</strong></p>`);
}

function resetDiscount() {
  ["price", "disc"].forEach(id => {
    if (getElement(id)) getElement(id).value = "";
  });
  out("");
}

// ---------- BMI Calculator ----------

function calcBMI() {
  const weightInput = getElement("weight");
  const heightInput = getElement("height");
  if (!weightInput || !heightInput) return;

  if (weightInput.value.trim() === "" || heightInput.value.trim() === "") {
    out("Please enter weight and height.");
    return;
  }

  const weight = Number(weightInput.value);
  const height = Number(heightInput.value);

  if (
    !Number.isFinite(weight) || weight <= 0 ||
    !Number.isFinite(height) || height <= 0
  ) {
    out("Please enter valid positive measurements.");
    return;
  }

  const bmi = weight / Math.pow(height / 100, 2);
  let category;

  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Normal range";
  else if (bmi < 30) category = "Overweight";
  else category = "Obesity range";

  out(`<h3>BMI Result</h3><p>BMI: <strong>${bmi.toFixed(1)}</strong></p><p>Category: <strong>${category}</strong></p><small>BMI is a screening measure, not a diagnosis.</small>`);
}

function resetBMI() {
  ["weight", "height"].forEach(id => {
    if (getElement(id)) getElement(id).value = "";
  });
  out("");
}

// ---------- Image Compressor ----------

function compressImage() {
  const fileInput = getElement("imageFile");
  const qualityInput = getElement("imageQuality");
  if (!fileInput || !qualityInput) return;

  const file = fileInput.files[0];
  const quality = Number(qualityInput.value);

  if (!file) {
    out("Please select an image first.");
    return;
  }

  if (!file.type.startsWith("image/")) {
    out("Please select a valid image file.");
    return;
  }

  const reader = new FileReader();

  reader.onload = event => {
    loadImage(event.target.result)
      .then(image => {
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth || image.width;
        canvas.height = image.naturalHeight || image.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas unavailable");

        ctx.drawImage(image, 0, 0);

        canvas.toBlob(blob => {
          if (!blob) {
            out("Compression failed. Try another image.");
            return;
          }

          const url = URL.createObjectURL(blob);
          const saved = file.size > 0
            ? ((1 - blob.size / file.size) * 100).toFixed(1)
            : "0.0";

          out(`
            <h3>Compressed Image Ready</h3>
            <p>Original size: ${(file.size / 1024).toFixed(1)} KB</p>
            <p>Compressed size: ${(blob.size / 1024).toFixed(1)} KB</p>
            <p>${blob.size < file.size ? `Size reduced by ${saved}%` : "This image did not become smaller at this quality setting."}</p>
            <a href="${url}" download="IndiaToolHub-compressed.jpg">Download Compressed Image</a>
          `);
        }, "image/jpeg", quality);
      })
      .catch(() => out("Could not process this image. Please try another."));
  };

  reader.onerror = () => out("Could not read the selected image.");
  reader.readAsDataURL(file);
}

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
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// ---------- JPG / PNG to PDF ----------

async function createPDF() {
  const input = getElement("pdfFiles");
  if (!input) return;

  const files = Array.from(input.files || []).filter(file =>
    ["image/jpeg", "image/png"].includes(file.type)
  );

  if (!files.length) {
    out("Please select at least one JPG or PNG image.");
    return;
  }

  if (!window.jspdf || !window.jspdf.jsPDF) {
    out("PDF library load nahi hui. Internet connection aur index.html ke jsPDF script ko check karein.");
    return;
  }

  try {
    const { jsPDF } = window.jspdf;
    let pdf = null;

    for (const file of files) {
      const data = await readFileAsDataURL(file);
      const image = await loadImage(data);

      const orientation = image.width > image.height ? "landscape" : "portrait";

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

      pdf.addImage(data, file.type === "image/png" ? "PNG" : "JPEG", x, y, width, height);
    }

    if (!pdf) {
      out("No supported images were found.");
      return;
    }

    pdf.save("IndiaToolHub-images.pdf");
    out(`<p><strong>PDF created successfully!</strong> ${files.length} image(s) added.</p>`);
  } catch (error) {
    console.error(error);
    out("PDF create nahi hua. Please try with different JPG/PNG images.");
  }
}

// ---------- Hindi / Gujarati typing ----------
// Basic common-word conversion. This is not a full online
// transliteration engine; unknown words remain unchanged.

const hindiWords = {
  "namaste":"नमस्ते", "namaskar":"नमस्कार", "mera":"मेरा",
  "meri":"मेरी", "mere":"मेरे", "naam":"नाम", "hai":"है",
  "hain":"हैं", "ho":"हो", "ka":"का", "ki":"की", "ke":"के",
  "ko":"को", "se":"से", "mein":"में", "mai":"मैं",
  "main":"मैं", "hum":"हम", "ham":"हम", "aap":"आप",
  "ap":"आप", "tum":"तुम", "kya":"क्या", "kyu":"क्यों",
  "kyon":"क्यों", "kaise":"कैसे", "kaisi":"कैसी",
  "accha":"अच्छा", "achha":"अच्छा", "achhi":"अच्छी",
  "bahut":"बहुत", "nahi":"नहीं", "nahin":"नहीं",
  "haan":"हाँ", "han":"हाँ", "ji":"जी", "shukriya":"शुक्रिया",
  "dhanyavad":"धन्यवाद", "pyaar":"प्यार", "pyar":"प्यार",
  "dost":"दोस्त", "dosti":"दोस्ती", "ghar":"घर",
  "paani":"पानी", "khana":"खाना", "khao":"खाओ",
  "peena":"पीना", "aaj":"आज", "kal":"कल", "ab":"अब",
  "naam":"नाम", "mera":"मेरा", "naam":"नाम",
  "bharat":"भारत", "india":"इंडिया", "hindustan":"हिंदुस्तान",
  "ram":"राम", "shree":"श्री", "shri":"श्री",
  "bhagwan":"भगवान", "bhagavan":"भगवान",
  "mata":"माता", "pita":"पिता", "papa":"पापा",
  "maa":"माँ", "ma":"माँ", "beta":"बेटा", "beti":"बेटी",
  "bhai":"भाई", "behen":"बहन", "behan":"बहन",
  "aapka":"आपका", "aapki":"आपकी", "aapke":"आपके",
  "mera naam":"मेरा नाम", "kaise ho":"कैसे हो",
  "kaise hain":"कैसे हैं", "theek ho":"ठीक हो",
  "thik hai":"ठीक है", "theek hai":"ठीक है",
  "mera naam abhishek hai":"मेरा नाम अभिषेक है"
};

const gujaratiWords = {
  "namaste":"નમસ્તે", "namaskar":"નમસ્કાર", "maru":"મારું",
  "maro":"મારો", "mari":"મારી", "naam":"નામ", "che":"છે",
  "chhe":"છે", "hu":"હું", "hun":"હું", "mane":"મને",
  "tame":"તમે", "tamne":"તમને", "aap":"આપ", "shu":"શું",
  "su":"શું", "kem":"કેમ", "cho":"છો", "chho":"છો",
  "majama":"મજામાં", "maja":"મજા", "saru":"સારું",
  "saras":"સરસ", "bahu":"બહુ", "nathi":"નથી",
  "ha":"હા", "haa":"હા", "na":"ના", "pani":"પાણી",
  "paani":"પાણી", "ghar":"ઘર", "prem":"પ્રેમ",
  "dost":"દોસ્ત", "bhai":"ભાઈ", "ben":"બેન",
  "mata":"માતા", "pita":"પિતા", "pappa":"પપ્પા",
  "maa":"મા", "beta":"બેટા", "dikro":"દીકરો",
  "dikri":"દીકરી", "aaje":"આજે", "aavjo":"આવજો",
  "abhar":"આભાર", "dhanyavad":"ધન્યવાદ",
  "ram":"રામ", "shree":"શ્રી", "bhagwan":"ભગવાન",
  "bharat":"ભારત", "gujarat":"ગુજરાત",
  "kem cho":"કેમ છો", "majama cho":"મજામાં છો",
  "maru naam":"મારું નામ", "maru naam abhishek che":"મારું નામ અભિષેક છે"
};

function convertWords(text, dictionary) {
  return text.split(/(\s+)/).map(part => {
    if (/^\s+$/.test(part)) return part;
    const key = part.toLowerCase().replace(/[.,!?;:]+$/, "");
    const punctuation = part.slice(key.length);
    return (dictionary[key] || part.slice(0, key.length)) + punctuation;
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

  // Replace known multi-word phrases first, then individual words.
  let converted = text;
  Object.keys(hindiWords)
    .filter(key => key.includes(" "))
    .sort((a, b) => b.length - a.length)
    .forEach(key => {
      converted = converted.replace(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), hindiWords[key]);
    });

  converted = convertWords(converted, hindiWords);
  output.textContent = converted;
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

function convertGujarati() {
  const input = getElement("romanGujarati");
  const output = getElement("gujaratiOutput");
  if (!input || !output) return;

  const text = input.value.trim();
  if (!text) {
    output.textContent = "Please enter some text first.";
    return;
  }

  let converted = text;
  Object.keys(gujaratiWords)
    .filter(key => key.includes(" "))
    .sort((a, b) => b.length - a.length)
    .forEach(key => {
      converted = converted.replace(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), gujaratiWords[key]);
    });

  converted = convertWords(converted, gujaratiWords);
  output.textContent = converted;
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

function downloadText(text, filename) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// ---------- End of IndiaToolHub app.js ----------
