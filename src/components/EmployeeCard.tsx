import React from 'react';
import type { Employee } from '../types';

interface Props {
  employee: Employee;
  rank: number;
}

export const EmployeeCard: React.FC<Props> = ({ employee, rank }) => {
  return (
    <div className="w-full h-screen flex flex-col justify-between items-center bg-white relative overflow-hidden pb-10">
      {/* Top Header */}
      <div className="w-full px-6 pt-10 flex justify-between items-start z-10 font-bold text-gray-800">
        <div className="text-right leading-tight">
          <p>رصيد الشهر :</p>
          <p>{employee.reviewsCount} تقييم</p>
          <p>النقاط : {employee.points}</p>
        </div>
        <div className="text-4xl font-extrabold tracking-tight" dir="rtl">
          الترتيب : {rank}
        </div>
      </div>

      {/* Center Image */}
      <div className="flex-1 w-full flex items-center justify-center -mt-10 z-0">
        <img 
          src={employee.imageUrl} 
          alt={employee.name}
          className="h-[75vh] object-contain drop-shadow-xl"
        />
      </div>

      {/* Bottom Blue Curved Card */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-12 text-blue-500 fill-current">
          <path d="M0,20 Q50,0 100,20 Z" />
        </svg>
        <div className="bg-blue-500 w-full pt-2 pb-8 flex flex-col items-center justify-center text-white">
          <h2 className="text-4xl font-bold mb-2">{employee.name}</h2>
          <h3 className="text-2xl font-medium mb-4">{employee.branch}</h3>
          <button className="bg-white text-gray-800 px-6 py-2 rounded-lg font-bold text-lg shadow-md hover:bg-gray-100 transition-colors">
            تقييماتي {employee.reviewsCount}
          </button>
        </div>
      </div>
    </div>
  );
};
