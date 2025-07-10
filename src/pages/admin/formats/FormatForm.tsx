// TODO: 入力項目のorderを使った並び替え機能実装
// TODO: バリデーション処理

import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore'

import { db } from '@/firebase'

import {
  blankReportFormatInputData,
  isReportFormatType,
  reportFormatInputConverter,
  ReportFormatInputData,
} from '@/types/ReportFormatInput'
import { reportFormatConverter } from '@/types/ReportFormat'

export default function FormatForm({
  editingId,
  companyId,
  onClose,
}: {
  editingId?: string
  companyId: string
  onClose: () => void
}) {
  const [formatName, setFormatName] = useState('')
  const [inputs, setInputs] = useState<ReportFormatInputData[]>([
    blankReportFormatInputData,
  ])

  const handleInputNameChange = (index: number, value: string) => {
    const newInputs = [...inputs]
    newInputs[index]['name'] = value
    newInputs[index].options = [] // select以外ならoptionsはクリア
    setInputs(newInputs)
  }

  const handleInputTypeChange = (index: number, value: unknown) => {
    // value が ReportFormatTypes のいずれかであることを確認
    if (!isReportFormatType(value)) {
      return
    }

    const newInputs = [...inputs]
    newInputs[index]['type'] = value
    if (value !== 'select') {
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
    setInputs([...inputs, blankReportFormatInputData])
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
      let formatId = editingId || ''

      if (editingId) {
        // フォーマット名を更新
        await updateDoc(
          doc(
            db,
            `companies${companyId}/reportFormats${editingId}`
          ).withConverter(reportFormatConverter),
          { name: formatName }
        )
      } else {
        // 新規作成の場合は新しいドキュメントを追加
        formatId = (
          await addDoc(collection(db, `companies/${companyId}/reportFormats`), {
            name: formatName,
          })
        ).id
      }

      const inputsRef = collection(
        db,
        'companies',
        companyId,
        'reportFormats',
        formatId,
        'reportFormatInputs'
      )

      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i]
        if (input.name.trim()) {
          // 入力項目のドキュメントが存在すれば更新、そうでなければ新規作成
          if (input.id) {
            // 既存の入力項目を更新
            await updateDoc(doc(inputsRef, input.id), {
              name: input.name,
              type: input.type,
              order: i + 1,
              ...(input.type === 'select' && input.options.length > 0
                ? { options: input.options }
                : {}),
            })
          } else {
            // 新規入力項目を追加
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
      }

      alert('フォーマットを保存しました')
      setFormatName('')
      setInputs([blankReportFormatInputData])
      onClose() // フォーマット保存後にモーダルを閉じる
    } catch (error) {
      console.error('保存エラー:', error)
      alert('保存に失敗しました')
    }
  }

  useEffect(() => {
    if (editingId) {
      // 編集モードの場合、既存のフォーマット情報を取得してセットする
      const fetchFormat = async () => {
        const formatDoc = await getDoc(
          doc(db, 'companies', companyId, 'reportFormats', editingId)
        )
        if (formatDoc.exists()) {
          const formatData = formatDoc.data()
          setFormatName(formatData.name || '')
          const inputsSnap = await getDocs(
            collection(
              db,
              'companies',
              companyId,
              'reportFormats',
              editingId,
              'reportFormatInputs'
            ).withConverter(reportFormatInputConverter)
          )

          setInputs(inputsSnap.docs.map((doc) => doc.data()))
        } else {
          console.error('指定されたフォーマットが見つかりません:', editingId)
          alert('指定されたフォーマットが見つかりません')
          onClose() // フォーマットが見つからない場合はモーダルを閉じる
        }
      }
      fetchFormat().catch((error) => {
        console.error('フォーマット取得エラー:', error)
        alert('フォーマットの取得に失敗しました')
        onClose() // エラー時もモーダルを閉じる
      })
    } else {
      // 新規作成モードの場合、初期状態をセット
      setFormatName('')
      setInputs([blankReportFormatInputData])
    }
  }, [editingId, companyId, onClose])

  return (
    <>
      <div className="mx-auto space-y-8 rounded-2xl bg-white/90 p-8 shadow-md backdrop-blur">
        <h1 className="text-2xl font-bold text-gray-800">
          日報フォーマット {editingId ? '編集' : '新規作成'}
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
                  onChange={(e) => handleInputNameChange(index, e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 p-3 shadow-sm focus:ring-1 focus:ring-gray-300 focus:outline-none"
                />
                <select
                  value={input.type}
                  onChange={(e) => handleInputTypeChange(index, e.target.value)}
                  className="w-40 rounded-lg border border-gray-300 p-3 shadow-sm focus:ring-1 focus:ring-gray-300 focus:outline-none"
                >
                  <option value="string">テキスト</option>
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
                  <p className="text-sm font-semibold text-gray-600">選択肢</p>
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
                    input.options[input.options.length - 1].trim() !== '') && (
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

        <div className="mt-6 flex gap-4">
          <button
            onClick={handleSubmit}
            className="max-w-1/2 rounded-xl bg-blue-600 py-3 text-lg font-bold text-white shadow-md transition hover:bg-blue-500"
          >
            フォーマットを保存
          </button>
          <button
            onClick={onClose}
            className="max-w-1/2 rounded-xl py-3 text-lg font-bold text-gray-600 shadow-md transition hover:bg-gray-50"
          >
            キャンセル
          </button>
        </div>
      </div>
    </>
  )
}
