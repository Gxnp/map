import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import axios from 'axios';

// กำหนดไอคอนใหม่สำหรับ Marker
const userIcon = L.icon({
  iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png',
  shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
  iconSize: [38, 95],
  shadowSize: [50, 64],
  iconAnchor: [22, 94],
  shadowAnchor: [4, 62],
  popupAnchor: [-3, -76]
});



const MapComponent = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [map, setMap] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  useEffect(() => {
    if (userLocation && !map) {
      const initializedMap = L.map('map').setView(userLocation, 13);
      setMap(initializedMap);

      L.tileLayer(`https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=eRUWII73M4z5SSItDDnM`).addTo(initializedMap);

      L.marker(userLocation, { icon: userIcon }).addTo(initializedMap).bindPopup("คุณอยู่ตรงนี้").openPopup();
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

      // ย้ายคอนเทนเนอร์ของ Routing ไปยังตำแหน่งที่ต้องการ
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
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(searchQuery)}&key=6a71776ee7104c609b98e74f09a76cfc`
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
        <p>อัตราค่าโดยสาร: {distance * 5} บาท</p>
      </div>
      <div id="map" style={{ height: "70vh", marginBottom: "10px" }}></div>
      

      {distance && (
        <div style={{ padding: "10px" }}>
          <p>Distance to destination: {distance} km</p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
