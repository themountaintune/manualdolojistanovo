import React from 'react';
import { PortableText as PortableTextReact } from '@portabletext/react';
import { getSanityImageUrl, getImageAlt } from '../utils/sanityImage';

// Custom components for Portable Text
const components = {
  types: {
    image: ({ value }: any) => {
      const imageUrl = getSanityImageUrl(value, 800, 600);
      const alt = getImageAlt(value, 'Article image');
      
      return (
        <div className="my-8">
          <img
            src={imageUrl}
            alt={alt}
            className="w-full h-auto rounded-lg shadow-md"
            loading="lazy"
          />
          {value.caption && (
            <p className="text-sm text-gray-600 mt-2 text-center italic">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
    code: ({ value }: any) => (
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6">
        <code className="text-sm">{value.code}</code>
      </pre>
    ),
  },
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-4xl font-bold text-gray-900 mb-6 mt-8 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8 first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-2xl font-semibold text-gray-900 mb-3 mt-6 first:mt-0">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-xl font-semibold text-gray-900 mb-2 mt-4 first:mt-0">
        {children}
      </h4>
    ),
    normal: ({ children }: any) => (
      <p className="text-gray-700 mb-4 leading-relaxed">
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary-500 pl-4 my-6 italic text-gray-600">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-inside mb-4 space-y-2">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside mb-4 space-y-2">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => (
      <li className="text-gray-700 leading-relaxed">
        {children}
      </li>
    ),
    number: ({ children }: any) => (
      <li className="text-gray-700 leading-relaxed">
        {children}
      </li>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-semibold text-gray-900">
        {children}
      </strong>
    ),
    em: ({ children }: any) => (
      <em className="italic">
        {children}
      </em>
    ),
    code: ({ children }: any) => (
      <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
    link: ({ children, value }: any) => (
      <a
        href={value.href}
        target={value.blank ? '_blank' : '_self'}
        rel={value.blank ? 'noopener noreferrer' : undefined}
        className="text-primary-600 hover:text-primary-700 underline"
      >
        {children}
      </a>
    ),
  },
};

interface PortableTextProps {
  content: any[];
  className?: string;
}

const PortableText: React.FC<PortableTextProps> = ({ content, className = '' }) => {
  if (!content || !Array.isArray(content)) {
    return null;
  }

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <PortableTextReact
        value={content}
        components={components}
      />
    </div>
  );
};

export default PortableText;
