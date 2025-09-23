import React from 'react';
import { Link } from 'react-router-dom';
import type { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
  isSelected?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  category, 
  onClick, 
  isSelected = false 
}) => {
  const cardContent = (
    <div className={`card cursor-pointer transition-all duration-300 hover:shadow-lg ${
      isSelected ? 'ring-2 ring-primary-500 bg-primary-50' : ''
    }`}>
      <div className="card-content text-center">
        <div 
          className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-lg"
          style={{ backgroundColor: category.color || '#3B82F6' }}
        >
          {category.name.charAt(0).toUpperCase()}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {category.name}
        </h3>
        
        {category.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {category.description}
          </p>
        )}
        
        {category._count?.posts !== undefined && (
          <div className="text-sm text-gray-500">
            {category._count.posts} {category._count.posts === 1 ? 'post' : 'posts'}
          </div>
        )}
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full">
        {cardContent}
      </button>
    );
  }

  return (
    <Link to={`/?category=${category.slug}`}>
      {cardContent}
    </Link>
  );
};

export default CategoryCard;
