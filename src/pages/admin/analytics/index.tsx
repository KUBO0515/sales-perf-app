import { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'

import ChartCard from '@components/ChartCard'
import AdminSidebar from '@components/AdminSidebar'
import Toggle from '@components/Toggle'
import { AppContext } from '@hooks/useApp'
import {
  MonthlyAggregate,
  monthlyAggregateConverter,
} from '@/types/MonthlyAggregate'
import {
  WeeklyAggregate,
  weeklyAggregateConverter,
} from '@/types/WeeklyAggregate'

export default function Page() {
  const { appContext } = useContext(AppContext)
  const companyId = appContext.company.id ?? ''

  const [isMonthly, setIsMonthly] = useState(true)
  // const [targetInputId, setTargetInputId] = useState<string | null>(null)

  const [aggregates, setAggregates] = useState<
    (MonthlyAggregate | WeeklyAggregate)[]
  >([])

  const title = isMonthly ? '月間集計データ' : '週間集計データ'

  const labels = aggregates.map((aggregate) => aggregate.timeLabel)
  const values = aggregates.map((aggregate) =>
    Number(aggregate.reports['7NMexcpCrSh7iPX6WQIR'])
  )

  const fetch = async () => {
    let aggregateSnapshot
    if (isMonthly) {
      aggregateSnapshot = await getDocs(
        collection(
          db,
          `companies/${companyId}/monthlyAggregates`
        ).withConverter(monthlyAggregateConverter)
      )
    } else {
      aggregateSnapshot = await getDocs(
        collection(db, `companies/${companyId}/weeklyAggregates`).withConverter(
          weeklyAggregateConverter
        )
      )
    }
    setAggregates(aggregateSnapshot.docs.map((doc) => doc.data()))
  }

  useEffect(() => {
    fetch()
  }, [isMonthly])

  return (
    <>
      <AdminSidebar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="ml-[280px] min-h-screen space-y-6 bg-gray-200 p-4"
      >
        <h1 className="text-2xl font-bold">Analytics</h1>
        <Toggle
          onChange={() => setIsMonthly((v) => !v)}
          defaultChecked={isMonthly}
          label="週間"
          opponentLabel="月間"
        />
        <ChartCard {...{ title, labels, values }} />
      </motion.div>
    </>
  )
}
