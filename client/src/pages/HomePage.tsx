import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Calendar, User, MessageCircle, Tag, Search } from 'lucide-react';
import { format } from 'date-fns';
import { postsApi, categoriesApi } from '../services/api';
import PostCard from '../components/PostCard';
import CategoryCard from '../components/CategoryCard';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['posts', { search: searchTerm, category: selectedCategory }],
    queryFn: () => postsApi.getAll({
      published: true,
      search: searchTerm || undefined,
      category: selectedCategory || undefined,
      limit: 12
    }),
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the query key change
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-light mb-8 text-gray-900" style={{letterSpacing: '-0.02em'}}>
            ManualDolojista
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-600 font-light max-w-2xl mx-auto" style={{letterSpacing: '-0.01em'}}>
            Discover stories, insights, and knowledge from our community
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                style={{letterSpacing: '-0.01em'}}
              />
            </div>
          </form>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-900 mb-4" style={{letterSpacing: '-0.02em'}}>
              Explore Categories
            </h2>
            <p className="text-lg text-gray-600 font-light">
              Find content that interests you most
            </p>
          </div>

          {categoriesLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categoriesData?.categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onClick={() => setSelectedCategory(selectedCategory === category.slug ? '' : category.slug)}
                  isSelected={selectedCategory === category.slug}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Posts Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-3xl font-light text-gray-900 mb-4" style={{letterSpacing: '-0.02em'}}>
                Latest Posts
              </h2>
              <p className="text-lg text-gray-600 font-light">
                {selectedCategory 
                  ? `Posts in ${categoriesData?.categories.find(c => c.slug === selectedCategory)?.name}`
                  : 'Discover the latest stories and insights'
                }
              </p>
            </div>
            
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory('')}
                className="btn btn-outline"
              >
                Clear Filter
              </button>
            )}
          </div>

          {postsLoading ? (
            <LoadingSpinner />
          ) : postsData?.posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No posts found
              </h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory 
                  ? 'Try adjusting your search or filter criteria'
                  : 'No posts have been published yet'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {postsData?.posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {postsData?.posts.length && postsData.posts.length >= 12 && (
            <div className="text-center mt-12">
              <button className="btn btn-primary btn-lg">
                Load More Posts
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
