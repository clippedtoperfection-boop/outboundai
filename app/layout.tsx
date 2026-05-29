import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata = { title: 'Outbound.ai', description: 'Lead generation engine' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  )
}
