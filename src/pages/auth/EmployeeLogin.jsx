import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { ROUTES } from '../../constants/routes';

const roleRedirects = {
  employee: ROUTES.EMPLOYEE_DASHBOARD,
  hr: ROUTES.HR_DASHBOARD,
  admin: ROUTES.ADMIN_DASHBOARD,
};

const EmployeeLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password) {
      setError('Please fill in both fields');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(formData);
      const { access, refresh, user } = response.data;
      login(user, access, refresh);
      navigate(roleRedirects[user.role] || ROUTES.EMPLOYEE_DASHBOARD);
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.detail || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 text-white relative flex flex-col justify-between p-6 md:p-10 font-sans overflow-x-hidden select-none">
      {/* Decorative ambient background spheres */}
      <div className="w-[600px] h-[600px] rounded-full bg-white/10 absolute -top-40 -right-40 pointer-events-none blur-2xl"></div>
      <div className="w-[500px] h-[500px] rounded-full bg-indigo-400/20 absolute -bottom-32 -left-32 pointer-events-none blur-3xl"></div>

      {/* Top Header Logo */}
      <header className="relative z-10 max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="SkillGap Logo" 
            className="w-12 h-12 rounded-full object-cover shadow-xl shadow-black/20 border border-white/40"
          />
          <span className="text-2xl font-black tracking-tight text-white">SkillGap</span>
        </div>
      </header>

      {/* Main Grid Section */}
      <main className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto py-8">
        {/* Left Column: Hero Content */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left pr-0 lg:pr-8">
          {/* 3 Colorful circular icon badges */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-red-400 shadow-xl shadow-rose-500/30 flex items-center justify-center text-2xl transform hover:scale-105 transition-transform duration-200">
              ✏️
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 shadow-xl shadow-amber-500/30 flex items-center justify-center text-2xl transform hover:scale-105 transition-transform duration-200">
              💼
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-400 to-green-300 shadow-xl shadow-emerald-500/30 flex items-center justify-center text-2xl transform hover:scale-105 transition-transform duration-200">
              🥰
            </div>
          </div>

          {/* Hero Headline */}
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 tracking-tight max-w-xl">
            Accelerate Your Growth & Master Essential Skills
          </h1>

          {/* Hero Subtitle */}
          <p className="text-base md:text-lg text-indigo-100/90 font-medium max-w-lg leading-relaxed">
            Analyze skill gaps, track learning milestones, and unlock strategic career recommendations designed for your professional success.
          </p>
        </div>

        {/* Right Column: Floating Auth Card */}
        <div className="lg:col-span-5 w-full">
          <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-2xl shadow-indigo-950/30 text-slate-900 max-w-md w-full mx-auto lg:ml-auto relative">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign in to account</h2>
              <p className="text-xs font-semibold text-slate-400 mt-1">Enter your details to access your portal</p>
            </div>

            {error && (
              <div className="p-3.5 mb-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Username</label>
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 border border-transparent focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Password</label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 border border-transparent focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all outline-none"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-extrabold py-3.5 px-6 rounded-full shadow-lg shadow-indigo-500/30 transition-all duration-200 cursor-pointer disabled:opacity-70 text-sm"
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