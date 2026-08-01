import React, { useState, useRef, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative, Autoplay } from 'swiper/modules';
import { AnimatePresence, motion } from 'framer-motion';
import { ScrollText } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/effect-creative';
import { EmployeeCard } from '../components/EmployeeCard';
import { useData } from '../context/DataContext';

export const Leaderboard: React.FC = () => {
  const { users } = useData();
  
  // Sort employees by points
  const sortedEmployees = users
    .filter(u => u.role === 'employee')
    .sort((a, b) => b.points - a.points);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const activeEmp = sortedEmployees[activeIndex] || sortedEmployees[0];
  
  const swiperRef = useRef<any>(null);
  const touchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle pause on touch for 5 seconds
  const handleTouchStart = () => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.autoplay.stop();
    }
  };

  const handleTouchEnd = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      touchTimeoutRef.current = setTimeout(() => {
        if (swiperRef.current && swiperRef.current.swiper) {
          swiperRef.current.swiper.autoplay.start();
        }
      }, 5000);
    }
  };

  // Stop autoplay completely when modal opens
  const handleModalOpen = useCallback(() => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.autoplay.stop();
    }
  }, []);

  // Resume autoplay when modal closes
  const handleModalClose = useCallback(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.autoplay.start();
    }
  }, []);

  return (
    <div 
      className="w-full h-screen bg-white overflow-hidden flex flex-col justify-between items-center relative pb-10 font-alexandria overscroll-none touch-none" 
      dir="rtl"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
    >
      
      {/* Top Header - Only Ranking */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeEmp?.id + '-header'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full px-4 sm:px-8 pt-8 flex justify-end items-start z-10 font-bold text-gray-800 absolute top-0"
        >
          <div className="text-3xl sm:text-5xl font-extrabold tracking-tight" dir="rtl">
            الترتيب : {activeIndex + 1}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Center Image Swiper */}
      <div className="flex-1 w-full h-full flex items-center justify-center z-20 pt-16 pb-[33vh]">
        <Swiper
          ref={swiperRef}
          dir="ltr"
          effect={'creative'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={1}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          creativeEffect={{
            limitProgress: 2,
            prev: {
              translate: ['-100%', '50%', 0],
              opacity: 0,
              scale: 1
            },
            next: {
              translate: ['40%', '-20%', -200],
              opacity: 1,
              scale: 0.8
            },
          }}
          modules={[EffectCreative, Autoplay]}
          className="w-full h-[60vh] max-w-sm mx-auto overflow-visible"
        >
          {sortedEmployees.map((emp) => (
            <SwiperSlide key={emp.id} className="flex justify-center items-center">
              <div className="h-full flex justify-center items-center relative">
                <img 
                  src={emp.imageUrl} 
                  alt={emp.name}
                  className="h-[50vh] sm:h-[55vh] object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Bottom Blue Curved Card */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none flex flex-col justify-end h-[33vh]">
        <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-8 sm:h-12 text-blue-500 fill-current">
          <path d="M0,20 Q50,0 100,20 Z" />
        </svg>
        <div className="bg-blue-500 w-full flex-1 flex flex-col items-center justify-center text-white pointer-events-auto pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeEmp?.id + '-bottom'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center w-full px-6"
            >
              {/* Employee Name triggers the modal */}
              <EmployeeCard employee={activeEmp} onModalOpen={handleModalOpen} onModalClose={handleModalClose}>
                <button className="flex items-center gap-2 hover:scale-105 transition-transform group">
                  <h2 className="text-3xl sm:text-5xl font-bold mb-1">{activeEmp?.name}</h2>
                  <ScrollText size={28} className="opacity-80 group-hover:opacity-100" />
                </button>
              </EmployeeCard>
              
              <h3 className="text-lg sm:text-xl font-medium mb-3">{activeEmp?.branch}</h3>

              {/* Stats Row - Points left, Reviews right */}
              <div className="flex items-center justify-center gap-8 w-full mt-1">
                <div className="flex flex-col items-center">
                  <p className="text-blue-100 text-xs font-bold">النقاط</p>
                  <p className="text-2xl sm:text-3xl font-extrabold">{activeEmp?.points}</p>
                </div>
                <div className="w-px h-10 bg-blue-300/50"></div>
                <div className="flex flex-col items-center">
                  <p className="text-blue-100 text-xs font-bold">رصيد الشهر</p>
                  <p className="text-2xl sm:text-3xl font-extrabold">{activeEmp?.reviewsCount} <span className="text-base font-bold">تقييم</span></p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
