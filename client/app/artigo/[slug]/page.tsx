import { client } from '../../lib/sanity'
import PortableText from '../../src/components/PortableText'

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const post = await client.fetch(`*[_type == "post" && slug.current == $slug][0]{
    title, body, publishedAt, "author": author->{name, image}
  }`, { slug: params.slug })

  if (!post) return <div>Not found</div>

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{new Date(post.publishedAt).toLocaleDateString('pt-BR')}</p>
      <div>{post.author?.name}</div>
      <div>
        {post.body && <PortableText content={post.body} />}
      </div>
    </article>
  )
}
