"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { LogOut, User, Home, LayoutDashboard } from "lucide-react";

interface DashboardPageProps {
  userEmail: string;
}

export default function DashboardPage({ userEmail }: DashboardPageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const asideRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen &&
        asideRef.current &&
        !asideRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="flex h-screen relative">
      <aside
        ref={asideRef}
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:flex-shrink-0`}
      >
        <div className="flex flex-col h-full p-4">
          <h2 className="text-2xl font-bold mb-8">Menusto</h2>
          <nav className="flex flex-col space-y-4 flex-grow">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700"
            >
              <Home className="w-5 h-5" /> Accueil
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700"
            >
              <LayoutDashboard className="w-5 h-5" /> Tableau de bord
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700"
            >
              <User className="w-5 h-5" /> Profil
            </Link>
          </nav>
          <button className="mt-auto flex items-center gap-2 px-3 py-2 bg-red-600 rounded hover:bg-red-700 transition">
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      <div className="flex flex-col flex-grow ml-0 md:ml-64 w-full">
        <header className="flex items-center justify-between p-4 bg-gray-800 text-white md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded hover:bg-gray-700"
            aria-label="Toggle navigation"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
          <span className="font-bold">Tableau de bord</span>
          <div></div>
        </header>

        <main className="flex flex-col justify-center items-center flex-grow gap-12 bg-background p-6">
          <div className="max-w-xl w-full space-y-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Tableau de bord
            </h1>
            <p className="text-lg">Bienvenue, {userEmail} !</p>
          </div>
        </main>
      </div>
    </div>
  );
}
