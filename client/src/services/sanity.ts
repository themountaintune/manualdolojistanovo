import { client } from '../../lib/sanity';
import type { SanityPost, SanityCategory, SanityAuthor } from '../types/sanity';

// GROQ queries
const POSTS_QUERY = `
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    content,
    featuredImage,
    author->{
      _id,
      name,
      slug,
      bio,
      avatar
    },
    categories[]->{
      _id,
      title,
      slug,
      description,
      color
    },
    tags[]->{
      _id,
      title,
      slug
    },
    publishedAt,
    _createdAt,
    _updatedAt,
    seo
  }
`;

const POST_BY_SLUG_QUERY = `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    content,
    featuredImage,
    author->{
      _id,
      name,
      slug,
      bio,
      avatar,
      social
    },
    categories[]->{
      _id,
      title,
      slug,
      description,
      color
    },
    tags[]->{
      _id,
      title,
      slug
    },
    publishedAt,
    _createdAt,
    _updatedAt,
    seo
  }
`;

const CATEGORIES_QUERY = `
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    color
  }
`;

const AUTHORS_QUERY = `
  *[_type == "author"] | order(name asc) {
    _id,
    name,
    slug,
    bio,
    avatar,
    social
  }
`;

// API functions
export const sanityApi = {
  // Get all posts
  async getPosts(): Promise<SanityPost[]> {
    try {
      const posts = await client.fetch(POSTS_QUERY);
      return posts || [];
    } catch (error) {
      console.error('Error fetching posts from Sanity:', error);
      return [];
    }
  },

  // Get post by slug
  async getPostBySlug(slug: string): Promise<SanityPost | null> {
    try {
      const post = await client.fetch(POST_BY_SLUG_QUERY, { slug });
      return post || null;
    } catch (error) {
      console.error('Error fetching post from Sanity:', error);
      return null;
    }
  },

  // Get all categories
  async getCategories(): Promise<SanityCategory[]> {
    try {
      const categories = await client.fetch(CATEGORIES_QUERY);
      return categories || [];
    } catch (error) {
      console.error('Error fetching categories from Sanity:', error);
      return [];
    }
  },

  // Get all authors
  async getAuthors(): Promise<SanityAuthor[]> {
    try {
      const authors = await client.fetch(AUTHORS_QUERY);
      return authors || [];
    } catch (error) {
      console.error('Error fetching authors from Sanity:', error);
      return [];
    }
  },

  // Get posts by category
  async getPostsByCategory(categorySlug: string): Promise<SanityPost[]> {
    try {
      const query = `
        *[_type == "post" && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(publishedAt desc) {
          _id,
          title,
          slug,
          excerpt,
          content,
          featuredImage,
          author->{
            _id,
            name,
            slug,
            bio,
            avatar
          },
          categories[]->{
            _id,
            title,
            slug,
            description,
            color
          },
          tags[]->{
            _id,
            title,
            slug
          },
          publishedAt,
          _createdAt,
          _updatedAt,
          seo
        }
      `;
      const posts = await client.fetch(query, { categorySlug });
      return posts || [];
    } catch (error) {
      console.error('Error fetching posts by category from Sanity:', error);
      return [];
    }
  },

  // Get posts by author
  async getPostsByAuthor(authorSlug: string): Promise<SanityPost[]> {
    try {
      const query = `
        *[_type == "post" && author->slug.current == $authorSlug] | order(publishedAt desc) {
          _id,
          title,
          slug,
          excerpt,
          content,
          featuredImage,
          author->{
            _id,
            name,
            slug,
            bio,
            avatar
          },
          categories[]->{
            _id,
            title,
            slug,
            description,
            color
          },
          tags[]->{
            _id,
            title,
            slug
          },
          publishedAt,
          _createdAt,
          _updatedAt,
          seo
        }
      `;
      const posts = await client.fetch(query, { authorSlug });
      return posts || [];
    } catch (error) {
      console.error('Error fetching posts by author from Sanity:', error);
      return [];
    }
  }
};
