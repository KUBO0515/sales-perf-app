// TODO: 月を選択できるようにする
// TODO: フォーマットを選択できるようにする
// TODO: 入力項目を選択できるようにする

import { useContext, useEffect, useState } from 'react'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { AppContext } from '@/hooks/useApp'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import MobileMenu from '@/components/MobileMenu'
import WeeklyVisitsChart from '@/components/WeeklyVisitsChart'
import {
  WeeklyAggregate,
  weeklyAggregateConverter,
} from '@/types/WeeklyAggregate'
import { ReportFormat, reportFormatConverter } from '@/types/ReportFormat'
import {
  ReportFormatInput,
  reportFormatInputConverter,
} from '@/types/ReportFormatInput'

export default function UserHome() {
  const { appContext } = useContext(AppContext)
  const userId = appContext.user.id ?? ''
  const companyId = appContext.company.id ?? ''

  /* --- 日付状態 --- */
  const today = new Date()
  const [year] = useState(today.getFullYear())
  // const [month, setMonth] = useState(today.getMonth() + 1)
  const [month] = useState(5)

  const [, setReportFormats] = useState<ReportFormat[]>([])
  const [, setCurrentReportFormatInputs] = useState<ReportFormatInput[]>([])

  const [targetFormatId, setTargetFormatId] = useState('')
  const [targetInputId, setTargetInputId] = useState<string | null>(null)

  const [userAggregates, setUserAggregates] = useState<WeeklyAggregate[]>([])
  const [totalAggregates, setTotalAggregates] = useState<WeeklyAggregate[]>([])

  useEffect(() => {
    const fetchData = async () => {
      // 報告フォーマットを取得
      const newFormats = (
        await getDocs(
          collection(db, `companies/${companyId}/reportFormats`).withConverter(
            reportFormatConverter
          )
        )
      ).docs.map((doc) => doc.data())
      const newTargetFormatId =
        targetFormatId !== '' ? targetFormatId : newFormats[0].id || ''

      // 報告フォーマットの入力項目を取得
      const newReportFormatInputs = (
        await getDocs(
          collection(
            db,
            `companies/${companyId}/reportFormats/${newTargetFormatId}/reportFormatInputs`
          ).withConverter(reportFormatInputConverter)
        )
      ).docs.map((doc) => doc.data())
      const newTargetInputId =
        targetInputId !== null ||
        newReportFormatInputs.find((i) => i.id === targetInputId) != null
          ? targetInputId
          : newReportFormatInputs.find((i) => i.type === 'number')?.id || null

      const newUserAggregates: WeeklyAggregate[] = []
      const newTotalAggregates: WeeklyAggregate[] = []

      for (let i = month * 4 - 3; i <= month * 4; i++) {
        // 週集計データを取得(個人)
        const newUserAggregate = (
          await getDoc(
            doc(
              db,
              `companies/${companyId}/weeklyAggregates/${year}-${('0' + i).slice(-2)}-${newTargetFormatId}/users/${userId}`
            ).withConverter(weeklyAggregateConverter)
          )
        ).data()

        if (newUserAggregate) {
          newUserAggregates.push(newUserAggregate)
        }

        // 週集計データを取得(全体)
        const newTotalAggregate = (
          await getDoc(
            doc(
              db,
              `companies/${companyId}/weeklyAggregates/${year}-${('0' + i).slice(-2)}-${newTargetFormatId}`
            ).withConverter(weeklyAggregateConverter)
          )
        ).data()

        if (newTotalAggregate) {
          newTotalAggregates.push(newTotalAggregate)
        }
      }

      setReportFormats(newFormats)
      setTargetFormatId(newTargetFormatId)

      setCurrentReportFormatInputs(newReportFormatInputs)
      setTargetInputId(newTargetInputId)

      setUserAggregates(newUserAggregates)
      setTotalAggregates(newTotalAggregates)
    }
    fetchData()
  }, [year, month, targetFormatId, targetInputId, companyId, userId])

  /* --- 画面 --- */
  return (
    <>
      <div className="relative flex min-h-screen flex-col items-center space-y-14 overflow-hidden bg-gradient-to-b from-white via-sky-50 to-indigo-50 px-4 pt-12 pb-24">
        {/* フォーマット遷移ボタン */}
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Link
            to="/user/dailyFormats"
            className="block rounded-2xl bg-white/90 px-8 py-4 font-semibold text-gray-800 shadow-lg backdrop-blur hover:bg-sky-100"
          >
            日報報告
          </Link>
        </motion.div>

        {/* 月表示 */}
        <div className="flex items-center justify-between gap-5 p-4">
          {/* <button
            onClick={prev}
            className="rounded-full bg-white px-4 py-2 font-bold text-gray-800 shadow-md transition hover:scale-105"
          >
            {month === 1 ? '12月' : `${month - 1}月`}
          </button> */}

          <h2 className="text-xl font-bold">
            {year}年{month}月の推移
          </h2>

          {/* <button
            onClick={next}
            className="rounded-full bg-white px-4 py-2 font-bold text-gray-800 shadow-md transition hover:scale-105"
          >
            {month === 12 ? '1月' : `${month + 1}月`}
          </button> */}
        </div>

        {/* チャート */}
        <div className="z-10 w-full max-w-2xl rounded-3xl bg-white/80 p-8 shadow-2xl ring-1 ring-sky-100 backdrop-blur-lg">
          <WeeklyVisitsChart
            labels={userAggregates.map((a) => a.timeLabel)}
            userAggregates={userAggregates}
            totalAggregates={totalAggregates}
            inputId={targetInputId}
          />
        </div>
      </div>

      <MobileMenu />
    </>
  )
}
