const tabs = [
  { key: "overview", label: "📊 Overview" },
  { key: "ads", label: "📋 Advertisements" },
  { key: "notifications", label: "🔔 Notifications" },
];

export default function PageTabs({ activeTab, setActiveTab }) {
  return (
    <div className="mb-[18px] flex gap-1 border-b-2 border-indigo-300/20 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`tab-btn whitespace-nowrap ${activeTab === tab.key ? "tab-btn-active" : ""}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}