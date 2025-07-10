'use client'

import { useEffect, useState, useContext } from 'react'
import {
  collectionGroup,
  getDocs,
  query,
  orderBy,
  Timestamp,
  deleteDoc,
  doc,
  where,
} from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { db } from '@/firebase'
import { motion } from 'framer-motion'
import MobileMenu from '@/components/MobileMenu'
import { AppContext } from '@hooks/useApp'

type Report = {
  id: string
  inputs: Record<string, string>
  createdAt?: Timestamp
  companyId: string
  formatId: string
  dateKey: string
}

export default function ReportHistory() {
  const { appContext } = useContext(AppContext)
  const companyId = appContext.company.id || ''

  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [inputNameMap, setInputNameMap] = useState<Record<string, string>>({})
  const [formatNameMap, setFormatNameMap] = useState<Record<string, string>>({})

  useEffect(() => {
    const auth = getAuth()

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user || !companyId) return

      try {
        const q = query(
          collectionGroup(db, 'dailyReports'),
          where('uid', '==', user.uid), // UID でフィルタ
          orderBy('createdAt', 'desc')
        )
        const snapshot = await getDocs(q)

        const fetched: Report[] = []
        for (const docSnap of snapshot.docs) {
          const path = docSnap.ref.path
          const pathParts = path.split('/')
          const companyId = pathParts[1]
          const formatId = pathParts[3]
          const dateKey = pathParts[5]

          fetched.push({
            id: docSnap.id,
            ...(docSnap.data() as any),
            companyId,
            formatId,
            dateKey,
          })
        }
        setReports(fetched)
      } catch (err) {
        console.error('データ取得エラー:', err)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [companyId])

  // 入力項目ID→名前のマッピング
  useEffect(() => {
    const fetchInputNames = async () => {
      if (!companyId) return
      const snapshot = await getDocs(collectionGroup(db, 'reportFormatInputs'))
      const map: Record<string, string> = {}
      snapshot.docs.forEach((doc) => {
        map[doc.id] = doc.data().name
      })
      setInputNameMap(map)
    }

    fetchInputNames()
  }, [companyId])

  // フォーマットID→フォーマット名のマッピング
  useEffect(() => {
    const fetchFormatNames = async () => {
      if (!companyId) return
      const snapshot = await getDocs(collectionGroup(db, 'reportFormats'))
      const map: Record<string, string> = {}
      snapshot.docs.forEach((doc) => {
        map[doc.id] = doc.data().name || '(名称未設定)'
      })
      setFormatNameMap(map)
    }

    fetchFormatNames()
  }, [companyId])

  const handleDelete = async (report: Report) => {
    const confirmDelete = confirm('このデータを削除しますか？')
    if (!confirmDelete) return

    try {
      const docPath = `companies/${report.companyId}/reportFormats/${report.formatId}/days/${report.dateKey}/dailyReports/${report.id}`
      await deleteDoc(doc(db, docPath))
      setReports((prev) => prev.filter((r) => r.id !== report.id))
      alert('削除しました')
    } catch (error) {
      console.error('削除エラー:', error)
      alert('削除に失敗しました')
    }
  }

  const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp?.toDate) return ''
    const date = timestamp.toDate()
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white to-gray-100 px-4 pt-12 pb-24">
        <div className="z-10 mx-auto max-w-2xl space-y-6">
          <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
            あなたの日報履歴
          </h1>

          {loading ? (
            <p className="text-center text-gray-400">読み込み中...</p>
          ) : reports.length === 0 ? (
            <p className="text-center text-gray-400">データがありません</p>
          ) : (
            reports.map((report, index) => (
              <motion.div
                key={report.id}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="space-y-2 rounded-xl bg-white p-6 shadow-xl transition-all"
              >
                <h2 className="text-lg font-bold text-gray-800">
                  フォーマット:{' '}
                  {formatNameMap[report.formatId] || report.formatId}
                </h2>

                {Object.entries(report.inputs).map(([id, value]) => (
                  <p key={id} className="text-gray-700">
                    <strong>{inputNameMap[id] || id}:</strong> {value}
                  </p>
                ))}
                <p className="text-sm text-gray-500">
                  送信日: {formatDate(report.createdAt)}
                </p>
                <div className="pt-2 text-right">
                  <button
                    onClick={() => handleDelete(report)}
                    className="rounded bg-red-500 px-4 py-1 text-sm text-white hover:bg-red-600"
                  >
                    削除
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
      <MobileMenu />
    </>
  )
}
