"use client";

import { useState, useRef, forwardRef } from "react";
import { Save, Check, FileDown } from "lucide-react";
import AjouterSeanceModal from "@/components/AjouterSeanceModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import SideBar from "@/components/SideBar";

const initialRows = [
  { date: "05/03/2024", seance: "Mathématiques I - Algèbre I", type: "Cours", heures: 3 },
  { date: "07/03/2024", seance: "Mathématiques I - Algèbre I", type: "TD", heures: 2 },
  { date: "12/03/2024", seance: "Physique II - Mécanique", type: "TP", heures: 4 },
];

export default function Page() {
  const [commentaire, setCommentaire] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [rows, setRows] = useState(initialRows);

  const total = rows.reduce((s, r) => s + r.heures, 0);

  const nomRef = useRef(null);
  const moisRef = useRef(null);
  const numRef = useRef(null);

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

  const handleGeneratePDF = () => {
    const doc = new jsPDF();

    const fullName = nomRef.current?.value || "";
    const mois = moisRef.current?.value || "";
    const numero = numRef.current?.value || "";

    doc.setFontSize(14);
    doc.text("Déclaration Mensuelle d'Heures", 14, 20);
    doc.setFontSize(10);
    doc.text(`Nom complet : ${fullName}`, 14, 30);
    doc.text(`Mois : ${mois}`, 14, 36);
    doc.text(`Numéro de vacataire : ${numero}`, 14, 42);

    autoTable(doc, {
      startY: 50,
      head: [["Date", "Séance", "Nature", "Heures"]],
      body: rows.map((r) => [r.date, r.seance, r.type, r.heures]),
    });

    // Get final Y position after table
    const finalY = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 10 : 150;

    doc.setFontSize(11);
    doc.text(`Total des heures : ${total}`, 14, finalY);

    if (commentaire.trim()) {
      doc.text("Commentaire :", 14, finalY + 10);
      doc.setFontSize(10);
      doc.text(commentaire, 14, finalY + 16, { maxWidth: 180 });
    }

    doc.save("declaration_mensuelle_heures.pdf");
  };

  return (
    <div className="flex">
      <SideBar/>
      <main className="flex-1 ml-64 p-12 space-y-6 text-black">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Déclaration Mensuelle d&apos;Heures</h1>
            <p>Mars 2024 – Année universitaire 2024-2025</p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-blue-100 border border-blue-200">
            Brouillon
          </button>
        </div>

        {/* Infos générales */}
        <div className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-gray-200">
          <h2 className="font-semibold mb-6">Informations générales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input ref={nomRef} label="Nom complet" defaultValue="Koull Mohammed" />
            <Input ref={moisRef} label="Mois" defaultValue="Mars 2024" />
            <Input ref={numRef} label="Numéro de vacataire" defaultValue="VAC-2024-0158" />
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
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
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
                <th className="p-3 border border-gray-200 text-center">Action</th>
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
                      className="text-blue-600 hover:underline"
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
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">
            <Save size={16} /> Enregistrer
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleGeneratePDF}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-800"
            >
              <FileDown size={16} /> Télécharger PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              <Check size={16} /> Soumettre pour validation
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

// Input avec forwardRef
const Input = forwardRef((props, ref) => {
  const { label, defaultValue } = props;
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        ref={ref}
        defaultValue={defaultValue}
        className="mt-1 w-full px-3 py-2 rounded-lg bg-gray-50 ring-1 ring-gray-200"
      />
    </div>
  );
});

Input.displayName = "Input";