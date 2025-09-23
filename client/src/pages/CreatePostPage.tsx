import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Save, Eye, ArrowLeft } from 'lucide-react';
import { postsApi, categoriesApi, tagsApi } from '../services/api';
import type { CreatePostData } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const CreatePostPage: React.FC = () => {
  const [isPreview, setIsPreview] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreatePostData & { selectedCategories: string[]; selectedTags: string[] }>();

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  const { data: tagsData } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagsApi.getAll(),
  });

  const createPostMutation = useMutation({
    mutationFn: (data: CreatePostData) => postsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
      navigate('/dashboard');
    },
  });

  const onSubmit = async (data: CreatePostData & { selectedCategories: string[]; selectedTags: string[] }) => {
    const { selectedCategories, selectedTags, ...postData } = data;
    
    await createPostMutation.mutateAsync({
      ...postData,
      categoryIds: selectedCategories,
      tagIds: selectedTags,
    });
  };

  const watchedContent = watch('content');
  const watchedTitle = watch('title');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Post Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Post Title
            </label>
            <input
              {...register('title', {
                required: 'Title is required',
                maxLength: {
                  value: 200,
                  message: 'Title must be less than 200 characters',
                },
              })}
              type="text"
              className="input text-2xl font-bold"
              placeholder="Enter your post title..."
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Post Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt (Optional)
            </label>
            <textarea
              {...register('excerpt', {
                maxLength: {
                  value: 500,
                  message: 'Excerpt must be less than 500 characters',
                },
              })}
              className="textarea"
              rows={3}
              placeholder="Write a brief description of your post..."
            />
            {errors.excerpt && (
              <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>
            )}
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categoriesData?.categories.map((category) => (
                <label key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    value={category.id}
                    {...register('selectedCategories')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {tagsData?.tags.map((tag) => (
                <label key={tag.id} className="flex items-center">
                  <input
                    type="checkbox"
                    value={tag.id}
                    {...register('selectedTags')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{tag.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Featured Image */}
          <div>
            <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image URL (Optional)
            </label>
            <input
              {...register('featuredImage')}
              type="url"
              className="input"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Post Content
              </label>
              <button
                type="button"
                onClick={() => setIsPreview(!isPreview)}
                className="btn btn-outline btn-sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                {isPreview ? 'Edit' : 'Preview'}
              </button>
            </div>
            
            {isPreview ? (
              <div className="border border-gray-300 rounded-md p-4 bg-white min-h-[400px]">
                <h2 className="text-2xl font-bold mb-4">{watchedTitle || 'Untitled'}</h2>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap">{watchedContent || 'No content yet...'}</pre>
                </div>
              </div>
            ) : (
              <textarea
                {...register('content', {
                  required: 'Content is required',
                })}
                className="textarea min-h-[400px] font-mono text-sm"
                placeholder="Write your post content in Markdown..."
              />
            )}
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>

          {/* Publish Options */}
          <div className="card">
            <div className="card-content">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Publish Options</h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('published')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Publish immediately
                  </span>
                </label>
                <p className="text-sm text-gray-500">
                  If unchecked, the post will be saved as a draft.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createPostMutation.isPending}
              className="btn btn-primary flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
