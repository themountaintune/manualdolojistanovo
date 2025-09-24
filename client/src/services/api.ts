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
    title: 'Como Começar um E-commerce no Brasil: Guia Completo 2024',
    slug: 'como-comecar-ecommerce-brasil-2024',
    content: 'Descubra os passos essenciais para criar e lançar sua loja virtual no mercado brasileiro, desde a escolha da plataforma até as estratégias de marketing.',
    excerpt: 'Descubra os passos essenciais para criar e lançar sua loja virtual no mercado brasileiro, desde a escolha da plataforma até as estratégias de marketing.',
    featuredImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop&crop=center',
    published: true,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: {
      id: '1',
      email: 'admin@manualdolojista.com',
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
    title: 'Marketing Digital para Lojas Virtuais: Estratégias que Funcionam',
    slug: 'marketing-digital-lojas-virtuais-estrategias',
    content: 'Aprenda as melhores estratégias de marketing digital para impulsionar suas vendas online e aumentar a visibilidade da sua loja virtual.',
    excerpt: 'Aprenda as melhores estratégias de marketing digital para impulsionar suas vendas online e aumentar a visibilidade da sua loja virtual.',
    featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&crop=center',
    published: true,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: {
      id: '2',
      email: 'editor@manualdolojista.com',
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
    title: '10 Dicas para Aumentar as Vendas do seu E-commerce',
    slug: '10-dicas-aumentar-vendas-ecommerce',
    content: 'Descubra 10 dicas práticas para aumentar suas vendas online e maximizar o potencial da sua loja virtual no mercado brasileiro.',
    excerpt: 'Descubra 10 dicas práticas para aumentar suas vendas online e maximizar o potencial da sua loja virtual no mercado brasileiro.',
    featuredImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop&crop=center',
    published: true,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: {
      id: '3',
      email: 'user@manualdolojista.com',
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
  },
  {
    id: '4',
    title: 'Plataformas de E-commerce: Qual Escolher para seu Negócio?',
    slug: 'plataformas-ecommerce-qual-escolher',
    content: 'Compare as principais plataformas de e-commerce disponíveis no Brasil e descubra qual é a melhor opção para o seu negócio.',
    excerpt: 'Compare as principais plataformas de e-commerce disponíveis no Brasil e descubra qual é a melhor opção para o seu negócio.',
    featuredImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=400&fit=crop&crop=center',
    published: true,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: {
      id: '4',
      email: 'designer@manualdolojista.com',
      username: 'designer',
      firstName: 'Design',
      lastName: 'Expert',
      role: 'EDITOR' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    categories: [],
    tags: [],
    _count: { comments: 0 }
  },
  {
    id: '5',
    title: 'O Futuro do E-commerce no Brasil: Tendências 2024',
    slug: 'futuro-ecommerce-brasil-tendencias-2024',
    content: 'Explore as principais tendências do comércio eletrônico no Brasil e prepare seu negócio para o futuro do mercado digital.',
    excerpt: 'Explore as principais tendências do comércio eletrônico no Brasil e prepare seu negócio para o futuro do mercado digital.',
    featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&crop=center',
    published: true,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: {
      id: '5',
      email: 'ai@manualdolojista.com',
      username: 'ai_expert',
      firstName: 'AI',
      lastName: 'Researcher',
      role: 'ADMIN' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    categories: [],
    tags: [],
    _count: { comments: 0 }
  },
  {
    id: '6',
    title: 'Como Melhorar a Experiência do Cliente na sua Loja Virtual',
    slug: 'melhorar-experiencia-cliente-loja-virtual',
    content: 'Aprenda estratégias essenciais para criar uma experiência excepcional para seus clientes e aumentar a fidelização.',
    excerpt: 'Aprenda estratégias essenciais para criar uma experiência excepcional para seus clientes e aumentar a fidelização.',
    featuredImage: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop&crop=center',
    published: true,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: {
      id: '6',
      email: 'ux@manualdolojista.com',
      username: 'ux_designer',
      firstName: 'UX',
      lastName: 'Designer',
      role: 'EDITOR' as const,
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