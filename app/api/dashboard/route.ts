import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'
export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { count } = await supabaseAdmin.from('leads').select('*', { count: 'exact', head: true })
  return NextResponse.json({ total_leads: count || 0 })
}
