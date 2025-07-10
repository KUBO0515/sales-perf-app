import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

import { auth } from '@/firebase'
import MobileMenu from '@/components/MobileMenu'
import { LogOut } from 'lucide-react'

export default function Page() {
  const navigate = useNavigate()

  const menuList = [
    { title: 'プロフィール', onClick: () => navigate('/user/profile') },
    { title: 'アカウント設定', onClick: () => navigate('/user/settings') },
    {
      title: 'ログアウト',
      icon: <LogOut className="me-3 inline" />,
      onClick: () => auth.signOut(),
    },
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
          {menuList.map((menu, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index }}
            >
              <button
                onClick={menu.onClick}
                className="flex w-full items-center justify-center rounded-lg bg-white px-4 py-2 text-lg font-medium text-gray-800 shadow hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
              >
                {menu.icon && menu.icon}
                {menu.title}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
      <MobileMenu />
    </>
  )
}
