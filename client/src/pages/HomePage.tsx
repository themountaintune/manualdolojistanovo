import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Calendar, User, MessageCircle, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { postsApi, categoriesApi } from '../services/api';
import PostCard from '../components/PostCard';
import CategoryCard from '../components/CategoryCard';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['posts', { category: selectedCategory }],
    queryFn: () => postsApi.getAll({
      published: true,
      category: selectedCategory || undefined,
      limit: 12
    }),
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-primary-50 py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary-100 rounded-full opacity-20 blur-xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-blue-100 rounded-full opacity-30 blur-lg"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-purple-100 rounded-full opacity-25 blur-md"></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl md:text-8xl font-light mb-6 text-gray-900" style={{letterSpacing: '-0.03em'}}>
            ManualDolojista
          </h1>
          
          <p className="text-2xl md:text-3xl mb-8 text-gray-600 font-light max-w-3xl mx-auto leading-relaxed" style={{letterSpacing: '-0.01em'}}>
            Откройте мир знаний через наши истории и инсайты
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <div className="flex items-center text-gray-500">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
              <span className="text-sm font-medium">Современные технологии</span>
            </div>
            <div className="flex items-center text-gray-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-sm font-medium">Практические советы</span>
            </div>
            <div className="flex items-center text-gray-500">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <span className="text-sm font-medium">Инновационные идеи</span>
            </div>
          </div>
          
          <button
            onClick={() => {
              const categoriesSection = document.querySelector('[data-section="categories"]');
              if (categoriesSection) {
                categoriesSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="inline-flex items-center px-8 py-4 bg-primary-600 text-white rounded-full text-lg font-medium hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            style={{letterSpacing: '-0.01em'}}
          >
            Изучить статьи
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section data-section="categories" className="py-20 bg-gray-50">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {postsData?.posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* Demo content notice */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm">
              <span className="mr-2">🎨</span>
              Apple-style design demo • Minimalist & elegant
            </div>
          </div>

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
    </>
  );
};

export default HomePage;
