import type { Metadata } from 'next'
import './globals.css'
import Head from "next/head"

// SEO 최적화 메타데이터
export const metadata: Metadata = {
  title: '엑셀 숫자 한글 변환기 | 로마·한자 변환 | 무료 실무 도구',
  description: '엑셀, 계약서, 세금계산서 등에서 숫자를 한글, 로마 숫자, 한자로 변환하는 무료 실무 도구. 복사/붙여넣기, 모바일 지원, 실무 활용 팁 제공.',
  keywords: ['숫자 한글 변환', '엑셀 숫자 변환', '로마 숫자 변환', '한자 숫자 변환', '계약서 금액 변환', '무료 변환기', '실무 팁', 'Excel number to Korean', 'number to roman', 'number to chinese'],
  openGraph: {
    title: '엑셀 숫자 한글 변환기 | 로마·한자 변환 | 무료 실무 도구',
    description: '엑셀, 계약서, 세금계산서 등에서 숫자를 한글, 로마 숫자, 한자로 변환하는 무료 실무 도구. 복사/붙여넣기, 모바일 지원, 실무 활용 팁 제공.',
    url: 'https://numbertokorean.com/',
    siteName: '엑셀 숫자 한글 변환기',
    images: [
      {
        url: '/placeholder-logo.png',
        width: 600,
        height: 315,
        alt: '엑셀 숫자 한글 변환기 로고',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '엑셀 숫자 한글 변환기 | 로마·한자 변환 | 무료 실무 도구',
    description: '엑셀, 계약서, 세금계산서 등에서 숫자를 한글, 로마 숫자, 한자로 변환하는 무료 실무 도구. 복사/붙여넣기, 모바일 지원, 실무 활용 팁 제공.',
    images: ['/placeholder-logo.png'],
    creator: '@your_twitter', // 실제 계정으로 교체
  },
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <Head>
        {/* canonical 태그: 실제 배포시 도메인으로 교체 */}
        <link rel="canonical" href="https://ganglenumber-trange.vercel.app/" />
        {/* 구글 애드센스 광고 스크립트 */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1489120723407453" crossOrigin="anonymous"></script>
      </Head>
      <body>{children}</body>
    </html>
  )
}
