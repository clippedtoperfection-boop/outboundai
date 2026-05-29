import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'
export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data: sequences } = await supabaseAdmin.from('sequence_performance').select('*')
  return NextResponse.json({ sequences: sequences||[] })
}
