// import { Routes, Route, Navigate } from "react-router-dom";
// import Home from "./pages/Home";
// import AdminDashboard from "./pages/AdminDashboard";
// import Analytics from "./pages/Analytics";

// export default function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/admin" element={<AdminDashboard />} />
//       <Route path="/analytics" element={<Analytics />} />
//       <Route path="*" element={<Navigate to="/" />} />
//     </Routes>
//   );
import { RouterProvider } from "react-router-dom";
import { router } from "./App/router";

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
