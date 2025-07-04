import MobileMenu from '@components/MobileMenu'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function DailyFormats() {
  const reports = [
    { title: 'フォーマット報告1', path: '/user/dailyReport' },
    { title: 'フォーマット報告2', path: '/user/dailyReport' },
  ]

  return (
    <>
      <div className="relative flex min-h-screen flex-col items-center space-y-14 overflow-hidden bg-gradient-to-b from-white via-sky-50 to-indigo-50 px-4 pt-12 pb-24">
        {/* レポートボタン */}
        <div className="z-10 flex flex-col items-center space-y-6 text-center">
          <h1 className="text-3xl font-extrabold text-gray-800">
            フォーマットを選択してください
          </h1>
          {reports.map((r, i) => (
            <motion.div
              key={r.path}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
            >
              <Link
                to={r.path}
                className="block rounded-2xl bg-white/90 px-8 py-4 font-semibold text-gray-800 shadow-lg ring-1 ring-indigo-100 backdrop-blur hover:bg-indigo-100"
              >
                {r.title}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <MobileMenu />
    </>
  )
}
