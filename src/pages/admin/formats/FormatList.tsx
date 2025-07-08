'use client'

import AdminSidebar from '@components/AdminSidebar'
import { useEffect, useState } from 'react'
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
} from 'firebase/firestore'
import { db } from '@/firebase'

type ReportFormat = {
  id: string
  name: string
}

type InputItem = {
  id: string
  name: string
  type: string
  options?: string[]
}

export default function ReportFormatList() {
  const [formats, setFormats] = useState<ReportFormat[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [inputItems, setInputItems] = useState<InputItem[]>([])
  const [formatName, setFormatName] = useState('')

  const fetchFormats = async () => {
    const snapshot = await getDocs(collection(db, 'reportFormats'))
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name || '(名称未設定)',
    }))
    setFormats(list)
  }

  const fetchInputs = async (formatId: string) => {
    const inputSnap = await getDocs(
      collection(db, `reportFormats/${formatId}/reportFormatInputs`)
    )
    const inputs = inputSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as InputItem[]
    setInputItems(inputs)
  }

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      'このフォーマットを完全に削除しますか？'
    )
    if (!confirmDelete) return

    const deleteSubcollectionDocs = async (path: string) => {
      const colRef = collection(db, path)
      const snap = await getDocs(colRef)
      for (const d of snap.docs) await deleteDoc(d.ref)
    }

    const daysSnap = await getDocs(collection(db, `reportFormats/${id}/days`))
    for (const dayDoc of daysSnap.docs) {
      await deleteSubcollectionDocs(
        `reportFormats/${id}/days/${dayDoc.id}/dailyReports`
      )
      await deleteDoc(dayDoc.ref)
    }

    await deleteSubcollectionDocs(`reportFormats/${id}/reportFormatInputs`)
    await deleteDoc(doc(db, 'reportFormats', id))
    setFormats((prev) => prev.filter((f) => f.id !== id))
    if (editingId === id) {
      setEditingId(null)
      setInputItems([])
    }
  }

  const startEdit = async (format: ReportFormat) => {
    setEditingId(format.id)
    setFormatName(format.name)
    await fetchInputs(format.id)
  }

  const handleInputChange = (
    index: number,
    field: 'name' | 'type' | 'options',
    value: string
  ) => {
    const newInputs = [...inputItems]
    if (field === 'options') {
      newInputs[index].options = value.split(',').map((v) => v.trim())
    } else {
      newInputs[index][field] = value
      if (field === 'type' && value !== 'select') {
        newInputs[index].options = []
      }
    }
    setInputItems(newInputs)
  }

  const saveInputs = async () => {
    if (!editingId) return

    await updateDoc(doc(db, 'reportFormats', editingId), { name: formatName })

    const inputRef = collection(
      db,
      `reportFormats/${editingId}/reportFormatInputs`
    )

    for (const input of inputItems) {
      const inputDoc = doc(inputRef, input.id)
      const data = {
        name: input.name,
        type: input.type,
        ...(input.type === 'select' && input.options
          ? { options: input.options }
          : {}),
      }
      await setDoc(inputDoc, data)
    }

    alert('保存しました')
    setEditingId(null)
    setInputItems([])
    fetchFormats()
  }

  const addField = () => {
    setInputItems([
      ...inputItems,
      { id: crypto.randomUUID(), name: '', type: 'text', options: [] },
    ])
  }

  const removeField = (index: number) => {
    setInputItems(inputItems.filter((_, i) => i !== index))
  }

  useEffect(() => {
    fetchFormats()
  }, [])

  return (
    <>
      <AdminSidebar />
      <div className="ml-[280px] min-h-screen bg-gray-100 p-6">
        <h1 className="mb-6 text-2xl font-bold">日報フォーマット一覧</h1>

        <div className="grid gap-4">
          {formats.map((format) => (
            <div key={format.id}>
              <div className="flex items-center justify-between rounded border bg-white p-4 shadow">
                <p className="text-lg font-semibold">{format.name}</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => startEdit(format)}
                    className="text-blue-600 hover:underline"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(format.id)}
                    className="text-red-600 hover:underline"
                  >
                    削除
                  </button>
                </div>
              </div>

              {editingId === format.id && (
                <div className="mt-4 space-y-4 rounded bg-white p-6 shadow">
                  <h2 className="text-xl font-bold">フォーマット編集</h2>

                  <input
                    type="text"
                    className="w-full rounded border p-2"
                    value={formatName}
                    onChange={(e) => setFormatName(e.target.value)}
                    placeholder="フォーマット名"
                  />

                  {inputItems.map((input, index) => (
                    <div
                      key={input.id}
                      className="space-y-2 rounded border bg-gray-50 p-3"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={input.name}
                          onChange={(e) =>
                            handleInputChange(index, 'name', e.target.value)
                          }
                          placeholder="項目名"
                          className="flex-1 rounded border p-2"
                        />
                        <select
                          value={input.type}
                          onChange={(e) =>
                            handleInputChange(index, 'type', e.target.value)
                          }
                          className="rounded border p-2"
                        >
                          <option value="text">テキスト</option>
                          <option value="number">数値</option>
                          <option value="select">選択</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => removeField(index)}
                          className="text-red-500"
                        >
                          削除
                        </button>
                      </div>
                      {input.type === 'select' && (
                        <input
                          type="text"
                          value={input.options?.join(',') || ''}
                          onChange={(e) =>
                            handleInputChange(index, 'options', e.target.value)
                          }
                          placeholder="選択肢（カンマ区切り）"
                          className="w-full rounded border p-2"
                        />
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addField}
                    className="font-semibold text-blue-600"
                  >
                    + 項目を追加
                  </button>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={saveInputs}
                      className="rounded bg-blue-500 px-4 py-2 text-white"
                    >
                      保存する
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null)
                        setInputItems([])
                      }}
                      className="text-gray-500 hover:underline"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {formats.length === 0 && (
          <p className="mt-6 text-gray-600">フォーマットがまだありません。</p>
        )}
      </div>
    </>
  )
}
