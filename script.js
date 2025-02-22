function generateInvoice() {
    // Get form values
    let invoiceNumber = document.getElementById("invoiceNumber").value;
    let date = document.getElementById("date").value;
    let clientName = document.getElementById("clientName").value;
    let amount = document.getElementById("amount").value;

    // Display values in invoice preview
    document.getElementById("outInvoiceNumber").innerText = invoiceNumber;
    document.getElementById("outDate").innerText = date;
    document.getElementById("outClientName").innerText = clientName;
    document.getElementById("outAmount").innerText = amount;

    // Show invoice preview
    document.getElementById("invoicePreview").style.display = "block";
}

function downloadInvoice() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Select the invoice preview to convert to PDF
    html2canvas(document.getElementById("invoiceOutput")).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        doc.addImage(imgData, "PNG", 10, 10, 180, 120);
        doc.save("Invoice.pdf");
    });
}
// Cloudinary Configuration
const cloudName = "dues89nfp"; // Replace with your Cloudinary cloud name
const uploadPreset = "invoice"; // Replace with your upload preset

async function uploadInvoice() {
    const fileInput = document.getElementById("invoiceUpload");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file first.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        console.log("Uploaded File URL:", data.secure_url);
        
        // Display uploaded invoice link
        const invoiceList = document.getElementById("invoiceList");
        const listItem = document.createElement("li");
        listItem.innerHTML = `<a href="RM{data.secure_url}" target="_blank">View Invoice</a>`;
        invoiceList.appendChild(listItem);
        
        alert("Invoice uploaded successfully!");
    } catch (error) {
        console.error("Upload failed:", error);
        alert("Upload failed. Please try again.");
    }
}
document.addEventListener("DOMContentLoaded", loadTemplates);

// Function to Generate Invoice
function generateInvoice() {
    let invoiceData = [];
    
    document.querySelectorAll(".formRow").forEach(row => {
        let rowData = {};
        row.querySelectorAll("input").forEach(input => {
            rowData[input.dataset.field] = input.value;
        });
        invoiceData.push(rowData);
    });

    let outputHTML = "<h2>Invoice</h2>";
    invoiceData.forEach((data, index) => {
        outputHTML += `<h3>Row ${index + 1}</h3>`;
        for (let key in data) {
            outputHTML += `<p><strong>${key}:</strong> ${data[key]}</p>`;
        }
    });

    document.getElementById("invoiceOutput").innerHTML = outputHTML;
    document.getElementById("invoicePreview").style.display = "block";
}

// Save Invoice Template
function saveTemplate() {
    let templateName = prompt("Enter a name for the template:");
    if (!templateName) return;

    let templateFields = [];
    document.querySelectorAll(".formRow:first-child input").forEach(input => {
        templateFields.push(input.dataset.field);
    });

    let templates = JSON.parse(localStorage.getItem("invoiceTemplates")) || {};
    templates[templateName] = templateFields;
    localStorage.setItem("invoiceTemplates", JSON.stringify(templates));

    alert("Template saved successfully!");
    loadTemplates();
}

// Load Templates into Dropdown
function loadTemplates() {
    let templates = JSON.parse(localStorage.getItem("invoiceTemplates")) || {};
    let templateSelect = document.getElementById("templateSelect");

    templateSelect.innerHTML = '<option value="default">Default Template</option>';
    for (let name in templates) {
        let option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        templateSelect.appendChild(option);
    }
}

// Apply Selected Template and Adjust Form
function loadTemplate() {
    let selectedTemplate = document.getElementById("templateSelect").value;
    if (selectedTemplate === "default") return;

    let templates = JSON.parse(localStorage.getItem("invoiceTemplates")) || {};
    let templateFields = templates[selectedTemplate];

    let formFieldsContainer = document.getElementById("formFieldsContainer");
    formFieldsContainer.innerHTML = ""; // Clear existing fields

    addRow(templateFields); // Add first row based on the template
}

// Function to Add a New Row
function addRow(fields = null) {
    let formFieldsContainer = document.getElementById("formFieldsContainer");

    let row = document.createElement("div");
    row.classList.add("formRow");

    let selectedTemplate = document.getElementById("templateSelect").value;
    let templates = JSON.parse(localStorage.getItem("invoiceTemplates")) || {};
    let templateFields = fields || templates[selectedTemplate] || ["Item", "Quantity", "Price"];

    templateFields.forEach(field => {
        let input = document.createElement("input");
        input.type = "text";
        input.placeholder = field;
        input.dataset.field = field;
        row.appendChild(input);
    });

    let removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.type = "button";
    removeButton.onclick = () => row.remove();
    row.appendChild(removeButton);

    formFieldsContainer.appendChild(row);
}
