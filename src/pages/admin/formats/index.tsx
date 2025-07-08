import AdminSidebar from '@components/AdminSidebar'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { PlusSquare, List } from 'lucide-react'

export default function Formats() {
  return (
    <>
      <AdminSidebar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="ml-[280px] min-h-screen bg-gray-100 p-8"
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          <Link
            to="/admin/formats/createForm" // フォーマット作成ページへの遷移
            className="flex items-center gap-4 rounded-2xl bg-white px-6 py-5 shadow-md transition duration-300 hover:scale-[1.02] hover:shadow-xl"
          >
            <PlusSquare className="h-8 w-8 text-blue-600" />
            <span className="text-lg font-semibold text-gray-800">
              フォーマット作成
            </span>
          </Link>

          <Link
            to="/admin/formats/formatList" // フォーマット一覧ページへの遷移
            className="flex items-center gap-4 rounded-2xl bg-white px-6 py-5 shadow-md transition duration-300 hover:scale-[1.02] hover:shadow-xl"
          >
            <List className="h-8 w-8 text-blue-600" />
            <span className="text-lg font-semibold text-gray-800">
              フォーマット一覧
            </span>
          </Link>
        </div>
      </motion.div>
    </>
  )
}
