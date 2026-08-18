import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { ROUTES } from '../../constants/routes';
import { Eye, EyeOff, Lock, User } from 'lucide-react';

const roleRedirects = {
  employee: ROUTES.EMPLOYEE_DASHBOARD,
  hr: ROUTES.HR_DASHBOARD,
  admin: ROUTES.ADMIN_DASHBOARD,
};

const EmployeeLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
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

    return 'Invalid username or password. Please check your credentials.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password) {
      setError('Please fill in both username and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(formData);
      const responsePayload = response.data?.data || response.data;
      const access = responsePayload?.access;
      const refresh = responsePayload?.refresh;
      const user = responsePayload?.user || responsePayload;

      login(user, access, refresh);
      const role = user?.role || 'employee';
      navigate(roleRedirects[role] || ROUTES.EMPLOYEE_DASHBOARD);
    } catch (err) {
      console.error('Login failed:', err);
      setError(getExactErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 text-white relative flex flex-col justify-between p-4 sm:p-6 md:p-10 font-sans overflow-x-hidden">
      {/* Decorative ambient background spheres */}
      <div className="w-72 h-72 sm:w-[500px] sm:h-[500px] lg:w-[600px] lg:h-[600px] rounded-full bg-white/10 absolute -top-40 -right-40 pointer-events-none blur-2xl"></div>
      <div className="w-64 h-64 sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] rounded-full bg-indigo-400/20 absolute -bottom-32 -left-32 pointer-events-none blur-3xl"></div>

      {/* Top Header Logo */}
      <header className="relative z-10 max-w-7xl w-full mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="SkillGap Logo" 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shadow-xl shadow-black/20 border border-white/40"
            />
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white">SkillGap</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={ROUTES.ADMIN_LOGIN}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition-all"
            >
              Admin Portal
            </Link>
            <Link
              to={ROUTES.HR_LOGIN}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition-all"
            >
              HR Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Main Grid Section */}
      <main className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-6 sm:py-8">
        {/* Left Column: Hero Content */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left pr-0 lg:pr-8">
          {/* 3 Colorful circular icon badges */}
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-rose-500 to-red-400 shadow-xl shadow-rose-500/30 flex items-center justify-center text-xl sm:text-2xl transform hover:scale-105 transition-transform duration-200">
              ✏️
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 shadow-xl shadow-amber-500/30 flex items-center justify-center text-xl sm:text-2xl transform hover:scale-105 transition-transform duration-200">
              💼
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-emerald-400 to-green-300 shadow-xl shadow-emerald-500/30 flex items-center justify-center text-xl sm:text-2xl transform hover:scale-105 transition-transform duration-200">
              🥰
            </div>
          </div>

          {/* Hero Headline */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-3 sm:mb-4 tracking-tight max-w-xl">
            Accelerate Your Growth & Master Essential Skills
          </h1>

          {/* Hero Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 font-medium max-w-lg leading-relaxed">
            Analyze skill gaps, track learning milestones, and unlock strategic career recommendations designed for your professional success.
          </p>
        </div>

        {/* Right Column: Floating Auth Card */}
        <div className="lg:col-span-5 w-full">
          <div className="bg-white rounded-3xl sm:rounded-[32px] p-6 sm:p-8 md:p-10 shadow-2xl shadow-indigo-950/30 text-slate-900 max-w-md w-full mx-auto lg:ml-auto relative">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Sign in to account</h2>
              <p className="text-xs font-semibold text-slate-400 mt-1">Enter your details to access your portal</p>
            </div>

            {error && (
              <div className="p-3 mb-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold text-center leading-relaxed">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Username or Email</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="alex_morgan (or alex.morgan@company.com)"
                    className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 border border-transparent focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl pl-11 pr-4 py-3 sm:py-3.5 text-xs font-semibold transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 border border-transparent focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl pl-11 pr-11 py-3 sm:py-3.5 text-xs font-semibold transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1 transition-colors"
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
                  className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-extrabold py-3 sm:py-3.5 px-6 rounded-2xl shadow-lg shadow-indigo-500/30 transition-all duration-200 cursor-pointer disabled:opacity-70 text-xs uppercase tracking-wider"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </div>
            </form>

            <p className="text-xs text-center mt-6 text-slate-500 font-semibold">
              Don't have an account?{' '}
              <Link to={ROUTES.EMPLOYEE_REGISTER} className="text-indigo-600 font-bold hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Empty Footer Spacer */}
      <footer className="relative z-10 py-2"></footer>
    </div>
  );
};

export default EmployeeLogin;