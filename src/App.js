import React from "react";
import MapComponent from "./components/MapComponent"; // นำเข้าคอมโพเนนต์

const App = () => {
  return (
    <div className="bg-slate-100 p-10 border border-transparent rounded-xl">
      <h1 className="font-semibold text-red-500 text-5xl text-center">
        My Map Application
      </h1>
      <MapComponent /> {/* แสดงแผนที่ */}
    </div>
  );
};

export default App;
