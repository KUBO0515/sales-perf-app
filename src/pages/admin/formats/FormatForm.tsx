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
  reportFormatInputConverter,
  ReportFormatInputData,
  isReportFormatType,
} from '@/types/ReportFormatInput'
import { reportFormatConverter } from '@/types/ReportFormat'

const createBlankInput = (): ReportFormatInputData => ({
  id: '',
  name: '',
  type: 'text',
  order: 0,
  options: [],
  disabled: false,
  default: '',
})

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
    createBlankInput(),
  ])

  const handleInputNameChange = (index: number, value: string) => {
    const updated = [...inputs]
    updated[index].name = value
    setInputs(updated)
  }

  const handleInputTypeChange = (index: number, value: string) => {
    if (!isReportFormatType(value)) return
    const updated = [...inputs]
    updated[index].type = value
    if (value !== 'select') {
      updated[index].options = []
    }
    setInputs(updated)
  }

  const handleOptionChange = (
    inputIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updated = [...inputs]
    updated[inputIndex].options[optionIndex] = value
    setInputs(updated)
  }

  const addOption = (inputIndex: number) => {
    const updated = [...inputs]
    updated[inputIndex].options.push('')
    setInputs(updated)
  }

  const removeOption = (inputIndex: number, optionIndex: number) => {
    const updated = [...inputs]
    updated[inputIndex].options.splice(optionIndex, 1)
    setInputs(updated)
  }

  const addField = () => {
    setInputs([...inputs, createBlankInput()])
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
      let formatId = editingId || ''

      if (editingId) {
        await updateDoc(
          doc(
            db,
            `companies/${companyId}/reportFormats/${editingId}`
          ).withConverter(reportFormatConverter),
          { name: formatName }
        )
      } else {
        const formatRef = await addDoc(
          collection(db, `companies/${companyId}/reportFormats`),
          { name: formatName }
        )
        formatId = formatRef.id
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
        if (!input.name.trim()) continue

        const inputData: any = {
          name: input.name,
          type: input.type,
          order: i + 1,
          disabled: input.disabled ?? false,
          default: input.default ?? '',
        }

        if (input.type === 'select' && Array.isArray(input.options)) {
          inputData.options = input.options
        }

        if (input.id) {
          await updateDoc(doc(inputsRef, input.id), inputData)
        } else {
          await addDoc(inputsRef, inputData)
        }
      }

      alert('フォーマットを保存しました')
      setFormatName('')
      setInputs([createBlankInput()])
      onClose()
    } catch (error) {
      console.error('保存エラー:', error)
      alert('保存に失敗しました')
    }
  }

  useEffect(() => {
    if (!editingId) {
      setFormatName('')
      setInputs([createBlankInput()])
      return
    }

    const fetchFormat = async () => {
      const formatDoc = await getDoc(
        doc(db, 'companies', companyId, 'reportFormats', editingId)
      )
      if (!formatDoc.exists()) {
        alert('フォーマットが存在しません')
        onClose()
        return
      }

      const formatData = formatDoc.data()
      setFormatName(formatData.name || '')

      const inputSnap = await getDocs(
        collection(
          db,
          'companies',
          companyId,
          'reportFormats',
          editingId,
          'reportFormatInputs'
        ).withConverter(reportFormatInputConverter)
      )

      const fetchedInputs = inputSnap.docs.map((doc) => doc.data())
      setInputs(fetchedInputs.length > 0 ? fetchedInputs : [createBlankInput()])
    }

    fetchFormat().catch((err) => {
      console.error('フォーマット取得エラー:', err)
      alert('フォーマットの取得に失敗しました')
      onClose()
    })
  }, [editingId, companyId, onClose])

  return (
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
          className="mt-2 w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:ring focus:ring-sky-200"
        />
      </label>

      <div className="space-y-4">
        {inputs.map((input, index) => (
          <div key={index} className="space-y-3 rounded-xl bg-white p-4 shadow">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <input
                type="text"
                placeholder="項目名（例: 感想）"
                value={input.name}
                onChange={(e) => handleInputNameChange(index, e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 p-3 shadow-sm"
              />
              <select
                value={input.type}
                onChange={(e) => handleInputTypeChange(index, e.target.value)}
                className="w-40 rounded-lg border border-gray-300 p-3 shadow-sm"
              >
                <option value="text">テキスト</option>
                <option value="number">数値</option>
                <option value="select">選択</option>
              </select>
              <button
                type="button"
                onClick={() => removeField(index)}
                className="text-sm text-red-500 hover:underline"
              >
                削除
              </button>
            </div>

            {input.type === 'select' && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600">選択肢</p>
                {input.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) =>
                        handleOptionChange(index, i, e.target.value)
                      }
                      className="flex-1 rounded-lg border border-gray-300 p-2 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(index, i)}
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
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          + 項目を追加
        </button>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={handleSubmit}
          className="w-1/2 rounded-xl bg-blue-600 py-3 text-lg font-bold text-white hover:bg-blue-500"
        >
          フォーマットを保存
        </button>
        <button
          onClick={onClose}
          className="w-1/2 rounded-xl py-3 text-lg font-bold text-gray-600 hover:bg-gray-100"
        >
          キャンセル
        </button>
      </div>
    </div>
  )
}
