import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div style={{display:'flex',height:'100vh',alignItems:'center',justifyContent:'center',background:'var(--bg)'}}>
      <SignIn />
    </div>
  )
}
