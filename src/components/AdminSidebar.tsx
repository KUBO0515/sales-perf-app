import { Link } from 'react-router-dom'
import { ChartLine, Database, LayoutGrid, NotebookText } from 'lucide-react'

export default function AdminSidebar() {
  return (
    <aside className="fixed top-0 left-0 flex h-screen w-[280px] flex-col justify-between bg-gray-800 p-4 text-white">
      <div className="flex flex-col">
        <Link to="/admin">
          <h3 className="m-4 flex items-center gap-6 text-center text-2xl">
            <LayoutGrid />
            DashBoard
          </h3>
        </Link>
        <Link to="/admin/record">
          <div className="group m-4">
            <button className="flex w-full cursor-pointer items-center gap-6 rounded-lg p-5 text-center font-bold text-white transition duration-300 group-hover:bg-gray-600">
              <Database />
              Record
            </button>
          </div>
        </Link>
        <Link to="/admin/analytics">
          <div className="group m-4">
            <button className="flex w-full cursor-pointer items-center gap-6 rounded-lg p-5 text-center font-bold text-white transition duration-300 group-hover:bg-gray-600">
              <ChartLine />
              Analytics
            </button>
          </div>
        </Link>
        <Link to="/admin/formats">
          <div className="group m-4">
            <button className="flex w-full cursor-pointer items-center gap-6 rounded-lg p-5 text-center font-bold text-white transition duration-300 group-hover:bg-gray-600">
              <NotebookText />
              Formats
            </button>
          </div>
        </Link>
      </div>

      <div className="m-4">
        <button className="btn btn-secondary w-full cursor-pointer py-4 text-lg font-bold">
          Export CSV
        </button>
      </div>
    </aside>
  )
}
