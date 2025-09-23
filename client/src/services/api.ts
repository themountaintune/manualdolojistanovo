import axios from 'axios';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  PostsResponse,
  Post,
  CategoriesResponse,
  TagsResponse,
  CommentsResponse,
  CreatePostData,
  CreateCommentData,
  CreateCategoryData,
  CreateTagData,
  UpdateProfileData,
  UsersResponse,
  User,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<{ user: User; message: string }> => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
};

// Posts API
export const postsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    published?: boolean;
    category?: string;
    tag?: string;
    search?: string;
  }): Promise<PostsResponse> => {
    const response = await api.get('/posts', { params });
    return response.data;
  },

  getById: async (id: string): Promise<{ post: Post }> => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  getBySlug: async (slug: string): Promise<{ post: Post }> => {
    const response = await api.get(`/posts/slug/${slug}`);
    return response.data;
  },

  create: async (data: CreatePostData): Promise<{ post: Post; message: string }> => {
    const response = await api.post('/posts', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreatePostData>): Promise<{ post: Post; message: string }> => {
    const response = await api.put(`/posts/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },
};

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<CategoriesResponse> => {
    const response = await api.get('/categories');
    return response.data;
  },

  getById: async (id: string): Promise<{ category: any }> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  create: async (data: CreateCategoryData): Promise<{ category: any; message: string }> => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateCategoryData>): Promise<{ category: any; message: string }> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

// Tags API
export const tagsApi = {
  getAll: async (): Promise<TagsResponse> => {
    const response = await api.get('/tags');
    return response.data;
  },

  getById: async (id: string): Promise<{ tag: any }> => {
    const response = await api.get(`/tags/${id}`);
    return response.data;
  },

  create: async (data: CreateTagData): Promise<{ tag: any; message: string }> => {
    const response = await api.post('/tags', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateTagData>): Promise<{ tag: any; message: string }> => {
    const response = await api.put(`/tags/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/tags/${id}`);
    return response.data;
  },
};

// Comments API
export const commentsApi = {
  getByPost: async (postId: string, params?: { page?: number; limit?: number }): Promise<CommentsResponse> => {
    const response = await api.get(`/comments/post/${postId}`, { params });
    return response.data;
  },

  getAll: async (params?: { page?: number; limit?: number; approved?: boolean }): Promise<CommentsResponse> => {
    const response = await api.get('/comments', { params });
    return response.data;
  },

  create: async (data: CreateCommentData): Promise<{ comment: any; message: string }> => {
    const response = await api.post('/comments', data);
    return response.data;
  },

  update: async (id: string, data: { content: string }): Promise<{ comment: any; message: string }> => {
    const response = await api.put(`/comments/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },

  approve: async (id: string): Promise<{ comment: any; message: string }> => {
    const response = await api.put(`/comments/${id}/approve`);
    return response.data;
  },
};

// Users API
export const usersApi = {
  getAll: async (params?: { page?: number; limit?: number; role?: string; search?: string }): Promise<UsersResponse> => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  getById: async (id: string): Promise<{ user: User }> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateRole: async (id: string, role: string): Promise<{ user: User; message: string }> => {
    const response = await api.put(`/users/${id}/role`, { role });
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

export default api;
