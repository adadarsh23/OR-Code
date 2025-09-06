const genBtn = document.getElementById('genBtn');
const contentInput = document.getElementById('contentInput');
const qrBox = document.getElementById('qrBox');
const qrcodeDiv = document.getElementById('qrcode');
const qrPlaceholder = document.getElementById('qr-placeholder');
const downloadLink = document.getElementById('downloadLink');
const copyBtn = document.getElementById('copyBtn');
const shareBtn = document.getElementById('shareBtn');
const resultContent = document.getElementById('resultContent');
const clearBtn = document.getElementById('clearBtn');
const themeToggle = document.getElementById('theme-toggle');
const languageSelect = document.getElementById('language-select');
const contentTypeSelect = document.getElementById('contentType');
const qrSizeSelect = document.getElementById('qrSize');
const qrDarkColorInput = document.getElementById('qrDarkColor');
const qrLightColorInput = document.getElementById('qrLightColor');
const errorCorrectionSelect = document.getElementById('errorCorrection');
const contactFormContainer = document.getElementById("contactFormContainer");
const fileUploadContainer = document.getElementById("fileUploadContainer");
const fileInput = document.getElementById("fileInput");
let qrCodeInstance = null;
contentTypeSelect.addEventListener("change", () => {
  contactFormContainer.style.display = contentTypeSelect.value === "contact" ? "block" : "none";
  fileUploadContainer.style.display = contentTypeSelect.value === "file" ? "block" : "none";
});


const translations = {
  en: {
    title: 'QR Code Generator',
    lead: 'Generate custom QR codes for URLs, text, and phone numbers. Customize color, size, and more.',
    contentTypeLabel: 'Content Type:',
    sizeLabel: 'Size:',
    errorCorrectionLabel: 'Correction:',
    generateBtn: 'Generate',
    noQrPlaceholder: 'No QR yet',
    resultLabel: 'Result',
    downloadBtn: 'Download PNG',
    copyBtn: 'Copy Content',
    shareBtn: 'Share',
    note: 'This page generates QR codes locally using the qrcode.js library. No external requests are made to generate the image, ensuring your data stays private.',
    pastePlaceholder: {
      url: 'Paste URL here (e.g., https://example.com)',
      text: 'Enter text here',
      phone: 'Enter phone number (e.g., +1234567890)',
      sms: 'Enter SMS in format: number|message (e.g., +1234567890|Hello)',
      email: 'Enter email in format: address|subject|body (e.g., test@example.com|Hello|This is a test)',

    },
    alertEnter: 'Please enter content.',
    alertShare: 'Web Share API is not supported in this browser.',
    alertCopy: 'Content copied to clipboard!',
    alertContact: 'Please enter at least a name, phone, or email for the contact.'
  },
  es: {
    title: 'Generador de Código QR',
    lead: 'Genera códigos QR personalizados para URLs, texto y números de teléfono. Personaliza el color, tamaño y más.',
    contentTypeLabel: 'Tipo de Contenido:',
    sizeLabel: 'Tamaño:',
    errorCorrectionLabel: 'Corrección:',
    generateBtn: 'Generar',
    noQrPlaceholder: 'Aún no hay QR',
    resultLabel: 'Resultado',
    downloadBtn: 'Descargar PNG',
    copyBtn: 'Copiar Contenido',
    shareBtn: 'Compartir',
    note: 'Esta página genera códigos QR localmente utilizando la biblioteca qrcode.js. No se realizan solicitudes externas para generar la imagen, lo que garantiza la privacidad de tus datos.',
    pastePlaceholder: {
      url: 'Pega la URL aquí (ej., https://ejemplo.com)',
      text: 'Introduce texto aquí',
      phone: 'Introduce el número de teléfono (ej., +1234567890)',
      sms: 'Introduce SMS en formato: número|mensaje (ej., +1234567890|Hola)',
      email: 'Introduce el correo en formato: dirección|asunto|cuerpo (ej., test@ejemplo.com|Hola|Este es un test)'
    },
    alertEnter: 'Por favor, introduce el contenido.',
    alertShare: 'La API de Compartir Web no es compatible con este navegador.',
    alertCopy: 'Contenido copiado al portapapeles!',
    alertContact: 'Por favor, introduce al menos un nombre, teléfono o correo para el contacto.',
  },
  fr: {
    title: 'Générateur de Code QR',
    lead: 'Générez des codes QR personnalisés pour des URL, du texte et des numéros de téléphone. Personnalisez la couleur, la taille et plus encore.',
    contentTypeLabel: 'Type de contenu:',
    sizeLabel: 'Taille:',
    errorCorrectionLabel: 'Correction:',
    generateBtn: 'Générer',
    noQrPlaceholder: 'Pas encore de QR',
    resultLabel: 'Résultat',
    downloadBtn: 'Télécharger PNG',
    copyBtn: 'Copier le contenu',
    shareBtn: 'Partager',
    note: 'Cette page génère des codes QR localement à l\'aide de la bibliothèque qrcode.js. Aucune requête externe n\'est faite pour générer l\'image, garantissant la confidentialité de vos données.',
    pastePlaceholder: {
      url: 'Collez l\'URL ici (ex., https://exemple.com)',
      text: 'Entrez du texte ici',
      phone: 'Entrez le numéro de téléphone (ex., +1234567890)',
      sms: 'Entrez le SMS au format : numéro|message (ex., +1234567890|Bonjour)',
      email: 'Entrez l\'email au format : adresse|sujet|corps (ex., test@exemple.com|Bonjour|Ceci est un test)'
    },
    alertEnter: 'Veuillez entrer du contenu.',
    alertShare: 'L\'API Web Share n\'est pas prise en charge dans ce navigateur.',
    alertCopy: 'Contenu copié dans le presse-papiers !',
    alertContact: 'Veuillez entrer au moins un nom, un téléphone ou un e-mail pour le contact.'

  }
};

const currentLanguage = localStorage.getItem('lang') || 'en';
const currentTheme = localStorage.getItem('theme') || 'light';

document.addEventListener('DOMContentLoaded', () => {
  setTheme(currentTheme);
  setLanguage(currentLanguage);
  languageSelect.value = currentLanguage;
  updatePlaceholder();
});

genBtn.addEventListener('click', generateQrCode);
contentInput.addEventListener('input', () => {
  clearBtn.style.display = contentInput.value ? 'block' : 'none';
});
clearBtn.addEventListener('click', () => {
  contentInput.value = '';
  clearBtn.style.display = 'none';
  resetUI();
});
copyBtn.addEventListener('click', copyContent);
shareBtn.addEventListener('click', shareContent);
contentInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    generateQrCode();
  }
});
themeToggle.addEventListener('click', toggleTheme);
languageSelect.addEventListener('change', (e) => setLanguage(e.target.value));
contentTypeSelect.addEventListener('change', updatePlaceholder);
qrSizeSelect.addEventListener('change', generateQrCode);
qrDarkColorInput.addEventListener('input', generateQrCode);
qrLightColorInput.addEventListener('input', generateQrCode);
errorCorrectionSelect.addEventListener('change', generateQrCode);

function setLanguage(lang) {
  const elements = document.querySelectorAll('[data-lang]');
  elements.forEach(el => {
    const key = el.getAttribute('data-lang');
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  document.title = translations[lang].title;
  const content = translations[lang].pastePlaceholder[contentTypeSelect.value];
  contentInput.placeholder = content;
  // resultContent.textContent = translations[lang].pastePlaceholder[contentTypeSelect.value];
  localStorage.setItem('lang', lang);
}

function toggleTheme() {
  const newTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
  setTheme(newTheme);
  // Regenerate QR with new colors
  if (qrCodeInstance) {
    generateQrCode();
  }
}

function setTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    // Update color pickers for dark mode
    qrDarkColorInput.value = '#e0e0e0';
    qrLightColorInput.value = '#1e1e1e';
  } else {
    document.body.classList.remove('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    // Update color pickers for light mode
    qrDarkColorInput.value = '#000000';
    qrLightColorInput.value = '#ffffff';
  }
  localStorage.setItem('theme', theme);
}

// function updatePlaceholder() {
//   const lang = languageSelect.value;
//   const type = contentTypeSelect.value;
//   contentInput.placeholder = translations[lang].pastePlaceholder[type];
//   resultContent.textContent = translations[lang].pastePlaceholder[type];
// }

// function generateQrCode() {
//   let content = contentInput.value.trim();
//   const type = contentTypeSelect.value;

//   if (!content) {
//     alert(translations[languageSelect.value].alertEnter);
//     return;
//   }

//   // Dynamic content formatting based on type
//   if (type === 'url') {
//     if (!/^https?:\/\//i.test(content)) {
//       content = 'https://' + content;
//     }
//   } else if (type === 'phone') {
//     content = `tel:${content.replace(/\s/g, '')}`;
//   }

//   const size = qrSizeSelect.value;
//   const darkColor = qrDarkColorInput.value;
//   const lightColor = qrLightColorInput.value;
//   const correctionLevel = errorCorrectionSelect.value;

//   if (qrCodeInstance) {
//     qrCodeInstance.clear();
//     qrcodeDiv.innerHTML = "";
//   }

//   qrCodeInstance = new QRCode(qrcodeDiv, {
//     text: content,
//     width: parseInt(size),
//     height: parseInt(size),
//     colorDark: darkColor,
//     colorLight: lightColor,
//     correctLevel: QRCode.CorrectLevel[correctionLevel]
//   });

//   qrPlaceholder.style.display = 'none';
//   qrcodeDiv.style.display = 'block';
//   resultContent.textContent = content;
//   downloadLink.style.display = 'inline-flex';
//   copyBtn.style.display = 'inline-flex';
//   shareBtn.style.display = navigator.share ? 'inline-flex' : 'none';

//   // Wait for QR code to be generated, then set download link
//   setTimeout(() => {
//     const qrCanvas = qrcodeDiv.querySelector('canvas');
//     if (qrCanvas) {
//       downloadLink.href = qrCanvas.toDataURL("image/png");
//     }
//   }, 50);
// }

function updatePlaceholder() {
  const lang = languageSelect.value;
  const type = contentTypeSelect.value;

  if (type === 'contact') {
    document.getElementById('contactFormContainer').style.display = 'block';
    contentInput.style.display = 'none'; // hide normal input
  } else {
    document.getElementById('contactFormContainer').style.display = 'none';
    contentInput.style.display = 'block';
    contentInput.placeholder = translations[lang].pastePlaceholder[type];
    // resultContent.textContent = translations[lang].pastePlaceholder[type];
  }
}

function generateQrCode() {
  const type = contentTypeSelect.value;
  let content = contentInput.value.trim();

  // 1) File handling
  if (type === "file") {
    if (fileInput.files.length === 0) {
      alert("Please select an image or PDF file.");
      return;
    }
    const file = fileInput.files[0];
    content = URL.createObjectURL(file); // local URL
  }

  // 2) Contact handling
  else if (type === "contact") {
    const name = document.getElementById('contactName').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const org = document.getElementById('contactOrg').value.trim();
    const title = document.getElementById('contactTitle').value.trim();
    const address = document.getElementById('contactAddress').value.trim();
    const website = document.getElementById('contactWebsite').value.trim();
    const note = document.getElementById('contactNote').value.trim();

    if (!name && !phone && !email) {
      alert(translations[languageSelect.value].alertContact);
      return;
    }

    content =
      `BEGIN:VCARD\nVERSION:3.0\n` +
      (name ? `FN:${name}\n` : '') +
      (phone ? `TEL:${phone}\n` : '') +
      (email ? `EMAIL:${email}\n` : '') +
      (org ? `ORG:${org}\n` : '') +
      (title ? `TITLE:${title}\n` : '') +
      (address ? `ADR:${address}\n` : '') +
      (website ? `URL:${website}\n` : '') +
      (note ? `NOTE:${note}\n` : '') +
      `END:VCARD`;
  }

  // 3) Other types (url, phone, sms, email, text)
  else {
    if (!content) {
      alert(translations[languageSelect.value].alertEnter);
      return;
    }
    switch (type) {
      case 'url':
        if (!/^https?:\/\//i.test(content)) content = 'https://' + content;
        break;
      case 'phone':
        content = `tel:${content.replace(/\s/g, '')}`;
        break;
      case 'sms':
        const [number, message] = content.split('|', 2);
        content = message ? `SMSTO:${number}:${message}` : `SMSTO:${number}`;
        break;
      case 'email':
        const [addr, subject, body] = content.split('|');
        let mailto = `mailto:${addr}`;
        const params = [];
        if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
        if (body) params.push(`body=${encodeURIComponent(body)}`);
        if (params.length) mailto += '?' + params.join('&');
        content = mailto;
        break;
    }
  }

  // 4) Generate QR
  if (qrCodeInstance) {
    qrCodeInstance.clear();
    qrcodeDiv.innerHTML = "";
  }

  qrCodeInstance = new QRCode(qrcodeDiv, {
    text: content,
    width: parseInt(qrSizeSelect.value),
    height: parseInt(qrSizeSelect.value),
    colorDark: qrDarkColorInput.value,
    colorLight: qrLightColorInput.value,
    correctLevel: QRCode.CorrectLevel[errorCorrectionSelect.value]
  });

  // Update UI
  qrPlaceholder.style.display = 'none';
  qrcodeDiv.style.display = 'block';
  resultContent.textContent = content;
  downloadLink.style.display = 'inline-flex';
  copyBtn.style.display = 'inline-flex';
  shareBtn.style.display = navigator.share ? 'inline-flex' : 'none';

  // Add download link
  setTimeout(() => {
    const qrCanvas = qrcodeDiv.querySelector('canvas');
    if (qrCanvas) downloadLink.href = qrCanvas.toDataURL("image/png");
  }, 50);
}



function resetUI() {
  if (qrCodeInstance) {
    qrCodeInstance.clear();
    qrCodeInstance = null;
  }
  qrcodeDiv.innerHTML = "";
  qrPlaceholder.style.display = 'block';
  updatePlaceholder();
  downloadLink.style.display = 'none';
  copyBtn.style.display = 'none';
  shareBtn.style.display = 'none';
}

function copyContent() {
  const contentToCopy = resultContent.textContent;
  navigator.clipboard.writeText(contentToCopy).then(() => {
    alert(translations[languageSelect.value].alertCopy);
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
}

function shareContent() {
  if (navigator.share) {
    navigator.share({
      title: translations[languageSelect.value].title,
      text: resultContent.textContent,
    }).catch((error) => console.log('Error sharing', error));
  } else {
    alert(translations[languageSelect.value].alertShare);
  }
}