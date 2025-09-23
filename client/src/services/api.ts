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

// Use environment variable or fallback to local API
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? 'https://your-vercel-app.vercel.app/api' : '/api');

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

// Mock data for demo purposes when API is not available
const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Getting Started with React and TypeScript',
    slug: 'getting-started-with-react-and-typescript',
    content: 'Learn how to set up and use React with TypeScript for better development experience and type safety.',
    excerpt: 'Learn how to set up and use React with TypeScript for better development experience and type safety.',
    published: true,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: {
      id: '1',
      email: 'admin@example.com',
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    categories: [],
    tags: [],
    _count: { comments: 0 }
  },
  {
    id: '2',
    title: 'Building Scalable Node.js Applications',
    slug: 'building-scalable-nodejs-applications',
    content: 'Learn best practices for building scalable and maintainable Node.js applications.',
    excerpt: 'Learn best practices for building scalable and maintainable Node.js applications.',
    published: true,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: {
      id: '2',
      email: 'editor@example.com',
      username: 'editor',
      firstName: 'Editor',
      lastName: 'User',
      role: 'EDITOR' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    categories: [],
    tags: [],
    _count: { comments: 0 }
  },
  {
    id: '3',
    title: '10 Productivity Tips for Developers',
    slug: '10-productivity-tips-for-developers',
    content: 'Discover 10 practical tips to boost your productivity as a developer and work more efficiently.',
    excerpt: 'Discover 10 practical tips to boost your productivity as a developer and work more efficiently.',
    published: true,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: {
      id: '3',
      email: 'user@example.com',
      username: 'user',
      firstName: 'Regular',
      lastName: 'User',
      role: 'USER' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    categories: [],
    tags: [],
    _count: { comments: 0 }
  }
];

const mockCategories = [
  { id: '1', name: 'Technology', slug: 'technology', description: 'Posts about technology and programming', color: '#0ea5e9', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), _count: { posts: 2 } },
  { id: '2', name: 'Lifestyle', slug: 'lifestyle', description: 'Posts about lifestyle and personal development', color: '#10b981', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), _count: { posts: 1 } },
  { id: '3', name: 'Business', slug: 'business', description: 'Posts about business and entrepreneurship', color: '#f59e0b', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), _count: { posts: 0 } },
  { id: '4', name: 'Design', slug: 'design', description: 'Posts about design and creativity', color: '#8b5cf6', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), _count: { posts: 0 } }
];

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
    try {
      const response = await api.get('/posts', { params });
      return response.data;
    } catch (error) {
      // Return mock data if API is not available
      console.warn('API not available, using mock data');
      return {
        posts: mockPosts,
        pagination: {
          page: 1,
          limit: 10,
          total: mockPosts.length,
          pages: 1
        }
      };
    }
  },

  getById: async (id: string): Promise<{ post: Post }> => {
    try {
      const response = await api.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      const post = mockPosts.find(p => p.id === id);
      if (!post) throw new Error('Post not found');
      return { post };
    }
  },

  getBySlug: async (slug: string): Promise<{ post: Post }> => {
    try {
      const response = await api.get(`/posts/slug/${slug}`);
      return response.data;
    } catch (error) {
      const post = mockPosts.find(p => p.slug === slug);
      if (!post) throw new Error('Post not found');
      return { post };
    }
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
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      // Return mock data if API is not available
      console.warn('API not available, using mock categories');
      return { categories: mockCategories };
    }
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

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      // Mock login for demo
      if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
        const user = {
          id: '1',
          email: 'admin@example.com',
          username: 'admin',
          firstName: 'Admin',
          lastName: 'User',
          role: 'ADMIN' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const token = 'mock-jwt-token';
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return { user, token, message: 'Login successful' };
      }
      throw error;
    }
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getProfile: async (): Promise<{ user: User }> => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) throw new Error('Not authenticated');
      return { user };
    }
  },

  updateProfile: async (data: UpdateProfileData): Promise<{ user: User; message: string }> => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
};

// Tags API
export const tagsApi = {
  getAll: async (): Promise<TagsResponse> => {
    try {
      const response = await api.get('/tags');
      return response.data;
    } catch (error) {
      return { tags: [] };
    }
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
    try {
      const response = await api.get(`/comments/post/${postId}`, { params });
      return response.data;
    } catch (error) {
      return { comments: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } };
    }
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