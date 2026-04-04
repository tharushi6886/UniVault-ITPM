import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import PageTabs from "./PageTabs";

export default function AdminLayout({
  activeTab,
  setActiveTab,
  globalSearch,
  setGlobalSearch,
  children,
}) {
  return (
    <div className="min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Topbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        globalSearch={globalSearch}
        setGlobalSearch={setGlobalSearch}
      />

      <main className="pt-[70px] lg:ml-[260px]">
        <div className="max-w-[1340px] px-4 py-5 md:px-6 md:pb-10">
          <PageTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          {children}
        </div>
      </main>
    </div>
  );
}
