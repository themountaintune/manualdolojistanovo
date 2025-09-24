import { getPost } from '../../../lib/queries'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import PortableText from '../../../src/components/PortableText'

interface PageProps {
  params: {
    slug: string
  }
}

export default async function ArtigoPage({ params }: PageProps) {
  const post = await getPost(params.slug)
  
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Artigo não encontrado</h1>
          <p className="text-gray-600 mb-4">
            O artigo que você está procurando não existe ou foi removido.
          </p>
          <a href="/" className="text-primary-600 hover:text-primary-700 underline">
            Voltar para a página inicial
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <a
          href="/"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8"
        >
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para os artigos
        </a>

        {/* Featured Image */}
        {post.mainImage && (
          <div className="aspect-video overflow-hidden rounded-lg mb-8">
            <img
              src={post.mainImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Post Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6" style={{letterSpacing: '-0.02em'}}>
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex items-center space-x-6 text-gray-600 mb-6">
            <div className="flex items-center">
              {post.author?.image ? (
                <img
                  src={post.author.image}
                  alt={post.author.name}
                  className="h-8 w-8 rounded-full mr-3"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-300 mr-3"></div>
              )}
              <span className="font-medium">{post.author?.name || 'Autor'}</span>
            </div>
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                {post.publishedAt 
                  ? format(new Date(post.publishedAt), 'dd MMMM yyyy', { locale: ptBR })
                  : 'Data não disponível'
                }
              </span>
            </div>
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Post Content */}
        <article className="prose prose-lg max-w-none">
          {post.body && (
            <PortableText content={post.body} />
          )}
        </article>

        {/* Author Bio */}
        {post.author && (
          <div className="mt-12 p-6 bg-white rounded-2xl border border-gray-100">
            <div className="flex items-start space-x-4">
              {post.author.image ? (
                <img
                  src={post.author.image}
                  alt={post.author.name}
                  className="h-16 w-16 rounded-full"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-300"></div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {post.author.name}
                </h3>
                {post.author.bio && (
                  <p className="text-gray-600 leading-relaxed">
                    {post.author.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
