import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import MobileMenu from '@/components/MobileMenu'

export default function Page() {
  const reports = [{ title: '日報報告', path: '/user/dailyReport' }]

  return (
    <>
      <div className="relative flex min-h-screen flex-col items-center justify-center space-y-10 overflow-hidden bg-gradient-to-b from-white to-gray-100 px-4 pt-12 pb-24">
        <div className="absolute top-0 left-0 z-0 h-full w-full overflow-hidden">
          <motion.div
            className="animate-float absolute h-60 w-60 rounded-full bg-purple-300 opacity-40 mix-blend-multiply blur-3xl filter"
            initial={{ y: -100 }}
            animate={{ y: 100 }}
            transition={{
              repeat: Infinity,
              duration: 6,
              ease: 'easeInOut',
              repeatType: 'reverse',
            }}
          />
          <motion.div
            className="animate-float absolute right-0 bottom-0 h-72 w-72 rounded-full bg-pink-300 opacity-30 mix-blend-multiply blur-3xl filter"
            initial={{ y: 100 }}
            animate={{ y: -100 }}
            transition={{
              repeat: Infinity,
              duration: 7,
              ease: 'easeInOut',
              repeatType: 'reverse',
            }}
          />
        </div>

        {/* ボタンコンテンツ */}
        <div className="z-10 space-y-6 text-center">
          <h1 className="mb-6 text-3xl font-bold text-gray-800">
            レポートを選択してください
          </h1>
          {reports.map((report, index) => (
            <motion.div
              key={report.path}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index }}
            >
              <Link
                to={report.path}
                className="block rounded-xl bg-white px-8 py-4 font-semibold text-gray-800 shadow-xl transition-all duration-300 hover:bg-indigo-100"
              >
                {report.title}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <MobileMenu />
    </>
  )
}
