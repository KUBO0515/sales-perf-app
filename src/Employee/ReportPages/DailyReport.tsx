import ReportForm from '../../Layouts/Formats/SampleReportForm'
import MobileMenu from '../../Layouts/MobileMenu'
import PageHeader from '../../Layouts/PageHeader'

export default function DailyReport() {
  return (
    <>
      <PageHeader title="日報報告" />
      <ReportForm />
      <MobileMenu />
    </>
  )
}
