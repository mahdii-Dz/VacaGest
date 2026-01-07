"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

export default function AjouterSeanceModal({ onClose, onAdd, onUpdate, initialData }) {
  // Initialize state from initialData (if editing) or empty (if adding)
  const [date, setDate] = useState(initialData?.date || "");
  const [seance, setSeance] = useState(initialData?.seance || "");
  const [type, setType] = useState(initialData?.type || "Cours");
  const [heures, setHeures] = useState(initialData ? String(initialData.heures) : "");

  const handleSubmit = () => {
    if (!date || !seance || !heures) {
      // Optional: show validation message
      return;
    }

    const row = {
      date,
      seance,
      type,
      heures: Number(heures),
    };

    if (initialData) {
      onUpdate(row);
    } else {
      onAdd(row);
    }

    onClose();
  };

  const natureOptions = ["Cours", "TD", "TP"];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b">
          <div>
            <h2 className="text-lg font-semibold text-black">
              {initialData ? "Modifier la séance" : "Ajouter une séance"}
            </h2>
            <p className="text-sm text-gray-500">
              Renseignez les informations de la séance
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black transition cursor-pointer"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-black">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-black">Séance</label>
            <input
              value={seance}
              onChange={(e) => setSeance(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Mathématiques I - Algèbre I"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-black">Nature</label>
            <div className="flex gap-2 mt-1">
              {natureOptions.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setType(n)}
                  className={`px-3 py-1 rounded-lg border transition ${
                    type === n
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-black">
              Nombre d’heures réalisées
            </label>
            <input
              type="number"
              min="1"
              max="24"
              value={heures}
              onChange={(e) => setHeures(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 border border-gray-300 hover:bg-gray-100 bg-white rounded-lg cursor-pointer"
          >
            Annuler
          </button>

          <button
            onClick={handleSubmit}
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer"
          >
            <Plus size={16} />
            {initialData ? "Mettre à jour" : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
}