import html2pdf from "html2pdf.js";

export function exportToPdf() {
    const element = document.getElementById("resume-preview");
    if (!element) return;

    html2pdf()
        .set({
            margin: 10,
            filename: "resume.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(element)
        .save();
}
