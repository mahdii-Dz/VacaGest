"use client";
import useLocalStorage from "@/components/useLocalStorage";
import { fetchWithCache } from "@/utils/cachedFetch";
import { Calendar, Clock, FileText, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const StatusBadge = ({ status, color }) => {
  const colors = {
    validated: { bg: "bg-green-100", text: "text-green-700" },
    pending: { bg: "bg-orange-100", text: "text-orange-700" },
    rejected: { bg: "bg-red-100", text: "text-red-700" },
  };

  return (
    <div className={`px-3 ${colors[status]?.bg} py-1 rounded-full font-semibold text-xs ${colors[status]?.text || color?.text
      }`}>
      {
        status === "validated" ? "Validée" : status === "pending" ? "En attente" : status === "rejected" ? "Rejetée" : ""
      }
    </div>
  );
};

const CardItem = ({
  title,
  date,
  status,
  icon: Icon,
  iconColor = "text-primary",
  bgColor = "bg-blue-100",
}) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-4">
      <div
        className={`flex w-10 h-10 items-center justify-center ${bgColor} rounded-lg`}
      >
        <Icon size={20} strokeWidth={2.5} className={iconColor} />
      </div>
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
    </div>
    <StatusBadge status={status} />
  </div>
);



function Dashboard() {
  const [user, setUser, removeUser, isClient] = useLocalStorage("userData");
  const [FichePedagogiqueData, setFichePedagogiqueData] = useState([]);
  const [FicheMensuelleData, setFicheMensuelleData] = useState([]);
  const [AllFilesData, setAllFilesData] = useState([]);
  const router = useRouter();

  function formatDate(dateString) {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return `Soumis le ${formattedDate}`;
  }
  

  useEffect(() => {
    if (!isClient) return
    async function fetchFilesData() {
      try {
        const cacheKey = `pedagogique-${user._id}`;
        const url = `https://vacagest.onrender.com/api/files?vacataireId=${user._id}`;
        const data = await fetchWithCache(cacheKey, url);
        setAllFilesData(data || []);
        const pedagogicalFiles = data.filter(file => file.metadata.type === "pedagogique");
        setFichePedagogiqueData(pedagogicalFiles || null);
        const monthlyFiles = data.filter(file => file.metadata.type === "mensuelle");
        setFicheMensuelleData(monthlyFiles || null);
      } catch (error) {
        console.error("Erreur lors de la récupération des données des fichiers :", error);
      }
    }
    fetchFilesData()
  }, [isClient, user?._id])
  const ValidatedFicheMensuelle = FicheMensuelleData.filter(file => file?.metadata.status === "validated");
  const pendingFicheMensuelle = FicheMensuelleData.filter(file => file?.metadata.status === "pending");

  console.log(AllFilesData);


  useEffect(() => {
    if (isClient && !user) {
      router.push("/Login");
    }
  }, [isClient, user, router]);


  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  // Get full name from user data
  const fullName = user ? `${user.fName} ${user.lName}`.trim() : "";


  return (
    <main className="w-full h-dvh ml-64 bg-[#F9FAFB] text-dashboard p-12 flex flex-col gap-8 mb-12">
      <div>
        <h1 className="text-3xl font-bold">
          Bienvenue, {fullName || "Utilisateur"}
        </h1>
        <p className="text-[#4B5563]">
          Voici un aperçu de vos activités et documents
        </p>
      </div>
      <div className="flex items-center justify-between w-full gap-6">
        <div className="bg-white border border-[#E5E7EB] p-6 rounded-xl flex flex-col gap-2 shadow-boxShadow w-full">
          <div className="flex justify-between items-center">
            <div className="size-12 bg-[#DBEAFE] rounded-lg flex items-center justify-center">
              <FileText size={18} strokeWidth={2.5} className="text-primary" />
            </div>
            <StatusBadge status={FichePedagogiqueData[0]?.metadata.status} />
          </div>
          <p className="text-sm font-medium text-[#4B5563]">
            Fiche pédagogique
          </p>
          <h3 className="text-2xl font-bold">
            {
              FichePedagogiqueData.length
            }
          </h3>
          <p className="text-sm font-medium text-[#4B5563] ">
            {
              FichePedagogiqueData[0]?.metadata.status === "pending" ? "En attente de validation" : FichePedagogiqueData[0]?.metadata.status === "rejected" ? "Rejetée" : "Validée"
            }
          </p>
        </div>
        <div className="bg-white border border-[#E5E7EB] p-6 rounded-xl flex flex-col gap-2 shadow-boxShadow w-full">
          <div className="flex justify-between items-center">
            <div className="size-12 bg-[#F3E8FF] rounded-lg flex items-center justify-center">
              <Calendar
                size={18}
                strokeWidth={2.5}
                className="text-[#9333EA]"
              />
            </div>
            <div className="py-1 px-3 text-[#C2410C] bg-[#FFEDD5] w-fit rounded-full text-xs font-medium">
              En attente
            </div>
          </div>
          <p className="text-sm font-medium text-[#4B5563]">Fiche mensuelle</p>
          <h3 className="text-2xl font-bold">
            {ValidatedFicheMensuelle.length}/{FicheMensuelleData.length}
          </h3>
          <p className="text-sm font-medium text-[#4B5563]">
            {ValidatedFicheMensuelle.length} validées, {pendingFicheMensuelle.length} en attente
          </p>
        </div>
        <div className="bg-white border border-[#E5E7EB] p-6 rounded-xl flex flex-col gap-2 shadow-boxShadow w-full">
          <div className="size-12 bg-[#E0E7FF] rounded-lg flex items-center justify-center">
            <Clock size={18} strokeWidth={2.5} className="text-[#4F46E5]" />
          </div>
          <p className="text-sm font-medium text-[#4B5563]">Total heures</p>
          <h3 className="text-2xl font-bold">
            {
              FichePedagogiqueData.length === 0 ? `0 h` : `${FichePedagogiqueData[0]?.metadata.hours} h`
            }
            
            </h3>
          <p className="text-sm font-medium text-[#4B5563]">
            Ce semestre académique
          </p>
        </div>
      </div>
      <div className="w-full rounded-xl p-6 bg-white flex flex-col gap-4 shadow-boxShadow border border-[#E5E7EB]">
        <h3 className="text-lg font-semibold">Actions rapides</h3>
        <div className="w-full flex justify-between gap-7.5 items-center">
          <div className="w-full py-4 bg-primary  rounded-lg text-white cursor-pointer">
            <Link
              href={"/Dashboard/Fiches-pedagogiques"}
              className="flex justify-center items-center gap-2"
            >
              <Plus size={20} strokeWidth={2.5} />
              <span>Nouvelle fiche pédagogique</span>
            </Link>
          </div>
          <div className="w-full py-4 bg-[#9333EA] rounded-lg text-white cursor-pointer">
            <Link
              href={"/Dashboard/Fiches-mensuelles"}
              className="flex justify-center items-center gap-2"
            >
              <Plus size={20} strokeWidth={2.5} />
              <span>Nouvelle fiche mensuelle</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full rounded-xl p-6 bg-white flex flex-col gap-4 shadow-boxShadow border border-[#E5E7EB]">
        <h3 className="text-lg font-semibold">Documents récents</h3>
        <div className="flex flex-col gap-4">
          {
            AllFilesData.slice(-3).reverse().map((file) => (
              <CardItem
                key={file._id}
                title={file.metadata.Name}
                date={formatDate(file.uploadDate)}
                status={file.metadata.status}
                icon={file.metadata.type === "pedagogique" ? FileText : Calendar}
                iconColor={file.metadata.type === "pedagogique" ? "text-primary" : "text-purple-600"}
                bgColor={file.metadata.type === "pedagogique" ? "bg-blue-100" : "bg-purple-100"}
              />
            ))
          }

        </div>
      </div>
    </main>
  );
}

export default Dashboard;
