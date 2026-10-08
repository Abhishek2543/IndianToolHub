const modal=document.getElementById("modal"), content=document.getElementById("toolContent");
function openTool(type){
let html="";
if(type==="age") html=`<h2>🎂 Age Calculator</h2><p>Enter your date of birth.</p><div class="form"><label>Date of birth<input id="dob" type="date"></label><button onclick="calcAge()">Calculate age</button></div><div id="result"></div>`;
if(type==="emi") html=`<h2>💰 EMI Calculator</h2><div class="form"><label>Loan amount (₹)<input id="loan" type="number" min="0" value="500000"></label><label>Annual interest rate (%)<input id="rate" type="number" min="0" step=".01" value="8.5"></label><label>Tenure (years)<input id="years" type="number" min="1" value="5"></label><button onclick="calcEMI()">Calculate EMI</button></div><div id="result"></div>`;
if(type==="percent") html=`<h2>％ Percentage Calculator</h2><div class="form"><label>What is <input id="p" type="number" value="20"> % of <input id="n" type="number" value="500"></label><button onclick="calcPercent()">Calculate</button></div><div id="result"></div>`;
if(type==="gst") html=`<h2>🧾 GST Calculator</h2><div class="form"><label>Amount (₹)<input id="amt" type="number" value="1000"></label><label>GST rate (%)<input id="gst" type="number" value="18"></label><button onclick="calcGST()">Calculate</button></div><div id="result"></div>`;
if(type==="discount") html=`<h2>🏷️ Discount Calculator</h2><div class="form"><label>Original price (₹)<input id="price" type="number" value="1000"></label><label>Discount (%)<input id="disc" type="number" value="20"></label><button onclick="calcDiscount()">Calculate</button></div><div id="result"></div>`;
if(type==="bmi") html=`<h2>⚖️ BMI Calculator</h2><div class="form"><label>Weight (kg)<input id="weight" type="number" value="70"></label><label>Height (cm)<input id="height" type="number" value="170"></label><button onclick="calcBMI()">Calculate BMI</button></div><div id="result"></div>`;
  if(type==="image") html=`<h2>🖼️ Image Compressor</h2>
<p>Select an image and choose compression quality.</p>
<div class="form">
<label>Select image
<input id="imageFile" type="file" accept="image/*">
</label>
<label>Quality (%)
<input id="imageQuality" type="range" min="10" max="100" value="70"
oninput="document.getElementById('qualityValue').textContent=this.value+'%'">
</label>
<p>Quality: <b id="qualityValue">70%</b></p>
<button onclick="compressImage()">Compress Image</button>
</div>
<div id="result"></div>`;
content.innerHTML=html; modal.hidden=false;
}
function closeTool(){modal.hidden=true}
function out(x){document.getElementById("result").innerHTML='<div class="result">'+x+'</div>'}
function calcAge(){const d=new Date(document.getElementById("dob").value);if(isNaN(d))return out("Please select your date of birth.");const t=new Date();let y=t.getFullYear()-d.getFullYear(),m=t.getMonth()-d.getMonth(),day=t.getDate()-d.getDate();if(day<0){m--;day+=new Date(t.getFullYear(),t.getMonth(),0).getDate()}if(m<0){y--;m+=12}out(`<b>${y} years, ${m} months, ${day} days</b>`)}
function calcEMI(){const P=+loan.value,r=+rate.value/1200,n=+years.value*12;const e=r?P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):P/n;out(`<b>Monthly EMI: ₹${e.toFixed(2)}</b><br>Total payment: ₹${(e*n).toFixed(2)}<br>Total interest: ₹${(e*n-P).toFixed(2)}`)}
function calcPercent(){out(`<b>${(+p.value/100*+n.value).toFixed(2)}</b>`)}
function calcGST(){const a=+amt.value,g=+gst.value/100,t=a*g;out(`<b>GST: ₹${t.toFixed(2)}</b><br>Total including GST: ₹${(a+t).toFixed(2)}`)}
function calcDiscount(){const a=+price.value,d=+disc.value/100,s=a*d;out(`<b>Sale price: ₹${(a-s).toFixed(2)}</b><br>You save: ₹${s.toFixed(2)}`)}
function calcBMI(){const w=+weight.value,h=+height.value/100,b=w/(h*h);let c=b<18.5?"Underweight":b<25?"Normal":b<30?"Overweight":"Obesity";out(`<b>BMI: ${b.toFixed(1)}</b><br>Category: ${c}`)}
document.getElementById("search").addEventListener("input",e=>{const q=e.target.value.toLowerCase();document.querySelectorAll(".tool-card").forEach(c=>c.style.display=c.dataset.name.includes(q)?"block":"none")});
document.getElementById("lang").addEventListener("change",e=>{if(e.target.value==="hi"){heroTitle.textContent="उपयोगी ऑनलाइन टूल, बिल्कुल आसान";heroText.textContent="IndiaToolHub पर रोज़मर्रा के काम जल्दी और मुफ्त करें।"}else if(e.target.value==="gu"){heroTitle.textContent="ઉપયોગી ઓનલાઈન ટૂલ્સ, સરળ રીતે";heroText.textContent="IndiaToolHub પર રોજિંદા કામ ઝડપથી અને મફતમાં કરો."}else{heroTitle.textContent="Useful online tools, made simple.";heroText.textContent="Calculate, convert and get everyday tasks done quickly — free on IndiaToolHub."}});
