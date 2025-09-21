

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setTheme, 
  updateSidebar, 
  updatePrivacy, 
} from '../redux/redux_slices/settingsSlice';
import { useTheme } from '../contexts/ThemeContext';
import { 
  FiSun, 
  FiMoon, 
  FiSidebar, 
  FiShield, 
  FiRefreshCw,
  FiSave,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';

const Settings = () => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const settings = useSelector((state) => state.settings);
  const [activeTab, setActiveTab] = useState('appearance');

  const handleSidebarChange = (key, value) => {
    dispatch(updateSidebar({ [key]: value }));
  };

  const handlePrivacyChange = (key, value) => {
    dispatch(updatePrivacy({ [key]: value }));
  };



  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: FiSun },
    { id: 'sidebar', label: 'Sidebar', icon: FiSidebar },
    { id: 'privacy', label: 'Privacy', icon: FiShield },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-3">Settings</h1>
          <p className="text-lg text-[var(--text-secondary)]">Customize your application preferences and experience.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-72">
            <div className="bg-[var(--bg-secondary)] rounded-xl !p-6 shadow-lg border border-[var(--border-color)] sticky top-8">
              <nav className="!space-y-3 ">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-4 !px-4 !py-3 rounded-lg text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-[var(--accent-primary)] text-white shadow-md'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-2">
            <div className="bg-[var(--bg-secondary)] rounded-xl !p-8 shadow-lg border border-[var(--border-color)]">
            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="!space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Theme Settings</h2>
                  
                  {/* Theme Selection */}
                  <div className="!space-y-6">
                    <div>
                      <label className="block text-lg font-semibold text-[var(--text-primary)] mb-4">
                        Choose Your Theme
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 !gap-4 max-w-md">
                        <button
                          onClick={() => dispatch(setTheme('light'))}
                          className={`flex items-center justify-center gap-3 !px-6 !py-4 rounded-xl border-2 transition-all duration-200 ${
                            theme === 'light'
                              ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white shadow-lg'
                              : 'border-[var(--border-color)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-tertiary)]'
                          }`}
                        >
                          <FiSun size={24} />
                          <span className="font-medium">Light Mode</span>
                        </button>
                        <button
                          onClick={() => dispatch(setTheme('dark'))}
                          className={`flex items-center justify-center gap-3 !px-6 !py-4 rounded-xl border-2 transition-all duration-200 ${
                            theme === 'dark'
                              ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white shadow-lg'
                              : 'border-[var(--border-color)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-tertiary)]'
                          }`}
                        >
                          <FiMoon size={24} />
                          <span className="font-medium">Dark Mode</span>
                        </button>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] mt-3">
                        Choose between light and dark themes to match your preference.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sidebar Settings */}
            {activeTab === 'sidebar' && (
              <div className="!space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Sidebar Settings</h2>
                  
                  <div className="!space-y-6">
                    {/* Sidebar Position */}
                    <div>
                      <label className="block text-lg font-semibold text-[var(--text-primary)] mb-4">
                        Sidebar Position
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 !gap-4 max-w-md">
                        <button
                          onClick={() => handleSidebarChange('position', 'left')}
                          className={`flex items-center justify-center gap-3 !px-6 !py-4 rounded-xl border-2 transition-all duration-200 ${
                            settings.sidebar.position === 'left'
                              ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white shadow-lg'
                              : 'border-[var(--border-color)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-tertiary)]'
                          }`}
                        >
                          <FiSidebar size={24} />
                          <span className="font-medium">Left Side</span>
                        </button>
                        <button
                          onClick={() => handleSidebarChange('position', 'right')}
                          className={`flex items-center justify-center gap-3 !px-6 !py-4 rounded-xl border-2 transition-all duration-200 ${
                            settings.sidebar.position === 'right'
                              ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white shadow-lg'
                              : 'border-[var(--border-color)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-tertiary)]'
                          }`}
                        >
                          <FiSidebar size={24} className="transform rotate-180" />
                          <span className="font-medium">Right Side</span>
                        </button>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] mt-3">
                        Choose whether the sidebar appears on the left or right side of the screen.
                      </p>
                    </div>

                  
                  </div>
                </div>
              </div>
            )}


            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <div className="!space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)] !mb-6">Privacy & Data Settings</h2>
                  
                  <div className="!space-y-6">
                    <div className="flex items-center justify-between !p-4 bg-[var(--bg-tertiary)] !rounded-lg">
                      <div className="flex items-center gap-4">
                        <FiEye className="text-[var(--text-secondary)]" size={24} />
                        <div>
                          <div className="font-semibold text-[var(--text-primary)] text-lg">Analytics</div>
                          <div className="text-sm text-[var(--text-secondary)]">Help improve the app with usage analytics</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.privacy.analytics}
                          onChange={(e) => handlePrivacyChange('analytics', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--accent-primary)]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-primary)]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between !p-4 bg-[var(--bg-tertiary)] !rounded-lg">
                      <div className="flex items-center gap-4">
                        <FiShield className="text-[var(--text-secondary)]" size={24} />
                        <div>
                          <div className="font-semibold text-[var(--text-primary)] text-lg">Crash Reporting</div>
                          <div className="text-sm text-[var(--text-secondary)]">Send crash reports to help fix bugs</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.privacy.crashReporting}
                          onChange={(e) => handlePrivacyChange('crashReporting', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--accent-primary)]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-primary)]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between !p-4 bg-[var(--bg-tertiary)] !rounded-lg">
                      <div className="flex items-center gap-4">
                        <FiEyeOff className="text-[var(--text-secondary)]" size={24} />
                        <div>
                          <div className="font-semibold text-[var(--text-primary)] text-lg">Data Collection</div>
                          <div className="text-sm text-[var(--text-secondary)]">Allow collection of personal data</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.privacy.dataCollection}
                          onChange={(e) => handlePrivacyChange('dataCollection', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--accent-primary)]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-primary)]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;