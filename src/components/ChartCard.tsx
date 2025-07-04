import { Bar } from 'react-chartjs-2'
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from 'chart.js/auto'
Chart.register(
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
)
import { motion } from 'framer-motion'

interface Props {
  title: string
  labels: string[]
  values: number[]
}

export default function ChartCard({ title, labels, values }: Props) {
  const data = {
    labels,
    datasets: [
      {
        type: 'bar' as const,
        data: values,
      },
    ],
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="rounded-2xl bg-white p-4 shadow"
    >
      <h2 className="mb-2 text-lg font-semibold">{title}</h2>
      <Bar data={data} />
    </motion.div>
  )
}
