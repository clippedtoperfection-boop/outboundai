// OUTBOUND.AI Shared Types
export type LeadStatus = 'new' | 'contacted' | 'replied' | 'booked' | 'closed' | 'dead'
export type LeadSource = 'website' | 'google_ads' | 'manual' | 'import'
export interface Lead { id: string; first_name: string; email: string; status: LeadStatus; source: LeadSource; icp_score: number; created_at: string; updated_at: string; }
