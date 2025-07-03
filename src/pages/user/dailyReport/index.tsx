import ReportForm from '@/components/ReportForm'
import MobileMenu from '@/components/MobileMenu'
import PageHeader from '@/components/PageHeader'

export default function Page() {
  return (
    <>
      <PageHeader title="日報報告" />
      <ReportForm />
      <MobileMenu />
    </>
  )
}
