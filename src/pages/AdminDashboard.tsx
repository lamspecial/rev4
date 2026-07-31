import React, { useState } from 'react';
import { CalendarClock, AlertOctagon, ShieldAlert, Users } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'shifts' | 'complaints' | 'safety'>('shifts');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir="rtl">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">لوحة تحكم الإدارة</h1>
        <div className="flex space-x-2 space-x-reverse">
          <span className="bg-blue-800 px-3 py-1 rounded-full text-sm">فرع المملكة</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 max-w-5xl mx-auto w-full flex flex-col md:flex-row gap-6 mt-4">
        
        {/* Sidebar / Tabs */}
        <div className="w-full md:w-64 flex flex-col space-y-2 bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-fit">
          <button 
            onClick={() => setActiveTab('shifts')}
            className={`flex items-center space-x-3 space-x-reverse p-3 rounded-lg font-semibold transition-colors ${activeTab === 'shifts' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <CalendarClock size={20} />
            <span>إدارة الورديات</span>
          </button>
          <button 
            onClick={() => setActiveTab('complaints')}
            className={`flex items-center space-x-3 space-x-reverse p-3 rounded-lg font-semibold transition-colors ${activeTab === 'complaints' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <AlertOctagon size={20} />
            <span>تسجيل الشكاوى</span>
          </button>
          <button 
            onClick={() => setActiveTab('safety')}
            className={`flex items-center space-x-3 space-x-reverse p-3 rounded-lg font-semibold transition-colors ${activeTab === 'safety' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <ShieldAlert size={20} />
            <span>ملاحظات السلامة</span>
          </button>
          <hr className="my-2" />
          <button className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
            <Users size={20} />
            <span>الموظفات (إعدادات)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          {activeTab === 'shifts' && (
            <div>
              <h2 className="text-xl font-bold mb-4 border-b pb-2">جدول الورديات اليومي</h2>
              <p className="text-gray-500 mb-6">قم بتحديد أوقات عمل الموظفات لهذا اليوم لكي يتم ربط التقييمات تلقائياً بهن.</p>
              
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <select className="flex-1 p-2 border rounded-md">
                    <option>اختر الموظفة...</option>
                    <option>فاطمة الحارثي</option>
                    <option>سارة أحمد</option>
                  </select>
                  <input type="time" className="p-2 border rounded-md" aria-label="من الساعة" />
                  <input type="time" className="p-2 border rounded-md" aria-label="إلى الساعة" />
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-bold hover:bg-blue-700">إضافة وردية</button>
                </div>

                {/* Example of empty schedule as requested */}
                <div className="mt-8">
                  <h3 className="font-bold mb-2">ورديات اليوم (الأوقات الفارغة تظهر)</h3>
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-y">
                        <th className="p-3">الموظفة</th>
                        <th className="p-3">من</th>
                        <th className="p-3">إلى</th>
                        <th className="p-3">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-3">فاطمة الحارثي</td>
                        <td className="p-3">04:00 م</td>
                        <td className="p-3">12:00 ص</td>
                        <td className="p-3 text-green-600 font-bold">مغطاة</td>
                      </tr>
                      <tr className="border-b bg-red-50">
                        <td className="p-3 text-red-500 font-bold">-- لا يوجد موظفة --</td>
                        <td className="p-3 text-red-500">12:00 ص</td>
                        <td className="p-3 text-red-500">08:00 ص</td>
                        <td className="p-3 text-red-500 font-bold">فارغ</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'complaints' && (
            <div>
              <h2 className="text-xl font-bold mb-4 border-b pb-2">تسجيل الشكاوى اليدوية</h2>
              <p className="text-gray-500 mb-6">الشكوى تخصم من الرصيد الافتراضي بناءً على عدد أيام عمل الموظفة.</p>
              
              <div className="space-y-4">
                <select className="w-full p-2 border rounded-md">
                  <option>اختر الموظفة الموجهة لها الشكوى...</option>
                </select>
                <input type="number" placeholder="عدد أيام العمل في هذا الشهر" className="w-full p-2 border rounded-md" />
                <textarea placeholder="تفاصيل الشكوى (اختياري)" className="w-full p-2 border rounded-md h-24"></textarea>
                <button className="bg-red-600 text-white px-4 py-2 rounded-md font-bold hover:bg-red-700">تسجيل وإضافة الخصم</button>
              </div>
            </div>
          )}

          {activeTab === 'safety' && (
            <div>
              <h2 className="text-xl font-bold mb-4 border-b pb-2">ملاحظات السلامة</h2>
              <p className="text-gray-500 mb-6">كل ملاحظة سلامة تخصم نقطة كاملة من رصيد السلامة الافتراضي.</p>
              
              <div className="space-y-4">
                <select className="w-full p-2 border rounded-md">
                  <option>اختر الموظفة المخالفة للسلامة...</option>
                </select>
                <textarea placeholder="وصف ملاحظة السلامة" className="w-full p-2 border rounded-md h-24"></textarea>
                <input type="url" placeholder="رابط التقييم المتعلق بالسلامة (إن وجد)" className="w-full p-2 border rounded-md" />
                <button className="bg-orange-600 text-white px-4 py-2 rounded-md font-bold hover:bg-orange-700">تسجيل ملاحظة السلامة</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
