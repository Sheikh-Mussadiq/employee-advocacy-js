export function handleImageDownload(imageUrl, title) {
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function handlePDFDownload(pdfUrl, title) {
  const link = document.createElement('a');
  link.href = pdfUrl;
  link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}