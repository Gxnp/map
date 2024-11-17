import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import "./mapcom.css";
import axios from "axios";
import Searchcom from "./searchcom";

// ไอคอนสำหรับผู้ใช้
const userIcon = L.icon({
  iconUrl: "/youlocate.png",
  iconSize: [45, 55],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
});

// ไอคอนสำหรับจุดวิน
const winIcon = L.icon({
  iconUrl: "/win.png",
  iconSize: [35, 50],
  iconAnchor: [22, 44],
  popupAnchor: [0, -30],
});

const winLocations = [
  {
    lat: 13.722733392802247,
    lng: 100.80049268454813,
    name: "หน้าม. ลลิล",
    description: "วินใจดี ขับรถปลอดภัย",
    pic: "gogo.png",
  },
  {
    lat: 13.722755223225388,
    lng: 100.79758603139256,
    name: "หน้าวัดพล",
    description: "วินสุภาพ ขับรถเร็ว",
    pic: "gogo.png",
  },
  {
    lat: 13.722406797580023,
    lng: 100.78017534912469,
    name: "รถไฟสจล.",
    description: "วินบริการดี ราคาถูก",
    pic: "gogo.png",
  },
  {
    lat: 13.722406797580023,
    lng: 100.78017534912469,
    name: "ตรงข้ามร้านแพนเค้ก",
    description: "วินราคาประหยัด บริการดี",
    pic: "gogo.png",
  },
  {
    lat: 13.721993827410541,
    lng: 100.78083614586316,
    name: "ตรงข้ามสวนพระนคร",
    description: "วินขับปลอดภัย บริการดี",
    pic: "gogo.png",
  },
  {
    lat: 13.719997131453699,
    lng: 100.79608265326127,
    name: "บางเทศธรรม",
    description: "วินใจเย็น ขับดี",
    pic: "gogo.png",
  },
  {
    lat: 13.720350055701877,
    lng: 100.79509160854646,
    name: "ตลาดนัดปตท.",
    description: "วินราคาถูก บริการเยี่ยม",
    pic: "gogo.png",
  },
  {
    lat: 13.722183745826886,
    lng: 100.78740266165777,
    name: "ตลาดหัวตะเข้",
    description: "วินใจดี พร้อมให้บริการ",
    pic: "gogo.png",
  },
  {
    lat: 13.721810984747265,
    lng: 100.78984228956055,
    name: "ตลาดน้ำ",
    description: "วินบริการดี ราคายุติธรรม",
    pic: "gogo.png",
  },
  {
    lat: 13.722093768929392,
    lng: 100.7889127102886,
    name: "ใต้สะพานตลาดหัวตะเข้",
    description: "วินเร็ว ปลอดภัย",
    pic: "gogo.png",
  },
  {
    lat: 13.721821254428736,
    lng: 100.78529824470968,
    name: "ธนาคารกรุงศรี",
    description: "วินบริการดี ราคาย่อมเยา",
    pic: "gogo.png",
  },
  {
    lat: 13.727950846623896,
    lng: 100.77783302338754,
    name: "หน้าประตูวิศวะ",
    description: "วินสุภาพ ขับรถปลอดภัย",
    pic: "gogo.png",
  },
  {
    lat: 13.72800250486508,
    lng: 100.77294577564355,
    name: "หน้าซอยเกกี",
    description: "วินบริการดี ขับปลอดภัย",
    pic: "gogo.png",
  },
  {
    lat: 13.727942026334551,
    lng: 100.76988732238641,
    name: "สถานีมอไซค์น้ำใจงาม",
    description: "วินใจดี ราคายุติธรรม",
    pic: "gogo.png",
  },
  {
    lat: 13.727900354041997,
    lng: 100.76692113961953,
    name: "หน้าซอยตรงข้ามหอ RNP",
    description: "วินขับดี ราคาถูก",
    pic: "gogo.png",
  },
];

const Modal = ({ isOpen, onClose, title, description, pic }) => {
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportDate, setReportDate] = useState("");
  const [reportTime, setReportTime] = useState("");
  const [reportDetails, setReportDetails] = useState("");

  const [modalData, setModalData] = useState({
    isOpen: false,
    title: "",
    description: "",
    pic: "",
  });

  const handleReportClick = () => {
    setShowReportForm(true); // แสดงฟอร์มรายงาน
  };

  const handleBackClick = () => {
    setShowReportForm(false); // กลับไปที่ Modal หลัก
  };
  const handleFormSubmit = () => {
    // Handle form submission logic
    setShowReportForm(false);
    onClose();
  };

  const handleMarkerClick = (location) => {
    console.log(location); // ตรวจสอบว่า location มีค่าอะไร
    setModalData({
      isOpen: true,
      title: location.name,
      description: location.description,
      pic: `/images/${location.pic}`, // ใช้เส้นทางที่ถูกต้อง
    });
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    console.log(
      "Date:",
      reportDate,
      "Time:",
      reportTime,
      "Details:",
      reportDetails
    );

    setReportDate("");
    setReportTime("");
    setReportDetails("");
    setShowReportForm(false);
    onClose(); // ปิด Modal หลังจากส่งข้อมูล
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="modal-content bg-white p-6 rounded-lg shadow-lg max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        <div className="flex justify-center items-center">
          <img src={pic} alt={title} />
        </div>
        <p className="text-gray-600 mt-2">{description}</p>
        <p className="text-red-600  text-xs">ผู้โดยสารมีแนวโน้มถูกเรียกเก็บเงินเกินที่กำหนด</p>

        {!showReportForm ? (
          <div className="flex gap-4 justify-center mt-6">
            <button
              onClick={handleReportClick}
              className="bg-red-500 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition-all duration-300 transform hover:scale-105"
            >
              Report
            </button>
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300 transform hover:scale-105"
            >
              Close
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleReportSubmit}
            className="report-form mt-4 space-y-4"
          >
            <div>
              <label className="block text-gray-700">วันที่:</label>
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                required
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">เวลา:</label>
              <input
                type="time"
                value={reportTime}
                onChange={(e) => setReportTime(e.target.value)}
                required
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">รายละเอียด:</label>
              <textarea
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="กรอกรายละเอียดการรายงาน"
                required
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white px-6 py-2 rounded-lg mt-4 hover:bg-green-600 focus:outline-none"
            >
              ส่งรายงาน
            </button>
            <button
              type="button"
              onClick={handleBackClick}
              className="w-full bg-gray-500 text-white px-6 py-2 rounded-lg mt-2 hover:bg-gray-600 focus:outline-none"
            >
              ย้อนกลับ
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const MapComponent = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [map, setMap] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [distance, setDistance] = useState(null);
  const [price, setPrice] = useState(null);
  const [travelTime, setTravelTime] = useState(null);
  const [modalData, setModalData] = useState({
    isOpen: false,
    title: "",
    description: "",
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  useEffect(() => {
    if (userLocation && !map) {
      const initializedMap = L.map("map").setView(userLocation, 13);
      setMap(initializedMap);

      L.tileLayer(
        `https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=eRUWII73M4z5SSItDDnM`
      ).addTo(initializedMap);

      L.marker(userLocation, { icon: userIcon })
        .addTo(initializedMap)
        .bindPopup("คุณอยู่ตรงนี้")
        .openPopup();

      winLocations.forEach((location) => {
        L.marker([location.lat, location.lng], { icon: winIcon })
          .addTo(initializedMap)
          .on("click", () => handleMarkerClick(location));
      });

      initializedMap.on("click", (e) =>
        setDestination([e.latlng.lat, e.latlng.lng])
      );
    }
  }, [userLocation, map]);

  useEffect(() => {
    if (map && userLocation && destination) {
      if (map._router) {
        map._router.getPlan().setWaypoints([]);
        map.removeControl(map._router);
      }

      const router = L.Routing.control({
        waypoints: [
          L.latLng(userLocation[0], userLocation[1]),
          L.latLng(destination[0], destination[1]),
        ],
        createMarker: () => null,
        draggableWaypoints: false,
        addWaypoints: false,
      })
        .on("routesfound", (e) => {
          setDistance((e.routes[0].summary.totalDistance / 1000).toFixed(2));
          setTravelTime((e.routes[0].summary.totalTime / 60).toFixed(0));
        })
        .addTo(map);

      map._router = router;

      const routingContainer = document.querySelector(
        ".leaflet-routing-container"
      );
      const customContainer = document.getElementById(
        "custom-routing-container"
      );
      if (routingContainer && customContainer) {
        customContainer.appendChild(routingContainer);
      }
    }
  }, [map, userLocation, destination]);

  useEffect(() => {
    if (distance) {
      const dist = parseFloat(distance);
      let totalFare = 0;

      if (dist <= 2) {
        totalFare = 25;
      } else if (dist > 2 && dist <= 5) {
        totalFare = 25 + (dist - 2) * 5;
      } else if (dist > 5 && dist <= 15) {
        totalFare = 25 + 3 * 5 + (dist - 5) * 10;
      } else {
        totalFare = 25 + 3 * 5 + 10 * 10 + (dist - 15) * 15;
      }

      setPrice(totalFare.toFixed(2));
    }
  }, [distance]);

  const handleSearch = async () => {
    try {
      const { data } = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          searchQuery
        )}&key=6a71776ee7104c609b98e74f09a76cfc`
      );
      const { lat, lng } = data.results[0].geometry;
      setDestination([lat, lng]);
    } catch (error) {
      console.error("Error fetching location:", error);
      alert("Location not found. Try a different query.");
    }
  };

  const handleMarkerClick = (location) => {
    setModalData({
      isOpen: true,
      title: location.name,
      description: location.description,
      pic: location.pic, // ส่ง pic ไปด้วย
    });
  };

  const [isExpanded, setIsExpanded] = useState(false); // ควบคุมการเปิด/ปิด
  const toggleExpand = () => {
    setIsExpanded((prev) => !prev); // Toggle ค่า state
  };
  

  return (
    <div>
      <div className="z-[1000] absolute flex justify-between top-3 left-[33vw] w-[30%] px-3 rounded-full border border-gray-300 shadow-sm bg-white bg-opacity-70">
        <input
          type="text"
          placeholder="🔍 ค้นหาสถานที่"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ paddingRight: "200px", padding: "8px" }}
          className="placeholder-gray-700 w-[80%] text-gray-900 text-sm cursor-pointer text-left bg-transparent"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div

        id="map"
        style={{
          height: "100vh",
          position: "relative",
          zIndex: 1,
        }}
      />

      

{distance && (
  <div
    className={`fixed z-[1000] bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[640px] bg-[#D2691E] text-white p-4 rounded-t-2xl shadow-md text-base break-words flex-col transition-all duration-300 ${
      isExpanded ? "h-auto flex" : "h-[50px] flex items-center"
    }`}
    onClick={toggleExpand} // คลิกเพื่อเปิด/ปิด
  >
    <div className="w-full text-center font-medium cursor-pointer">
      {isExpanded ? "เลื่อนลงเพื่อเก็บ" : "กดเพื่อเปิด"}
    </div>
    {isExpanded && ( // แสดงข้อมูลเพิ่มเติมเมื่อขยาย
      <>
        <div className="flex justify-between w-full font-normal pb-3">
          <span>ระยะทาง</span>
          <span>{distance} km</span>
        </div>
        <div className="flex justify-between w-full font-normal pb-3">
          <span>ค่าโดยสาร</span>
          <span>{price} บาท</span>
        </div>
        <div className="flex justify-between w-full font-normal pb-3">
          <span>เวลาประมาณ</span>
          <span>{travelTime} นาที</span>
        </div>
      </>
    )}
  </div>
)}


      <Modal
        isOpen={modalData.isOpen}
        onClose={() => setModalData({ ...modalData, isOpen: false })}
        title={modalData.title}
        description={modalData.description}
        pic={modalData.pic} // ส่ง pic ไปใน Modal
      />
    </div>
  );
};

export default MapComponent;
