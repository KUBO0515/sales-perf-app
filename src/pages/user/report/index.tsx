'use client'

import { useEffect, useState } from 'react'
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { db } from '@/firebase'
import { motion } from 'framer-motion'
import MobileMenu from '@/components/MobileMenu'

type Report = {
  id: string // ← FirestoreのドキュメントID
  name: string
  shoptype: string
  memo: string
  visit: number
  createdAt?: Timestamp
  acquiredDate?: Timestamp
}

export default function Page() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getAuth()

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const q = query(
            collection(db, 'testcollection'),
            where('uid', '==', user.uid),
            orderBy('createdAt', 'desc')
          )
          const querySnapshot = await getDocs(q)
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Report[]
          setReports(data)
        } catch (error) {
          console.error('Firestore取得エラー:', error)
        } finally {
          setLoading(false)
        }
      } else {
        console.log('未ログイン')
        setReports([])
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('このデータを削除しますか？')
    if (!confirmDelete) return

    try {
      await deleteDoc(doc(db, 'testcollection', id))
      setReports((prev) => prev.filter((report) => report.id !== id))
      alert('削除しました')
    } catch (error) {
      console.error('削除エラー:', error)
      alert('削除に失敗しました')
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp?.toDate) return ''
    const date = timestamp.toDate()
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white to-gray-100 px-4 pt-12 pb-24">
        <div className="z-10 mx-auto max-w-2xl space-y-6">
          <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
            報告履歴
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
                <p className="text-sm text-gray-500">
                  店舗タイプ: {report.shoptype}
                </p>
                <p className="text-gray-700">訪問回数: {report.visit}回</p>
                <p className="text-gray-700">メモ: {report.memo}</p>
                <p className="text-sm text-gray-500">
                  獲得日: {formatDate(report.acquiredDate)}
                </p>
                <p className="text-sm text-gray-500">
                  報告日時: {formatDate(report.createdAt)}
                </p>
                <div className="pt-2 text-right">
                  <button
                    onClick={() => handleDelete(report.id)}
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
