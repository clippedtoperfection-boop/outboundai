'use client'
import { useEffect, useRef, useState } from 'react'
import styles from './compose.module.css'
const STEPS = ['initial','followup_1','followup_2','breakup']
const TONES = ['conversational','direct','executive','casual']
export default function Compose() {
  const [leads,setLeads]=useState<any[]>([])
  const [leadId,setLeadId]=useState('')
  const [step,setStep]=useState('initial')
  const [tone,setTone]=useState('conversational')
  const [output,setOutput]=useState('')
  const [generating,setGenerating]=useState(false)
  const outRef=useRef<HTMLDivElement>(null)
  useEffect(()=>{fetch('/api/leads?limit=50').then(r=>r.json()).then(d=>{const l=d.leads||[];setLeads(l);if(l.length>0)setLeadId(l[0].id)})},[])
  const generate=async()=>{
    if(!leadId)return
    setGenerating(true);setOutput('')
    try{
      const res=await fetch('/api/compose',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({lead_id:leadId,step_type:step,tone})})
      const reader=res.body!.getReader(),dec=new TextDecoder()
      while(true){const{done,value}=await reader.read();if(done)break;setOutput(o=>o+dec.decode(value));if(outRef.current)outRef.current.scrollTop=outRef.current.scrollHeight}
    }finally{setGenerating(false)}
  }
  const selLead=leads.find(l=>l.id===leadId)
  return(<div className={styles.page}><div className={styles.grid}>
    <div className={styles.panel}>
      <div className={styles.label}>Lead</div>
      <select className={styles.sel} value={leadId} onChange={e=>setLeadId(e.target.value)}>
        {leads.map(l=><option key={l.id} value={l.id}>{l.first_name} {l.last_name} - {l.company_name||l.email}</option>)}
      </select>
      {selLead&&<div className={styles.signals}>
        <div className={styles.sigRow}><span className={styles.sigLabel}>Email</span><span>{selLead.email}</span></div>
        {selLead.title&&<div className={styles.sigRow}><span className={styles.sigLabel}>Title</span><span>{selLead.title}</span></div>}
        {selLead.company_name&&<div className={styles.sigRow}><span className={styles.sigLabel}>Company</span><span>{selLead.company_name}</span></div>}
        <div className={styles.sigRow}><span className={styles.sigLabel}=SICP Score</span><span className={styles.scoreVal}>{selLead.icp_score}</span></div>
      </div>}
      <div className={styles.label} style={{marginTop:'1rem'}}>Step</div>
      <div className={styles.pills}>{STEPS.map(s=><button key={s} className={`${styles.pill} ${step===s?styles.pillActive:''}`} onClick={()=>setStep(s)}>{s.replace('_',' ')}</button>)}</div>
      <div className={styles.label} style={{marginTop:'1rem'}}>Tone</div>
      <div className={styles.pills}>{TONES.map(t=<>button key={t} className={`${styles.pill} ${tone===t?styles.pillActive:''}`} onClick={()=>setTone(t)}>{t}</button>)}</div>
    </div>
    <div className={styles.panel}>
      <div className={styles.outputHead}><span className={styles.label}>AI Draft</span><button className={styles.genBtn} onClick={generate} disabled={generating||!leadId}>{generating?'Writing...':'Generate →'}</button></div>
      <div className={styles.output} ref={outRef}>
        {!output&&!generating&&<span className={styles.placeholder}>Click Generate</span>}
        {output&&<pre className={styles.pre}>{output}{generating&&<span className={styles.cursor}/>}</pre>}
      </div>
      {output&&<button className={styles.copyBtn} onClick={()=>navigator.clipboard.writeText(output)}>Copy</button>}
    </div>
  </div></div>)
}
