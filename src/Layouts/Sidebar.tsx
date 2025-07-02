export default function Sidebar() {
  return (
    <aside className="w-70 h-screen fixed top-0 left-0 bg-gray-800 text-white p-4">
      <div className="flex flex-col">
        <button className="m-4 p-5 transition transform  rounded-lg hover:scale-110 text-white font-bold hover:text-white hover:bg-gray-600 cursor-pointer">
          Records
        </button>
        <button className="m-4 p-5 transition transform  rounded-lg hover:scale-110 text-white font-bold hover:text-white hover:bg-gray-600 cursor-pointer">
          Analytics
        </button>
      </div>
    </aside>
  );
}
