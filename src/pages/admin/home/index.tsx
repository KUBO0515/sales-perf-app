'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, Timestamp } from 'firebase/firestore'
import { db, exportCsv } from '@/firebase'

import AdminSidebar from '@/components/AdminSidebar'
import ChartCardTwo from '@/components/ChartCardTwo'

type MonthlyData = {
  label: string
  team: number
}

export default function AdminDashboard() {
  const [data, setData] = useState<MonthlyData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'testcollection'))

      const raw = snapshot.docs.map((doc) => {
        const d = doc.data()
        return {
          visit: d.visit || 0,
          date: (d.acquiredDate as Timestamp)?.toDate(),
        }
      })

      const now = new Date()
      const monthsToShow = 3
      const result: MonthlyData[] = []

      for (let i = monthsToShow - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthLabel = date.toLocaleString('default', { month: 'short' })

        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

        let teamSum = 0

        raw.forEach((entry) => {
          if (
            entry.date &&
            entry.date >= monthStart &&
            entry.date <= monthEnd
          ) {
            teamSum += entry.visit
          }
        })

        result.push({ label: monthLabel, team: teamSum })
      }

      setData(result)
    }

    fetchData()
  }, [])

  const download = async () => {
    const res = await exportCsv()
    const url = res.data as string
    window.open(url, '_blank')
  }

  return (
    <>
      <AdminSidebar />
      <div className="ml-[280px] min-h-screen space-y-6 bg-gray-300 p-6">
        <h1 className="text-2xl font-bold">管理者分析ツール</h1>

        <ChartCardTwo
          title="全体獲得数(月次)"
          labels={data.map((d) => d.label)}
          values={data.map((d) => d.team)}
        />

        <button
          onClick={download}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Export CSV
        </button>
      </div>
    </>
  )
}
