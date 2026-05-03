let coursesByDegree = {
    BE: [
        "Computer Science and Engineering",
        "Electronics and Communication Engineering",
        "Electrical and Electronics Engineering",
        "Mechanical Engineering",
        "Civil Engineering",
        "Artificial Intelligence and Data Science",
        "Biomedical Engineering"
    ],
    BTech: [
        "Information Technology",
        "Artificial Intelligence and Data Science",
        "Artificial Intelligence and Machine Learning",
        "Biotechnology",
        "Chemical Engineering",
        "Food Technology"
    ],
    ME: [
        "Computer Science and Engineering",
        "Communication Systems",
        "Power Electronics and Drives",
        "Structural Engineering",
        "Manufacturing Engineering"
    ],
    MTech: [
        "Information Technology",
        "Data Science",
        "Biotechnology",
        "Environmental Science and Technology"
    ],
    MBA: [
        "General Management",
        "Finance",
        "Human Resource Management",
        "Marketing",
        "Operations Management"
    ],
    MCA: [
        "Computer Applications"
    ],
    BArch: [
        "Architecture"
    ],
    BSc: [
        "Computer Science",
        "Mathematics",
        "Physics"
    ],
    BCom: [
        "General",
        "Accounting"
    ]
};

function updateCourses() {
    let degree = document.getElementById("degree").value;
    let course = document.getElementById("course");

    course.innerHTML = "<option value=''>Select Course</option>";
    document.getElementById("roll_no").value = "";

    if (degree !== "") {
        coursesByDegree[degree].forEach(function(courseName) {
            course.innerHTML += "<option>" + courseName + "</option>";
        });
    }
}

function updateTemplatePreview() {
    let template = document.getElementById("template").value;
    let idCard = document.getElementById("id_card");

    idCard.classList.remove("template-ace", "template-classic", "template-modern", "template-dark", "template-neon", "template-royal", "template-minimal", "template-sunset");
    idCard.classList.add("template-" + template);
}

function generateRollNumber() {
    let admissionYear = document.getElementById("admission_year").value;
    let degree = document.getElementById("degree").value;
    let course = document.getElementById("course").value;
    let serialNo = document.getElementById("serial_no").value;
    let rollNo = document.getElementById("roll_no");

    if (admissionYear === "" || degree === "" || course === "" || serialNo === "") {
        alert("Please select admission year, degree, course, and serial number.");
        return;
    }

    if (serialNo < 1 || serialNo > 100) {
        alert("Serial number must be between 1 and 100.");
        return;
    }

    let degreeCodes = {
        BE: "BE",
        BTech: "BT",
        ME: "ME",
        MTech: "MT",
        MBA: "MB",
        MCA: "MC",
        BArch: "BA",
        BSc: "BS",
        BCom: "BS"
    };

    let courseCodes = {
        "Computer Science and Engineering": "CS",
        "Electronics and Communication Engineering": "EC",
        "Electrical and Electronics Engineering": "EE",
        "Mechanical Engineering": "ME",
        "Civil Engineering": "CE",
        "Artificial Intelligence and Data Science": "AD",
        "Biomedical Engineering": "BM",
        "Information Technology": "IT",
        "Artificial Intelligence and Machine Learning": "AM",
        Biotechnology: "BT",
        "Chemical Engineering": "CH",
        "Food Technology": "FT",
        "Communication Systems": "CM",
        "Power Electronics and Drives": "PE",
        "Structural Engineering": "SE",
        "Manufacturing Engineering": "MF",
        "Data Science": "DS",
        "Environmental Science and Technology": "ES",
        "General Management": "GM",
        Finance: "FN",
        "Human Resource Management": "HR",
        Marketing: "MK",
        "Operations Management": "OM",
        "Computer Applications": "CA",
        Architecture: "AR",
        "Computer Science": "CS",
        Mathematics: "MA",
        Physics: "PH",
        General: "GN",
        Accounting: "AC"
    };

    let yearCode = admissionYear.slice(-2);
    let serialNumber = serialNo.toString().padStart(3, "0");

    rollNo.value = degreeCodes[degree] + yearCode + courseCodes[course] + serialNumber;
}

function generateIdCard(event) {
    event.preventDefault();

    let rollNo = document.getElementById("roll_no").value;

    if (rollNo === "") {
        generateRollNumber();
        rollNo = document.getElementById("roll_no").value;
    }

    if (rollNo === "") {
        return;
    }

    let degreeSelect = document.getElementById("degree");
    let photoInput = document.getElementById("photo");
    let cardData = {
        collegeName: document.getElementById("college_name").value,
        template: document.getElementById("template").value,
        name: document.getElementById("name").value,
        dob: document.getElementById("dob").value,
        bloodGroup: document.getElementById("blood_group").value || "-",
        admissionYear: document.getElementById("admission_year").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("ph_no").value || "-",
        address: document.getElementById("address").value || "-",
        degree: degreeSelect.options[degreeSelect.selectedIndex].text,
        course: document.getElementById("course").value,
        batch: document.getElementById("batch").value || "-",
        validTill: document.getElementById("valid_till").value || "-",
        rollNo: rollNo,
        photo: ""
    };

    if (photoInput.files.length > 0) {
        let reader = new FileReader();

        reader.onload = function() {
            cardData.photo = reader.result;
            saveAndOpenCard(cardData);
        };

        reader.readAsDataURL(photoInput.files[0]);
        return;
    }

    saveAndOpenCard(cardData);
}

function saveAndOpenCard(cardData) {
    localStorage.setItem("studentIdCard", JSON.stringify(cardData));
    window.location.href = "card.html";
}

function renderCardPage() {
    let savedData = localStorage.getItem("studentIdCard");

    if (savedData === null) {
        return;
    }

    let cardData = JSON.parse(savedData);
    let cardSheet = document.getElementById("card_sheet");

    setText("front_college", cardData.collegeName);
    setText("front_college_info", "Kumbakonam - Student Identity Card");
    setText("front_valid", cardData.validTill);
    setText("front_name", cardData.name);
    setText("front_roll", cardData.rollNo);
    setText("front_branch", cardData.course);
    setText("front_batch", cardData.batch);
    setText("back_dob", cardData.dob);
    setText("back_blood", cardData.bloodGroup);
    setText("back_address", cardData.address);
    setText("back_phone", cardData.phone);
    setText("back_roll", cardData.rollNo);

    if (cardSheet) {
        cardSheet.classList.add("card-theme-" + (cardData.template || "ace"));
    }

    let frontPhoto = document.getElementById("front_photo");
    let frontPlaceholder = document.getElementById("front_photo_placeholder");

    if (frontPhoto && frontPlaceholder && cardData.photo !== "") {
        frontPhoto.src = cardData.photo;
        frontPhoto.style.display = "block";
        frontPlaceholder.style.display = "none";
    }
}

function setText(id, value) {
    let element = document.getElementById(id);

    if (element) {
        element.textContent = value || "-";
    }
}

async function downloadPdf() {
    let cardData = getPdfCardData();

    if (!cardData) {
        alert("Please create an ID card before downloading the PDF.");
        return;
    }

    let frontCanvas = await drawCardSide(cardData, "front");
    let backCanvas = await drawCardSide(cardData, "back");
    let pdfBlob = createCardPdf(frontCanvas, backCanvas);
    let fileName = ((cardData.rollNo || "id-card") + "-id-card.pdf").replace(/[^\w.-]+/g, "-");
    let link = document.createElement("a");

    link.href = URL.createObjectURL(pdfBlob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function() {
        URL.revokeObjectURL(link.href);
    }, 1000);
}

function getPdfCardData() {
    let idCard = document.getElementById("id_card");

    if (idCard && idCard.classList.contains("show")) {
        return {
            collegeName: getElementText("card_college"),
            template: (document.getElementById("template") || {}).value || "ace",
            name: getElementText("card_name"),
            dob: getElementText("card_dob"),
            bloodGroup: getElementText("card_blood_group"),
            admissionYear: getElementText("card_year"),
            email: getElementText("card_email"),
            phone: getElementText("card_phone"),
            address: getElementText("card_address"),
            degree: getElementText("card_degree"),
            course: getElementText("card_course"),
            batch: getElementText("card_batch"),
            validTill: getElementText("card_valid_till"),
            rollNo: getElementText("card_roll"),
            photo: (document.getElementById("card_photo") || {}).src || ""
        };
    }

    let savedData = localStorage.getItem("studentIdCard");

    return savedData !== null ? JSON.parse(savedData) : null;
}

function getElementText(id) {
    let element = document.getElementById(id);

    return element ? element.textContent : "-";
}

async function drawCardSide(cardData, side) {
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");

    canvas.width = 1012;
    canvas.height = 638;

    if (side === "front") {
        await drawPdfFront(context, cardData);
    }
    else {
        drawPdfBack(context, cardData);
    }

    drawPdfCardBorder(context);

    return canvas;
}

async function drawPdfFront(context, cardData) {
    let theme = getCardTheme(cardData.template);

    drawGradient(context, 0, 0, 1012, 638, theme.frontStart, theme.frontEnd);
    drawGradient(context, 0, 0, 1012, 190, theme.headerStart, theme.headerEnd);
    drawLogo(context, theme.logoBg, theme.logoText);

    context.fillStyle = theme.text;
    drawWrappedText(context, cardData.collegeName || "College Name", 184, 58, 740, 38, "900 38px Arial");

    context.fillStyle = theme.muted;
    drawWrappedText(context, "Kumbakonam - Student Identity Card", 184, 110, 720, 22, "700 22px Arial");

    context.fillStyle = theme.badgeBg;
    roundRect(context, 184, 144, 190, 40, 4);
    context.fill();
    context.fillStyle = theme.badgeText;
    context.font = "900 20px Arial";
    context.fillText("IDENTITY CARD", 204, 171);

    await drawPdfPhoto(context, cardData.photo);

    context.fillStyle = theme.text;
    context.font = "900 24px Arial";
    context.fillText("Valid Till : " + (cardData.validTill || "-"), 58, 492);

    let details = [
        ["Name", cardData.name || "-"],
        ["Roll No", cardData.rollNo || "-"],
        ["Branch", cardData.course || "-"],
        ["Batch", cardData.batch || "-"]
    ];

    drawDetails(context, details, 332, 250, 148, 48, theme);

    context.fillStyle = theme.muted;
    context.font = "900 22px Arial";
    context.fillText("PRINCIPAL", 800, 580);
}

function drawPdfBack(context, cardData) {
    let theme = getCardTheme(cardData.template);

    context.fillStyle = theme.backBg;
    context.fillRect(0, 0, 1012, 638);

    let details = [
        ["DOB", cardData.dob || "-"],
        ["B.G", cardData.bloodGroup || "-"],
        ["ADDRESS", cardData.address || "-"],
        ["PHONE", cardData.phone || "-"]
    ];

    drawDetails(context, details, 86, 96, 170, 56, {
        text: theme.backText,
        muted: theme.backText
    });
    drawBarcode(context, cardData.rollNo || "-", "#111827");
}

function getCardTheme(template) {
    let themes = {
        classic: ["#0f766e", "#14b8a6", "#064e3b", "#0f766e", "#ccfbf1", "#064e3b", "#0f766e"],
        modern: ["#2563eb", "#38bdf8", "#1d4ed8", "#0ea5e9", "#ffffff", "#2563eb", "#2563eb"],
        dark: ["#111827", "#020617", "#020617", "#1f2937", "#facc15", "#111827", "#facc15"],
        neon: ["#020617", "#7c3aed", "#06b6d4", "#7c3aed", "#22d3ee", "#020617", "#22d3ee"],
        royal: ["#581c87", "#7c3aed", "#3b0764", "#7c3aed", "#ede9fe", "#581c87", "#7c3aed"],
        minimal: ["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#111827", "#111827"],
        sunset: ["#f97316", "#f43f5e", "#9a3412", "#e11d48", "#ffedd5", "#9a3412", "#ea580c"],
        ace: ["#09a7f5", "#0472c7", "#2b155e", "#0472c7", "#facc15", "#1e3a8a", "#1e3a8a"]
    };
    let selected = themes[template] || themes.ace;
    let isLight = template === "minimal";

    return {
        frontStart: selected[0],
        frontEnd: selected[1],
        headerStart: selected[2],
        headerEnd: selected[3],
        logoBg: selected[4],
        logoText: selected[5],
        accent: selected[6],
        text: isLight ? "#111827" : "#ffffff",
        muted: isLight ? "#475569" : "#dbeafe",
        badgeBg: isLight ? "#111827" : "#e0f2fe",
        badgeText: isLight ? "#ffffff" : "#1e3a8a",
        backBg: template === "dark" || template === "neon" ? "#111827" : "#f8fafc",
        backText: template === "dark" || template === "neon" ? "#ffffff" : "#111827"
    };
}

function drawGradient(context, x, y, width, height, startColor, endColor) {
    let gradient = context.createLinearGradient(x, y, x + width, y + height);

    gradient.addColorStop(0, startColor);
    gradient.addColorStop(1, endColor);
    context.fillStyle = gradient;
    context.fillRect(x, y, width, height);
}

function drawLogo(context, background, color) {
    context.beginPath();
    context.arc(90, 96, 56, 0, Math.PI * 2);
    context.fillStyle = background;
    context.fill();
    context.lineWidth = 8;
    context.strokeStyle = "#ffffff";
    context.stroke();
    context.fillStyle = color;
    context.font = "900 30px Arial";
    context.textAlign = "center";
    context.fillText("ACE", 90, 106);
    context.textAlign = "left";
}

async function drawPdfPhoto(context, photo) {
    context.fillStyle = "#0ea5e9";
    context.fillRect(58, 230, 190, 220);
    context.lineWidth = 8;
    context.strokeStyle = "#bfdbfe";
    context.strokeRect(58, 230, 190, 220);

    if (!photo || photo === window.location.href) {
        context.fillStyle = "#ffffff";
        context.font = "900 28px Arial";
        context.fillText("Photo", 116, 352);
        return;
    }

    try {
        let image = await loadImage(photo);
        let ratio = Math.max(190 / image.width, 220 / image.height);
        let width = image.width * ratio;
        let height = image.height * ratio;

        context.save();
        context.beginPath();
        context.rect(58, 230, 190, 220);
        context.clip();
        context.drawImage(image, 58 + (190 - width) / 2, 230 + (220 - height) / 2, width, height);
        context.restore();
    }
    catch (error) {
        context.fillStyle = "#ffffff";
        context.font = "900 28px Arial";
        context.fillText("Photo", 116, 352);
    }
}

function loadImage(source) {
    return new Promise(function(resolve, reject) {
        let image = new Image();

        image.onload = function() {
            resolve(image);
        };
        image.onerror = reject;
        image.src = source;
    });
}

function drawDetails(context, details, x, y, labelWidth, rowHeight, theme) {
    details.forEach(function(item, index) {
        let rowY = y + index * rowHeight;

        context.fillStyle = theme.muted;
        context.font = "900 28px Arial";
        context.fillText(item[0], x, rowY);

        context.fillStyle = theme.text;
        drawWrappedText(context, item[1], x + labelWidth, rowY, 1012 - x - labelWidth - 64, 28, "900 28px Arial");
    });
}

function drawWrappedText(context, text, x, y, maxWidth, lineHeight, font) {
    let words = String(text || "-").split(" ");
    let line = "";

    context.font = font;

    words.forEach(function(word) {
        let testLine = line + word + " ";

        if (context.measureText(testLine).width > maxWidth && line !== "") {
            context.fillText(line, x, y);
            line = word + " ";
            y += lineHeight;
        }
        else {
            line = testLine;
        }
    });

    context.fillText(line, x, y);
}

function drawBarcode(context, rollNo, color) {
    let x = 300;
    let widths = [10, 4, 16, 8, 12, 5, 18, 7, 10, 4, 15, 8, 6, 14, 5];

    context.fillStyle = color;
    widths.forEach(function(width) {
        context.fillRect(x, 390, width, 138);
        x += width + 8;
    });

    context.fillStyle = color;
    context.font = "900 26px Arial";
    context.textAlign = "center";
    context.fillText(rollNo, 506, 570);
    context.textAlign = "left";
}

function drawPdfCardBorder(context) {
    context.save();
    context.lineWidth = 4;
    context.strokeStyle = "#cbd5e1";
    context.strokeRect(8, 8, 996, 622);
    context.restore();
}

function roundRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
}

function createCardPdf(frontCanvas, backCanvas) {
    let frontImage = dataUrlToBinary(frontCanvas.toDataURL("image/jpeg", 0.92));
    let backImage = dataUrlToBinary(backCanvas.toDataURL("image/jpeg", 0.92));
    let pageWidth = 842;
    let pageHeight = 595;
    let cardWidth = 380;
    let cardHeight = 239;
    let content = [
        "q",
        cardWidth + " 0 0 " + cardHeight + " 36 178 cm",
        "/Im1 Do",
        "Q",
        "q",
        cardWidth + " 0 0 " + cardHeight + " 426 178 cm",
        "/Im2 Do",
        "Q"
    ].join("\n");
    let objects = [
        "<< /Type /Catalog /Pages 2 0 R >>",
        "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " + pageWidth + " " + pageHeight + "] /Resources << /XObject << /Im1 4 0 R /Im2 5 0 R >> >> /Contents 6 0 R >>",
        imageObject(frontImage, frontCanvas.width, frontCanvas.height),
        imageObject(backImage, backCanvas.width, backCanvas.height),
        "<< /Length " + content.length + " >>\nstream\n" + content + "\nendstream"
    ];
    let pdf = "%PDF-1.4\n";
    let offsets = [0];

    objects.forEach(function(object, index) {
        offsets.push(pdf.length);
        pdf += (index + 1) + " 0 obj\n" + object + "\nendobj\n";
    });

    let xrefOffset = pdf.length;

    pdf += "xref\n0 " + (objects.length + 1) + "\n";
    pdf += "0000000000 65535 f \n";

    for (let i = 1; i < offsets.length; i++) {
        pdf += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
    }

    pdf += "trailer\n<< /Size " + (objects.length + 1) + " /Root 1 0 R >>\n";
    pdf += "startxref\n" + xrefOffset + "\n%%EOF";

    return new Blob([stringToBytes(pdf)], { type: "application/pdf" });
}

function imageObject(image, width, height) {
    return "<< /Type /XObject /Subtype /Image /Width " + width + " /Height " + height + " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length " + image.length + " >>\nstream\n" + image + "\nendstream";
}

function dataUrlToBinary(dataUrl) {
    return atob(dataUrl.split(",")[1]);
}

function stringToBytes(value) {
    let bytes = new Uint8Array(value.length);

    for (let i = 0; i < value.length; i++) {
        bytes[i] = value.charCodeAt(i) & 255;
    }

    return bytes;
}

function updatePreviewCard(rollNo) {
    document.getElementById("card_name").textContent = document.getElementById("name").value;
    document.getElementById("card_college").textContent = document.getElementById("college_name").value;
    document.getElementById("card_subtitle").textContent = "IDENTITY CARD";
    document.getElementById("card_roll").textContent = rollNo;
    document.getElementById("card_degree").textContent = document.getElementById("degree").options[document.getElementById("degree").selectedIndex].text;
    document.getElementById("card_course").textContent = document.getElementById("course").value;
    document.getElementById("card_batch").textContent = document.getElementById("batch").value || "-";
    document.getElementById("card_valid_till").textContent = document.getElementById("valid_till").value || "-";
    document.getElementById("card_year").textContent = document.getElementById("admission_year").value;
    document.getElementById("card_dob").textContent = document.getElementById("dob").value;
    document.getElementById("card_blood_group").textContent = document.getElementById("blood_group").value || "-";
    document.getElementById("card_email").textContent = document.getElementById("email").value;
    document.getElementById("card_phone").textContent = document.getElementById("ph_no").value || "-";
    document.getElementById("card_address").textContent = document.getElementById("address").value || "-";

    let photoInput = document.getElementById("photo");
    let cardPhoto = document.getElementById("card_photo");
    let photoPlaceholder = document.getElementById("photo_placeholder");

    if (photoInput.files.length > 0) {
        let reader = new FileReader();

        reader.onload = function() {
            cardPhoto.src = reader.result;
            cardPhoto.style.display = "block";
            photoPlaceholder.style.display = "none";
        };

        reader.readAsDataURL(photoInput.files[0]);
    }
    else {
        cardPhoto.style.display = "none";
        photoPlaceholder.style.display = "flex";
    }

    updateTemplatePreview();
    document.getElementById("id_card").classList.add("show");
}
