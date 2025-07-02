export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-70 bg-gray-800 p-4 text-white">
      <div className="flex flex-col">
        <button className="m-4 transform cursor-pointer rounded-lg p-5 font-bold text-white transition hover:scale-110 hover:bg-gray-600 hover:text-white">
          Records
        </button>
        <button className="m-4 transform cursor-pointer rounded-lg p-5 font-bold text-white transition hover:scale-110 hover:bg-gray-600 hover:text-white">
          Analytics
        </button>
      </div>
    </aside>
  )
}
