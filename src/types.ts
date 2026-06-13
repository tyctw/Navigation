export interface ExamLink {
  id: string;
  title: string;
  url: string;
  region: string;
  category?: string;
  description?: string;
  icon?: string;
  badge?: string;
  created_at: string;
  pinned_start?: string;
  pinned_end?: string;
  click_count?: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  is_active: boolean;
  display_type: 'banner' | 'modal';
  start_date?: string;
  end_date?: string;
  created_at: string;
  link_url?: string;
  link_text?: string;
}

export interface ImportantEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  end_date?: string;
  end_time?: string;
  created_at?: string;
}

export interface RegionColors {
  [key: string]: string;
}
