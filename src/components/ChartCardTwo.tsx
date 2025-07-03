import { Bar } from 'react-chartjs-2'
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'
import { motion } from 'framer-motion'

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

interface Props {
  title: string
  labels: string[]
  values: number[]
}

export default function ChartCardTwo({ title, labels, values }: Props) {
  const data = {
    labels,
    datasets: [
      {
        label: 'Team',
        data: values,
        backgroundColor: 'rgba(59, 130, 246, 0.7)', // 青
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="rounded-2xl bg-white p-4 shadow"
    >
      <h2 className="mb-2 text-lg font-semibold">{title}</h2>
      <Bar data={data} options={options} />
    </motion.div>
  )
}
