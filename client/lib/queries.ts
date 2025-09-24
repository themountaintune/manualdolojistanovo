import { client } from './sanity'

export async function getPosts() {
  return client.fetch(`*[_type == "post"]|order(publishedAt desc)[0..9]{
    title,
    "slug": slug.current,
    excerpt,
    mainImage,
    publishedAt,
    "author": author->{name, image}
  }`)
}

export async function getPost(slug: string) {
  return client.fetch(`*[_type == "post" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    excerpt,
    mainImage,
    publishedAt,
    "author": author->{name, image},
    body
  }`, { slug })
}

export async function getCategories() {
  return client.fetch(`*[_type == "category"]|order(title asc){
    title,
    "slug": slug.current,
    description
  }`)
}

export async function getAuthors() {
  return client.fetch(`*[_type == "author"]|order(name asc){
    name,
    "slug": slug.current,
    image,
    bio
  }`)
}
