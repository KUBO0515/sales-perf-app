import RecordForm from '@/components/RecordForm'
import ChartCard from '@/components/ChartCard'
import MobileMenu from '@/components/MobileMenu'

export default function Home() {
  return (
    <>
      <div className="min-h-screen space-y-6 bg-gray-200 p-4">
        <h1 className="text-2xl font-bold">My Sales</h1>
        <RecordForm />
        <ChartCard
          title="Weekly Trend"
          labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}
          values={[3, 2, 5, 1, 4]}
        />
      </div>
      <MobileMenu />
    </>
  )
}
