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
  },
  {
    lat: 13.722755223225388,
    lng: 100.79758603139256,
    name: "หน้าวัดพล",
    description: "วินสุภาพ ขับรถเร็ว",
  },
  {
    lat: 13.722406797580023,
    lng: 100.78017534912469,
    name: "รถไฟสจล.",
    description: "วินบริการดี ราคาถูก",
  },
  {
    lat: 13.722406797580023,
    lng: 100.78017534912469,
    name: "ตรงข้ามร้านแพนเค้ก",
    description: "วินราคาประหยัด บริการดี",
  },
  {
    lat: 13.721993827410541,
    lng: 100.78083614586316,
    name: "ตรงข้ามสวนพระนคร",
    description: "วินขับปลอดภัย บริการดี",
  },
  {
    lat: 13.719997131453699,
    lng: 100.79608265326127,
    name: "บางเทศธรรม",
    description: "วินใจเย็น ขับดี",
  },
  {
    lat: 13.720350055701877,
    lng: 100.79509160854646,
    name: "ตลาดนัดปตท.",
    description: "วินราคาถูก บริการเยี่ยม",
  },
  {
    lat: 13.722183745826886,
    lng: 100.78740266165777,
    name: "ตลาดหัวตะเข้",
    description: "วินใจดี พร้อมให้บริการ",
  },
  {
    lat: 13.721810984747265,
    lng: 100.78984228956055,
    name: "ตลาดน้ำ",
    description: "วินบริการดี ราคายุติธรรม",
  },
  {
    lat: 13.722093768929392,
    lng: 100.7889127102886,
    name: "ใต้สะพานตลาดหัวตะเข้",
    description: "วินเร็ว ปลอดภัย",
  },
  {
    lat: 13.721821254428736,
    lng: 100.78529824470968,
    name: "ธนาคารกรุงศรี",
    description: "วินบริการดี ราคาย่อมเยา",
  },
  {
    lat: 13.727950846623896,
    lng: 100.77783302338754,
    name: "หน้าประตูวิศวะ",
    description: "วินสุภาพ ขับรถปลอดภัย",
  },
  {
    lat: 13.72800250486508,
    lng: 100.77294577564355,
    name: "หน้าซอยเกกี",
    description: "วินบริการดี ขับปลอดภัย",
  },
  {
    lat: 13.727942026334551,
    lng: 100.76988732238641,
    name: "สถานีมอไซค์น้ำใจงาม",
    description: "วินใจดี ราคายุติธรรม",
  },
  {
    lat: 13.727900354041997,
    lng: 100.76692113961953,
    name: "หน้าซอยตรงข้ามหอ RNP",
    description: "วินขับดี ราคาถูก",
  },
];

const Modal = ({ isOpen, onClose, title, description, onMark }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{description}</p>
        <button onClick={onMark}>มาร์คจุดนี้</button>
        <button onClick={onClose}>Close</button>
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
      if (map._router) map.removeControl(map._router);

      const router = L.Routing.control({
        waypoints: [
          L.latLng(userLocation[0], userLocation[1]),
          L.latLng(destination[0], destination[1]),
        ],
        createMarker: () => null,
      })
        .on("routesfound", (e) =>
          setDistance((e.routes[0].summary.totalDistance / 1000).toFixed(2))
        )
        .addTo(map);

      map._router = router;
      const routingContainer = document.querySelector(
        ".leaflet-routing-container"
      );
      const customContainer = document.getElementById(
        "custom-routing-container"
      );
      if (routingContainer && customContainer)
        customContainer.appendChild(routingContainer);
    }
  }, [map, userLocation, destination]);

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
      onMark: () => markLocation(location),
    });
  };

  const markLocation = (location) => {
    L.marker([location.lat, location.lng], { icon: winIcon })
      .addTo(map)
      .bindPopup(`มาร์ค: ${location.name}`)
      .openPopup();

    setModalData({ isOpen: false, title: "", description: "" });
  };

  return (
    <div>
      <div style={{ padding: "10px" }}>
        {/* <input
          type="text"
          placeholder="Search for a location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '5px', width: '80%' }}
        />
        <button onClick={handleSearch} style={{ padding: '5px', marginLeft: '5px' }}>
          Search
        </button> */}

        <Searchcom />
        {/* <p>อัตราค่าโดยสาร: {distance ? distance * 5 : 0} บาท</p> */}
      </div>
      <div id="map" style={{ height: "70vh", marginBottom: "10px" }}></div>

      {distance && (
        <div style={{ padding: "10px" }}>
          <p>Distance to destination: {distance} km</p>
        </div>
      )}

      <Modal
        isOpen={modalData.isOpen}
        onClose={() => setModalData({ isOpen: false })}
        title={modalData.title}
        description={modalData.description}
        onMark={modalData.onMark}
      />
    </div>
  );
};

export default MapComponent;
