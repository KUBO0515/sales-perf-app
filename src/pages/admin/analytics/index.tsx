import { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
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
import { ReportFormat, reportFormatConverter } from '@/types/ReportFormat'
import {
  ReportFormatInput,
  reportFormatInputConverter,
} from '@/types/ReportFormatInput'

export default function Page() {
  const { appContext } = useContext(AppContext)
  const companyId = appContext.company.id ?? ''

  const [isMonthly, setIsMonthly] = useState(false)

  const [reportFormats, setReportFormats] = useState<ReportFormat[]>([])
  const [currentReportFormatInputs, setCurrentReportFormatInputs] = useState<
    ReportFormatInput[]
  >([])

  const [targetFormatId, setTargetFormatId] = useState('')
  const [targetInputId, setTargetInputId] = useState<string | null>(null)

  const [aggregates, setAggregates] = useState<
    (MonthlyAggregate | WeeklyAggregate)[]
  >([])

  const title = isMonthly ? '月間集計データ' : '週間集計データ'

  const labels = aggregates.map((aggregate) => aggregate.timeLabel)
  const values = aggregates.map((aggregate) =>
    Number(aggregate.reports[targetInputId ?? 'value'] ?? 0)
  )

  const fetch = async () => {
    // 報告フォーマットを全件取得
    const newReportFormats = (
      await getDocs(
        collection(db, `companies/${companyId}/reportFormats`).withConverter(
          reportFormatConverter
        )
      )
    ).docs.map((doc) => doc.data())

    const newTargetFormatId =
      targetFormatId === '' ? newReportFormats[0]?.id : targetFormatId

    // 対象の報告フォーマットの入力項目を取得
    const newCurrentReportFormatInputs = (
      await getDocs(
        collection(
          db,
          `companies/${companyId}/reportFormats/${newTargetFormatId}/reportFormatInputs`
        ).withConverter(reportFormatInputConverter)
      )
    ).docs
      .map((doc) => doc.data())
      .filter((input) => input.type === 'number')

    let aggregateSnapshot
    if (isMonthly) {
      aggregateSnapshot = await getDocs(
        query(
          collection(
            db,
            `companies/${companyId}/monthlyAggregates`
          ).withConverter(monthlyAggregateConverter),
          where('reportFormatId', '==', newTargetFormatId),
          orderBy('ym')
        )
      )
    } else {
      aggregateSnapshot = await getDocs(
        query(
          collection(
            db,
            `companies/${companyId}/weeklyAggregates`
          ).withConverter(weeklyAggregateConverter),
          where('reportFormatId', '==', newTargetFormatId),
          orderBy('yearWeek')
        )
      )
    }

    setReportFormats(newReportFormats)
    setCurrentReportFormatInputs(newCurrentReportFormatInputs)
    setTargetFormatId(newTargetFormatId || '')
    setTargetInputId(newCurrentReportFormatInputs[0]?.id ?? null)
    setAggregates(aggregateSnapshot.docs.map((doc) => doc.data()))
  }

  useEffect(() => {
    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMonthly, targetFormatId, targetInputId])

  return (
    <>
      <AdminSidebar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="ml-[280px] min-h-screen space-y-6 bg-gray-200 p-4"
      >
        <h1 className="text-2xl font-bold">データ分析</h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="rounded-2xl bg-white p-4 shadow"
        >
          <div className="flex">
            <Toggle
              onChange={() => setIsMonthly((v) => !v)}
              defaultChecked={isMonthly}
              label="週間"
              opponentLabel="月間"
            />
            <div className="ms-4 flex items-center border-s ps-4">
              <label>報告フォーマット</label>
              <select
                className="ml-4 rounded border p-2"
                onChange={(e) => setTargetFormatId(e.target.value)}
              >
                {reportFormats.map((format) => (
                  <option
                    key={format.id}
                    value={format.id}
                    selected={targetFormatId === format.id}
                    onClick={() => setTargetFormatId(format.id || '')}
                  >
                    {format.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="ms-4 flex items-center border-s ps-4">
              <label>項目</label>
              <select
                className="ml-4 rounded border p-2"
                onChange={(e) => setTargetInputId(e.target.value)}
              >
                {currentReportFormatInputs.map((input) => (
                  <option
                    key={input.id}
                    value={input.id}
                    selected={targetInputId === input.id}
                    onClick={() => setTargetInputId(input.id || null)}
                  >
                    {input.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>
        <ChartCard {...{ title, labels, values }} />
      </motion.div>
    </>
  )
}
