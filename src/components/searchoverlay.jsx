import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

const SearchOverlay = () => {
  const navigate = useNavigate(); // สร้างตัว navigate สำหรับการย้อนกลับ
  const [searchQuery, setSearchQuery] = useState(''); // ค่าค้นหาจากผู้ใช้
  const [searchHistory, setSearchHistory] = useState(['']); // ประวัติการค้นหาตัวอย่าง

  // ฟังก์ชั่นสำหรับการอัปเดตประวัติการค้นหา
  const handleSearch = () => {
    if (searchQuery) {
      setSearchHistory([searchQuery, ...searchHistory]); // เพิ่มคำค้นหาล่าสุดไปที่ประวัติ
      setSearchQuery(''); // เคลียร์ช่องค้นหาหลังจากค้นหา

      // ส่งข้อมูลการค้นหาผ่าน navigate ไปยังหน้า MapComponent
      navigate(`/mapcomponent?searchQuery=${searchQuery}`);
    }
  };

  return (
    <div className="relative h-screen bg-white">
      {/* ปุ่มย้อนกลับเป็นลูกศร */}
      <button
        onClick={() => navigate(-1)} // ย้อนกลับไปหน้าก่อนหน้า
        className="absolute left-2 top-2 p-2 bg-orange-500 text-white rounded-full flex items-center justify-center"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>

      {/* แสดงตำแหน่งของผู้ใช้งาน */}
      <div className="static flex flex-col justify-between items-end p-2">
        <p className="sticky top-0 text-lg font-semibold">ตำแหน่งของผู้ใช้งานนะจ้ะ</p>
        <button className="text-orange-500 underline text-xs">
          เปลี่ยนตำแหน่ง
        </button>
      </div>

      {/* ช่องค้นหาสถานที่ */}
      <div className="px-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // ควบคุมการกรอกข้อมูลในช่องค้นหา
          className="w-full p-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="ค้นหาสถานที่..."
        />
        <button
          onClick={handleSearch}
          className="mt-2 w-full px-4 py-2 bg-orange-500 text-white rounded-full"
        >
          ค้นหา
        </button>
      </div>

      {/* ประวัติการค้นหา */}
      <div className="mt-4 px-4">
        <h2 className="text-xl font-semibold">ประวัติการค้นหา</h2>
        <ul className="mt-2">
          {searchHistory.map((item, index) => (
            <li key={index} className="text-lg text-gray-700">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchOverlay;
