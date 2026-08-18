import { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ROUTES } from '../constants/routes';
import { 
  SunFill, 
  MoonFill, 
  BoxArrowRight,
  Speedometer2,
  LightningFill,
  BriefcaseFill,
  FileEarmarkTextFill,
  Check2Square,
  BarChartFill,
  CompassFill,
  MortarboardFill,
  BookHalf,
  GraphUpArrow,
  PersonFill,
  BellFill,
  GearFill,
  ChevronDown,
  Search,
  PeopleFill,
  BuildingFill
} from 'react-bootstrap-icons';
import { 
  BrainCircuit, 
  LayoutGrid, 
  Users, 
  ShieldCheck, 
  Building2, 
  PieChart, 
  Sliders,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const portalRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  // Active workspace mode detection (strictly respects user role and URL)
  const userRole = user?.role || localStorage.getItem('user_role') || (user?.username === 'admin' ? 'admin' : user?.username?.includes('hr') ? 'hr' : 'employee');
  const isAdmin = userRole === 'admin';
  const isHr = !isAdmin && userRole === 'hr';

  const workspaceName = isAdmin 
    ? 'Admin Workspace' 
    : isHr 
    ? 'HR Workspace' 
    : 'Employee Workspace';

  const portalLabel = isAdmin 
    ? 'Admin Portal' 
    : isHr 
    ? 'Hr Portal' 
    : 'Employee Portal';

  // Prevent cross-portal routing leakage
  useEffect(() => {
    if (isAdmin && (location.pathname.startsWith('/employee') || location.pathname === '/dashboard')) {
      navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
    } else if (isHr && (location.pathname.startsWith('/employee') || location.pathname === '/dashboard')) {
      navigate(ROUTES.HR_DASHBOARD, { replace: true });
    }
  }, [isAdmin, isHr, location.pathname]);

  // Search Index for Global Navbar Search
  const searchIndex = isAdmin ? [
    { title: 'Admin Dashboard', subtitle: 'Overview of system telemetry, users, and AI metrics', path: ROUTES.ADMIN_DASHBOARD, category: 'Dashboard' },
    { title: 'Admin Profile', subtitle: 'Update profile info, photo avatar, and credentials', path: ROUTES.ADMIN_PROFILE, category: 'Account' },
    { title: 'User Management', subtitle: 'Manage HR managers and employee directory accounts', path: ROUTES.ADMIN_USERS, category: 'Management' },
    { title: 'Roles & Access (RBAC)', subtitle: 'Manage permissions, custom roles, and security scopes', path: ROUTES.ADMIN_ROLES, category: 'Security' },
    { title: 'Department Taxonomies', subtitle: 'Configure departments and readiness benchmarks', path: ROUTES.ADMIN_DEPARTMENTS, category: 'Organization' },
    { title: 'System Reports & Telemetry', subtitle: 'Download audit logs, CSV exports, and AI metrics', path: ROUTES.ADMIN_REPORTS, category: 'Analytics' },
    { title: 'System Settings', subtitle: 'Change password with email OTP, theme, and security', path: ROUTES.ADMIN_SETTINGS, category: 'Settings' },
    { title: 'Notifications Center', subtitle: 'View system audit alerts and security logs', path: ROUTES.ADMIN_NOTIFICATIONS, category: 'Alerts' },
  ] : isHr ? [
    { title: 'HR Dashboard', subtitle: 'Organization skill gap overview and readiness index', path: ROUTES.HR_DASHBOARD, category: 'Dashboard' },
    { title: 'Employee Directory', subtitle: 'Browse staff profiles, skills, and departments', path: ROUTES.HR_DIRECTORY, category: 'Directory' },
    { title: 'Skill Reports & Analytics', subtitle: 'Export team skill audits and CSV spreadsheets', path: ROUTES.HR_REPORTS, category: 'Reports' },
    { title: 'Notifications Center', subtitle: 'Talent assessments and readiness reports', path: ROUTES.HR_NOTIFICATIONS, category: 'Alerts' },
    { title: 'HR Settings', subtitle: 'Notification preferences and account security', path: ROUTES.HR_SETTINGS, category: 'Settings' },
  ] : [
    { title: 'Employee Dashboard', subtitle: 'Career progress, skill overview, and active roadmaps', path: ROUTES.EMPLOYEE_DASHBOARD, category: 'Dashboard' },
    { title: 'My Profile', subtitle: 'Personal details, bio, and technical background', path: ROUTES.EMPLOYEE_PROFILE, category: 'Profile' },
    { title: 'Resume Upload & Telemetry', subtitle: 'Parse resume to extract technical skills automatically', path: ROUTES.RESUME_UPLOAD, category: 'Resume' },
    { title: 'Skills Management', subtitle: 'Add, verify, and track technical competencies', path: ROUTES.SKILLS_MANAGEMENT, category: 'Skills' },
    { title: 'Skill Assessments', subtitle: 'Take quizzes to benchmark your proficiency levels', path: ROUTES.SKILL_ASSESSMENT, category: 'Assessments' },
    { title: 'Skill Gap Analysis', subtitle: 'Discover gaps for target career roles', path: ROUTES.SKILL_GAP_RESULTS, category: 'AI Insights' },
    { title: 'Career Paths & Recommendations', subtitle: 'Personalized career advancement roadmaps', path: ROUTES.CAREER_RECOMMENDATIONS, category: 'Careers' },
    { title: 'Learning Pathway Roadmap', subtitle: 'Step-by-step master roadmap for your goals', path: ROUTES.LEARNING_PATH, category: 'Roadmap' },
    { title: 'Course Recommendations', subtitle: 'Tailored courses to close identified skill gaps', path: ROUTES.COURSE_RECOMMENDATIONS, category: 'Courses' },
    { title: 'Progress Tracking', subtitle: 'Milestones, completion rates, and learning stats', path: ROUTES.PROGRESS_TRACKING, category: 'Analytics' },
    { title: 'Notifications Center', subtitle: 'Real-time AI insights, course updates, and alerts', path: ROUTES.NOTIFICATIONS, category: 'Alerts' },
    { title: 'Account Settings', subtitle: 'Preferences, notifications, and security', path: ROUTES.SETTINGS, category: 'Settings' },
  ];

  const searchResults = globalSearch.trim() === '' 
    ? [] 
    : searchIndex.filter(item => 
        item.title.toLowerCase().includes(globalSearch.toLowerCase()) || 
        item.subtitle.toLowerCase().includes(globalSearch.toLowerCase()) ||
        item.category.toLowerCase().includes(globalSearch.toLowerCase())
      );

  // Dynamic Navigation Items matching user photo
  const getNavItems = () => {
    if (isAdmin) {
      return [
        { label: 'Admin Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: LayoutGrid, isLucide: true },
        { label: 'Admin Profile', path: ROUTES.ADMIN_PROFILE, icon: PersonFill },
        { label: 'User Management', path: ROUTES.ADMIN_USERS, icon: Users, isLucide: true },
        { label: 'Roles & Access', path: ROUTES.ADMIN_ROLES, icon: ShieldCheck, isLucide: true },
        { label: 'Departments', path: ROUTES.ADMIN_DEPARTMENTS, icon: Building2, isLucide: true },
        { label: 'System Reports', path: ROUTES.ADMIN_REPORTS, icon: PieChart, isLucide: true },
        { label: 'System Settings', path: ROUTES.ADMIN_SETTINGS, icon: Sliders, isLucide: true },
        { label: 'Notifications', path: ROUTES.ADMIN_NOTIFICATIONS, icon: BellFill },
      ];
    }

    if (isHr) {
      return [
        { label: 'HR Dashboard', path: ROUTES.HR_DASHBOARD, icon: LayoutGrid, isLucide: true },
        { label: 'Employee Directory', path: ROUTES.HR_DIRECTORY, icon: Users, isLucide: true },
        { label: 'Skill Reports', path: ROUTES.HR_REPORTS, icon: PieChart, isLucide: true },
        { label: 'Notifications', path: ROUTES.HR_NOTIFICATIONS, icon: BellFill },
        { label: 'Settings', path: ROUTES.HR_SETTINGS, icon: GearFill },
      ];
    }

    return [
      { label: 'Dashboard', path: ROUTES.EMPLOYEE_DASHBOARD, icon: Speedometer2 },
      { label: 'Profile', path: ROUTES.EMPLOYEE_PROFILE, icon: PersonFill },
      { label: 'Resume', path: ROUTES.RESUME_UPLOAD, icon: FileEarmarkTextFill },
      { label: 'Skills', path: ROUTES.SKILLS_MANAGEMENT, icon: LightningFill },
      { label: 'Assessments', path: ROUTES.SKILL_ASSESSMENT, icon: Check2Square },
      { label: 'Skill Gap Analysis', path: ROUTES.SKILL_GAP_RESULTS, icon: BarChartFill },
      { label: 'Career Paths', path: ROUTES.CAREER_RECOMMENDATIONS, icon: CompassFill },
      { label: 'Learning Path', path: ROUTES.LEARNING_PATH, icon: MortarboardFill },
      { label: 'Courses', path: ROUTES.COURSE_RECOMMENDATIONS, icon: BookHalf },
      { label: 'Progress Tracking', path: ROUTES.PROGRESS_TRACKING, icon: GraphUpArrow },
      { label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: BellFill },
    ];
  };

  const navItems = getNavItems();

  // Role-specific notifications data
  const initialNotifications = isAdmin
    ? [
        {
          id: 1,
          title: 'System Security Audit Clean',
          message: 'Zero vulnerability anomalies detected in RBAC permission tables.',
          time: '5m ago',
          read: false,
        },
        {
          id: 2,
          title: 'New HR Manager Added',
          message: 'Sarah Jenkins registered under People Operations department.',
          time: '1h ago',
          read: false,
        },
        {
          id: 3,
          title: 'Gemini AI Endpoint Status: Active',
          message: 'AI inference latency is within optimal range (142ms).',
          time: '3h ago',
          read: false,
        },
      ]
    : isHr
    ? [
        {
          id: 1,
          title: 'New Assessment Submissions (12)',
          message: 'Engineering department submitted Q3 Skill Gap assessments.',
          time: '15m ago',
          read: false,
        },
        {
          id: 2,
          title: 'Talent Readiness Report Ready',
          message: 'Organization average skill readiness indexed at 83.4%.',
          time: '2h ago',
          read: false,
        },
        {
          id: 3,
          title: 'New Employee Profile Created',
          message: 'Alex Morgan joined Senior Frontend pathway.',
          time: '4h ago',
          read: false,
        },
      ]
    : [
        {
          id: 1,
          title: 'AI Skill Gap Analysis Ready',
          message: 'Your latest skill assessment has been processed. 4 skill gaps identified for Senior Frontend role.',
          time: '10m ago',
          read: false,
        },
        {
          id: 2,
          title: 'New Recommended Course',
          message: 'Advanced React Design Systems course added to your learning pathway.',
          time: '1h ago',
          read: false,
        },
        {
          id: 3,
          title: 'Resume Successfully Parsed',
          message: 'CV telemetry updated. 8 technical skills extracted and synced with profile.',
          time: '2h ago',
          read: false,
        },
      ];

  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (portalRef.current && !portalRef.current.contains(event.target)) {
        setPortalDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate(isAdmin ? ROUTES.ADMIN_LOGIN : isHr ? ROUTES.HR_LOGIN : ROUTES.EMPLOYEE_LOGIN);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAllAsUnread = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: false })));
  };

  // Clicking the notification bell icon clears unread badge and opens dropdown
  const handleBellClick = () => {
    const nextState = !notifOpen;
    setNotifOpen(nextState);
    if (nextState) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  // Clicking an individual notification marks it read AND navigates to the notifications page
  const handleNotifMessageClick = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setNotifOpen(false);
    navigate(notifRoute);
  };

  const handleNavClick = (item) => {
    setMobileMenuOpen(false);
    if (item.label.toLowerCase().includes('notification')) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const notifRoute = isAdmin 
    ? ROUTES.ADMIN_NOTIFICATIONS 
    : isHr 
    ? ROUTES.HR_NOTIFICATIONS 
    : ROUTES.NOTIFICATIONS;

  const profileRoute = isAdmin 
    ? ROUTES.ADMIN_PROFILE 
    : isHr 
    ? ROUTES.HR_DIRECTORY 
    : ROUTES.EMPLOYEE_PROFILE;

  const settingsRoute = isAdmin 
    ? ROUTES.ADMIN_SETTINGS 
    : isHr 
    ? ROUTES.HR_SETTINGS 
    : ROUTES.SETTINGS;

  const initialLetter = (user?.name || user?.username || (isAdmin ? 'Admin' : isHr ? 'HR' : 'Employee')).charAt(0).toUpperCase();

  return (
    <div className="h-screen w-full overflow-hidden flex bg-slate-100 dark:bg-[#0b1120] text-slate-800 dark:text-slate-100 transition-colors duration-300 relative">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - Responsive Drawer on Mobile/Tablet & Persistent on Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 h-full bg-white dark:bg-[#161f33] border-r border-slate-200 dark:border-slate-800/80 flex flex-col shrink-0 shadow-2xl lg:shadow-none transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 overflow-y-auto ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand Header with Exact SkillBridge.AI Logo */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/60 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 bg-clip-text text-transparent tracking-tight block leading-tight">
                SkillBridge<span className="text-blue-600 dark:text-emerald-400">.AI</span>
              </span>
              <span className="block text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase leading-snug">
                {workspaceName.toUpperCase()}
              </span>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                onClick={() => handleNavClick(item)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-blue-600 dark:hover:text-white'
                }`}
              >
                {item.isLucide ? (
                  <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                ) : (
                  <Icon size={16} className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                )}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 z-10 bg-slate-100 dark:bg-[#0b1120]">
        {/* Navbar Header */}
        <header className="h-16 px-4 sm:px-6 lg:px-8 flex justify-between items-center border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900 backdrop-blur-md shrink-0 relative z-30">
          {/* Left: Mobile Menu Button & Search Bar */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 lg:hidden hover:bg-slate-100 dark:hover:bg-slate-700/80 cursor-pointer transition-colors"
              title="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="relative w-44 sm:w-64 md:w-80 lg:w-96" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={isAdmin ? "Search system logs, users, roles..." : isHr ? "Search employees, skills, reports..." : "Search skills, courses, careers..."}
                value={globalSearch}
                onChange={(e) => {
                  setGlobalSearch(e.target.value);
                  setSearchDropdownOpen(true);
                }}
                onFocus={() => setSearchDropdownOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchResults.length > 0) {
                    navigate(searchResults[0].path);
                    setGlobalSearch('');
                    setSearchDropdownOpen(false);
                  }
                  if (e.key === 'Escape') {
                    setSearchDropdownOpen(false);
                  }
                }}
                className="w-full pl-9 pr-8 py-2 text-xs font-semibold bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
              {globalSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setGlobalSearch('');
                    setSearchDropdownOpen(false);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Live Search Results Floating Dropdown */}
              {searchDropdownOpen && globalSearch.trim().length > 0 && (
                <div className="absolute left-0 mt-2 w-full sm:w-[380px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-700/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden">
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                    <span>Search Results ({searchResults.length})</span>
                    <span className="text-[10px] lowercase text-slate-400">press enter to open</span>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
                    {searchResults.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No pages or features found for "<strong className="text-slate-600 dark:text-slate-200">{globalSearch}</strong>"
                      </div>
                    ) : (
                      searchResults.map((res, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            navigate(res.path);
                            setGlobalSearch('');
                            setSearchDropdownOpen(false);
                          }}
                          className="p-3 hover:bg-blue-50/70 dark:hover:bg-slate-700/60 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-teal-400 transition-colors truncate">
                                {res.title}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-blue-500/10 text-blue-600 dark:text-teal-400 uppercase">
                                {res.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">
                              {res.subtitle}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5 shrink-0" />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {isDark ? <SunFill size={15} /> : <MoonFill size={15} className="text-blue-600" />}
            </button>

            {/* Notification Bell Button & Blinking Badge */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={handleBellClick}
                className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-colors cursor-pointer relative"
                title="Toggle Notifications"
              >
                <BellFill size={15} className="text-slate-700 dark:text-slate-200" />

                {/* Blinking Red Counter Badge */}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-600 text-white text-[9px] font-black items-center justify-center shadow-md">
                      {unreadCount}
                    </span>
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {notifOpen && (
                <div className="absolute right-0 mt-3 w-72 sm:w-84 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-700/80 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-700/70 flex items-center justify-between">
                    <h3 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <BellFill size={13} className="text-amber-500" /> Notifications ({unreadCount} unread)
                    </h3>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 ? (
                        <button
                          type="button"
                          onClick={markAllAsRead}
                          className="text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                        >
                          Mark all read
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={markAllAsUnread}
                          className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                        >
                          Mark all unread
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-700/60 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotifMessageClick(n.id)}
                        className={`p-3 text-xs transition-colors cursor-pointer select-none ${
                          !n.read 
                            ? 'bg-blue-50/70 dark:bg-slate-700/50 hover:bg-blue-100/70 dark:hover:bg-slate-700/80' 
                            : 'hover:bg-slate-50 dark:hover:bg-slate-700/30 opacity-75'
                        }`}
                        title="Click to view notification"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className={`font-bold text-slate-900 dark:text-white leading-snug ${!n.read ? 'text-blue-600 dark:text-teal-300' : ''}`}>
                            {n.title}
                          </p>
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 mt-0.5 ${!n.read ? 'bg-rose-500 ring-2 ring-rose-300/80' : 'bg-slate-300 dark:bg-slate-600'}`} />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1 leading-normal">{n.message}</p>
                        <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-slate-100/60 dark:border-slate-700/40">
                          <span className="text-[10px] text-slate-400 font-semibold">{n.time}</span>
                          <span className="text-[10px] font-extrabold text-blue-600 dark:text-teal-400 hover:underline">
                            View details →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* View All Notifications Button */}
                  <div className="pt-2 px-3 border-t border-slate-100 dark:border-slate-700/70 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setNotifOpen(false);
                        navigate(notifRoute);
                      }}
                      className="w-full py-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-slate-700/60 rounded-xl transition-colors cursor-pointer"
                    >
                      View All Notifications ({workspaceName}) →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-4 hover:ring-teal-500/10 transition-all duration-200 cursor-pointer focus:outline-none"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 p-0.5 shadow-md shadow-teal-500/20">
                  {user?.avatar || localStorage.getItem('userAvatar') ? (
                    <img 
                      src={user?.avatar || localStorage.getItem('userAvatar')} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-sm font-black text-blue-600 dark:text-teal-400">
                      {initialLetter}
                    </div>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden md:inline-block max-w-[120px] truncate">
                  {user?.name || (isAdmin ? 'Marcus Vance' : isHr ? 'Sarah Jenkins' : 'Alex Morgan')}
                </span>
                <ChevronDown size={13} className={`text-slate-500 dark:text-slate-400 transition-transform duration-200 hidden sm:block ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200/90 dark:border-slate-700/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User Header */}
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/70">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Signed in as</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">
                      {user?.name || (isAdmin ? 'Marcus Vance' : isHr ? 'Sarah Jenkins' : 'Alex Morgan')}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {user?.email || (isAdmin ? 'admin@company.com' : isHr ? 'sarah.jenkins@company.com' : 'alex.morgan@company.com')}
                    </p>
                  </div>

                  {/* Menu Actions */}
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate(profileRoute);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer text-left"
                    >
                      <PersonFill size={15} className="text-teal-500" />
                      {isAdmin ? 'System Settings' : isHr ? 'Employee Directory' : 'Profile'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate(settingsRoute);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer text-left"
                    >
                      <GearFill size={15} className="text-blue-500" />
                      Settings
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer text-left"
                    >
                      <BoxArrowRight size={15} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto bg-slate-100 dark:bg-[#0b1120]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;