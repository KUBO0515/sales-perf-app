import ChartCard from "../../components/ChartCard";
import AdminSidebar from "../../Layouts/AdminSidebar";
import { motion } from "framer-motion";

export default function Record() {
  return (
    <>
      <AdminSidebar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="min-h-screen bg-gray-200 p-4 space-y-6 ml-[280px]"
      >
        <h1 className="text-2xl font-bold">Record</h1>
        <ChartCard
          title="Weekly Trend"
          labels={["Mon", "Tue", "Wed", "Thu", "Fri"]}
          values={[3, 2, 5, 1, 4]}
        />
      </motion.div>
    </>
  );
}
