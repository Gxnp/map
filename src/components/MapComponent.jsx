import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import './mapcom.css';
import axios from 'axios';

// ไอคอนสำหรับผู้ใช้
const userIcon = L.icon({
  iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png',
  shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
  iconSize: [38, 95],
  shadowSize: [50, 64],
  iconAnchor: [22, 94],
  shadowAnchor: [4, 62],
  popupAnchor: [-3, -76]
});

// ไอคอนสำหรับจุดวิน
const winIcon = L.icon({
  iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png',
  iconSize: [28, 50],
  iconAnchor: [22, 44],
  popupAnchor: [0, -30]
});

// ข้อมูลพิกัดและรายละเอียดของวินแต่ละจุด
const winLocations = [
  { lat: 13.730948075588573, lng: 100.78130671449425, name: 'วินที่ 1', description: 'วินใจดี ขับรถปลอดภัย' },
  { lat: 13.7455, lng: 100.4926, name: 'วินที่ 2', description: 'วินสุภาพ ขับรถเร็ว' },
  { lat: 13.7376, lng: 100.5155, name: 'วินที่ 3', description: 'วินบริการดี ราคาถูก' },
];

// Modal Component สำหรับแสดงรายละเอียดของวิน
const Modal = ({ isOpen, onClose, title, description }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{description}</p>
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
  const [modalData, setModalData] = useState({ isOpen: false, title: '', description: '' });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  useEffect(() => {
    if (userLocation && !map) {
      const initializedMap = L.map('map').setView(userLocation, 13);
      setMap(initializedMap);

      L.tileLayer(`https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=eRUWII73M4z5SSItDDnM	`).addTo(initializedMap);

      L.marker(userLocation, { icon: userIcon }).addTo(initializedMap).bindPopup("คุณอยู่ตรงนี้").openPopup();

      // เพิ่ม Marker ของแต่ละวินและกำหนด onClick เพื่อเปิด Modal
      winLocations.forEach((location) => {
        L.marker([location.lat, location.lng], { icon: winIcon })
          .addTo(initializedMap)
          .on('click', () => handleMarkerClick(location));
      });

      initializedMap.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setDestination([lat, lng]);
      });
    }
  }, [userLocation, map]);

  useEffect(() => {
    if (map && userLocation && destination) {
      if (map._router) {
        map.removeControl(map._router);
      }

      const router = L.Routing.control({
        waypoints: [
          L.latLng(userLocation[0], userLocation[1]),
          L.latLng(destination[0], destination[1]),
        ],
        createMarker: function () { return null; },
      })
        .on('routesfound', function (e) {
          const route = e.routes[0];
          setDistance((route.summary.totalDistance / 1000).toFixed(2));
        })
        .addTo(map);

      map._router = router;

      const routingContainer = document.querySelector('.leaflet-routing-container');
      const customContainer = document.getElementById('custom-routing-container');
      if (routingContainer && customContainer) {
        customContainer.appendChild(routingContainer);
      }
    }
  }, [map, userLocation, destination]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(searchQuery)}&key=YOUR_OPENCAGEDATA_KEY`
      );
      const { results } = response.data;

      if (results && results.length > 0) {
        const { lat, lng } = results[0].geometry;
        setDestination([lat, lng]);
      } else {
        alert("Location not found. Please try a different query.");
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  const handleMarkerClick = (location) => {
    setModalData({
      isOpen: true,
      title: location.name,
      description: location.description,
    });
  };

  const closeModal = () => {
    setModalData({ isOpen: false, title: '', description: '' });
  };

  return (
    <div>
      <div style={{ padding: "10px" }}>
        <input
          type="text"
          placeholder="Search for a location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: "5px", width: "80%" }}
        />
        <button onClick={handleSearch} style={{ padding: "5px", marginLeft: "5px" }}>
          Search
        </button>
        <p>อัตราค่าโดยสาร: {distance ? distance * 5 : 0} บาท</p>
      </div>
      <div id="map" style={{ height: "70vh", marginBottom: "10px" }}></div>

      {distance && (
        <div style={{ padding: "10px" }}>
          <p>Distance to destination: {distance} km</p>
        </div>
      )}

      {/* Modal สำหรับแสดงรายละเอียดของแต่ละวิน */}
      <Modal
        isOpen={modalData.isOpen}
        onClose={closeModal}
        title={modalData.title}
        description={modalData.description}
      />
    </div>
  );
};

export default MapComponent;
