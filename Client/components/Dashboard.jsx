"use client";
import useLocalStorage from "@/components/useLocalStorage";
import { Calendar, Clock, FileText, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const StatusBadge = ({ status, color }) => {
  const colors = {
    Validée: { bg: "bg-green-100", text: "text-green-700" },
    "En attente": { bg: "bg-orange-100", text: "text-orange-700" },
    Rejetée: { bg: "bg-red-100", text: "text-red-700" },
  };

  return (
    <div className={`px-3 py-1 ${colors[status]?.bg || color.bg} rounded-full`}>
      <span
        className={`font-semibold text-xs ${
          colors[status]?.text || color.text
        }`}
      >
        {status}
      </span>
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
  const router = useRouter();

  useEffect(() => {
    if (isClient && !user) {
      router.push("/Login");
    }
  }, [isClient, user, router]);
  const handleLogout = () => {
    // Remove user data from localStorage
    removeUser();
    router.push("/Login");
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  // Get full name from user data
  const fullName = user ? `${user.fName} ${user.lName}`.trim() : "";

  // Get user role/status
  const userRole = user?.statue || user?.grade || "Vacataire";

  // Get specialty if available
  const userSpecialty = user?.specialty || "";

  return (
    <main className="w-full h-dvh ml-64 bg-[#F9FAFB] text-dashboard p-12 flex flex-col gap-8">
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
            <div className="py-1 px-3 text-[#15803D] bg-[#DCFCE7] w-fit rounded-full text-xs font-medium">
              Validée
            </div>
          </div>
          <p className="text-sm font-medium text-[#4B5563]">
            Fiche pédagogique
          </p>
          <h3 className="text-2xl font-bold">3/5</h3>
          <p className="text-sm font-medium text-[#4B5563]">
            3 validées, 2 en attente
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
          <h3 className="text-2xl font-bold">2/3</h3>
          <p className="text-sm font-medium text-[#4B5563]">
            2 validées, 1 en attente
          </p>
        </div>
        <div className="bg-white border border-[#E5E7EB] p-6 rounded-xl flex flex-col gap-2 shadow-boxShadow w-full">
          <div className="size-12 bg-[#E0E7FF] rounded-lg flex items-center justify-center">
            <Clock size={18} strokeWidth={2.5} className="text-[#4F46E5]" />
          </div>
          <p className="text-sm font-medium text-[#4B5563]">Total heures</p>
          <h3 className="text-2xl font-bold">156h</h3>
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
          <CardItem
            title="Fiche pédagogique - Mathématiques L1"
            date="Soumis le 15 Jan 2024"
            status="Validée"
            icon={FileText}
            iconColor="text-primary"
            bgColor="bg-blue-100"
          />

          <CardItem
            title="Fiche mensuelle - Janvier 2024"
            date="Soumis le 10 Jan 2024"
            status="En attente"
            icon={Calendar}
            iconColor="text-[#9333EA]"
            bgColor="bg-purple-100"
          />

          <CardItem
            title="Fiche pédagogique - Physique L2"
            date="Soumis le 08 Jan 2024"
            status="Rejetée"
            icon={FileText}
            iconColor="text-primary"
            bgColor="bg-blue-100"
          />
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
