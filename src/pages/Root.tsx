import { useOutlet } from "react-router-dom";
// import Footer from "./Footer";
// import Sidebar from "./Sidebar";

export default function Root() {
  const outlet = useOutlet();

  return (
    <>
      <main>{outlet}</main>
      {/* <Sidebar /> */}
    </>
  );
}
