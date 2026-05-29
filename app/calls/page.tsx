'use client'
import { useEffect, useState } from 'react'
export default function Calls() {
  const [calls,setCalls]=useState<any[]>([])
  const [goal]=useState(30)
  const [sel,setSel]=useState<string|null>(null)
  const [showBook,setShowBook]=useState(false)
  const [bookDate,setBookDate]=useState('')
  const [bookTime,setBookTime]=useState('10:00')
  const [cal,setCal]=useState(()=>new Date())
  useEffect(()=>{fetch('/api/calls').then(r=>r.json()).then(d=>setCalls(d.calls||[]))},[])
  const now=new Date()
  const thisMonth=calls.filter(c=>{const d=new Date(c.scheduled_at);return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear()})
  const pct=Math.min(100,Math.round(thisMonth.length/goal*100))
  const y=cal.getFullYear(),m=cal.getMonth()
  const fd=new Date(y,m,1).getDay()
  const dim=new Date(y,m+1,0).getDate()
  const today=now.toDateString()
  const cod=(day:number)=>{const d=new Date(y,m,day).toDateString();return calls.filter(c=>new Date(c.scheduled_at).toDateString()===d)}
  const months=['January','February','March','April','May','June','July','August','September','October','November','December']
  const upcoming=calls.filter(c=>new Date(c.scheduled_at)>=now&&c.status==='scheduled').sort((a,b)=>+new Date(a.scheduled_at)-+new Date(b.scheduled_at)).slice(0,8)
  return(
    <div style={{padding:'20px 24px'}}>
      <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:'16px'}}>
        <div>
          <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'12px',padding:'18px',marginBottom:'16px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
              <button onClick={()=>setCal(c=>new Date(c.getFullYear(),c.getMonth()-1,1))} style={{background:'none',border:'1px solid var(--border)',borderRadius:'6px',color:'var(--txt2)',cursor:'pointer',padding:'4px 10px',fontSize:'14px'}}>{'<'}</button>
              <span style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'15px',color:'var(--txt)'}}>{months[m]} {y}</span>
              <button onClick={()=>setCal(c=>new Date(c.getFullYear(),c.getMonth()+1,1))} style={{background:'none',border:'1px solid var(--border)',borderRadius:'6px',color:'var(--txt2)',cursor:'pointer',padding:'4px 10px',fontSize:'14px'}}>{'>'}</button>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:'4px',marginBottom:'8px'}}>
              {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d=><div key={d} style={{textAlign:'center',fontSize:'10px',color:'var(--txt3)',padding:'4px 0'}}>{d}</div>)}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:'4px'}}>
              {Array.from({length:fd}).map((_,i)=><div key={'e'+i}/>)}
              {Array.from({length:dim},(_,i)=>i+1).map(day=>{
                const ds=new Date(y,m,day).toDateString()
                const dc=cod(day),iT=ds===today,iS=sel===ds
                return<div key={day} onClick={()=>setSel(iS?null:ds)} style={{textAlign:'center',padding:'8px 4px',borderRadius:'8px',cursor:'pointer',background:iS?'var(--accent)':iT?'#6c63ff15':'var(--bg3)',border:'1px solid '+(iS||iT?'var(--accent)':'transparent'),transition:'all .15s'}}>
                  <div style={{fontSize:'13px',fontWeight:iT?700:400,color:iS?'#fff':iT?'var(--accent)':'var(--txt)'}}>{day}</div>
                  {dc.length>0&&<div style={{width:'5px',height:'5px',borderRadius:'50%',background:iS?'#fff':'var(--accent)',margin:'2px auto 0'}}/>}
                </div>
              })}
            </div>
            <button onClick={()=>{setBookDate(sel?new Date(sel).toISOString().split('T')[0]:new Date().toISOString().split('T')[0]);setShowBook(true)}} style={{marginTop:'14px',width:'100%',padding:'9px',background:'var(--accent)',border:'none',borderRadius:'8px',color:'#fff',fontSize:'13px',fontWeight:500,cursor:'pointer'}}>+ Book a call</button>
          </div>
          <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'12px',padding:'18px'}}>
            <div style={{fontSize:'11px',color:'var(--txt3)',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:'12px'}}>Monthly goal</div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}><span style={{fontSize:'13px',color:'var(--txt2)'}}>Calls booked</span><span style={{fontSize:'16px',fontWeight:700,fontFamily:'Syne,sans-serif',color:'var(--txt)'}}>{thisMonth.length} / {goal}</span></div>
            <div style={{height:'8px',background:'var(--bg3)',borderRadius:'4px',overflow:'hidden'}}><div style={{width:pct+'%',height:'100%',background:'linear-gradient(90deg,#6c63ff,#4ecdc4)',borderRadius:'4px',transition:'width .4s'}}/></div>
            <div style={{fontSize:'11px',color:'var(--txt3)',marginTop:'6px'}}>{goal-thisMonth.length} more to hit goal</div>
          </div>
        </div>
        <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'12px',padding:'18px'}}>
          <div style={{fontSize:'11px',color:'var(--txt3)',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:'14px'}}>Upcoming calls</div>
          {upcoming.length===0&&<div style={{fontSize:'13px',color:'var(--txt3)',padding:'20px 0'}}>No upcoming calls</div>}
          {upcoming.map(c=>(
            <div key={c.id} style={{display:'flex',gap:'12px',alignItems:'center',padding:'10px 0',borderBottom:'1px solid var(--border)'}}>
              <div style={{fontSize:'12px',fontWeight:500,color:'var(--txt2)',minWidth:'52px'}}>{new Date(c.scheduled_at).toLocaleDateString('en-US',{month:'short',day:'numeric'})}<br/><span style={{color:'var(--txt3)',fontSize:'11px'}}>{new Date(c.scheduled_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span></div>
              <div><div style={{fontSize:'13px',fontWeight:500,color:'var(--txt)'}}>{c.leads?.first_name} {c.leads?.last_name}</div><div style={{fontSize:'11px',color:'var(--txt3)'}}>{c.leads?.company_name||c.leads?.email||'No lead'}</div></div>
              <span style={{marginLeft:'auto',padding:'2px 7px',borderRadius:'4px',fontSize:'10px',background:'#22c55e22',color:'#22c55e',whiteSpace:'nowrap'}}>{c.status}</span>
            </div>
          ))}
        </div>
      </div>
      {showBook&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
          <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'14px',padding:'24px',width:'360px'}}>
            <div style={{fontSize:'15px',fontWeight:500,color:'var(--txt)',marginBottom:'20px'}}>Book a Call</div>
            <label style={{display:'block',marginBottom:'12px'}}><div style={{fontSize:'11px',color:'var(--txt3)',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:'6px'}}>Date</div><input type="date" value={bookDate} onChange={e=>setBookDate(e.target.value)} style={{width:'100%',padding:'8px 10px',background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:'7px',color:'var(--txt)',fontSize:'13px',outline:'none'}}/></label>
            <label style={{display:'block',marginBottom:'20px'}}><div style={{fontSize:'11px',color:'var(--txt3)',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:'6px'}}>Time</div><input type="time" value={bookTime} onChange={e=>setBookTime(e.target.value)} style={{width:'100%',padding:'8px 10px',background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:'7px',color:'var(--txt)',fontSize:'13px',outline:'none'}}/></label>
            <div style={{display:'flex',gap:'10px'}}>
              <button onClick={()=>setShowBook(false)} style={{flex:1,padding:'9px',background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:'8px',color:'var(--txt2)',fontSize:'13px',cursor:'pointer'}}>Cancel</button>
              <button onClick={async()=>{await fetch('/api/calls',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({scheduled_at:bookDate+'T'+bookTime+':00',duration_minutes:30})});setShowBook(false);fetch('/api/calls').then(r=>r.json()).then(d=>setCalls(d.calls||[]))}} style={{flex:1,padding:'9px',background:'var(--accent)',border:'none',borderRadius:'8px',color:'#fff',fontSize:'13px',fontWeight:500,cursor:'pointer'}}>Book</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}