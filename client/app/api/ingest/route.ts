import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { sanity } from '@/lib/sanity-server'

const PayloadSchema = z.object({
  title: z.string().min(1, 'title is required'),
  siteDomain: z.string().min(1, 'siteDomain is required'),
  slug: z.string().optional(),
  body: z.array(z.any()).optional(),
})

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

  const rawPayload = await req.json().catch(() => ({}))
  const parsed = PayloadSchema.safeParse(rawPayload)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', issues: parsed.error.issues },
      { status: 400 }
    )
  }

  const { title, siteDomain, slug: incomingSlug, body: rawBody } = parsed.data

  const slugSource = incomingSlug && incomingSlug.trim().length > 0 ? incomingSlug : title
  const slugCandidate = slugify(slugSource) || nanoid(10)
  const sanitizedSlug = slugCandidate.slice(0, 96) || nanoid(10)
  const documentId = `post-${sanitizedSlug}`

  await sanity.createIfNotExists({ _id: documentId, _type: 'post' })

  const patched = await sanity
    .patch(documentId)
    .unset(UNWANTED_FIELDS)
    .set({
      _type: 'post',
      title,
      siteDomain,
      slug: { _type: 'slug', current: sanitizedSlug },
      body,
    })
    .commit({ autoGenerateArrayKeys: true })

  return NextResponse.json({ ok: true, id: patched._id })
}


