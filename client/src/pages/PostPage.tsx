import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, User, MessageCircle, Tag, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { postsApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import JsonLd from '../components/JsonLd';
import Head from '../components/Head';
import OptimizedImage from '../components/OptimizedImage';
import { scrollToTop } from '../utils/scrollToTop';

const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: postData, isLoading, error } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => postsApi.getBySlug(slug!),
    enabled: !!slug,
  });

  // Scroll to top when component mounts or slug changes
  useEffect(() => {
    scrollToTop('instant');
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !postData?.post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
          <p className="text-gray-600 mb-4">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const { post } = postData;

  // JSON-LD structured data for SEO
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt || post.content.substring(0, 160),
    "image": post.featuredImage ? [post.featuredImage] : [],
    "datePublished": post.publishedAt || post.createdAt,
    "dateModified": post.updatedAt || post.publishedAt || post.createdAt,
    "author": {
      "@type": "Person",
      "name": post.author.username,
      "url": `https://manualdolojistanovo.vercel.app/author/${post.author.username}`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Manual do Lojista",
      "url": "https://manualdolojistanovo.vercel.app",
      "logo": {
        "@type": "ImageObject",
        "url": "https://manualdolojistanovo.vercel.app/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://manualdolojistanovo.vercel.app/post/${post.slug}`
    },
    "url": `https://manualdolojistanovo.vercel.app/post/${post.slug}`,
    "articleSection": post.categories.map(cat => cat.category.name).join(", "),
    "keywords": post.tags.map(tag => tag.tag.name).join(", ")
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dynamic Meta Tags */}
      <Head
        title={`${post.title} | Manual do Lojista`}
        description={post.excerpt || post.content.substring(0, 160)}
        image={post.featuredImage || 'https://manualdolojistanovo.vercel.app/og-default.jpg'}
        url={`https://manualdolojistanovo.vercel.app/post/${post.slug}`}
        type="article"
      />
      
      {/* JSON-LD Structured Data */}
      <JsonLd data={jsonLdData} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Posts
        </Link>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="aspect-video overflow-hidden rounded-lg mb-8">
            <OptimizedImage
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
              priority={true}
              width={1200}
              height={675}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
        )}

        {/* Post Header */}
        <header className="mb-8">
          {/* Categories */}
          {post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((postCategory) => (
                <span
                  key={postCategory.categoryId}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                  style={{
                    backgroundColor: postCategory.category.color ? `${postCategory.category.color}20` : undefined,
                    color: postCategory.category.color || undefined,
                  }}
                >
                  {postCategory.category.name}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
            <div className="flex items-center">
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.username}
                  className="h-8 w-8 rounded-full mr-3"
                />
              ) : (
                <User className="h-5 w-5 mr-2" />
              )}
              <span className="font-medium text-gray-900">{post.author.username}</span>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>
                {post.publishedAt 
                  ? format(new Date(post.publishedAt), 'MMMM d, yyyy')
                  : format(new Date(post.createdAt), 'MMMM d, yyyy')
                }
              </span>
            </div>
            
            {post._count?.comments !== undefined && (
              <div className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                <span>{post._count.comments} comments</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((postTag) => (
                <span
                  key={postTag.tagId}
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {postTag.tag.name}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Post Content */}
        <article className="prose prose-lg max-w-none">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={tomorrow}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>

        {/* Author Bio */}
        {post.author.bio && (
          <div className="mt-12 p-6 bg-white rounded-lg border border-gray-200">
            <div className="flex items-start space-x-4">
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.username}
                  className="h-16 w-16 rounded-full"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary-600" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  About {post.author.username}
                </h3>
                <p className="text-gray-600">{post.author.bio}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PostPage;
