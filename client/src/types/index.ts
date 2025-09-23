export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  role: 'USER' | 'EDITOR' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
  _count?: {
    posts: number;
    comments: number;
  };
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author: User;
  categories: PostCategory[];
  tags: PostTag[];
  comments?: Comment[];
  _count?: {
    comments: number;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    posts: number;
  };
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    posts: number;
  };
}

export interface Comment {
  id: string;
  content: string;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
  author: User;
  postId: string;
}

export interface PostCategory {
  postId: string;
  categoryId: string;
  category: Category;
}

export interface PostTag {
  postId: string;
  tagId: string;
  tag: Tag;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  pagination?: Pagination;
}

export interface PostsResponse {
  posts: Post[];
  pagination: Pagination;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface TagsResponse {
  tags: Tag[];
}

export interface CommentsResponse {
  comments: Comment[];
  pagination: Pagination;
}

export interface UsersResponse {
  users: User[];
  pagination: Pagination;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  published?: boolean;
  categoryIds?: string[];
  tagIds?: string[];
}

export interface CreateCommentData {
  content: string;
  postId: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  color?: string;
}

export interface CreateTagData {
  name: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
}
