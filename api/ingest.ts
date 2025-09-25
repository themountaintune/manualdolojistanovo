import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@sanity/client'
import { randomUUID } from 'crypto'

type PortableBlock = {
  _type?: string
  style?: string
  markDefs?: unknown[]
  children?: PortableChild[]
  _key?: string
}

type PortableChild = {
  _type?: string
  text?: string
  marks?: unknown[]
  _key?: string
}

type IngestPayload = {
  title?: unknown
  siteDomain?: unknown
  slug?: unknown
  body?: unknown
}

const nanoid = (size: number = 21) => randomUUID().replace(/-/g, '').slice(0, size)

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

const withKeys = (rawBlocks: unknown): PortableBlock[] => {
  const blocks = toArray<PortableBlock>(rawBlocks)
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
    const children = toArray<PortableChild>(block?.children).map((child) => ({
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
      'Missing Sanity configuration (expected SANITY_PROJECT_ID/NEXT_PUBLIC_SANITY_PROJECT_ID, SANITY_DATASET/NEXT_PUBLIC_SANITY DATASET, SANITY_TOKEN/SANITY_API_READ_TOKEN)'
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

const parsePayload = (payload: IngestPayload) => {
  const title = typeof payload.title === 'string' ? payload.title.trim() : ''
  const siteDomain = typeof payload.siteDomain === 'string' ? payload.siteDomain.trim() : ''
  const slug = typeof payload.slug === 'string' ? payload.slug.trim() : undefined
  const body = withKeys(payload.body)

  if (!title || !siteDomain) {
    throw new Error('title and siteDomain required')
  }

  return { title, siteDomain, slug, body }
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
  if (!dataset) missing.push('SANITY_DATASET or NEXT_PUBLIC SANITY_DATASET')
  if (!token) missing.push('SANITY_TOKEN or SANITY_API_READ_TOKEN')
  if (!ingestSecret) missing.push('INGEST_SECRET or SANITY_PREVIEW_SECRET')

  if (missing.length > 0) {
    return res.status(500).json({ error: 'Missing env vars: ' + missing.join(', ') })
  }

  const secretHeader = req.headers['x-ingest-secret'] ?? req.headers['X-INGEST-SECRET']
  const secret = Array.isArray(secretHeader) ? secretHeader[0] : secretHeader
  if (!secret || secret !== ingestSecret) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  let payload: IngestPayload
  try {
    payload = typeof req.body === 'object' && req.body !== null ? (req.body as IngestPayload) : JSON.parse(String(req.body || '{}'))
  } catch (error) {
    return res.status(400).json({ error: 'Invalid JSON body' })
  }

  let data
  try {
    data = parsePayload(payload)
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message })
  }

  const sanity = ensureSanityClient()
  const slugSource = data.slug && data.slug.length > 0 ? data.slug : data.title
  const slugCandidate = slugify(slugSource) || nanoid(10)
  const sanitizedSlug = slugCandidate.slice(0, 96) || nanoid(10)
  const documentId = `post-${sanitizedSlug}`

  const doc = {\n    _id: documentId,\n    _type: 'post',\n    title: data.title,\n    slug: { _type: 'slug', current: sanitizedSlug },\n    body: data.body,\n  }\n
  try {
    const created = await sanity.createOrReplace(doc)
    return res.status(200).json({ ok: true, id: created._id })
  } catch (error) {
    console.error('Failed to ingest post', error)
    return res.status(500).json({ error: 'Failed to create Sanity document' })
  }
}

