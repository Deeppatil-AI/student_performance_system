import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';
import { 
  UserCircle, 
  Lock, 
  ChevronRight, 
  LayoutDashboard, 
  AlertCircle,
  ShieldCheck,
  Zap,
  Target
} from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 10% 10%, rgba(249, 115, 22, 0.15) 0%, transparent 40%),
              radial-gradient(circle at 90% 90%, rgba(251, 146, 60, 0.1) 0%, transparent 40%)
            `
          }}
        />
        <div className="absolute inset-0 bg-tech-grid opacity-[0.03]" style={{ backgroundSize: '50px 50px' }} />
      </div>

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Logo/Brand */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-600 flex items-center justify-center shadow-orange-md mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
             <Target className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Student Diary</h1>
          <p className="text-dim font-bold italic text-sm tracking-wide lowercase">Elevate your academic performance</p>
        </div>

        {/* Login Card */}
        <div className="card backdrop-blur-2xl border-white/5 shadow-2xl p-10 group hover:border-orange-500/20 transition-all duration-700">
          <div className="flex items-center gap-3 mb-10">
            <ShieldCheck className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg font-black text-white lowercase tracking-tight">Access Your Dashboard</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-[0.2em] text-dim px-1">Username</label>
              <div className="relative group">
                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-dim group-focus-within:text-orange-500 transition-colors" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your PRN or email"
                  className="input-field pl-12 focus:ring-orange-500/20 focus:border-orange-500/40"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-[0.2em] text-dim px-1 text-right block w-full">
                <span className="cursor-pointer hover:text-orange-400 transition-colors">Forgot Password?</span>
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-dim group-focus-within:text-orange-500 transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-12 focus:ring-orange-500/20 focus:border-orange-500/40"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-red-400 leading-relaxed uppercase tracking-tighter">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-4 text-xs uppercase font-black tracking-[0.25em] flex items-center justify-center gap-3 group disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In Now'}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </form>

          <p className="text-center mt-10 text-xs font-bold text-dim">
            New to Student Diary? <Link to="/signup" className="text-orange-400 hover:text-orange-300 ml-1 transition-colors uppercase tracking-widest">Create an Account</Link>
          </p>
        </div>

        {/* Floating Tips */}
        <div className="mt-8 flex items-center justify-center gap-8 opacity-60">
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-dim">
              <Zap className="w-3 h-3 text-amber-500" />
              Fast Sync
           </div>
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-dim">
              <ShieldCheck className="w-3 h-3 text-orange-400" />
              Secure Data
           </div>
        </div>
      </div>
    </div>
  );
}
