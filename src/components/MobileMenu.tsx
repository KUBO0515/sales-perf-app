import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserRound, Info, ChartNoAxesCombined, House } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function MobileMenu() {
  const location = useLocation()

  const icons = [
    { path: '/user/home', icon: <House />, key: 'home' },
    { path: '/user/report', icon: <ChartNoAxesCombined />, key: 'chart' },
    { path: '/user/info', icon: <Info />, key: 'info' },
    { path: '/user/profile', icon: <UserRound />, key: 'user' },
  ]

  //mobile用のフッター
  return (
    <div className="fixed bottom-0 left-0 z-50 flex w-full justify-around gap-8 bg-gray-400 px-8 py-6 text-white shadow-[-4px_-4px_10px_rgba(0,0,0,0.3)]">
      {icons.map(({ path, icon, key }) => {
        const isActive = location.pathname === path
        return (
          <Link to={path} key={key}>
            <motion.div
              animate={{
                y: isActive ? -7 : 0,
                color: isActive ? '#ffffff' : '#d1d5db', // white / gray-300
              }}
              transition={{
                type: 'spring',
                stiffness: 150,
                damping: 30,
                mass: 0.8,
              }}
            >
              {icon}
            </motion.div>
          </Link>
        )
      })}
    </div>
  )
}
