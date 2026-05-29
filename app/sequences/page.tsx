'use client'
import { useEffect, useState } from 'react'
import styles from './sequences.module.css'

export default function Sequences() {
  const [seqs, setSeqs] = useState<any[]>([])
  useEffect(() => { fetch('/api/sequences').then(r => r.json()).then(d => setSeqs(d.sequences||[])) }, [])
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className={styles.sub}>{seqs.length} sequences</span>
        <button className={styles.btn}>+ New Sequence</button>
      </div>
      {seqs.map((s:any) => (
        <div key={s.id} className={styles.card}>
          <div className={styles.cardHead}>
            <div><div className={styles.cardName}>{s.name}</div><div className={styles.cardSub}>{s.description}</div></div>
            <span className={`${styles.badge} ${s.status==='active'?styles.active:styles.paused}`}>{s.auto_enroll?Auto:s.status}</span>
          </div>
          <div className={styles.metrics}>
            {[{label:'Enrolled',val:s.enrolled??0,color:'var(--txt)'},{label:'Open rate',val:s.open_rate!=null?s.open_rate+'%':'—',color:'#4ecdc4'},{label:'Reply rate',val:s.reply_rate!=null?s.reply_rate+'%':'—',color:'#f59e0b'},{label:'Booked',val:s.booked??0,color:'#22c55e'}].map(m => (
              <div key={m.label} className={styles.metric}>
                <div className={styles.metricVal} style={{color:m.color}}>{m.val}</div>
                <div className={styles.metricLabel}>{m.label}</div>
              </div>))}
          </div>
        </div>))}
    </div>)
}
