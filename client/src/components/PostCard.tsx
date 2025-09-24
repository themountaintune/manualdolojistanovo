import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Tag } from 'lucide-react';
import { format } from 'date-fns';
import type { Post } from '../types';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <article className="card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full flex flex-col">
      {post.featuredImage && (
        <Link to={`/post/${post.slug}`} className="block">
          <div className="aspect-video overflow-hidden">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        </Link>
      )}
      
      <div className="card-content flex flex-col flex-grow">
        {/* Categories */}
        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories.slice(0, 2).map((postCategory) => (
              <span
                key={postCategory.categoryId}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                style={{
                  backgroundColor: postCategory.category.color ? `${postCategory.category.color}20` : undefined,
                  color: postCategory.category.color || undefined,
                }}
              >
                {postCategory.category.name}
              </span>
            ))}
            {post.categories.length > 2 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                +{post.categories.length - 2} more
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-medium text-gray-900 mb-3 line-clamp-2" style={{letterSpacing: '-0.02em'}}>
          <Link
            to={`/post/${post.slug}`}
            className="hover:text-primary-600 transition-colors"
          >
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-2">
            {post.excerpt}
          </p>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.slice(0, 3).map((postTag) => (
              <span
                key={postTag.tagId}
                className="inline-flex items-center text-xs text-gray-500 hover:text-primary-600 transition-colors"
              >
                <Tag className="h-3 w-3 mr-1" />
                {postTag.tag.name}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
          <div className="flex items-center">
            {post.author.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.username}
                className="h-5 w-5 rounded-full mr-2"
              />
            ) : (
              <User className="h-4 w-4 mr-2" />
            )}
            <span>{post.author.username}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>
              {post.publishedAt 
                ? format(new Date(post.publishedAt), 'MMM d, yyyy')
                : format(new Date(post.createdAt), 'MMM d, yyyy')
              }
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
