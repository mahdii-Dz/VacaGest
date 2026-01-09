"use client";

import { useState } from "react";
import { Save, Check, FileDown } from "lucide-react";
import AjouterSeanceModal from "@/components/AjouterSeanceModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import SideBar from "@/components/SideBar";
import useLocalStorage from "@/components/useLocalStorage";
import handleSend from "@/components/handleSend";

export default function Page() {
  const [user] = useLocalStorage("userData");
  const [commentaire, setCommentaire] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [rows, setRows] = useState([]);
  const [mois, setMois] = useState("septembre");
  const [annee, setAnnee] = useState("2025");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const fullName = user ? `${user.fName} ${user.lName}`.trim() : "";
  const handleSubmit = async () => {
    if (isSubmitting || hasSubmitted || rows.length === 0 ) return;

    setIsSubmitting(true);

    try {
      await handleSend({
        generatePDF: handleGeneratePDF,
        vacataireId: user?._id,
        type: "mensuelle",
        specialty: user?.specialty,
        fullName: fullName,
        month: mois,
        year: annee,
        status: "pending",
      });

      alert("✅ Déclaration soumise avec succès !");
      localStorage.removeItem(`pedagogique-${user._id}`);
      setHasSubmitted(true); // 🔒 Lock further submissions
    } catch (err) {
      console.error(err);
      alert(`❌ Erreur: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  const total = rows.reduce((s, r) => s + r.heures, 0);

  const handleAddRow = (newRow) => setRows((prev) => [...prev, newRow]);
  

  const handleUpdateRow = (updatedRow) => {
    if (!editingData) return;
    setRows((prev) =>
      prev.map((r) =>
        r.date === editingData.date && r.seance === editingData.seance
          ? updatedRow
          : r
      )
    );
  };

  // ✅ PDF Generator (uses state, not refs)
  const handleGeneratePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text("Déclaration Mensuelle d'Heures", 14, 20);
    doc.setFontSize(10);
    doc.text(`Nom complet : ${fullName}`, 14, 30);
    doc.text(`Mois : ${mois}`, 14, 36);

    autoTable(doc, {
      startY: 50,
      head: [["Date", "Séance", "Nature", "Heures"]],
      body: rows.map((r) => [r.date, r.seance, r.type, r.heures]),
    });

    const finalY = doc.lastAutoTable?.finalY
      ? doc.lastAutoTable.finalY + 10
      : 150;

    doc.setFontSize(11);
    doc.text(`Total des heures : ${total}`, 14, finalY);

    if (commentaire.trim()) {
      doc.text("Commentaire :", 14, finalY + 10);
      doc.setFontSize(10);
      doc.text(commentaire, 14, finalY + 16, { maxWidth: 180 });
    }

    return doc.output("blob");
  };

  return (
    <div className="flex">
      <SideBar />
      <main className="flex-1 ml-64 p-12 space-y-6 text-black bg-[#F9FAFB]">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">
              Déclaration Mensuelle d&apos;Heures
            </h1>
            <p>Année universitaire 2024-2025</p>
          </div>
        </div>

        {/* Infos générales */}
        <div className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-gray-200">
          <h2 className="font-semibold mb-6">Informations générales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Info label="Nom complet" value={fullName} />
            <div>
              <label className="text-sm font-medium block mb-1">Mois</label>
              <input
                value={mois}
                onChange={(e) => setMois(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 ring-1 ring-gray-200"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">
                année
              </label>
              <input
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 ring-1 ring-gray-200"
              />
            </div>
          </div>
        </div>

        {/* Table des séances */}
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="font-semibold">Séances effectuées</h2>
            <button
              onClick={() => {
                setEditingData(null);
                setOpenModal(true);
              }}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            >
              + Ajouter une séance
            </button>
          </div>

          <table className="w-full text-sm border-collapse text-black">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 border border-gray-200 text-left">Date</th>
                <th className="p-3 border border-gray-200 text-left">Séance</th>
                <th className="p-3 border border-gray-200 text-left">Nature</th>
                <th className="p-3 border border-gray-200 text-left">Heures</th>
                <th className="p-3 border border-gray-200 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-3 border border-gray-200">{r.date}</td>
                  <td className="p-3 border border-gray-200">{r.seance}</td>
                  <td className="p-3 border border-gray-200">{r.type}</td>
                  <td className="p-3 border border-gray-200">{r.heures}</td>
                  <td className="p-3 border border-gray-200 text-center">
                    <button
                      className="text-blue-600 hover:underline cursor-pointer"
                      onClick={() => {
                        setEditingData(r);
                        setOpenModal(true);
                      }}
                    >
                      Modifier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-4 text-right font-semibold text-black border-t border-gray-200">
            Total des heures du mois :{" "}
            <span className="text-blue-600 ml-2">{total}</span>
          </div>
        </div>

        {/* Commentaire */}
        <div>
          <label className="text-sm font-medium mb-2 block">Commentaire</label>
          <textarea
            rows={4}
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            className="w-full rounded-lg bg-gray-50 p-3 ring-1 ring-gray-200"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-4">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 cursor-pointer">
            <Save size={16} /> Enregistrer
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => {
                const pdfBlob = handleGeneratePDF();
                const url = URL.createObjectURL(pdfBlob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "declaration_mensuelle_heures.pdf";
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-800 cursor-pointer"
            >
              <FileDown size={16} /> Télécharger PDF
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || hasSubmitted}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer ${hasSubmitted
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
          <AjouterSeanceModal
            onClose={() => setOpenModal(false)}
            onAdd={handleAddRow}
            onUpdate={handleUpdateRow}
            initialData={editingData}
          />
        )}
      </main>
    </div>
  );
}

// Reusable Info component
function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  )
}
