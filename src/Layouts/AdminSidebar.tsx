import { Link } from "react-router-dom";
import { ChartLine, Database, LayoutGrid } from "lucide-react";

export default function AdminSidebar() {
  return (
    <aside className="w-[280px] h-screen fixed top-0 left-0 bg-gray-800 text-white p-4 flex flex-col justify-between">
      <div className="flex flex-col">
        <Link to="/admin">
          <h3 className="text-2xl m-4 text-center flex items-center gap-6">
            <LayoutGrid />
            DashBoard
          </h3>
        </Link>
        <Link to="/record">
          <div className="group m-4">
            <button className="w-full p-5 rounded-lg text-white font-bold transition duration-300 group-hover:bg-gray-600 text-center flex items-center gap-6 cursor-pointer">
              <Database />
              Record
            </button>
          </div>
        </Link>
        <Link to="/analytics">
          <div className="group m-4">
            <button className="w-full p-5 rounded-lg text-white font-bold transition duration-300 group-hover:bg-gray-600 text-center flex items-center gap-6 cursor-pointer">
              <ChartLine />
              Analytics
            </button>
          </div>
        </Link>
      </div>

      <div className="m-4">
        <button className="btn btn-secondary cursor-pointer w-full py-4 text-lg font-bold">
          Export CSV
        </button>
      </div>
    </aside>
  );
}
