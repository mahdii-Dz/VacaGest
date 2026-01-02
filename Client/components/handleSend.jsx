// components/handleSend.js
export default async function handleSend({
  generatePDF,
  vacataireId,
  type,
  month = "",
  year = "",
  status = "pending",
}) {
  try {
    const pdfBlob = generatePDF();

    const formData = new FormData();
    const filename =
      type === "pedagogique"
        ? "fiche_pedagogique.pdf"
        : "declaration_mensuelle.pdf";

    formData.append("file", pdfBlob, filename);
    formData.append("vacataireId", vacataireId);
    formData.append("type", type);
    if (month) formData.append("month", month);
    if (year) formData.append("year", year);
    formData.append("status", status);

    const response = await fetch("https://vacagest.onrender.com/api/files/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Upload failed");
    }

    return result; // ✅ Success
  } catch (err) {
    throw err; // Let caller handle UI feedback
  }
}