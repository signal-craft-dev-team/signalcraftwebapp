import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { colors } from '@/styles/tokens';

/**
 * Captures a DOM element as a PNG image and triggers a download.
 * @param elementId The ID of the DOM element to capture.
 * @param filename The name of the generated image file.
 */
export async function exportToImage(elementId: string, filename: string) {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Element with id "${elementId}" not found.`);
    }

    try {
        const dataUrl = await toPng(element, {
            quality: 0.95,
            backgroundColor: colors.slate50,
            pixelRatio: 2,
            height: element.scrollHeight,
            style: {
                transform: 'none',
            }
        });

        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();
    } catch (error) {
        console.error('Image export failed:', error);
        throw error;
    }
}

/**
 * Exports a DOM element to a multi-page PDF by capturing it as a PNG image 
 * and slicing it into A4-sized segments.
 */
export async function exportToPdf(elementId: string, filename: string) {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Element with id "${elementId}" not found.`);
    }

    try {
        const dataUrl = await toPng(element, {
            quality: 0.95,
            backgroundColor: colors.slate50,
            pixelRatio: 2,
            height: element.scrollHeight,
            style: {
                transform: 'none',
            }
        });

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const contentHeightInPdf = (imgProps.height * pdfWidth) / imgProps.width;

        let heightLeft = contentHeightInPdf;
        let position = 0;

        pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, contentHeightInPdf);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
            position = heightLeft - contentHeightInPdf;
            pdf.addPage();
            pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, contentHeightInPdf);
            heightLeft -= pdfHeight;
        }

        pdf.save(filename);
    } catch (error) {
        console.error('PDF export failed:', error);
        throw error;
    }
}
