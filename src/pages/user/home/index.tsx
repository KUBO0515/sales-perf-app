'use client'

import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/firebase'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import MobileMenu from '@/components/MobileMenu'
import WeeklyVisitsChart from '@/components/WeeklyVisitsChart'

/* 週情報を生成 */
const generateWeeksOfMonth = (year: number, month: number) => {
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const weeks: { label: string; start: Date; end: Date }[] = []
  const cur = new Date(firstDay)
  let idx = 1
  while (cur <= lastDay) {
    const start = new Date(cur)
    const end = new Date(
      Math.min(start.getTime() + 6 * 86_400_000, lastDay.getTime())
    )
    weeks.push({ label: `第${idx}週`, start, end })
    cur.setDate(cur.getDate() + 7)
    idx++
  }
  return weeks
}

export default function UserHome() {
  /* --- 日付状態 --- */
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)

  /* --- データ状態 --- */
  const [weeks, setWeeks] = useState<ReturnType<typeof generateWeeksOfMonth>>(
    []
  )
  const [userData, setUserData] = useState<number[]>([])
  const [teamData, setTeamData] = useState<number[]>([])
  const [user, setUser] = useState<User | null>(null)

  /* --- 認証監視 --- */
  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(), (u) => setUser(u))
    return () => unsub()
  }, [])

  /* --- Firestore 取得 --- */
  const fetchData = async (y: number, m: number, uid: string) => {
    const weekArr = generateWeeksOfMonth(y, m)
    setWeeks(weekArr)

    const first = weekArr[0].start
    const last = weekArr[weekArr.length - 1].end

    const teamSnap = await getDocs(
      query(
        collection(db, 'testcollection'),
        where('acquiredDate', '>=', Timestamp.fromDate(first)),
        where('acquiredDate', '<=', Timestamp.fromDate(last)),
        orderBy('acquiredDate')
      )
    )

    const userSnap = await getDocs(
      query(collection(db, 'testcollection'), where('uid', '==', uid))
    )

    const uArr = Array(weekArr.length).fill(0)
    const tArr = Array(weekArr.length).fill(0)

    /* -------- チーム -------- */
    teamSnap.forEach((doc) => {
      const { acquiredDate, visit = 0 } = doc.data() as {
        acquiredDate?: Timestamp
        visit?: number
      }
      if (!acquiredDate) return // ← ★ ここで安全にスキップ
      const date = acquiredDate.toDate()
      weekArr.forEach((w, i) => {
        if (date >= w.start && date <= w.end) tArr[i] += visit
      })
    })

    /* -------- 個人 -------- */
    userSnap.forEach((doc) => {
      const { acquiredDate, visit = 0 } = doc.data() as {
        acquiredDate?: Timestamp
        visit?: number
      }
      if (!acquiredDate) return // ← ★ 同じくチェック
      const date = acquiredDate.toDate()
      weekArr.forEach((w, i) => {
        if (date >= w.start && date <= w.end) uArr[i] += visit
      })
    })

    setUserData(uArr)
    setTeamData(tArr)
  }

  useEffect(() => {
    if (user) fetchData(year, month, user.uid)
  }, [user, year, month])

  /* --- 月送り --- */
  const prev = () => {
    setMonth((m) => (m === 1 ? 12 : m - 1))
    if (month === 1) setYear((y) => y - 1)
  }
  const next = () => {
    setMonth((m) => (m === 12 ? 1 : m + 1))
    if (month === 12) setYear((y) => y + 1)
  }

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
          <button
            onClick={prev}
            className="rounded-full bg-white px-4 py-2 font-bold text-gray-800 shadow-md transition hover:scale-105"
          >
            {month === 1 ? '12月' : `${month - 1}月`}
          </button>

          <h2 className="text-xl font-bold">
            {year}年{month}月の推移
          </h2>

          <button
            onClick={next}
            className="rounded-full bg-white px-4 py-2 font-bold text-gray-800 shadow-md transition hover:scale-105"
          >
            {month === 12 ? '1月' : `${month + 1}月`}
          </button>
        </div>

        {/* チャート */}
        <div className="z-10 w-full max-w-2xl rounded-3xl bg-white/80 p-8 shadow-2xl ring-1 ring-sky-100 backdrop-blur-lg">
          <WeeklyVisitsChart
            labels={weeks.map((w) => w.label)}
            userData={userData}
            teamData={teamData}
          />
        </div>
      </div>

      <MobileMenu />
    </>
  )
}
