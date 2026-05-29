import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div style={{display:'flex',height:'100vh',alignItems:'center',justifyContent:'center',background:'var(--bg)'}}>
      <SignUp />
    </div>
  )
}
