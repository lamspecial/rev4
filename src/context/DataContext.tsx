import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../lib/mockData';
import type { UserAccount } from '../lib/mockData';

export interface TimelineEvent {
  id: string;
  branch: string;
  type: 'shift' | 'gap';
  title: string;
  time: string;
  comment?: string;
}

interface DataContextType {
  users: UserAccount[];
  updateUser: (id: string, updates: Partial<UserAccount>) => void;
  branchSettings: Record<string, { start: string; end: string; googleApi?: string }>;
  updateBranchSettings: (branch: string, start: string, end: string, googleApi?: string) => void;
  timeline: TimelineEvent[];
  addTimelineComment: (id: string, comment: string) => void;
  addTimelineEvent: (event: Omit<TimelineEvent, 'id'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [branchSettings, setBranchSettings] = useState<Record<string, { start: string; end: string; googleApi?: string }>>({});
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    // Load from local storage or fallback to mockData
    const savedUsers = localStorage.getItem('app_users_v4');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers(mockUsers);
      localStorage.setItem('app_users_v4', JSON.stringify(mockUsers));
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
          localStorage.setItem('app_users_v4', JSON.stringify(newUsers));
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

  return (
    <DataContext.Provider value={{ users, updateUser, branchSettings, updateBranchSettings, timeline, addTimelineComment, addTimelineEvent }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
