'use client'

import AdminSidebar from '@components/AdminSidebar'
import React, { useState } from 'react'
import { db } from '@/firebase'
import { collection, addDoc } from 'firebase/firestore'

export default function CreateForm() {
  const [formatName, setFormatName] = useState('')
  const [inputs, setInputs] = useState([
    { name: '', type: 'text', options: [] as string[] },
  ])

  const handleInputChange = (
    index: number,
    field: 'name' | 'type' | 'options',
    value: string
  ) => {
    const newInputs = [...inputs]
    if (field === 'options') {
      newInputs[index].options = value.split(',').map((v) => v.trim())
    } else {
      newInputs[index][field] = value
      if (field === 'type' && value !== 'select') {
        newInputs[index].options = [] // type変更時に選択肢を初期化
      }
    }
    setInputs(newInputs)
  }

  const addField = () => {
    setInputs([...inputs, { name: '', type: 'text', options: [] }])
  }

  const removeField = (index: number) => {
    setInputs(inputs.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!formatName.trim()) {
      alert('フォーマット名を入力してください')
      return
    }

    try {
      const formatRef = await addDoc(collection(db, 'reportFormats'), {
        name: formatName,
      })

      const inputsRef = collection(
        db,
        'reportFormats',
        formatRef.id,
        'reportFormatInputs'
      )

      for (const input of inputs) {
        if (input.name.trim()) {
          await addDoc(inputsRef, {
            name: input.name,
            type: input.type,
            ...(input.type === 'select' && input.options.length > 0
              ? { options: input.options }
              : {}),
          })
        }
      }

      alert('フォーマットを保存しました')
      setFormatName('')
      setInputs([{ name: '', type: 'text', options: [] }])
    } catch (error) {
      console.error('保存エラー:', error)
      alert('保存に失敗しました')
    }
  }

  return (
    <>
      <AdminSidebar />
      <div className="ml-[280px] min-h-screen space-y-6 bg-gray-200 p-6">
        <h1 className="text-2xl font-bold">日報フォーマット作成</h1>

        <div className="max-w-2xl space-y-4 rounded bg-white p-6 shadow">
          <label className="block font-semibold">
            フォーマット名
            <input
              type="text"
              value={formatName}
              onChange={(e) => setFormatName(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 p-2"
              placeholder="例: 営業日報"
            />
          </label>

          <div className="space-y-4">
            {inputs.map((input, index) => (
              <div
                key={index}
                className="space-y-2 rounded border bg-gray-50 p-4"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="項目名（例: 感想）"
                    value={input.name}
                    onChange={(e) =>
                      handleInputChange(index, 'name', e.target.value)
                    }
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
                    placeholder="選択肢（カンマ区切りで入力）例：東京,大阪,福岡"
                    value={input.options?.join(',') || ''}
                    onChange={(e) =>
                      handleInputChange(index, 'options', e.target.value)
                    }
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
          </div>

          <button
            onClick={handleSubmit}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            フォーマットを保存
          </button>
        </div>
      </div>
    </>
  )
}
