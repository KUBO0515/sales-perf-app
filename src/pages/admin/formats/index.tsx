import { useContext, useEffect, useState } from 'react'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'

import AdminSidebar from '@components/AdminSidebar'
import { db } from '@/firebase'
import { AppContext } from '@hooks/useApp'
import { ReportFormatData } from '@/types/ReportFormat'
import FormatForm from './FormatForm'

export default function Page() {
  const { appContext } = useContext(AppContext)
  const companyId = appContext.company.id || ''

  const [formats, setFormats] = useState<ReportFormatData[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  const fetchFormats = async () => {
    const snapshot = await getDocs(
      collection(db, 'companies', companyId, 'reportFormats')
    )
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name || '(名称未設定)',
    }))
    setFormats(list)
  }

  const handleDelete = async (id?: string) => {
    if (!id) return
    const confirmDelete = window.confirm(
      'このフォーマットを完全に削除しますか？'
    )
    if (!confirmDelete) return

    const deleteSubCollectionDocs = async (path: string) => {
      const colRef = collection(db, path)
      const snap = await getDocs(colRef)
      for (const d of snap.docs) await deleteDoc(d.ref)
    }

    await deleteSubCollectionDocs(
      `companies/${companyId}/reportFormats/${id}/reportFormatInputs`
    )
    await deleteDoc(doc(db, 'reportFormats', id))
    setFormats((prev) => prev.filter((f) => f.id !== id))
    if (editingId === id) {
      setEditingId(null)
    }
  }

  const onClose = () => {
    setEditingId(null)
    fetchFormats()
  }

  useEffect(() => {
    fetchFormats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <AdminSidebar />
      <div className="ml-[280px] min-h-screen bg-gray-100 p-6">
        <h1 className="mb-6 text-2xl font-bold">日報フォーマット一覧</h1>

        <div className="grid gap-4">
          {formats.map((format) => (
            <div key={format.id}>
              <div className="flex w-full appearance-none items-center justify-between rounded rounded-xl border border-gray-300 bg-white bg-white/90 p-3 p-4 pr-10 shadow-md backdrop-blur-sm">
                <p className="text-lg font-semibold text-gray-600">
                  {format.name}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setEditingId(format?.id ?? null)}
                    className="cursor-pointer text-blue-600 hover:underline"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(format.id)}
                    className="cursor-pointer text-red-600 hover:underline"
                  >
                    削除
                  </button>
                </div>
              </div>

              {editingId === format.id && (
                <FormatForm
                  editingId={format.id}
                  companyId={companyId}
                  onClose={onClose}
                />
              )}
            </div>
          ))}
        </div>

        {formats.length === 0 && (
          <p className="mt-6 text-gray-600">フォーマットがまだありません。</p>
        )}
        <div className="mt-6">
          {editingId !== 'new' && (
            <button
              onClick={() => setEditingId('new')}
              className="cursor-pointer rounded bg-green-500 px-4 py-2 text-white"
            >
              新しいフォーマットを作成
            </button>
          )}

          {editingId === 'new' && (
            <FormatForm companyId={companyId} onClose={onClose} />
          )}
        </div>
      </div>
    </>
  )
}
