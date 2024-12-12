// import puppeteer from 'puppeteer';

// const downloadInvoicePdf = async () => {
//     // Mở trình duyệt mới
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     // Lấy HTML của phần tử chứa nội dung hóa đơn
//     const element = document.getElementById('invoice-content');
//     if (!element) {
//         console.error('Không tìm thấy nội dung hóa đơn.');
//         await browser.close();
//         return;
//     }

//     const htmlContent = element.outerHTML;

//     // Mở một trang mới trong Puppeteer và chèn nội dung HTML
//     await page.setContent(htmlContent);

//     // Tạo PDF từ HTML
//     const pdfBuffer = await page.pdf({
//         format: 'A4',
//         printBackground: true, // In nền (background) nếu có
//         path: `invoice-${Date.now()}.pdf`, // Đặt tên cho file PDF
//     });

//     // Tải file PDF về
//     const fileName = `invoice-${Date.now()}.pdf`;
//     const fs = require('fs');
//     fs.writeFileSync(fileName, pdfBuffer); // Lưu PDF vào file

//     console.log(`Hóa đơn đã được tải về: ${fileName}`);

//     await browser.close();
// };

// export default downloadInvoicePdf;
