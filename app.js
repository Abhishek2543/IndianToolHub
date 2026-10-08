const modal = document.getElementById("modal");
const content = document.getElementById("toolContent");

function openTool(type) {
  let html = "";

  if (type === "age") {
    html = `
      <h2>🎂 Age Calculator</h2>
      <div class="form">
        <label>Date of birth
          <input id="dob" type="date">
        </label>
        <button onclick="calcAge()">Calculate Age</button>
      </div>
      <div id="result"></div>`;
  }

  if (type === "emi") {
    html = `
      <h2>💰 EMI Calculator</h2>
      <div class="form">
        <label>Loan amount (₹)
          <input id="loan" type="number" value="500000">
        </label>
        <label>Annual interest (%)
          <input id="rate" type="number" value="8.5">
        </label>
        <label>Tenure (years)
          <input id="years" type="number" value="5">
        </label>
        <button onclick="calcEMI()">Calculate EMI</button>
      </div>
      <div id="result"></div>`;
  }

  if (type === "percent") {
    html = `
      <h2>％ Percentage Calculator</h2>
      <div class="form">
        <label>Percentage
          <input id="p" type="number" value="20">
        </label>
        <label>Number
          <input id="n" type="number" value="500">
        </label>
        <button onclick="calcPercent()">Calculate</button>
      </div>
      <div id="result"></div>`;
  }

  if (type === "gst") {
    html = `
      <h2>🧾 GST Calculator</h2>
      <div class="form">
        <label>Amount (₹)
          <input id="amt" type="number" value="1000">
        </label>
        <label>GST (%)
          <input id="gst" type="number" value="18">
        </label>
        <button onclick="calcGST()">Calculate</button>
      </div>
      <div id="result"></div>`;
  }

  if (type === "discount") {
    html = `
      <h2>🏷️ Discount Calculator</h2>
      <div class="form">
        <label>Original price (₹)
          <input id="price" type="number" value="1000">
        </label>
        <label>Discount (%)
          <input id="disc" type="number" value="20">
        </label>
        <button onclick="calcDiscount()">Calculate</button>
      </div>
      <div id="result"></div>`;
  }

  if (type === "bmi") {
    html = `
      <h2>⚖️ BMI Calculator</h2>
      <div class="form">
        <label>Weight (kg)
          <input id="weight" type="number" value="70">
        </label>
        <label>Height (cm)
          <input id="height" type="number" value="170">
        </label>
        <button onclick="calcBMI()">Calculate BMI</button>
      </div>
      <div id="result"></div>`;
  }

  if (type === "image") {
    html = `
      <h2>🖼️ Image Compressor</h2>
      <div class="form">
        <label>Select image
          <input id="imageFile" type="file" accept="image/*">
        </label>
        <label>Quality (%)
          <input id="imageQuality" type="range"
                 min="10" max="100" value="70"
                 oninput="qualityValue.textContent=this.value+'%'">
        </label>
        <p>Quality: <b id="qualityValue">70%</b></p>
        <button onclick="compressImage()">Compress Image</button>
      </div>
      <div id="result"></div>`;
  }

  if (type === "pdf") {
    html = `
      <h2>📄 JPG to PDF</h2>
      <div class="form">
        <label>Select images
          <input id="pdfFiles" type="file" accept="image/*" multiple>
        </label>
        <button onclick="createPDF()">Create PDF</button>
      </div>
      <div id="result"></div>`;
  }

  if(type==="hindi") html=`
<h2>⌨️ English to Hindi Typing</h2>
<p>English letters में लिखें और Hindi में बदलें।</p>

<div class="form">
<textarea id="romanHindi"
placeholder="Type: mera naam abhishek hai"
style="width:100%;min-height:160px;padding:12px;font-size:18px;"></textarea>

<button onclick="convertHindi()">🔄 Convert to Hindi</button>
<button onclick="copyHindi()">📋 Copy</button>
<button onclick="downloadHindi()">⬇️ Download</button>
</div>

<div id="hindiOutput"
style="margin-top:15px;padding:15px;font-size:20px;background:#f5f5f5;border-radius:10px;">
</div>

<div id="result"></div>`;
  content.innerHTML = html;
  modal.hidden = false;
}

function closeTool() {
  modal.hidden = true;
}

function out(message) {
  document.getElementById("result").innerHTML =
    '<div class="result">' + message + '</div>';
}

function calcAge() {
  const dob = new Date(document.getElementById("dob").value);

  if (isNaN(dob)) {
    out("Please select your date of birth.");
    return;
  }

  const today = new Date();
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

  out(`<b>${years} years, ${months} months, ${days} days</b>`);
}

function calcEMI() {
  const P = Number(document.getElementById("loan").value);
  const annualRate = Number(document.getElementById("rate").value);
  const years = Number(document.getElementById("years").value);

  const r = annualRate / 1200;
  const n = years * 12;

  const emi = r
    ? P * r * Math.pow(1 + r, n) /
      (Math.pow(1 + r, n) - 1)
    : P / n;

  out(
    `<b>Monthly EMI: ₹${emi.toFixed(2)}</b><br>
     Total payment: ₹${(emi * n).toFixed(2)}<br>
     Total interest: ₹${(emi * n - P).toFixed(2)}`
  );
}

function calcPercent() {
  const p = Number(document.getElementById("p").value);
  const n = Number(document.getElementById("n").value);

  out(`<b>${(p / 100 * n).toFixed(2)}</b>`);
}

function calcGST() {
  const amount = Number(document.getElementById("amt").value);
  const rate = Number(document.getElementById("gst").value);

  const gst = amount * rate / 100;

  out(
    `<b>GST: ₹${gst.toFixed(2)}</b><br>
     Total: ₹${(amount + gst).toFixed(2)}`
  );
}

function calcDiscount() {
  const price = Number(document.getElementById("price").value);
  const discount = Number(document.getElementById("disc").value);

  const saving = price * discount / 100;
  const finalPrice = price - saving;

  out(
    `<b>Sale price: ₹${finalPrice.toFixed(2)}</b><br>
     You save: ₹${saving.toFixed(2)}`
  );
}

function calcBMI() {
  const weight = Number(document.getElementById("weight").value);
  const height = Number(document.getElementById("height").value) / 100;

  const bmi = weight / (height * height);

  let category;

  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Normal";
  else if (bmi < 30) category = "Overweight";
  else category = "Obesity";

  out(
    `<b>BMI: ${bmi.toFixed(1)}</b><br>
     Category: ${category}`
  );
}

function compressImage() {
  const file = document.getElementById("imageFile").files[0];

  if (!file) {
    out("Please select an image first.");
    return;
  }

  const quality =
    Number(document.getElementById("imageQuality").value) / 100;

  const img = new Image();

  img.onload = function () {
    const canvas = document.createElement("canvas");

    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    canvas.toBlob(function (blob) {
      const url = URL.createObjectURL(blob);

      out(`
        <b>Compression complete! ✅</b><br><br>
        Original: ${(file.size / 1024).toFixed(1)} KB<br>
        Compressed: ${(blob.size / 1024).toFixed(1)} KB<br><br>
        <a href="${url}" download="compressed-image.jpg">
          <button>⬇️ Download Image</button>
        </a>
      `);
    }, "image/jpeg", quality);
  };

  img.src = URL.createObjectURL(file);
}

async function createPDF() {
  const files = document.getElementById("pdfFiles").files;

  if (!files.length) {
    out("Please select at least one image.");
    return;
  }

  if (!window.jspdf) {
    out("PDF library is loading. Please try again.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  for (let i = 0; i < files.length; i++) {
    const data = await new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;

      reader.readAsDataURL(files[i]);
    });

    const img = await new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => resolve(image);
      image.onerror = reject;

      image.src = data;
    });

    const pageW = 210;
    const pageH = 297;
    const margin = 10;

    let w = img.width;
    let h = img.height;

    const scale = Math.min(
      (pageW - margin * 2) / w,
      (pageH - margin * 2) / h,
      1
    );

    w *= scale;
    h *= scale;

    const x = (pageW - w) / 2;
    const y = (pageH - h) / 2;

    if (i > 0) pdf.addPage();

    pdf.addImage(data, "JPEG", x, y, w, h);
  }

  pdf.save("IndianToolHub-JPG-to-PDF.pdf");

  out("PDF created successfully! ✅");
}
function convertHindi(){
  let text=document.getElementById("romanHindi").value.toLowerCase();

  const words={
    "mera":"मेरा",
    "meri":"मेरी",
    "mere":"मेरे",
    "naam":"नाम",
    "hai":"है",
    "hain":"हैं",
    "main":"मैं",
    "mai":"मैं",
    "aap":"आप",
    "tum":"तुम",
    "hum":"हम",
    "ka":"का",
    "ki":"की",
    "ke":"के",
    "ko":"को",
    "se":"से",
    "me":"में",
    "mein":"में",
    "par":"पर",
    "aur":"और",
    "ya":"या",
    "bhi":"भी",
    "ye":"ये",
    "yah":"यह",
    "woh":"वह",
    "kya":"क्या",
    "kyun":"क्यों",
    "kaise":"कैसे",
    "kab":"कब",
    "kahan":"कहाँ",
    "achha":"अच्छा",
    "accha":"अच्छा",
    "bahut":"बहुत",
    "dhanyavad":"धन्यवाद",
    "shukriya":"शुक्रिया",
    "pyaar":"प्यार",
    "dost":"दोस्त",
    "ghar":"घर",
    "paani":"पानी",
    "khana":"खाना",
    "naam":"नाम"
  };

  text=text.split(/\s+/).map(word=>{
    return words[word] || word;
  }).join(" ");

  document.getElementById("hindiOutput").textContent=text;
}

function copyHindi(){
  const text=document.getElementById("hindiOutput").textContent;

  if(!text){
    return out("पहले Hindi text बनाएं।");
  }

  navigator.clipboard.writeText(text);
  out("Hindi text copied! ✅");
}

function downloadHindi(){
  const text=document.getElementById("hindiOutput").textContent;

  if(!text){
    return out("पहले Hindi text बनाएं।");
  }

  const blob=new Blob([text],{
    type:"text/plain;charset=utf-8"
  });

  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");

  a.href=url;
  a.download="hindi-text.txt";
  a.click();

  URL.revokeObjectURL(url);
}
