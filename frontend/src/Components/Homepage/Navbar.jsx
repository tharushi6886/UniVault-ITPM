import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setLoggedUser(JSON.parse(user));
    }
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoggedUser(null);
    navigate("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[300] flex items-center justify-between px-16 py-4 transition-all duration-300 ${
        scrolled
          ? "bg-[#f0eeff]/95 shadow-[0_4px_32px_rgba(79,70,229,0.14)] py-3"
          : "bg-[#f0eeff]/80 backdrop-blur-xl border-b border-[#818cf8]/20 shadow-[0_2px_24px_rgba(79,70,229,0.08)]"
      }`}
    >
      <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/")}>
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-i2 to-cyan-500 flex items-center justify-center text-base shadow-[0_4px_14px_rgba(79,70,229,0.35)] shrink-0">
          🔍
        </div>
        <span className="text-[20px] font-bold text-text tracking-[-0.02em] font-clash">
          UniVault
        </span>
      </div>

      <ul className="flex gap-8 list-none m-0 p-0">
        {["Home", "Lost Items", "Found Items", "Marketplace", "Bidding", "About"].map((l) => (
          <li key={l}>
            <a
              href="#home"
              className="text-sm color-muted hover:text-i2 font-medium transition-colors font-epilogue"
            >
              {l}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex gap-2.5 items-center">
        {loggedUser ? (
          <>
            <span className="text-sm font-medium text-gray-700 font-epilogue">
              Hi, {loggedUser.name}
            </span>

            <button
              onClick={handleProfile}
              className="bg-white/70 border border-[#818cf8]/30 text-gray-700 text-sm font-epilogue font-medium px-[18px] py-2 rounded-[9px] cursor-pointer transition-all duration-200 hover:border-i3 hover:text-i2 hover:bg-[#eef2ff]/90"
            >
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="bg-gradient-to-br from-red-500 to-red-700 border-none text-white text-sm font-epilogue font-semibold px-[22px] py-[9px] rounded-lg shadow-[0_4px_14px_rgba(239,68,68,0.35)] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_6px_22px_rgba(239,68,68,0.48)] cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleLogin}
              className="bg-white/70 border border-[#818cf8]/30 text-gray-700 text-sm font-epilogue font-medium px-[18px] py-2 rounded-[9px] cursor-pointer transition-all duration-200 hover:border-i3 hover:text-i2 hover:bg-[#eef2ff]/90"
            >
              Login
            </button>

            <button
              onClick={handleRegister}
              className="bg-gradient-to-br from-[#4f46e5] to-[#3730a3] border-none text-white text-sm font-epilogue font-semibold px-[22px] py-[9px] rounded-lg shadow-[0_4px_14px_rgba(79,70,229,0.35)] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_6px_22px_rgba(79,70,229,0.48)] cursor-pointer"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;