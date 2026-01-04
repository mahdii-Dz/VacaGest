"use client";

import { BookOpen, Plus, Trash2, FileDown, Send, Save, Check } from "lucide-react";
import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import AjouterModuleModal from "@/components/AjouterModuleModal";
import SideBar from "@/components/SideBar";
import useLocalStorage from "@/components/useLocalStorage";
import handleSend from "@/components/handleSend";

export default function Page() {
  const [user] = useLocalStorage("userData");
  const [openModal, setOpenModal] = useState(false);
  const [rows, setRows] = useState([]);
  const date = new Date(user?.createdAt);
  const readableDate = date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const AnneeUniversitaire = `${date.getFullYear()}-${date.getFullYear() + 1}`;
  const fullName = user ? `${user.fName} ${user.lName}`.trim() : "";
  const userSpecialty = user?.specialty || "";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting || hasSubmitted) return;

    setIsSubmitting(true);

    try {
      await handleSend({
        generatePDF: handleGeneratePDF,
        vacataireId: user?._id,
        fullName: fullName,
        type: "pedagogique",
        status: "pending",
      });

      alert("✅ Déclaration soumise avec succès !");
      setHasSubmitted(true);
    } catch (err) {
      console.error(err);
      alert(`❌ Erreur: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }
  const handleAddRow = (newRow) => {
    setRows((prev) => [...prev, newRow]);
  };

  const handleDeleteRow = (index) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const total = rows.reduce((s, r) => s + r.heures, 0);

  /* ===== PDF GENERATION ===== */
  const handleGeneratePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Fiche Pédagogique – Semestre 1", 14, 20);

    doc.setFontSize(11);
    doc.text(`Année Universitaire : ${AnneeUniversitaire}`, 14, 30);
    doc.text(`Nom & Prénom : ${fullName}`, 14, 38);
    doc.text("Département : Informatique", 14, 46);

    autoTable(doc, {
      startY: 58,
      head: [
        ["#", "Module", "Section", "Type", "Heures", "Salle", "Département"],
      ],
      body: rows.map((r, i) => [
        i + 1,
        r.module,
        r.section,
        r.type,
        r.heures,
        r.salle,
        r.departement,
      ]),
    });

    const finalY = doc.lastAutoTable?.finalY
      ? doc.lastAutoTable.finalY + 10
      : 150;

    doc.setFontSize(12);
    doc.text(`Total des heures : ${total} heures`, 14, finalY);

    // Return the PDF as a Blob
    return doc.output("blob");
  };

  return (
    <div className="flex">
      <SideBar />
      <main className="flex-1 p-12 ml-64 space-y-6 text-black bg-gray-50">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm ring-1 ring-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">
                Fiche Pédagogique – Semestre 1
              </h1>
              <p className="text-gray-500">Année Universitaire 2023-2024</p>
            </div>

            <span className="px-4 py-1 rounded-full text-sm bg-green-100 text-green-600">
              ● Validée
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 bg-gray-50 p-4 rounded-lg">
            <Info label="Nom & Prénom" value={fullName} />
            <Info label="Département" value={userSpecialty} />
            <Info label="Date de création" value={readableDate} />
          </div>
        </div>

        {/* Modules */}
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200">
          <div className="p-6 border-b border-gray-200">
            <BookOpen size={16} className="text-blue-600 inline mr-2" />
            <h2 className="font-semibold inline">
              Modules d&apos;Enseignement
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Ajoutez les modules que vous enseignez ce semestre
            </p>
          </div>

          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 border border-gray-200 text-left">#</th>
                <th className="p-3 border border-gray-200 text-left">Module</th>
                <th className="p-3 border border-gray-200 text-left">
                  Section
                </th>
                <th className="p-3 border border-gray-200 text-left">Type</th>
                <th className="p-3 border border-gray-200 text-left">Heures</th>
                <th className="p-3 border border-gray-200 text-left">Salle</th>
                <th className="p-3 border border-gray-200 text-left">
                  Département
                </th>
                <th className="p-3 border border-gray-200 text-left">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-3 border border-gray-200">{i + 1}</td>
                  <td className="p-3 border border-gray-200">{r.module}</td>
                  <td className="p-3 border border-gray-200">{r.section}</td>
                  <td className="p-3 border border-gray-200">{r.type}</td>
                  <td className="p-3 border border-gray-200">{r.heures}</td>
                  <td className="p-3 border border-gray-200">{r.salle}</td>
                  <td className="p-3 border border-gray-200">
                    {r.departement}
                  </td>
                  <td className="p-3 border border-gray-200">
                    <button
                      onClick={() => handleDeleteRow(i)}
                      className="text-red-600 hover:text-red-700"
                      aria-label="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center p-4">
            <button
              onClick={() => setOpenModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-blue-600 rounded-lg text-blue-600 hover:bg-blue-50"
            >
              <Plus size={16} />
              Ajouter une ligne
            </button>

            <div className="font-semibold">
              Total des heures :
              <span className="text-blue-600 ml-2">{total}</span> heures
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">
            <Save size={16} /> Enregistrer
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => {
                const pdfBlob = handleGeneratePDF();
                const cleanName = fullName.replace(/\s+/g, "_").replace(/[^\w\u0600-\u06FF]/g, "");
                const filename = `${cleanName}_fiche_pedagogique.pdf`;

                const url = URL.createObjectURL(pdfBlob);
                const a = document.createElement("a");
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-800"
            >
              <FileDown size={16} /> Télécharger PDF
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || hasSubmitted}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${hasSubmitted
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
            >
              {isSubmitting ? (
                <>
                  <Check size={16} /> Envoi en cours...
                </>
              ) : hasSubmitted ? (
                <>
                  <Check size={16} /> Soumis avec succès
                </>
              ) : (
                <>
                  <Check size={16} /> Soumettre pour validation
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal */}
        {openModal && (
          <AjouterModuleModal
            onClose={() => setOpenModal(false)}
            onAdd={handleAddRow}
          />
        )}
      </main>
    </div>
  );
}

// Info Component (no PropTypes needed, but clean)
function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
