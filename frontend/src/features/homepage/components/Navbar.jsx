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

  // Reload user on route change AND on custom "profile-updated" event
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

  const navClass = (path) =>
    `text-[13px] font-bold transition-all duration-300 font-epilogue cursor-pointer px-4 py-2 rounded-full ${
      isActive(path)
        ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50"
        : "text-slate-500 hover:text-indigo-600 hover:bg-slate-50"
    }`;

  const profileImageSrc = loggedUser?.profileImage
    ? loggedUser.profileImage.startsWith("http")
      ? loggedUser.profileImage
      : `http://localhost:5000${loggedUser.profileImage}`
    : null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[300] flex items-center justify-between px-8 lg:px-16 py-4 transition-all duration-500 ${
        scrolled
          ? "bg-white/85 backdrop-blur-2xl shadow-[0_10px_40px_rgba(79,70,229,0.08)] py-3 border-b border-indigo-50/50"
          : "bg-white/40 backdrop-blur-xl border-b border-white/40 shadow-[0_4px_30px_rgba(79,70,229,0.03)]"
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
          <button onClick={() => handleProtectedNavigation("/lost-items")} className={navClass("/lost-items")}>
            Lost Items
          </button>
        </li>
        <li>
          <button onClick={() => handleProtectedNavigation("/found-items")} className={navClass("/found-items")}>
            Found Items
          </button>
        </li>
        <li>
          <button onClick={() => handleProtectedNavigation("/marketplace")} className={navClass("/marketplace")}>
            Marketplace
          </button>
        </li>
        <li>
          <button onClick={() => handleProtectedNavigation("/bidding")} className={navClass("/bidding")}>
            Bidding
          </button>
        </li>
        <li>
          <button onClick={() => navigate("/about")} className={navClass("/about")}>
            About
          </button>
        </li>
      </ul>

      <div className="flex gap-4 items-center">
        {loggedUser ? (
          <div className="flex items-center gap-3">
            {/* Profile area with real image support */}
            <div
              onClick={handleProfile}
              className="group flex items-center gap-3 cursor-pointer bg-white/40 hover:bg-white/90 border border-[#818cf8]/20 hover:border-[#4f46e5]/40 pl-1.5 pr-4 py-1.5 rounded-full transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white shadow-md transition-transform group-hover:scale-105 shrink-0">
                {profileImageSrc ? (
                  <img
                    src={profileImageSrc}
                    alt={loggedUser.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                ) : null}
                <div
                  className="w-full h-full bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-inner flex items-center justify-center text-xs font-black text-white"
                  style={{ display: profileImageSrc ? 'none' : 'flex' }}
                >
                  {loggedUser.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[13px] font-bold text-[#1f1b5b] tracking-tight">{loggedUser.name}</span>
                <span className="text-[10px] font-medium text-[#4f46e5]/70">Verified User</span>
              </div>
            </div>

            {loggedUser.role === "Admin" && (
              <button
                onClick={() => navigate("/admin/dashboard")}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  isActive("/admin/dashboard")
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-indigo-100 text-indigo-700 hover:bg-indigo-600 hover:text-white"
                }`}
              >
                Admin Panel
              </button>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-[#4f46e5] hover:text-rose-600 text-[13px] font-bold px-4 py-2 bg-transparent hover:bg-rose-50 rounded-xl transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={handleLogin}
              className={`text-[13px] font-bold px-[20px] py-[8px] rounded-xl transition-all duration-300 ${
                isActive("/login")
                  ? "bg-indigo-50 border border-indigo-200 text-indigo-700 shadow-sm"
                  : "bg-white/80 backdrop-blur-md border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md"
              }`}
            >
              Login
            </button>

            <button
              onClick={handleRegister}
              className={`text-white text-[13px] font-black px-[24px] py-[9px] rounded-xl transition-all duration-300 cursor-pointer border-t border-white/20 shadow-[0_8px_20px_rgba(79,70,229,0.3)] hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(79,70,229,0.45)] ${
                isActive("/register")
                  ? "bg-gradient-to-br from-indigo-700 to-indigo-900 shadow-indigo-900/30"
                  : "bg-gradient-to-br from-indigo-500 to-indigo-700"
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
