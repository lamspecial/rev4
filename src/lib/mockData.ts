import type { Employee } from '../types';

export type Role = 'manager' | 'employee' | 'admin';

export interface UserAccount extends Employee {
  email: string;
  password?: string;
  role: Role;
}

export const mockUsers: UserAccount[] = [
  // 1. جاليري
  { id: 'g1', name: 'المديرة', branch: 'جاليري', email: 'Gallery1@iamspecial.sa', password: 'Falcon17', role: 'manager', imageUrl: '/rev4/avatars/avatar_1.png', points: 0, reviewsCount: 0, stats: { positive: 0, negative: 0, complaints: 0, safety: 0 } },
  { id: 'g2', name: 'فاطمة', branch: 'جاليري', email: 'Gallery2@iamspecial.sa', password: 'Orange42', role: 'employee', imageUrl: '/rev4/avatars/avatar_2.png', points: 11, reviewsCount: 45, stats: { positive: 5, negative: 0, complaints: 0, safety: 0 } },
  { id: 'g3', name: 'ياسمين', branch: 'جاليري', email: 'Gallery3@iamspecial.sa', password: 'River85', role: 'employee', imageUrl: '/rev4/avatars/avatar_3.png', points: 9, reviewsCount: 30, stats: { positive: 4, negative: 1, complaints: 0, safety: 0 } },
  { id: 'g4', name: 'نورة', branch: 'جاليري', email: 'Gallery4@iamspecial.sa', password: 'Maple29', role: 'employee', imageUrl: '/rev4/avatars/avatar_4.png', points: 10, reviewsCount: 88, stats: { positive: 5, negative: 0, complaints: 1, safety: 0 } },
  { id: 'g5', name: 'الاء', branch: 'جاليري', email: 'Gallery5@iamspecial.sa', password: 'Desert63', role: 'employee', imageUrl: '/rev4/avatars/avatar_5.png', points: 7.5, reviewsCount: 15, stats: { positive: 3, negative: 0, complaints: 0, safety: 1.5 } },
  { id: 'g6', name: 'رانيا', branch: 'جاليري', email: 'Gallery6@iamspecial.sa', password: 'Forest91', role: 'employee', imageUrl: '/rev4/avatars/avatar_6.png', points: 8, reviewsCount: 22, stats: { positive: 4, negative: 0, complaints: 0, safety: 2 } },

  // 2. ذافيو
  { id: 'v1', name: 'أسمهان', branch: 'ذافيو', email: 'View1@iamspecial.sa', password: 'Tiger34', role: 'manager', imageUrl: '/rev4/avatars/avatar_7.png', points: 0, reviewsCount: 0, stats: { positive: 0, negative: 0, complaints: 0, safety: 0 } },
  { id: 'v2', name: 'فاتن', branch: 'ذافيو', email: 'View2@iamspecial.sa', password: 'Pencil78', role: 'employee', imageUrl: '/rev4/avatars/avatar_8.png', points: 10, reviewsCount: 50, stats: { positive: 4.5, negative: 0, complaints: 0, safety: 0.5 } },
  { id: 'v3', name: 'نوره', branch: 'ذافيو', email: 'View3@iamspecial.sa', password: 'Sunset26', role: 'employee', imageUrl: '/rev4/avatars/avatar_9.png', points: 9.5, reviewsCount: 65, stats: { positive: 4, negative: 0.5, complaints: 0, safety: 0 } },
  { id: 'v4', name: 'ملاك', branch: 'ذافيو', email: 'View4@iamspecial.sa', password: 'Coffee57', role: 'employee', imageUrl: '/rev4/avatars/avatar_10.png', points: 11, reviewsCount: 120, stats: { positive: 5, negative: 0, complaints: 0, safety: 0 } },
  { id: 'v5', name: 'موظفة 5', branch: 'ذافيو', email: 'View5@iamspecial.sa', password: 'Breeze83', role: 'employee', imageUrl: '/rev4/avatars/avatar_11.png', points: 6, reviewsCount: 5, stats: { positive: 1, negative: 0, complaints: 0, safety: 1 } },
  { id: 'v6', name: 'موظفة 6', branch: 'ذافيو', email: 'View6@iamspecial.sa', password: 'Silver14', role: 'employee', imageUrl: '/rev4/avatars/avatar_12.png', points: 6, reviewsCount: 1, stats: { positive: 0, negative: 0, complaints: 0, safety: 0 } },

  // 3. سلام
  { id: 's1', name: 'هند', branch: 'سلام', email: 'Salam1@iamspecial.sa', password: 'Horizon68', role: 'manager', imageUrl: '/rev4/avatars/avatar_13.png', points: 0, reviewsCount: 0, stats: { positive: 0, negative: 0, complaints: 0, safety: 0 } },
  { id: 's2', name: 'نوف', branch: 'سلام', email: 'Salam2@iamspecial.sa', password: 'Rocket37', role: 'employee', imageUrl: '/rev4/avatars/avatar_14.png', points: 10.5, reviewsCount: 90, stats: { positive: 4.5, negative: 0, complaints: 0, safety: 0 } },
  { id: 's3', name: 'عائشة', branch: 'سلام', email: 'Salam3@iamspecial.sa', password: 'Window95', role: 'employee', imageUrl: '/rev4/avatars/avatar_15.png', points: 8, reviewsCount: 40, stats: { positive: 3, negative: 1, complaints: 0, safety: 0 } },
  { id: 's4', name: 'مريم', branch: 'سلام', email: 'Salam4@iamspecial.sa', password: 'Cherry24', role: 'employee', imageUrl: '/rev4/avatars/avatar_16.png', points: 11, reviewsCount: 110, stats: { positive: 5, negative: 0, complaints: 0, safety: 0 } },
  { id: 's5', name: 'روان', branch: 'سلام', email: 'Salam5@iamspecial.sa', password: 'Garden81', role: 'employee', imageUrl: '/rev4/avatars/avatar_17.png', points: 7, reviewsCount: 20, stats: { positive: 2, negative: 0, complaints: 1, safety: 0 } },
  { id: 's6', name: 'موظفة 6', branch: 'سلام', email: 'Salam6@iamspecial.sa', password: 'Planet46', role: 'employee', imageUrl: '/rev4/avatars/avatar_18.png', points: 6, reviewsCount: 2, stats: { positive: 0.5, negative: 0.5, complaints: 0, safety: 0 } },

  // 4. القصر
  { id: 'q1', name: 'المديرة', branch: 'القصر', email: 'Qasr1@iamspecial.sa', password: 'Ocean72', role: 'manager', imageUrl: '/rev4/avatars/avatar_19.png', points: 0, reviewsCount: 0, stats: { positive: 0, negative: 0, complaints: 0, safety: 0 } },
  { id: 'q2', name: 'حنان', branch: 'القصر', email: 'Qasr2@iamspecial.sa', password: 'Cotton35', role: 'employee', imageUrl: '/rev4/avatars/avatar_20.png', points: 9, reviewsCount: 45, stats: { positive: 3, negative: 0, complaints: 0, safety: 0 } },
  { id: 'q3', name: 'منيرة', branch: 'القصر', email: 'Qasr3@iamspecial.sa', password: 'Bridge88', role: 'employee', imageUrl: '/rev4/avatars/avatar_21.png', points: 10, reviewsCount: 70, stats: { positive: 4, negative: 0, complaints: 0, safety: 0 } },
  { id: 'q4', name: 'رغد', branch: 'القصر', email: 'Qasr4@iamspecial.sa', password: 'Mirror19', role: 'employee', imageUrl: '/rev4/avatars/avatar_22.png', points: 11, reviewsCount: 130, stats: { positive: 5, negative: 0, complaints: 0, safety: 0 } },
  { id: 'q5', name: 'أصايل', branch: 'القصر', email: 'Qasr5@iamspecial.sa', password: 'Camel54', role: 'employee', imageUrl: '/rev4/avatars/avatar_23.png', points: 8.5, reviewsCount: 25, stats: { positive: 2.5, negative: 0, complaints: 0, safety: 0 } },
  { id: 'q6', name: 'موظفة 6', branch: 'القصر', email: 'Qasr6@iamspecial.sa', password: 'Lantern97', role: 'employee', imageUrl: '/rev4/avatars/avatar_24.png', points: 6, reviewsCount: 3, stats: { positive: 0, negative: 0, complaints: 0, safety: 0 } },

  // 5. المملكة
  { id: 'k1', name: 'المديرة', branch: 'المملكة', email: 'Kingdom1@iamspecial.sa', password: 'Eagle41', role: 'manager', imageUrl: '/rev4/avatars/avatar_25.png', points: 0, reviewsCount: 0, stats: { positive: 0, negative: 0, complaints: 0, safety: 0 } },
  { id: 'k2', name: 'أروى', branch: 'المملكة', email: 'Kingdom2@iamspecial.sa', password: 'Dolphin76', role: 'employee', imageUrl: '/rev4/avatars/avatar_26.png', points: 11, reviewsCount: 155, stats: { positive: 5, negative: 0, complaints: 0, safety: 0 } },
  { id: 'k3', name: 'هند', branch: 'المملكة', email: 'Kingdom3@iamspecial.sa', password: 'Quartz58', role: 'employee', imageUrl: '/rev4/avatars/avatar_27.png', points: 10.5, reviewsCount: 88, stats: { positive: 4.5, negative: 0, complaints: 0, safety: 0 } },
  { id: 'k4', name: 'فاطمة', branch: 'المملكة', email: 'Kingdom4@iamspecial.sa', password: 'Velvet23', role: 'employee', imageUrl: '/rev4/avatars/avatar_28.png', points: 11, reviewsCount: 145, stats: { positive: 5, negative: 0, complaints: 0, safety: 0 } },
  { id: 'k5', name: 'إيمان', branch: 'المملكة', email: 'Kingdom5@iamspecial.sa', password: 'Island84', role: 'employee', imageUrl: '/rev4/avatars/avatar_29.png', points: 9, reviewsCount: 40, stats: { positive: 3, negative: 0, complaints: 0, safety: 0 } },
  { id: 'k6', name: 'هاجر', branch: 'المملكة', email: 'Kingdom6@iamspecial.sa', password: 'Castle67', role: 'employee', imageUrl: '/rev4/avatars/avatar_30.png', points: 8, reviewsCount: 25, stats: { positive: 2, negative: 0, complaints: 0, safety: 0 } },

  // 6. شرق
  { id: 'sh1', name: 'المديرة', branch: 'شرق', email: 'Sharq1@iamspecial.sa', password: 'Meadow39', role: 'manager', imageUrl: '/rev4/avatars/avatar_1.png', points: 0, reviewsCount: 0, stats: { positive: 0, negative: 0, complaints: 0, safety: 0 } },
  { id: 'sh2', name: 'ليلى', branch: 'شرق', email: 'Sharq2@iamspecial.sa', password: 'Pepper82', role: 'employee', imageUrl: '/rev4/avatars/avatar_2.png', points: 9.5, reviewsCount: 60, stats: { positive: 3.5, negative: 0, complaints: 0, safety: 0 } },
  { id: 'sh3', name: 'مريم', branch: 'شرق', email: 'Sharq3@iamspecial.sa', password: 'Comet16', role: 'employee', imageUrl: '/rev4/avatars/avatar_3.png', points: 10, reviewsCount: 80, stats: { positive: 4, negative: 0, complaints: 0, safety: 0 } },
  { id: 'sh4', name: 'شيماء', branch: 'شرق', email: 'Sharq4@iamspecial.sa', password: 'Bamboo53', role: 'employee', imageUrl: '/rev4/avatars/avatar_4.png', points: 11, reviewsCount: 115, stats: { positive: 5, negative: 0, complaints: 0, safety: 0 } },
  { id: 'sh5', name: 'وجدان', branch: 'شرق', email: 'Sharq5@iamspecial.sa', password: 'Crown94', role: 'employee', imageUrl: '/rev4/avatars/avatar_5.png', points: 8.5, reviewsCount: 35, stats: { positive: 2.5, negative: 0, complaints: 0, safety: 0 } },
  { id: 'sh6', name: 'فاطمة', branch: 'شرق', email: 'Sharq6@iamspecial.sa', password: 'Orchid28', role: 'employee', imageUrl: '/rev4/avatars/avatar_6.png', points: 7.5, reviewsCount: 15, stats: { positive: 1.5, negative: 0, complaints: 0, safety: 0 } },

  // مدير النظام العام
  { id: 'admin1', name: 'مدير النظام', branch: 'الإدارة', email: 'admin@iamspecial.sa', password: 'Admin123', role: 'admin', imageUrl: '/rev4/avatars/avatar_7.png', points: 0, reviewsCount: 0, stats: { positive: 0, negative: 0, complaints: 0, safety: 0 } },

  // موظفات المصدر الخارجي (Outsourced)
  { id: 'out1', name: 'سعاد (موظفة خارجية)', branch: 'موظفة خارجية', email: 'Out1@iamspecial.sa', password: 'Out123', role: 'employee', imageUrl: '/rev4/avatars/avatar_8.png', points: 8, reviewsCount: 40, stats: { positive: 3, negative: 0, complaints: 0, safety: 0 } },
  { id: 'out2', name: 'ابتسام (موظفة خارجية)', branch: 'موظفة خارجية', email: 'Out2@iamspecial.sa', password: 'Out123', role: 'employee', imageUrl: '/rev4/avatars/avatar_9.png', points: 9, reviewsCount: 50, stats: { positive: 4, negative: 0, complaints: 0, safety: 0 } },
];
