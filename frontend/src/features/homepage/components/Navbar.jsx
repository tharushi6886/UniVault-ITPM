import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

  const navClass = (path) =>
    `text-[13px] font-bold transition-all duration-300 font-inter cursor-pointer px-5 py-2 rounded-xl relative group ${
      isActive(path)
        ? (useSolidStyle ? "text-indigo-600 bg-indigo-50/50" : "text-white bg-white/15")
        : (useSolidStyle ? "text-slate-500 hover:text-slate-900 hover:bg-slate-50" : "text-white/70 hover:text-white hover:bg-white/10")
    }`;

  const profileImageSrc = loggedUser?.profileImage
    ? loggedUser.profileImage.startsWith("http")
      ? loggedUser.profileImage
      : `http://localhost:5000${loggedUser.profileImage}`
    : null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[300] flex items-center justify-between px-8 lg:px-16 py-5 transition-all duration-500 ${
        useSolidStyle
          ? "bg-white/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] py-3.5 border-b border-black/5 text-slate-900"
          : "bg-transparent border-b border-transparent text-white"
      }`}
    >
      <div
        className="flex items-center gap-2.5 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#4A8EF0] to-[#54DBC8] flex items-center justify-center text-sm font-black shadow-[0_4px_14px_rgba(79,134,239,0.24)] shrink-0 text-white">
          U
        </div>
        <span className={`text-[20px] font-bold tracking-[-0.02em] drop-shadow-sm transition-colors duration-300 ${useSolidStyle ? 'text-slate-900' : 'text-white'}`}>
          UniVault
        </span>
      </div>

      <ul className="hidden md:flex gap-8 list-none m-0 p-0 items-center">
        <li><button onClick={() => navigate("/")} className={navClass("/")}>Home</button></li>
        <li><button onClick={() => handleProtectedNavigation("/lost-items")} className={navClass("/lost-items")}>Lost Items</button></li>
        <li><button onClick={() => handleProtectedNavigation("/found-items")} className={navClass("/found-items")}>Found Items</button></li>
        <li><button onClick={() => handleProtectedNavigation("/marketplace")} className={navClass("/marketplace")}>Marketplace</button></li>
        <li><button onClick={() => handleProtectedNavigation("/bidding")} className={navClass("/bidding")}>Bidding</button></li>
        <li><button onClick={() => navigate("/about")} className={navClass("/about")}>About</button></li>
      </ul>

      <div className="flex gap-4 items-center">
        {loggedUser ? (
          <div className="flex items-center gap-4">
            <div
              onClick={handleProfile}
              title="View Profile"
              className="group relative flex items-center justify-center cursor-pointer transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-indigo-500/20 shadow-lg transition-all group-hover:scale-105 group-hover:ring-indigo-500/50 shrink-0">
                {profileImageSrc ? (
                  <img
                    src={profileImageSrc}
                    alt={loggedUser.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                ) : null}
                <div
                  className="w-full h-full bg-gradient-to-br from-[#4A8EF0] to-[#2c5ea2] shadow-inner flex items-center justify-center text-sm font-black text-white"
                  style={{ display: profileImageSrc ? 'none' : 'flex' }}
                >
                  {loggedUser.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              
              {/* Subtle Online Dot */}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm z-10 transition-transform group-hover:scale-110"></div>
            </div>

            {loggedUser.role === "Admin" && (
              <button
                onClick={() => navigate("/admin/dashboard")}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  isActive("/admin/dashboard")
                    ? "bg-[#4A8EF0] text-white shadow-[0_8px_20px_rgba(79,134,239,0.24)]"
                    : "bg-white/18 text-white hover:bg-white/28 hover:text-white"
                }`}
              >
                Admin Panel
              </button>
            )}
          </div>
        ) : (
          <>
            <button
              onClick={handleLogin}
              className={`text-[13px] font-bold px-[20px] py-[8px] rounded-xl transition-all duration-300 ${
                isActive("/login")
                  ? (useSolidStyle ? "bg-slate-900 text-white shadow-sm" : "bg-white/30 border border-white/45 text-white shadow-sm")
                  : (useSolidStyle 
                      ? "bg-transparent border border-slate-200 text-slate-700 hover:border-indigo-600 hover:text-indigo-600" 
                      : "bg-transparent border border-white/24 text-white/90 hover:border-cyan-200/60 hover:text-white hover:shadow-[0_4px_14px_rgba(103,232,249,0.12)]")
              }`}
            >
              Login
            </button>

            <button
              onClick={handleRegister}
              className={`text-white text-[13px] font-black px-[24px] py-[9px] rounded-xl transition-all duration-300 cursor-pointer border-t border-white/30 shadow-[0_8px_20px_rgba(56,189,248,0.22)] hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(56,189,248,0.32)] ${
                isActive("/register")
                  ? "bg-gradient-to-r from-[#53aaf2] to-[#2dd4bf] shadow-sky-900/20"
                  : "bg-gradient-to-r from-[#6a8cff] to-[#48d6c2]"
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
