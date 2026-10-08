function copyHindi() {

  const text =
    document.getElementById("hindiOutput")
      .textContent
      .trim();

  if (!text) {
    out("पहले Hindi text बनाएं।");
    return;
  }

  if (navigator.clipboard) {

    navigator.clipboard.writeText(text)
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


function fallbackCopy(text) {

  const textarea =
    document.createElement("textarea");

  textarea.value = text;

  document.body.appendChild(textarea);

  textarea.select();

  try {
    document.execCommand("copy");
    out("Hindi text copied! ✅");
  } catch (error) {
    out("Copy नहीं हो पाया।");
  }

  document.body.removeChild(textarea);
}


// =====================================================
// DOWNLOAD HINDI
// =====================================================

function downloadHindi() {

  const text =
    document.getElementById("hindiOutput")
      .textContent
      .trim();

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
  tamaru: "તમારું",

  tamaro: "તમારો",
  tamari: "તમારી",

  aap: "આપ",

  su: "શું",
  shu: "શું",

  kem: "કેમ",

  kya: "ક્યાં",
  kya: "ક્યાં",

  kyare: "ક્યારે",

  kemcho: "કેમ છો",
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

  karo: "કરો",

  joie: "જોઈએ",

  joiye: "જોઈએ",

  mane: "મને",

  tamne: "તમને",

  amne: "અમને",

  mane: "મને",

  maro: "મારો",

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

  const input =
    document.getElementById("romanGujarati")
      .value
      .trim();

  if (!input) {

    document.getElementById(
      "gujaratiOutput"
    ).textContent = "";

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

        return converted +
          (
            punctuation
              ? punctuation[0]
              : ""
          );

      })
      .join(" ");

  document.getElementById(
    "gujaratiOutput"
  ).textContent = result;
}


// =====================================================
// COPY GUJARATI
// =====================================================

function copyGujarati() {

  const text =
    document.getElementById(
      "gujaratiOutput"
    ).textContent.trim();

  if (!text) {
    out("પહેલા Gujarati text બનાવો.");
    return;
  }

  if (navigator.clipboard) {

    navigator.clipboard.writeText(text)
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

  const text =
    document.getElementById(
      "gujaratiOutput"
    ).textContent.trim();

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

  URL.revokeObjectURL(url);
}


// =====================================================
// ESC KEY
// =====================================================

document.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Escape") {
      closeTool();
    }

  }
