import ChartCard from "../components/ChartCard";
import { exportCsv } from "../firebase";
import AdminSidebar from "../Layouts/AdminSidebar";
import motion from "framer-motion";

export default function AdminDashboard() {
  const download = async () => {
    const res = await exportCsv();
    const url = res.data as string;
    window.open(url, "_blank");
  };
  return (
    <>
      <AdminSidebar />
      <div className="p-6 space-y-6 bg-gray-300 ml-[280px]">
        <h1 className="text-2xl font-bold">Admin Analytics</h1>
        <ChartCard
          title="Team vs Company"
          labels={["Apr", "May", "Jun"]}
          values={[10, 12, 15]}
        />
        <button onClick={download} className="btn btn-secondary ">
          Export CSV
        </button>
      </div>
    </>
  );
}
