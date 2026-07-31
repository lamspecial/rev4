import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { EmployeeCard } from '../components/EmployeeCard';
import type { Employee } from '../types';

// Dummy data for testing the UI
const dummyEmployees: Employee[] = [
  {
    id: '1',
    name: 'فاطمة الحارثي',
    branch: 'فرع المملكة',
    imageUrl: 'https://i.ibb.co/30B3cKp/demo-employee.png', // We'll need a real transparent image later
    points: 11,
    reviewsCount: 145,
    stats: { positive: 5, negative: 0, complaints: 0, safety: 0 }
  },
  {
    id: '2',
    name: 'سارة أحمد',
    branch: 'فرع العليا',
    imageUrl: 'https://i.ibb.co/30B3cKp/demo-employee.png',
    points: 10,
    reviewsCount: 120,
    stats: { positive: 4, negative: 0, complaints: 0, safety: 0 }
  },
  {
    id: '3',
    name: 'نورة الدوسري',
    branch: 'فرع التحلية',
    imageUrl: 'https://i.ibb.co/30B3cKp/demo-employee.png',
    points: 8.5,
    reviewsCount: 95,
    stats: { positive: 4.5, negative: 1, complaints: 0, safety: 1 }
  }
];

export const Leaderboard: React.FC = () => {
  const [employees] = useState<Employee[]>(dummyEmployees);

  return (
    <div className="w-full h-screen bg-gray-100 overflow-hidden" dir="rtl">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        className="h-full w-full max-w-md mx-auto shadow-2xl bg-white"
      >
        {employees.map((emp, index) => (
          <SwiperSlide key={emp.id}>
            <EmployeeCard employee={emp} rank={index + 1} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
