import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { LogOut, Star, Award, ShieldAlert, AlertTriangle, CalendarClock, ChevronDown, ChevronUp } from 'lucide-react';

export const EmployeeDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { addTimelineEvent } = useData();
  const [showReviews, setShowReviews] = useState(false);
  const [showShifts, setShowShifts] = useState(false);

  if (!user) return null;

  return (
    <div className="w-full min-h-screen bg-gray-50 font-alexandria" dir="rtl">
      {/* Header */}
      <div className="bg-white pt-6 px-6 shadow-sm rounded-b-3xl mb-6 relative overflow-hidden flex flex-col items-center border-b">
        <div className="flex justify-between items-center w-full z-10 mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-1 text-gray-800">أهلاً، {user.name}</h1>
            <p className="text-blue-600 font-bold">{user.branch}</p>
          </div>
          <button 
            onClick={logout}
            className="p-3 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
          >
            <LogOut size={24} />
          </button>
        </div>
        
        {/* Employee Image */}
        <div className="relative w-full flex justify-center mt-2 flex-1">
          <img 
            src={user.imageUrl} 
            alt={user.name}
            className="h-64 object-contain align-bottom"
            style={{ display: 'block' }}
          />
        </div>
      </div>

      {/* Main Stats */}
      <div className="px-6 mb-8">
        <div className="bg-white rounded-3xl p-8 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-gray-500 font-bold mb-1">النقاط الكلية</p>
            <h2 className="text-5xl font-extrabold text-gray-800">{user.points}</h2>
          </div>
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
            <Award size={40} />
          </div>
        </div>
      </div>

      {/* Detailed Stats Grid */}
      <div className="px-6 grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-lg border-t-4 border-yellow-400">
          <div className="flex items-center gap-2 text-gray-700 mb-2 font-bold">
            <Star className="text-yellow-400" size={20} />
            التقييمات
          </div>
          <p className="text-3xl font-extrabold">{user.reviewsCount}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg border-t-4 border-green-500">
          <div className="flex items-center gap-2 text-gray-700 mb-2 font-bold">
            <Star className="text-green-500" size={20} />
            إيجابي
          </div>
          <p className="text-3xl font-extrabold">+{user.stats.positive}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg border-t-4 border-red-500">
          <div className="flex items-center gap-2 text-gray-700 mb-2 font-bold">
            <AlertTriangle className="text-red-500" size={20} />
            شكاوى
          </div>
          <p className="text-3xl font-extrabold">-{user.stats.complaints}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg border-t-4 border-orange-500">
          <div className="flex items-center gap-2 text-gray-700 mb-2 font-bold">
            <ShieldAlert className="text-orange-500" size={20} />
            مخالفات سلامة
          </div>
          <p className="text-3xl font-extrabold">-{user.stats.safety}</p>
        </div>
      </div>

      {/* Reviews Log Section */}
      <div className="px-6 mb-4">
        <button 
          onClick={() => setShowReviews(!showReviews)}
          className="w-full bg-white rounded-2xl p-5 shadow-lg flex justify-between items-center"
        >
          <div className="flex items-center gap-3">
            <Star className="text-yellow-400" size={22} />
            <span className="font-bold text-gray-800 text-lg">سجل التقييمات</span>
          </div>
          {showReviews ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
        </button>
        
        {showReviews && (
          <div className="bg-white rounded-b-2xl border-t px-5 pb-5 shadow-lg -mt-2 space-y-3 pt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500 font-bold">إجمالي التقييمات المرتبطة</p>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">{user.reviewsCount}</span>
            </div>

            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <div className="flex text-yellow-400 mb-2 text-sm">★★★★★</div>
              <p className="text-gray-700 text-sm">"خدمة ممتازة وسريعة، شكراً لك على حسن التعامل"</p>
              <p className="text-xs text-gray-400 mt-2">(اكتسبته مع فاطمة ورغد)</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <div className="flex text-yellow-400 mb-2 text-sm">★★★★☆</div>
              <p className="text-gray-700 text-sm">"تجربة رائعة وتجاوب سريع."</p>
            </div>
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <div className="flex text-yellow-400 mb-2 text-sm">★★☆☆☆</div>
              <p className="text-gray-700 text-sm">"الخدمة كانت بطيئة والموظفة لم تساعدني"</p>
              <p className="text-xs text-red-400 mt-2 font-bold">تقييم سلبي</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="text-orange-500" size={16} />
                <span className="text-orange-700 font-bold text-sm">شكوى عميل</span>
              </div>
              <p className="text-gray-700 text-sm">"شكوى بخصوص تأخر الخدمة"</p>
              <p className="text-xs text-orange-400 mt-2">مسجلة بواسطة الإدارة</p>
            </div>
          </div>
        )}
      </div>

      {/* Shifts Log Section */}
      <div className="px-6 mb-8">
        <button 
          onClick={() => setShowShifts(!showShifts)}
          className="w-full bg-white rounded-2xl p-5 shadow-lg flex justify-between items-center"
        >
          <div className="flex items-center gap-3">
            <CalendarClock className="text-blue-500" size={22} />
            <span className="font-bold text-gray-800 text-lg">سجل الشفتات</span>
          </div>
          {showShifts ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
        </button>
        
        {showShifts && (
          <div className="bg-white rounded-b-2xl border-t px-5 pb-5 shadow-lg -mt-2 space-y-3 pt-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col relative">
              <div className="absolute left-4 top-4 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">8 ساعات عمل</div>
              <p className="font-bold text-gray-800">الثلاثاء ٤ مايو اكتسبت ٦ تقييمات</p>
              <p className="text-xs text-gray-400 mt-1">(مع رغد واسماء)</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col relative">
              <div className="absolute left-4 top-4 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">8 ساعات عمل</div>
              <p className="font-bold text-gray-800">الخميس ٦ مايو اكتسبت ٣ تقييمات</p>
              <p className="text-xs text-gray-400 mt-1">(مع فاطمة فقط)</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col relative">
              <div className="absolute left-4 top-4 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">6 ساعات عمل</div>
              <p className="font-bold text-gray-800">السبت ٨ مايو اكتسبت ٤ تقييمات</p>
              <p className="text-xs text-gray-400 mt-1">(مع ياسمين ونورة)</p>
            </div>
          </div>
        )}
      </div>

      {/* Shift Information & Objection */}
      <div className="px-6 mb-8">
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-50">
          <h3 className="font-bold text-xl mb-4 text-gray-800">شفت اليوم</h3>
          
          <div className="bg-blue-50 p-4 rounded-xl flex justify-between items-center mb-4">
            <div>
              <p className="text-blue-800 font-bold text-lg">من 16:00 إلى 00:00</p>
              <p className="text-blue-600 text-sm">تم تسجيل حضورك في هذا الشفت.</p>
            </div>
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm">
              نشط
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-gray-500 text-sm mb-3">هل نسيت مديرة الفرع تسجيل الشفت الخاص بك؟</p>
            <button 
              onClick={() => {
                addTimelineEvent({
                  branch: user.branch,
                  type: 'gap',
                  title: `اعتراض شفت مفقود - ${user.name}`,
                  time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
                  comment: 'الموظفة تطالب بتسجيل الشفت الخاص بها ولم تقم المديرة بذلك.'
                });
                alert('تم إرسال الاعتراض إلى الإدارة.');
              }}
              className="w-full bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 py-3 rounded-xl font-bold transition-all"
            >
              تقديم اعتراض على شفت مفقود
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
