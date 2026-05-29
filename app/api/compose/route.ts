import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { lead_id, step_type, tone } = await req.json()

  // Get lead info
  const { data: lead } = await supabaseAdmin
    .from('leads').select('*').eq('id', lead_id).single()

  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

  const prompt = `Write a cold outreach email for a lead with the following info:
Name: ${lead.first_name} ${lead.last_name || ''}
Company: ${lead.company_name || 'Unknown'}
Title: ${lead.title || 'Unknown'}
Email step: ${step_type}
Tone: ${tone}

Write a short, personalized cold email (3-4 sentences max). No subject line. Just the body. Be direct and specific.`

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'No API key configured' }, { status: 500 })

  // Call Gemini API with streaming
  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?key=${apiKey}&alt=sse`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 300, temperature: 0.8 }
      })
    }
  )

  if (!geminiRes.ok) {
    const err = await geminiRes.text()
    return NextResponse.json({ error: err }, { status: 500 })
  }

  // Stream the response
  const stream = new ReadableStream({
    async start(controller) {
      const reader = geminiRes.body!.getReader()
      const dec = new TextDecoder()
      let buffer = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += dec.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            if (data === '[DONE]') continue
            try {
              const json = JSON.parse(data)
              const text = json.candidates?.[0]?.content?.parts?.[0]?.text
              if (text) controller.enqueue(new TextEncoder().encode(text))
            } catch {}
          }
        }
      }
      controller.close()
    }
  })

  return new NextResponse(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Transfer-Encoding': 'chunked' }
  })
}
