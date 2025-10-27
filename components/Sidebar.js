"use client";
import { useState } from "react";
import { LogoutLink, useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const mainRoutes = [
    { path: "reportform", name: "Report Injured Animal" },
    { path: "viewrescuerequest", name: "View Rescue Request", requiresAuth: true },
    { path: "rescuehistory", name: "Rescue History", requiresAuth: true },
    { path: "rescueupdates", name: "Rescue Updates", requiresAuth: true },
];

export default function Sidebar({ setSelectedFeature }) {
    const { user, isAuthenticated, isLoading } = useKindeBrowserClient();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Hamburger Button for Mobile */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-900 text-white rounded"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Menu */}
            <aside className={`fixed inset-y-0 left-0 bg-zinc-900 text-white w-64 p-4 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 md:relative md:flex md:w-64 lg:w-80 flex-col justify-between min-h-screen`}>
                <ul className="text-center flex flex-col gap-2 flex-grow">
                    {mainRoutes.map(({ path, name, requiresAuth }) => {
                        if (requiresAuth && !isAuthenticated) {
                            return null; // Hide auth-required links if user is not logged in
                        }
                        return (
                            <li key={path}>
                                <button
                                    className="py-3 px-5 block w-full text-left hover:bg-zinc-800 rounded-md transition"
                                    onClick={() => setSelectedFeature(path)} // Ensure Dashboard uses same key
                                >
                                    {name}
                                </button>
                            </li>
                        );
                    })}
                </ul>

                {/* User Info & Logout */}
                <div className="flex flex-col items-center mt-80">
                    {isLoading && (
                        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-white/50"></div>
                    )}

                    {user?.picture && (
                        <Image src={user?.picture} alt="Profile picture" width={50} height={50} className="rounded-full my-2" />
                    )}

                    {user?.email && (
                        <p className="text-center text-xs mb-3">
                            Logged in as {user?.email}
                        </p>
                    )}

                    {isAuthenticated && (
                        <LogoutLink className="py-3 px-5 text-center hover:bg-zinc-800 rounded-md w-full transition">
                            Log out
                        </LogoutLink>
                    )}
                </div>
            </aside>
        </>
    );
}
