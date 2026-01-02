"use client";

import { useState } from "react";
import { X, Clock, MapPin, Plus } from "lucide-react";

export default function AjouterModuleModal({ onClose, onAdd }) {
  const [module, setModule] = useState("");
  const [section, setSection] = useState("");
  const [type, setType] = useState("Cours"); // Default: "Cours"
  const [heures, setHeures] = useState("");
  const [salle, setSalle] = useState("");
  const [departement, setDepartement] = useState("");

  const handleSubmit = () => {
    if (!module || !section || !heures || !salle) {
      return;
    }

    onAdd({
      module,
      section,
      type,
      heures: Number(heures),
      salle,
      departement,
    });

    onClose();
  };

  // Valid type options
  const typeOptions = ["Cours", "TD", "TP"];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b">
          <div>
            <h2 className="text-lg font-semibold text-black">Ajouter un module</h2>
            <p className="text-sm text-gray-500">
              Remplissez les détails du module d&apos;enseignement
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black transition"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-black">Module</label>
            <input
              value={module}
              onChange={(e) => setModule(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Programmation Web"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-black">Section / groupe</label>
              <input
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="L3 Section 1 G2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-black">Type</label>
              <div className="flex gap-2 mt-1">
                {typeOptions.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`px-3 py-1 rounded-lg border ${
                      type === t
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-black">Heures / semaine</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-gray-400" size={16} />
                <input
                  value={heures}
                  onChange={(e) => setHeures(e.target.value)}
                  type="number"
                  min="1"
                  className="pl-9 w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-black">Salle</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                <input
                  value={salle}
                  onChange={(e) => setSalle(e.target.value)}
                  className="pl-9 w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-black">Département</label>
            <input
              value={departement}
              onChange={(e) => setDepartement(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Informatique"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            Annuler
          </button>

          <button
            onClick={handleSubmit}
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            <Plus size={16} />
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}