// import AdminSidebar from '@components/AdminSidebar'
// import { motion } from 'framer-motion'
// import { Link } from 'react-router-dom'

// export default function Formats() {
//   return (
//     <>
//       <AdminSidebar />
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8, ease: 'easeOut' }}
//         className="ml-[280px] min-h-screen space-y-6 bg-gray-200 p-4"
//       >
//         <div className="gap-10">
//           <Link
//             to="/admin" //フォーマット作成ページに遷移予定
//             className="block rounded-2xl bg-white/90 px-8 py-4 font-semibold text-gray-800 shadow-lg ring-1 ring-indigo-100 backdrop-blur hover:bg-indigo-100"
//           >
//             フォーマット作成
//           </Link>
//           <Link
//             to="/admin" //フォーマット一覧ページに遷移予定
//             className="block rounded-2xl bg-white/90 px-8 py-4 font-semibold text-gray-800 shadow-lg ring-1 ring-indigo-100 backdrop-blur hover:bg-indigo-100"
//           >
//             フォーマット一覧
//           </Link>
//         </div>
//       </motion.div>
//     </>
//   )
// }
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
            className="flex items-center gap-4 rounded-2xl bg-white px-6 py-5 shadow-md transition duration-300 hover:scale-[1.02] hover:shadow-xl hover:ring-2 hover:ring-indigo-300"
          >
            <PlusSquare className="h-8 w-8 text-blue-600" />
            <span className="text-lg font-semibold text-gray-800">
              フォーマット作成
            </span>
          </Link>

          <Link
            to="/admin/formats/formatList" // フォーマット一覧ページへの遷移
            className="flex items-center gap-4 rounded-2xl bg-white px-6 py-5 shadow-md transition duration-300 hover:scale-[1.02] hover:shadow-xl hover:ring-2 hover:ring-indigo-300"
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
