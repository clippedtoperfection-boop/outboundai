import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data: calls } = await supabaseAdmin
    .from('calls').select('*, leads(first_name,last_name,email,company_name)')
    .order('scheduled_at', { ascending: true }).limit(50)
  return NextResponse.json({ calls: calls || [] })
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { data, error } = await supabaseAdmin.from('calls').insert([{scheduled_at: body.scheduled_at,duration_minutes: body.duration_minutes || 30,status: 'scheduled',lead_id: body.lead_id || null}]).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ call: data })
}
