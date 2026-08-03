import React, { useState, useEffect } from 'react';
import type { UserAccount } from '../lib/mockData';
import { X, CalendarClock, Star, Clock, Award } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { formatDateTime } from '../lib/formatDate';

interface Props {
  employee: UserAccount;
  children: React.ReactNode;
  onModalOpen?: () => void;
  onModalClose?: () => void;
}

export const EmployeeCard: React.FC<Props> = ({ employee, children, onModalOpen, onModalClose }) => {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'reviews' | 'shifts' | 'points'>('points');
  const { reviews, users } = useData();
  const employeeReviews = reviews.filter(r => r.linkedEmployeeIds.includes(employee.id));

  let favoritePartnerName = '';
  if (employeeReviews.length > 0) {
    const partnerCounts: Record<string, number> = {};
    employeeReviews.forEach(r => {
      r.linkedEmployeeIds.forEach(id => {
        if (id !== employee.id) {
          partnerCounts[id] = (partnerCounts[id] || 0) + 1;
        }
      });
    });
    
    let maxPartnerId = '';
    let maxCount = 0;
    Object.entries(partnerCounts).forEach(([id, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxPartnerId = id;
      }
    });

    if (maxPartnerId) {
      favoritePartnerName = users.find(u => u.id === maxPartnerId)?.name || '';
    }
  }

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
                  <div className="flex items-center gap-4">
                    <img src={employee.imageUrl} alt={employee.name} className="w-16 h-16 rounded-full object-cover object-top border-2 border-white/50 shadow-md shrink-0 bg-blue-200" />
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold">{employee.name}</h3>
                      <p className="text-blue-100 text-sm mb-1">{employee.branch}</p>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        <p className="text-[10px] sm:text-xs bg-blue-500/50 px-2 py-1 rounded-md">النقاط: {employee.points.toFixed(2)}</p>
                        <p className="text-[10px] sm:text-xs bg-blue-500/50 px-2 py-1 rounded-md">إجمالي التقييمات: {employee.reviewsCount}</p>
                      </div>
                      {favoritePartnerName && (
                        <p className="text-[10px] sm:text-xs text-blue-100 mt-2 font-medium bg-blue-800/40 w-fit px-2 py-1 rounded-full">
                          شريكتي المفضلة: {favoritePartnerName}
                        </p>
                      )}
                    </div>
                  </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowModal(false); }}
                  className="p-2 bg-blue-500/50 hover:bg-blue-500 rounded-full transition-colors self-start shrink-0"
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
                <button 
                  onClick={() => setActiveTab('points')}
                  className={`flex-1 p-3 font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'points' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                >
                  <Award size={18} />
                  النقاط
                </button>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-6 bg-gray-50 h-[50vh] overflow-y-auto">
                {activeTab === 'reviews' ? (
                  <div className="space-y-3">
                    {employeeReviews.map(r => (
                      <div key={r.id} className="bg-white p-4 rounded-xl border shadow-sm relative">
                        <div className="flex justify-between items-start">
                          <div className="flex text-yellow-400 mb-2">★★★★★</div>
                          <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded">
                            {formatDateTime(r.date, r.time)}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">"{r.comment}"</p>
                        {employee.branch === 'موظفة خارجية' && (
                          <p className="text-xs text-blue-600 mt-2 font-bold">الفرع: {r.branch}</p>
                        )}
                      </div>
                    ))}
                    {employeeReviews.length === 0 && (
                      <p className="text-center text-gray-500 py-10">لا توجد تقييمات مكتسبة بعد.</p>
                    )}
                  </div>
                ) : activeTab === 'shifts' ? (
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
                ) : activeTab === 'points' ? (
                  <div className="space-y-4">
                    <div className="bg-blue-600 text-white p-5 rounded-2xl flex items-center justify-between shadow-lg">
                      <div className="flex items-center gap-3">
                        <Award size={28} className="text-yellow-300" />
                        <div>
                          <p className="font-bold text-xl">التقييم العام</p>
                          <p className="text-blue-100 text-sm">من إجمالي ١١ نقطة</p>
                        </div>
                      </div>
                      <p className="text-4xl font-extrabold">{employee.points?.toFixed(2)}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                      <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col justify-between">
                        <div>
                          <p className="text-gray-500 text-sm font-bold mb-1">نقاط التقييمات الإيجابية</p>
                          <p className="text-xs text-gray-400">من أصل ٥ نقاط</p>
                        </div>
                        <p className="text-2xl font-bold text-green-600 mt-2">{employee.stats?.positive?.toFixed(2) || '0.00'}</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col justify-between">
                        <div>
                          <p className="text-gray-500 text-sm font-bold mb-1">نقاط التقييمات السلبية</p>
                          <p className="text-xs text-gray-400">من أصل ٢ نقاط</p>
                        </div>
                        <p className="text-2xl font-bold text-red-500 mt-2">{employee.stats?.negative?.toFixed(2) || '0.00'}</p>
                      </div>

                      <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col justify-between sm:col-span-2">
                        <div>
                          <p className="text-gray-500 text-sm font-bold mb-1">نقاط الجودة (الشكاوى والسلامة)</p>
                          <p className="text-xs text-gray-400">من أصل ٤ نقاط</p>
                        </div>
                        <p className="text-2xl font-bold text-blue-600 mt-2">{((employee.stats?.complaints === 0 && employee.stats?.safety === 0) ? 4 : (4 - (employee.stats?.complaints || 0) - (employee.stats?.safety || 0))).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
              
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
