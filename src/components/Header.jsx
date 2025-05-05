import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Usamos el contexto que ya tienes
import { useNavigate } from "react-router-dom";

export default function Header({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // o donde quieras redirigir después de cerrar sesión
  };

  return (
    <header className="bg-primary text-white flex items-center px-6 py-1 shadow-md h-16 relative">

      {/* Botón hamburguesa */}
      <button
        className="text-black focus:outline-none hover:text-[var(--color-dark)] cursor-pointer" 
        onClick={toggleSidebar}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Perfil de usuario */}
      <div className="ml-auto relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 focus:outline-none"
        >
          <img
            src="/assets/fotoPerfil.png" // Cambia esto por la ruta de tu imagen de perfil
            alt="Perfil"
            className="h-10 w-10 rounded-full"
          />
          <span className="text-black font-semibold">{user?.email || "Usuario"}</span>
        </button>

        {/* Dropdown */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                navigate("/perfil"); // Redirigir a página de perfil
              }}
              className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100"
            >
              Ver Perfil
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100"
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
