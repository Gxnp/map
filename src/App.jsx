import React from "react";
import { BrowserRouter } from "react-router-dom"; // Make sure to import BrowserRouter
import MapComponent from "./components/MapComponent"; // นำเข้าคอมโพเนนต์
import SearchOverlay from "./components/searchoverlay";
import Searchcom from "./components/searchcom";

const App = () => {
  return (
    <BrowserRouter>
      <div className="bg-slate-100 border border-transparent rounded-xl h-[100vh]">
        <div>
          <MapComponent />
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
