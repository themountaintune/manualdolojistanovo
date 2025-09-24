import { NextRequest, NextResponse } from 'next/server'
import { sanity } from '@/lib/sanity-server'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-ingest-secret') || ''
  if (secret !== process.env.INGEST_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const { title, excerpt, type, keywords, siteDomain } = body || {}

  if (!title || !siteDomain) {
    return NextResponse.json({ error: 'title and siteDomain required' }, { status: 400 })
  }

  const site = await sanity.fetch(`*[_type=="site" && domain==$d][0]{_id}`, { d: siteDomain })
  let siteId = site?._id

  if (!siteId) {
    const created = await sanity.create({ _type: 'site', title: siteDomain, domain: siteDomain })
    siteId = created._id
  }

  const now = new Date().toISOString()
  const doc = await sanity.create({
    _type: 'post',
    title,
    excerpt: excerpt || '',
    site: { _type: 'reference', _ref: siteId },
    categories: [],
    author: undefined,
    body: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: '' }]}],
    publishedAt: null,
    metaTitle: title.slice(0, 60),
    metaDescription: (excerpt || '').slice(0, 160),
    _createdAt: now
  })

  return NextResponse.json({ ok: true, id: doc._id })
}
