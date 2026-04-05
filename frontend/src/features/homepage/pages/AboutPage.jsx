import React from "react";
import Navbar from "../components/Navbar";

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#f3f0ff] via-[#f8f9ff] to-[#eef6ff] pt-32">
        {/* Hero Section */}
        <section className="px-4 md:px-8 py-16 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-[#1f1b5b] mb-6 tracking-tight">
              About <span className="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] bg-clip-text text-transparent">UniVault</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Connecting campus communities through trusted lost & found services and secure marketplace solutions.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="px-4 md:px-8 py-16 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#1f1b5b] mb-6">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                UniVault is dedicated to creating a safer, more connected campus community by providing intelligent solutions for lost item recovery and secure peer-to-peer transactions.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                We believe that every lost item has a story, and every student deserves the peace of mind that comes from knowing their belongings are recoverable through a trusted, community-driven platform.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] rounded-3xl p-12 text-white shadow-lg">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-4">Campus-Centric</h3>
              <p className="text-white/90">
                Built specifically for university communities, understanding the unique challenges students face with lost items and secure transactions.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="px-4 md:px-8 py-16 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-[#1f1b5b] text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🛡️",
                title: "Trust & Security",
                description: "We prioritize the safety and security of our users and their belongings through verified accounts and secure transactions.",
              },
              {
                icon: "🤝",
                title: "Community First",
                description: "Our platform thrives on community engagement and cooperation. We're building a network where students help students.",
              },
              {
                icon: "🚀",
                title: "Innovation",
                description: "Using AI-powered matching and intelligent algorithms to connect lost items with their rightful owners faster than ever.",
              },
            ].map((value, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 border border-[#e9e7ff] shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-2xl font-bold text-[#1f1b5b] mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 md:px-8 py-16 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-[#1f1b5b] text-center mb-12">Why Choose UniVault?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Smart Matching System",
                description: "Our AI-powered algorithm matches lost items with found ones based on location, time, description, and category.",
              },
              {
                title: "Secure Marketplace",
                description: "Buy and sell items safely within the campus community with verified user profiles and secure payment options.",
              },
              {
                title: "Real-Time Notifications",
                description: "Get instant alerts when items matching your reports are found, or when someone is interested in your listings.",
              },
              {
                title: "Community Reputation",
                description: "Build trust through ratings and reviews. The more you help others recover their items, the higher your reputation.",
              },
              {
                title: "Campus Integration",
                description: "Seamlessly integrated with your university community. Find items reported by your classmates across all campus locations.",
              },
              {
                title: "24/7 Support",
                description: "Our dedicated support team is always ready to help you recover your lost items or resolve any marketplace concerns.",
              },
            ].map((feature, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#4f46e5]/10">
                    <svg
                      className="h-6 w-6 text-[#4f46e5]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1f1b5b] mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-4 md:px-8 py-16 max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold text-center mb-12">Our Impact</h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { stat: "10K+", label: "Active Users" },
                { stat: "5K+", label: "Items Recovered" },
                { stat: "98%", label: "Satisfaction Rate" },
                { stat: "24/7", label: "Support Available" },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="text-5xl font-bold mb-2 text-[#e9d5ff]">{item.stat}</div>
                  <p className="text-white/80 text-lg">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="px-4 md:px-8 py-16 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-[#1f1b5b] text-center mb-12">Dedicated Team</h2>
          <p className="text-gray-600 text-center text-lg max-w-2xl mx-auto mb-12">
            UniVault is built and maintained by passionate developers and designers committed to making campus life better for every student.
          </p>
          <div className="bg-white rounded-2xl border border-[#e9e7ff] p-12 text-center">
            <p className="text-gray-600 mb-6">
              Our team works tirelessly to ensure that your experience on UniVault is seamless, secure, and rewarding. From feature development to customer support, we're here for you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {["Development", "Design", "Community", "Support"].map((role, idx) => (
                <span
                  key={idx}
                  className="bg-[#4f46e5]/10 text-[#4f46e5] px-6 py-2 rounded-full font-semibold"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 md:px-8 py-16 max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#1f1b5b] mb-6">Join the UniVault Community</h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Whether you've lost something precious or want to help others recover theirs, UniVault is the place to connect and make your campus community safer.
          </p>
          <button className="bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            Get Started Now
          </button>
        </section>

        {/* Footer Spacing */}
        <div className="h-16"></div>
      </div>
    </>
  );
};

export default AboutPage;
