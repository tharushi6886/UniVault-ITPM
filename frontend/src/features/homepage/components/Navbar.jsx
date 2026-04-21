import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', fn);
        return () => window.removeEventListener('scroll', fn);
    }, []);

    const navLinks = [
        { name: 'Home', path: '#home', isScroll: true },
        { name: 'Lost Items', path: '#lost', isScroll: true },
        { name: 'Found Items', path: '#found', isScroll: true },
        { name: 'Marketplace', path: '/marketplace', isScroll: false },
        { name: 'Bidding', path: '/bidding', isScroll: false },
        { name: 'About', path: '#about', isScroll: true }
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[300] flex items-center justify-between px-16 py-4 transition-all duration-300 ${scrolled
            ? 'bg-[#f0eeff]/95 shadow-[0_4px_32px_rgba(79,70,229,0.14)] py-3'
            : 'bg-[#f0eeff]/80 backdrop-blur-xl border-b border-[#818cf8]/20 shadow-[0_2px_24px_rgba(79,70,229,0.08)]'
            }`}>
            <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-i2 to-cyan-500 flex items-center justify-center text-base shadow-[0_4px_14px_rgba(79,70,229,0.35)] shrink-0">
                    🔍
                </div>
                <span className="text-[20px] font-bold text-text tracking-[-0.02em] font-clash">
                    UniVault
                </span>
            </div>
            <ul className="flex gap-8 list-none m-0 p-0">
                {navLinks.map(l => (
                    <li key={l.name}>
                        {l.isScroll ? (
                            <a href={l.path} className="text-sm color-muted hover:text-i2 font-medium transition-colors font-epilogue">
                                {l.name}
                            </a>
                        ) : (
                            <Link to={l.path} className="text-sm color-muted hover:text-i2 font-medium transition-colors font-epilogue">
                                {l.name}
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
            <div className="flex gap-2.5 items-center">
                <button className="bg-white/70 border border-[#818cf8]/30 text-gray-700 text-sm font-epilogue font-medium px-[18px] py-2 rounded-[9px] cursor-pointer transition-all duration-200 hover:border-i3 hover:text-i2 hover:bg-[#eef2ff]/90">
                    Login
                </button>
                <button className="bg-gradient-to-br from-[#4f46e5] to-[#3730a3] border-none text-white text-sm font-epilogue font-semibold px-[22px] py-[9px] rounded-lg shadow-[0_4px_14px_rgba(79,70,229,0.35)] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_6px_22px_rgba(79,70,229,0.48)] cursor-pointer">
                    Sign Up
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setLoggedUser(JSON.parse(user));
    } else {
      setLoggedUser(null);
    }
  }, [location.pathname]);

  const handleLogin = () => navigate("/login");
  const handleRegister = () => navigate("/register");
  const handleProfile = () => navigate("/profile");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoggedUser(null);
    navigate("/");
    window.location.reload();
  };

  const handleProtectedNavigation = (path) => {
    if (loggedUser) {
      navigate(path);
    } else {
      toast.info("Please login to access this feature");
      navigate("/login");
    }
  };

  const isActive = (path) => location.pathname === path;

  const navClass = (path) =>
    `text-sm font-medium transition-all duration-200 font-epilogue cursor-pointer ${
      isActive(path)
        ? "text-[#4f46e5] border-b-2 border-[#4f46e5] pb-1"
        : "text-gray-700 hover:text-[#4f46e5]"
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[300] flex items-center justify-between px-8 lg:px-16 py-4 transition-all duration-300 ${
        scrolled
          ? "bg-[#f0eeff]/95 shadow-[0_4px_32px_rgba(79,70,229,0.14)] py-3"
          : "bg-[#f0eeff]/80 backdrop-blur-xl border-b border-[#818cf8]/20 shadow-[0_2px_24px_rgba(79,70,229,0.08)]"
      }`}
    >
      <div
        className="flex items-center gap-2.5 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#4f46e5] to-cyan-500 flex items-center justify-center text-base shadow-[0_4px_14px_rgba(79,70,229,0.35)] shrink-0">
          🔎
        </div>
        <span className="text-[20px] font-bold text-[#1f1b5b] tracking-[-0.02em]">
          UniVault
        </span>
      </div>

      <ul className="hidden md:flex gap-8 list-none m-0 p-0 items-center">
        <li>
          <button onClick={() => navigate("/")} className={navClass("/")}>
            Home
          </button>
        </li>

        <li>
          <button
            onClick={() => handleProtectedNavigation("/lost-items")}
            className={navClass("/lost-items")}
          >
            Lost Items
          </button>
        </li>

        <li>
          <button
            onClick={() => handleProtectedNavigation("/found-items")}
            className={navClass("/found-items")}
          >
            Found Items
          </button>
        </li>

        <li>
          <button
            onClick={() => handleProtectedNavigation("/marketplace")}
            className={navClass("/marketplace")}
          >
            Marketplace
          </button>
        </li>

        <li>
          <button
            onClick={() => handleProtectedNavigation("/bidding")}
            className={navClass("/bidding")}
          >
            Bidding
          </button>
        </li>

        <li>
          <button
            onClick={() => navigate("/about")}
            className={navClass("/about")}
          >
            About
          </button>
        </li>
      </ul>

      <div className="flex gap-2.5 items-center">
        {loggedUser ? (
          <>
            <span className="hidden lg:block text-sm font-medium text-gray-700">
              Hi, {loggedUser.name}
            </span>

            {loggedUser.role === "Admin" && (
              <button
                onClick={() => navigate("/admin/dashboard")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive("/admin/dashboard")
                    ? "bg-blue-600 text-white"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Admin Panel
              </button>
            )}

            <button
              onClick={handleProfile}
              className={`border text-sm font-medium px-[18px] py-2 rounded-[9px] transition-all duration-200 ${
                isActive("/profile")
                  ? "bg-[#eef2ff] border-[#4f46e5] text-[#4f46e5]"
                  : "bg-white/70 border border-[#818cf8]/30 text-gray-700 hover:border-[#4f46e5] hover:text-[#4f46e5] hover:bg-[#eef2ff]/90"
              }`}
            >
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="bg-gradient-to-br from-red-500 to-red-700 border-none text-white text-sm font-semibold px-[22px] py-[9px] rounded-lg shadow-[0_4px_14px_rgba(239,68,68,0.35)] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_6px_22px_rgba(239,68,68,0.48)] cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleLogin}
              className={`border text-sm font-medium px-[18px] py-2 rounded-[9px] transition-all duration-200 ${
                isActive("/login")
                  ? "bg-[#eef2ff] border-[#4f46e5] text-[#4f46e5]"
                  : "bg-white/70 border border-[#818cf8]/30 text-gray-700 hover:border-[#4f46e5] hover:text-[#4f46e5] hover:bg-[#eef2ff]/90"
              }`}
            >
              Login
            </button>

            <button
              onClick={handleRegister}
              className={`text-white text-sm font-semibold px-[22px] py-[9px] rounded-lg transition-all duration-200 cursor-pointer ${
                isActive("/register")
                  ? "bg-gradient-to-br from-[#4338ca] to-[#312e81] shadow-[0_6px_22px_rgba(79,70,229,0.48)]"
                  : "bg-gradient-to-br from-[#4f46e5] to-[#3730a3] shadow-[0_4px_14px_rgba(79,70,229,0.35)] hover:-translate-y-[1px] hover:shadow-[0_6px_22px_rgba(79,70,229,0.48)]"
              }`}
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
