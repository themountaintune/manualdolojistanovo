import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@sanity/client'

type IngestPayload = {
  title?: string
  excerpt?: string
  type?: string
  keywords?: string | string[]
  siteDomain?: string
}

function resolveEnv(primary: string, ...fallbacks: string[]) {
  if (process.env[primary]) return process.env[primary]
  for (const key of fallbacks) {
    const value = process.env[key]
    if (value) return value
  }
  return undefined
}

function ensureSanityClient() {
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

function parsePayload(req: VercelRequest): { payload: IngestPayload; error?: string } {
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

  const missing: string[] = []
  const projectId = resolveEnv('SANITY_PROJECT_ID', 'NEXT_PUBLIC_SANITY_PROJECT_ID')
  const dataset = resolveEnv('SANITY_DATASET', 'NEXT_PUBLIC_SANITY_DATASET')
  const token = resolveEnv('SANITY_TOKEN', 'SANITY_API_READ_TOKEN')
  const ingestSecret = resolveEnv('INGEST_SECRET', 'SANITY_PREVIEW_SECRET')

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

    const doc = await sanity.create({
      _type: 'post',
      title,
      excerpt,
      site: { _type: 'reference', _ref: site._id },
      body: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: '' }]}],
      categories: [],
      metaTitle: title.slice(0, 60),
      metaDescription: excerpt.slice(0, 160),
      publishedAt: null,
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
