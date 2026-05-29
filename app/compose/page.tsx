'use client'
import { useEffect, useRef, useState } from 'react'

const STEPS = ['initial', 'followup_1', 'followup_2', 'breakup']
const TONES = ['conversational', 'direct', 'executive', 'casual']

export default function Compose() {
  const [leads, setLeads] = useState<any[]>([])
  const [leadId, setLeadId] = useState('')
  const [step, setStep] = useState('initial')
  const [tone, setTone] = useState('conversational')
  const [output, setOutput] = useState('')
  const [gen, setGen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/leads?limit=50').then(r => r.json()).then(d => {
      const l = d.leads || []
      setLeads(l)
      if (l.length > 0) setLeadId(l[0].id)
    })
  }, [])

  const generate = async () => {
    if (!leadId) return
    setGen(true)
    setOutput('')
    try {
      const res = await fetch('/api/compose', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({lead_id: leadId, step_type: step, tone})
      })
      const reader = res.body!.getReader()
      const dec = new TextDecoder()
      while (true) {
        const {done, value} = await reader.read()
        if (done) break
        setOutput(o => o + dec.decode(value))
        if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
      }
    } finally {
      setGen(false)
    }
  }

  const sel = leads.find(l => l.id === leadId)
  const pill = (active: boolean): any => ({
    padding: '5px 11px', borderRadius: '5px', fontSize: '11px',
    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
    background: active ? '#6c63ff15' : 'var(--bg3)',
    color: active ? 'var(--accent)' : 'var(--txt2)', cursor: 'pointer'
  })

  return (
    <div style={{padding:'20px 24px'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1.4fr',gap:'16px'}}>
        <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'12px',padding:'18px'}}>
          <div style={{fontSize:'11px',color:'var(--txt3)',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:'7px'}}>Lead</div>
          <select
            style={{width:'100%',padding:'8px 10px',background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:'7px',color:'var(--txt)',fontSize:'13px',outline:'none',marginBottom:'14px'}}
            value={leadId} onChange={e => setLeadId(e.target.value)}
          >
            {leads.map(l => (
              <option key={l.id} value={l.id}>{l.first_name} {l.last_name} — {l.company_name || l.email}</option>
            ))}
          </select>
          {sel && (
            <div style={{background:'var(--bg3)',borderRadius:'8px',padding:'12px',marginBottom:'14px'}}>
              {[['Email', sel.email], sel.title && ['Title', sel.title], sel.company_name && ['Co', sel.company_name], ['Score', sel.icp_score]].filter(Boolean).map((row: any) => (
                <div key={row[0]} style={{display:'flex',justifyContent:'space-between',fontSize:'12px',color:'var(--txt2)',padding:'3px 0',borderBottom:'1px solid var(--border)'}}>
                  <span style={{color:'var(--txt3)'}}>{row[0]}</span>
                  <span>{row[1]}</span>
                </div>
              ))}
            </div>
          )}
          <div style={{fontSize:'11px',color:'var(--txt3)',textTransform:'uppercase',marginBottom:'7px',marginTop:'14px'}}>Step</div>
          <div style={{display:'flex',gap:'6px',flexWrap:'wrap',marginBottom:'14px'}}>
            {STEPS.map(s => <button key={s} style={pill(step === s)} onClick={() => setStep(s)}>{s.replace('_', ' ')}</button>)}
          </div>
          <div style={{fontSize:'11px',color:'var(--txt3)',textTransform:'uppercase',marginBottom:'7px'}}>Tone</div>
          <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
            {TONES.map(t => <button key={t} style={pill(tone === t)} onClick={() => setTone(t)}>{t}</button>)}
          </div>
        </div>
        <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'12px',padding:'18px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
            <span style={{fontSize:'11px',color:'var(--txt3)',textTransform:'uppercase',letterSpacing:'.5px'}}>AI Draft</span>
            <button
              style={{padding:'7px 16px',background:'var(--accent)',border:'none',borderRadius:'7px',color:'#fff',fontSize:'13px',fontWeight:500,cursor:gen||!leadId?'not-allowed':'pointer',opacity:gen||!leadId?0.5:1}}
              onClick={generate} disabled={gen || !leadId}
            >
              {gen ? 'Writing...' : 'Generate →'}
            </button>
          </div>
          <div ref={ref} style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:'8px',padding:'14px',minHeight:'280px',maxHeight:'400px',overflowY:'auto'}}>
            {!output && !gen && <span style={{fontSize:'13px',color:'var(--txt3)'}}>Click Generate to write a personalized email</span>}
            {output && <pre style={{fontFamily:'inherit',fontSize:'13px',color:'var(--txt2)',whiteSpace:'pre-wrap',lineHeight:1.7,margin:0}}>{output}</pre>}
          </div>
          {output && (
            <button
              style={{marginTop:'10px',width:'100%',padding:'8px',background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:'7px',color:'var(--txt2)',fontSize:'12px',cursor:'pointer'}}
              onClick={() => navigator.clipboard.writeText(output)}
            >
              Copy to clipboard
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
