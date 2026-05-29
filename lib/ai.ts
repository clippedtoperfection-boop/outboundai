import Anthropic from '@anthropic-ai/sdk'
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
export async function scoreLead(lead: any) { return { score: 50, reason: 'default' } }
export async function generateEmail(lead: any, req: any) { return { subject: 'Hi', body: 'Hello' } }
export async function classifyReply(body: string) { return { intent: 'other', confidence: 0.5, suggested_action: 'follow_up' } }
