import { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Trash2, 
  Filter, 
  Sparkles, 
  BookOpen, 
  Award, 
  FileText, 
  ChevronRight, 
  Zap, 
  CheckCheck, 
  X,
  ShieldCheck,
  Users,
  PieChart
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../context/AuthContext';

const getInitialNotificationsByRole = (role) => {
  if (role === 'admin') {
    return [
      {
        id: 'adm_1',
        title: 'System Security Audit Clean',
        message: 'Zero vulnerability anomalies detected in RBAC permission tables and user authentication tables.',
        category: 'Security & RBAC',
        time: '5 minutes ago',
        date: '2026-08-18',
        read: false,
        type: 'security',
        link: ROUTES.ADMIN_SETTINGS,
        actionLabel: 'View System Settings',
      },
      {
        id: 'adm_2',
        title: 'New HR Manager Account Created',
        message: 'Sarah Jenkins registered under People Operations department and granted workforce access.',
        category: 'User Management',
        time: '1 hour ago',
        date: '2026-08-18',
        read: false,
        type: 'user',
        link: ROUTES.ADMIN_USERS,
        actionLabel: 'Inspect HR Directory',
      },
      {
        id: 'adm_3',
        title: 'Gemini AI Telemetry Status: Optimal',
        message: 'AI inference endpoint latency is within healthy benchmark (142ms) across 284k tokens today.',
        category: 'AI Telemetry',
        time: '3 hours ago',
        date: '2026-08-18',
        read: false,
        type: 'ai',
        link: ROUTES.ADMIN_REPORTS,
        actionLabel: 'View AI Reports',
      },
      {
        id: 'adm_4',
        title: 'RBAC Policy Matrix Synchronized',
        message: 'Custom roles and permission matrices successfully updated in organizational cache.',
        category: 'Security & RBAC',
        time: 'Yesterday at 5:00 PM',
        date: '2026-08-17',
        read: true,
        type: 'security',
        link: ROUTES.ADMIN_ROLES,
        actionLabel: 'Manage Roles & Access',
      },
    ];
  }

  if (role === 'hr') {
    return [
      {
        id: 'hr_1',
        title: 'New Assessment Submissions (12)',
        message: 'Engineering department members submitted quarterly skill gap assessments.',
        category: 'Assessments',
        time: '15 minutes ago',
        date: '2026-08-18',
        read: false,
        type: 'assessment',
        link: ROUTES.HR_REPORTS,
        actionLabel: 'View Skill Reports',
      },
      {
        id: 'hr_2',
        title: 'Talent Readiness Report Ready',
        message: 'Organizational skill readiness indexed at 83.4% across 342 active employee profiles.',
        category: 'Skill Gap & AI',
        time: '2 hours ago',
        date: '2026-08-18',
        read: false,
        type: 'ai',
        link: ROUTES.HR_REPORTS,
        actionLabel: 'Download HR Audit',
      },
      {
        id: 'hr_3',
        title: 'New Employee Profile Enrolled',
        message: 'Alex Morgan registered under Senior Frontend Engineer pathway.',
        category: 'Directory',
        time: '4 hours ago',
        date: '2026-08-18',
        read: false,
        type: 'user',
        link: ROUTES.HR_DIRECTORY,
        actionLabel: 'View Employee Profile',
      },
    ];
  }

  return [
    {
      id: 'emp_1',
      title: 'AI Skill Gap Analysis Ready',
      message: 'Your latest skill assessment has been processed by AI telemetry. 4 skill gaps identified for Senior Frontend Developer role.',
      category: 'Skill Gap & AI',
      time: '10 minutes ago',
      date: '2026-08-18',
      read: false,
      type: 'ai',
      link: ROUTES.SKILL_GAP_RESULTS,
      actionLabel: 'View Skill Gap Results',
    },
    {
      id: 'emp_2',
      title: 'New Recommended Course Added',
      message: 'Advanced React Design Systems & Micro-frontends course added to your personalized learning pathway.',
      category: 'Courses & Path',
      time: '1 hour ago',
      date: '2026-08-18',
      read: false,
      type: 'course',
      link: ROUTES.COURSE_RECOMMENDATIONS,
      actionLabel: 'Explore Courses',
    },
    {
      id: 'emp_3',
      title: 'Resume Successfully Parsed',
      message: 'CV telemetry updated. 8 technical skills extracted and automatically synced into your live profile.',
      category: 'Skill Gap & AI',
      time: '2 hours ago',
      date: '2026-08-18',
      read: false,
      type: 'resume',
      link: ROUTES.RESUME_UPLOAD,
      actionLabel: 'View Active Resume',
    },
    {
      id: 'emp_4',
      title: 'Quarterly Assessment Due',
      message: 'Frontend Architecture & State Management assessment is scheduled for completion before Aug 15.',
      category: 'Assessments',
      time: 'Yesterday at 4:30 PM',
      date: '2026-08-17',
      read: true,
      type: 'assessment',
      link: ROUTES.SKILL_ASSESSMENT,
      actionLabel: 'Take Assessment',
    },
    {
      id: 'emp_5',
      title: 'Career Match Score Increase (+12%)',
      message: 'Congratulations! Your profile match score for Senior Web Architect role increased from 74% to 86%.',
      category: 'Skill Gap & AI',
      time: '2 days ago',
      date: '2026-08-16',
      read: true,
      type: 'career',
      link: ROUTES.CAREER_RECOMMENDATIONS,
      actionLabel: 'View Career Path',
    },
    {
      id: 'emp_6',
      title: 'Learning Milestone Reached',
      message: 'You have completed 75% of your React & TypeScript mastery roadmap!',
      category: 'Courses & Path',
      time: '3 days ago',
      date: '2026-08-15',
      read: true,
      type: 'course',
      link: ROUTES.LEARNING_PATH,
      actionLabel: 'View Learning Path',
    },
  ];
};

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userRole = user?.role || localStorage.getItem('user_role') || (user?.username === 'admin' ? 'admin' : user?.username?.includes('hr') ? 'hr' : 'employee');
  const storageKey = `skillbridge_notifications_${userRole}`;

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    const initial = getInitialNotificationsByRole(userRole);
    localStorage.setItem(storageKey, JSON.stringify(initial));
    return initial;
  });

  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [bannerMsg, setBannerMsg] = useState('');

  // Persist notifications on state change
  const saveNotifications = (newList) => {
    setNotifications(newList);
    localStorage.setItem(storageKey, JSON.stringify(newList));
  };

  // When user leaves / navigates outside of notification page, mark all messages as read so all NEW tags disappear!
  useEffect(() => {
    return () => {
      const current = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (Array.isArray(current) && current.length > 0) {
        const allRead = current.map(n => ({ ...n, read: true }));
        localStorage.setItem(storageKey, JSON.stringify(allRead));
      }
    };
  }, [storageKey]);

  const showBanner = (msg) => {
    setBannerMsg(msg);
    setTimeout(() => setBannerMsg(''), 3000);
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
    showBanner('All notifications marked as read.');
  };

  const handleClearAll = () => {
    saveNotifications([]);
    showBanner('Notification inbox cleared.');
  };

  const handleToggleRead = (id, e) => {
    e.stopPropagation();
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n));
    saveNotifications(updated);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    const updated = notifications.filter((n) => n.id !== id);
    saveNotifications(updated);
    if (selectedNotification?.id === id) setSelectedNotification(null);
    showBanner('Notification removed.');
  };

  // Touching/clicking the message removes the "NEW" badge on that exact message immediately
  const handleNotificationClick = (item) => {
    const updated = notifications.map((n) => (n.id === item.id ? { ...n, read: true } : n));
    saveNotifications(updated);
    setSelectedNotification({ ...item, read: true });
  };

  // Dynamic Categories based on current role's notifications
  const uniqueCategories = ['All', 'Unread', ...Array.from(new Set(notifications.map(n => n.category)))];

  // Filtered list
  const filteredNotifications = notifications.filter((item) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Unread') return !item.read;
    return item.category === activeCategory;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'security':
        return <ShieldCheck className="w-5 h-5 text-purple-500" />;
      case 'user':
        return <Users className="w-5 h-5 text-blue-500" />;
      case 'ai':
      case 'career':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'course':
        return <BookOpen className="w-5 h-5 text-teal-500" />;
      case 'assessment':
        return <Award className="w-5 h-5 text-indigo-500" />;
      case 'resume':
        return <FileText className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-teal-500" />;
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-600/10 via-teal-600/10 to-indigo-600/10 dark:from-blue-500/20 dark:via-teal-500/20 dark:to-indigo-500/20 p-6 rounded-3xl border border-blue-500/20 dark:border-blue-500/30">
        <div>
          <PageHeader
            title={
              <span className="flex items-center gap-2.5 text-slate-900 dark:text-white font-black text-2xl md:text-3xl">
                <Bell className="w-8 h-8 text-blue-600 dark:text-teal-400 stroke-[2.2]" />
                Notifications Center ({unreadCount} new)
              </span>
            }
            subtitle="Stay updated on platform alerts, telemetry reports, and system insights."
          />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2.5 bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <CheckCheck className="w-4 h-4" />
              Mark All Read
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 hover:bg-rose-100 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Banner Feedback */}
      {bannerMsg && (
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-200 rounded-2xl text-xs font-bold shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          {bannerMsg}
        </div>
      )}

      {/* Filter Tabs Toolbar */}
      <Card className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {uniqueCategories.map((cat) => {
            const count =
              cat === 'All'
                ? notifications.length
                : cat === 'Unread'
                ? unreadCount
                : notifications.filter((n) => n.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] ${
                    activeCategory === cat
                      ? 'bg-blue-700 text-blue-100'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2 border-slate-300 dark:border-slate-800 rounded-3xl">
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No notifications found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                You are all caught up! There are no notifications in "{activeCategory}".
              </p>
            </div>
          </Card>
        ) : (
          filteredNotifications.map((item) => (
            <Card
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-5 border rounded-3xl transition-all duration-200 cursor-pointer group hover:border-blue-500/50 ${
                !item.read
                  ? 'bg-white dark:bg-slate-900/90 border-blue-500/30 dark:border-blue-500/40 shadow-md'
                  : 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/80 opacity-85'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Category Icon Badge */}
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shrink-0">
                    {getIcon(item.type)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        {item.category}
                      </span>
                      {!item.read && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-500 text-white animate-pulse">
                          NEW
                        </span>
                      )}
                      <span className="text-[11px] font-semibold text-slate-400">
                        {item.time}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-teal-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  {item.link && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNotificationClick(item);
                        navigate(item.link);
                      }}
                      className="px-4 py-2 bg-blue-600/10 hover:bg-blue-600 text-blue-600 hover:text-white dark:text-blue-400 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{item.actionLabel || 'View Detail'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    title="Delete Notification"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Selected Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 rounded-xl">
                  {getIcon(selectedNotification.type)}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-blue-600 dark:text-blue-400">
                    {selectedNotification.category}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">
                    {selectedNotification.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedNotification(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedNotification.message}
              </p>

              <p className="text-[11px] font-semibold text-slate-400">
                Received: {selectedNotification.time} ({selectedNotification.date})
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                onClick={() => setSelectedNotification(null)}
              >
                Close
              </Button>
              {selectedNotification.link && (
                <Button
                  variant="primary"
                  onClick={() => {
                    const targetLink = selectedNotification.link;
                    setSelectedNotification(null);
                    navigate(targetLink);
                  }}
                >
                  {selectedNotification.actionLabel || 'Navigate To Page'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
