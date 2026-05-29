import AppLayout from '@/app/_app_layout'
import { ReactNode } from 'react'

export default function Layout({children}:{children:ReactNode}) {
  return <AppLayout>{children}</AppLayout>
}
