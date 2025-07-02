import { useState } from "react";
import { motion } from "framer-motion";

export default function ReportForm() {
  const [form, setForm] = useState({
    type: "日報",
    visits: "",
    memo: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("送信内容:", form);
    alert("報告を送信しました！");
    setForm({ type: "日報", visits: "", memo: "" });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-xl rounded-xl p-6 space-y-4 max-w-xl mx-auto mt-[70px]"
    >
      <h2 className="text-xl font-semibold text-gray-800 text-center">
        報告入力
      </h2>

      {/* 報告タイプ */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">報告種別</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full rounded-lg bg-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
        >
          <option value="量販店">量販店</option>
          <option value="店舗">店舗</option>
          <option value="イベント">イベント</option>
        </select>
      </div>

      {/* 訪問件数 */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">件数</label>
        <input
          type="number"
          name="visits"
          value={form.visits}
          onChange={handleChange}
          required
          className="w-full rounded-lg bg-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
          placeholder="例：2"
        />
      </div>

      {/* メモ */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">一言メモ</label>
        <textarea
          name="memo"
          value={form.memo}
          onChange={handleChange}
          rows={3}
          className="w-full rounded-lg bg-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
          placeholder="例：○○様が再検討中、来店予約○○日予定"
        />
      </div>

      {/* 送信ボタン */}
      <div className="text-center pt-2">
        <button
          type="submit"
          className="bg-sky-500 hover:bg-sky-400 text-white font-semibold px-6 py-2 rounded-full shadow-md transition"
        >
          送信する
        </button>
      </div>
    </motion.form>
  );
}
