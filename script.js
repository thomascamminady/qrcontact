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

function updateQR() {
    // 1. Get Contact values
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

    // 4. Construct vCard String (VCF 3.0)
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

// Download Button Logic
document.getElementById("downloadBtn").addEventListener("click", () => {
    const element = document.getElementById("printArea");
    const fn = document.getElementById("firstName").value || "contact";

    html2canvas(element, {
        backgroundColor: null,
        scale: 2,
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
