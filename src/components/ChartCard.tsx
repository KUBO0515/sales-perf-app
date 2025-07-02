import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";
Chart.register(
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
);
import { motion } from "framer-motion";

interface Props {
  title: string;
  labels: string[];
  values: number[];
}

export default function ChartCard({ title, labels, values }: Props) {
  const data = {
    labels,
    datasets: [
      {
        type: "bar" as const,
        data: values,
      },
    ],
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-white rounded-2xl shadow p-4"
    >
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <Bar data={data} />
    </motion.div>
  );
}
