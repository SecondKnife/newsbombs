import { genPageMetadata } from 'data/seo'
import SectionContainer from '@components/SectionContainer'
import PageTitle from '@components/PageTitle'

export const metadata = genPageMetadata({ title: 'Tra cứu thông tin' })

export default function SearchPage() {
  return (
    <SectionContainer>
      <div className="pt-6 pb-8 space-y-2 md:space-y-5">
        <PageTitle>Tra cứu thông tin</PageTitle>
      </div>
      <div className="prose max-w-none dark:prose-invert">
        <p>Trang tra cứu thông tin đang được phát triển...</p>
      </div>
    </SectionContainer>
  )
}

