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
        listItem.innerHTML = `<a href="${data.secure_url}" target="_blank">View Invoice</a>`;
        invoiceList.appendChild(listItem);
        
        alert("Invoice uploaded successfully!");
    } catch (error) {
        console.error("Upload failed:", error);
        alert("Upload failed. Please try again.");
    }
}