import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const loadUser = () => {
    const user = localStorage.getItem("user");
    if (user) {
      setLoggedUser(JSON.parse(user));
    } else {
      setLoggedUser(null);
    }
  };

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    loadUser();
  }, [location.pathname]);

  useEffect(() => {
    const handleProfileUpdate = () => loadUser();
    window.addEventListener("profile-updated", handleProfileUpdate);
    return () => window.removeEventListener("profile-updated", handleProfileUpdate);
  }, []);

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
  const isHomePage = location.pathname === "/";
  const isProfilePage = location.pathname === "/profile";
  const isAdminPage = location.pathname.startsWith("/admin");
  const useSolidStyle = scrolled || (!isHomePage && !isProfilePage && !isAdminPage);

  const profileImageSrc = loggedUser?.profileImage
    ? loggedUser.profileImage.startsWith("http")
      ? loggedUser.profileImage
      : `http://localhost:5000${loggedUser.profileImage.startsWith('/') ? '' : '/'}${loggedUser.profileImage}`
    : null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[300] flex items-center justify-between px-8 lg:px-16 py-5 transition-all duration-700 ${
        useSolidStyle
          ? "bg-gradient-to-b from-white/95 via-white/92 to-white/85 backdrop-blur-2xl shadow-[0_15px_50px_-15px_rgba(79,134,239,0.15)] py-3.5 border-b border-indigo-500/15 text-slate-900"
          : "bg-transparent border-b border-transparent text-white"
      }`}
    >
      <div
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => navigate("/")}
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4A8EF0] via-[#4A8EF0] to-[#54DBC8] flex items-center justify-center text-base font-black shadow-[0_6px_20px_rgba(79,134,239,0.3)] shrink-0 text-white transform transition-transform group-hover:scale-105 group-hover:rotate-3">
          U
        </div>
        <span className={`text-[22px] font-black tracking-tight drop-shadow-sm transition-all duration-300 ${useSolidStyle ? 'text-slate-900' : 'text-white'}`}>
          UniVault
        </span>
      </div>

      <div className="hidden md:flex items-center flex-1 justify-center px-10">
        <div className={`flex items-center gap-10 p-1.5 px-12 rounded-2xl border transition-all duration-500 w-full max-w-5xl justify-center ${
          useSolidStyle 
            ? "bg-indigo-50/30 border-indigo-500/10 shadow-[inset_0_2px_10px_rgba(79,134,239,0.05)]" 
            : "bg-white/10 backdrop-blur-md border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]"
        }`}>
          {[
            { name: "Home", path: "/", protected: false },
            { name: "Lost Items", path: "/lost-items", protected: true },
            { name: "Found Items", path: "/found-items", protected: true },
            { name: "Marketplace", path: "/marketplace", protected: true },
            { name: "Bidding", path: "/bidding", protected: true },
            { name: "About", path: "/about", protected: false },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => item.protected ? handleProtectedNavigation(item.path) : navigate(item.path)}
              className={`relative px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-300 font-inter cursor-pointer z-10 whitespace-nowrap overflow-hidden group/navitem ${
                isActive(item.path)
                  ? (useSolidStyle ? "text-indigo-600 font-black" : "text-white font-black")
                  : (useSolidStyle ? "text-slate-500 hover:text-indigo-600" : "text-white/70 hover:text-white")
              }`}
            >
              {isActive(item.path) && (
                <motion.div
                  layoutId="active-nav-pill"
                  className={`absolute inset-0 rounded-xl z-0 ${
                    useSolidStyle ? "bg-white/80 shadow-md border border-indigo-500/10" : "bg-white/25 backdrop-blur-md border border-white/30"
                  }`}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 transition-transform group-hover/navitem:scale-105 inline-block">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-5 items-center">
        {loggedUser ? (
          <div className="flex items-center gap-5">
            <div
              onClick={handleProfile}
              title="View Profile"
              className="group relative flex items-center justify-center cursor-pointer transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-full overflow-hidden ring-4 ring-indigo-500/10 shadow-xl transition-all group-hover:scale-105 group-hover:ring-indigo-500/30 shrink-0">
                {profileImageSrc ? (
                  <img
                    src={profileImageSrc}
                    alt={loggedUser.name}
                    className="w-full h-full object-cover shadow-inner"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                ) : null}
                <div
                  className="w-full h-full bg-gradient-to-br from-[#4A8EF0] to-[#2c5ea2] shadow-inner flex items-center justify-center text-base font-black text-white"
                  style={{ display: profileImageSrc ? 'none' : 'flex' }}
                >
                  {loggedUser.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-lg z-10 transition-transform group-hover:scale-110"></div>
            </div>

            {loggedUser.role === "Admin" && (
              <button
                onClick={() => navigate("/admin/dashboard")}
                className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-400 transform hover:-translate-y-0.5 active:scale-95 ${
                  useSolidStyle
                    ? "bg-indigo-600 text-white shadow-[0_10px_25px_rgba(79,134,239,0.3)] hover:bg-indigo-700"
                    : "bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30"
                }`}
              >
                Admin Panel
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogin}
              className={`text-[13px] font-bold px-[22px] py-[10px] rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 ${
                isActive("/login")
                  ? (useSolidStyle ? "bg-slate-900 text-white shadow-lg" : "bg-white/30 border border-white/45 text-white shadow-lg")
                  : (useSolidStyle 
                      ? "bg-white border border-indigo-500/10 text-slate-700 hover:bg-indigo-50/50 hover:text-indigo-600 hover:border-indigo-500/30" 
                      : "bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/40")
              }`}
            >
              Login
            </button>

            <button
              onClick={handleRegister}
              className={`text-white text-[13px] font-black px-[26px] py-[11px] rounded-xl transition-all duration-400 cursor-pointer border-t border-white/40 shadow-[0_10px_25px_rgba(79,134,239,0.3)] hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(79,134,239,0.4)] active:scale-95 transform ${
                isActive("/register")
                  ? "bg-gradient-to-r from-[#53aaf2] to-[#2dd4bf] ring-2 ring-indigo-500/20"
                  : "bg-gradient-to-r from-[#6a8cff] to-[#48d6c2]"
              }`}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
