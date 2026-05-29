import type { Config } from '@netlify/functions'
export default async function handler() { return { statusCode: 200 } }
export const config: Config = { schedule: '*/15 * * * *' }
