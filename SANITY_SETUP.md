# Sanity CMS Integration Setup

## 1. Создание проекта Sanity

1. Перейдите на [sanity.io](https://sanity.io)
2. Создайте новый проект
3. Выберите dataset (обычно `production`)
4. Запомните Project ID

## 2. Настройка переменных окружения

### Получение токена Sanity:
1. Перейдите в [Sanity Management Console](https://sanity.io/manage)
2. Выберите ваш проект
3. Перейдите в "API" → "Tokens"
4. Создайте новый токен с правами "Read"
5. Скопируйте токен

Создайте файл `.env.local` в папке `client/`:

```env
# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your-read-token

# Google Analytics
REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# API Configuration
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_SITE_URL=https://manualdolojistanovo.vercel.app
```

## 3. Схема данных Sanity

Создайте следующие типы в Sanity Studio:

### Author (Автор)
```javascript
{
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'text'
    },
    {
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'social',
      title: 'Social Links',
      type: 'object',
      fields: [
        { name: 'twitter', type: 'url' },
        { name: 'linkedin', type: 'url' },
        { name: 'website', type: 'url' }
      ]
    }
  ]
}
```

### Category (Категория)
```javascript
{
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    },
    {
      name: 'color',
      title: 'Color',
      type: 'string',
      options: {
        list: [
          { title: 'Blue', value: '#3B82F6' },
          { title: 'Green', value: '#10B981' },
          { title: 'Purple', value: '#8B5CF6' },
          { title: 'Red', value: '#EF4444' },
          { title: 'Yellow', value: '#F59E0B' }
        ]
      }
    }
  ]
}
```

### Tag (Тег)
```javascript
{
  name: 'tag',
  title: 'Tag',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    }
  ]
}
```

### Post (Статья)
```javascript
{
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' }
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Number', value: 'number' }
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' }
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL'
                  },
                  {
                    name: 'blank',
                    type: 'boolean',
                    title: 'Open in new tab'
                  }
                ]
              }
            ]
          }
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text'
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption'
            }
          ]
        },
        {
          type: 'code',
          title: 'Code Block',
          options: {
            language: 'javascript'
          }
        }
      ]
    },
    {
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text'
        }
      ]
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: { type: 'author' },
      validation: Rule => Rule.required()
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }]
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'tag' } }]
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: Rule => Rule.required()
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'SEO Title',
          type: 'string'
        },
        {
          name: 'description',
          title: 'SEO Description',
          type: 'text',
          rows: 3
        },
        {
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{ type: 'string' }]
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'featuredImage'
    },
    prepare(selection) {
      const { author } = selection;
      return Object.assign({}, selection, {
        subtitle: author && `by ${author}`
      });
    }
  }
}
```

## 4. Использование в коде

### Простые функции выборки
```typescript
import { getPosts, getPost, getCategories, getAuthors } from '../lib/queries';

// Получить все статьи (простые данные)
const posts = await getPosts();

// Получить статью по slug
const post = await getPost('my-post-slug');

// Получить категории
const categories = await getCategories();

// Получить авторов
const authors = await getAuthors();
```

### Расширенные функции через API
```typescript
import { sanityApi } from '../services/sanity';

// Получить все статьи (подробные данные)
const posts = await sanityApi.getPosts();

// Получить статью по slug (подробные данные)
const post = await sanityApi.getPostBySlug('my-post-slug');

// Получить категории (подробные данные)
const categories = await sanityApi.getCategories();
```

### Отображение контента
```typescript
import PortableText from '../components/PortableText';

// В компоненте статьи
<PortableText content={post.content} />
```

### Работа с изображениями
```typescript
import { getSanityImageUrl } from '../utils/sanityImage';

const imageUrl = getSanityImageUrl(post.featuredImage, 800, 600);
```

## 5. Деплой

1. Добавьте переменные окружения в Vercel
2. Убедитесь, что CORS настроен в Sanity
3. Проверьте, что все API запросы работают

## 6. Полезные ссылки

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Portable Text](https://www.sanity.io/docs/presenting-block-text)
