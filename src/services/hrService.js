import api from './api';

export const hrService = {
  getOverviewStats: () => api.get('/hr/overview/'),
  getTeamSkillGaps: () => api.get('/hr/team-skill-gaps/'),
  getEmployees: () => api.get('/hr/employees/'),
};