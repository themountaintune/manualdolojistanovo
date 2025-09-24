// Sanity CMS Types
export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  caption?: string;
}

export interface SanitySlug {
  _type: 'slug';
  current: string;
}

export interface SanityAuthor {
  _id: string;
  _type: 'author';
  name: string;
  slug: SanitySlug;
  bio?: string;
  avatar?: SanityImage;
  social?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface SanityCategory {
  _id: string;
  _type: 'category';
  title: string;
  slug: SanitySlug;
  description?: string;
  color?: string;
}

export interface SanityTag {
  _id: string;
  _type: 'tag';
  title: string;
  slug: SanitySlug;
}

export interface SanityPost {
  _id: string;
  _type: 'post';
  title: string;
  slug: SanitySlug;
  excerpt?: string;
  content: any[]; // Portable Text
  featuredImage?: SanityImage;
  author: SanityAuthor;
  categories: SanityCategory[];
  tags: SanityTag[];
  publishedAt: string;
  _createdAt: string;
  _updatedAt: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export interface SanityPage {
  _id: string;
  _type: 'page';
  title: string;
  slug: SanitySlug;
  content: any[]; // Portable Text
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}
