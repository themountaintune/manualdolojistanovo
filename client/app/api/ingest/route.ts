import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { sanity } from '@/lib/sanity-server'

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const toArray = <T>(value: unknown): T[] => (Array.isArray(value) ? value : [])

const ensureBlockKeys = (rawBlocks: unknown): any[] => {
  const blocks = toArray<any>(rawBlocks)
  if (blocks.length === 0) {
    return [
      {
        _type: 'block',
        style: 'normal',
        _key: nanoid(),
        children: [
          {
            _type: 'span',
            text: '',
            marks: [],
            _key: nanoid(),
          },
        ],
      },
    ]
  }

  return blocks.map((block) => {
    const children = toArray<any>(block?.children).map((child) => ({
      ...child,
      _key: typeof child?._key === 'string' && child._key.trim() ? child._key : nanoid(),
    }))

    return {
      ...block,
      _key: typeof block?._key === 'string' && block._key.trim() ? block._key : nanoid(),
      children,
    }
  })
}

const ensureCategoryRefs = (rawCategories: unknown): any[] =>
  toArray<any>(rawCategories)
    .map((category) => {
      if (!category) return null
      if (typeof category === 'string') return category
      if (typeof category === 'object') {
        if (typeof category._ref === 'string') return category._ref
        if (typeof category.id === 'string') return category.id
      }
      return null
    })
    .filter((id): id is string => typeof id === 'string' && id.length > 0)
    .map((id) => ({
      _type: 'reference',
      _ref: id,
      _key: nanoid(),
    }))

export async function POST(req: NextRequest) {
  const ingestSecret = process.env.INGEST_SECRET ?? process.env.SANITY_PREVIEW_SECRET ?? ''
  const secret = req.headers.get('x-ingest-secret') || ''
  if (!ingestSecret || secret !== ingestSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await req.json().catch(() => ({}))
  const {
    title,
    excerpt,
    type,
    keywords,
    siteDomain,
    slug: incomingSlug,
    body: rawBody,
    categories: rawCategories,
  } = payload || {}

  if (!title || !siteDomain) {
    return NextResponse.json({ error: 'title and siteDomain required' }, { status: 400 })
  }

  const site = await sanity.fetch(`*[_type=="site" && domain==$d][0]{_id}`, { d: siteDomain })
  let siteId = site?._id

  if (!siteId) {
    const created = await sanity.create({ _type: 'site', title: siteDomain, domain: siteDomain })
    siteId = created._id
  }

  const slugSource = typeof incomingSlug === 'string' && incomingSlug.trim().length > 0 ? incomingSlug : title
  const slug = slugify(slugSource).slice(0, 96) || nanoid(10)
  const documentId = `post-${slug}`
  const now = new Date().toISOString()

  const body = ensureBlockKeys(rawBody)
  const categories = ensureCategoryRefs(rawCategories)
  const keywordsValue = Array.isArray(keywords)
    ? keywords.filter((keyword: unknown): keyword is string => typeof keyword === 'string')
    : typeof keywords === 'string' && keywords.length > 0
    ? keywords.split(',').map((val) => val.trim()).filter(Boolean)
    : []

  const doc = await sanity.createIfNotExists({
    _id: documentId,
    _type: 'post',
    title,
    excerpt: excerpt || '',
    slug: { _type: 'slug', current: slug },
    site: { _type: 'reference', _ref: siteId },
    categories,
    author: undefined,
    body,
    type: type || null,
    keywords: keywordsValue,
    publishedAt: null,
    metaTitle: title.slice(0, 60),
    metaDescription: (excerpt || '').slice(0, 160),
    _createdAt: now,
  })

  return NextResponse.json({ ok: true, id: doc._id })
}
