import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

// Auth pages
import EmployeeLogin from '../pages/auth/EmployeeLogin';
import EmployeeRegister from '../pages/auth/EmployeeRegister';
import HrLogin from '../pages/auth/HrLogin';
import AdminLogin from '../pages/auth/AdminLogin';

// Employee pages
import EmployeeDashboard from '../pages/employee/EmployeeDashboard';
import EmployeeProfile from '../pages/employee/EmployeeProfile';
import SkillsManagement from '../pages/employee/SkillsManagement';
import ExperienceManagement from '../pages/employee/ExperienceManagement';
import ResumeUpload from '../pages/employee/ResumeUpload';
import SkillAssessment from '../pages/employee/SkillAssessment';
import SkillGapResults from '../pages/employee/SkillGapResults';
import CareerRecommendations from '../pages/employee/CareerRecommendations';
import LearningPath from '../pages/employee/LearningPath';
import CourseRecommendations from '../pages/employee/CourseRecommendations';
import ProgressTracking from '../pages/employee/ProgressTracking';

// HR / Admin
import HrDashboard from '../pages/hr/HrDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path={ROUTES.EMPLOYEE_LOGIN} element={<EmployeeLogin />} />
      <Route path={ROUTES.EMPLOYEE_REGISTER} element={<EmployeeRegister />} />
      <Route path={ROUTES.HR_LOGIN} element={<HrLogin />} />
      <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />

      {/* Protected - Employee (nested inside DashboardLayout) */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.EMPLOYEE_DASHBOARD} element={<EmployeeDashboard />} />
        <Route path={ROUTES.EMPLOYEE_PROFILE} element={<EmployeeProfile />} />
        <Route path={ROUTES.SKILLS_MANAGEMENT} element={<SkillsManagement />} />
        <Route path={ROUTES.EXPERIENCE_MANAGEMENT} element={<ExperienceManagement />} />
        <Route path={ROUTES.RESUME_UPLOAD} element={<ResumeUpload />} />
        <Route path={ROUTES.SKILL_ASSESSMENT} element={<SkillAssessment />} />
        <Route path={ROUTES.SKILL_GAP_RESULTS} element={<SkillGapResults />} />
        <Route path={ROUTES.CAREER_RECOMMENDATIONS} element={<CareerRecommendations />} />
        <Route path={ROUTES.LEARNING_PATH} element={<LearningPath />} />
        <Route path={ROUTES.COURSE_RECOMMENDATIONS} element={<CourseRecommendations />} />
        <Route path={ROUTES.PROGRESS_TRACKING} element={<ProgressTracking />} />
      </Route>

      {/* HR / Admin - kept separate for now */}
      <Route path={ROUTES.HR_DASHBOARD} element={<ProtectedRoute><HrDashboard /></ProtectedRoute>} />
      <Route path={ROUTES.ADMIN_DASHBOARD} element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

      {/* Default */}
      <Route path="/" element={<EmployeeLogin />} />
    </Routes>
  );
};

export default AppRoutes;