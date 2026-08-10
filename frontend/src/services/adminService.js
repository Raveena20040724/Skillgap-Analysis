import api from './api';

export const adminService = {
  getSystemStats: () => api.get('/admin/stats/'),
  getAllUsers: () => api.get('/admin/users/'),
  updateUserStatus: (id, status) => api.patch(`/admin/users/${id}/`, { status }),
};