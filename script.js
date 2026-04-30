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
