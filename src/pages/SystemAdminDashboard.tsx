import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { AlertOctagon, Users, LogOut, Building2, Activity, CalendarClock, MessageSquareWarning, Upload, ShieldAlert, PlusCircle, CheckCircle2, BarChart3, Trash2 } from 'lucide-react';
import employeeImg from '../assets/employee.png';
import { formatDateTime } from '../lib/formatDate';

export const SystemAdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const { users, updateUser, branchSettings, updateBranchSettings, timeline, addTimelineEvent, updateTimelineEvent, deleteTimelineEvent, reviews, injectReviews, updateReview, deleteReview } = useData();
  const [activeTab, setActiveTab] = useState<'timeline' | 'branches' | 'employees' | 'notes' | 'stats'>('timeline');

  const branches = ['جاليري', 'ذافيو', 'سلام', 'القصر', 'المملكة', 'شرق'];
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const [selectedTimelineBranch, setSelectedTimelineBranch] = useState(branches[0]);
  
  const branchEmployees = users.filter(u => (selectedBranch === 'موظفة خارجية' ? u.branch === 'موظفة خارجية' : u.branch === selectedBranch) && u.role === 'employee');
  const filteredTimeline = timeline.filter(t => t.branch === selectedTimelineBranch);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingEmpId, setUploadingEmpId] = useState<string | null>(null);

  const [reviewsText, setReviewsText] = useState('');
  const [viewingReviewsMonth, setViewingReviewsMonth] = useState('');
  const [linkingReviewId, setLinkingReviewId] = useState<string | null>(null);
  const [linkingSelection, setLinkingSelection] = useState<string[]>([]);
  const allAvailableEmployees = users.filter(u => (u.branch === selectedTimelineBranch || u.branch === 'موظفة خارجية') && u.role === 'employee');

  const handleInjectReviews = () => {
    if (!reviewsText.trim()) return;
    injectReviews(selectedBranch, reviewsText);
    showToast('تم استيراد وحقن التقييمات بنجاح');
    setReviewsText('');
  };
  
  const handleSaveLinking = (timelineId: string, reviewId: string | undefined) => {
    const selectedEmps = allAvailableEmployees.filter(u => linkingSelection.includes(u.id)).map(e => ({ id: e.id, name: e.name }));
    updateTimelineEvent(timelineId, { employees: selectedEmps });
    if (reviewId) {
      updateReview(reviewId, { linkedEmployeeIds: linkingSelection });
    }
    setLinkingReviewId(null);
    setLinkingSelection([]);
  };

  const handleDeleteTimelineEvent = (id: string, reviewId?: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    if (reviewId) {
      deleteReview(reviewId);
    } else {
      deleteTimelineEvent(id);
    }
    showToast('تم الحذف بنجاح');
  };

  // Toast notification
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // Notes form state
  const [complaintBranch, setComplaintBranch] = useState('');
  const [complaintEmployee, setComplaintEmployee] = useState('');
  const [complaintText, setComplaintText] = useState('');
  const [safetyBranch, setSafetyBranch] = useState('');
  const [safetyEmployee, setSafetyEmployee] = useState('');
  const [safetyText, setSafetyText] = useState('');

  // Add employee form
  const [newEmpName, setNewEmpName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleUpdateStats = (id: string, type: 'positive' | 'negative', val: number) => {
    const emp = users.find(u => u.id === id);
    if (!emp) return;
    updateUser(id, { 
      stats: { ...emp.stats, [type]: val },
      reviewsCount: emp.stats.positive + emp.stats.negative + emp.stats.complaints + (type === 'positive' ? val - emp.stats.positive : val - emp.stats.negative)
    });
    showToast('تم تحديث الإحصائيات');
  };

  const handleTransfer = (id: string, newBranch: string) => {
    updateUser(id, { branch: newBranch });
    showToast('تم نقل الموظفة بنجاح');
  };

  const handleSaveTimes = () => {
    const start = (document.getElementById(`start-${selectedBranch}`) as HTMLInputElement).value;
    const end = (document.getElementById(`end-${selectedBranch}`) as HTMLInputElement).value;
    const googleApi = (document.getElementById(`api-${selectedBranch}`) as HTMLInputElement).value;
    updateBranchSettings(selectedBranch, start, end, googleApi);
    showToast('تم حفظ إعدادات الفرع');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadingEmpId) {
      showToast('جاري معالجة الصورة...'); // Show immediate feedback
      
      // Use createObjectURL for instant, non-blocking image load
      const imageUrl = URL.createObjectURL(file);
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Maintain high resolution but cap at 1200px to prevent freeze & localStorage quota issues
        const MAX_DIMENSION = 1200;
        if (width > height && width > MAX_DIMENSION) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else if (height > MAX_DIMENSION) {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to WebP format with high quality (0.95) to preserve visual quality
        // but significantly reduce base64 size so it doesn't freeze the app
        try {
          const webpDataUrl = canvas.toDataURL('image/webp', 0.95);
          updateUser(uploadingEmpId, { imageUrl: webpDataUrl });
          setUploadingEmpId(null);
          showToast('تم رفع الصورة بنجاح');
        } catch (err) {
          console.error('Error saving image:', err);
          alert('تعذر حفظ الصورة، قد تكون الذاكرة ممتلئة. يرجى تجربة صورة أصغر.');
          setUploadingEmpId(null);
        } finally {
          URL.revokeObjectURL(imageUrl); // Free memory
        }
      };
      
      img.src = imageUrl;
    }
  };

  const triggerUpload = (id: string) => {
    setUploadingEmpId(id);
    fileInputRef.current?.click();
  };

  const handleAddEmployee = () => {
    if (!newEmpName.trim()) return;
    const id = 'emp_' + Date.now();
    const branch = selectedBranch === 'موظفة خارجية' ? 'موظفة خارجية' : selectedBranch;
    const newUser = {
      id, name: newEmpName, branch, email: '', role: 'employee' as const, imageUrl: employeeImg, points: 0, reviewsCount: 0,
      stats: { positive: 0, negative: 0, complaints: 0, safety: 0 }
    };
    // Save to localStorage directly
    const savedUsers = JSON.parse(localStorage.getItem('app_users') || '[]');
    savedUsers.push(newUser);
    localStorage.setItem('app_users', JSON.stringify(savedUsers));
    window.location.reload();
  };

  const handleRemoveEmployee = (id: string) => {
    if (!confirm('هل أنت متأكد من إزالة هذه الموظفة؟')) return;
    const savedUsers = JSON.parse(localStorage.getItem('app_users') || '[]');
    const filtered = savedUsers.filter((u: any) => u.id !== id);
    localStorage.setItem('app_users', JSON.stringify(filtered));
    window.location.reload();
  };

  const handleSubmitComplaint = () => {
    if (!complaintBranch || !complaintEmployee || !complaintText) {
      showToast('يرجى ملء جميع الحقول');
      return;
    }
    const emp = users.find(u => u.name === complaintEmployee);
    if (emp) {
      updateUser(emp.id, { stats: { ...emp.stats, complaints: emp.stats.complaints + 1 } });
    }
    addTimelineEvent({
      branch: complaintBranch,
      type: 'gap',
      title: `شكوى عميل - ${complaintEmployee}`,
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      comment: complaintText,
    });
    setComplaintBranch(''); setComplaintEmployee(''); setComplaintText('');
    showToast('تم تسجيل الشكوى بنجاح');
  };

  const handleSubmitSafety = () => {
    if (!safetyBranch || !safetyEmployee || !safetyText) {
      showToast('يرجى ملء جميع الحقول');
      return;
    }
    const emp = users.find(u => u.name === safetyEmployee);
    if (emp) {
      updateUser(emp.id, { stats: { ...emp.stats, safety: emp.stats.safety + 1 } });
    }
    addTimelineEvent({
      branch: safetyBranch,
      type: 'gap',
      title: `مخالفة سلامة - ${safetyEmployee}`,
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      comment: safetyText,
    });
    setSafetyBranch(''); setSafetyEmployee(''); setSafetyText('');
    showToast('تم تسجيل مخالفة السلامة');
  };

  const employeesForBranch = (branch: string) => users.filter(u => u.branch === branch && u.role === 'employee');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-alexandria pb-20" dir="rtl">
      {/* Hidden File Input */}
      <input type="file" ref={fileInputRef} className="hidden" accept="image/png,image/jpeg,image/webp,image/*" onChange={handleFileUpload} />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in font-bold text-sm">
          <CheckCircle2 size={20} />
          {toast}
        </div>
      )}

      {/* Header */}
      <header className="bg-gray-800 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">لوحة الإدارة العامة</h1>
        <button onClick={logout} className="p-2 hover:bg-gray-700 rounded-full flex items-center gap-2">
          تسجيل الخروج
          <LogOut size={20} />
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 max-w-7xl mx-auto w-full">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-x-auto min-h-[75vh]">
          
          {activeTab === 'timeline' && (
            <div>
              <h2 className="text-xl font-bold mb-4 border-b pb-2">الخط الزمني لشفتات الفروع</h2>
              
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {branches.map(b => (
                  <button 
                    key={b} 
                    onClick={() => setSelectedTimelineBranch(b)}
                    className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap ${selectedTimelineBranch === b ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    فرع {b}
                  </button>
                ))}
              </div>

              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent mt-8">
                {filteredTimeline.map((item) => (
                  <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${item.type === 'gap' ? 'bg-red-500' : item.type === 'review' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                      {item.type === 'gap' ? <AlertOctagon size={16} className="text-white" /> : item.type === 'review' ? <span className="text-white text-xs font-bold">★</span> : <CalendarClock size={16} className="text-white" />}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-bold ${item.type === 'gap' ? 'text-red-600' : item.type === 'review' ? 'text-yellow-600' : 'text-green-600'}`}>{item.title}</h4>
                        <div className="flex items-center gap-2">
                          <time className="text-xs font-medium text-gray-500">{item.date ? formatDateTime(item.date, item.time) : item.time}</time>
                          <button onClick={() => handleDeleteTimelineEvent(item.id, item.reviewId)} className="text-red-400 hover:text-red-600"><Trash2 size={14}/></button>
                        </div>
                      </div>
                      
                      {item.type !== 'review' && item.comment && (
                        <div className="mt-3 border-t pt-3">
                          <p className="text-sm bg-gray-50 p-2 rounded text-gray-700 italic border-r-2 border-red-500 mb-3">
                            {item.title.includes('اعتراض') ? 'الاعتراض: ' : item.title.includes('شكوى') ? 'الشكوى: ' : 'تعليق: '} {item.comment}
                          </p>
                          {item.title.includes('اعتراض') && (
                            <button className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 font-bold" onClick={() => { showToast('تمت الموافقة وتحديث بيانات الشفت'); }}>معالجة وقبول الاعتراض</button>
                          )}
                        </div>
                      )}

                      {item.type === 'review' && (
                        <div className="mt-3 border-t pt-3">
                          {item.comment && <p className="text-sm bg-gray-50 p-2 rounded text-gray-700 italic border-r-2 border-yellow-500 mb-2">"{item.comment}"</p>}
                          
                          {linkingReviewId === item.id ? (
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-2">
                              <p className="text-sm font-bold mb-2">تحديد الموظفات المرتبطات بهذا التقييم:</p>
                              <div className="grid grid-cols-2 gap-2 mb-3 max-h-32 overflow-y-auto">
                                {allAvailableEmployees.map(emp => (
                                  <label key={emp.id} className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      checked={linkingSelection.includes(emp.id)}
                                      onChange={(e) => {
                                        if (e.target.checked) setLinkingSelection(prev => [...prev, emp.id]);
                                        else setLinkingSelection(prev => prev.filter(id => id !== emp.id));
                                      }}
                                    />
                                    {emp.name}
                                  </label>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => handleSaveLinking(item.id, item.reviewId)} className="bg-green-600 text-white text-xs px-3 py-1 rounded font-bold">حفظ الربط</button>
                                <button onClick={() => setLinkingReviewId(null)} className="bg-gray-400 text-white text-xs px-3 py-1 rounded">إلغاء</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between mt-2">
                              <div className="text-sm">
                                {item.employees && item.employees.length > 0 ? (
                                  <span className="text-green-600 font-bold">الموظفات: {item.employees.map(e => e.name).join('، ')}</span>
                                ) : (
                                  <span className="text-red-500 font-bold">التقييم غير مرتبط بأي موظفة!</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => { 
                                    setLinkingReviewId(item.id); 
                                    setLinkingSelection(item.employees ? item.employees.map(e => e.id) : []); 
                                  }}
                                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold hover:bg-blue-200"
                                >
                                  تعديل الربط
                                </button>
                                <button 
                                  onClick={() => handleDeleteTimelineEvent(item.id, item.reviewId)}
                                  className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-bold hover:bg-red-200 flex items-center gap-1"
                                >
                                  <Trash2 size={12} /> حذف التقييم
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {filteredTimeline.length === 0 && <p className="text-center text-gray-500 py-10">لا يوجد أحداث في الخط الزمني بعد.</p>}
              </div>
            </div>
          )}

          {activeTab === 'branches' && (
            <div>
              <h2 className="text-xl font-bold mb-4 border-b pb-2">إدارة الفروع</h2>
              
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {branches.map(b => (
                  <button key={b} onClick={() => setSelectedBranch(b)}
                    className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap ${selectedBranch === b ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >فرع {b}</button>
                ))}
              </div>

              <div className="mb-8 p-4 bg-gray-50 rounded-lg border max-w-2xl">
                <h3 className="font-bold text-gray-700 mb-4">إعدادات فرع ({selectedBranch})</h3>
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-700 mb-1">وقت البدء</label>
                    <input id={`start-${selectedBranch}`} type="time" defaultValue={branchSettings[selectedBranch]?.start || '16:00'} className="w-full p-2 border rounded" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-700 mb-1">وقت الانتهاء</label>
                    <input id={`end-${selectedBranch}`} type="time" defaultValue={branchSettings[selectedBranch]?.end || '00:00'} className="w-full p-2 border rounded" />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-1">رابط Google API</label>
                  <input id={`api-${selectedBranch}`} type="text" placeholder="https://..." defaultValue={branchSettings[selectedBranch]?.googleApi || ''} className="w-full p-2 border rounded text-left" dir="ltr" />
                </div>
                <button onClick={handleSaveTimes} className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700">حفظ الإعدادات</button>
              </div>
            </div>
          )}

          {activeTab === 'employees' && (
            <div>
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-xl font-bold">إدارة الموظفات</h2>
                <button onClick={() => setShowAddForm(!showAddForm)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-bold flex gap-2 items-center">
                  <PlusCircle size={16} /> إضافة موظفة
                </button>
              </div>

              {showAddForm && (
                <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                  <h4 className="font-bold text-green-800 mb-3">إضافة موظفة جديدة إلى ({selectedBranch === 'موظفة خارجية' ? 'المصدر الخارجي' : `فرع ${selectedBranch}`})</h4>
                  <div className="flex gap-3">
                    <input type="text" placeholder="اسم الموظفة..." value={newEmpName} onChange={e => setNewEmpName(e.target.value)} className="flex-1 p-2 border rounded-lg" />
                    <button onClick={handleAddEmployee} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700">إضافة</button>
                  </div>
                </div>
              )}

              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {branches.map(b => (
                  <button key={b} onClick={() => setSelectedBranch(b)}
                    className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap ${selectedBranch === b ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >فرع {b}</button>
                ))}
                <button onClick={() => setSelectedBranch('موظفة خارجية')}
                  className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap ${selectedBranch === 'موظفة خارجية' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
                >موظفات خارجيات</button>
              </div>

              <h3 className="font-bold text-lg mb-4 text-gray-800">
                {selectedBranch === 'موظفة خارجية' ? 'الموظفات الخارجيات' : `موظفات فرع ${selectedBranch}`} ({branchEmployees.length})
              </h3>

              {selectedBranch === 'موظفة خارجية' && (
                <p className="text-sm text-purple-600 mb-4 bg-purple-50 p-3 rounded-lg border border-purple-100">
                  الموظفات الخارجيات يمكن أن يعملن في أي فرع ويجمعن تقييمات من عدة فروع.
                </p>
              )}
              
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 border">الصورة</th>
                      <th className="p-3 border">الموظفة</th>
                      <th className="p-3 border">الفرع (نقل)</th>
                      <th className="p-3 border">إيجابي</th>
                      <th className="p-3 border">سلبي</th>
                      <th className="p-3 border">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branchEmployees.map(emp => (
                      <tr key={emp.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 border text-center w-20 relative group cursor-pointer" onClick={() => triggerUpload(emp.id)}>
                          <div className="w-12 h-12 mx-auto rounded-full overflow-hidden border-2 border-gray-200 bg-gray-50 flex items-center justify-center relative">
                            <img src={emp.imageUrl || employeeImg} alt={emp.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                              <Upload className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
                            </div>
                          </div>
                        </td>
                        <td className="p-3 border">
                          <input type="text" defaultValue={emp.name} onBlur={(e) => { updateUser(emp.id, { name: e.target.value }); showToast('تم تحديث الاسم'); }}
                            className="w-full p-1 border rounded bg-transparent focus:bg-white font-bold" />
                        </td>
                        <td className="p-3 border">
                          <select value={emp.branch} onChange={(e) => handleTransfer(emp.id, e.target.value)}
                            className="w-full p-1 border rounded bg-transparent focus:bg-white text-sm">
                            {branches.map(b => <option key={b} value={b}>{b}</option>)}
                            <option value="موظفة خارجية">خارجية</option>
                          </select>
                        </td>
                        <td className="p-3 border w-24">
                          <input type="number" defaultValue={emp.stats.positive}
                            onBlur={(e) => handleUpdateStats(emp.id, 'positive', parseInt(e.target.value) || 0)}
                            className="w-full p-1 border rounded text-center focus:bg-white text-green-600 font-bold" />
                        </td>
                        <td className="p-3 border w-24">
                          <input type="number" defaultValue={emp.stats.negative}
                            onBlur={(e) => handleUpdateStats(emp.id, 'negative', parseInt(e.target.value) || 0)}
                            className="w-full p-1 border rounded text-center focus:bg-white text-red-600 font-bold" />
                        </td>
                        <td className="p-3 border text-center w-24">
                          <button onClick={() => handleRemoveEmployee(emp.id)} className="text-sm text-red-600 hover:underline font-bold">إزالة</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div>
              <div className="flex items-center gap-3 mb-6 border-b pb-4">
                <MessageSquareWarning className="text-gray-800" size={28} />
                <h2 className="text-2xl font-bold text-gray-800">إدارة الملاحظات</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Complaints Form */}
                <div className="bg-red-50 p-6 rounded-xl border border-red-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertOctagon className="text-red-500" />
                    <h3 className="font-bold text-red-700 text-lg">تسجيل شكوى عميل</h3>
                  </div>
                  <div className="space-y-3">
                    <select value={complaintBranch} onChange={e => setComplaintBranch(e.target.value)} className="w-full p-2 border rounded-lg bg-white">
                      <option value="">اختر الفرع...</option>
                      {branches.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <select value={complaintEmployee} onChange={e => setComplaintEmployee(e.target.value)} className="w-full p-2 border rounded-lg bg-white">
                      <option value="">الموظفة...</option>
                      {complaintBranch && employeesForBranch(complaintBranch).map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
                    </select>
                    <textarea placeholder="تفاصيل الشكوى..." value={complaintText} onChange={e => setComplaintText(e.target.value)} className="w-full p-2 border rounded-lg bg-white h-24"></textarea>
                    <button onClick={handleSubmitComplaint} className="w-full bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700">اعتماد الشكوى وخصم النقاط</button>
                  </div>
                </div>

                {/* Safety Form */}
                <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldAlert className="text-orange-500" />
                    <h3 className="font-bold text-orange-700 text-lg">تسجيل مخالفة سلامة</h3>
                  </div>
                  <div className="space-y-3">
                    <select value={safetyBranch} onChange={e => setSafetyBranch(e.target.value)} className="w-full p-2 border rounded-lg bg-white">
                      <option value="">اختر الفرع...</option>
                      {branches.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <select value={safetyEmployee} onChange={e => setSafetyEmployee(e.target.value)} className="w-full p-2 border rounded-lg bg-white">
                      <option value="">الموظفة...</option>
                      {safetyBranch && employeesForBranch(safetyBranch).map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
                    </select>
                    <textarea placeholder="وصف المخالفة..." value={safetyText} onChange={e => setSafetyText(e.target.value)} className="w-full p-2 border rounded-lg bg-white h-24"></textarea>
                    <button onClick={handleSubmitSafety} className="w-full bg-orange-600 text-white py-2 rounded-lg font-bold hover:bg-orange-700">اعتماد المخالفة</button>
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">السجل الأخير</h3>
              <div className="grid gap-4">
                {timeline.filter(t => t.title.includes('شكوى') || t.title.includes('سلامة') || t.title.includes('مخالفة')).slice(0, 10).map(t => (
                  <div key={t.id} className={`p-4 rounded-xl border flex items-start gap-4 ${t.title.includes('شكوى') ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100'}`}>
                    {t.title.includes('شكوى') ? <AlertOctagon className="text-red-500 shrink-0 mt-1" /> : <ShieldAlert className="text-orange-500 shrink-0 mt-1" />}
                    <div>
                      <h3 className={`font-bold ${t.title.includes('شكوى') ? 'text-red-700' : 'text-orange-700'}`}>{t.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{t.comment}</p>
                      <p className="text-xs text-gray-400 mt-2">{t.time} • {t.branch}</p>
                    </div>
                  </div>
                ))}
                {timeline.filter(t => t.title.includes('شكوى') || t.title.includes('سلامة') || t.title.includes('مخالفة')).length === 0 && (
                  <p className="text-center text-gray-500 py-8">لا توجد ملاحظات مسجلة بعد.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div>
              <div className="flex items-center gap-3 mb-6 border-b pb-4">
                <BarChart3 className="text-blue-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-800">الإحصائيات والتقييمات</h2>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-8 shadow-sm">
                <h3 className="font-bold text-blue-900 mb-4 text-lg">حقن التقييمات للفرع</h3>
                <div className="mb-4">
                  <label className="block text-sm font-bold text-blue-800 mb-2">اختر الفرع لتسجيل التقييمات</label>
                  <select value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)} className="w-full p-3 border border-blue-200 rounded-lg">
                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-blue-800">النص البرمجي للتقييمات</label>
                    <button 
                      onClick={() => {
                        const template = `معرف التقييم: AbFvOqnT5uVK9_z5olmKcjV1GqNFGJoL5u9rUe2jxJbgdcAHlY-lLODv3Or2Eg6a_f2xndM-cYzl\nاسم المقيم: علي احمد\nالتقييم: 5 نجوم\nالتعليق: مكان جميل جدا\nالتاريخ: 06-07-2026\nالوقت: 14:23`;
                        navigator.clipboard.writeText(template);
                        showToast('تم نسخ النموذج');
                      }}
                      className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 font-bold flex items-center gap-1"
                    >
                      📋 نسخ النموذج
                    </button>
                  </div>
                  <textarea 
                    value={reviewsText} 
                    onChange={e => setReviewsText(e.target.value)}
                    placeholder="الصق التقييمات هنا بالصيغة المطلوبة...&#10;مثال:&#10;معرف التقييم: Abc...&#10;اسم المقيم: أحمد..."
                    className="w-full h-48 p-4 border border-blue-200 rounded-lg text-left bg-white font-mono text-sm leading-relaxed" dir="rtl"
                  ></textarea>
                </div>
                <button onClick={handleInjectReviews} className="w-full bg-blue-600 text-white p-4 rounded-lg font-bold hover:bg-blue-700 text-lg flex items-center justify-center gap-2 shadow-md">
                  <CheckCircle2 size={20} />
                  بدء الحقن والمزامنة للفرع
                </button>
              </div>

              <h3 className="font-bold text-xl mb-6 border-b pb-2 flex items-center gap-2 text-gray-800">
                <Activity className="text-gray-500"/> استعراض تقييمات الفروع
              </h3>
              
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {branches.map(b => (
                  <button 
                    key={b} 
                    onClick={() => { setSelectedTimelineBranch(b); setViewingReviewsMonth(''); }}
                    className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap ${selectedTimelineBranch === b ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    فرع {b}
                  </button>
                ))}
              </div>
              
              <div className="mb-6 flex justify-between items-center bg-gray-50 p-4 rounded-xl border">
                <h4 className="font-bold text-gray-700">التقييمات المسجلة: {reviews.filter(r => r.branch === selectedTimelineBranch).length}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 font-bold">الفلترة:</span>
                  <select 
                    value={viewingReviewsMonth} 
                    onChange={e => setViewingReviewsMonth(e.target.value)}
                    className="p-2 border rounded-lg bg-white text-sm font-bold"
                  >
                    <option value="">جميع الأشهر</option>
                    {Array.from(new Set(reviews.filter(r => r.branch === selectedTimelineBranch).map(r => r.date.substring(3)))).map(m => (
                      <option key={m as string} value={m as string}>{m as string}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                {reviews.filter(r => r.branch === selectedTimelineBranch && (viewingReviewsMonth ? r.date.endsWith(viewingReviewsMonth) : true)).map(r => (
                  <div key={r.id} className="bg-white p-5 rounded-xl border shadow-sm flex flex-col gap-3 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-2 h-full bg-yellow-400"></div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl shrink-0">
                        {r.reviewerName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-lg text-gray-800">{r.reviewerName}</h5>
                        <div className="flex gap-1 text-yellow-400 my-1 text-xs">
                          ★★★★★
                        </div>
                        <p className="text-gray-700 text-sm mt-2 leading-relaxed">"{r.comment}"</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1 font-medium bg-gray-50 px-2 py-1 rounded">
                        <CalendarClock size={12}/> {formatDateTime(r.date, r.time)}
                      </div>
                      {r.linkedEmployeeIds && r.linkedEmployeeIds.length > 0 ? (
                        <div className="flex items-center gap-1 font-bold text-green-700 bg-green-50 px-2 py-1 rounded border border-green-100">
                          <Users size={12}/> {r.linkedEmployeeIds.map(id => users.find(u => u.id === id)?.name).join('، ')}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100">
                          غير مرتبط
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {reviews.filter(r => r.branch === selectedTimelineBranch).length === 0 && (
                  <div className="col-span-full text-center text-gray-500 py-12 border-dashed border-2 rounded-xl flex flex-col items-center gap-3">
                    <BarChart3 size={48} className="text-gray-300"/>
                    <p className="font-bold text-lg">لا توجد تقييمات محقونة لهذا الفرع بعد.</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 flex justify-around items-center p-3">
        <button onClick={() => setActiveTab('timeline')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${activeTab === 'timeline' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
          <Activity size={24} className={activeTab === 'timeline' ? 'stroke-[2.5px]' : ''} />
          <span className="text-[10px] font-bold">الخط الزمني</span>
        </button>
        <button onClick={() => setActiveTab('branches')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${activeTab === 'branches' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
          <Building2 size={24} className={activeTab === 'branches' ? 'stroke-[2.5px]' : ''} />
          <span className="text-[10px] font-bold">الفروع</span>
        </button>
        <button onClick={() => setActiveTab('employees')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${activeTab === 'employees' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
          <Users size={24} className={activeTab === 'employees' ? 'stroke-[2.5px]' : ''} />
          <span className="text-[10px] font-bold">الموظفات</span>
        </button>
        <button onClick={() => setActiveTab('notes')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${activeTab === 'notes' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
          <MessageSquareWarning size={24} className={activeTab === 'notes' ? 'stroke-[2.5px]' : ''} />
          <span className="text-[10px] font-bold">الملاحظات</span>
        </button>
        <button onClick={() => setActiveTab('stats')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${activeTab === 'stats' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
          <BarChart3 size={24} className={activeTab === 'stats' ? 'stroke-[2.5px]' : ''} />
          <span className="text-[10px] font-bold">الإحصائيات</span>
        </button>
      </div>
    </div>
  );
};
