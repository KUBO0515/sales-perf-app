import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import MobileMenu from '@/components/MobileMenu'

export default function Page() {
  const menu = [
    { title: 'プロフィール', path: '/user/profile' },
    { title: 'アカウント設定', path: '/user/settings' },
    { title: 'ログアウト', path: '/logout' },
  ]

  return (
    <>
      <div className="relative flex min-h-screen flex-col items-center justify-center space-y-10 overflow-hidden bg-gradient-to-b from-white to-gray-100 px-4 pt-12 pb-24">
        <div className="absolute top-0 left-0 z-0 h-full w-full overflow-hidden">
          <motion.div
            className="animate-float absolute h-56 w-56 rounded-full bg-blue-300 opacity-40 mix-blend-multiply blur-3xl filter"
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
            className="animate-float absolute right-0 bottom-0 h-64 w-64 rounded-full bg-green-300 opacity-30 mix-blend-multiply blur-3xl filter"
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

        {/* ユーザー項目 */}
        <div className="z-10 space-y-6 text-center">
          <h1 className="mb-6 text-3xl font-bold text-gray-800">
            ユーザーメニュー
          </h1>
          {menu.map((item, index) => (
            <motion.div
              key={item.path}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index }}
            >
              <Link
                to={item.path}
                className="block rounded-xl bg-white px-8 py-4 font-semibold text-gray-800 shadow-xl transition-all duration-300 hover:bg-blue-100"
              >
                {item.title}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <MobileMenu />
    </>
  )
}
