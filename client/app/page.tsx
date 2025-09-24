import { getPosts } from '../lib/queries'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default async function Home() {
  const posts = await getPosts()
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-primary-50 py-32 overflow-hidden">
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
        </div>
      </section>

      {/* Posts Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6" style={{letterSpacing: '-0.02em'}}>
              Últimos Artigos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Descubra as últimas estratégias e insights para seu negócio online
            </p>
          </div>

          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {posts.map((post: any) => (
                <article key={post.slug} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full flex flex-col">
                  {/* Featured Image */}
                  {post.mainImage && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.mainImage}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}
                  
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Title */}
                    <h3 className="text-xl font-medium text-gray-900 mb-3 line-clamp-2" style={{letterSpacing: '-0.02em'}}>
                      <a
                        href={`/artigo/${post.slug}`}
                        className="hover:text-primary-600 transition-colors"
                      >
                        {post.title}
                      </a>
                    </h3>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
                      <div className="flex items-center">
                        {post.author?.image ? (
                          <img
                            src={post.author.image}
                            alt={post.author.name}
                            className="h-5 w-5 rounded-full mr-2"
                          />
                        ) : (
                          <div className="h-5 w-5 rounded-full bg-gray-300 mr-2"></div>
                        )}
                        <span>{post.author?.name || 'Autor'}</span>
                      </div>
                      <div className="flex items-center">
                        <span>
                          {post.publishedAt 
                            ? format(new Date(post.publishedAt), 'dd MMM, yyyy', { locale: ptBR })
                            : 'Data não disponível'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Nenhum artigo encontrado.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
