import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import Dashboard from "../pages/Dashboard";
import Employees from "../pages/Employees";
import Teams from "../pages/Teams";
import Projects from "../pages/Projects";
import ProjectDetails from "../pages/ProjectDetails";
import YourTasks from "../pages/YourTasks";
import Settings from "../pages/Settings";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const settings = useSelector((state) => state.settings);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="layout">
      <Header toggleSidebar={toggleSidebar} />
      <div className="main-container" style={{ display: 'flex' }}>
        {settings.sidebar.position === 'left' && (
          <Sidebar isOpen={isSidebarOpen} position="left" />
        )}
        <div className="content min-h-screen" style={{ flex: 1, padding: '1rem' }}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employee-list" element={<Employees />} />
          <Route path="/teams-list" element={<Teams />} />
          <Route path="/project-list" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/your-tasks" element={<YourTasks />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        </div>
        {settings.sidebar.position === 'right' && (
          <Sidebar isOpen={isSidebarOpen} position="right" />
        )}
      </div>
    </div>
  );
};

export default Layout;
