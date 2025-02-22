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
