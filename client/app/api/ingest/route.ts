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

const withKeys = (rawBlocks: unknown): any[] => {
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

const UNWANTED_FIELDS = [
  'excerpt',
  'keywords',
  'metaDescription',
  'metaTitle',
  'site',
  'type',
  'categories',
  'publishedAt',
  'author',
]

export async function POST(req: NextRequest) {
  const ingestSecret = process.env.INGEST_SECRET ?? process.env.SANITY_PREVIEW_SECRET ?? ''
  const secret = req.headers.get('x-ingest-secret') || ''
  if (!ingestSecret || secret !== ingestSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await req.json().catch(() => ({}))
  const {
    title,
    siteDomain,
    slug: incomingSlug,
    body: rawBody,
  } = payload || {}

  if (!title || !siteDomain) {
    return NextResponse.json({ error: 'title and siteDomain required' }, { status: 400 })
  }

  const slugSource = typeof incomingSlug === 'string' && incomingSlug.trim().length > 0 ? incomingSlug : title
  const slug = slugify(slugSource).slice(0, 96) || nanoid(10)
  const documentId = `post-${slug}`
  const body = withKeys(rawBody)

  await sanity.createIfNotExists({ _id: documentId, _type: 'post' })

  const setData = {
    title,
    siteDomain,
    slug: { _type: 'slug', current: slug },
    body,
  }

  const patched = await sanity
    .patch(documentId)
    .unset(UNWANTED_FIELDS)
    .set(setData)
    .commit({ autoGenerateArrayKeys: true })

  return NextResponse.json({ ok: true, id: patched._id })
}
