import { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js/auto'
import { Chart } from 'react-chartjs-2'
import { WeeklyAggregate } from '@/types/WeeklyAggregate'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ChartTooltip,
  Legend
)

const BAR_COLORS = [
  '#fb7185',
  '#fbbf24',
  '#34d399',
  '#60a5fa',
  '#c084fc',
  '#f472b6',
]
const LINE_COLOR = '#6366f1'

interface Props {
  labels: string[]
  userAggregates: WeeklyAggregate[]
  totalAggregates: WeeklyAggregate[]
  inputId?: string | null
}

export default function WeeklyVisitsChart({
  labels,
  userAggregates,
  totalAggregates,
  inputId = null,
}: Props) {
  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          type: 'bar' as const,
          label: 'あなた',
          data: userAggregates.map((a) => a.reports[inputId ?? 'value'] ?? 0),
          backgroundColor: BAR_COLORS.slice(0, labels.length),
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          type: 'line' as const,
          label: '全体',
          data: totalAggregates.map((a) => a.reports[inputId ?? 'value'] ?? 0),
          borderColor: LINE_COLOR,
          borderWidth: 3,
          tension: 0.35,
          pointBackgroundColor: LINE_COLOR,
          pointRadius: 4,
        },
      ],
    }),
    [labels, userAggregates, totalAggregates]
  )

  const options = useMemo(
    () => ({
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: { position: 'top' as const, labels: { usePointStyle: true } },
        tooltip: {
          backgroundColor: 'rgba(255,255,255,0.95)',
          titleColor: '#1f2937',
          bodyColor: '#4b5563',
          borderColor: '#e5e7eb',
          borderWidth: 1,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: '#f3f4f6' },
          ticks: { stepSize: 1 },
        },
        x: { grid: { display: false } },
      },
    }),
    []
  )

  return (
    <div className="relative h-[300px] w-full">
      {/* labels が変わるたびに完全リセット */}
      <Chart key={labels.join('-')} type="bar" data={data} options={options} />
    </div>
  )
}
