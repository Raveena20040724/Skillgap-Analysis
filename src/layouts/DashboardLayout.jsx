import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ROUTES } from '../constants/routes';
import Button from '../components/common/Button';
import { SunFill, MoonFill, BoxArrowRight } from 'react-bootstrap-icons';
const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.EMPLOYEE_LOGIN);
  };

  const navItems = [
    { label: 'Dashboard', path: ROUTES.EMPLOYEE_DASHBOARD },
    { label: 'Profile', path: ROUTES.EMPLOYEE_PROFILE },
    { label: 'Skills', path: ROUTES.SKILLS_MANAGEMENT },
    { label: 'Experience', path: ROUTES.EXPERIENCE_MANAGEMENT },
    { label: 'Resume', path: ROUTES.RESUME_UPLOAD },
    { label: 'Assessment', path: ROUTES.SKILL_ASSESSMENT },
    { label: 'Skill Gap', path: ROUTES.SKILL_GAP_RESULTS },
    { label: 'Career Recs', path: ROUTES.CAREER_RECOMMENDATIONS },
    { label: 'Learning Path', path: ROUTES.LEARNING_PATH },
    { label: 'Courses', path: ROUTES.COURSE_RECOMMENDATIONS },
    { label: 'Progress', path: ROUTES.PROGRESS_TRACKING },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md p-4">
        <h2 className="text-xl font-bold mb-6 text-blue-600 dark:text-blue-400">SkillGap Platform</h2>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-300">Welcome, {user?.name || 'Employee'}</span>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={toggleTheme}>
              {isDark ? <SunFill size={16} /> : <MoonFill size={16} />}
            </Button>
            <Button variant="secondary" onClick={handleLogout}>
              <BoxArrowRight size={16} className="inline mr-1" /> Logout
            </Button>
          </div>
        </header>

        {/* Page content renders here */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;