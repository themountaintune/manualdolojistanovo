import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@sanity/client'
import { nanoid } from 'nanoid'

type IngestPayload = {
  title?: string
  excerpt?: string
  type?: string
  keywords?: string | string[]
  siteDomain?: string
  slug?: string
  body?: unknown
  categories?: unknown
}

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
        markDefs: [],
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
      marks: Array.isArray(child?.marks) ? child.marks : [],
      _key: typeof child?._key === 'string' && child._key.trim() ? child._key : nanoid(),
    }))

    return {
      ...block,
      markDefs: Array.isArray(block?.markDefs) ? block.markDefs : [],
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

const normalizeKeywords = (input: unknown): string[] => {
  if (Array.isArray(input)) {
    return input.filter((keyword): keyword is string => typeof keyword === 'string' && keyword.trim().length > 0)
  }

  if (typeof input === 'string' && input.trim().length > 0) {
    return input
      .split(',')
      .map((value) => value.trim())
      .filter((value) => value.length > 0)
  }

  return []
}

const resolveEnv = (primary: string, ...fallbacks: string[]) => {
  if (process.env[primary]) return process.env[primary]
  for (const key of fallbacks) {
    if (process.env[key]) return process.env[key]
  }
  return undefined
}

const ensureSanityClient = () => {
  const projectId = resolveEnv('SANITY_PROJECT_ID', 'NEXT_PUBLIC_SANITY_PROJECT_ID')
  const dataset = resolveEnv('SANITY_DATASET', 'NEXT_PUBLIC_SANITY_DATASET')
  const token = resolveEnv('SANITY_TOKEN', 'SANITY_API_READ_TOKEN')

  if (!projectId || !dataset || !token) {
    throw new Error(
      'Missing Sanity configuration (expected SANITY_PROJECT_ID/NEXT_PUBLIC_SANITY_PROJECT_ID, SANITY_DATASET/NEXT_PUBLIC_SANITY_DATASET, SANITY_TOKEN/SANITY_API_READ_TOKEN)'
    )
  }

  return createClient({
    projectId,
    dataset,
    token,
    apiVersion: '2024-01-01',
    useCdn: false,
  }) as any
}

const parsePayload = (req: VercelRequest): { payload: IngestPayload; error?: string } => {
  if (!req.body) {
    return { payload: {} }
  }

  if (typeof req.body === 'string') {
    try {
      return { payload: JSON.parse(req.body) as IngestPayload }
    } catch (error) {
      return { payload: {}, error: 'Invalid JSON body' }
    }
  }

  if (typeof req.body === 'object') {
    return { payload: req.body as IngestPayload }
  }

  return { payload: {} }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const projectId = resolveEnv('SANITY_PROJECT_ID', 'NEXT_PUBLIC_SANITY_PROJECT_ID')
  const dataset = resolveEnv('SANITY_DATASET', 'NEXT_PUBLIC_SANITY_DATASET')
  const token = resolveEnv('SANITY_TOKEN', 'SANITY_API_READ_TOKEN')
  const ingestSecret = resolveEnv('INGEST_SECRET', 'SANITY_PREVIEW_SECRET')

  const missing: string[] = []
  if (!projectId) missing.push('SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_PROJECT_ID')
  if (!dataset) missing.push('SANITY_DATASET or NEXT_PUBLIC_SANITY_DATASET')
  if (!token) missing.push('SANITY_TOKEN or SANITY_API_READ_TOKEN')
  if (!ingestSecret) missing.push('INGEST_SECRET or SANITY_PREVIEW_SECRET')

  if (missing.length > 0) {
    return res.status(500).json({ error: `Missing env vars: ${missing.join(', ')}` })
  }

  const secretHeader = req.headers['x-ingest-secret'] ?? req.headers['X-INGEST-SECRET']
  const secret = Array.isArray(secretHeader) ? secretHeader[0] : secretHeader
  if (!secret || secret !== ingestSecret) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { payload, error } = parsePayload(req)
  if (error) {
    return res.status(400).json({ error })
  }

  const title = typeof payload.title === 'string' ? payload.title.trim() : ''
  const siteDomain = typeof payload.siteDomain === 'string' ? payload.siteDomain.trim() : ''
  const excerpt = typeof payload.excerpt === 'string' ? payload.excerpt : ''
  const type = typeof payload.type === 'string' ? payload.type : null
  const rawBody = payload.body
  const rawCategories = payload.categories
  const keywords = normalizeKeywords(payload.keywords)

  if (!title || !siteDomain) {
    return res.status(400).json({ error: 'title and siteDomain required' })
  }

  try {
    const sanity = ensureSanityClient()
    const siteQuery = `*[_type=="site" && domain==$d][0]{_id}`
    let site = await sanity.fetch(siteQuery, { d: siteDomain })

    if (!site?._id) {
      site = await sanity.create({
        _type: 'site',
        title: siteDomain,
        domain: siteDomain,
      })
    }

    const slugSource = typeof payload.slug === 'string' && payload.slug.trim().length > 0 ? payload.slug : title
    const slug = slugify(slugSource).slice(0, 96) || nanoid(10)
    const documentId = `post-${slug}`
    const now = new Date().toISOString()

    const body = ensureBlockKeys(rawBody)
    const categories = ensureCategoryRefs(rawCategories)

    const existing = await sanity.fetch<{ _id: string; _createdAt?: string }>(
      `*[_id==$id][0]{_id,_createdAt}`,
      { id: documentId }
    )

    const doc = await sanity.createOrReplace({
      _id: documentId,
      _type: 'post',
      title,
      excerpt,
      slug: { _type: 'slug', current: slug },
      site: { _type: 'reference', _ref: site._id },
      categories,
      author: undefined,
      body,
      type,
      keywords,
      publishedAt: null,
      metaTitle: title.slice(0, 60),
      metaDescription: excerpt.slice(0, 160),
      _createdAt: existing?._createdAt || now,
    })

    return res.status(200).json({ ok: true, id: doc._id })
  } catch (err) {
    console.error('Failed to ingest post', err)
    if (err instanceof Error) {
      return res.status(500).json({ error: err.message })
    }
    return res.status(500).json({ error: 'Failed to create Sanity document' })
  }
}
