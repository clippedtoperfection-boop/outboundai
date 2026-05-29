import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'
export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data: calls } = await supabaseAdmin.from('calls').select('*, leads(first_name,last_name,email,company_name)').order('scheduled_at',{ascending:true}).limit(50)
  return NextResponse.json({ calls: calls||[] })
}
