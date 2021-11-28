// Loaded via <script> tag, create shortcut to access PDF.js exports.
const pdfjsLib = window['pdfjs-dist/build/pdf'];

let pdfDoc = null;
let currentRenderingPage = 1;
const scale = 1.5;
const pagesContainer = document.getElementById('pages-container');

const renderPage = (num, onPdfLoaded) => {

    currentRenderingPage = num;

    // Using promise to fetch the page
    pdfDoc.getPage(currentRenderingPage).then(function (page) {

        const viewport = page.getViewport({ scale: scale });
        const canvas = document.createElement('canvas');
        pagesContainer.appendChild(canvas);
        const canvasContext = canvas.getContext('2d');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        const renderContext = {
            canvasContext: canvasContext,
            viewport: viewport
        };
        const renderTask = page.render(renderContext);

        // Wait for rendering to finish
        renderTask.promise.then(function () {

            if (currentRenderingPage < pdfDoc.numPages) {
                currentRenderingPage++;
                renderPage(currentRenderingPage, onPdfLoaded);
                onPdfLoaded();
            }

        });
    });

}

const renderAllPages = onPdfLoaded => {
    renderPage(1, onPdfLoaded);
}

const renderPdf = (url, onPdfLoaded, onError) => {

    pdfjsLib.getDocument(url).promise
        .then(function (pdfDoc_) {
            pdfDoc = pdfDoc_;
            renderAllPages(onPdfLoaded);
        })
        .catch(error => onError(error));

}