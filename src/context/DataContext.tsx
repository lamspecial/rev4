import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../lib/mockData';
import type { UserAccount } from '../lib/mockData';

export interface CustomerReview {
  id: string;
  reviewerName: string;
  rating: string;
  comment: string;
  date: string;
  time: string;
  branch: string;
  linkedEmployeeIds: string[];
}

export interface TimelineEvent {
  id: string;
  branch: string;
  type: 'shift' | 'gap' | 'review';
  title: string;
  time: string;
  date?: string;
  comment?: string;
  employees?: { id: string, name: string }[];
  reviewId?: string;
}

interface DataContextType {
  users: UserAccount[];
  updateUser: (id: string, updates: Partial<UserAccount>) => void;
  branchSettings: Record<string, { start: string; end: string; googleApi?: string }>;
  updateBranchSettings: (branch: string, start: string, end: string, googleApi?: string) => void;
  timeline: TimelineEvent[];
  addTimelineComment: (id: string, comment: string) => void;
  addTimelineEvent: (event: Omit<TimelineEvent, 'id'>) => void;
  updateTimelineEvent: (id: string, updates: Partial<TimelineEvent>) => void;
  deleteTimelineEvent: (id: string) => void;
  reviews: CustomerReview[];
  injectReviews: (branch: string, text: string) => void;
  updateReview: (id: string, updates: Partial<CustomerReview>) => void;
  deleteReview: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [branchSettings, setBranchSettings] = useState<Record<string, { start: string; end: string; googleApi?: string }>>({});
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);

  useEffect(() => {
    // Load from local storage or fallback to mockData
    const savedUsers = localStorage.getItem('app_users_v5');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers(mockUsers);
      localStorage.setItem('app_users_v5', JSON.stringify(mockUsers));
    }

    const savedSettings = localStorage.getItem('app_branch_settings');
    if (savedSettings) {
      setBranchSettings(JSON.parse(savedSettings));
    } else {
      const defaultSettings: Record<string, { start: string; end: string; googleApi?: string }> = {};
      // Initialize default settings for known branches
      ['جاليري', 'ذافيو', 'سلام', 'القصر', 'المملكة', 'شرق'].forEach(b => {
        defaultSettings[b] = { start: '16:00', end: '00:00', googleApi: '' };
      });
      setBranchSettings(defaultSettings);
      localStorage.setItem('app_branch_settings', JSON.stringify(defaultSettings));
    }

    const savedTimeline = localStorage.getItem('app_timeline');
    if (savedTimeline) {
      setTimeline(JSON.parse(savedTimeline));
    } else {
      // Mock initial timeline
      const initialTimeline: TimelineEvent[] = [
        { id: '1', branch: 'جاليري', type: 'gap', title: 'فترة غير مغطاة', time: '14:00 - 16:00', comment: '' },
        { id: '2', branch: 'ذافيو', type: 'shift', title: 'تم بدء شفت مسائي', time: '16:00' },
      ];
      setTimeline(initialTimeline);
      localStorage.setItem('app_timeline', JSON.stringify(initialTimeline));
    }

    const savedReviews = localStorage.getItem('app_reviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      localStorage.setItem('app_reviews', JSON.stringify([]));
    }
  }, []);

  const updateUser = (id: string, updates: Partial<UserAccount>) => {
    let newUsers: UserAccount[] = [];
    setUsers(prev => {
      newUsers = prev.map(u => u.id === id ? { ...u, ...updates } : u);
      return newUsers;
    });
    
    // Save to localStorage outside of React state updater to prevent crashes
    setTimeout(() => {
      try {
        if (newUsers.length > 0) {
          localStorage.setItem('app_users_v5', JSON.stringify(newUsers));
        }
      } catch (e) {
        console.error('LocalStorage Quota Exceeded for users', e);
        alert('مساحة التخزين ممتلئة! تعذر حفظ التغييرات الأخيرة. يرجى حذف بعض البيانات أو استخدام صور أصغر حجماً.');
      }
    }, 0);
  };

  const updateBranchSettings = (branch: string, start: string, end: string, googleApi?: string) => {
    let newSettings: Record<string, { start: string; end: string; googleApi?: string }> = {};
    setBranchSettings(prev => {
      const current = prev[branch] || {};
      newSettings = { ...prev, [branch]: { start, end, googleApi: googleApi !== undefined ? googleApi : current.googleApi } };
      return newSettings;
    });
    
    setTimeout(() => {
      try {
        localStorage.setItem('app_branch_settings', JSON.stringify(newSettings));
      } catch (e) { console.error(e); }
    }, 0);
  };

  const addTimelineComment = (id: string, comment: string) => {
    let newTimeline: TimelineEvent[] = [];
    setTimeline(prev => {
      newTimeline = prev.map(t => t.id === id ? { ...t, comment } : t);
      return newTimeline;
    });
    
    setTimeout(() => {
      try {
        localStorage.setItem('app_timeline', JSON.stringify(newTimeline));
      } catch (e) { console.error(e); }
    }, 0);
  };

  const addTimelineEvent = (event: Omit<TimelineEvent, 'id'>) => {
    let newTimeline: TimelineEvent[] = [];
    setTimeline(prev => {
      newTimeline = [{ ...event, id: Date.now().toString() }, ...prev];
      return newTimeline;
    });
    
    setTimeout(() => {
      try {
        localStorage.setItem('app_timeline', JSON.stringify(newTimeline));
      } catch (e) { console.error(e); }
    }, 0);
  };

  const updateTimelineEvent = (id: string, updates: Partial<TimelineEvent>) => {
    let newTimeline: TimelineEvent[] = [];
    setTimeline(prev => {
      newTimeline = prev.map(t => t.id === id ? { ...t, ...updates } : t);
      return newTimeline;
    });
    setTimeout(() => {
      try { localStorage.setItem('app_timeline', JSON.stringify(newTimeline)); } catch (e) { console.error(e); }
    }, 0);
  };

  const deleteTimelineEvent = (id: string) => {
    let newTimeline: TimelineEvent[] = [];
    setTimeline(prev => {
      newTimeline = prev.filter(t => t.id !== id);
      return newTimeline;
    });
    setTimeout(() => {
      try { localStorage.setItem('app_timeline', JSON.stringify(newTimeline)); } catch (e) { console.error(e); }
    }, 0);
  };

  const updateReview = (id: string, updates: Partial<CustomerReview>) => {
    let newReviews: CustomerReview[] = [];
    setReviews(prev => {
      newReviews = prev.map(r => r.id === id ? { ...r, ...updates } : r);
      return newReviews;
    });
    setTimeout(() => {
      try { localStorage.setItem('app_reviews', JSON.stringify(newReviews)); } catch (e) { console.error(e); }
    }, 0);
  };

  const deleteReview = (id: string) => {
    let newReviews: CustomerReview[] = [];
    setReviews(prev => {
      newReviews = prev.filter(r => r.id !== id);
      return newReviews;
    });
    // Also delete from timeline
    deleteTimelineEvent(id);
    setTimeout(() => {
      try { localStorage.setItem('app_reviews', JSON.stringify(newReviews)); } catch (e) { console.error(e); }
    }, 0);
  };

  const injectReviews = (branch: string, text: string) => {
    // Expected format:
    // معرف التقييم: ...
    // اسم المقيم: ...
    // التقييم: 5 نجوم
    // التعليق: ...
    // التاريخ: 06-07-2026
    // الوقت: 14:23
    const reviewBlocks = text.split(/\n\s*\n/);
    
    setReviews(prev => {
      let newReviews = [...prev];
      let newTimelineEvents: TimelineEvent[] = [];

      reviewBlocks.forEach(block => {
        const idMatch = block.match(/معرف التقييم:\s*(.+)/);
        const nameMatch = block.match(/اسم المقيم:\s*(.+)/);
        const ratingMatch = block.match(/التقييم:\s*(.+)/);
        const commentMatch = block.match(/التعليق:\s*(.+)/);
        const dateMatch = block.match(/التاريخ:\s*(.+)/);
        const timeMatch = block.match(/الوقت:\s*(.+)/);

        if (idMatch && nameMatch && ratingMatch && dateMatch && timeMatch) {
          const id = idMatch[1].trim();
          
          // Check for duplicate
          if (!newReviews.find(r => r.id === id)) {
            const newReview: CustomerReview = {
              id,
              reviewerName: nameMatch[1].trim(),
              rating: ratingMatch[1].trim(),
              comment: commentMatch ? commentMatch[1].trim() : '',
              date: dateMatch[1].trim(),
              time: timeMatch[1].trim(),
              branch,
              linkedEmployeeIds: []
            };

            // Attempt auto-linking based on timeline shifts
            // Find the latest shift in the branch before this review time on the same date (or assume today)
            // Simplified logic: just find any shift before it
            let linkedEmployees: {id: string, name: string}[] = [];
            const rTime = parseInt(newReview.time.replace(':', ''));
            const possibleShifts = timeline.filter(t => t.branch === branch && t.type === 'shift' && t.employees && t.employees.length > 0);
            
            // Just take the latest shift before this time
            let bestShift: TimelineEvent | null = null;
            let maxTime = -1;
            for (const s of possibleShifts) {
              const sTime = parseInt(s.time.replace(':', ''));
              if (sTime <= rTime && sTime > maxTime) {
                maxTime = sTime;
                bestShift = s;
              }
            }

            if (bestShift && bestShift.employees) {
              linkedEmployees = bestShift.employees;
              newReview.linkedEmployeeIds = linkedEmployees.map(e => e.id);
            }

            newReviews.push(newReview);

            // Add to timeline
            newTimelineEvents.push({
              id: id, // Use the review id as timeline id
              branch,
              type: 'review',
              title: `تقييم جديد (${newReview.rating})`,
              time: newReview.time,
              date: newReview.date,
              comment: newReview.comment,
              employees: linkedEmployees,
              reviewId: id
            });
          }
        }
      });

      // Update Timeline
      if (newTimelineEvents.length > 0) {
        setTimeline(prevT => {
          const updatedT = [...newTimelineEvents, ...prevT].sort((a, b) => {
             // sort by time descending roughly
             const aTime = parseInt(a.time.replace(':', '')) || 0;
             const bTime = parseInt(b.time.replace(':', '')) || 0;
             return bTime - aTime;
          });
          setTimeout(() => { localStorage.setItem('app_timeline', JSON.stringify(updatedT)); }, 0);
          return updatedT;
        });
      }

      setTimeout(() => { localStorage.setItem('app_reviews', JSON.stringify(newReviews)); }, 0);
      return newReviews;
    });
  };

  return (
    <DataContext.Provider value={{ 
      users, updateUser, branchSettings, updateBranchSettings, 
      timeline, addTimelineComment, addTimelineEvent, updateTimelineEvent, deleteTimelineEvent,
      reviews, injectReviews, updateReview, deleteReview 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
