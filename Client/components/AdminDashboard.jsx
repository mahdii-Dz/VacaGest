"use client";

import { useState, useEffect } from "react";
import {
    Clock,
    CheckCircle2,
    XCircle,
    FileText,
    Search as SearchIcon,
    Eye,
    Check,
    X,
} from "lucide-react";


const fetchValidationData = async () => {
    // try{
    //     const response = await fetch('https://vacagest.onrender.com/api/files/',{
    //         headers:{
    //             'Content-Type': 'application/json',
    //         }
    //     });
    //     const data = await response.json();
    //     return data
    // }catch(err){
    //     console.error(err);
    // }
    return [
        {
            id: 1,
            initials: "JD",
            name: "Jean Dupont",
            subject: "Mathématiques",
            avatarColor: "bg-blue-600",
            ficheType: "Fiche pédagogique",
            month: "Novembre 2024",
            status: "En attente",
        },
        {
            id: 2,
            initials: "SM",
            name: "Sophie Martin",
            subject: "Physique",
            avatarColor: "bg-purple-600",
            ficheType: "Fiche mensuelle",
            month: "Octobre 2024",
            status: "En attente",
        },
        {
            id: 3,
            initials: "PB",
            name: "Pierre Bernard",
            subject: "Informatique",
            avatarColor: "bg-green-600",
            ficheType: "Fiche pédagogique",
            month: "Novembre 2024",
            status: "En attente",
        },
        {
            id: 4,
            initials: "AL",
            name: "Anne Laurent",
            subject: "Chimie",
            avatarColor: "bg-orange-600",
            ficheType: "Fiche mensuelle",
            month: "Novembre 2024",
            status: "En attente",
        },
        {
            id: 5,
            initials: "TD",
            name: "Thomas Dubois",
            subject: "Biologie",
            avatarColor: "bg-red-600",
            ficheType: "Fiche pédagogique",
            month: "Octobre 2024",
            status: "En attente",
        },
        {
            id: 6,
            initials: "CR",
            name: "Claire Rousseau",
            subject: "Économie",
            avatarColor: "bg-indigo-600",
            ficheType: "Fiche mensuelle",
            month: "Novembre 2024",
            status: "En attente",
        },
    ];
};

const fetchStatsData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [
        {
            id: 1,
            label: "En attente",
            value: "24",
            icon: <Clock size={20} />,
            bgColor: "bg-orange-100",
            textColor: "text-orange-600",
        },
        {
            id: 2,
            label: "Validées",
            value: "156",
            icon: <CheckCircle2 size={20} />,
            bgColor: "bg-green-100",
            textColor: "text-green-600",
        },
        {
            id: 3,
            label: "Rejetées",
            value: "8",
            icon: <XCircle size={20} />,
            bgColor: "bg-red-100",
            textColor: "text-red-600",
        },
        {
            id: 4,
            label: "Total",
            value: "188",
            icon: <FileText size={20} />,
            bgColor: "bg-blue-100",
            textColor: "text-blue-600",
        },
    ];
};

// ================================
// Validation Stats Section (Top Cards)
// ================================
export const ValidationListSection = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const loadStats = async () => {
            try {
                // ✅ Replace this with your real API endpoint
                const data = await fetchStatsData();
                setStats(data);
            } catch (error) {
                console.error("Failed to load stats:", error);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    if (loading) {
        return (
            <section className="flex items-start justify-center gap-6 w-full">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="flex-1 h-32 bg-gray-100 rounded-xl animate-pulse"
                    />
                ))}
            </section>
        );
    }

    return (
        <section className="flex items-start justify-center gap-6 w-full">
            {stats.map((stat) => (
                <article
                    key={stat.id}
                    className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm p-6"
                >
                    <div className="flex items-center gap-4">
                        <div className={`${stat.bgColor} p-2 rounded-lg`}>
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
    );
};

// ================================
// Validation Dashboard Table
// ================================
function AdminDashboard() {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // ✅ Replace this with your real API call, e.g.:
                // const res = await fetch('/api/validation-requests');
                // const data = await res.json();
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

    const handleView = (id) => {
        console.log("View:", id);
        // ✅ Add real navigation or modal logic here
    };

    const handleValidate = (id) => {
        console.log("Validate:", id);
        // ✅ Call API: PATCH /api/validation/${id} with { status: "approved" }
    };

    const handleReject = (id) => {
        console.log("Reject:", id);
        // ✅ Call API: PATCH /api/validation/${id} with { status: "rejected" }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= 3) {
            setCurrentPage(page);
        }
    };

    // Simple search filter (you can enhance with backend filtering)
    const filteredData = data.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ficheType.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
            <div>
                <h1 className="text-3xl font-bold">
                    Validation des fiches
                </h1>
                <p className="text-[#4B5563]">
                    Gérez et validez les fiches soumises par les vacataires                </p>
            </div>
            {/* Header */}
            <div className="bg-white rounded-xl w-full mt-6 shadow-Paragraph ring-1 ring-gray-200">

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
                            {filteredData.length > 0 ? (
                                filteredData.map((item, index) => (
                                    <tr key={item.id} className={index > 0 ? "border-t border-gray-200" : ""}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className={`${item.avatarColor} w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold`}>
                                                    {item.initials}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                    <div className="text-sm text-gray-500">{item.subject}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.ficheType}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.month}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 text-xs font-semibold text-orange-700 bg-orange-100 rounded-full">
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleView(item.id)}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                    aria-label={`Voir la fiche de ${item.name}`}
                                                >
                                                    <Eye size={12} />
                                                    Voir
                                                </button>
                                                <button
                                                    onClick={() => handleValidate(item.id)}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                                    aria-label={`Valider la fiche de ${item.name}`}
                                                >
                                                    <Check size={12} />
                                                    Valider
                                                </button>
                                                <button
                                                    onClick={() => handleReject(item.id)}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                                    aria-label={`Rejeter la fiche de ${item.name}`}
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
                <footer className="p-6 border-t border-gray-200 w-full">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Affichage de 1 à {filteredData.length} sur 24 fiches
                        </p>

                        <nav className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Page précédente"
                            >
                                Précédent
                            </button>

                            {[1, 2, 3].map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-2 text-sm font-medium rounded-lg ${currentPage === page
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                        }`}
                                    aria-label={`Page ${page}`}
                                    aria-current={currentPage === page ? "page" : undefined}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === 3}
                                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Page suivante"
                            >
                                Suivant
                            </button>
                        </nav>
                    </div>
                </footer>
            </div>
        </section>
    );
};
export default AdminDashboard