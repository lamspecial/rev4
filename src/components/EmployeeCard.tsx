import React, { useState, useEffect } from 'react';
import type { UserAccount } from '../lib/mockData';
import { X, CalendarClock, Star, Clock } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  employee: UserAccount;
  children: React.ReactNode;
  onModalOpen?: () => void;
  onModalClose?: () => void;
}

export const EmployeeCard: React.FC<Props> = ({ employee, children, onModalOpen, onModalClose }) => {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'reviews' | 'shifts'>('reviews');

  useEffect(() => {
    if (showModal) {
      onModalOpen?.();
    } else {
      onModalClose?.();
    }
  }, [showModal]);

  const totalHours = 22; // Mock: sum of shift hours

  return (
    <>
      <div onClick={() => setShowModal(true)}>
        {children}
      </div>

      <AnimatePresence>
        {showModal && (
          <div 
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 font-alexandria touch-auto"
            dir="rtl"
          >
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            
            {/* Modal */}
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full sm:w-auto min-w-[320px] sm:min-w-[400px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-blue-600 p-4 sm:p-6 text-white flex justify-between items-center sticky top-0 z-10">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold">{employee.name}</h3>
                  <p className="text-blue-100 text-sm mb-1">{employee.branch}</p>
                  <p className="text-xs bg-blue-500/50 inline-block px-2 py-1 rounded-md mt-1">إجمالي التقييمات: {employee.reviewsCount}</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowModal(false); }}
                  className="p-2 bg-blue-500/50 hover:bg-blue-500 rounded-full transition-colors self-start"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b">
                <button 
                  onClick={() => setActiveTab('reviews')}
                  className={`flex-1 p-3 font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'reviews' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                >
                  <Star size={18} />
                  سجل التقييمات
                </button>
                <button 
                  onClick={() => setActiveTab('shifts')}
                  className={`flex-1 p-3 font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'shifts' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                >
                  <CalendarClock size={18} />
                  سجل الشفتات
                </button>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-6 bg-gray-50 h-[50vh] overflow-y-auto">
                {activeTab === 'reviews' ? (
                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded-xl border shadow-sm">
                      <div className="flex text-yellow-400 mb-2">★★★★★</div>
                      <p className="text-gray-700 text-sm">"خدمة ممتازة وسريعة، شكراً لك على حسن التعامل"</p>
                      {employee.branch === 'موظفة خارجية' && (
                        <p className="text-xs text-blue-600 mt-2 font-bold">الفرع: جاليري</p>
                      )}
                    </div>
                    <div className="bg-white p-4 rounded-xl border shadow-sm">
                      <div className="flex text-yellow-400 mb-2">★★★★☆</div>
                      <p className="text-gray-700 text-sm">"تجربة رائعة وتجاوب سريع."</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border shadow-sm">
                      <div className="flex text-yellow-400 mb-2">★★★★★</div>
                      <p className="text-gray-700 text-sm">"من أفضل الموظفات، أنصح بالتعامل معها."</p>
                      <p className="text-xs text-gray-500 mt-2 font-medium">(اكتسبته مع فاطمة ورغد)</p>
                      {employee.branch === 'موظفة خارجية' && (
                        <p className="text-xs text-blue-600 mt-1 font-bold">الفرع: سلام</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Total Hours Badge */}
                    <div className="bg-blue-600 text-white p-4 rounded-xl flex items-center justify-between shadow-md mb-4">
                      <div className="flex items-center gap-3">
                        <Clock size={24} />
                        <div>
                          <p className="font-bold text-lg">إجمالي ساعات العمل</p>
                          <p className="text-blue-100 text-sm">في صناعة تجربة العملاء</p>
                        </div>
                      </div>
                      <p className="text-3xl font-extrabold">{totalHours}</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col relative">
                      <div className="absolute left-4 top-4 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">8 ساعات عمل</div>
                      <p className="font-bold text-gray-800">الثلاثاء ٤ مايو اكتسبت ٦ تقييمات</p>
                      <p className="text-xs text-gray-400 mt-1">(مع رغد واسماء)</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col relative">
                      <div className="absolute left-4 top-4 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">8 ساعات عمل</div>
                      <p className="font-bold text-gray-800">الخميس ٦ مايو اكتسبت ٣ تقييمات</p>
                      <p className="text-xs text-gray-400 mt-1">(مع فاطمة فقط)</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col relative">
                      <div className="absolute left-4 top-4 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">6 ساعات عمل</div>
                      <p className="font-bold text-gray-800">السبت ٨ مايو اكتسبت ٤ تقييمات</p>
                      <p className="text-xs text-gray-400 mt-1">(مع ياسمين ونورة)</p>
                    </div>
                  </div>
                )}
              </div>
              
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
