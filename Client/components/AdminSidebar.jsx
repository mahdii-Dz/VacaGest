"use client";
import useLocalStorage from "@/components/useLocalStorage";
import {
    Check,
  House,
  LogOut,
  Settings,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

function SideBar() {
  const [user, , removeUser, isClient] = useLocalStorage("userData");
  const router = useRouter();
  const pathname = usePathname(); 

  useEffect(() => {
    if (isClient && !user) {
      router.push("/Login");
    }
  }, [isClient, user, router]);

  const handleLogout = () => {
    removeUser();
    router.push("/Login");
  };

  // ✅ Derive active page from URL (more reliable!)
  let activePage = "";
  if (pathname === "/Admin/Dashboard") {
    activePage = "AdminDashboard";
  }

  // User data
  const fullName = user ? `${user.fName} ${user.lName}`.trim() : "";
  const userRole = user?.statue || user?.grade || "Vacataire";
  const userSpecialty = user?.specialty || "";

  // Helper to check active state
  const isActive = (page) => activePage === page;

  return (
    <aside className="w-64 h-dvh flex flex-col border-r border-[#E5E7EB] items-center fixed top-0 left-0 bg-white">
      <div className="w-full p-6 gap-1 border-b border-[#E5E7EB]">
        <h2 className="text-2xl font-bold text-primary">Vaca Gest</h2>
        <p className="text-sm text-[#6B7280]">Vacataires Management</p>
      </div>

      <div className="flex flex-col flex-1 w-full justify-start p-4 gap-2">
        {/* Dashboard */}
        <Link
          href="/Admin/Dashboard"
          className={`flex justify-start w-full py-3 px-4 items-center h-fit rounded-lg gap-3 ${
            isActive("AdminDashboard") ? "bg-primary" : "hover:bg-gray-100"
          }`}
        >
          <Check
            size={18}
            strokeWidth={2.5}
            className={isActive("AdminDashboard") ? "text-white" : "text-Paragraph"}
          />
          <p
            className={`text-sm font-medium ${
              isActive("AdminDashboard") ? "text-white" : "text-Paragraph"
            }`}
          >
            Validation
          </p>
        </Link>
        {/* Settings */}
        <Link
          href="/Settings"
          className="flex justify-start w-full py-3 px-4 items-center h-fit rounded-lg gap-3 cursor-pointer hover:bg-gray-100"
        >
          <Settings size={18} strokeWidth={2.5} className="text-Paragraph" />
          <p className="text-sm font-medium text-Paragraph">Paramètres</p>
        </Link>
      </div>

      <div className="w-full p-6 gap-1 border-t border-[#E5E7EB]">
        <div className="flex gap-3 justify-start items-center">
          <Image
            src="/profile.svg"
            width={40}
            height={40}
            alt="profile picture"
          />
          <div>
            <h3 className="text-sm font-medium text-primary-text">
              {fullName || "Utilisateur"}
            </h3>
            <p className="text-xs text-[#6B7280]">
              {userRole}
              {userSpecialty && ` • ${userSpecialty}`}
            </p>
          </div>
        </div>
        <div
          onClick={handleLogout}
          className="flex justify-center items-center mt-4 gap-3 cursor-pointer"
        >
          <LogOut size={14} strokeWidth={2.5} />
          <p className="text-sm text-primary-text">Déconnexion</p>
        </div>
      </div>
    </aside>
  );
}

export default SideBar;