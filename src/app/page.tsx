"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import DashboardPage from "@/components/pages/DashboardPage";
import EmployeesPage from "@/components/pages/EmployeesPage";
import LeavePage from "@/components/pages/LeavePage";
import PayrollPage from "@/components/pages/PayrollPage";
import PerformancePage from "@/components/pages/PerformancePage";
import ReportsPage from "@/components/pages/ReportsPage";
import SettingsPage from "@/components/pages/SettingsPage";
import OffboardingPage from "@/components/pages/OffboardingPage";
import ProjectsPage from "@/components/pages/ProjectsPage";

const ACTION_MAP: Record<string, { label: string } | undefined> = {
  employees: { label: "Add Employee" },
  leave: { label: "Apply Leave" },
};

export default function Home() {
  const [page, setPage] = useState("dashboard");

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <DashboardPage onNavigate={setPage} />;
      case "employees": return <EmployeesPage />;
      case "leave": return <LeavePage />;
      case "payroll": return <PayrollPage />;
      case "performance": return <PerformancePage />;
      case "reports": return <ReportsPage />;
      case "settings": return <SettingsPage />;
      case "offboarding": return <OffboardingPage />;
      case "projects": return <ProjectsPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar active={page} onNavigate={setPage} />
      <div className="main-content">
        <Topbar page={page} />
        <main className="page-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
