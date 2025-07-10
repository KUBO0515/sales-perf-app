'use client'

import { useEffect, useState, useContext } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'

import MobileMenu from '@components/MobileMenu'
import PageHeader from '@components/PageHeader'
import { AppContext } from '@hooks/useApp'

type ReportFormat = {
  id: string
  name: string
}

export default function DailyFormats() {
  const { appContext } = useContext(AppContext)
  const companyId = appContext.company.id || ''
  const [formats, setFormats] = useState<ReportFormat[]>([])

  useEffect(() => {
    const fetchFormats = async () => {
      if (!companyId) return

      const snapshot = await getDocs(
        collection(db, 'companies', companyId, 'reportFormats')
      )

      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || '(名称未設定)',
      }))
      setFormats(list)
    }

    fetchFormats()
  }, [companyId])

  return (
    <>
      <PageHeader title="フォーマット選択" />
      <div className="relative mt-[70px] flex min-h-screen flex-col items-center space-y-14 overflow-hidden px-4 pt-12 pb-24">
        <div className="z-10 flex flex-col items-center space-y-6 text-center">
          <h1 className="text-3xl font-extrabold text-gray-800">
            フォーマットを選択してください
          </h1>
          {formats.map((format, i) => (
            <motion.div
              key={format.id}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
            >
              <Link
                to={`/user/dailyReport/${format.id}`}
                className="text-black-800 block w-64 rounded-2xl px-6 py-4 text-lg font-semibold shadow-md backdrop-blur-md transition hover:bg-sky-100"
              >
                {format.name}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <MobileMenu />
    </>
  )
}
