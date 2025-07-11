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
  collection,
  limit,
} from 'firebase/firestore'
import { motion } from 'framer-motion'

import MobileMenu from '@/components/MobileMenu'
import { db } from '@/firebase'
import { AppContext } from '@hooks/useApp'
import { Report, reportConverter } from '@/types/Report'

export default function ReportHistory() {
  const { appContext } = useContext(AppContext)
  const companyId = appContext.company.id
  const userId = appContext.user.id

  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  // TODO: ReportFormat, ReportFormatInput の型定義を使い、きちんと取得する方式にリファクタリングする
  const [inputNameMap, setInputNameMap] = useState<Record<string, string>>({})
  const [formatNameMap, setFormatNameMap] = useState<Record<string, string>>({})

  const fetchReports = async () => {
    try {
      const q = query(
        collection(db, `companies/${companyId}/reports`).withConverter(
          reportConverter
        ),
        where('userId', '==', userId), // UID でフィルタ
        orderBy('createdAt', 'desc'),
        limit(100) // 最新の100件を取得
      )
      const reportsSnapshot = await getDocs(q)

      const newReports: Report[] = []
      for (const reportDocSnap of reportsSnapshot.docs) {
        newReports.push(reportDocSnap.data())
      }
      setReports(newReports)
    } catch (err) {
      console.error('データ取得エラー:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchInputNames = async () => {
    if (!companyId) return
    const snapshot = await getDocs(collectionGroup(db, 'reportFormatInputs'))
    const map: Record<string, string> = {}
    snapshot.docs.forEach((doc) => {
      map[doc.id] = doc.data().name
    })
    setInputNameMap(map)
  }

  useEffect(() => {
    fetchReports().then(() => {
      fetchInputNames()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      const docPath = `companies/${companyId}/reports/${report.id}`
      await deleteDoc(doc(db, docPath).withConverter(reportConverter))
      await fetchReports()
      alert('削除しました')
    } catch (error) {
      console.error('削除エラー:', error)
      alert('削除に失敗しました')
    }
  }

  const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp?.toDate) return ''
    const date = timestamp.toDate()
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}時${date.getMinutes()}分 ${date.getSeconds()}秒`
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
                  {formatNameMap[report.reportFormatId] ||
                    report.reportFormatId}
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
