const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");

// Builds a certificate PDF (landscape A4) with an embedded QR code and returns it as a Buffer.
async function buildCertificatePdf({ studentName, examTitle, obtainedMarks, totalMarks, issuedAt, certificateCode }) {
  const qrPayload = `Certificate ${certificateCode} | ${studentName} | ${examTitle} | Score: ${obtainedMarks}/${totalMarks} | ${issuedAt.toDateString()}`;
  const qrBuffer = await QRCode.toBuffer(qrPayload, { margin: 1, width: 150 });

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ layout: "landscape", size: "A4", margin: 50 });
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(2).stroke("#1d4ed8");

    doc.fontSize(28).fillColor("#1e3a8a").text("Certificate of Achievement", 0, 90, { align: "center" });

    doc.fontSize(14).fillColor("#1f2937").text("This is to certify that", { align: "center" });
    doc.moveDown(0.6);
    doc.fontSize(24).fillColor("#1d4ed8").text(studentName, { align: "center" });
    doc.moveDown(0.6);
    doc.fontSize(14).fillColor("#1f2937").text("has successfully completed the exam", { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(18).fillColor("#1f2937").text(examTitle, { align: "center" });
    doc.moveDown(0.6);
    doc.fontSize(14).fillColor("#1f2937").text(`Score: ${obtainedMarks} / ${totalMarks}`, { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(12).fillColor("#4b5563").text(`Date: ${issuedAt.toDateString()}`, { align: "center" });

    doc.image(qrBuffer, doc.page.width - 150, doc.page.height - 150, { width: 90 });
    doc
      .fontSize(9)
      .fillColor("#9ca3af")
      .text(`Certificate Code: ${certificateCode}`, doc.page.width - 170, doc.page.height - 55, {
        width: 130,
        align: "center",
      });

    doc.end();
  });
}

module.exports = { buildCertificatePdf };
