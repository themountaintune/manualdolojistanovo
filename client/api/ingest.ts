import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }
  try {
    const body = (req.body ?? {}) as Record<string, unknown>
    return res.status(200).json({ ok: true, got: body, t: Date.now() })
  } catch (e) {
    return res.status(400).json({ error: 'Bad JSON' })
  }
}
