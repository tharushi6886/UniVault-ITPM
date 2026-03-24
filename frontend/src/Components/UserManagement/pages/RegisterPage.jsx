import React from "react";
import Navbar from "../../Homepage/Navbar";
import RegisterForm from "../components/RegisterForm";

const RegisterPage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#f3f0ff] via-[#f8f9ff] to-[#eef6ff] pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto min-h-[calc(100vh-8rem)] flex items-center justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center w-full">
            {/* Left content */}
            <div className="hidden lg:block">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-[#dcd8ff] text-[#4f46e5] text-sm font-semibold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                JOIN THE UNIVAULT COMMUNITY
              </span>

              <h1 className="mt-6 text-5xl font-bold leading-tight text-[#1f1b5b]">
                Create Your
                <span className="bg-gradient-to-r from-[#4f46e5] to-cyan-500 bg-clip-text text-transparent">
                  {" "}Account
                </span>
              </h1>

              <p className="mt-5 text-lg text-gray-500 leading-8 max-w-xl">
                Register to report lost items, claim found belongings, and access
                the university marketplace in one secure platform.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                <div className="bg-white/80 border border-[#e7e4ff] rounded-2xl p-4 shadow-sm">
                  <h3 className="font-semibold text-[#1f1b5b]">Secure Access</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Register with your details and access your personal dashboard.
                  </p>
                </div>

                <div className="bg-white/80 border border-[#e7e4ff] rounded-2xl p-4 shadow-sm">
                  <h3 className="font-semibold text-[#1f1b5b]">Campus Recovery</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage lost and found activities in one trusted place.
                  </p>
                </div>
              </div>
            </div>

            {/* Right form */}
            <RegisterForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;