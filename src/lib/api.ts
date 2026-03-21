import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';


const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// Attach JWT token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('azv_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      const isLoginRequest = err.config?.url?.includes('/auth/login');
      const isLoginPage = window.location.pathname.includes('/auth/login');

      if (!isLoginRequest && !isLoginPage) {
        localStorage.removeItem('azv_token');
        localStorage.removeItem('azv_user');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(err);
  }
);

// Auth
export const authApi = {
  register: (data: Record<string, unknown>) => api.post('/auth/register', data),
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
};

// Dashboard
export const dashboardApi = {
  get: () => api.get('/dashboard'),
  markRead: (id: string) => api.patch(`/dashboard/notifications/${id}/read`),
};

// Applications
export const applicationsApi = {
  apply: (projectId: string) => api.post('/applications', { projectId }),
  myApplications: () => api.get('/applications/my'),
};

// Projects
export const projectsApi = {
  getAll: (params?: Record<string, unknown>) => api.get('/projects', { params }),
  getById: (id: string) => api.get(`/projects/${id}`),
};

// Admin
export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params?: Record<string, unknown>) => api.get('/admin/users', { params }),
  updateUserStatus: (id: string, status: string) =>
    api.patch(`/admin/users/${id}/status`, { status }),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  getProjects: (params?: Record<string, unknown>) => api.get('/admin/projects', { params }),
  createProject: (data: Record<string, unknown>) => api.post('/admin/projects', data),
  deleteProject: (id: string) => api.delete(`/admin/projects/${id}`),
  getApplications: (params?: Record<string, unknown>) =>
    api.get('/admin/applications', { params }),
  updateApplicationStatus: (id: string, status: string) =>
    api.patch(`/admin/applications/${id}/status`, { status }),
  listFiles: () => api.get('/admin/files'),
  downloadFile: (fileName: string) =>
    api.get(`/admin/files/${fileName}`, { responseType: 'blob' }),
};

export default api;
