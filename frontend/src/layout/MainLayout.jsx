import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function MainLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-dark-900 selection:bg-orange-500/30">
      {/* Visual Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-40 dark:opacity-40"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 15% 50%, rgba(249, 115, 22, 0.1) 0%, transparent 50%),
              radial-gradient(ellipse at 85% 15%, rgba(251, 146, 60, 0.08) 0%, transparent 40%),
              radial-gradient(ellipse at 60% 85%, rgba(249, 115, 22, 0.05) 0%, transparent 50%)
            `
          }}
        />
        <div className="absolute inset-0 bg-tech-grid opacity-[0.05] dark:opacity-[0.03]" style={{ backgroundSize: '40px 40px' }} />
      </div>

      {/* Sidebar - Always Left */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 overflow-hidden">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto scrollbar-dark">
          <div className="max-w-7xl mx-auto p-4 md:p-8 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
