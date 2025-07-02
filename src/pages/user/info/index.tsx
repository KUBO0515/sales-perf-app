import { motion } from 'framer-motion'
import MobileMenu from '@/components/MobileMenu'

const mockNotices = [
  {
    date: '2025-06-30',
    title: 'システムメンテナンスのお知らせ',
    body: '7月3日 22:00 〜 翌4:00の間、一部機能がご利用できません。',
  },
  {
    date: '2025-06-25',
    title: '新しい営業資料の配布',
    body: '営業用資料が更新されました。資料管理ページをご確認ください。',
  },
  {
    date: '2025-06-20',
    title: '7月の全体朝礼について',
    body: '7月5日（金）9:00よりZoomにて実施します。',
  },
]

export default function Page() {
  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white to-gray-100 px-4 pt-12 pb-24">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            className="animate-float absolute h-60 w-60 rounded-full bg-indigo-300 opacity-30 mix-blend-multiply blur-3xl filter"
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
            className="animate-float absolute right-0 bottom-0 h-72 w-72 rounded-full bg-orange-200 opacity-30 mix-blend-multiply blur-3xl filter"
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
            お知らせ
          </h1>

          {mockNotices.map((notice, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="space-y-2 rounded-xl bg-white p-6 shadow-xl transition-all"
            >
              <p className="text-sm text-gray-500">{notice.date}</p>
              <p className="text-lg font-semibold">{notice.title}</p>
              <p className="text-gray-700">{notice.body}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <MobileMenu />
    </>
  )
}
