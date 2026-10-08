const modal=document.getElementById("modal");
const content=document.getElementById("toolContent");

function openTool(type){
  let html="";

  if(type==="age") html=`<h2>🎂 Age Calculator</h2><p>Enter your date of birth.</p><div class="form"><label>Date of birth<input id="dob" type="date"></label><button onclick="calcAge()">Calculate age</button></div><div id="result"></div>`;

  if(type==="emi") html=`<h2>💰 EMI Calculator</h2><div class="form"><label>Loan amount (₹)<input id="loan" type="number" value="500000"></label><label>Annual interest rate (%)<input id="rate" type="number" value="8.5"></label><label>Tenure (years)<input id="years" type="number" value="5"></label><button onclick="calcEMI()">Calculate EMI</button></div><div id="result"></div>`;

  if(type==="percent") html=`<h2>％ Percentage Calculator</h2><div class="form"><label>What is <input id="p" type="number" value="20"> % of <input id="n" type="number" value="500"></label><button onclick="calcPercent()">Calculate</button></div><div id="result"></div>`;

  if(type==="gst") html=`<h2>🧾 GST Calculator</h2><div class="form"><label>Amount (₹)<input id="amt" type="number" value="1000"></label><label>GST rate (%)<input id="gst" type="number" value="18"></label><button onclick="calcGST()">Calculate</button></div><div id="result"></div>`;

  if(type==="discount") html=`<h2>🏷️ Discount Calculator</h2><div class="form"><label>Original price (₹)<input id="price" type="number" value="1000"></label><label>Discount (%)<input id="disc" type="number" value="20"></label><button onclick="calcDiscount()">Calculate</button></div><div id="result"></div>`;

  if(type==="bmi") html=`<h2>⚖️ BMI Calculator</h2><div class="form"><label>Weight (kg)<input id="weight" type="number" value="70"></label><label>Height (cm)<input id="height" type="number" value="170"></label><button onclick="calcBMI()">Calculate BMI</button></div><div id="result"></div>`;

  if(type==="image") html=`<h2>🖼️ Image Compressor</h2><p>Select an image and choose compression quality.</p><div class="form"><label>Select image<input id="imageFile" type="file" accept="image/*"></label><label>Quality (%)<input id="imageQuality" type="range" min="10" max="100" value="70" oninput="document.getElementById('qualityValue').textContent=this.value+'%'"></label><p>Quality: <b id="qualityValue">70%</b></p><button onclick="compressImage()">Compress Image</button></div><div id="result"></div>`;

  if(type==="pdf") html=`<h2>📄 JPG to PDF</h2><p>Select one or more images and create a PDF.</p><div class="form"><label>Select images<input id="pdfFiles" type="file" accept="image/*" multiple></label><button onclick="createPDF()">Create PDF</button></div><div id="result"></div>`;

  content.innerHTML=html;
  modal.hidden=false;
}

function closeTool(){
  modal.hidden=true;
}

function out(x){
  document.getElementById("result").innerHTML='<div class="result">'+x+'</div>';
}

function calcAge(){
  const d=new Date(document.getElementById("dob").value);
  if(isNaN(d)) return out("Please select your date of birth.");
  const t=new Date();
  let y=t.getFullYear()-d.getFullYear();
  let m=t.getMonth()-d.getMonth();
  let day=t.getDate()-d.getDate();

  if(day<0){
    m--;
    day+=new Date(t.getFullYear(),t.getMonth(),0).getDate();
  }

  if(m<0){
    y--;
    m+=12;
  }

  out(`<b>${y} years, ${m} months, ${day} days</b>`);
}

function calcEMI(){
  const P=+document.getElementById("loan").value;
  const r=+document.getElementById("rate").value/1200;
  const n=+document.getElementById("years").value*12;
  const e=r?P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):P/n;

  out(`<b>Monthly EMI: ₹${e.toFixed(2)}</b><br>Total payment: ₹${(e*n).toFixed(2)}<br>Total interest: ₹${(e*n-P).toFixed(2)}`);
}

function calcPercent(){
  const p=+document.getElementById("p").value;
  const n=+document.getElementById("n").value;
  out(`<b>${(p/100*n).toFixed(2)}</b>`);
}

function calcGST(){
  const a=+document.getElementById("amt").value;
  const g=+document.getElementById("gst").value/100;
  const t=a*g;

  out(`<b>GST: ₹${t.toFixed(2)}</b><br>Total including GST: ₹${(a+t).toFixed(2)}`);
}

function calcDiscount(){
  const a=+document.getElementById("price").value;
  const d=+document.getElementById("disc").value/100;
  const s=a*d;

  out(`<b>Sale price: ₹${(a-s).toFixed(2)}</b><br>You save: ₹${s.toFixed(2)}`);
}

function calcBMI(){
  const w=+document.getElementById("weight").value;
  const h=+document.getElementById("height").value/100;
  const b=w/(h*h);

  let c=b<18.5?"Underweight":b<25?"Normal":b<30?"Overweight":"Obesity";

  out(`<b>BMI: ${b.toFixed(1)}</b><br>Category: ${c}`);
}

async function compressImage(){
  const file=document.getElementById("imageFile").files[0];

  if(!file) return out("Please select an image first.");

  const quality=+document.getElementById("imageQuality").value/100;
  const img=new Image();

  img.onload=function(){
    const canvas=document.createElement("canvas");
    canvas.width=img.width;
    canvas.height=img.height;

    const ctx=canvas.getContext("2d");
    ctx.drawImage(img,0,0);

    canvas.toBlob(function(blob){
      const url=URL.createObjectURL(blob);
      const original=(file.size/1024).toFixed(1);
      const compressed=(blob.size/1024).toFixed(1);

      out(`<b>Compression complete! ✅</b><br><br>Original: ${original} KB<br>Compressed: ${compressed} KB<br><br><a href="${url}" download="compressed-image.jpg"><button>⬇️ Download</button></a>`);
    },"image/jpeg",quality);
  };

  img.src=URL.createObjectURL(file);
}

async function createPDF(){
  const files=document.getElementById("pdfFiles").files;

  if(!files.length) return out("Please select at least one image.");

  if(!window.jspdf) return out("PDF library is still loading. Please try again.");

  const {jsPDF}=window.jspdf;
  const pdf=new jsPDF("p","mm","a4");

  for(let i=0;i<files.length;i++){
    const file=files[i];

    const data=await new Promise((resolve,reject)=>{
      const reader=new FileReader();
      reader.onload=()=>resolve(reader.result);
      reader.onerror=reject;
      reader.readAsDataURL(file);
    });

    const img=await new Promise((resolve,reject)=>{
      const image=new Image();
      image.onload=()=>resolve(image);
      image.onerror=reject;
      image.src=data;
    });

    const pageW=210;
    const pageH=297;
    const margin=10;

    let w=img.width;
    let h=img.height;

    const scale=Math.min((pageW-margin*2)/w,(pageH-margin*2)/h,1);

    w*=scale;
    h*=scale;

    const x=(pageW-w)/2;
    const y=(pageH-h)/2;

    if(i>0) pdf.addPage();

    pdf.addImage(data,"JPEG",x,y,w,h);
  }

  pdf.save("IndianToolHub-JPG-to-PDF.pdf");
  out("PDF created successfully! ✅");
}

document.getElementById("search").addEventListener("input",e=>{
  const q=e.target.value.toLowerCase();

  document.querySelectorAll(".tool-card").forEach(c=>{
    c.style.display=c.dataset.name.includes(q)?"block":"none";
  });
});

document.getElementById("lang").addEventListener("change",e=>{
  if(e.target.value==="hi"){
    heroTitle.textContent="उपयोगी ऑनलाइन टूल, बिल्कुल आसान";
    heroText.textContent="IndiaToolHub पर रोज़मर्रा के काम जल्दी और मुफ्त करें।";
  }else if(e.target.value==="gu"){
    heroTitle.textContent="ઉપયોગી ઓનલાઈન ટૂલ્સ, સરળ રીતે";
    heroText.textContent="IndiaToolHub પર રોજિંદા કામ ઝડપથી અને મફતમાં કરો.";
  }else{
    heroTitle.textContent="Useful online tools, made simple.";
    heroText.textContent="Calculate, convert and get everyday tasks done quickly — free on IndiaToolHub.";
  }
});
