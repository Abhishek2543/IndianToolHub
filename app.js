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

  if(type==="gujarati") html=`
<h2>⌨️ English to Gujarati Typing</h2>

<p>English letters માં લખો અને Gujarati માં બદલો.</p>

<div class="form">

<textarea id="romanGujarati"
placeholder="Type: maru naam abhishek che"
style="width:100%;min-height:160px;padding:12px;font-size:18px;"></textarea>

<button onclick="convertGujarati()">🔄 Convert to Gujarati</button>
<button onclick="copyGujarati()">📋 Copy</button>
<button onclick="downloadGujarati()">⬇️ Download</button>

</div>

<div id="gujaratiOutput"
style="margin-top:15px;padding:15px;font-size:22px;background:#f5f5f5;border-radius:10px;">
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
// ===============================
// ADVANCED HINDI TYPING
// ===============================

const hindiWords = {
  mera:"मेरा", meri:"मेरी", mere:"मेरे",
  naam:"नाम", hai:"है", hain:"हैं",
  main:"मैं", mai:"मैं", mein:"में", me:"में",
  aap:"आप", ap:"आप", tum:"तुम", hum:"हम",
  ka:"का", ki:"की", ke:"के", ko:"को",
  se:"से", par:"पर", aur:"और", or:"और",
  ye:"ये", yah:"यह", woh:"वह", wo:"वो",
  kya:"क्या", kyun:"क्यों", kyu:"क्यों",
  kaise:"कैसे", kab:"कब", kahan:"कहाँ",
  achha:"अच्छा", accha:"अच्छा",
  bahut:"बहुत", bilkul:"बिल्कुल",
  dhanyavad:"धन्यवाद", shukriya:"शुक्रिया",
  pyaar:"प्यार", pyar:"प्यार",
  dost:"दोस्त", dosti:"दोस्ती",
  ghar:"घर", paani:"पानी", pani:"पानी",
  khana:"खाना", khaana:"खाना",
  mujhe:"मुझे", mujko:"मुझको",
  tumhe:"तुम्हें", aapko:"आपको",
  hume:"हमें", hame:"हमें",
  yeh:"यह", woh:"वह",
  nahi:"नहीं", nahin:"नहीं",
  haan:"हाँ", han:"हाँ",
  abhi:"अभी", aaj:"आज", kal:"कल",
  subah:"सुबह", shaam:"शाम",
  raat:"रात", din:"दिन",
  achhi:"अच्छी", achche:"अच्छे",
  bada:"बड़ा", badi:"बड़ी", bade:"बड़े",
  chhota:"छोटा", choti:"छोटी",
  bahar:"बाहर", andar:"अंदर",
  upar:"ऊपर", neeche:"नीचे",
  samay:"समय", waqt:"वक्त",
  zindagi:"ज़िंदगी", jindagi:"ज़िंदगी",
  duniya:"दुनिया", bharat:"भारत",
  india:"इंडिया", hindustan:"हिंदुस्तान",
  bhagwan:"भगवान", ram:"राम",
  krishna:"कृष्ण", shree:"श्री",
  mata:"माता", pita:"पिता",
  maa:"माँ", papa:"पापा",
  bhai:"भाई", behen:"बहन",
  beta:"बेटा", beti:"बेटी",
  ladka:"लड़का", ladki:"लड़की",
  school:"स्कूल", college:"कॉलेज",
  kitab:"किताब", kitaab:"किताब",
  mobile:"मोबाइल", phone:"फोन",
  computer:"कंप्यूटर", internet:"इंटरनेट",
  website:"वेबसाइट", paisa:"पैसा",
  paise:"पैसे", kaam:"काम",
  kar:"कर", karo:"करो", karna:"करना",
  karta:"करता", karti:"करती",
  karte:"करते", kiya:"किया",
  ja:"जा", jao:"जाओ", jaana:"जाना",
  aana:"आना", aao:"आओ",
  jana:"जाना", gaya:"गया", gayi:"गई",
  gaye:"गए", aaya:"आया", aayi:"आई",
  bol:"बोल", bolo:"बोलो", baat:"बात",
  sun:"सुन", suno:"सुनो",
  dekh:"देख", dekho:"देखो",
  likh:"लिख", likho:"लिखो",
  padh:"पढ़", padho:"पढ़ो",
  samajh:"समझ", samjho:"समझो",
  chahiye:"चाहिए", sakta:"सकता",
  sakti:"सकती", sakte:"सकते",
  hoga:"होगा", hogi:"होगी",
  honge:"होंगे", tha:"था",
  thi:"थी", the:"थे",
  ek:"एक", do:"दो", teen:"तीन",
  char:"चार", paanch:"पाँच",
  mera:"मेरा", apna:"अपना",
  apni:"अपनी", apne:"अपने",
  sab:"सब", sabhi:"सभी",
  kuch:"कुछ", koi:"कोई",
  kaun:"कौन", kiska:"किसका",
  kitna:"कितना", kitne:"कितने",
  kitni:"कितनी",
  kyunki:"क्योंकि", lekin:"लेकिन",
  agar:"अगर", to:"तो",
  jab:"जब", tab:"तब",
  bhi:"भी", hi:"ही",
  sirf:"सिर्फ", phir:"फिर",
  pehle:"पहले", baad:"बाद",
  saath:"साथ", bina:"बिना",
  liye:"लिए", liya:"लिया",
  dena:"देना", dena:"देना",
  lena:"लेना", lelo:"लेलो",
  achha:"अच्छा", thik:"ठीक",
  theek:"ठीक", sahi:"सही",
  galat:"गलत", zaroor:"ज़रूर",
  jarur:"ज़रूर", zaroori:"ज़रूरी"
};


// Roman → Hindi common patterns
const hindiPatterns = [
  ["ksh","क्ष"],
  ["gya","ग्या"],
  ["tra","त्र"],
  ["shra","श्रा"],
  ["shri","श्री"],
  ["dnya","ज्ञ"],
  ["gyan","ज्ञान"],
  ["pra","प्र"],
  ["bra","ब्र"],
  ["kra","क्र"],
  ["gra","ग्र"],
  ["dra","द्र"],
  ["kro","क्रो"],
  ["kri","क्रि"],
  ["sha","श"],
  ["shi","शि"],
  ["shu","शु"],
  ["she","शे"],
  ["sho","शो"]
];

function basicRomanToHindi(word){

  if(hindiWords[word]){
    return hindiWords[word];
  }

  let w = word;

  // common combinations
  hindiPatterns.forEach(function(pair){
    w = w.split(pair[0]).join(pair[1]);
  });

  const map = {
    "aa":"आ",
    "ee":"ई",
    "oo":"ऊ",
    "ai":"ऐ",
    "au":"औ",
    "kh":"ख",
    "gh":"घ",
    "ch":"च",
    "jh":"झ",
    "th":"थ",
    "dh":"ध",
    "ph":"फ",
    "bh":"भ",
    "sh":"श",
    "ng":"ङ",
    "ny":"ञ",
    "tt":"ट",
    "dd":"ड",
    "nn":"न",
    "rr":"र",
    "ll":"ल",

    "a":"अ",
    "b":"ब",
    "c":"क",
    "d":"द",
    "e":"ए",
    "f":"फ",
    "g":"ग",
    "h":"ह",
    "i":"इ",
    "j":"ज",
    "k":"क",
    "l":"ल",
    "m":"म",
    "n":"न",
    "o":"ओ",
    "p":"प",
    "q":"क",
    "r":"र",
    "s":"स",
    "t":"त",
    "u":"उ",
    "v":"व",
    "w":"व",
    "x":"क्स",
    "y":"य",
    "z":"ज़"
  };

  // fallback: keep unknown English words
  if(!hindiWords[word]){
    return word;
  }

  return w;
}


function convertHindi(){

  const input =
    document.getElementById("romanHindi").value.trim();

  if(!input){
    document.getElementById("hindiOutput").textContent = "";
    return out("पहले English में कुछ लिखें।");
  }

  const result = input
    .split(/\s+/)
    .map(function(word){

      const clean = word
        .toLowerCase()
        .replace(/[.,!?;:]+$/g,"");

      const converted = basicRomanToHindi(clean);

      const punctuation =
        word.slice(clean.length);

      return converted + punctuation;

    })
    .join(" ");

  document.getElementById("hindiOutput").textContent = result;
}


function copyHindi(){

  const text =
    document.getElementById("hindiOutput").textContent.trim();

  if(!text){
    return out("पहले Hindi text बनाएं।");
  }

  navigator.clipboard.writeText(text)
    .then(function(){
      out("Hindi text copied! ✅");
    })
    .catch(function(){
      out("Copy नहीं हो पाया। Text को manually select करके copy करें।");
    });
}


function downloadHindi(){

  const text =
    document.getElementById("hindiOutput").textContent.trim();

  if(!text){
    return out("पहले Hindi text बनाएं।");
  }

  const blob = new Blob(
    [text],
    {type:"text/plain;charset=utf-8"}
  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;
  a.download = "IndianToolHub-Hindi-Text.txt";

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);

  out("Hindi text download हो गया। ✅");
}
// ===============================
// GUJARATI TYPING
// ===============================

const gujaratiWords = {
  maru:"મારું",
  maaru:"મારું",
  naam:"નામ",
  che:"છે",
  chhe:"છે",
  hu:"હું",
  hun:"હું",
  mane:"મને",
  tamne:"તમને",
  tame:"તમે",
  aap:"આપ",
  tu:"તું",
  tamaru:"તમારું",
  tamari:"તમારી",
  tamara:"તમારા",
  maro:"મારો",
  mari:"મારી",
  mara:"મારા",
  ghar:"ઘર",
  paani:"પાણી",
  pani:"પાણી",
  khavu:"ખાવું",
  khana:"ખાવાનું",
  javanu:"જવાનું",
  aavvu:"આવવું",
  aavjo:"આવજો",
  jao:"જાઓ",
  aavo:"આવો",
  kem:"કેમ",
  shu:"શું",
  su:"શું",
  kya:"ક્યાં",
  kyare:"ક્યારે",
  kemke:"કેમકે",
  saru:"સારું",
  saaru:"સારું",
  saras:"સરસ",
  bahu:"બહુ",
  badhu:"બધું",
  nathi:"નથી",
  nahi:"નહીં",
  ha:"હા",
  haa:"હા",
  na:"ના",
  ane:"અને",
  pan:"પણ",
  ek:"એક",
  be:"બે",
  tran:"ત્રણ",
  char:"ચાર",
  paanch:"પાંચ",
  paisa:"પૈસા",
  paisa:"પૈસા",
  kaam:"કામ",
  dost:"દોસ્ત",
  mitra:"મિત્ર",
  prem:"પ્રેમ",
  bhai:"ભાઈ",
  behen:"બહેન",
  maa:"મા",
  mammi:"મમ્મી",
  papa:"પપ્પા",
  dikro:"દીકરો",
  dikri:"દીકરી",
  chokro:"છોકરો",
  chokri:"છોકરી",
  bharat:"ભારત",
  gujarat:"ગુજરાત",
  gujarati:"ગુજરાતી",
  india:"ઇન્ડિયા",
  bhagwan:"ભગવાન",
  ram:"રામ",
  krishna:"કૃષ્ણ",
  shree:"શ્રી",
  aaje:"આજે",
  aaj:"આજે",
  kale:"કાલે",
  kaal:"કાલ",
  savar:"સવાર",
  bapor:"બપોર",
  sanj:"સાંજ",
  raat:"રાત",
  divas:"દિવસ",
  mobile:"મોબાઇલ",
  phone:"ફોન",
  computer:"કમ્પ્યુટર",
  internet:"ઇન્ટરનેટ",
  website:"વેબસાઇટ"
};

function convertGujaratiWord(word) {

  const lower = word.toLowerCase();

  if (gujaratiWords[lower]) {
    return gujaratiWords[lower];
  }

  return romanGujaratiToGujarati(lower);
}

function romanGujaratiToGujarati(word) {

  const patterns = [
    ["chh","છ"],
    ["kh","ખ"],
    ["gh","ઘ"],
    ["ch","ચ"],
    ["jh","ઝ"],
    ["th","થ"],
    ["dh","ધ"],
    ["ph","ફ"],
    ["bh","ભ"],
    ["sh","શ"],
    ["tr","ત્ર"],
    ["gn","જ્ઞ"],
    ["kr","ક્ર"],
    ["pr","પ્ર"],
    ["br","બ્ર"],
    ["gr","ગ્ર"],
    ["dr","દ્ર"]
  ];

  let w = word;

  patterns.forEach(function(pair) {
    w = w.split(pair[0]).join(pair[1]);
  });

  const map = {
    "a":"અ",
    "aa":"આ",
    "i":"ઇ",
    "ee":"ઈ",
    "u":"ઉ",
    "oo":"ઊ",
    "e":"એ",
    "ai":"ઐ",
    "o":"ઓ",
    "au":"ઔ",

    "b":"બ",
    "c":"ક",
    "d":"દ",
    "f":"ફ",
    "g":"ગ",
    "h":"હ",
    "j":"જ",
    "k":"ક",
    "l":"લ",
    "m":"મ",
    "n":"ન",
    "p":"પ",
    "q":"ક",
    "r":"ર",
    "s":"સ",
    "t":"ત",
// ===============================
// GUJARATI TYPING
// ===============================

const gujaratiWords = {
  maru: "મારું",
  maaru: "મારું",
  naam: "નામ",
  che: "છે",
  chhe: "છે",
  hu: "હું",
  hun: "હું",
  mane: "મને",
  tame: "તમે",
  tamne: "તમને",
  tamaru: "તમારું",
  tamari: "તમારી",
  tamara: "તમારા",
  maro: "મારો",
  mari: "મારી",
  mara: "મારા",
  ghar: "ઘર",
  pani: "પાણી",
  paani: "પાણી",
  kem: "કેમ",
  shu: "શું",
  su: "શું",
  kya: "ક્યાં",
  kyare: "ક્યારે",
  saru: "સારું",
  saaru: "સારું",
  saras: "સરસ",
  bahu: "બહુ",
  badhu: "બધું",
  nathi: "નથી",
  nahi: "નહીં",
  ha: "હા",
  haa: "હા",
  na: "ના",
  ane: "અને",
  pan: "પણ",
  ek: "એક",
  be: "બે",
  tran: "ત્રણ",
  char: "ચાર",
  paanch: "પાંચ",
  kaam: "કામ",
  dost: "દોસ્ત",
  mitra: "મિત્ર",
  prem: "પ્રેમ",
  bhai: "ભાઈ",
  behen: "બહેન",
  maa: "મા",
  mammi: "મમ્મી",
  papa: "પપ્પા",
  dikro: "દીકરો",
  dikri: "દીકરી",
  chokro: "છોકરો",
  chokri: "છોકરી",
  bharat: "ભારત",
  gujarat: "ગુજરાત",
  gujarati: "ગુજરાતી",
  india: "ઇન્ડિયા",
  bhagwan: "ભગવાન",
  ram: "રામ",
  krishna: "કૃષ્ણ",
  shree: "શ્રી",
  aaje: "આજે",
  aaj: "આજે",
  kale: "કાલે",
  kaal: "કાલ",
  savar: "સવાર",
  bapor: "બપોર",
  sanj: "સાંજ",
  raat: "રાત",
  divas: "દિવસ",
  mobile: "મોબાઇલ",
  phone: "ફોન",
  computer: "કમ્પ્યુટર",
  internet: "ઇન્ટરનેટ",
  website: "વેબસાઇટ"
};

function convertGujarati() {

  const input = document
    .getElementById("romanGujarati")
    .value
    .trim();

  if (!input) {
    document.getElementById("gujaratiOutput").textContent = "";
    return out("પહેલા English માં કંઈક લખો.");
  }

  const result = input
    .split(/\s+/)
    .map(function(word) {

      const punctuation = word.match(/[.,!?;:]+$/);

      const clean = word
        .toLowerCase()
        .replace(/[.,!?;:]+$/, "");

      const converted =
        gujaratiWords[clean] || clean;

      return converted +
        (punctuation ? punctuation[0] : "");

    })
    .join(" ");

  document.getElementById("gujaratiOutput").textContent = result;
}

function copyGujarati() {

  const output =
    document.getElementById("gujaratiOutput");

  const text = output.textContent.trim();

  if (!text) {
    return out("પહેલા Gujarati text બનાવો.");
  }

  navigator.clipboard.writeText(text)
    .then(function() {
      out("Gujarati text copied! ✅");
    })
    .catch(function() {
      out("Copy થઈ શક્યું નથી.");
    });
}

function downloadGujarati() {

  const text =
    document.getElementById("gujaratiOutput")
      .textContent
      .trim();

  if (!text) {
    return out("પહેલા Gujarati text બનાવો.");
  }

  const blob = new Blob(
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
  a.download =
    "IndiaToolHub-Gujarati-Text.txt";

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);

  URL.revokeObjectURL(url);

  out("Gujarati text download થઈ ગયું. ✅");
}
