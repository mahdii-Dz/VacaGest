"use client";

import { useState, useEffect } from "react";
import {
    Clock,
    FileText,
    Search as SearchIcon,
    Eye,
    Check,
    X,
    XIcon,
    CheckIcon,
} from "lucide-react";
import { fetchWithCache } from "@/utils/cachedFetch";
import useLocalStorage from "./useLocalStorage";


function AdminDashboard() {
    const [user, , removeUser, isClient] = useLocalStorage("userData");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState([]);
    const fullName = user ? `${user.fName} ${user.lName}`.trim() : "";
    const [stats, setStats] = useState([
        {
            id: 1,
            label: "En attente",
            value: 0,
            icon: <Clock color="#EA580C" size={20} />,
            bgColor: "bg-orange-100",
            textColor: "text-orange-600",
        },
        {
            id: 2,
            label: "Validées",
            value: 0,
            icon: <CheckIcon color="#16A34A" size={20} />,
            bgColor: "bg-green-100",
            textColor: "text-green-600",
        },
        {
            id: 3,
            label: "Rejetées",
            value: 0,
            icon: <XIcon color="#DC2626" size={20} />,
            bgColor: "bg-red-100",
            textColor: "text-red-600",
        },
        {
            id: 4,
            label: "Total",
            value: 0,
            icon: <FileText color="#2563EB" size={20} />,
            bgColor: "bg-blue-100",
            textColor: "text-blue-600",
        },
    ]);
    const [loading, setLoading] = useState(true);

    const fetchValidationData = async () => {
        try {
            const cacheKey = `stats`
            const url = 'https://vacagest.onrender.com/api/files/'
            const data = await fetchWithCache(cacheKey, url)

            let pending = 0;
            let validated = 0;
            let rejected = 0;

            data.forEach(item => {
                if (item.metadata.status === "pending") pending++;
                else if (item.metadata.status === "validated") validated++;
                else if (item.metadata.status === "rejected") rejected++;
            });

            const total = data.length;

            setStats(prevStats => [
                { ...prevStats[0], value: pending },
                { ...prevStats[1], value: validated },
                { ...prevStats[2], value: rejected },
                { ...prevStats[3], value: total }
            ]);

            const dataWithColors = data.map(item => ({
                ...item,
                _color: stringToColor(item.metadata.vacataire)
            }));

            return dataWithColors;
        } catch (err) {
            console.error(err);
            return [];
        }
    };

    function stringToColor(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xFF;
            color += value.toString(16).padStart(2, '0');
        }
        return color;
    }


    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchValidationData();
                setData(data);
            } catch (error) {
                console.error("Failed to load validation data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleView = async (fileName) => {
        const pdfUrl = `https://vacagest.onrender.com/api/files/${fileName}`;

        if (pdfUrl) {
            window.open(pdfUrl, '_blank');
        } else {
            alert("Aucun fichier PDF disponible.");
        }

    };

    const handleValidate = async (id) => {
        try {
            const response = await fetch(`https://vacagest.onrender.com/api/files/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'validated',
                    validatedBy: fullName
                })
            })
            const MSG = await response.json()
            localStorage.removeItem('stats')
            const data = await fetchValidationData();
            setData(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleReject = async (id) => {
        try {
            const response = await fetch(`https://vacagest.onrender.com/api/files/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'rejected',
                    validatedBy: fullName
                })
            })
            const MSG = await response.json()
            localStorage.removeItem('stats')
            const data = await fetchValidationData();
            setData(data);
        } catch (err) {
            console.error(err);
        }
    };

    function fileMonth(type, month = '', uploadedAt, year = '') {
        if (type === 'Fiche Pedagogique') {
            const month = new Date(uploadedAt).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
            return month
        } else {
            return `${month} ${year}`
        }
    }
    function Initials(fullname) {
        const [firstName, lastName] = fullname.trim().split(/\s+/);
        return (firstName?.[0].toUpperCase() || '') + (lastName?.[0].toUpperCase() || '')
    }

    const ITEMS_PER_PAGE = 10;
    //filtered data
    const filteredData = data.filter((item) =>
        item.metadata.status.toLowerCase().includes('pending') &&
        item.metadata.vacataire.toLowerCase().includes(searchQuery.toLowerCase())
    );
    // Paginate
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    if (loading) {
        return (
            <section className="w-full h-dvh ml-64 p-12 bg-white shadow-sm">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-64 bg-gray-100 rounded"></div>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full h-auto p-12 ml-64 bg-[#F9FAFB] flex flex-col overflow-x-hidden">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Validation des fiches
                </h1>
                <p className="text-[#4B5563]">
                    Gérez et validez les fiches soumises par les vacataires                </p>
            </div>
            <section className="flex items-start justify-center gap-6 w-full">
                {stats.map((stat) => (
                    <article
                        key={stat.id}
                        className="flex-1 bg-white rounded-xl ring-1 ring-gray-200 p-6"
                    >
                        <div className="flex flex-col  items-start gap-4">
                            <div className={`${stat.bgColor} p-3.5 rounded-lg`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                                <p className="text-gray-900 text-3xl font-bold mt-1">{stat.value}</p>
                            </div>
                        </div>
                    </article>
                ))}
            </section>
            {/* Header */}
            <div className="bg-white rounded-xl w-full mt-8 shadow-Paragraph ring-1 ring-gray-200">

                <div className="p-6 border-b w-full border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Fiches en attente de validation
                        </h2>

                        <div className="flex items-center gap-3">
                            {/* Search */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <SearchIcon className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Rechercher..."
                                    className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    aria-label="Rechercher des fiches"
                                />
                            </div>

                            {/* Filter (placeholder) */}
                            <select
                                className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                aria-label="Filtrer par type de fiche"
                            >
                                <option>Tous les types</option>
                                <option>Fiche pédagogique</option>
                                <option>Fiche mensuelle</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="w-full">
                    <table className="w-full">
                        <thead className="bg-[#F9FAFB] ring-1 ring-gray-200 w-full">
                            <tr>
                                <th className="px-6 py-4 border-l border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Vacataire
                                </th>
                                <th className="px-6 py-4 border-l border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Type de fiche
                                </th>
                                <th className="px-6 py-4 border-l border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Mois
                                </th>
                                <th className="px-6 py-4 border-l border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th className="px-6 py-4 border-l border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 w-full">
                            {paginatedData.length > 0 ? (
                                paginatedData.map((item, index) => (
                                    <tr key={item._id} className={index > 0 ? "border-t border-gray-200" : ""}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div
                                                    style={{ backgroundColor: item._color }}
                                                    className={` w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold`}>
                                                    {Initials(item.metadata.vacataire)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{item.metadata.vacataire}</div>
                                                    <div className="text-sm text-gray-500">{item.metadata.specialty}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.metadata.Name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {fileMonth(item.metadata.Name, item.metadata?.month, item.metadata.uploadedAt, item.metadata.year)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 text-xs font-semibold ${item.metadata.status === "pending" ? "text-orange-700 bg-orange-100" : item.metadata.status === "validated" ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"} rounded-full`}>
                                                {item.metadata.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleView(item.filename)}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                                                    aria-label={`Voir la fiche de ${item.metadata.vacataire}`}
                                                >
                                                    <Eye size={12} />
                                                    Voir
                                                </button>
                                                <button
                                                    onClick={() => handleValidate(item._id)}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 cursor-pointer"
                                                    aria-label={`Valider la fiche de ${item.metadata.vacataire}`}
                                                >
                                                    <Check size={12} />
                                                    Valider
                                                </button>
                                                <button
                                                    onClick={() => handleReject(item._id)}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
                                                    aria-label={`Rejeter la fiche de ${item.metadata.vacataire}`}
                                                >
                                                    <X size={12} />
                                                    Rejeter
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        Aucune fiche trouvée.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Footer / Pagination */}
                {
                    data.length > 0 && (
                        <footer className="p-6 border-t border-gray-200 w-full">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    Affichage de {startIndex + 1} à {Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)} sur {filteredData.length} fiches
                                </p>

                                <nav className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        aria-label="Page précédente"
                                    >
                                        Précédent
                                    </button>

                                    {/* Dynamic page buttons (shows up to 5 pages) */}
                                    {(() => {
                                        const pages = [];
                                        const maxVisible = 5;
                                        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                                        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

                                        if (endPage - startPage + 1 < maxVisible) {
                                            startPage = Math.max(1, endPage - maxVisible + 1);
                                        }

                                        for (let i = startPage; i <= endPage; i++) {
                                            pages.push(
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentPage(i)}
                                                    className={`px-3 py-2 text-sm font-medium rounded-lg ${currentPage === i
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                                        }`}
                                                    aria-label={`Page ${i}`}
                                                    aria-current={currentPage === i ? "page" : undefined}
                                                >
                                                    {i}
                                                </button>
                                            );
                                        }
                                        return pages;
                                    })()}

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        aria-label="Page suivante"
                                    >
                                        Suivant
                                    </button>
                                </nav>
                            </div>
                        </footer>
                    )
                }
            </div>
        </section>
    );
};
export default AdminDashboard