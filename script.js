// Initialize QRCodeStyling instance
const qrCode = new QRCodeStyling({
    width: 280,
    height: 280,
    type: "svg",
    data: "",
    image: "",
    dotsOptions: { color: "#333333", type: "square" },
    backgroundOptions: { color: "#ffffff" },
    imageOptions: { crossOrigin: "anonymous", margin: 20 },
    cornersSquareOptions: { type: "square", color: "#333333" },
});

// Render initial QR code
document.addEventListener("DOMContentLoaded", () => {
    qrCode.append(document.getElementById("canvas"));
    updateQR();
    setupFrameButtons();
});

// DOM Elements
const inputs = document.querySelectorAll("input, select");
const previewName = document.getElementById("previewNameText");
const previewCTA = document.getElementById("previewCTA");
const ctaInput = document.getElementById("ctaText");
const nameToggle = document.getElementById("showNameToggle");

// Listen for input changes
inputs.forEach((input) => {
    input.addEventListener("input", updateQR);
});

// Frame switching logic
function setupFrameButtons() {
    const buttons = document.querySelectorAll(".frame-btn");
    const printArea = document.getElementById("printArea");

    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            buttons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            printArea.className = "capture-container";
            printArea.classList.add(`frame-${btn.dataset.frame}`);
        });
    });
}

function getVCardData() {
    const fn = document.getElementById("firstName").value.trim();
    const ln = document.getElementById("lastName").value.trim();
    const org = document.getElementById("organization").value.trim();
    const pos = document.getElementById("position").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const workPhone = document.getElementById("workPhone").value.trim();
    const email = document.getElementById("email").value.trim();
    const website = document.getElementById("website").value.trim();

    const street = document.getElementById("street").value.trim();
    const city = document.getElementById("city").value.trim();
    const zip = document.getElementById("zip").value.trim();
    const country = document.getElementById("country").value.trim();

    let vCard = `BEGIN:VCARD\nVERSION:3.0\n`;
    vCard += `N:${ln};${fn};;;\n`;
    vCard += `FN:${fn} ${ln}\n`;
    if (org) vCard += `ORG:${org}\n`;
    if (pos) vCard += `TITLE:${pos}\n`;
    if (phone) vCard += `TEL;TYPE=CELL:${phone}\n`;
    if (workPhone) vCard += `TEL;TYPE=WORK:${workPhone}\n`;
    if (email) vCard += `EMAIL:${email}\n`;
    if (website) vCard += `URL:${website}\n`;

    if (street || city || zip || country) {
        vCard += `ADR;TYPE=WORK:;;${street};${city};;${zip};${country}\n`;
    }

    vCard += `END:VCARD`;
    return vCard;
}

function updateQR() {
    // 1. Get Contact values for UI
    const fn = document.getElementById("firstName").value.trim();
    const ln = document.getElementById("lastName").value.trim();

    // 2. Get Styling values
    const colorMain = document.getElementById("colorMain").value;
    const colorBg = document.getElementById("colorBg").value;
    const dotStyle = document.getElementById("dotStyle").value;
    const cornerStyle = document.getElementById("cornerStyle").value;
    const ctaText = ctaInput.value.trim();

    // 3. Update Text UI
    const fullName = `${fn} ${ln}`.trim();
    previewName.textContent = fullName || "Your Name";
    previewCTA.textContent = ctaText;

    if (nameToggle.checked) {
        previewName.style.display = "block";
    } else {
        previewName.style.display = "none";
    }

    // 4. Get vCard String
    const vCard = getVCardData();

    // 5. Update QR Code Options
    qrCode.update({
        data: vCard,
        dotsOptions: { color: colorMain, type: dotStyle },
        backgroundOptions: { color: colorBg },
        cornersSquareOptions: { color: colorMain, type: cornerStyle },
        cornersDotOptions: {
            color: colorMain,
            type: cornerStyle === "square" ? "square" : "dot",
        },
    });
}

// Logo Upload Logic
document.getElementById("logoInput").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            qrCode.update({
                image: e.target.result,
            });
        };
        reader.readAsDataURL(file);
    } else {
        qrCode.update({
            image: "",
        });
    }
});

// Download VCF Button Logic
document.getElementById("downloadVcfBtn").addEventListener("click", () => {
    const vCard = getVCardData();
    const fn = document.getElementById("firstName").value.trim() || "contact";
    const blob = new Blob([vCard], { type: "text/vcard" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fn}.vcf`;
    link.click();
});

// Download Button Logic
document.getElementById("downloadBtn").addEventListener("click", () => {
    const element = document.getElementById("printArea");
    const fn = document.getElementById("firstName").value || "contact";
    const scale =
        parseInt(document.getElementById("resolutionScale").value) || 2;

    html2canvas(element, {
        backgroundColor: null,
        scale: scale,
    }).then((canvas) => {
        const link = document.createElement("a");
        link.download = `${fn}-vcard.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
});

// Print Button Logic
document.getElementById("printBtn").addEventListener("click", () => {
    window.print();
});

// Settings Toggle Logic
const settingsHeader = document.getElementById("settingsHeader");
const settingsContent = document.getElementById("settingsContent");

settingsHeader.addEventListener("click", () => {
    settingsContent.classList.toggle("collapsed");
    settingsHeader.classList.toggle("collapsed");
});
