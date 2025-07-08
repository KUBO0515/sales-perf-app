// 'use client'

// import { useEffect, useState } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore'
// import { db } from '@/firebase'

// import PageHeader from '@components/PageHeader'
// import MobileMenu from '@components/MobileMenu'

// type InputItem = {
//   id: string
//   name: string
//   type: 'text' | 'number' | 'select'
//   options?: string[] // selectタイプのときのみ
// }

// export default function DailyReport() {
//   const { formatId } = useParams<{ formatId: string }>()
//   const navigate = useNavigate()

//   const [inputItems, setInputItems] = useState<InputItem[]>([])
//   const [formData, setFormData] = useState<Record<string, string>>({})

//   useEffect(() => {
//     if (!formatId) return

//     const fetchInputs = async () => {
//       const inputSnap = await getDocs(
//         collection(db, `reportFormats/${formatId}/reportFormatInputs`)
//       )

//       const inputs: InputItem[] = inputSnap.docs.map((doc) => {
//         const data = doc.data()
//         return {
//           id: doc.id,
//           name: data.name,
//           type: data.type,
//           options: data.options || [], // select以外は空配列
//         }
//       })

//       setInputItems(inputs)

//       const initialData: Record<string, string> = {}
//       inputs.forEach((item) => {
//         initialData[item.id] = ''
//       })
//       setFormData(initialData)
//     }

//     fetchInputs()
//   }, [formatId])

//   const handleChange = (id: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [id]: value }))
//   }

//   const handleSubmit = async () => {
//     if (!formatId) return

//     const today = new Date()
//     const dateKey = today.toISOString().slice(0, 10).replace(/-/g, '') // "20250709"

//     const docRef = collection(
//       db,
//       `reportFormats/${formatId}/days/${dateKey}/dailyReports`
//     )

//     await addDoc(docRef, {
//       inputs: formData,
//       createdAt: Timestamp.now(),
//     })

//     alert('送信が完了しました')
//     navigate('/user/dailyFormats')
//   }

//   return (
//     <>
//       <PageHeader title="日報入力" />
//       <div className="mt-[70px] min-h-screen bg-white px-4 pt-6 pb-24">
//         <form className="space-y-6">
//           {inputItems.map((item) => (
//             <div key={item.id} className="space-y-1">
//               <label className="block font-medium text-gray-700">
//                 {item.name}
//               </label>

//               {item.type === 'text' && (
//                 <textarea
//                   className="w-full rounded border p-2"
//                   value={formData[item.id]}
//                   onChange={(e) => handleChange(item.id, e.target.value)}
//                   rows={3}
//                 />
//               )}

//               {item.type === 'number' && (
//                 <input
//                   type="number"
//                   className="w-full rounded border p-2"
//                   value={formData[item.id]}
//                   onChange={(e) => handleChange(item.id, e.target.value)}
//                 />
//               )}

//               {item.type === 'select' && (
//                 <select
//                   className="w-full rounded border p-2"
//                   value={formData[item.id]}
//                   onChange={(e) => handleChange(item.id, e.target.value)}
//                 >
//                   <option value="">選択してください</option>
//                   {item.options?.map((opt, i) => (
//                     <option key={i} value={opt}>
//                       {opt}
//                     </option>
//                   ))}
//                 </select>
//               )}
//             </div>
//           ))}

//           <button
//             type="button"
//             className="w-full rounded bg-blue-600 py-3 font-semibold text-white shadow"
//             onClick={handleSubmit}
//           >
//             日報を送信する
//           </button>
//         </form>
//       </div>

//       <MobileMenu />
//     </>
//   )
// }

'use client'

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/firebase'

import PageHeader from '@components/PageHeader'
import MobileMenu from '@components/MobileMenu'

type InputItem = {
  id: string
  name: string
  type: 'text' | 'number' | 'select'
  options?: string[]
}

export default function DailyReport() {
  const { formatId } = useParams<{ formatId: string }>()
  const navigate = useNavigate()

  const [inputItems, setInputItems] = useState<InputItem[]>([])
  const [formData, setFormData] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!formatId) return

    const fetchInputs = async () => {
      const inputSnap = await getDocs(
        collection(db, `reportFormats/${formatId}/reportFormatInputs`)
      )

      const inputs: InputItem[] = inputSnap.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          name: data.name,
          type: data.type,
          options: data.options || [],
        }
      })

      setInputItems(inputs)

      const initialData: Record<string, string> = {}
      inputs.forEach((item) => {
        initialData[item.id] = ''
      })
      setFormData(initialData)
    }

    fetchInputs()
  }, [formatId])

  const handleChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async () => {
    if (!formatId) return

    const today = new Date()
    const dateKey = today.toISOString().slice(0, 10).replace(/-/g, '')

    const docRef = collection(
      db,
      `reportFormats/${formatId}/days/${dateKey}/dailyReports`
    )

    await addDoc(docRef, {
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
        <form className="mx-auto max-w-3xl">
          {inputItems.map((item) => (
            <div
              key={item.id}
              className="space-y-2 rounded-xl bg-white/80 p-4 backdrop-blur"
            >
              <label className="block text-base font-semibold">
                {item.name}
              </label>

              {item.type === 'text' && (
                <textarea
                  className="w-full appearance-none rounded-xl border border-gray-300 bg-white/90 p-3 pr-10 shadow-md backdrop-blur-sm focus:border-sky-100 focus:ring-2 focus:ring-sky-100 focus:outline-none"
                  value={formData[item.id]}
                  onChange={(e) => handleChange(item.id, e.target.value)}
                  rows={3}
                />
              )}

              {item.type === 'number' && (
                <input
                  type="number"
                  className="w-full appearance-none rounded-xl border border-gray-300 bg-white/90 p-3 pr-10 shadow-md backdrop-blur-sm focus:border-sky-100 focus:ring-2 focus:ring-sky-100 focus:outline-none"
                  value={formData[item.id]}
                  onChange={(e) => handleChange(item.id, e.target.value)}
                />
              )}

              {item.type === 'select' && (
                <select
                  className="w-full appearance-none rounded-xl border border-gray-300 bg-white/90 p-3 pr-10 shadow-md backdrop-blur-sm focus:border-sky-100 focus:ring-2 focus:ring-sky-100 focus:outline-none"
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
            className="mt-20 w-full cursor-pointer rounded-xl py-3 text-lg font-bold shadow-md backdrop-blur-md transition hover:bg-sky-100"
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
