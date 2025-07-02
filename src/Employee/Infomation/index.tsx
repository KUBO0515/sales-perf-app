import { motion } from "framer-motion";
import MobileMenu from "../../Layouts/MobileMenu";

const mockNotices = [
  {
    date: "2025-06-30",
    title: "システムメンテナンスのお知らせ",
    body: "7月3日 22:00 〜 翌4:00の間、一部機能がご利用できません。",
  },
  {
    date: "2025-06-25",
    title: "新しい営業資料の配布",
    body: "営業用資料が更新されました。資料管理ページをご確認ください。",
  },
  {
    date: "2025-06-20",
    title: "7月の全体朝礼について",
    body: "7月5日（金）9:00よりZoomにて実施します。",
  },
];

export default function InformationPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 px-4 pt-12 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute w-60 h-60 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"
            initial={{ y: -80 }}
            animate={{ y: 80 }}
            transition={{
              repeat: Infinity,
              duration: 6,
              ease: "easeInOut",
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute right-0 bottom-0 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"
            initial={{ y: 80 }}
            animate={{ y: -80 }}
            transition={{
              repeat: Infinity,
              duration: 7,
              ease: "easeInOut",
              repeatType: "reverse",
            }}
          />
        </div>

        {/* コンテンツ */}
        <div className="z-10 max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            お知らせ
          </h1>

          {mockNotices.map((notice, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white shadow-xl rounded-xl p-6 transition-all space-y-2"
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
  );
}
