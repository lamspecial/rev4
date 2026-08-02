import React, { useState, useRef, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative, Autoplay } from 'swiper/modules';
import { AnimatePresence, motion } from 'framer-motion';
import { ScrollText, X } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/effect-creative';
import { EmployeeCard } from '../components/EmployeeCard';
import { useData } from '../context/DataContext';
import { formatDateTime } from '../lib/formatDate';

export const Leaderboard: React.FC = () => {
  const { users, reviews } = useData();
  const [showBranchModal, setShowBranchModal] = useState(false);
  
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
        <div className="bg-blue-500 w-full flex-1 flex flex-col items-center justify-center text-white pointer-events-auto pb-24 sm:pb-8">
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
              
              <button 
                onClick={() => { setShowBranchModal(true); handleModalOpen(); }}
                className="text-lg sm:text-xl font-medium mb-3 hover:underline bg-white/20 px-4 py-1 rounded-full"
              >
                {activeEmp?.branch}
              </button>

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

      {/* Calculate Branch Stats */}
      {(() => {
        const branchReviews = reviews.filter(r => r.branch === activeEmp?.branch);
        let shiningStar = { name: 'لا يوجد', count: 0 };
        let bestPartnership = { names: 'لا يوجد', count: 0 };

        if (branchReviews.length > 0 && showBranchModal) {
          const empCounts: Record<string, number> = {};
          const pairCounts: Record<string, number> = {};

          branchReviews.forEach(r => {
            r.linkedEmployeeIds.forEach(id => {
              empCounts[id] = (empCounts[id] || 0) + 1;
            });
            if (r.linkedEmployeeIds.length > 1) {
              for (let i = 0; i < r.linkedEmployeeIds.length; i++) {
                for (let j = i + 1; j < r.linkedEmployeeIds.length; j++) {
                  const pair = [r.linkedEmployeeIds[i], r.linkedEmployeeIds[j]].sort().join('|');
                  pairCounts[pair] = (pairCounts[pair] || 0) + 1;
                }
              }
            }
          });

          let maxEmpCount = 0;
          Object.entries(empCounts).forEach(([id, count]) => {
            if (count > maxEmpCount) {
              maxEmpCount = count;
              shiningStar = { name: users.find(u => u.id === id)?.name || 'غير معروف', count };
            }
          });

          let maxPairCount = 0;
          Object.entries(pairCounts).forEach(([pair, count]) => {
            if (count > maxPairCount) {
              maxPairCount = count;
              const [id1, id2] = pair.split('|');
              const name1 = users.find(u => u.id === id1)?.name || '';
              const name2 = users.find(u => u.id === id2)?.name || '';
              bestPartnership = { names: `${name1} و ${name2}`, count };
            }
          });
        }

        return (
          <AnimatePresence>
            {showBranchModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-alexandria touch-auto" dir="rtl">
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  onClick={() => { setShowBranchModal(false); handleModalClose(); }}
                />
                <motion.div 
                  initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
                  className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                >
                  <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
                    <h3 className="text-xl font-bold">تقييمات فرع {activeEmp?.branch}</h3>
                    <button 
                      onClick={() => { setShowBranchModal(false); handleModalClose(); }}
                      className="p-2 bg-blue-500/50 hover:bg-blue-500 rounded-full"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="bg-blue-50 p-4 border-b border-blue-100 grid grid-cols-3 gap-2 text-center shrink-0">
                    <div className="bg-white rounded-xl p-2 shadow-sm border border-blue-100 flex flex-col justify-center">
                      <p className="text-[10px] sm:text-xs text-blue-600 font-bold mb-1">تقييمات الشهر</p>
                      <p className="text-lg sm:text-xl font-extrabold">{branchReviews.length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-2 shadow-sm border border-yellow-100 flex flex-col justify-center">
                      <p className="text-[10px] sm:text-xs text-yellow-600 font-bold mb-1">المتألقة</p>
                      <p className="text-xs sm:text-sm font-bold truncate">{shiningStar.name}</p>
                      <p className="text-[9px] sm:text-[10px] text-gray-400 mt-1">{shiningStar.count} تقييم</p>
                    </div>
                    <div className="bg-white rounded-xl p-2 shadow-sm border border-green-100 flex flex-col justify-center">
                      <p className="text-[10px] sm:text-xs text-green-600 font-bold mb-1">شراكة فعالة</p>
                      <p className="text-[10px] sm:text-[11px] font-bold leading-tight">{bestPartnership.names}</p>
                      <p className="text-[9px] sm:text-[10px] text-gray-400 mt-1">{bestPartnership.count} مشترك</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 overflow-y-auto flex-1 space-y-3">
                    {branchReviews.map(r => (
                      <div key={r.id} className="bg-white p-4 rounded-xl border shadow-sm relative">
                        <div className="flex justify-between items-start">
                          <div className="flex text-yellow-400 mb-2">★★★★★</div>
                          <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded">
                            {formatDateTime(r.date, r.time)}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">"{r.comment}"</p>
                        <p className="text-xs text-green-700 font-bold mt-2">
                          {r.linkedEmployeeIds && r.linkedEmployeeIds.length > 0 
                            ? `الموظفات: ${r.linkedEmployeeIds.map(id => users.find(u => u.id === id)?.name).join('، ')}`
                            : 'غير مرتبط'}
                        </p>
                      </div>
                    ))}
                    {branchReviews.length === 0 && (
                      <p className="text-center text-gray-500 py-10">لا توجد تقييمات لهذا الفرع.</p>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        );
      })()}
    </div>
  );
};
