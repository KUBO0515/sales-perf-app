import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import MobileMenu from "../../Layouts/MobileMenu";

export default function UserPage() {
  const menu = [
    { title: "プロフィール", path: "/user/profile" },
    { title: "アカウント設定", path: "/user/settings" },
    { title: "ログアウト", path: "/logout" },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex flex-col items-center justify-center space-y-10 px-4 pt-12 pb-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
          <motion.div
            className="absolute w-56 h-56 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float"
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
            className="absolute right-0 bottom-0 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"
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

        {/* ユーザー項目 */}
        <div className="z-10 space-y-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
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
                className="block px-8 py-4 rounded-xl shadow-xl bg-white text-gray-800 font-semibold hover:bg-blue-100 transition-all duration-300"
              >
                {item.title}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <MobileMenu />
    </>
  );
}
