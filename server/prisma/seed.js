const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@manualdolojista.com' },
    update: {},
    create: {
      email: 'admin@manualdolojista.com',
      username: 'admin',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      bio: 'System administrator'
    }
  });

  // Create editor user
  const editorPassword = await bcrypt.hash('editor123', 12);
  const editor = await prisma.user.upsert({
    where: { email: 'editor@manualdolojista.com' },
    update: {},
    create: {
      email: 'editor@manualdolojista.com',
      username: 'editor',
      password: editorPassword,
      firstName: 'Editor',
      lastName: 'User',
      role: 'EDITOR',
      bio: 'Content editor'
    }
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@manualdolojista.com' },
    update: {},
    create: {
      email: 'user@manualdolojista.com',
      username: 'user',
      password: userPassword,
      firstName: 'Regular',
      lastName: 'User',
      role: 'USER',
      bio: 'Regular blog user'
    }
  });

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'technology' },
      update: {},
      create: {
        name: 'Technology',
        slug: 'technology',
        description: 'Posts about technology, programming, and software development',
        color: '#3B82F6'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'lifestyle' },
      update: {},
      create: {
        name: 'Lifestyle',
        slug: 'lifestyle',
        description: 'Posts about lifestyle, health, and personal development',
        color: '#10B981'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'business' },
      update: {},
      create: {
        name: 'Business',
        slug: 'business',
        description: 'Posts about business, entrepreneurship, and marketing',
        color: '#F59E0B'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'design' },
      update: {},
      create: {
        name: 'Design',
        slug: 'design',
        description: 'Posts about design, UI/UX, and creativity',
        color: '#8B5CF6'
      }
    })
  ]);

  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'javascript' },
      update: {},
      create: { name: 'JavaScript', slug: 'javascript' }
    }),
    prisma.tag.upsert({
      where: { slug: 'react' },
      update: {},
      create: { name: 'React', slug: 'react' }
    }),
    prisma.tag.upsert({
      where: { slug: 'nodejs' },
      update: {},
      create: { name: 'Node.js', slug: 'nodejs' }
    }),
    prisma.tag.upsert({
      where: { slug: 'web-development' },
      update: {},
      create: { name: 'Web Development', slug: 'web-development' }
    }),
    prisma.tag.upsert({
      where: { slug: 'productivity' },
      update: {},
      create: { name: 'Productivity', slug: 'productivity' }
    }),
    prisma.tag.upsert({
      where: { slug: 'startup' },
      update: {},
      create: { name: 'Startup', slug: 'startup' }
    })
  ]);

  // Create sample posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: 'Getting Started with React and TypeScript',
        slug: 'getting-started-with-react-and-typescript',
        content: `
# Getting Started with React and TypeScript

React and TypeScript are a powerful combination for building modern web applications. In this post, we'll explore how to set up a new React project with TypeScript and cover the basics.

## Why TypeScript?

TypeScript brings static type checking to JavaScript, which helps catch errors early in development and provides better IDE support.

## Setting Up the Project

\`\`\`bash
npx create-react-app my-app --template typescript
cd my-app
npm start
\`\`\`

## Basic Components

Here's a simple TypeScript component:

\`\`\`tsx
interface Props {
  name: string;
  age: number;
}

const UserCard: React.FC<Props> = ({ name, age }) => {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
    </div>
  );
};
\`\`\`

## Conclusion

TypeScript with React provides excellent developer experience and helps build more maintainable applications.
        `,
        excerpt: 'Learn how to set up and use React with TypeScript for better development experience and type safety.',
        published: true,
        publishedAt: new Date(),
        authorId: admin.id,
        categories: {
          create: [
            { categoryId: categories[0].id }
          ]
        },
        tags: {
          create: [
            { tagId: tags[0].id },
            { tagId: tags[1].id },
            { tagId: tags[3].id }
          ]
        }
      }
    }),
    prisma.post.create({
      data: {
        title: 'Building Scalable Node.js Applications',
        slug: 'building-scalable-nodejs-applications',
        content: `
# Building Scalable Node.js Applications

Node.js is excellent for building scalable applications. In this post, we'll discuss best practices and patterns for creating maintainable Node.js applications.

## Architecture Patterns

### Microservices
Breaking your application into smaller, focused services can improve scalability and maintainability.

### Event-Driven Architecture
Using events to decouple components makes your application more flexible and easier to test.

## Performance Optimization

- Use clustering for CPU-intensive tasks
- Implement caching strategies
- Optimize database queries
- Use compression middleware

## Security Best Practices

- Validate all inputs
- Use HTTPS
- Implement rate limiting
- Keep dependencies updated

## Conclusion

Building scalable Node.js applications requires careful planning and following best practices.
        `,
        excerpt: 'Learn best practices for building scalable and maintainable Node.js applications.',
        published: true,
        publishedAt: new Date(Date.now() - 86400000), // 1 day ago
        authorId: editor.id,
        categories: {
          create: [
            { categoryId: categories[0].id }
          ]
        },
        tags: {
          create: [
            { tagId: tags[2].id },
            { tagId: tags[3].id }
          ]
        }
      }
    }),
    prisma.post.create({
      data: {
        title: '10 Productivity Tips for Developers',
        slug: '10-productivity-tips-for-developers',
        content: `
# 10 Productivity Tips for Developers

Being productive as a developer is crucial for success. Here are 10 tips to help you work more efficiently.

## 1. Use Version Control Effectively

Git is your friend. Learn to use it properly with branching strategies and commit messages.

## 2. Automate Repetitive Tasks

Use scripts, build tools, and automation to reduce manual work.

## 3. Learn Keyboard Shortcuts

Mastering keyboard shortcuts can save significant time.

## 4. Use a Good IDE

Invest time in learning your IDE's features and extensions.

## 5. Write Clean Code

Clean code is easier to read, debug, and maintain.

## 6. Take Regular Breaks

The Pomodoro Technique can help maintain focus and prevent burnout.

## 7. Learn to Say No

Don't overcommit. Focus on what's most important.

## 8. Use Documentation

Good documentation saves time for you and your team.

## 9. Continuous Learning

Stay updated with new technologies and best practices.

## 10. Get Enough Sleep

Proper rest is essential for peak performance.

## Conclusion

Productivity is about working smarter, not harder. Implement these tips gradually for best results.
        `,
        excerpt: 'Discover 10 practical tips to boost your productivity as a developer and work more efficiently.',
        published: true,
        publishedAt: new Date(Date.now() - 172800000), // 2 days ago
        authorId: user.id,
        categories: {
          create: [
            { categoryId: categories[1].id }
          ]
        },
        tags: {
          create: [
            { tagId: tags[4].id }
          ]
        }
      }
    })
  ]);

  // Create sample comments
  await Promise.all([
    prisma.comment.create({
      data: {
        content: 'Great post! TypeScript has really improved my development workflow.',
        postId: posts[0].id,
        authorId: user.id,
        approved: true
      }
    }),
    prisma.comment.create({
      data: {
        content: 'Thanks for sharing these tips. The microservices section was particularly helpful.',
        postId: posts[1].id,
        authorId: admin.id,
        approved: true
      }
    }),
    prisma.comment.create({
      data: {
        content: 'I need to work on my keyboard shortcuts. Any recommendations for VS Code?',
        postId: posts[2].id,
        authorId: editor.id,
        approved: true
      }
    })
  ]);

  console.log('✅ Database seeded successfully!');
  console.log('👤 Created users: admin, editor, user');
  console.log('📂 Created categories:', categories.length);
  console.log('🏷️ Created tags:', tags.length);
  console.log('📝 Created posts:', posts.length);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
