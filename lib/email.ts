import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY!)
export async function sendEmail(opts: any) { return { success: true } }
export async function processSequenceQueue() { return { processed: 0 } }
export async function enrollLeadInSequence(id: string, sid: string, now?: boolean) { return { enrolled: true } }
