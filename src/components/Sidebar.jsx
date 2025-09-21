import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/redux_slices/authSlice";
import { resetTheme } from "../redux/redux_slices/settingsSlice";
import { 
  FiHome, 
  FiUsers, 
  FiUserCheck, 
  FiFolder, 
  FiCalendar,
  FiSettings, 
  FiChevronDown, 
  FiChevronRight,
  FiLogOut
} from "react-icons/fi";

const sidebarMenu = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: FiHome,
  },
  {
    label: "Teams",
    icon: FiUserCheck,
    path: "/teams-list",
  },
  {
    label: "Employees",
    path: "/employee-list",
    icon: FiUsers,
  },
  {
    label: "Projects",
    path: "/project-list",
    icon: FiFolder,
  },
  {
    label: "Your Tasks",
    path: "/your-tasks",
    icon: FiCalendar,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: FiSettings,
  },
];

const Sidebar = ({ isOpen, position = 'left' }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const [openMenus, setOpenMenus] = useState({});
  const location = useLocation();

  const toggleSubMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      dispatch(resetTheme()); // Reset theme to light mode
      dispatch(logout());
    }
  };

  const borderStyle = position === 'right' 
    ? { borderLeft: '1px solid var(--border-color)' }
    : { borderRight: '1px solid var(--border-color)' };

  return (
    <div
      className={` overflow-y-auto transition-all duration-300 ${
        isOpen ? "w-72" : "w-0"
      }`}
      style={{
        backgroundColor: 'var(--bg-secondary)',
        ...borderStyle
      }}
    >
      <div className="!p-6">  
        <div className="!mb-4">
          
          {/* User Info */}
          {currentUser && (
            <div className="!mt-4 !p-3 bg-[var(--bg-tertiary)] rounded-lg">
              <div className="flex items-center !gap-3">
                <div className="w-10 h-10 bg-[var(--accent-primary)] rounded-full flex items-center justify-center text-white font-semibold">
                  {currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[var(--text-primary)] truncate">
                    {currentUser.name || currentUser.username}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] truncate">
                    {currentUser.userType === 'head' ? 'Team Head' : 'Employee'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <nav className="!space-y-2">
          {sidebarMenu.map((item) => {
            const Icon = item.icon;
            const isItemActive = isActive(item.path);
            
            return (
              <div key={item.label}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleSubMenu(item.label)}
                      className={`w-full flex items-center justify-between !px-4 !py-3 !rounded-lg text-left transition-all duration-200 group ${
                        openMenus[item.label]
                          ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
                          : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={20} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {openMenus[item.label] ? (
                        <FiChevronDown size={16} />
                      ) : (
                        <FiChevronRight size={16} />
                      )}
                    </button>
                    {openMenus[item.label] && (
                      <div className="!ml-6 !mt-2 !space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.path}
                            className={`block !px-4 !py-2 !rounded-lg text-xs transition-all duration-200 ${
                              isActive(child.path)
                                ? 'bg-[var(--accent-primary)] text-white'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 !px-4 !py-3 !rounded-lg transition-all duration-200 group ${
                      isItemActive
                        ? 'bg-[var(--accent-primary)] text-white shadow-lg'
                        : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )}
              </div>
            );
          })}
          
          {/* Logout Button */}
          <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 !px-4 !py-3 !rounded-lg text-left transition-all duration-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <FiLogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
