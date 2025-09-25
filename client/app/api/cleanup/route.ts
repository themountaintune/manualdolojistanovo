import { NextRequest, NextResponse } from 'next/server'
import { sanity } from '@/lib/sanity-server'

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
  const secret = process.env.INGEST_SECRET ?? process.env.SANITY_PREVIEW_SECRET ?? ''
  const provided = req.headers.get('x-cleanup-secret') ?? req.nextUrl.searchParams.get('secret') ?? ''
  if (!secret || provided !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const posts = await sanity.fetch<{ _id: string }[]>(`*[_type=="post"]{_id}`)
  const results = []

  for (const post of posts) {
    try {
      await sanity.patch(post._id).unset(UNWANTED_FIELDS).commit({ autoGenerateArrayKeys: true })
      results.push({ id: post._id, status: 'ok' })
    } catch (error) {
      results.push({ id: post._id, status: 'error', message: (error as Error).message })
    }
  }

  return NextResponse.json({ ok: true, processed: results })
}
