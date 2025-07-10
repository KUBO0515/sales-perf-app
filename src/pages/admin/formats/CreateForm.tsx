// TODO: 入力項目のorderを使った並び替え機能実装
// TODO: バリデーション処理

import AdminSidebar from '@components/AdminSidebar'
import React, { useContext, useState } from 'react'
import { db } from '@/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { AppContext } from '@hooks/useApp'

export default function CreateForm() {
  const { appContext } = useContext(AppContext)
  const companyId = appContext.company.id || ''

  const [formatName, setFormatName] = useState('')
  const [inputs, setInputs] = useState([
    { name: '', type: 'text', options: [] as string[] },
  ])

  const handleInputChange = (
    index: number,
    field: 'name' | 'type',
    value: string
  ) => {
    const newInputs = [...inputs]
    newInputs[index][field] = value
    if (field === 'type' && value !== 'select') {
      newInputs[index].options = [] // select以外ならoptionsはクリア
    }
    setInputs(newInputs)
  }

  const handleOptionChange = (
    inputIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const newInputs = [...inputs]
    newInputs[inputIndex].options[optionIndex] = value
    setInputs(newInputs)
  }

  const addOption = (inputIndex: number) => {
    const newInputs = [...inputs]
    newInputs[inputIndex].options.push('')
    setInputs(newInputs)
  }

  const removeOption = (inputIndex: number, optionIndex: number) => {
    const newInputs = [...inputs]
    newInputs[inputIndex].options.splice(optionIndex, 1)
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
    if (!companyId) {
      alert('所属企業の情報が取得できていません')
      return
    }

    try {
      const formatRef = await addDoc(
        collection(db, 'companies', companyId, 'reportFormats'),
        { name: formatName }
      )

      const inputsRef = collection(
        db,
        'companies',
        companyId,
        'reportFormats',
        formatRef.id,
        'reportFormatInputs'
      )

      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i]
        if (input.name.trim()) {
          await addDoc(inputsRef, {
            name: input.name,
            type: input.type,
            order: i + 1,
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
      <div className="ml-[280px] min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-4xl space-y-8 rounded-2xl bg-white/90 p-8 shadow-md backdrop-blur">
          <h1 className="text-2xl font-bold text-gray-800">
            日報フォーマット作成
          </h1>

          <label className="block font-semibold text-gray-700">
            フォーマット名
            <input
              type="text"
              value={formatName}
              onChange={(e) => setFormatName(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:ring-1 focus:ring-gray-300 focus:outline-none"
              placeholder="例: 営業日報"
            />
          </label>

          <div className="space-y-4">
            {inputs.map((input, index) => (
              <div
                key={index}
                className="space-y-3 rounded-xl bg-white p-4 shadow"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <input
                    type="text"
                    placeholder="項目名（例: 感想）"
                    value={input.name}
                    onChange={(e) =>
                      handleInputChange(index, 'name', e.target.value)
                    }
                    className="flex-1 rounded-lg border border-gray-300 p-3 shadow-sm focus:ring-1 focus:ring-gray-300 focus:outline-none"
                  />
                  <select
                    value={input.type}
                    onChange={(e) =>
                      handleInputChange(index, 'type', e.target.value)
                    }
                    className="w-40 rounded-lg border border-gray-300 p-3 shadow-sm focus:ring-1 focus:ring-gray-300 focus:outline-none"
                  >
                    <option value="text">テキスト</option>
                    <option value="number">数値</option>
                    <option value="select">選択</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeField(index)}
                    className="text-sm font-semibold text-red-500 hover:underline"
                  >
                    削除
                  </button>
                </div>

                {input.type === 'select' && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-600">
                      選択肢
                    </p>
                    {input.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) =>
                            handleOptionChange(index, optIdx, e.target.value)
                          }
                          className="flex-1 rounded-lg border border-gray-300 p-2 shadow-sm"
                          placeholder={`選択肢${optIdx + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(index, optIdx)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          削除
                        </button>
                      </div>
                    ))}

                    {(input.options.length === 0 ||
                      input.options[input.options.length - 1].trim() !==
                        '') && (
                      <button
                        type="button"
                        onClick={() => addOption(index)}
                        className="text-sm font-semibold text-blue-600 hover:underline"
                      >
                        + 選択肢を追加
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addField}
              className="cursor-pointer text-sm font-semibold text-blue-600 hover:underline"
            >
              + 項目を追加
            </button>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-4 w-full rounded-xl py-3 text-lg font-bold text-gray-600 shadow-md transition hover:bg-gray-50"
          >
            フォーマットを保存
          </button>
        </div>
      </div>
    </>
  )
}
