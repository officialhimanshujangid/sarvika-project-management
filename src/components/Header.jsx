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
      <h1 className="text-lg font-semibold m-0">Project Management</h1>
      <div className="flex items-center !gap-3">
        <ThemeToggle />
        <button 
          onClick={toggleSidebar}
          className="btn btn-primary"
        >
          ☰
        </button>
      </div>
    </header>
  );
};

export default Header;
