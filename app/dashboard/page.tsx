'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './dashboard.module.css'

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(setStats)
  }, [])

  const pipeline = stats?.pipeline || []
  const activity = stats?.recent_activity || []
  const leads = stats?.recent_leads || []

  const stages = [
    { key: 'new', label: 'New', color: '#6c63ff' },
    { key: 'contacted', label: 'Contacted', color: '#4ecdc4' },
    { key: 'replied', label: 'Replied', color: '#f59e0b' },
    { key: 'booked', label: 'Booked', color: '#22c55e' },
  ]

  const getCount = (status: string) =>
    pipeline.find((p: any) => p.status === status)?.count || 0

  const total = stages.reduce((s, st) => s + getCount(st.key), 1)

  return (
    <div className={styles.page}>
      <div className={styles.metrics}>
        {[
          { label: 'Total Leads', val: stats?.total_leads ?? '—' },
          { label: 'Emails Sent', val: stats?.emails_sent ?? '—' },
          { label: 'Reply Rate', val: stats?.reply_rate != null ? stats.reply_rate + '%' : '—' },
          { label: 'Calls Booked', val: stats?.calls_booked ?? '—' },
        ].map(m => (
          <div key={m.label} className={styles.metric}>
            <div className={styles.metricLabel}>{m.label}</div>
            <div className={styles.metricVal}>{m.val}</div>
          </div>
        ))}
      </div>
      <div className={styles.grid}>
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <span className={styles.panelTitle}>Pipeline</span>
            <Link href="/leads" className={styles.link}>View'all</Link>
          </div>
          <div className={styles.pipeline}>
            {stages.map(st => (
              <div key={st.key} className={styles.stage}>
                <div className={styles.stageLabel}>{st.label}</div>
                <div className={styles.stageCount}>{getCount(st.key)}</div>
                <div className={styles.stageBar}>
                  <div style={{ width: `${getCount(st.key) / total * 100}%`, background: st.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className={styles.panelTitle} style={{marginTop:'1.5rem',marginBottom:'0.75rem'}}>Recent Leads</div>
          {leads.map((l: any) => (
            <div key={l.id} className={styles.leadRow}>
              <div className={styles.avatar}>{l.first_name[0]}{l.last_name?.[0]||''}</div>
              <div className={styles.leadInfo}>
                <div className={styles.leadName}>{l.first_name} {l.last_name}</div>
                <div className={styles.leadSub}>{l.company_name||l.email}</div>
              </div>
              <span className={`${styles.badge} ${styles['badge_'+l.status]}`}>{l.status}</span>
              <span className={styles.score}>{l.icp_score}</span>
            </div>
          ))}
        </div>
        <div className={styles.panel}>
          <div className={styles.panelHead}><span className={styles.panelTitle}>Live Activity</span></div>
          {activity.length===0&&<div className={styles.empty}>No activity yet</div>}
          {activity.map((a:any)=>(
            <div key={a.id} className={styles.actRow}>
              <div className={styles.actDot}/>
              <div className={styles.actText}>{a.description}</div>
              <div className={styles.actTime}>{new Date(a.created_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
