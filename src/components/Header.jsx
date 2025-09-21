import { FiMenu } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';

const Header = ({ toggleSidebar }) => {
  return (
    <header 
      className="flex items-center justify-between !p-4 border-b"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        borderBottomColor: 'var(--border-color)'
      }}
    >
      <div className="flex items-center !gap-3">
        <button 
          onClick={toggleSidebar}
          className="!p-2 !rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors md:hidden"
          title="Toggle Sidebar"
        >
          <FiMenu size={20} />
        </button>
        <h1 className="text-lg font-semibold m-0">Project Management</h1>
      </div>
      <div className="flex items-center !gap-3">
        <ThemeToggle />
        <button 
          onClick={toggleSidebar}
          className="!p-2 !rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors hidden md:block"
          title="Toggle Sidebar"
        >
          <FiMenu size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
