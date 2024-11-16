import React, { useState } from 'react';
const TravelCard = ({ travelData }) => {
    const [isVisible, setIsVisible] = useState(false);
  
    const toggleCard = () => setIsVisible(!isVisible);
  
    return (
      <div className="fixed inset-x-0 bottom-0 flex justify-center">
        <button
          onClick={toggleCard}
          className="mb-4 bg-orange-500 text-white py-2 px-6 rounded-lg shadow-lg"
        >
          {isVisible ? "ปิดการ์ด" : "เปิดการ์ด"}
        </button>
        {isVisible && travelData && (
          <div className="fixed inset-x-0 bottom-0 bg-orange-200 rounded-t-xl shadow-lg p-4">
            <div className="text-lg font-bold mb-2">ข้อมูลการเดินทาง</div>
            <p>ระยะทาง: {travelData.distance} กิโลเมตร</p>
            <p>เวลาเดินทาง: {travelData.travelTime} นาที</p>
            <p>ค่าโดยสาร: {travelData.fare} บาท</p>
          </div>
        )}
      </div>
    );
  };
  export default TravelCard;