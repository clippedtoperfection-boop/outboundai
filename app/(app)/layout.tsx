import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import styles from './layout.module.css'
import { ReactNode } from 'react'
const nav=[{href:'/dashboard',label:'Dashboard'},{href:'/leads',label:'Leads'},{href:'/sequences',label:'Sequences'},{href:'/compose',label:'AI Compose'},{href:'/calls',label:'Calls'}]
export default function AppLayout({children}:{children:ReactNode}){
  return(
    <div className={styles.app}>
      <div className={styles.sidebar}>
        <div className={styles.logo}>Outbound<span className={styles.dot}>.</span>ai<div className={styles.logoSub}>Lead generation engine</div></div>
        <nav className={styles.nav}>{nav.map(n=><Link href={n.href} key={n.href} className={styles.navItem}>{n.label}</Link>)}</nav>
        <div className={styles.foot}><UserButton afterSignOutUrl="/sign-in"/></div>
      </div>
      <div className={styles.main}>
        <div className={styles.topbar}><div className={styles.topbarRight}><UserButton/></div></div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>)
}
