import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportToPdf() {
    const element = document.getElementById("resume-preview");
    if (!element) return;

    const MARGIN_MM = 10;
    const PAGE_WIDTH_MM = 210; // A4 width
    const CONTENT_WIDTH_MM = PAGE_WIDTH_MM - 2 * MARGIN_MM;

    // Render the full resume to a single canvas
    const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        scrollY: -window.scrollY,
    });

    // Scale: how many mm per canvas pixel
    const mmPerPx = CONTENT_WIDTH_MM / canvas.width;

    // Page height = whatever the content actually needs (no fixed A4 cutoff)
    const contentHeightMm = canvas.height * mmPerPx;
    const pageHeightMm = contentHeightMm + 2 * MARGIN_MM;

    const imgData = canvas.toDataURL("image/jpeg", 0.98);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdf = new (jsPDF as any)({
        unit: "mm",
        format: [PAGE_WIDTH_MM, pageHeightMm], // custom height = content height
        orientation: "portrait",
    });

    pdf.addImage(imgData, "JPEG", MARGIN_MM, MARGIN_MM, CONTENT_WIDTH_MM, contentHeightMm);

    // Overlay invisible clickable link annotations on top of every <a> tag.
    // html2canvas renders a flat image so we must manually re-add link areas.
    const elementRect = element.getBoundingClientRect();
    const pxToMm = CONTENT_WIDTH_MM / elementRect.width; // DOM px → mm

    element.querySelectorAll("a[href]").forEach((anchor) => {
        const href = (anchor as HTMLAnchorElement).href;
        if (!href) return;
        const rect = anchor.getBoundingClientRect();
        const x = MARGIN_MM + (rect.left - elementRect.left) * pxToMm;
        const y = MARGIN_MM + (rect.top - elementRect.top) * pxToMm;
        const w = rect.width * pxToMm;
        const h = rect.height * pxToMm;
        pdf.link(x, y, w, h, { url: href });
    });

    pdf.save("resume.pdf");
}
