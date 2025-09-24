import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Calendar, User, MessageCircle, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { postsApi } from '../services/api';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { scrollToTop } from '../utils/scrollToTop';

const HomePage: React.FC = () => {
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => postsApi.getAll({
      published: true,
      limit: 12
    }),
  });

  // Scroll to top when component mounts
  useEffect(() => {
    scrollToTop('instant');
  }, []);

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
            O guia completo para empreendedores online e donos de lojas virtuais
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <div className="flex items-center text-gray-500">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
              <span className="text-sm font-medium">E-commerce</span>
            </div>
            <div className="flex items-center text-gray-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-sm font-medium">Marketing Digital</span>
            </div>
            <div className="flex items-center text-gray-500">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <span className="text-sm font-medium">Vendas Online</span>
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
            Explorar Conteúdo
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

      {/* Features Section */}
      <section data-section="categories" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6" style={{letterSpacing: '-0.02em'}}>
              Por que escolher o ManualDolojista?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Criamos conteúdo que inspira, ensina e ajuda você a crescer no mundo digital
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4" style={{letterSpacing: '-0.01em'}}>
                E-commerce Moderno
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Cobertura das mais modernas plataformas, ferramentas e tendências do comércio eletrônico brasileiro
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4" style={{letterSpacing: '-0.01em'}}>
                Estratégias Práticas
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Cada artigo contém exemplos reais, instruções passo a passo e dicas práticas para seu negócio
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5 5 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4" style={{letterSpacing: '-0.01em'}}>
                Comunidade de Empreendedores
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Junte-se à comunidade de empreendedores digitais, donos de lojas virtuais e especialistas em vendas online
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-light text-gray-900 mb-2" style={{letterSpacing: '-0.02em'}}>
                100+
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">
                Artigos
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-light text-gray-900 mb-2" style={{letterSpacing: '-0.02em'}}>
                25K+
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">
                Empreendedores
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-light text-gray-900 mb-2" style={{letterSpacing: '-0.02em'}}>
                8+
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">
                Categorias
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-light text-gray-900 mb-2" style={{letterSpacing: '-0.02em'}}>
                24/7
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">
                Atualizações
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-3xl font-light text-gray-900 mb-4" style={{letterSpacing: '-0.02em'}}>
                Últimos Artigos
              </h2>
              <p className="text-lg text-gray-600 font-light">
                Descubra as últimas estratégias e insights para seu negócio online
              </p>
            </div>
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
