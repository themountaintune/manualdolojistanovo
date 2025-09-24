import type { Metadata } from 'next'
import '../src/index.css'

export const metadata: Metadata = {
  title: 'Manual do Lojista - Guia Completo para E-commerce no Brasil',
  description: 'Guias independentes de e-commerce no Brasil: planilhas, checklists, metodologia clara. Aprenda a criar e gerenciar sua loja virtual com especialistas.',
  keywords: 'e-commerce, loja virtual, vendas online, marketing digital, empreendedorismo, Brasil',
  authors: [{ name: 'Manual do Lojista' }],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    url: 'https://manualdolojistanovo.vercel.app/',
    title: 'Manual do Lojista - Guia Completo para E-commerce no Brasil',
    description: 'Guias independentes de e-commerce no Brasil: planilhas, checklists, metodologia clara. Aprenda a criar e gerenciar sua loja virtual com especialistas.',
    images: ['https://manualdolojistanovo.vercel.app/og-default.jpg'],
    siteName: 'Manual do Lojista',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    url: 'https://manualdolojistanovo.vercel.app/',
    title: 'Manual do Lojista - Guia Completo para E-commerce no Brasil',
    description: 'Guias independentes de e-commerce no Brasil: planilhas, checklists, metodologia clara. Aprenda a criar e gerenciar sua loja virtual com especialistas.',
    images: ['https://manualdolojistanovo.vercel.app/og-default.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="canonical" href="https://manualdolojistanovo.vercel.app/" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          rel="preload" 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" 
          as="style" 
        />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
