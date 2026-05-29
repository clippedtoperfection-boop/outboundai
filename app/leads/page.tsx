'use client'
import { useEffect, useState } from 'react'
import styles from './leads.module.css'

const STATUSES = ['', 'new', 'contacted', 'replied', 'booked', 'dead']
const SOURCES = ['', 'website', 'google_ads', 'manual']

export default function Leads() {
  const [leads, setLeads] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState('')
  const [source, setSource] = useState('')
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ limit: '100' })
    if (status) params.set('status', status)
    if (source) params.set('source', source)
    if (q) params.set('q', q)
    fetch('/api/leads?' + params).then(r => r.json())
      .then(d => { setLeads(d.leads||[]); setTotal(d.total||0) })
      .finally(() => setLoading(false))
  }, [status, source, q])

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <input className={styles.search} placeholder="Search leads..." value={q} onChange={e => setQ(e.target.value)} />
        <select className={styles.sel} value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All status</option>
          {STATUSES.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className={styles.sel} value={source} onChange={e => setSource(e.target.value)}>
          <option value="">All sources</option>
          {SOURCES.slice(1).map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
        </select>
        <span className={styles.count}>{total} leads</span>
      </div>
      <div className={styles.table}>
        <div className={styles.thead}>
          <div>Contact</div><div>Company</div><div>Source</div><div>Score</div><div>Status</div><div>Added</div>
        </div>
        {loading&&<div className={styles.empty}>Loading...</div>}
        {!loading&&leads.length===0&&<div className={styles.empty}>No leads found</div>}
        {leads.map(l => (
          <div key={l.id} className={styles.row}>
            <div><div className={styles.name}>{l.first_name} {l.last_name}</div><div className={styles.sub}>{l.email}</div></div>
            <div className={styles.sub}>{l.company_name||'—'}</div>
            <div><span className={styles.src}>{l.source?.replace('_',' ')}</span></div>
            <div><span className={styles.scoreNum}>{l.icp_score}</span><div className={styles.scoreBar}><div style={{width:l.icp_score+'%'}}/></div></div>
            <div><span className={`${styles.badge} ${styles['badge_'+l.status]}`}>{l.status}</span></div>
            <div className={styles.sub}>{new Date(l.created_at).toLocaleDateString()}</div>
          </div>))}
      </div>
    </div>)
}
