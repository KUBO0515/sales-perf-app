'use client'

import { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/firebase'
import PageHeader from '@components/PageHeader'
import MobileMenu from '@components/MobileMenu'
import { AppContext } from '@hooks/useApp'
import { ReportFormatTypes } from '@/types/ReportFormatInput'
import { reportConverter } from '@/types/Report'

type InputItem = {
  id: string
  name: string
  type: ReportFormatTypes
  options?: string[]
  disabled?: boolean
  default?: string
}

export default function DailyReport() {
  const { appContext } = useContext(AppContext)
  const companyId = appContext.company.id
  const userId = appContext.user.id || ''

  const { formatId } = useParams<{ formatId: string }>()
  const navigate = useNavigate()

  const [inputItems, setInputItems] = useState<InputItem[]>([])
  const [formData, setFormData] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!companyId || !formatId) return

    const fetchInputs = async () => {
      const inputSnap = await getDocs(
        collection(
          db,
          `companies/${companyId}/reportFormats/${formatId}/reportFormatInputs`
        )
      )

      const inputs: InputItem[] = inputSnap.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          name: data.name,
          type: data.type,
          options: data.options || [],
          disabled: data.disabled || false,
          default: data.default || '',
        }
      })

      setInputItems(inputs)

      const initialData: Record<string, string> = {}
      inputs.forEach((item) => {
        initialData[item.id] = item.default || ''
      })
      setFormData(initialData)
    }

    fetchInputs()
  }, [companyId, formatId])

  const handleChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async () => {
    if (!companyId || !formatId) return

    const reportsRef = collection(
      db,
      `companies/${companyId}/reports/`
    ).withConverter(reportConverter)

    await addDoc(reportsRef, {
      userId: userId,
      reportFormatId: formatId,
      inputs: formData,
      createdAt: Timestamp.now(),
    })

    alert('送信が完了しました')
    navigate('/user/dailyFormats')
  }

  return (
    <>
      <PageHeader title="日報入力" />

      <div className="mt-[70px] min-h-screen px-4 pt-6 pb-32">
        <form className="mx-auto max-w-3xl space-y-6">
          {inputItems
            .filter((item) => !item.disabled)
            .map((item) => (
              <div
                key={item.id}
                className="space-y-2 rounded-xl bg-white/80 p-4 backdrop-blur"
              >
                <label className="block text-base font-semibold">
                  {item.name}
                </label>

                {item.type === 'string' && (
                  <textarea
                    className="w-full rounded-xl border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-sky-100 focus:outline-none"
                    value={formData[item.id]}
                    onChange={(e) => handleChange(item.id, e.target.value)}
                    rows={3}
                  />
                )}

                {item.type === 'number' && (
                  <input
                    type="number"
                    className="w-full rounded-xl border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-sky-100 focus:outline-none"
                    value={formData[item.id]}
                    onChange={(e) => handleChange(item.id, e.target.value)}
                  />
                )}

                {item.type === 'select' && (
                  <select
                    className="w-full rounded-xl border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-sky-100 focus:outline-none"
                    value={formData[item.id]}
                    onChange={(e) => handleChange(item.id, e.target.value)}
                  >
                    <option value="">選択してください</option>
                    {item.options?.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}

          <button
            type="button"
            className="mt-10 w-full rounded-xl py-3 text-lg font-bold shadow-md transition hover:bg-sky-100"
            onClick={handleSubmit}
          >
            日報を送信する
          </button>
        </form>
      </div>

      <MobileMenu />
    </>
  )
}
