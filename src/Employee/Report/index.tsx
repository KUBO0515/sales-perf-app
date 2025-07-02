import { motion } from 'framer-motion'
import MobileMenu from '../../Layouts/MobileMenu'

const mockReports = [
  { date: '2025-06-28', type: '日報', summary: '顧客訪問2件、成約1件。' },
  { date: '2025-05-28', type: '日報', summary: '顧客訪問2件、成約1件。' },
  { date: '2025-04-28', type: '日報', summary: '顧客訪問2件、成約1件。' },
  { date: '2025-03-28', type: '日報', summary: '顧客訪問2件、成約1件。' },
  { date: '2025-02-28', type: '日報', summary: '顧客訪問2件、成約1件。' },
  { date: '2025-01-28', type: '日報', summary: '顧客訪問2件、成約1件。' },
]

export default function ReportHistory() {
  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white to-gray-100 px-4 pt-12 pb-24">
        {/* 視差背景エフェクト */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            className="animate-float absolute h-60 w-60 rounded-full bg-yellow-200 opacity-30 mix-blend-multiply blur-3xl filter"
            initial={{ y: -80 }}
            animate={{ y: 80 }}
            transition={{
              repeat: Infinity,
              duration: 6,
              ease: 'easeInOut',
              repeatType: 'reverse',
            }}
          />
          <motion.div
            className="animate-float absolute right-0 bottom-0 h-72 w-72 rounded-full bg-pink-200 opacity-30 mix-blend-multiply blur-3xl filter"
            initial={{ y: 80 }}
            animate={{ y: -80 }}
            transition={{
              repeat: Infinity,
              duration: 7,
              ease: 'easeInOut',
              repeatType: 'reverse',
            }}
          />
        </div>

        {/* コンテンツ */}
        <div className="z-10 mx-auto max-w-2xl space-y-6">
          <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
            報告履歴
          </h1>

          {mockReports.map((report, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="space-y-2 rounded-xl bg-white p-6 shadow-xl transition-all"
            >
              <p className="text-sm text-gray-500">{report.date}</p>
              <p className="text-lg font-semibold">{report.type}</p>
              <p className="text-gray-700">{report.summary}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <MobileMenu />
    </>
  )
}
