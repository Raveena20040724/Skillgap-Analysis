import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { ROUTES } from '../../constants/routes';
import { ShieldCheck, Lock, Mail, Server, Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getExactErrorMessage = (err) => {
    if (!err.response) {
      if (err.message && err.message.includes('Network Error')) {
        return 'Server Error: Unable to connect to backend server. Make sure Django is running on http://127.0.0.1:8000';
      }
      return err.message || 'Network connection failed. Please verify server status.';
    }

    const status = err.response.status;
    const data = err.response.data;

    if (status >= 500) {
      return 'Server Error (500): Internal server error occurred in backend.';
    }

    if (data?.errors) {
      if (typeof data.errors === 'string') return data.errors;
      if (data.errors.non_field_errors?.[0]) return `Invalid Credentials: ${data.errors.non_field_errors[0]}`;
      if (data.errors.password?.[0]) return `Password Error: ${data.errors.password[0]}`;
      if (data.errors.username?.[0]) return `Username Error: ${data.errors.username[0]}`;
      if (data.errors.email?.[0]) return `Email Error: ${data.errors.email[0]}`;
    }

    if (data?.message) return `Login Failed: ${data.message}`;
    if (data?.detail) return `Error: ${data.detail}`;

    return 'Invalid username or password. Please verify your admin credentials.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter Admin Email/Username and Password.');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login({
        username: formData.email,
        password: formData.password
      });
      const responsePayload = response.data?.data || response.data;
      const access = responsePayload?.access;
      const refresh = responsePayload?.refresh;
      const user = responsePayload?.user || responsePayload;

      login({ ...user, role: user?.role || 'admin' }, access, refresh);
      navigate(ROUTES.ADMIN_DASHBOARD);
    } catch (err) {
      console.error('Admin login error:', err);
      setError(getExactErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white relative flex flex-col justify-between p-4 sm:p-6 md:p-10 font-sans overflow-x-hidden">
      <header className="relative z-10 max-w-7xl w-full mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="SkillBridge Logo" 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl object-cover shadow-xl shadow-black/40 border border-white/20"
            />
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white block leading-tight">SkillBridge.AI</span>
              <span className="text-[9px] sm:text-[10px] font-bold text-teal-400 tracking-wider uppercase block">Super Admin Operations</span>
            </div>
          </div>

          <Link
            to={ROUTES.EMPLOYEE_LOGIN}
            className="px-3.5 sm:px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition-all shrink-0"
          >
            Employee Portal
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-6 sm:py-8">
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left pr-0 lg:pr-8 space-y-4 sm:space-y-6">
          <div className="p-2.5 sm:p-3 bg-teal-500/20 border border-teal-500/30 text-teal-300 rounded-2xl inline-flex items-center gap-2 text-xs font-black tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Super Admin Security Operations</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight max-w-xl">
            System Operations & Organization Control
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-300/90 font-medium max-w-lg leading-relaxed">
            Sign in to manage system users, RBAC permissions, department taxonomies, and AI inference endpoints.
          </p>
        </div>

        <div className="lg:col-span-5 w-full">
          <div className="bg-white dark:bg-[#161f33] rounded-3xl sm:rounded-[32px] p-6 sm:p-8 md:p-10 shadow-2xl text-slate-900 border border-slate-200/90 dark:border-slate-800 max-w-md w-full mx-auto lg:ml-auto relative">
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-600 dark:text-teal-400 mx-auto mb-3 border border-teal-500/20">
                <Server className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Super Admin Sign In</h2>
              <p className="text-xs font-bold text-slate-400 mt-1">Enter your administrative credentials</p>
            </div>

            {error && (
              <div className="p-3 mb-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold text-center leading-relaxed">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Admin Email / Username</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    name="email"
                    type="text"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin (or admin@company.com)"
                    className="w-full bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-2xl pl-11 pr-4 py-3 sm:py-3.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-2xl pl-11 pr-11 py-3 sm:py-3.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1 transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 sm:pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-3 sm:py-3.5 px-6 rounded-2xl shadow-lg shadow-teal-600/30 transition-all duration-200 cursor-pointer disabled:opacity-70 text-xs uppercase tracking-wider"
                >
                  {loading ? 'Authenticating Admin...' : 'Sign In to Admin Portal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-2"></footer>
    </div>
  );
};

export default AdminLogin;