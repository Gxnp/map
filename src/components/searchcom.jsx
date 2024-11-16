// Searchcom.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Searchcom = () => {
  const navigate = useNavigate();

  return (
    <div className="top-0 left-0 w-full bg-transparent z-10">
      <div className="flex items-center p-4 mx-auto">
        <div
          onClick={() => navigate('/searchoverlay')}
          className="w-[80] px-4 py-3 rounded-full border border-gray-300 shadow-sm placeholder-gray-400 text-gray-900 text-sm cursor-pointer text-center bg-white"
        >
          ค้นหาตำแหน่ง
        </div>
      </div>
    </div>
  );
};

export default Searchcom;
