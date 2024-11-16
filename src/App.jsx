import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Make sure to import BrowserRouter
import MapComponent from "./components/MapComponent"; // นำเข้าคอมโพเนนต์
import SearchOverlay from "./components/searchoverlay";
import Searchcom from "./components/searchcom";

const App = () => {
  return (
    <Router>
      <div className="bg-slate-100 p-10 border border-transparent rounded-xl">
        <div>
          <h1 className="font-semibold text-red-500 text-5xl text-center"></h1>

          <Routes>
            {/* หน้าเริ่มต้นที่แสดง Map */}
            <Route path="/" element={<MapComponent />} />

            {/* เพิ่ม Searchcom ในเส้นทางที่ต้องการ */}
            <Route path="/searchcom" element={<Searchcom />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
