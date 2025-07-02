import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { UserRound, Info, ChartNoAxesCombined, House } from "lucide-react";
import { Link } from "react-router-dom";

export default function MobileMenu() {
  const location = useLocation();

  const icons = [
    { path: "/mobilehome", icon: <House />, key: "home" },
    { path: "/report", icon: <ChartNoAxesCombined />, key: "chart" },
    { path: "/info", icon: <Info />, key: "info" },
    { path: "/user", icon: <UserRound />, key: "user" },
  ];

  //mobile用のフッター
  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-400 text-white py-6 px-8 flex justify-around  gap-8 shadow-[-4px_-4px_10px_rgba(0,0,0,0.3)]">
      {icons.map(({ path, icon, key }) => {
        const isActive = location.pathname === path;
        return (
          <Link to={path} key={key}>
            <motion.div
              animate={{
                y: isActive ? -7 : 0,
                color: isActive ? "#ffffff" : "#d1d5db", // white / gray-300
              }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 30,
                mass: 0.8,
              }}
            >
              {icon}
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}
