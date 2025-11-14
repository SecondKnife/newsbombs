import { genPageMetadata } from 'data/seo'
import SectionContainer from '@components/SectionContainer'
import PageTitle from '@components/PageTitle'

export const metadata = genPageMetadata({ title: 'Đăng ký' })

export default function RegisterPage() {
  return (
    <SectionContainer>
      <div className="pt-6 pb-8 space-y-2 md:space-y-5">
        <PageTitle>Đăng ký</PageTitle>
      </div>
      <div className="prose max-w-none dark:prose-invert">
        <p>Trang đăng ký đang được phát triển...</p>
      </div>
    </SectionContainer>
  )
}

