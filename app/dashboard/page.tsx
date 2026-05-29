'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null)
  useEffect(() => { fetch('/api/dashboard').then(r => r.json()).then(setStats) }, [])
  const pipeline = stats?.pipeline || []
  const activity = stats?.recent_activity || []
  const leads = stats?.recent_leads || []
  const stages = [
    {key:'new',label:'New',color:'#6c63ff'},
    {key:'contacted',label:'Contacted',color:'#4ecdc4'},
    {key:'replied',label:'Replied',color:'#f59e0b'},
    {key:'booked',label:'Booked',color:'#22c55e'},
  ]
  const getCount = (s: string) => pipeline.find((p:any) => p.status === s)?.count || 0
  const total = stages.reduce((sum, st) => sum + getCount(st.key), 1)
  return (
    <div style={{padding:'20px 24px'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px',marginBottom:'20px'}}>
        {[
          {label:'Total Leads',val:stats?.total_leads ?? '—'},
          {label:'Emails Sent',val:stats?.emails_sent ?? '—'},
          {label:'Reply Rate',val:stats?.reply_rate != null ? stats.reply_rate+'%' : '—'},
          {label:'Calls Booked',val:stats?.calls_booked ?? '—'},
        ].map(m => (
          <div key={m.label} style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'12px',padding:'16px 18px'}}>
            <div style={{fontSize:'11px',color:'var(--txt3)',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:'8px'}}>{m.label}</div>
            <div style={{fontSize:'26px',fontFamily:'Syne,sans-serif',fontWeight:700,color:'var(--txt)'}}>{m.val}</div>
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1.6fr 1fr',gap:'16px'}}>
        <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'12px',padding:'18px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
            <span style={{fontSize:'11px',color:'var(--txt3)',textTransform:'uppercase',letterSpacing:'.5px',fontWeight:500}}>Pipeline</span>
            <Link href="/leads" style={{fontSize:'12px',color:'var(--accent)'}}>View all</Link>
          </div>
          <div style={{display:'flex',gap:'8px',marginBottom:'20px'}}>
            {stages.map(st => (
              <div key={st.key} style={{flex:1,background:'var(--bg3)',borderRadius:'8px',padding:'10px'}}>
                <div style={{fontSize:'10px',color:'var(--txt3)',marginBottom:'4px'}}>{st.label}</div>
                <div style={{fontSize:'22px',fontWeight:700,fontFamily:'Syne,sans-serif',color:'var(--txt)'}}>{getCount(st.key)}</div>
                <div style={{height:'3px',background:'var(--bg4)',borderRadius:'2px',marginTop:'8px',overflow:'hidden'}}>
                  <div style={{width:getCount(st.key)/total*100+'%',height:'100%',background:st.color,borderRadius:'2px'}}/>
                </div>
              </div>
            ))}
          </div>
          <div style={{fontSize:'11px',color:'var(--txt3)',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:'12px'}}>Recent Leads</div>
          {leads.length === 0 && <div style={{fontSize:'13px',color:'var(--txt3)',padding:'12px 0'}}>No leads yet</div>}
          {leads.map((l:any) => (
            <div key={l.id} style={{display:'flex',alignItems:'center',gap:'10px',padding:'9px 0',borderBottom:'1px solid var(--border)'}}>
              <div style={{width:'30px',height:'30px',borderRadius:'7px',background:'var(--bg4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:600,color:'var(--txt2)',flexShrink:0}}>
                {l.first_name[0]}{l.last_name?.[0]||''}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:'13px',fontWeight:500,color:'var(--txt)'}}>{l.first_name} {l.last_name}</div>
                <div style={{fontSize:'11px',color:'var(--txt3)'}}>{l.company_name||l.email}</div>
              </div>
              <span style={{padding:'2px 7px',borderRadius:'4px',fontSize:'10px',fontWeight:500,background:'#6c63ff22',color:'#a89fff'}}>{l.status}</span>
              <span style={{fontSize:'12px',fontWeight:600,color:'var(--txt2)'}}>{l.icp_score}</span>
            </div>
          ))}
        </div>
        <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'12px',padding:'18px'}}>
          <div style={{fontSize:'11px',color:'var(--txt3)',textTransform:'uppercase',letterSpacing:'.5px',fontWeight:500,marginBottom:'16px'}}>Live Activity</div>
          {activity.length === 0 && <div style={{fontSize:'13px',color:'var(--txt3)'}}>No activity yet</div>}
          {activity.map((a:any) => (
            <div key={a.id} style={{display:'flex',gap:'10px',alignItems:'flex-start',padding:'8px 0',borderBottom:'1px solid var(--border)'}}>
              <div style={{width:'7px',height:'7px',borderRadius:'50%',background:'var(--accent)',marginTop:'5px',flexShrink:0}}/>
              <div style={{fontSize:'12px',color:'var(--txt2)',flex:1,lineHeight:1.5}}>{a.description}</div>
              <div style={{fontSize:'11px',color:'var(--txt3)',whiteSpace:'nowrap'}}>{new Date(a.created_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
