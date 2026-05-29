import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { ReactNode } from 'react'
const nav=[{href:'/dashboard',label:'Dashboard'},{href:'/leads',label:'Leads'},{href:'/sequences',label:'Sequences'},{href:'/compose',label:'AI Compose'},{href:'/calls',label:'Calls'}]
export default function AppLayout({children}:{children:ReactNode}){
  return(
    <div style={{display:'flex',height:'100vh',overflow:'hidden',background:'var(--bg)'}}>
      <div style={{width:'220px',background:'var(--bg2)',borderRight:'1px solid var(--border)',display:'flex',flexDirection:'column',flexShrink:0}}>
        <div style={{padding:'20px 16px 16px',borderBottom:'1px solid var(--border)'}}>
          <div style={{fontFamily:'Syne,sans-serif',fontSize:'17px',fontWeight:700,color:'var(--txt)'}}>Outbound<span style={{color:'var(--accent)'}}>.</span>ai</div>
          <div style={{fontSize:'11px',color:'var(--txt3)',marginTop:'2px'}}>Lead generation engine</div>
        </div>
        <nav style={{flex:1,padding:'12px 8px',display:'flex',flexDirection:'column',gap:'2px'}}>
          {nav.map(n=><Link key={n.href} href={n.href} style={{display:'flex',alignItems:'center',padding:'9px 10px',borderRadius:'8px',color:'var(--txt2)',fontSize:'13px',textDecoration:'none',transition:'all .15s'}}>{n.label}</Link>)}
        </nav>
        <div style={{padding:'12px 16px',borderTop:'1px solid var(--border)'}}><UserButton afterSignOutUrl="/sign-in"/></div>
      </div>
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <div style={{padding:'12px 24px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'flex-end',background:'var(--bg2)',flexShrink:0}}><UserButton/></div>
        <div style={{flex:1,overflowY:'auto'}}>{children}</div>
      </div>
    </div>
  )
}
