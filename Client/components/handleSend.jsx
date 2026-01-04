// components/handleSend.js
export default async function handleSend({
  generatePDF,
  vacataireId,
  type,
  fullName, 
  month = "",
  year = "",
  status = "pending",
}) {
  try {
    const pdfBlob = generatePDF();
 
    const cleanName = fullName
      ? fullName
        .replace(/\s+/g, "_")     // replace spaces with underscores
        .replace(/[^\w\u0600-\u06FF-]/g, "") // keep letters, numbers, Arabic, and hyphens
        .replace(/_{2,}/g, "_")   
        .trim()
      : "vacataire";

    const baseName = type === "pedagogique"
      ? "fiche_pedagogique"
      : `${month}_${year}_declaration_mensuelle`;
    const Name = type === "pedagogique"
      ? "Fiche Pedagogique"
      : `Declaration Mensuelle - ${month}/${year} `;  

    const filename = `${cleanName}_${baseName}.pdf`;

    const formData = new FormData();
    formData.append("file", pdfBlob, filename);
    formData.append("vacataireId", vacataireId);
    formData.append("Name", Name);
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

    return result;
  } catch (err) {
    throw err;
  }
}