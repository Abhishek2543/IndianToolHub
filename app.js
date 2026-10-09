// =====================================================
// IndiaToolHub - app.js
// =====================================================

const modal = document.getElementById("modal");
const content = document.getElementById("toolContent");


// =====================================================
// OPEN TOOL
// =====================================================

function openTool(type) {

  modal.hidden = false;

  
if (type === "age") {
  content.innerHTML = `
    <div class="pro-tool">
      <div class="pro-tool-icon">🎂</div>
      <h2>Age Calculator</h2>
      <p class="tool-subtitle">
        Calculate your exact age in seconds.
      </p>

      <label for="dob">Date of Birth</label>
      <input
        type="date"
        id="dob"
        max="${new Date().toLocaleDateString("en-CA")}"
      >

      <div class="tool-actions">
        <button onclick="calcAge()">Calculate Age</button>
        <button class="reset-btn" onclick="resetAge()">Reset</button>
      </div>

      <div id="ageResult" class="age-results" hidden></div>
    </div>
  `;
}



  
else if (type === "emi") {
  content.innerHTML = `
    <div class="pro-tool">
      <div class="pro-tool-icon">💰</div>
      <h2>EMI Calculator</h2>
      <p class="tool-subtitle">
        Estimate your monthly loan payment.
      </p>

      <label for="loan">Loan Amount (₹)</label>
      <input type="number" id="loan" min="1" placeholder="e.g. 500000">

      <label for="rate">Annual Interest Rate (%)</label>
      <input type="number" id="rate" min="0" step="0.01" placeholder="e.g. 8.5">

      <label for="years">Loan Tenure (Years)</label>
      <input type="number" id="years" min="1" max="50" step="1" placeholder="e.g. 5">

      <div class="tool-actions">
        <button onclick="calcEMI()">Calculate EMI</button>
        <button class="reset-btn" onclick="resetEMI()">Reset</button>
      </div>

      <div id="emiResult" class="age-results" hidden></div>
    </div>
  `;
}



  else if (type === "percent") {

    content.innerHTML = `
      <h2>Percentage Calculator</h2>

      <label>Percentage (%)</label>
      <input type="number" id="p" placeholder="20">

      <label>Number</label>
      <input type="number" id="n" placeholder="500">

      <button onclick="calcPercent()">Calculate</button>

      <div id="result"></div>
    `;

  }


  else if (type === "gst") {

    content.innerHTML = `
      <h2>GST Calculator</h2>

      <label>Amount (₹)</label>
      <input type="number" id="amt" placeholder="1000">

      <label>GST Rate (%)</label>
      <input type="number" id="gst" placeholder="18">

      <button onclick="calcGST()">Calculate GST</button>

      <div id="result"></div>
    `;

  }


  else if (type === "discount") {

    content.innerHTML = `
      <h2>Discount Calculator</h2>

      <label>Original Price (₹)</label>
      <input type="number" id="price" placeholder="1000">

      <label>Discount (%)</label>
      <input type="number" id="disc" placeholder="20">

      <button onclick="calcDiscount()">Calculate Discount</button>

      <div id="result"></div>
    `;

  }


  else if (type === "bmi") {

    content.innerHTML = `
      <h2>BMI Calculator</h2>

      <label>Weight (kg)</label>
      <input type="number" id="weight" placeholder="70" step="0.1">

      <label>Height (cm)</label>
      <input type="number" id="height" placeholder="170" step="0.1">

      <button onclick="calcBMI()">Calculate BMI</button>

      <div id="result"></div>
    `;

  }


  else if (type === "image") {

    content.innerHTML = `
      <h2>Image Compressor</h2>

      <label>Select Image</label>
      <input type="file" id="imageFile" accept="image/*">

      <label>Quality</label>
      <input
        type="range"
        id="imageQuality"
        min="0.1"
        max="1"
        step="0.1"
        value="0.7"
      >

      <button onclick="compressImage()">Compress Image</button>

      <div id="result"></div>
    `;

  }


  else if (type === "pdf") {

    content.innerHTML = `
      <h2>JPG to PDF</h2>

      <label>Select JPG / PNG Images</label>

      <input
        type="file"
        id="pdfFiles"
        accept="image/jpeg,image/png"
        multiple
      >

      <button onclick="createPDF()">Create PDF</button>

      <div id="result"></div>
    `;

  }


  else if (type === "hindi") {

    content.innerHTML = `
      <h2>Hindi Typing</h2>

      <p>English में लिखें और Hindi में बदलें।</p>

      <textarea
        id="romanHindi"
        rows="6"
        placeholder="mera naam abhishek hai"
      ></textarea>

      <button onclick="convertHindi()">
        Convert to Hindi
      </button>

      <button onclick="copyHindi()">
        Copy
      </button>

      <button onclick="downloadHindi()">
        Download
      </button>

      <div
        id="hindiOutput"
        class="typing-output"
      ></div>
    `;

  }


  else if (type === "gujarati") {

    content.innerHTML = `
      <h2>Gujarati Typing</h2>

      <p>English में लिखें और Gujarati में बदलें।</p>

      <textarea
        id="romanGujarati"
        rows="6"
        placeholder="maru naam abhishek che"
      ></textarea>

      <button onclick="convertGujarati()">
        Convert to Gujarati
      </button>

      <button onclick="copyGujarati()">
        Copy
      </button>

      <button onclick="downloadGujarati()">
        Download
      </button>

      <div
        id="gujaratiOutput"
        class="typing-output"
      ></div>
    `;

  }
}


// =====================================================
// CLOSE TOOL
// =====================================================

function closeTool() {

  modal.hidden = true;

  content.innerHTML = "";
}


// =====================================================
// SHOW RESULT
// =====================================================

function out(message) {

  const result = document.getElementById("result");

  if (result) {
    result.innerHTML = message;
  }
}


// =====================================================
// AGE CALCULATOR
// =====================================================


function calcAge() {
  const input = document.getElementById("dob");
  const result = document.getElementById("ageResult");

  if (!input.value) {
    result.hidden = false;
    result.innerHTML = "<p>Please select your date of birth.</p>";
    return;
  }

  const dob = new Date(input.value + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(dob.getTime()) || dob > today) {
    result.hidden = false;
    result.innerHTML = "<p>Please enter a valid date of birth.</p>";
    return;
  }

  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    const daysInPreviousMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0
    ).getDate();
    days += daysInPreviousMonth;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  result.hidden = false;
  result.innerHTML = `
    <h3>Your Exact Age</h3>
    <div class="age-result-grid">
      <div class="age-result-card">
        <strong>${years}</strong>
        <span>Years</span>
      </div>
      <div class="age-result-card">
        <strong>${months}</strong>
        <span>Months</span>
      </div>
      <div class="age-result-card">
        <strong>${days}</strong>
        <span>Days</span>
      </div>
    </div>
    <p class="age-note">Age calculated as of today.</p>
    <button onclick="copyAgeResult()">Copy Result</button>
  `;
}

function resetAge() {
  document.getElementById("dob").value = "";
  const result = document.getElementById("ageResult");
  result.hidden = true;
  result.innerHTML = "";
}

function copyAgeResult() {
  const result = document.getElementById("ageResult");
  const text = result.querySelector(".age-result-grid").innerText;

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
      .then(() => out("Age result copied! ✅"))
      .catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}



// =====================================================
// EMI CALCULATOR
// =====================================================


function calcEMI() {
  const loan = Number(document.getElementById("loan").value);
  const rate = Number(document.getElementById("rate").value);
  const years = Number(document.getElementById("years").value);
  const result = document.getElementById("emiResult");

  if (
    !Number.isFinite(loan) ||
    !Number.isFinite(rate) ||
    !Number.isFinite(years) ||
    loan <= 0 ||
    rate < 0 ||
    years <= 0 ||
    years > 50
  ) {
    result.hidden = false;
    result.innerHTML = "<p>Please enter valid loan details. Tenure must be 50 years or less.</p>";
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

  const money = value =>
    "₹" + value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

  result.hidden = false;
  result.innerHTML = `
    <h3>Your Loan Summary</h3>

    <div class="age-result-grid">
      <div class="age-result-card">
        <strong style="font-size:20px">${money(emi)}</strong>
        <span>Monthly EMI</span>
      </div>

      <div class="age-result-card">
        <strong style="font-size:20px">${money(totalInterest)}</strong>
        <span>Total Interest</span>
      </div>

      <div class="age-result-card">
        <strong style="font-size:20px">${money(totalPayment)}</strong>
        <span>Total Payment</span>
      </div>
    </div>

    <p class="age-note">
      Loan Amount: ${money(loan)}<br>
      Tenure: ${months} months
    </p>

    <button onclick="copyEMIResult()">Copy Result</button>
  `;
}

function resetEMI() {
  document.getElementById("loan").value = "";
  document.getElementById("rate").value = "";
  document.getElementById("years").value = "";

  const result = document.getElementById("emiResult");
  result.hidden = true;
  result.innerHTML = "";
}

function copyEMIResult() {
  const result = document.getElementById("emiResult");

  if (!result || result.hidden) return;

  const text = result.innerText;

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
      .then(() => out("EMI result copied! ✅"))
      .catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}



// =====================================================
// PERCENTAGE CALCULATOR
// =====================================================

function calcPercent() {

  const p =
    Number(document.getElementById("p").value);

  const n =
    Number(document.getElementById("n").value);

  if (
    isNaN(p) ||
    isNaN(n)
  ) {

    out("Please enter valid numbers.");

    return;
  }

  const result =
    (p / 100) * n;

  out(
    `<b>${p}% of ${n} = ${result}</b>`
  );
}


// =====================================================
// GST CALCULATOR
// =====================================================

function calcGST() {

  const amt =
    Number(document.getElementById("amt").value);

  const gst =
    Number(document.getElementById("gst").value);

  if (
    amt <= 0 ||
    gst < 0
  ) {

    out("Please enter valid amount and GST rate.");

    return;
  }

  const gstAmount =
    amt * gst / 100;

  const total =
    amt + gstAmount;

  out(`
    <b>GST Amount:</b> ₹${gstAmount.toFixed(2)}<br>
    <b>Total Amount:</b> ₹${total.toFixed(2)}
  `);
}


// =====================================================
// DISCOUNT CALCULATOR
// =====================================================

function calcDiscount() {

  const price =
    Number(document.getElementById("price").value);

  const disc =
    Number(document.getElementById("disc").value);

  if (
    price <= 0 ||
    disc < 0
  ) {

    out("Please enter valid price and discount.");

    return;
  }

  const discountAmount =
    price * disc / 100;

  const finalPrice =
    price - discountAmount;

  out(`
    <b>Discount:</b> ₹${discountAmount.toFixed(2)}<br>
    <b>Final Price:</b> ₹${finalPrice.toFixed(2)}
  `);
}


// =====================================================
// BMI CALCULATOR
// =====================================================

function calcBMI() {

  const weight =
    Number(document.getElementById("weight").value);

  const height =
    Number(document.getElementById("height").value);

  if (
    weight <= 0 ||
    height <= 0
  ) {

    out("Please enter valid weight and height.");

    return;
  }

  const heightMeters =
    height / 100;

  const bmi =
    weight /
    (
      heightMeters *
      heightMeters
    );

  let category = "";

  if (bmi < 18.5) {

    category = "Underweight";

  } else if (bmi < 25) {

    category = "Normal";

  } else if (bmi < 30) {

    category = "Overweight";

  } else {

    category = "Obese";
  }

  out(`
    <b>BMI:</b> ${bmi.toFixed(2)}<br>
    <b>Category:</b> ${category}
  `);
}


// =====================================================
// IMAGE COMPRESSOR
// =====================================================

function compressImage() {

  const fileInput =
    document.getElementById("imageFile");

  const qualityInput =
    document.getElementById("imageQuality");

  const file =
    fileInput.files[0];

  const quality =
    Number(qualityInput.value);

  if (!file) {

    out("Please select an image.");

    return;
  }

  if (!file.type.startsWith("image/")) {

    out("Please select a valid image.");

    return;
  }

  const reader =
    new FileReader();

  reader.onload = function(event) {

    loadImage(event.target.result)
      .then(function(image) {

        const canvas =
          document.createElement("canvas");

        const ctx =
          canvas.getContext("2d");

        canvas.width =
          image.width;

        canvas.height =
          image.height;

        ctx.drawImage(
          image,
          0,
          0
        );

        canvas.toBlob(
          function(blob) {

            if (!blob) {

              out("Image compression failed.");

              return;
            }

            const url =
              URL.createObjectURL(blob);

            out(`
              <p><b>Compressed image ready!</b></p>

              <p>
                Original:
                ${(file.size / 1024).toFixed(1)} KB
              </p>

              <p>
                Compressed:
                ${(blob.size / 1024).toFixed(1)} KB
              </p>

              <a
                href="${url}"
                download="IndiaToolHub-compressed.jpg"
              >
                Download Compressed Image
              </a>
            `);

          },
          "image/jpeg",
          quality
        );

      })
      .catch(function() {

        out("Could not process image.");

      });
  };

  reader.readAsDataURL(file);
}


// =====================================================
// READ FILE AS DATA URL
// =====================================================

function readFileAsDataURL(file) {

  return new Promise(function(resolve, reject) {

    const reader =
      new FileReader();

    reader.onload =
      function() {
        resolve(reader.result);
      };

    reader.onerror =
      function() {
        reject(reader.error);
      };

    reader.readAsDataURL(file);
  });
}


// =====================================================
// LOAD IMAGE
// =====================================================

function loadImage(src) {

  return new Promise(function(resolve, reject) {

    const image =
      new Image();

    image.onload =
      function() {
        resolve(image);
      };

    image.onerror =
      function() {
        reject(new Error("Image loading failed"));
      };

    image.src = src;
  });
}


// =====================================================
// JPG TO PDF
// =====================================================

async function createPDF() {

  const input =
    document.getElementById("pdfFiles");

  const files =
    Array.from(input.files);

  if (!files.length) {

    out("Please select at least one image.");

    return;
  }

  if (
    typeof window.jspdf === "undefined" ||
    !window.jspdf.jsPDF
  ) {

    out("PDF library load नहीं हुई। Internet connection check करें.");

    return;
  }

  try {

    const {
      jsPDF
    } = window.jspdf;

    let pdf = null;

    for (let i = 0; i < files.length; i++) {

      const file = files[i];

      if (!file.type.startsWith("image/")) {
        continue;
      }

      const data =
        await readFileAsDataURL(file);

      const image =
        await loadImage(data);

      const orientation =
        image.width > image.height
          ? "landscape"
          : "portrait";

      if (!pdf) {

        pdf =
          new jsPDF({
            orientation: orientation,
            unit: "mm",
            format: "a4"
          });

      } else {

        pdf.addPage(
          "a4",
          orientation
        );
      }

      const pageWidth =
        pdf.internal.pageSize.getWidth();

      const pageHeight =
        pdf.internal.pageSize.getHeight();

      const margin = 10;

      const maxWidth =
        pageWidth - margin * 2;

      const maxHeight =
        pageHeight - margin * 2;

      const ratio =
        Math.min(
          maxWidth / image.width,
          maxHeight / image.height
        );

      const width =
        image.width * ratio;

      const height =
        image.height * ratio;

      const x =
        (pageWidth - width) / 2;

      const y =
        (pageHeight - height) / 2;

      pdf.addImage(
        data,
        "JPEG",
        x,
        y,
        width,
        height
      );
    }

    if (!pdf) {

      out("No valid images selected.");

      return;
    }

    pdf.save(
      "IndiaToolHub-JPG-to-PDF.pdf"
    );

    out("PDF successfully created! ✅");

  } catch (error) {

    console.error(error);

    out("PDF बनाने में समस्या हुई।");

  }
}


// =====================================================
// HINDI DICTIONARY
// =====================================================

const hindiWords = {

  mera: "मेरा",
  meri: "मेरी",
  mere: "मेरे",

  naam: "नाम",

  hai: "है",
  hain: "हैं",

  main: "मैं",
  mai: "मैं",
  mein: "में",
  me: "में",

  aap: "आप",
  ap: "आप",

  tum: "तुम",
  hum: "हम",

  ka: "का",
  ki: "की",
  ke: "के",

  ko: "को",
  se: "से",
  par: "पर",

  aur: "और",
  or: "और",

  ye: "ये",
  yah: "यह",
  yeh: "यह",

  woh: "वह",
  wo: "वो",

  kya: "क्या",
  kyun: "क्यों",
  kyu: "क्यों",

  kaise: "कैसे",
  kab: "कब",
  kahan: "कहाँ",

  achha: "अच्छा",
  accha: "अच्छा",
  achhi: "अच्छी",
  achche: "अच्छे",

  bahut: "बहुत",
  bilkul: "बिल्कुल",

  dhanyavad: "धन्यवाद",
  shukriya: "शुक्रिया",

  pyaar: "प्यार",
  pyar: "प्यार",

  dost: "दोस्त",
  dosti: "दोस्ती",

  ghar: "घर",

  paani: "पानी",
  pani: "पानी",

  khana: "खाना",
  khaana: "खाना",

  mujhe: "मुझे",
  mujko: "मुझको",

  tumhe: "तुम्हें",
  aapko: "आपको",

  hume: "हमें",
  hame: "हमें",

  nahi: "नहीं",
  nahin: "नहीं",

  haan: "हाँ",
  han: "हाँ",

  abhi: "अभी",
  aaj: "आज",
  kal: "कल",

  subah: "सुबह",
  shaam: "शाम",
  raat: "रात",
  din: "दिन",

  bada: "बड़ा",
  badi: "बड़ी",
  bade: "बड़े",

  chhota: "छोटा",
  choti: "छोटी",

  bahar: "बाहर",
  andar: "अंदर",

  upar: "ऊपर",
  neeche: "नीचे",

  samay: "समय",
  waqt: "वक्त",

  zindagi: "ज़िंदगी",
  jindagi: "ज़िंदगी",

  duniya: "दुनिया",

  bharat: "भारत",
  india: "इंडिया",
  hindustan: "हिंदुस्तान",

  bhagwan: "भगवान",
  ram: "राम",
  krishna: "कृष्ण",
  shree: "श्री",

  mata: "माता",
  pita: "पिता",
  maa: "माँ",
  papa: "पापा",

  bhai: "भाई",
  behen: "बहन",

  beta: "बेटा",
  beti: "बेटी",

  ladka: "लड़का",
  ladki: "लड़की",

  school: "स्कूल",
  college: "कॉलेज",

  kitab: "किताब",
  kitaab: "किताब",

  mobile: "मोबाइल",
  phone: "फोन",

  computer: "कंप्यूटर",
  internet: "इंटरनेट",
  website: "वेबसाइट",

  paisa: "पैसा",
  paise: "पैसे",

  kaam: "काम",

  kar: "कर",
  karo: "करो",
  karna: "करना",
  karta: "करता",
  karti: "करती",
  karte: "करते",

  kiya: "किया",

  ja: "जा",
  jao: "जाओ",
  jaana: "जाना",
  jana: "जाना",

  aana: "आना",
  aao: "आओ",

  gaya: "गया",
  gayi: "गई",
  gaye: "गए",

  aaya: "आया",
  aayi: "आई",

  bol: "बोल",
  bolo: "बोलो",

  baat: "बात",

  sun: "सुन",
  suno: "सुनो",

  dekh: "देख",
  dekho: "देखो",

  likh: "लिख",
  likho: "लिखो",

  padh: "पढ़",
  padho: "पढ़ो",

  samajh: "समझ",
  samjho: "समझो",

  chahiye: "चाहिए",

  sakta: "सकता",
  sakti: "सकती",
  sakte: "सकते",

  hoga: "होगा",
  hogi: "होगी",
  honge: "होंगे",

  tha: "था",
  thi: "थी",
  the: "थे",

  ek: "एक",
  do: "दो",
  teen: "तीन",
  char: "चार",
  paanch: "पाँच",

  apna: "अपना",
  apni: "अपनी",
  apne: "अपने",

  sab: "सब",
  sabhi: "सभी",

  kuch: "कुछ",
  koi: "कोई",

  kaun: "कौन",
  kiska: "किसका",

  kitna: "कितना",
  kitne: "कितने",
  kitni: "कितनी",

  kyunki: "क्योंकि",
  lekin: "लेकिन",

  agar: "अगर",
  to: "तो",

  jab: "जब",
  tab: "तब",

  bhi: "भी",
  hi: "ही",
  sirf: "सिर्फ",

  phir: "फिर",
  pehle: "पहले",
  baad: "बाद",

  saath: "साथ",
  bina: "बिना",

  liye: "लिए",
  liya: "लिया",

  dena: "देना",
  lena: "लेना",
  lelo: "ले लो",

  thik: "ठीक",
  theek: "ठीक",

  sahi: "सही",
  galat: "गलत",

  zaroor: "ज़रूर",
  jarur: "जरूर",
  zaroori: "ज़रूरी"
};


// =====================================================
// HINDI CONVERTER
// =====================================================

function convertHindi() {

  const inputElement =
    document.getElementById("romanHindi");

  const outputElement =
    document.getElementById("hindiOutput");

  if (!inputElement || !outputElement) {
    return;
  }

  const input =
    inputElement.value.trim();

  if (!input) {

    outputElement.textContent = "";

    out("पहले English में कुछ लिखें।");

    return;
  }

  const result =
    input
      .split(/\s+/)
      .map(function(word) {

        const punctuation =
          word.match(/[.,!?;:]+$/);

        const clean =
          word
            .toLowerCase()
            .replace(/[.,!?;:]+$/, "");

        const converted =
          hindiWords[clean] || word;

        return (
          converted +
          (
            punctuation
              ? punctuation[0]
              : ""
          )
        );
      })
      .join(" ");

  outputElement.textContent = result;
}


// =====================================================
// COPY HINDI
// =====================================================

function copyHindi() {

  const output =
    document.getElementById("hindiOutput");

  if (!output) {
    return;
  }

  const text =
    output.textContent.trim();

  if (!text) {

    out("पहले Hindi text बनाएं।");

    return;
  }

  if (
    navigator.clipboard &&
    window.isSecureContext
  ) {

    navigator.clipboard
      .writeText(text)
      .then(function() {

        out("Hindi text copied! ✅");

      })
      .catch(function() {

        fallbackCopy(text);

      });

  } else {

    fallbackCopy(text);

  }
}


// =====================================================
// FALLBACK COPY
// =====================================================

function fallbackCopy(text) {

  const textarea =
    document.createElement("textarea");

  textarea.value = text;

  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";

  document.body.appendChild(textarea);

  textarea.focus();
  textarea.select();

  try {

    document.execCommand("copy");

    out("Hindi text copied! ✅");

  } catch (error) {

    out("Copy नहीं हो पाया। Text को manually select करके copy करें.");

  }

  document.body.removeChild(textarea);
}


// =====================================================
// DOWNLOAD HINDI
// =====================================================

function downloadHindi() {

  const output =
    document.getElementById("hindiOutput");

  if (!output) {
    return;
  }

  const text =
    output.textContent.trim();

  if (!text) {

    out("पहले Hindi text बनाएं।");

    return;
  }

  downloadTextFile(
    text,
    "IndiaToolHub-Hindi.txt"
  );
}


// =====================================================
// GUJARATI DICTIONARY
// =====================================================

const gujaratiWords = {

  maru: "મારું",
  maaru: "મારું",

  maro: "મારો",
  mari: "મારી",
  mara: "મારા",

  naam: "નામ",

  che: "છે",
  chhe: "છે",

  chu: "છું",
  chhu: "છું",

  cho: "છો",
  chho: "છો",

  hu: "હું",
  hun: "હું",

  tame: "તમે",

  tamaru: "તમારું",
  tamaro: "તમારો",
  tamari: "તમારી",

  aap: "આપ",

  su: "શું",
  shu: "શું",

  kem: "કેમ",

  kya: "ક્યાં",

  kyare: "ક્યારે",

  kemcho: "કેમ છો",

  maja: "મજા",

  saras: "સરસ",

  nathi: "નથી",
  nahi: "નહીં",

  ha: "હા",
  haa: "હા",

  ane: "અને",
  pan: "પણ",

  athva: "અથવા",

  ghar: "ઘર",
  ghare: "ઘરે",

  bahar: "બહાર",
  andar: "અંદર",

  paani: "પાણી",
  pani: "પાણી",

  jamvanu: "જમવાનું",

  khavu: "ખાવું",
  khay: "ખાય",

  pivu: "પીવું",

  aavvu: "આવવું",
  aavo: "આવો",
  aavi: "આવી",

  jav: "જાવ",
  javu: "જવું",
  jao: "જાઓ",

  karo: "કરો",
  karvu: "કરવું",
  karu: "કરું",
  karie: "કરીએ",

  joie: "જોઈએ",
  joiye: "જોઈએ",

  mane: "મને",
  tamne: "તમને",
  amne: "અમને",

  dost: "દોસ્ત",
  mitra: "મિત્ર",

  bhai: "ભાઈ",
  behen: "બહેન",
  ben: "બેન",

  maa: "મા",
  mata: "માતા",
  pita: "પિતા",
  papa: "પપ્પા",

  dikro: "દીકરો",
  dikri: "દીકરી",

  chokro: "છોકરો",
  chokri: "છોકરી",

  balak: "બાળક",

  ram: "રામ",
  sita: "સીતા",
  krishna: "કૃષ્ણ",

  jay: "જય",
  shree: "શ્રી",
  bhagwan: "ભગવાન",

  gujarat: "ગુજરાત",
  gujarati: "ગુજરાતી",

  bharat: "ભારત",
  india: "ઇન્ડિયા",

  namaste: "નમસ્તે",

  aabhar: "આભાર",
  dhanyavad: "ધન્યવાદ",

  maaf: "માફ",

  ek: "એક",
  be: "બે",
  tran: "ત્રણ",
  char: "ચાર",
  panch: "પાંચ",
  chh: "છ",
  saat: "સાત",
  aath: "આઠ",
  nav: "નવ",
  das: "દસ",

  aaje: "આજે",
  aaj: "આજે",

  kale: "કાલે",

  savar: "સવાર",
  bapor: "બપોર",
  sanj: "સાંજ",
  raat: "રાત",
  divas: "દિવસ",

  kaam: "કામ",
  paisa: "પૈસા",
  samay: "સમય",

  aav: "આવ",
  jaldi: "જલ્દી",

  bahu: "બહુ",
  khub: "ખૂબ",

  saru: "સારું",
  sari: "સારી",
  saro: "સારો",

  motu: "મોટું",
  moto: "મોટો",

  nani: "નાની",
  nanu: "નાનું",

  navo: "નવો",
  navi: "નવી",
  navu: "નવું"
};


// =====================================================
// GUJARATI CONVERTER
// =====================================================

function convertGujarati() {

  const inputElement =
    document.getElementById("romanGujarati");

  const outputElement =
    document.getElementById("gujaratiOutput");

  if (!inputElement || !outputElement) {
    return;
  }

  const input =
    inputElement.value.trim();

  if (!input) {

    outputElement.textContent = "";

    out("પહેલા English માં કંઈક લખો.");

    return;
  }

  const result =
    input
      .split(/\s+/)
      .map(function(word) {

        const punctuation =
          word.match(/[.,!?;:]+$/);

        const clean =
          word
            .toLowerCase()
            .replace(/[.,!?;:]+$/, "");

        const converted =
          gujaratiWords[clean] || word;

        return (
          converted +
          (
            punctuation
              ? punctuation[0]
              : ""
          )
        );
      })
      .join(" ");

  outputElement.textContent = result;
}


// =====================================================
// COPY GUJARATI
// =====================================================

function copyGujarati() {

  const output =
    document.getElementById("gujaratiOutput");

  if (!output) {
    return;
  }

  const text =
    output.textContent.trim();

  if (!text) {

    out("પહેલા Gujarati text બનાવો.");

    return;
  }

  if (
    navigator.clipboard &&
    window.isSecureContext
  ) {

    navigator.clipboard
      .writeText(text)
      .then(function() {

        out("Gujarati text copied! ✅");

      })
      .catch(function() {

        fallbackCopy(text);

      });

  } else {

    fallbackCopy(text);

  }
}


// =====================================================
// DOWNLOAD GUJARATI
// =====================================================

function downloadGujarati() {

  const output =
    document.getElementById("gujaratiOutput");

  if (!output) {
    return;
  }

  const text =
    output.textContent.trim();

  if (!text) {

    out("પહેલા Gujarati text બનાવો.");

    return;
  }

  downloadTextFile(
    text,
    "IndiaToolHub-Gujarati.txt"
  );
}


// =====================================================
// DOWNLOAD TEXT FILE
// =====================================================

function downloadTextFile(text, filename) {

  const blob =
    new Blob(
      [text],
      {
        type: "text/plain;charset=utf-8"
      }
    );

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;

  a.download = filename;

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);

  setTimeout(function() {

    URL.revokeObjectURL(url);

  }, 1000);
}


// =====================================================
// ESC KEY - CLOSE MODAL
// =====================================================

document.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Escape") {

      closeTool();

    }

  }
);
