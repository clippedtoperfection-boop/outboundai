import { NextRequest, NextResponse } from 'next/server'
export async function POST(req: NextRequest) {
  const payload = await req.json()
  return NextResponse.json({ success: true, action: 'created' })
}
export async function GET() { return NextResponse.json({ status: 'ok' }) }
