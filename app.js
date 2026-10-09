"use strict";

/* IndiaToolHub — corrected app.js
   10 tools | Validation | Reset | Copy | Downloads
*/

const modal = document.getElementById("modal");
const content = document.getElementById("toolContent");
let currentImageURL = null;

const $ = (id) => document.getElementById(id);
const inTool = (id) => content?.querySelector(`#${id}`);

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[ch]);
}

function out(html) {
  const result = content?.querySelector("#result");
  if (result) result.innerHTML = html;
}

function money(value) {
  return "₹" + Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function message(html, text) {
  if (!html) return;
  html.hidden = false;
  html.innerHTML = `<p class="tool-message">${escapeHTML(text)}</p>`;
}

function cards(title, items, note = "") {
  return `<h3>${title}</h3>
    <div class="age-result-grid">
      ${items.map(x => `<div class="age-result-card">
        <strong>${escapeHTML(x.value)}</strong>
        <span>${escapeHTML(x.label)}</span>
      </div>`).join("")}
    </div>
    ${note ? `<p class="age-note">${escapeHTML(note)}</p>` : ""}`;
}

function actions(primary, fn, reset) {
  return `<div class="tool-actions">
    <button type="button" onclick="${fn}()">${primary}</button>
    <button type="button" class="reset-btn" onclick="${reset}()">Reset</button>
  </div>`;
}

function shell(icon, title, subtitle, fields) {
  return `<div class="pro-tool">
    <div class="pro-tool-icon">${icon}</div>
    <h2>${title}</h2>
    <p class="tool-subtitle">${subtitle}</p>
    ${fields}
  </div>`;
}

function clearResult(id = "result") {
  const el = inTool(id);
  if (el) {
    el.innerHTML = "";
    if ("hidden" in el) el.hidden = true;
  }
}

function resetFields(ids) {
  ids.forEach(id => {
    const el = inTool(id);
    if (el) el.value = "";
  });
}

async function copyText(text, success = "Copied!") {
  if (!text || !text.trim()) {
    alert("Copy karne ke liye text nahi hai.");
    return;
  }
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      if (!ok) throw new Error("Copy failed");
    }
    alert(success);
  } catch {
    alert("Copy nahi hua. Text ko select karke manually copy karein.");
  }
}

function downloadText(text, filename) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function openTool(type) {
  if (!modal || !content) return;
  if (currentImageURL) URL.revokeObjectURL(currentImageURL);
  currentImageURL = null;

  const tools = {
    age: shell("🎂", "Age Calculator", "Calculate your exact age.", `
      <label for="dob">Date of Birth</label>
      <input type="date" id="dob" max="${todayISO()}">
      ${actions("Calculate Age","calcAge","resetAge")}
      <div id="ageResult" class="age-results" hidden></div>`),

    emi: shell("💰", "EMI Calculator", "Estimate your monthly loan payment.", `
      <label for="loan">Loan Amount (₹)</label>
      <input type="number" id="loan" min="1" step="any" placeholder="500000">
      <label for="rate">Annual Interest Rate (%)</label>
      <input type="number" id="rate" min="0" step="any" placeholder="8.5">
      <label for="years">Tenure (Years)</label>
      <input type="number" id="years" min="0.0833" max="50" step="any" placeholder="5">
      ${actions("Calculate EMI","calcEMI","resetEMI")}
      <div id="emiResult" class="age-results" hidden></div>`),

    percent: shell("％", "Percentage Calculator", "Find a percentage of a number.", `
      <label for="p">Percentage (%)</label>
      <input type="number" id="p" step="any" placeholder="20">
      <label for="n">Number</label>
      <input type="number" id="n" step="any" placeholder="500">
      ${actions("Calculate","calcPercent","resetPercent")}
      <div id="result" class="tool-result"></div>`),

    gst: shell("🧾", "GST Calculator", "Add GST or extract it from an inclusive price.", `
      <label for="gstAmount">Amount (₹)</label>
      <input type="number" id="gstAmount" min="0.01" step="any" placeholder="1000">
      <label for="gstRate">GST Rate</label>
      <select id="gstRate">
        <option value="5">5%</option><option value="12">12%</option>
        <option value="18" selected>18%</option><option value="28">28%</option>
      </select>
      <label for="gstType">Calculation Type</label>
      <select id="gstType"><option value="add">Add GST</option><option value="remove">Remove GST from total</option></select>
      ${actions("Calculate GST","calcGST","resetGST")}
      <div id="gstResult" class="age-results" hidden></div>`),

    discount: shell("🏷️", "Discount Calculator", "Calculate savings and final price.", `
      <label for="price">Original Price (₹)</label>
      <input type="number" id="price" min="0.01" step="any" placeholder="1000">
      <label for="disc">Discount (%)</label>
      <input type="number" id="disc" min="0" max="100" step="any" placeholder="20">
      ${actions("Calculate Discount","calcDiscount","resetDiscount")}
      <div id="result" class="tool-result"></div>`),

    bmi: shell("⚖️", "BMI Calculator", "Calculate Body Mass Index.", `
      <label for="weight">Weight (kg)</label>
      <input type="number" id="weight" min="0.1" step="any" placeholder="70">
      <label for="height">Height (cm)</label>
      <input type="number" id="height" min="1" step="any" placeholder="170">
      ${actions("Calculate BMI","calcBMI","resetBMI")}
      <div id="result" class="tool-result"></div>`),

    image: shell("🖼️", "Image Compressor", "Compress an image and download it.", `
      <label for="imageFile">Select Image</label>
      <input type="file" id="imageFile" accept="image/jpeg,image/png,image/webp">
      <label for="imageQuality">JPEG Quality</label>
      <input type="range" id="imageQuality" min="0.1" max="1" step="0.1" value="0.7">
      <p class="tool-hint">Output is JPEG. Transparent areas become white.</p>
      <button type="button" onclick="compressImage()">Compress Image</button>
      <div id="result" class="tool-result"></div>`),

    pdf: shell("📄", "JPG to PDF", "Combine images into an A4 PDF.", `
      <label for="pdfFiles">Select JPG / PNG Images</label>
      <input type="file" id="pdfFiles" accept="image/jpeg,image/png" multiple>
      <p class="tool-hint">Each image is placed on its own page.</p>
      <button type="button" onclick="createPDF()">Create PDF</button>
      <div id="result" class="tool-result"></div>`),

    hindi: shell("🇮🇳", "Hindi Typing", "Convert common Roman Hindi words.", `
      <label for="romanHindi">Type in English letters</label>
      <textarea id="romanHindi" rows="5" placeholder="mera naam abhishek hai"></textarea>
      ${actions("Convert to Hindi","convertHindi","clearHindi")}
      <label>Hindi Output</label><div id="hindiOutput" class="typing-output" aria-live="polite"></div>
      <div class="tool-actions"><button onclick="copyHindi()">Copy Hindi</button><button onclick="downloadHindi()">Download Text</button></div>`),

    gujarati: shell("🪷", "Gujarati Typing", "Convert common Roman Gujarati words.", `
      <label for="romanGujarati">Type in English letters</label>
      <textarea id="romanGujarati" rows="5" placeholder="maru naam abhishek che"></textarea>
      ${actions("Convert to Gujarati","convertGujarati","clearGujarati")}
      <label>Gujarati Output</label><div id="gujaratiOutput" class="typing-output" aria-live="polite"></div>
      <div class="tool-actions"><button onclick="copyGujarati()">Copy Gujarati</button><button onclick="downloadGujarati()">Download Text</button></div>`)
  };

  content.innerHTML = tools[type] || "<p>Tool not found.</p>";
  modal.hidden = false;
  const box = modal.querySelector(".modal-box");
  if (box) box.scrollTop = 0;
}

function closeTool() {
  if (currentImageURL) URL.revokeObjectURL(currentImageURL);
  currentImageURL = null;
  if (modal) modal.hidden = true;
  if (content) content.innerHTML = "";
}

if (modal) {
  modal.addEventListener("click", e => {
    if (e.target === modal) closeTool();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !modal.hidden) closeTool();
  });
}

/* Age Calculator */
function calcAge() {
  const dobText = inTool("dob")?.value;
  const result = inTool("ageResult");
  if (!dobText || !result || dobText > todayISO()) {
    message(result, "Please select a valid date of birth.");
    return;
  }
  const dob = new Date(`${dobText}T00:00:00`);
  const today = new Date();
  today.setHours(0,0,0,0);
  if (Number.isNaN(dob.getTime()) || dob > today) {
    message(result, "Please select a valid date of birth.");
    return;
  }
  let y = today.getFullYear() - dob.getFullYear();
  let m = today.getMonth() - dob.getMonth();
  let d = today.getDate() - dob.getDate();
  if (d < 0) {
    m--;
    d += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }
  if (m < 0) { y--; m += 12; }
  result.hidden = false;
  result.innerHTML = cards("Your Exact Age", [
    {value:y,label:"Years"},{value:m,label:"Months"},{value:d,label:"Days"}
  ], "Calculated as of today.") +
    `<button type="button" onclick="copyAgeResult()">Copy Result</button>`;
}
function resetAge() {
  if (inTool("dob")) inTool("dob").value = "";
  clearResult("ageResult");
}
function copyAgeResult() {
  const el = inTool("ageResult");
  if (el && !el.hidden) copyText(el.innerText, "Age result copied!");
}

/* EMI Calculator */
function calcEMI() {
  const loanS = inTool("loan")?.value.trim();
  const rateS = inTool("rate")?.value.trim();
  const yearsS = inTool("years")?.value.trim();
  const result = inTool("emiResult");
  const loan = Number(loanS), rate = Number(rateS), years = Number(yearsS);
  if (!loanS || !rateS || !yearsS || !Number.isFinite(loan) || loan <= 0 ||
      !Number.isFinite(rate) || rate < 0 || !Number.isFinite(years) || years <= 0 || years > 50) {
    message(result, "Enter a valid loan, interest rate and tenure (up to 50 years).");
    return;
  }
  const months = Math.max(1, Math.round(years * 12));
  const r = rate / 1200;
  const emi = r === 0 ? loan / months : loan * r * Math.pow(1+r,months) / (Math.pow(1+r,months)-1);
  result.hidden = false;
  result.innerHTML = cards("Your Loan Summary", [
    {value:money(emi),label:"Monthly EMI"},
    {value:money(emi*months-loan),label:"Total Interest"},
    {value:money(emi*months),label:"Total Payment"}
  ], `Loan Amount: ${money(loan)} | Tenure: ${months} months`) +
    `<button type="button" onclick="copyEMIResult()">Copy Result</button>`;
}
function resetEMI() {
  resetFields(["loan","rate","years"]); clearResult("emiResult");
}
function copyEMIResult() {
  const el = inTool("emiResult");
  if (el && !el.hidden) copyText(el.innerText, "EMI result copied!");
}

/* Percentage Calculator */
function calcPercent() {
  const ps = inTool("p")?.value.trim(), ns = inTool("n")?.value.trim();
  if (!ps || !ns) return out("<p>Please enter both percentage and number.</p>");
  const p = Number(ps), n = Number(ns);
  if (!Number.isFinite(p) || !Number.isFinite(n)) return out("<p>Enter valid numbers.</p>");
  const answer = p / 100 * n;
  out(cards("Percentage Result", [
    {value:answer.toLocaleString("en-IN",{maximumFractionDigits:4}),label:`${p}% of ${n}`}
  ]) + `<button type="button" onclick="copyText(${JSON.stringify(String(answer))},'Result copied!')">Copy Result</button>`);
}
function resetPercent() { resetFields(["p","n"]); out(""); }

/* GST Calculator */
function calcGST() {
  const s = inTool("gstAmount")?.value.trim();
  const rate = Number(inTool("gstRate")?.value);
  const type = inTool("gstType")?.value;
  const result = inTool("gstResult");
  const amount = Number(s);
  if (!s || !Number.isFinite(amount) || amount <= 0) {
    message(result, "Enter an amount greater than zero."); return;
  }
  let base, gst, total;
  if (type === "add") { base = amount; gst = base*rate/100; total = base+gst; }
  else { total = amount; base = total*100/(100+rate); gst = total-base; }
  result.hidden = false;
  result.innerHTML = cards("GST Summary", [
    {value:money(base),label:"Base Amount"},
    {value:money(gst),label:`GST (${rate}%)`},
    {value:money(total),label:"Final Amount"}
  ]) + `<button type="button" onclick="copyGSTResult()">Copy Result</button>`;
}
function resetGST() {
  if (inTool("gstAmount")) inTool("gstAmount").value = "";
  if (inTool("gstRate")) inTool("gstRate").value = "18";
  if (inTool("gstType")) inTool("gstType").value = "add";
  clearResult("gstResult");
}
function copyGSTResult() {
  const el = inTool("gstResult");
  if (el && !el.hidden) copyText(el.innerText, "GST result copied!");
}

/* Discount Calculator */
function calcDiscount() {
  const ps = inTool("price")?.value.trim(), ds = inTool("disc")?.value.trim();
  if (!ps || !ds) return out("<p>Please enter price and discount percentage.</p>");
  const price = Number(ps), disc = Number(ds);
  if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(disc) || disc < 0 || disc > 100)
    return out("<p>Price must be positive and discount must be between 0% and 100%.</p>");
  const saved = price*disc/100, finalPrice = price-saved;
  out(cards("Discount Summary", [
    {value:money(saved),label:"You Save"},
    {value:money(finalPrice),label:"Final Price"}
  ]) + `<button type="button" onclick="copyText(${JSON.stringify(finalPrice.toFixed(2))},'Final price copied!')">Copy Final Price</button>`);
}
function resetDiscount() { resetFields(["price","disc"]); out(""); }

/* BMI Calculator */
function calcBMI() {
  const ws = inTool("weight")?.value.trim(), hs = inTool("height")?.value.trim();
  if (!ws || !hs) return out("<p>Please enter weight and height.</p>");
  const w = Number(ws), h = Number(hs);
  if (!Number.isFinite(w) || w <= 0 || !Number.isFinite(h) || h <= 0)
    return out("<p>Enter valid positive measurements.</p>");
  const bmi = w / Math.pow(h/100,2);
  const category = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal range" : bmi < 30 ? "Overweight" : "Obesity range";
  out(cards("BMI Result", [
    {value:bmi.toFixed(1),label:"BMI"},{value:category,label:"Category"}
  ], "BMI is a screening measure, not a medical diagnosis.") +
  `<button type="button" onclick="copyText(${JSON.stringify(bmi.toFixed(1))},'BMI copied!')">Copy BMI</button>`);
}
function resetBMI() { resetFields(["weight","height"]); out(""); }

/* Shared image helpers */
function readFileAsDataURL(file) {
  return new Promise((resolve,reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("File read failed"));
    reader.readAsDataURL(file);
  });
}
function loadImage(src) {
  return new Promise((resolve,reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = src;
  });
}
function canvasToBlob(canvas,type,quality) {
  return new Promise((resolve,reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Could not create image")),type,quality);
  });
}

/* Image Compressor */
async function compressImage() {
  const file = inTool("imageFile")?.files?.[0];
  const quality = Number(inTool("imageQuality")?.value || 0.7);
  if (!file) return out("<p>Please select an image first.</p>");
  if (!["image/jpeg","image/png","image/webp"].includes(file.type))
    return out("<p>Select a JPG, PNG or WebP image.</p>");
  if (file.size > 30*1024*1024) return out("<p>Please choose an image under 30 MB.</p>");
  out("<p>Compressing image… please wait.</p>");
  try {
    const img = await loadImage(await readFileAsDataURL(file));
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    ctx.fillStyle = "#fff"; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img,0,0);
    const blob = await canvasToBlob(canvas,"image/jpeg",quality);
    if (currentImageURL) URL.revokeObjectURL(currentImageURL);
    currentImageURL = URL.createObjectURL(blob);
    const saved = file.size ? (1-blob.size/file.size)*100 : 0;
    out(cards("Compressed Image Ready",[
      {value:(file.size/1024).toFixed(1)+" KB",label:"Original Size"},
      {value:(blob.size/1024).toFixed(1)+" KB",label:"Compressed Size"}
    ], blob.size < file.size ? `Size reduced by ${saved.toFixed(1)}%.` : "Output is not smaller at this quality.") +
    `<a class="download-link" href="${currentImageURL}" download="IndiaToolHub-compressed.jpg">Download Compressed Image</a>`);
  } catch (err) {
    console.error(err); out("<p>Image process nahi hui. Please try another image.</p>");
  }
}

/* JPG / PNG to PDF — requires jsPDF CDN in index.html */
async function createPDF() {
  const files = Array.from(inTool("pdfFiles")?.files || []);
  if (!files.length) return out("<p>Please select at least one JPG or PNG image.</p>");
  if (files.some(f => !["image/jpeg","image/png"].includes(f.type)))
    return out("<p>Only JPG and PNG files are supported.</p>");
  if (files.some(f => f.size > 25*1024*1024))
    return out("<p>Please use images smaller than 25 MB each.</p>");
  if (!window.jspdf?.jsPDF)
    return out("<p>PDF library load nahi hui. Check internet and jsPDF script in index.html.</p>");
  out("<p>Creating PDF… please wait.</p>");
  try {
    const {jsPDF} = window.jspdf;
    let pdf;
    for (const file of files) {
      const data = await readFileAsDataURL(file);
      const img = await loadImage(data);
      const orientation = img.width > img.height ? "landscape" : "portrait";
      if (!pdf) pdf = new jsPDF({orientation,unit:"mm",format:"a4"});
      else pdf.addPage("a4",orientation);
      const pw = pdf.internal.pageSize.getWidth(), ph = pdf.internal.pageSize.getHeight();
      const margin = 8, scale = Math.min((pw-2*margin)/img.width,(ph-2*margin)/img.height);
      const w = img.width*scale, h = img.height*scale;
      pdf.addImage(data,file.type === "image/png" ? "PNG" : "JPEG",(pw-w)/2,(ph-h)/2,w,h);
    }
    pdf.save("IndiaToolHub-images.pdf");
    out(`<h3>PDF Created Successfully!</h3><p>${files.length} image(s) added.</p>`);
  } catch (err) {
    console.error(err); out("<p>PDF create nahi hua. Try different JPG/PNG images.</p>");
  }
}

/* Hindi / Gujarati common-word dictionaries.
   These are basic dictionaries, not full transliteration engines. */
const hindiWords = {
  namaste:"नमस्ते",namaskar:"नमस्कार",mera:"मेरा",meri:"मेरी",mere:"मेरे",
  naam:"नाम",hai:"है",hain:"हैं",ho:"हो",ka:"का",ki:"की",ke:"के",ko:"को",
  se:"से",mein:"में",mai:"मैं",main:"मैं",hum:"हम",ham:"हम",aap:"आप",
  tum:"तुम",kya:"क्या",kyu:"क्यों",kyon:"क्यों",kaise:"कैसे",kaisi:"कैसी",
  accha:"अच्छा",achha:"अच्छा",achhi:"अच्छी",bahut:"बहुत",nahi:"नहीं",
  nahin:"नहीं",haan:"हाँ",han:"हाँ",ji:"जी",shukriya:"शुक्रिया",
  dhanyavad:"धन्यवाद",pyaar:"प्यार",pyar:"प्यार",dost:"दोस्त",dosti:"दोस्ती",
  ghar:"घर",paani:"पानी",khana:"खाना",khao:"खाओ",peena:"पीना",aaj:"आज",
  kal:"कल",ab:"अब",bharat:"भारत",india:"इंडिया",hindustan:"हिंदुस्तान",
  ram:"राम",shree:"श्री",shri:"श्री",bhagwan:"भगवान",mata:"माता",pita:"पिता",
  papa:"पापा",maa:"माँ",beta:"बेटा",beti:"बेटी",bhai:"भाई",behen:"बहन",
  behan:"बहन",aapka:"आपका",aapki:"आपकी",aapke:"आपके",theek:"ठीक",thik:"ठीक",
  meraa:"मेरा",naam:"नाम"
};

const gujaratiWords = {
  namaste:"નમસ્તે",namaskar:"નમસ્કાર",maru:"મારું",maro:"મારો",mari:"મારી",
  naam:"નામ",che:"છે",chhe:"છે",hu:"હું",hun:"હું",mane:"મને",tame:"તમે",
  tamne:"તમને",aap:"આપ",shu:"શું",su:"શું",kem:"કેમ",cho:"છો",chho:"છો",
  majama:"મજામાં",maja:"મજા",saru:"સારું",saras:"સરસ",bahu:"બહુ",
  nathi:"નથી",ha:"હા",haa:"હા",na:"ના",pani:"પાણી",paani:"પાણી",ghar:"ઘર",
  prem:"પ્રેમ",dost:"દોસ્ત",bhai:"ભાઈ",ben:"બેન",mata:"માતા",pita:"પિતા",
  pappa:"પપ્પા",maa:"મા",beta:"બેટા",dikro:"દીકરો",dikri:"દીકરી",aaje:"આજે",
  aavjo:"આવજો",abhar:"આભાર",dhanyavad:"ધન્યવાદ",ram:"રામ",shree:"શ્રી",
  bhagwan:"ભગવાન",bharat:"ભારત",gujarat:"ગુજરાત",naam:"નામ"
};

function convertWords(text, dictionary) {
  // Convert known words while preserving whitespace and punctuation.
  return text.replace(/[A-Za-z]+(?:'[A-Za-z]+)?/g, word =>
    dictionary[word.toLowerCase()] || word
  );
}

function convertHindi() {
  const input = inTool("romanHindi"), output = inTool("hindiOutput");
  if (!input || !output) return;
  if (!input.value.trim()) { output.textContent = "Please enter some text first."; return; }
  output.textContent = convertWords(input.value,hindiWords);
}
function copyHindi() {
  const text = inTool("hindiOutput")?.textContent || "";
  if (text.trim()) copyText(text,"Hindi text copied!");
}
function downloadHindi() {
  const text = inTool("hindiOutput")?.textContent || "";
  if (text.trim()) downloadText(text,"IndiaToolHub-Hindi.txt");
}
function clearHindi() {
  if (inTool("romanHindi")) inTool("romanHindi").value = "";
  if (inTool("hindiOutput")) inTool("hindiOutput").textContent = "";
}

function convertGujarati() {
  const input = inTool("romanGujarati"), output = inTool("gujaratiOutput");
  if (!input || !output) return;
  if (!input.value.trim()) { output.textContent = "Please enter some text first."; return; }
  output.textContent = convertWords(input.value,gujaratiWords);
}
function copyGujarati() {
  const text = inTool("gujaratiOutput")?.textContent || "";
  if (text.trim()) copyText(text,"Gujarati text copied!");
}
function downloadGujarati() {
  const text = inTool("gujaratiOutput")?.textContent || "";
  if (text.trim()) downloadText(text,"IndiaToolHub-Gujarati.txt");
}
function clearGujarati() {
  if (inTool("romanGujarati")) inTool("romanGujarati").value = "";
  if (inTool("gujaratiOutput")) inTool("gujaratiOutput").textContent = "";
}

/* Make inline onclick functions available to the page. */
Object.assign(window, {
  openTool, closeTool, calcAge, resetAge, copyAgeResult,
  calcEMI, resetEMI, copyEMIResult,
  calcPercent, resetPercent,
  calcGST, resetGST, copyGSTResult,
  calcDiscount, resetDiscount, calcBMI, resetBMI,
  compressImage, createPDF,
  convertHindi, copyHindi, downloadHindi, clearHindi,
  convertGujarati, copyGujarati, downloadGujarati, clearGujarati,
  copyText
});
