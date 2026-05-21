"use client";
import React, { useState } from "react";
import { LogoutLink, useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Image from "next/image";
import { Menu, X, ClipboardList, History, Hospital, Users } from "lucide-react";

const adminRoutes = [
  { path: "allreports", name: "All Reports", icon: <ClipboardList size={18} /> },
  { path: "rescuehistory", name: "Rescue History", icon: <History size={18} /> },
  { path: "hospitals", name: "Manage Hospitals", icon: <Hospital size={18} /> },
  { path: "users", name: "Manage Users", icon: <Users size={18} /> },
];

export default function AdminSidebar({ setSelectedFeature, activeFeature }) {
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();
  const [isOpen, setIsOpen] = useState(false);

  React.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30" onClick={() => setIsOpen(false)} />
      )}

      {/* Hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-zinc-900 text-white rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 md:z-auto bg-zinc-900 text-white w-64 lg:w-72 p-4 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 md:relative md:flex flex-col min-h-screen`}>

        {/* Logo */}
        <div className="flex items-center gap-2 px-2 py-4 mb-4 border-b border-zinc-700">
          <span className="text-2xl">⚙️</span>
          <div>
            <span className="font-bold text-lg tracking-tight">VetReach</span>
            <p className="text-xs text-zinc-400">Admin Portal</p>
          </div>
        </div>

        {/* Nav Links */}
        <ul className="flex flex-col gap-1 flex-grow">
          {adminRoutes.map(({ path, name, icon }) => {
            if (!isAuthenticated) return null;
            const isActive = activeFeature === path;
            return (
              <li key={path}>
                <button
                  className={`flex items-center gap-3 py-3 px-4 w-full text-left rounded-xl transition text-sm font-medium ${
                    isActive
                      ? "bg-purple-600 text-white"
                      : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  }`}
                  onClick={() => {
                    setSelectedFeature(path);
                    setIsOpen(false);
                  }}
                >
                  {icon}
                  {name}
                </button>
              </li>
            );
          })}
        </ul>

        {/* User Info & Logout */}
        <div className="flex flex-col items-center border-t border-zinc-700 pt-4 mt-4">
          {isLoading && <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-white/50 mb-2"></div>}
          {user?.picture && <Image src={user?.picture} alt="Profile" width={44} height={44} className="rounded-full mb-2" />}
          {user?.email && <p className="text-center text-xs text-zinc-400 mb-3 truncate w-full px-2">{user?.email}</p>}
          {isAuthenticated && (
            <LogoutLink className="py-2.5 px-5 text-center text-sm hover:bg-zinc-800 rounded-xl w-full transition text-zinc-300 hover:text-white">
              Log out
            </LogoutLink>
          )}
        </div>
      </aside>
    </>
  );
}