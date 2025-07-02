import { useState } from 'react'
import { motion } from 'framer-motion'

export default function ReportForm() {
  const [form, setForm] = useState({
    type: '日報',
    visits: '',
    memo: '',
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('送信内容:', form)
    alert('報告を送信しました！')
    setForm({ type: '日報', visits: '', memo: '' })
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto mt-[70px] max-w-xl space-y-4 rounded-xl bg-white p-6 shadow-xl"
    >
      <h2 className="text-center text-xl font-semibold text-gray-800">
        報告入力
      </h2>

      {/* 報告タイプ */}
      <div>
        <label className="mb-1 block font-medium text-gray-700">報告種別</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full rounded-lg bg-gray-100 px-4 py-2 focus:ring-2 focus:ring-pink-300 focus:outline-none"
        >
          <option value="量販店">量販店</option>
          <option value="店舗">店舗</option>
          <option value="イベント">イベント</option>
        </select>
      </div>

      {/* 訪問件数 */}
      <div>
        <label className="mb-1 block font-medium text-gray-700">件数</label>
        <input
          type="number"
          name="visits"
          value={form.visits}
          onChange={handleChange}
          required
          className="w-full rounded-lg bg-gray-100 px-4 py-2 focus:ring-2 focus:ring-pink-300 focus:outline-none"
          placeholder="例：2"
        />
      </div>

      {/* メモ */}
      <div>
        <label className="mb-1 block font-medium text-gray-700">一言メモ</label>
        <textarea
          name="memo"
          value={form.memo}
          onChange={handleChange}
          rows={3}
          className="w-full resize-none rounded-lg bg-gray-100 px-4 py-2 focus:ring-2 focus:ring-pink-300 focus:outline-none"
          placeholder="例：○○様が再検討中、来店予約○○日予定"
        />
      </div>

      {/* 送信ボタン */}
      <div className="pt-2 text-center">
        <button
          type="submit"
          className="rounded-full bg-sky-500 px-6 py-2 font-semibold text-white shadow-md transition hover:bg-sky-400"
        >
          送信する
        </button>
      </div>
    </motion.form>
  )
}
