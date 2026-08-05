import api from './api';

export const courseService = {
  getRecommendedCourses: () => api.get('/employee/courses/'),
};