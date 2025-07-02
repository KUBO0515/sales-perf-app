import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

interface PageHeaderProps {
  title: string
}

export default function PageHeader({ title }: PageHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 left-0 z-50 flex w-full items-center gap-4 bg-white px-4 py-3 shadow-md">
      <button
        onClick={() => navigate(-1)}
        className="rounded-full p-2 transition hover:bg-gray-200"
        aria-label="戻る"
      >
        <ArrowLeft size={24} />
      </button>
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
    </header>
  )
}
