import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { supabase } from './lib/supabase';
import { ExamLink, Announcement, ImportantEvent } from './types';
import { ExternalLink, LockIcon, UnlockIcon, Plus, Trash2, Map, Shield, CalendarDays, Timer, Layers, BookOpen, MapPin, Telescope, PenTool, Database, LayoutTemplate, Link, AlignLeft, Image, Tag, Folder, ChevronDown, Bell, Calendar, Edit2, CheckCircle2, X, Search, Share2, Copy, BarChart3, TrendingUp, MousePointerClick, Bookmark, Calculator, Info, FileText, Mail, Target, Heart, Landmark, Globe } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CalculatorModal } from './components/CalculatorModal';

const REGION_COLORS: Record<string, string> = {
  '全國': 'text-blue-600',
  '基北區': 'text-red-600',
  '桃連區': 'text-emerald-600',
  '竹苗區': 'text-purple-600',
  '中投區': 'text-amber-600',
  '彰化區': 'text-orange-600',
  '雲林區': 'text-yellow-600',
  '嘉義區': 'text-lime-600',
  '台南區': 'text-teal-600',
  '高雄區': 'text-cyan-600',
  '屏東區': 'text-indigo-600',
  '花蓮區': 'text-violet-600',
  '台東區': 'text-fuchsia-600',
  '澎湖區': 'text-rose-600',
  '金門區': 'text-pink-600',
  '連江區': 'text-sky-600',
};

const CATEGORIES = ['會考官方資訊', '考前準備', '歷屆試題', '學習資源', '考後落點', '志願選填', '升學探索', '常見問答', '通用工具'];

const CATEGORY_CONFIG = [
  { id: '全部', label: '全部資源', icon: Layers, color: 'text-indigo-500', activeClass: 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-indigo-500/30 border-transparent shadow-xl ring-1 ring-white/20' },
  { id: '會考官方資訊', label: '會考官方資訊', icon: Landmark, color: 'text-blue-500', activeClass: 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-blue-500/30 border-transparent shadow-xl ring-1 ring-white/20' },
  { id: '考前準備', label: '考前準備', icon: BookOpen, color: 'text-emerald-500', activeClass: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/30 border-transparent shadow-xl ring-1 ring-white/20' },
  { id: '歷屆試題', label: '歷屆試題', icon: FileText, color: 'text-orange-500', activeClass: 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-orange-500/30 border-transparent shadow-xl ring-1 ring-white/20' },
  { id: '學習資源', label: '學習資源', icon: Database, color: 'text-purple-500', activeClass: 'bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white shadow-purple-500/30 border-transparent shadow-xl ring-1 ring-white/20' },
  { id: '考後落點', label: '考後落點', icon: MapPin, color: 'text-amber-500', activeClass: 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-amber-500/30 border-transparent shadow-xl ring-1 ring-white/20' },
  { id: '志願選填', label: '志願選填', icon: Target, color: 'text-rose-500', activeClass: 'bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-rose-500/30 border-transparent shadow-xl ring-1 ring-white/20' },
  { id: '升學探索', label: '升學探索', icon: Telescope, color: 'text-pink-500', activeClass: 'bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-pink-500/30 border-transparent shadow-xl ring-1 ring-white/20' },
  { id: '常見問答', label: '常見問答', icon: Info, color: 'text-teal-500', activeClass: 'bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-teal-500/30 border-transparent shadow-xl ring-1 ring-white/20' },
  { id: '通用工具', label: '通用工具', icon: PenTool, color: 'text-slate-500', activeClass: 'bg-gradient-to-br from-slate-600 to-slate-800 text-white shadow-slate-600/30 border-transparent shadow-xl ring-1 ring-white/20' },
];


export default function App() {
  const [events, setEvents] = useState<ImportantEvent[]>([]);
  const [links, setLinks] = useState<ExamLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newRegion, setNewRegion] = useState('桃連區');
  const [newCategory, setNewCategory] = useState(CATEGORIES[1]);
  const [newDescription, setNewDescription] = useState('');
  const [newIcon, setNewIcon] = useState('');
  const [newBadge, setNewBadge] = useState('');
  const [newPinnedStart, setNewPinnedStart] = useState('');
  const [newPinnedEnd, setNewPinnedEnd] = useState('');
  
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'links' | 'announcements' | 'events' | 'analytics' | null>(null);
  const [evtTitle, setEvtTitle] = useState('');
  const [evtDate, setEvtDate] = useState('');
  const [evtTime, setEvtTime] = useState('');
  const [evtEndDate, setEvtEndDate] = useState('');
  const [evtEndTime, setEvtEndTime] = useState('');
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annDisplayType, setAnnDisplayType] = useState<'banner' | 'modal'>('banner');
  const [annStart, setAnnStart] = useState('');
  const [annEnd, setAnnEnd] = useState('');
  
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<ExamLink>>({});
  const [activeTab, setActiveTab] = useState<'home' | 'faq'>('home');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('全部');
  const [activeRegionFilter, setActiveRegionFilter] = useState('全部');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('tw_exam_favorites') || '[]');
    } catch {
      return [];
    }
  });
  const [showCalculatorModal, setShowCalculatorModal] = useState(false);
  const [nextEvent, setNextEvent] = useState<{title: string, days: number, hours: number, minutes: number, date: string} | null>(null);

  useEffect(() => {
    localStorage.setItem('tw_exam_favorites', JSON.stringify(favorites));
  }, [favorites]);
  const [closedModalIds, setClosedModalIds] = useState<Set<string>>(new Set());
  const [isValidating, setIsValidating] = useState(false);
  const [invalidLinks, setInvalidLinks] = useState<Record<string, boolean>>({});
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };


  useEffect(() => {
    fetchLinks();
    fetchAnnouncements();
    fetchEvents();
    
    // Fireworks celebration on 2026-07-08 (放榜日後)
    const checkAndTriggerFireworks = () => {
      const now = new Date();
      const d0708 = new Date('2026-07-08T00:00:00+08:00');
      const d0715 = new Date('2026-07-15T23:59:59+08:00'); // 放榜慶祝週
      
      if (now >= d0708 && now <= d0715 && !sessionStorage.getItem('celebration_fireworks')) {
        const duration = 5 * 1000; // 5 seconds of fireworks
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
        
        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
        
        const interval: any = setInterval(function() {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) {
            sessionStorage.setItem('celebration_fireworks', 'true');
            return clearInterval(interval);
          }
          const particleCount = 50 * (timeLeft / duration);
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
      }
    };
    checkAndTriggerFireworks();
  }, []);

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      let foundNext = null;
      const sortedEvents = [...events].sort((a, b) => {
        const timeA = new Date(`${a.date}T${(a.time && a.time.length === 5) ? a.time + ':00' : (a.time || '00:00:00')}+08:00`).getTime();
        const timeB = new Date(`${b.date}T${(b.time && b.time.length === 5) ? b.time + ':00' : (b.time || '00:00:00')}+08:00`).getTime();
        return timeA - timeB;
      });
      
      for (const evt of sortedEvents) {
        const timeStr = (evt.time && evt.time.length === 5) ? evt.time + ':00' : (evt.time || '00:00:00');
        const evtTime = new Date(`${evt.date}T${timeStr}+08:00`);
        if (evtTime.getTime() > now.getTime()) {
          const diffMs = evtTime.getTime() - now.getTime();
          const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          foundNext = { title: evt.title, date: evt.date, days, hours, minutes };
          break;
        }
      }
      setNextEvent(foundNext);
    };

    calculateCountdown();
    const intervalId = setInterval(calculateCountdown, 60000); // 1 min update
    return () => clearInterval(intervalId);
  }, [events]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('important_events')
        .select('*')
        .order('date', { ascending: true });
      
      if (!error && data) {
        setEvents(data);
      }
    } catch (e) {
      console.error('Error fetching events', e);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setAnnouncements(data);
      }
    } catch (e) {
      console.error('Error fetching announcements', e);
    }
  };

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('exam_links')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching links:', error);
        setLinks([]);
      } else {
        setLinks(data || []);
      }
    } catch (e) {
      console.error(e);
      setLinks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleValidateLinks = async () => {
    setIsValidating(true);
    const newInvalidStatus: Record<string, boolean> = {};
    
    for (const link of links) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        await fetch(link.url, { mode: 'no-cors', signal: controller.signal });
        
        clearTimeout(timeoutId);
      } catch (err) {
        newInvalidStatus[link.id] = true;
      }
    }
    
    setInvalidLinks(newInvalidStatus);
    setIsValidating(false);
    
    const count = Object.keys(newInvalidStatus).length;
    if (count > 0) {
      alert(`掃描完成！已標記 ${count} 個可能失效或無法連線的連結標籤 (紅色提示)。\n(註：受跨網域限制，部分健康正常的網站在嚴格安全性下可能也會被標記，請以實際點擊測試為準)`);
    } else {
      alert(`掃描完成！所有連結網路皆能順利連通。`);
    }
  };

  const handleShare = async () => {
    setShowShareModal(true);
  };

  const handleLinkClick = async (link: ExamLink) => {
    // Optimistically update the UI to feel instant
    setLinks(prev => prev.map(l => l.id === link.id ? { ...l, click_count: (l.click_count || 0) + 1 } : l));
    
    // Update Supabase in background
    try {
      await supabase
        .from('exam_links')
        .update({ click_count: (link.click_count || 0) + 1 })
        .eq('id', link.id);
    } catch (err) {
      console.warn('Failed to update click count:', err);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('網址已複製到剪貼簿！');
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPassword.trim()) return;

    try {
      // 驗證後端資料庫中的密碼
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('password', adminPassword)
        .limit(1);

      if (data && data.length > 0) {
        setIsAdmin(true);
        setShowAdminLogin(false);
        setAdminPassword('');
        try {
          await supabase.from('admin_logs').insert([{ status: 'success', user_agent: navigator.userAgent }]);
        } catch (e) {
          console.error('Log failed', e);
        }
      } else {
        alert('密碼錯誤');
        try {
          await supabase.from('admin_logs').insert([{ status: 'failed', user_agent: navigator.userAgent }]);
        } catch (e) {
          console.error('Log failed', e);
        }
      }
    } catch (err) {
      console.error('Login fallback error', err);
      // Fallback
      const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
      if (adminPassword === correctPassword) {
        setIsAdmin(true);
        setShowAdminLogin(false);
        setAdminPassword('');
      } else {
        alert('密碼錯誤或連線失敗');
      }
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    
    // URL is required unless it's an FAQ
    if (newCategory !== '常見問答') {
      if (!newUrl) {
        alert('請輸入網址');
        return;
      }
      if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
        alert('請輸入有效的網址 (需包含 http:// 或 https://)');
        return;
      }
    }

    if (newPinnedStart && newPinnedEnd) {
      if (new Date(newPinnedStart) > new Date(newPinnedEnd)) {
        alert('置頂結束日期不能早於開始日期');
        return;
      }
    }

    try {
      const { data, error } = await supabase
        .from('exam_links')
        .insert([
          { 
            title: newTitle, 
            url: newUrl, 
            region: newRegion, 
            category: newCategory,
            description: newDescription || null,
            icon: newIcon || null,
            badge: newBadge || null,
            pinned_start: newPinnedStart || null,
            pinned_end: newPinnedEnd || null
          }
        ])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        alert(`資料庫寫入失敗: \n${error.message}\n\n請確認 Supabase 中已經建立 exam_links 資料表，並且 RLS 權限有開放 Insert。`);
        return;
      } else if (data) {
        setLinks([...data, ...links]);
        showToast('資源連結新增成功', 'success');
      }
      
      setNewTitle('');
      setNewUrl('');
      setNewDescription('');
      setNewIcon('');
      setNewBadge('');
      setNewPinnedStart('');
      setNewPinnedEnd('');
    } catch (err) {
      console.error(err);
      showToast('新增失敗', 'error');
    }
  };

  const startEditingLink = (link: ExamLink) => {
    setEditingLink(link.id);
    setEditFormData(link);
  };

  const saveEditedLink = async () => {
    if (!editingLink || !editFormData.title) return;
    
    if (editFormData.category !== '常見問答') {
      if (!editFormData.url) {
        alert('請輸入網址');
        return;
      }
      if (!editFormData.url.startsWith('http://') && !editFormData.url.startsWith('https://')) {
        alert('請輸入有效的網址 (需包含 http:// 或 https://)');
        return;
      }
    }

    if (editFormData.pinned_start && editFormData.pinned_end) {
      if (new Date(editFormData.pinned_start) > new Date(editFormData.pinned_end)) {
        alert('置頂結束日期不能早於開始日期');
        return;
      }
    }

    try {
      const { data, error } = await supabase
        .from('exam_links')
        .update(editFormData)
        .eq('id', editingLink)
        .select();
      
      if (error) {
        console.error('Update error:', error);
        showToast('更新失敗', 'error');
        return;
      }
      
      if (data) {
        setLinks(links.map(l => l.id === editingLink ? data[0] : l));
        showToast('資源連結更新成功', 'success');
      }
      setEditingLink(null);
    } catch (err) {
      console.error(err);
      showToast('更新出錯', 'error');
    }
  };

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    if (annStart && annEnd) {
      if (new Date(annStart) > new Date(annEnd)) {
        alert('公告結束日期不能早於開始日期');
        return;
      }
    }

    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert([{
          title: annTitle,
          content: annContent,
          display_type: annDisplayType,
          start_date: annStart || null,
          end_date: annEnd || null,
          is_active: true
        }])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        alert(`資料庫寫入失敗: \n${error.message}`);
        return;
      } else if (data) {
        setAnnouncements([data[0], ...announcements]);
        showToast('系統公告新增成功', 'success');
      }
      
      setAnnTitle('');
      setAnnContent('');
      setAnnDisplayType('banner');
      setAnnStart('');
      setAnnEnd('');
      setShowAnnouncementForm(false);
    } catch (err) {
      console.error(err);
      showToast('新增失敗', 'error');
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtTitle || !evtDate) return;

    if (evtEndDate) {
      if (new Date(evtDate) > new Date(evtEndDate)) {
        alert('結束日期不能早於開始日期');
        return;
      }
      
      if (evtDate === evtEndDate && evtTime && evtEndTime) {
        if (evtTime > evtEndTime) {
          alert('結束時間不能早於開始時間');
          return;
        }
      }
    }

    try {
      const { data, error } = await supabase
        .from('important_events')
        .insert([{
          title: evtTitle,
          date: evtDate,
          time: evtTime || null,
          end_date: evtEndDate || null,
          end_time: evtEndTime || null
        }])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        alert(`資料庫寫入失敗: \n${error.message}`);
        return;
      } else if (data) {
        setEvents([...events, data[0]]);
        showToast('重要日程新增成功', 'success');
      }

      
      setEvtTitle('');
      setEvtDate('');
      setEvtTime('');
      setEvtEndDate('');
      setEvtEndTime('');
      setShowEventForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('important_events')
        .delete()
        .eq('id', id);
        
      if (error) console.error('Error deleting:', error);
      setEvents(events.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);
        
      if (error) console.error('Error deleting:', error);
      setAnnouncements(announcements.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('exam_links')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Error deleting:', error);
      }
      
      setLinks(links.filter(link => link.id !== id));
    } catch (err) {
      console.error(err);
    }
  };



  const filteredLinks = links.filter(link => {
    if (link.category === '常見問答') return false;
    const matchCategory = activeCategoryFilter === '全部' || (link.category || '考後落點') === activeCategoryFilter;
    const matchRegion = activeRegionFilter === '全部' ? true : activeRegionFilter === '我的收藏' ? favorites.includes(link.id) : link.region === activeRegionFilter;
    const matchSearch = searchTerm === '' || link.title.toLowerCase().includes(searchTerm.toLowerCase()) || (link.description && link.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCategory && matchRegion && matchSearch;
  });

  // Phase recommendation logic based on schedule
  const now = new Date();
  const phaseConfig = (() => {
    const d0516 = new Date('2026-05-16T00:00:00+08:00');
    const d0605 = new Date('2026-06-05T00:00:00+08:00');
    const d0618 = new Date('2026-06-18T00:00:00+08:00');
    const d0707 = new Date('2026-07-07T00:00:00+08:00');
    
    if (now < d0516) {
      return { title: '考前衝刺推薦', subtitle: '全力衝刺！好用備考工具推薦', keywords: ['倒數', '讀書時鐘', '時程', '序位參考'] };
    } else if (now < d0605) {
      return { title: '考後首報推薦', subtitle: '等待成績出爐，搶先了解落點', keywords: ['落點分析系統', '分享平台', '分數分析', '學校對照'] };
    } else if (now < d0618) {
      return { title: '成績分析推薦', subtitle: '會考成績已公布！為志願選填預估優勢', keywords: ['落點分析系統', '序位推估', '分數分析'] };
    } else if (now < d0707) {
      return { title: '志願選填置頂專區', subtitle: '個人序位區間已公告，免試入學志願選填正式起跑', keywords: ['免試入學', '志願選填', '各區查榜', '序位分享'] };
    } else {
      return { title: '就學區放榜查榜置頂', subtitle: '各就學區免試入學正式放榜', keywords: ['TYCTW會考查榜', '查榜', '錄取分數'] };
    }
  })();

  const pinnedLinks = filteredLinks.filter(link => {
    if (link.pinned_start || link.pinned_end) {
      if (link.pinned_start && link.pinned_end) {
        return now >= new Date(link.pinned_start) && now <= new Date(link.pinned_end);
      } else if (link.pinned_start) {
        return now >= new Date(link.pinned_start);
      } else if (link.pinned_end) {
        return now <= new Date(link.pinned_end);
      }
    }
    return phaseConfig.keywords.some(kw => link.title.includes(kw) || (link.description && link.description.includes(kw)));
  });
  const pinnedLinkIds = new Set(pinnedLinks.map(l => l.id));
  
  // Exclude pinned links from the general groupings
  const remainingLinks = filteredLinks.filter(link => !pinnedLinkIds.has(link.id));

  const groupedLinks = remainingLinks.reduce((acc, link) => {
    if (!acc[link.region]) {
      acc[link.region] = [];
    }
    acc[link.region].push(link);
    return acc;
  }, {} as Record<string, ExamLink[]>);

  const regionKeys = Object.keys(groupedLinks).sort((a, b) => {
    if (a === '全國') return -1;
    if (b === '全國') return 1;
    return a.localeCompare(b);
  });

  const activeBanners = announcements.filter(a => 
    a.is_active && 
    a.display_type !== 'modal' && 
    (!a.start_date || now >= new Date(a.start_date)) && 
    (!a.end_date || now <= new Date(a.end_date))
  );

  const activeModals = announcements.filter(a => 
    a.is_active && 
    a.display_type === 'modal' && 
    !closedModalIds.has(a.id) && 
    (!a.start_date || now >= new Date(a.start_date)) && 
    (!a.end_date || now <= new Date(a.end_date))
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 pb-12 flex flex-col w-full selection:bg-indigo-100 selection:text-indigo-900 relative">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 inset-x-0 h-[600px] w-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[80%] bg-indigo-300/20 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[80%] bg-blue-300/20 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      {/* Modern Floating Header Navigation */}
      <div className="sticky top-4 sm:top-6 z-50 px-4 sm:px-6 w-full max-w-7xl mx-auto transition-all duration-300">
        <header className="w-full bg-white/60 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-3xl p-3 sm:px-5 sm:py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <div className="relative group shrink-0">
                <div className="absolute inset-0 bg-indigo-400 rounded-2xl blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-500"></div>
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg overflow-hidden border border-indigo-400/30">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                  <Map size={22} className="drop-shadow-sm w-4 h-4 sm:w-[22px] sm:h-[22px]" />
                </div>
              </div>
              <div className="flex flex-col min-w-0 sm:max-w-none flex-shrink">
                <h1 className="text-[14px] sm:text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-950 tracking-tight leading-tight truncate">
                  全國會考落點導航
                </h1>
                <p className="text-[8px] sm:text-[10px] font-bold tracking-[0.2em] text-slate-500/80 uppercase mt-0.5 truncate hidden sm:block">
                  Admission Navigation Center
                </p>
              </div>
              
              <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl ml-2 border border-slate-200/50">
                <button 
                  onClick={() => setActiveTab('home')} 
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all outline-none ${activeTab === 'home' ? 'bg-white text-indigo-700 shadow-[0_2px_8px_rgba(0,0,0,0.06)]' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  導航首頁
                </button>
                <button 
                  onClick={() => setActiveTab('faq')} 
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all outline-none ${activeTab === 'faq' ? 'bg-white text-indigo-700 shadow-[0_2px_8px_rgba(0,0,0,0.06)]' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  常見問答
                </button>
              </div>
            </div>
            
            <div className="flex md:hidden items-center gap-1.5 shrink-0 ml-auto">
              <button
                onClick={() => setShowCalculatorModal(true)}
                className="flex items-center justify-center p-2 rounded-xl border bg-white/80 text-amber-500 border-amber-200 hover:bg-amber-50 hover:text-amber-700 transition-all shadow-sm group outline-none"
                title="積分試算"
              >
                <Calculator size={16} />
              </button>
              <button
                onClick={handleShare}
                className="flex items-center justify-center p-2 rounded-xl border bg-white/80 text-indigo-500 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 transition-all shadow-sm outline-none"
                title="分享網站"
              >
                <Share2 size={16} />
              </button>
              {/* Mobile Admin Toggle */}
              <button 
                onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminLogin(true)}
                className={`flex items-center justify-center p-2 rounded-xl border transition-all duration-300 shadow-sm outline-none ${
                  isAdmin 
                    ? 'bg-rose-50 text-rose-600 border-rose-200' 
                    : 'bg-white/80 text-slate-400 border-slate-200/60 hover:bg-slate-50 hover:text-indigo-600'
                }`}
              >
                {isAdmin ? <UnlockIcon size={16} /> : <LockIcon size={16} />}
              </button>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 w-full md:w-auto mt-1 md:mt-0">
            <div className="flex justify-end items-center gap-3 w-full md:w-auto">
              <div className="hidden lg:flex items-center gap-2 bg-emerald-50/90 px-4 py-2.5 sm:py-3 rounded-2xl border border-emerald-100/50 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-bold text-emerald-700 tracking-wide mt-[1px]">即時連線</span>
              </div>
              <button 
                onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminLogin(true)}
                className={`hidden md:flex items-center gap-2 px-5 py-2.5 sm:py-3 rounded-2xl border text-sm font-bold transition-all duration-300 shadow-sm outline-none ${
                  isAdmin 
                    ? 'bg-rose-50/80 text-rose-600 border-rose-200 hover:bg-rose-100' 
                    : 'bg-white/80 text-slate-500 border-slate-200/60 hover:bg-white hover:text-indigo-600 hover:border-indigo-200 hover:shadow-md'
                }`}
              >
                {isAdmin ? (
                  <>
                    <UnlockIcon size={16} />
                    <span>關閉管理</span>
                  </>
                ) : (
                  <>
                    <Shield size={16} />
                    <span>管理登入</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowCalculatorModal(true)}
                className="hidden md:flex items-center justify-center p-2.5 sm:py-3 sm:px-4 rounded-xl sm:rounded-2xl border bg-white/80 text-amber-500 border-amber-200 hover:bg-amber-50 hover:text-amber-700 transition-all shadow-sm group outline-none"
                title="基北區積分試算"
              >
                <Calculator size={18} className="shrink-0" />
                <span className="hidden lg:block ml-2 text-sm font-bold truncate">各區會考積分試算</span>
              </button>
              <button
                onClick={handleShare}
                className="hidden md:flex items-center justify-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border bg-white/80 text-indigo-500 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 transition-all shadow-sm outline-none"
                title="分享網站"
              >
                <Share2 size={18} className="shrink-0" />
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Main Strategic Viewport */}
      <main className="flex-grow w-full max-w-6xl mx-auto p-4 sm:p-6 md:p-8 flex flex-col gap-8 relative">
        <div className="flex sm:hidden items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50 mb-2 w-full">
          <button 
            onClick={() => setActiveTab('home')} 
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all outline-none ${activeTab === 'home' ? 'bg-white text-indigo-700 shadow-[0_2px_8px_rgba(0,0,0,0.06)]' : 'text-slate-500 hover:text-slate-700'}`}
          >
            導航首頁
          </button>
          <button 
            onClick={() => setActiveTab('faq')} 
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all outline-none ${activeTab === 'faq' ? 'bg-white text-indigo-700 shadow-[0_2px_8px_rgba(0,0,0,0.06)]' : 'text-slate-500 hover:text-slate-700'}`}
          >
            常見問答
          </button>
        </div>

        {activeTab === 'home' ? (
          <>
            {/* Independent Countdown Banner */}
            <AnimatePresence mode="popLayout">
          {nextEvent && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-xl border border-indigo-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] shadow-indigo-900/5"
            >
              {/* Background Decorations */}
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-50/50 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

              <div className="relative z-10 p-4 sm:p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                
                {/* Left Side: Title */}
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left w-full sm:w-auto">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-2 shadow-sm">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-indigo-600 tracking-[0.1em] uppercase">Target Date</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 tracking-tight mb-1.5">
                    重要日程倒數
                  </h3>
                  <p className="text-slate-500 font-medium text-xs sm:text-sm flex items-center justify-center sm:justify-start gap-1.5">
                    <Calendar size={14} className="text-indigo-400" />
                    距離 {nextEvent.title} 還有
                  </p>
                </div>

                {/* Right Side: Timer */}
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto justify-center bg-slate-50/80 px-4 py-3 sm:px-5 sm:py-4 rounded-2xl border border-slate-100">
                  
                  {/* Days */}
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-16 sm:w-16 sm:h-[72px] md:w-20 md:h-[84px] bg-white border border-slate-200/80 rounded-xl flex items-center justify-center shadow-sm relative overflow-hidden group">
                      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none"></div>
                      <span className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 tracking-tighter tabular-nums group-hover:scale-105 transition-transform duration-300">
                        {nextEvent.days}
                      </span>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 mt-2 tracking-[0.1em] uppercase">Days</span>
                  </div>

                  {/* Divider */}
                  <div className="flex flex-col pb-4 sm:pb-5">
                    <span className="text-xl sm:text-2xl font-black text-slate-300 animate-pulse">:</span>
                  </div>

                  {/* Hours */}
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-16 sm:w-16 sm:h-[72px] md:w-20 md:h-[84px] bg-white border border-slate-200/80 rounded-xl flex items-center justify-center shadow-sm relative overflow-hidden group">
                      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none"></div>
                      <span className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 tracking-tighter tabular-nums group-hover:scale-105 transition-transform duration-300">
                        {nextEvent.hours.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 mt-2 tracking-[0.1em] uppercase">Hrs</span>
                  </div>

                  {/* Divider */}
                  <div className="flex flex-col pb-4 sm:pb-5">
                    <span className="text-xl sm:text-2xl font-black text-slate-300 animate-pulse">:</span>
                  </div>

                  {/* Minutes */}
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-16 sm:w-16 sm:h-[72px] md:w-20 md:h-[84px] bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-center justify-center shadow-sm relative overflow-hidden group">
                      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/50 to-transparent pointer-events-none"></div>
                      <span className="text-3xl sm:text-4xl md:text-5xl font-black text-indigo-600 tracking-tighter tabular-nums group-hover:scale-105 transition-transform duration-300">
                        {nextEvent.minutes.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-indigo-400 mt-2 tracking-[0.1em] uppercase">Mins</span>
                  </div>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Active Banners */}
        {activeBanners.length > 0 && (
          <div className="flex flex-col gap-3 relative z-20">
            {activeBanners.map(ann => (
              <motion.div 
                key={ann.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group flex items-center gap-3 sm:gap-4 bg-white border border-indigo-100/80 p-2 sm:p-2.5 rounded-2xl shadow-[0_4px_20px_-5px_rgba(79,70,229,0.1)] hover:shadow-[0_8px_30px_-5px_rgba(79,70,229,0.2)] transition-all relative overflow-hidden"
              >
                {/* Banner Luxe Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/80 via-transparent to-fuchsia-50/50 pointer-events-none"></div>
                <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
                
                <div className="relative z-20 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-2.5 sm:p-3 rounded-xl shadow-md border border-indigo-400/30 shrink-0 ml-1">
                  <Bell size={18} className="animate-pulse" />
                </div>
                
                <div className="flex-1 relative z-10 flex flex-col justify-center overflow-hidden h-full py-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[9px] sm:text-[10px] font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-[0.2em] uppercase">SYSTEM</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-indigo-100 to-transparent"></div>
                  </div>
                  
                  <div className="w-full relative overflow-hidden whitespace-nowrap marquee-container">
                    <div className="inline-flex animate-marquee-scroll hover:[animation-play-state:paused] items-center gap-12 whitespace-nowrap pr-12 cursor-default">
                       <div className="flex items-center gap-3">
                         <span className="text-sm sm:text-base font-black text-slate-800 tracking-tight">{ann.title}</span>
                         {ann.content && (
                           <>
                             <div className="flex items-center gap-1.5 opacity-40">
                               <span className="w-1 h-1 rounded-full bg-indigo-600"></span>
                               <span className="w-1 h-1 rounded-full bg-indigo-600"></span>
                             </div>
                             <span className="text-sm text-slate-600 font-medium tracking-wide">{ann.content}</span>
                           </>
                         )}
                       </div>
                       
                       {/* Repeat content for smooth continuous scrolling if needed. For now simple padding is often enough to visually represent a ticker. */}
                       <div className="flex items-center gap-3">
                         <span className="text-sm sm:text-base font-black text-slate-800 tracking-tight">{ann.title}</span>
                         {ann.content && (
                           <>
                             <div className="flex items-center gap-1.5 opacity-40">
                               <span className="w-1 h-1 rounded-full bg-indigo-600"></span>
                               <span className="w-1 h-1 rounded-full bg-indigo-600"></span>
                             </div>
                             <span className="text-sm text-slate-600 font-medium tracking-wide">{ann.content}</span>
                           </>
                         )}
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Active Modals Overlay */}
        <AnimatePresence>
          {activeModals.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4"
            >
              <div className="flex flex-col gap-4 w-full max-w-lg">
                {activeModals.map(ann => (
                  <motion.div 
                    key={ann.id}
                    initial={{ scale: 0.95, opacity: 0, y: 10, rotateX: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 10, rotateX: -10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    style={{ perspective: 1000 }}
                    className="relative overflow-hidden rounded-[2.5rem] bg-white border border-white/40 shadow-[0_20px_60px_-15px_rgba(79,70,229,0.3)] backdrop-blur-2xl p-6 sm:p-10"
                  >
                    {/* Luxurious Background Elements */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-white/40 to-fuchsia-50/80 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-indigo-400/20 via-purple-300/10 to-transparent rounded-full blur-[60px] pointer-events-none -translate-y-1/3 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-400/20 via-teal-300/10 to-transparent rounded-full blur-[50px] pointer-events-none translate-y-1/3 -translate-x-1/3"></div>
                    
                    {/* Border highlight effect */}
                    <div className="absolute inset-0 rounded-[2.5rem] border border-white/60 pointer-events-none"></div>
                    <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/50 to-transparent pointer-events-none"></div>
                    
                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="relative group">
                          <div className="absolute inset-0 bg-indigo-500/20 blur-md rounded-2xl group-hover:bg-indigo-500/30 transition-colors"></div>
                          <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-3.5 rounded-2xl shadow-lg border border-white/20">
                            <Bell size={24} className="animate-pulse" />
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] sm:text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-[0.2em] uppercase">
                            公告通知
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
                            </span>
                            <span className="text-[10px] font-bold text-rose-500 tracking-widest uppercase">Important</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setClosedModalIds(prev => new Set(prev).add(ann.id))}
                        className="text-slate-400 hover:text-slate-700 bg-white/50 hover:bg-white p-2.5 rounded-full backdrop-blur-md border border-slate-200/50 shadow-sm transition-all hover:shadow-md outline-none hover:rotate-90 duration-300"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-5 tracking-tight leading-tight w-full relative">
                        {ann.title}
                      </h2>
                      
                      {ann.content && (
                        <div className="w-full relative group">
                          <div className="absolute inset-0 bg-slate-100/50 blur-lg rounded-3xl pointer-events-none group-hover:bg-slate-200/50 transition-colors"></div>
                          <div className="relative bg-white/60 backdrop-blur-xl p-5 sm:p-6 p-4 rounded-3xl border border-white/80 shadow-[inset_0_2px_10px_rgba(255,255,255,1),0_4px_15px_rgba(0,0,0,0.03)] mb-8 max-h-[35vh] overflow-y-auto text-left">
                            <p className="text-slate-700 font-medium leading-loose text-sm sm:text-base whitespace-pre-wrap">{ann.content}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="w-full flex flex-col gap-4">
                        <button 
                          onClick={() => setClosedModalIds(prev => new Set(prev).add(ann.id))}
                          className="w-full py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-500 text-white font-bold text-lg rounded-2xl transition-all duration-500 shadow-[0_8px_25px_-5px_rgba(79,70,229,0.5)] hover:shadow-[0_15px_35px_-5px_rgba(79,70,229,0.6)] flex justify-center items-center gap-2 outline-none group relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0),rgba(255,255,255,0.4),rgba(255,255,255,0))] w-full h-full -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                          <CheckCircle2 size={20} className="relative z-10" />
                          <span className="relative z-10 tracking-widest">我明白了</span>
                        </button>
                        
                        {/* TW會考落點分析 字樣 watermark / branding */}
                        <div className="flex items-center justify-center gap-2 opacity-50 mt-2">
                          <Target size={14} className="text-indigo-600" />
                          <span className="text-[10px] font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-slate-600 uppercase">
                            TW 會考落點分析
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Admin Login Modal overlay */}
        <AnimatePresence>
          {showAdminLogin && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md relative p-8"
              >
                <div>
                  <div className="flex justify-center mb-6">
                    <div className="bg-blue-50 text-blue-600 p-4 rounded-full">
                      <Shield size={32} />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-center mb-2 text-slate-900">系統管理員登入</h2>
                  <p className="text-center text-slate-500 mb-6 text-sm">請輸入存取密碼以管理站點資源</p>
                  
                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">授權密碼</label>
                      <input 
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-lg bg-white transition-all shadow-sm"
                        placeholder="請輸入密碼..."
                        autoFocus
                      />
                    </div>
                    <div className="flex space-x-3 mt-8 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setShowAdminLogin(false)}
                        className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors rounded-lg"
                      >
                        取消
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors rounded-lg shadow-sm shadow-blue-600/20"
                      >
                        確認登入
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAboutModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mb-[10vh] max-h-[85vh] overflow-hidden flex flex-col relative"
              >
                {/* Decorative Header */}
                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 pt-10 pb-16 px-8 relative overflow-hidden shrink-0">
                  <div className="absolute top-0 right-0 p-8 transform rotate-12 opacity-10 pointer-events-none">
                    <Info size={120} />
                  </div>
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  
                  <button 
                    onClick={() => setShowAboutModal(false)}
                    className="absolute right-4 top-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full z-10 transition-colors outline-none"
                  >
                    <X size={18} />
                  </button>

                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4 transform -rotate-3 hover:rotate-0 transition-transform">
                      <Map size={32} className="text-indigo-600" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">關於我們</h3>
                    <p className="text-indigo-100 font-bold uppercase tracking-widest text-[11px] mt-1.5 opacity-80">Platform Introduction</p>
                  </div>
                </div>

                {/* Content Area */}
                <div className="bg-white p-6 sm:p-8 -mt-8 rounded-t-3xl relative z-10 overflow-y-auto flex-1 custom-scrollbar">
                  <div className="space-y-6 text-slate-600 leading-relaxed text-sm">
                    <p className="text-base font-medium text-slate-800 text-center">
                      致力於提供全國各學區高中職免試入學落點分析的公益平台。
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center gap-2">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                          <Target size={20} />
                        </div>
                        <h4 className="font-bold text-slate-800">精準預測</h4>
                        <p className="text-xs text-slate-500">協助國中畢業生與家長更輕鬆地對應理想學校。</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center gap-2">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                          <Heart size={20} />
                        </div>
                        <h4 className="font-bold text-slate-800">公益免費</h4>
                        <p className="text-xs text-slate-500">系統由我們團隊開發，免費提供予大眾使用。</p>
                      </div>
                    </div>

                    <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100/50">
                      <p className="text-[13px] text-slate-600 text-center">
                        本站包含基北區、桃連區、竹苗區、中投區等多個就學區的落點分析。<br/>
                        我們致力於提供最精準的資訊，幫助每一位國中生發掘潛能，探索最適合的發展方向。<br/><br/>
                        <span className="font-bold text-indigo-600">若系統使用上有任何建議或發現錯誤，敬請隨時聯繫我們！</span>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showPrivacyModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mb-[10vh] max-h-[85vh] overflow-hidden flex flex-col relative"
              >
                <div className="bg-gradient-to-br from-slate-700 to-slate-900 pt-10 pb-16 px-8 relative overflow-hidden shrink-0">
                  <div className="absolute top-0 right-0 p-8 transform rotate-12 opacity-10 pointer-events-none">
                    <Shield size={120} className="text-white" />
                  </div>
                  
                  <button 
                    onClick={() => setShowPrivacyModal(false)}
                    className="absolute right-4 top-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full z-10 transition-colors outline-none"
                  >
                    <X size={18} />
                  </button>

                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center shadow-lg mb-4 text-white">
                      <FileText size={32} />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">隱私權政策</h3>
                    <p className="text-slate-300 font-bold uppercase tracking-widest text-[11px] mt-1.5 opacity-80">Privacy Policy</p>
                  </div>
                </div>

                <div className="bg-white p-6 sm:p-8 -mt-8 rounded-t-3xl relative z-10 overflow-y-auto flex-1 custom-scrollbar">
                  <div className="space-y-6 text-slate-600 leading-relaxed text-sm">
                    <p className="font-medium text-slate-700 text-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                      為了讓您能夠安心使用本網站的各項服務，特此向您說明本網站的隱私權保護政策：
                    </p>

                    <div className="space-y-4">
                      <div className="relative pl-5 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-indigo-500 before:rounded-full">
                        <h4 className="font-black text-slate-800 mb-1">一、資料收集與使用</h4>
                        <p className="text-[13px] text-slate-500">
                          本網站主要提供外部連結之彙整，我們<span className="font-bold text-slate-700">不會主動收集</span>使用者的姓名、身份證字號等個人敏感資料。您的「我的收藏」紀錄僅儲存於您個人的瀏覽器（Local Storage）中，本網站伺服器不會讀取或備份您的收藏清單。我們僅紀錄網站各連結的點擊次數作為熱門程度之排序依據。
                        </p>
                      </div>
                      
                      <div className="relative pl-5 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-blue-500 before:rounded-full">
                        <h4 className="font-black text-slate-800 mb-1">二、外部網站連結</h4>
                        <p className="text-[13px] text-slate-500">
                          本網站的網頁提供其他網站的網路連結，您也可經由本網站所提供的連結點選進入其他網站。但該連結網站不適用本網站的隱私權保護政策，您必須參考該連結網站中的隱私權保護政策。
                        </p>
                      </div>

                      <div className="relative pl-5 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-emerald-500 before:rounded-full">
                        <h4 className="font-black text-slate-800 mb-1">三、政策修改</h4>
                        <p className="text-[13px] text-slate-500">
                          本網站隱私權保護政策將因應需求隨時進行修正，修正後的條款將刊登於網站上以供查閱。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showContactModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md mb-[10vh] overflow-hidden flex flex-col relative"
              >
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 sm:p-10 relative overflow-hidden flex flex-col items-center text-center">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <button 
                    onClick={() => setShowContactModal(false)}
                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 bg-white/60 hover:bg-white p-2 rounded-full z-10 transition-colors outline-none shadow-sm"
                  >
                    <X size={18} />
                  </button>

                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md mb-6 relative z-10">
                    <Mail size={36} className="text-indigo-500" />
                    <div className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border-2 border-white"></span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight z-10">聯絡我們</h3>
                  <p className="text-slate-500 font-medium text-sm mt-3 z-10 max-w-xs">
                    若您有任何疑問、建議，或是希望提供新的資源連結、回報失效連結，歡迎隨時與我們聯繫！
                  </p>

                  <div className="w-full mt-8 z-10">
                    <a 
                      href="mailto:tyctw.analyze@gmail.com" 
                      className="group flex flex-col items-center justify-center bg-white rounded-2xl p-5 shadow-sm border border-indigo-100 hover:border-indigo-300 hover:shadow-md transition-all outline-none"
                    >
                      <span className="text-[11px] font-bold text-indigo-400 tracking-widest uppercase mb-1 drop-shadow-sm">Email Address</span>
                      <span className="text-lg font-black text-indigo-600 group-hover:text-indigo-700 transition-colors">tyctw.analyze@gmail.com</span>
                    </a>
                  </div>
                  
                  <p className="text-[11px] font-bold text-slate-400 mt-6 z-10 hidden sm:block">
                    我們會盡快處理您的來信。祝您金榜題名！
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showShareModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
              onClick={() => setShowShareModal(false)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative"
                onClick={e => e.stopPropagation()}
              >
                <div className="absolute top-4 right-4">
                  <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="text-center">
                  <div className="flex justify-center mb-5">
                    <div className="bg-indigo-50 text-indigo-600 p-4 rounded-full shadow-inner border border-indigo-100">
                      <Share2 size={28} />
                    </div>
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">分享這份導航</h2>
                  <p className="text-slate-500 font-medium text-sm mb-6">讓更多人獲得優質的會考落點資訊</p>
                  
                  <div className="flex justify-center mb-6">
                    <div className="p-3 bg-white rounded-[24px] shadow-sm border border-slate-100">
                      <QRCodeSVG value={window.location.href} size={160} level="H" includeMargin={true} />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <button
                      onClick={() => window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                      className="w-12 h-12 flex items-center justify-center bg-[#00B900] text-white rounded-2xl hover:scale-105 hover:shadow-lg hover:shadow-[#00B900]/20 transition-all outline-none"
                      title="分享至 LINE"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.122.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967 1.739-1.907 2.572-3.843 2.572-5.992zm-18.988-2.595c.129 0 .234.105.234.234v4.153h2.294c.129 0 .234.105.234.234v.667c0 .129-.105.234-.234.234h-3.195c-.129 0-.234-.105-.234-.234v-5.054c0-.129.105-.234.234-.234h.667zm3.834 5.288c0 .129-.105.234-.234.234h-.667c-.129 0-.234-.105-.234-.234v-5.054c0-.129.105-.234.234-.234h.667c.129 0 .234.105.234.234v5.054zm5.097-5.054v5.054c0 .129-.105.234-.234.234h-.667c-.129 0-.234-.105-.234-.234v-3.327l-2.072 3.376c-.053.088-.146.141-.247.141h-.595c-.129 0-.234-.105-.234-.234v-5.054c0-.129.105-.234.234-.234h.667c.129 0 .234.105.234.234v3.32l2.071-3.371c.053-.088.146-.143.248-.143h.594c.129 0 .234.105.234.234zm3.921.896h-1.99v1.272h1.99c.129 0 .234.105.234.234v.667c0 .129-.105.234-.234.234h-1.99v1.368h2.09c.129 0 .234.105.234.234v.667c0 .129-.105.234-.234.234h-2.991c-.129 0-.234-.105-.234-.234v-5.054c0-.129.105-.234.234-.234h3.091c.129 0 .234.105.234.234v.667c0 .129-.105.234-.234.234z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        copyToClipboard();
                        window.open('https://www.instagram.com', '_blank');
                      }}
                      className="w-12 h-12 flex items-center justify-center bg-gradient-to-tr from-[#FFDC80] via-[#F56040] to-[#E1306C] text-white rounded-2xl hover:scale-105 hover:shadow-lg hover:shadow-[#F56040]/20 transition-all outline-none"
                      title="複製連結並開啟 IG"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                      className="w-12 h-12 flex items-center justify-center bg-[#1877F2] text-white rounded-2xl hover:scale-105 hover:shadow-lg hover:shadow-[#1877F2]/20 transition-all outline-none"
                      title="分享至 Facebook"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => window.open(`https://threads.net/intent/post?text=${encodeURIComponent('高中職會考落點分析導航：\n' + window.location.href)}`, '_blank')}
                      className="w-12 h-12 flex items-center justify-center bg-black text-white rounded-2xl hover:scale-105 hover:shadow-lg hover:shadow-black/20 transition-all outline-none"
                      title="分享至 Threads"
                    >
                      <svg viewBox="0 0 192 192" fill="currentColor" className="w-6 h-6">
                        <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 148.82 38.6654C154.606 45.9405 159.206 55.4528 162.138 67.2415L178.297 63.2201C174.793 49.3444 169.213 38.1154 162.062 29.1722C148.406 12.0076 126.963 3.123 97.0132 2.9405C63.2842 3.149 42.11 11.9616 28.5283 29.2319C16.1415 45.0069 10.1983 67.7554 10 96C10.1983 124.245 16.1415 146.993 28.5283 162.768C42.11 180.038 63.2842 188.851 97.0132 189.059C121.564 188.887 138.835 182.887 152.656 169.075C169.406 152.336 171.855 130.685 166.758 113.882C162.91 100.355 154.269 92.5186 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z" />
                      </svg>
                    </button>
                  </div>
                  
                  <button
                    onClick={copyToClipboard}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 font-bold text-sm rounded-2xl transition-all shadow-sm outline-none"
                  >
                    <Copy size={18} className="text-slate-500" />
                    <span>複製連結</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Calculator Modal */}
        <CalculatorModal isOpen={showCalculatorModal} onClose={() => setShowCalculatorModal(false)} />

        {/* Edit Link Modal */}
        <AnimatePresence>
          {editingLink && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                className="bg-white rounded-3xl shadow-2xl border border-indigo-100 w-full max-w-2xl relative p-6 sm:p-8 overflow-y-auto max-h-[90vh]"
              >
                <div className="flex justify-between items-center mb-6 border-b border-indigo-50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 text-indigo-600 p-2.5 rounded-xl">
                      <Edit2 size={24} />
                    </div>
                    <h2 className="text-xl font-black text-slate-800">編輯資源</h2>
                  </div>
                  <button onClick={() => setEditingLink(null)} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="group">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{editFormData.category === '常見問答' ? '問題 (Q)' : '網站名稱'}</label>
                    <input 
                      type="text" value={editFormData.title || ''} onChange={e => setEditFormData({...editFormData, title: e.target.value})}
                      className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 rounded-xl"
                    />
                  </div>
                  <div className="group">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">網址 URL</label>
                    <input 
                      type="text" value={editFormData.url || ''} onChange={e => setEditFormData({...editFormData, url: e.target.value})}
                      className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 rounded-xl"
                    />
                  </div>
                  <div className="group sm:col-span-2">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{editFormData.category === '常見問答' ? '解答 (A)' : '網站描述'}</label>
                    <input 
                      type="text" value={editFormData.description || ''} onChange={e => setEditFormData({...editFormData, description: e.target.value})}
                      className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 rounded-xl"
                    />
                  </div>
                  <div className="group">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">圖示/標籤</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" placeholder="fas fa-home" value={editFormData.icon || ''} onChange={e => setEditFormData({...editFormData, icon: e.target.value})}
                        className="w-3/5 bg-slate-50 text-slate-900 px-4 py-2.5 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 rounded-xl"
                      />
                      <input 
                        type="text" placeholder="標籤" value={editFormData.badge || ''} onChange={e => setEditFormData({...editFormData, badge: e.target.value})}
                        className="w-2/5 bg-slate-50 text-slate-900 px-4 py-2.5 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="group">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">分類/區域</label>
                    <div className="flex gap-2">
                       <select 
                        value={editFormData.category || ''} onChange={e => setEditFormData({...editFormData, category: e.target.value})}
                        className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 rounded-xl"
                      >
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="group">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">區域</label>
                    <div className="flex gap-2">
                      <select 
                        value={editFormData.region || ''} onChange={e => setEditFormData({...editFormData, region: e.target.value})}
                        className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 rounded-xl"
                      >
                        {['全國', '基北區', '桃連區', '中投區', '高雄區', '台南區'].map(reg => <option key={reg} value={reg}>{reg}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="group">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">置頂開始</label>
                    <input 
                      type="date" value={editFormData.pinned_start || ''} onChange={e => setEditFormData({...editFormData, pinned_start: e.target.value})}
                      className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 rounded-xl"
                    />
                  </div>
                  <div className="group">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">置頂結束</label>
                    <input 
                      type="date" value={editFormData.pinned_end || ''} onChange={e => setEditFormData({...editFormData, pinned_end: e.target.value})}
                      className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 rounded-xl"
                    />
                  </div>
                </div>
                <div className="mt-8 flex gap-4">
                  <button onClick={() => setEditingLink(null)} className="w-1/3 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">取消</button>
                  <button onClick={saveEditedLink} className="w-2/3 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-600/20">儲存變更</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Banner Area */}
        <section className="w-full relative rounded-[2.5rem] p-8 sm:p-12 lg:p-16 flex flex-col mb-10 overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
          {/* Cosmic Premium Background FX */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/gplay.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-slate-900/90 to-slate-900 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-indigo-500/20 via-purple-500/10 to-transparent rounded-full blur-[100px] pointer-events-none -translate-y-1/4 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/20 via-teal-500/5 to-transparent rounded-full blur-[80px] pointer-events-none translate-y-1/3 -translate-x-1/4"></div>
          
          {/* subtle grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none animate-[pulse_10s_ease-in-out_infinite]"></div>

          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none scale-150 transform-origin-center -rotate-12 mix-blend-screen text-indigo-400">
            <Map size={400} strokeWidth={0.5} />
          </div>
          
          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-950/50 backdrop-blur-xl border border-indigo-500/30 rounded-2xl mb-8 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-indigo-200 tracking-[0.2em] uppercase">
                115學年度線上支援系統
              </span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] mb-6 tracking-tight text-white drop-shadow-lg">
              <span className="block mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-200">會考落點分析與</span>
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-fuchsia-300">志願選填導航</span>
                {/* Text glowing effect behind */}
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 blur-2xl opacity-40 z-0 select-none">志願選填導航</span>
              </span>
            </h2>
            
            <p className="text-slate-300/90 max-w-2xl mb-10 text-base sm:text-lg leading-relaxed font-medium tracking-wide">
              專為家長、會考生與教育工作者設計。整合全國各招生區大數據分析工具與官方系統入口，提供最即時、可靠的落點分析導引，協助您做出最佳的升學決策。
            </p>
            
            {/* Stats / Features highlight row */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-10 border-t border-white/10 pt-8 mt-4">
              <div className="flex items-center gap-3 border-r border-white/10 pr-6 sm:pr-10">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shadow-[inset_0_0_15px_rgba(99,102,241,0.2)]">
                  <Database size={18} className="text-indigo-300" />
                </div>
                <div>
                  <div className="text-white font-black tracking-wider text-lg">大數據</div>
                  <div className="text-indigo-300/70 text-[10px] uppercase tracking-widest font-bold">Data Driven</div>
                </div>
              </div>
              <div className="flex items-center gap-3 border-r border-white/10 pr-6 sm:pr-10">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center shadow-[inset_0_0_15px_rgba(168,85,247,0.2)]">
                  <Target size={18} className="text-purple-300" />
                </div>
                <div>
                  <div className="text-white font-black tracking-wider text-lg">精準落點</div>
                  <div className="text-purple-300/70 text-[10px] uppercase tracking-widest font-bold">Precision</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shadow-[inset_0_0_15px_rgba(16,185,129,0.2)]">
                  <Globe size={18} className="text-emerald-300" />
                </div>
                <div>
                  <div className="text-white font-black tracking-wider text-lg">全國涵蓋</div>
                  <div className="text-emerald-300/70 text-[10px] uppercase tracking-widest font-bold">Nationwide</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Unified Admin Dashboard */}
        <AnimatePresence>
          {isAdmin && (
            <motion.section 
              initial={{ opacity: 0, height: 0, marginBottom: 0, scale: 0.98 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 32, scale: 1 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0, scale: 0.98 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-900/10 border border-slate-200 overflow-hidden relative z-20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-white/50 to-indigo-50/50 pointer-events-none"></div>
              
              <div className="px-6 py-5 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 bg-white/40">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 text-slate-600 p-2 rounded-xl shadow-inner">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">系統中控台</h3>
                    <p className="text-[10px] font-bold text-slate-500/80 uppercase tracking-widest mt-0.5">Admin Management Dashboard</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <button
                    onClick={() => setActiveAdminTab('links')}
                    className="flex flex-col items-center justify-center gap-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-lg hover:border-indigo-300 hover:scale-105 transition-all text-indigo-600 group outline-none"
                  >
                    <div className="bg-indigo-50 p-4 rounded-xl group-hover:bg-indigo-100 transition-colors">
                      <Link size={28} />
                    </div>
                    <span className="font-bold text-sm text-slate-700">資源連結</span>
                  </button>
                  <button
                    onClick={() => setActiveAdminTab('announcements')}
                    className="flex flex-col items-center justify-center gap-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-lg hover:border-teal-300 hover:scale-105 transition-all text-teal-600 group outline-none"
                  >
                    <div className="bg-teal-50 p-4 rounded-xl group-hover:bg-teal-100 transition-colors">
                      <Bell size={28} />
                    </div>
                    <span className="font-bold text-sm text-slate-700">系統公告</span>
                  </button>
                  <button
                    onClick={() => setActiveAdminTab('events')}
                    className="flex flex-col items-center justify-center gap-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-lg hover:border-fuchsia-300 hover:scale-105 transition-all text-fuchsia-600 group outline-none"
                  >
                    <div className="bg-fuchsia-50 p-4 rounded-xl group-hover:bg-fuchsia-100 transition-colors">
                      <CalendarDays size={28} />
                    </div>
                    <span className="font-bold text-sm text-slate-700">重要日程</span>
                  </button>
                  <button
                    onClick={() => setActiveAdminTab('analytics')}
                    className="flex flex-col items-center justify-center gap-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-lg hover:border-sky-300 hover:scale-105 transition-all text-sky-600 group outline-none"
                  >
                    <div className="bg-sky-50 p-4 rounded-xl group-hover:bg-sky-100 transition-colors">
                      <BarChart3 size={28} />
                    </div>
                    <span className="font-bold text-sm text-slate-700">點擊分析</span>
                  </button>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeAdminTab && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setActiveAdminTab(null)}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl relative w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10 shrink-0">
                  <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    {activeAdminTab === 'links' && <><LayoutTemplate size={20} className="text-indigo-500" /> 資源連結管理</>}
                    {activeAdminTab === 'announcements' && <><Bell size={20} className="text-teal-500" /> 系統公告管理</>}
                    {activeAdminTab === 'events' && <><CalendarDays size={20} className="text-fuchsia-500" /> 重要日程管理</>}
                    {activeAdminTab === 'analytics' && <><BarChart3 size={20} className="text-sky-500" /> 資源點擊次數統計</>}
                  </h3>
                  <button onClick={() => setActiveAdminTab(null)} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors outline-none cursor-pointer">
                    <X size={24} />
                  </button>
                </div>

                <div className="flex-grow overflow-y-auto w-full relative">
                {activeAdminTab === 'links' && (
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2"><LayoutTemplate size={16} className="text-indigo-500" /> 新增連結資源</h4>
                      <button
                        type="button"
                        onClick={handleValidateLinks}
                        disabled={isValidating}
                        className="flex max-w-fit items-center gap-2 px-4 py-2 bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isValidating ? (
                          <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Link size={14} />
                        )}
                        <span>{isValidating ? '檢查中...' : '檢查失效連結'}</span>
                      </button>
                    </div>
                <form onSubmit={handleAddLink} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                  <div className="md:col-span-3 group">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-600 transition-colors">
                      <LayoutTemplate size={14} /> {newCategory === '常見問答' ? '問題 (Q)' : '網站名稱'}
                    </label>
                    <input 
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="例如：桃連區會考落點"
                      className="w-full bg-white/70 text-slate-900 px-4 py-2.5 border border-slate-200/80 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 text-sm rounded-xl transition-all shadow-sm"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-4 group">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-600 transition-colors">
                      <Link size={14} /> 網址 URL
                    </label>
                    <input 
                      type="text"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-white/70 text-slate-900 px-4 py-2.5 border border-slate-200/80 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 text-sm rounded-xl transition-all shadow-sm"
                      required={newCategory !== '常見問答'}
                    />
                  </div>

                  <div className="md:col-span-5 group">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-600 transition-colors">
                      <AlignLeft size={14} /> {newCategory === '常見問答' ? '解答 (A)' : '網站描述'}
                    </label>
                    <input 
                      type="text"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="簡短介紹資源內容..."
                      className="w-full bg-white/70 text-slate-900 px-4 py-2.5 border border-slate-200/80 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 text-sm rounded-xl transition-all shadow-sm"
                    />
                  </div>
                  
                  <div className="md:col-span-3 group">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-600 transition-colors">
                      <Image size={14} /> 圖示 (FontAwesome)
                    </label>
                    <input 
                      type="text"
                      value={newIcon}
                      onChange={(e) => setNewIcon(e.target.value)}
                      placeholder="e.g. fas fa-home"
                      className="w-full bg-white/70 text-slate-900 px-4 py-2.5 border border-slate-200/80 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 text-sm rounded-xl transition-all shadow-sm"
                    />
                  </div>

                  <div className="md:col-span-2 group">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-600 transition-colors">
                      <Tag size={14} /> 標籤 Badge
                    </label>
                    <input 
                      type="text"
                      value={newBadge}
                      onChange={(e) => setNewBadge(e.target.value)}
                      placeholder="e.g. 最新"
                      className="w-full bg-white/70 text-slate-900 px-4 py-2.5 border border-slate-200/80 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 text-sm rounded-xl transition-all shadow-sm"
                    />
                  </div>

                  <div className="md:col-span-2 group">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-600 transition-colors">
                      <Folder size={14} /> 群組分類
                    </label>
                    <div className="relative">
                      <select 
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full bg-white/70 text-slate-900 px-4 py-2.5 border border-slate-200/80 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 text-sm rounded-xl cursor-pointer transition-all appearance-none pr-10 shadow-sm"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 group">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-600 transition-colors">
                      <MapPin size={14} /> 適用區域
                    </label>
                    <div className="relative">
                      <select 
                        value={newRegion}
                        onChange={(e) => setNewRegion(e.target.value)}
                        className="w-full bg-white/70 text-slate-900 px-4 py-2.5 border border-slate-200/80 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 text-sm rounded-xl cursor-pointer transition-all appearance-none pr-10 shadow-sm"
                      >
                        {['全國', '基北區', '桃連區', '竹苗區', '中投區', '彰化區', '雲林區', '嘉義區', '台南區', '高雄區', '屏東區', '花蓮區', '台東區', '澎湖區', '金門區', '連江區'].map(reg => (
                          <option key={reg} value={reg}>{reg}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-3 group">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-600 transition-colors">
                      <Calendar size={14} /> 置頂開始時間
                    </label>
                    <input 
                      type="date"
                      value={newPinnedStart}
                      onChange={(e) => setNewPinnedStart(e.target.value)}
                      className="w-full bg-white/70 text-slate-900 px-4 py-2.5 border border-slate-200/80 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 text-sm rounded-xl transition-all shadow-sm"
                    />
                  </div>

                  <div className="md:col-span-3 group">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-600 transition-colors">
                      <Calendar size={14} /> 置頂結束時間
                    </label>
                    <input 
                      type="date"
                      value={newPinnedEnd}
                      onChange={(e) => setNewPinnedEnd(e.target.value)}
                      className="w-full bg-white/70 text-slate-900 px-4 py-2.5 border border-slate-200/80 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 text-sm rounded-xl transition-all shadow-sm"
                    />
                  </div>

                  <div className="md:col-span-6">
                    <button 
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-0.5 outline-none focus:ring-4 focus:ring-indigo-500/30"
                    >
                      <Plus size={18} />
                      <span>新增資源</span>
                    </button>
                  </div>
                </form>
                  </div>
                )}

                {activeAdminTab === 'announcements' && (
                  <div className="flex-grow flex flex-col pt-2">
                    <div className="px-6 pb-4 flex justify-between items-center border-b border-slate-100 mb-4">
                      <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2"><Bell size={16} className="text-teal-500" /> 系統公告管理</h4>
                      <button 
                        onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
                        className="text-xs font-bold bg-teal-50 text-teal-700 px-4 py-2 rounded-xl border border-teal-200/60 hover:bg-teal-600 hover:text-white transition-all duration-300 flex items-center gap-2 shadow-sm group hover:shadow-md"
                      >
                        {showAnnouncementForm ? <X size={14} /> : <Plus size={14} />}
                        <span>{showAnnouncementForm ? '取消新增' : '新增公告'}</span>
                      </button>
                    </div>

                    {showAnnouncementForm && (
                      <div className="px-6 pb-6 border-b border-teal-100/40 bg-teal-50/20 mb-4">
                        <form onSubmit={handleAddAnnouncement} className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
                    <div className="group">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">公告標題</label>
                      <input 
                        type="text"
                        value={annTitle}
                        onChange={(e) => setAnnTitle(e.target.value)}
                        placeholder="系統發布或重要事項..."
                        className="w-full bg-white/80 text-slate-900 px-4 py-2.5 border border-slate-200/80 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 text-sm rounded-xl transition-all shadow-sm outline-none"
                        required
                      />
                    </div>
                    <div className="group">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">公告內容</label>
                      <input 
                        type="text"
                        value={annContent}
                        onChange={(e) => setAnnContent(e.target.value)}
                        placeholder="詳細內容或說明..."
                        className="w-full bg-white/80 text-slate-900 px-4 py-2.5 border border-slate-200/80 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 text-sm rounded-xl transition-all shadow-sm outline-none"
                      />
                    </div>
                    <div className="group md:col-span-2">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">顯示形式</label>
                      <select 
                        value={annDisplayType}
                        onChange={(e) => setAnnDisplayType(e.target.value as 'banner' | 'modal')}
                        className="w-full bg-white/80 text-slate-900 px-4 py-2.5 border border-slate-200/80 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 text-sm rounded-xl transition-all shadow-sm outline-none"
                      >
                        <option value="banner">跑馬燈/橫幅 (Banner)</option>
                        <option value="modal">彈出視窗 (Modal)</option>
                      </select>
                    </div>
                    <div className="group">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">開始顯示時間</label>
                      <input 
                        type="date"
                        value={annStart}
                        onChange={(e) => setAnnStart(e.target.value)}
                        className="w-full bg-white/80 text-slate-900 px-4 py-2.5 border border-slate-200/80 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 text-sm rounded-xl transition-all shadow-sm outline-none"
                      />
                    </div>
                    <div className="group">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">結束顯示時間</label>
                      <input 
                        type="date"
                        value={annEnd}
                        onChange={(e) => setAnnEnd(e.target.value)}
                        className="w-full bg-white/80 text-slate-900 px-4 py-2.5 border border-slate-200/80 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 text-sm rounded-xl transition-all shadow-sm outline-none"
                      />
                    </div>
                    <div className="md:col-span-2 mt-2">
                      <button 
                        type="submit"
                        className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg outline-none"
                      >
                        發佈公告
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="p-0 max-h-60 overflow-y-auto relative z-10">
                {announcements.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-sm">目前沒有任何公告</div>
                ) : (
                  <div className="divide-y divide-teal-100">
                    {announcements.map(ann => (
                      <div key={ann.id} className="p-4 px-6 flex items-center justify-between hover:bg-teal-50/50 transition-colors">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`w-2 h-2 rounded-full ${ann.is_active ? 'bg-teal-500' : 'bg-slate-300'}`}></span>
                            <span className="font-bold text-slate-800">{ann.title}</span>
                          </div>
                          <p className="text-xs text-slate-500 truncate max-w-md">{ann.content || '無詳細內容'}</p>
                          <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wide">
                            {ann.start_date || '即時'} ~ {ann.end_date || '永久'}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteAnnouncement(ann.id)}
                          className="text-slate-400 hover:text-red-500 p-2 border border-transparent hover:border-red-100 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                </div>
              </div>
            )}

            {activeAdminTab === 'events' && (
                  <div className="flex-grow flex flex-col pt-2">
                    <div className="px-6 pb-4 flex justify-between items-center border-b border-slate-100 mb-4">
                      <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2"><CalendarDays size={16} className="text-fuchsia-500" /> 重要日程管理</h4>
                      <button 
                        onClick={() => setShowEventForm(!showEventForm)}
                        className="text-xs font-bold bg-fuchsia-50 text-fuchsia-700 px-4 py-2 rounded-xl border border-fuchsia-200/60 hover:bg-fuchsia-600 hover:text-white transition-all duration-300 flex items-center gap-2 shadow-sm group hover:shadow-md"
                      >
                        {showEventForm ? <X size={14} /> : <Plus size={14} />}
                        <span>{showEventForm ? '取消新增' : '新增重要日程'}</span>
                      </button>
                    </div>

                    {showEventForm && (
                      <div className="px-6 pb-6 border-b border-fuchsia-100/40 bg-fuchsia-50/20 mb-4">
                        <form onSubmit={handleAddEvent} className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
                    <div className="group">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">日程標題</label>
                      <input 
                        type="text"
                        value={evtTitle}
                        onChange={(e) => setEvtTitle(e.target.value)}
                        placeholder="例如：會考寄發准考證..."
                        className="w-full bg-white/80 text-slate-900 px-4 py-2.5 border border-slate-200/80 focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-400 text-sm rounded-xl transition-all shadow-sm outline-none"
                        required
                      />
                    </div>
                    <div className="group">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">開始日期</label>
                      <input 
                        type="date"
                        value={evtDate}
                        onChange={(e) => setEvtDate(e.target.value)}
                        className="w-full bg-white/80 text-slate-900 px-4 py-2.5 border border-slate-200/80 focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-400 text-sm rounded-xl transition-all shadow-sm outline-none"
                        required
                      />
                    </div>
                    <div className="group">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">開始時間 (選填)</label>
                      <input 
                        type="time"
                        value={evtTime}
                        onChange={(e) => setEvtTime(e.target.value)}
                        className="w-full bg-white/80 text-slate-900 px-4 py-2.5 border border-slate-200/80 focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-400 text-sm rounded-xl transition-all shadow-sm outline-none"
                      />
                    </div>
                    <div className="group">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">結束日期 (選填)</label>
                      <input 
                        type="date"
                        value={evtEndDate}
                        onChange={(e) => setEvtEndDate(e.target.value)}
                        className="w-full bg-white/80 text-slate-900 px-4 py-2.5 border border-slate-200/80 focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-400 text-sm rounded-xl transition-all shadow-sm outline-none"
                      />
                    </div>
                    <div className="group">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">結束時間 (選填)</label>
                      <input 
                        type="time"
                        value={evtEndTime}
                        onChange={(e) => setEvtEndTime(e.target.value)}
                        className="w-full bg-white/80 text-slate-900 px-4 py-2.5 border border-slate-200/80 focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-400 text-sm rounded-xl transition-all shadow-sm outline-none"
                      />
                    </div>
                    <div className="md:col-span-2 mt-2">
                      <button 
                        type="submit"
                        className="w-full py-3 px-4 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg outline-none"
                      >
                        新增日程
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="p-0 max-h-60 overflow-y-auto relative z-10">
                {events.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-sm">目前沒有任何日程排程</div>
                ) : (
                  <div className="divide-y divide-fuchsia-100">
                    {events.sort((a, b) => {
                      const timeA = new Date(`${a.date}T${(a.time && a.time.length === 5) ? a.time + ':00' : (a.time || '00:00:00')}+08:00`).getTime();
                      const timeB = new Date(`${b.date}T${(b.time && b.time.length === 5) ? b.time + ':00' : (b.time || '00:00:00')}+08:00`).getTime();
                      return timeA - timeB;
                    }).map(evt => (
                      <div key={evt.id} className="p-4 px-6 flex items-center justify-between hover:bg-fuchsia-50/50 transition-colors">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-fuchsia-500"></span>
                            <span className="font-bold text-slate-800">{evt.title}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">
                            {evt.date} {evt.time}
                            {(evt.end_date || evt.end_time) && ' ~ '}
                            {evt.end_date} {evt.end_time}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteEvent(evt.id)}
                          className="text-slate-400 hover:text-red-500 p-2 border border-transparent hover:border-red-100 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                </div>
              </div>
              )}

              {activeAdminTab === 'analytics' && (
                <div className="flex-grow flex flex-col pt-2 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2"><BarChart3 size={16} className="text-sky-500" /> 資源點擊次數統計</h4>
                  </div>
                  
                  <div className="bg-white p-4 rounded-2xl border border-slate-200">
                    <h5 className="font-bold text-sm text-slate-600 mb-4 px-2">Top 10 熱門資源</h5>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[...links].sort((a, b) => (b.click_count || 0) - (a.click_count || 0)).slice(0, 10).map(l => ({ name: l.title, clicks: l.click_count || 0 }))}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => val.length > 5 ? val.substring(0,5)+'...' : val} />
                          <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                            cursor={{ fill: '#f1f5f9' }}
                          />
                          <Bar dataKey="clicks" name="點擊次數" radius={[4, 4, 0, 0]}>
                            {
                              [...links].sort((a, b) => (b.click_count || 0) - (a.click_count || 0)).slice(0, 10).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#38bdf8' : index === 1 ? '#7dd3fc' : '#e0f2fe'} />
                              ))
                            }
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-2 relative z-10 w-full overflow-x-auto">
                    <div className="min-w-[600px] divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200">
                      <div className="flex border-b border-sky-100 bg-sky-50/50 p-4 font-bold text-slate-600 text-xs tracking-wider">
                        <div className="w-[8%] text-center">排名</div>
                        <div className="w-[42%]">資源標題</div>
                        <div className="w-[15%]">區域</div>
                        <div className="w-[20%]">類別</div>
                        <div className="w-[15%] text-right">點擊次數</div>
                      </div>
                      {[...links].sort((a, b) => (b.click_count || 0) - (a.click_count || 0)).map((link, idx) => (
                        <div key={link.id} className="flex p-4 text-sm font-medium hover:bg-slate-50 transition-colors items-center">
                          <div className="w-[8%] text-center">
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${idx === 0 ? 'bg-amber-100 text-amber-700 font-black' : idx < 3 ? 'bg-slate-100 text-slate-700 font-bold' : 'text-slate-400'}`}>
                              {idx + 1}
                            </span>
                          </div>
                          <div className="w-[42%] text-slate-700 pr-4 truncate">{link.title}</div>
                          <div className="w-[15%] text-slate-500">{link.region}</div>
                          <div className="w-[20%] text-slate-500">{link.category}</div>
                          <div className="w-[15%] text-right font-black text-sky-600">{link.click_count || 0}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Link Directory */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 space-y-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-indigo-100/50 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full animate-pulse opacity-90 shadow-lg flex items-center justify-center">
                <Map size={24} className="text-white animate-bounce" />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5">
                <span className="text-indigo-600 font-black tracking-widest text-lg drop-shadow-sm">讀取資料中</span>
                <span className="flex space-x-1">
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '-0.3s' }}></span>
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '-0.15s' }}></span>
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></span>
                </span>
              </div>
              <p className="text-sm font-bold text-slate-400 mt-2 tracking-wide">Connecting to Database...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-10">
            {/* Unified Control Panel */}
            <div className="flex flex-col gap-6 sm:gap-8 w-full relative z-10 bg-white/40 backdrop-blur-xl p-4 sm:p-6 lg:p-8 rounded-[2.5rem] border border-white/60 shadow-xl shadow-indigo-100/50">
              
              {/* Category Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 w-full">
                {CATEGORY_CONFIG.map(cat => {
                  const isActive = activeCategoryFilter === cat.id;
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategoryFilter(cat.id)}
                      className={`relative flex flex-col items-center justify-center p-4 rounded-3xl transition-all duration-300 border overflow-hidden outline-none ${
                          isActive 
                            ? cat.activeClass
                            : 'bg-white/80 backdrop-blur-md text-slate-600 border-slate-200/60 hover:bg-white hover:border-slate-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50'
                        }`}
                    >
                      {isActive && (
                        <div className="absolute inset-0 bg-white/20 blur-[20px] rounded-full w-24 h-24 -top-8 -right-8 pointer-events-none"></div>
                      )}
                      <Icon size={24} className={`mb-2.5 transition-transform duration-300 relative z-10 ${isActive ? 'scale-110 text-white' : cat.color}`} />
                      <span className={`text-[13px] sm:text-sm font-bold tracking-widest relative z-10 ${isActive ? 'text-white' : 'text-slate-700'}`}>
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

              {/* Bottom Section: Region Filters and Search */}
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start justify-between w-full">
                
                {/* Search Section */}
                <div className="w-full lg:w-[350px] xl:w-[400px] shrink-0 order-2 lg:order-1">
                  <div className="flex items-center gap-2 px-1 mb-3">
                    <Search size={16} className="text-indigo-500" />
                    <span className="text-sm font-bold text-slate-600">關鍵字搜尋</span>
                  </div>
                  <div className="relative group w-full shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search size={18} className="text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
                    </div>
                    <input
                      type="text"
                      placeholder="搜尋校系、學區或資源..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white/90 backdrop-blur-sm text-slate-800 text-sm font-bold rounded-2xl pl-11 pr-4 py-3 border border-slate-200/80 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none placeholder-slate-400"
                    />
                  </div>
                  
                  {/* Hot Keywords Tags */}
                  <div className="flex items-center flex-wrap gap-2 mt-3 px-1">
                    <span className="text-[10px] font-bold text-indigo-400/80 flex-shrink-0 tracking-widest uppercase mr-0.5">熱搜:</span>
                    {['落點分析', '歷屆試題', '會考', '志願'].map((kw) => (
                      <button
                        key={kw}
                        onClick={() => setSearchTerm(kw)}
                        className="text-[10px] font-bold bg-white/60 backdrop-blur-md border border-slate-200 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 px-2.5 py-1 rounded-full transition-all flex-shrink-0 outline-none"
                      >
                        {kw}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Region Filters */}
                <div className="w-full flex-grow flex flex-col gap-3 order-1 lg:order-2">
                  <div className="flex items-center gap-2 px-1">
                    <MapPin size={16} className="text-indigo-500" />
                    <span className="text-sm font-bold text-slate-600">就學區篩選</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['全部', '我的收藏', ...Object.keys(REGION_COLORS)].map(region => {
                      const isActive = activeRegionFilter === region;
                      return (
                        <button
                          key={region}
                          onClick={() => setActiveRegionFilter(region)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 border outline-none ${
                            isActive
                              ? region === '我的收藏' ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20' : 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                              : region === '我的收藏' ? 'bg-amber-50/80 backdrop-blur-md text-amber-600 border-amber-200 hover:bg-amber-100 hover:text-amber-700 hover:border-amber-300' : 'bg-white/80 backdrop-blur-md text-slate-600 border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200'
                          }`}
                        >
                          {region === '我的收藏' && <Bookmark size={13} className="inline-block mr-1 -mt-0.5" />}
                          {region}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* Pinned Highlights Section */}
            {pinnedLinks.length > 0 && (
              <section className="mb-14 relative z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50/30 rounded-3xl -mx-6 -my-8 -z-10 border border-amber-100/50 shadow-sm hidden sm:block"></div>
                <div className="flex flex-col mb-6 relative">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-amber-400 to-orange-500 w-8 h-8 rounded-full flex items-center justify-center shadow-md shadow-amber-500/20">
                      <i className="fas fa-star text-white text-sm"></i>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{phaseConfig.title}</h3>
                  </div>
                  <p className="text-sm font-bold text-amber-700/80 mt-1.5 ml-11">{phaseConfig.subtitle}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pinnedLinks.map((link) => (
                    <motion.div
                      key={link.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`group relative overflow-hidden flex flex-col p-6 sm:p-8 rounded-[2rem] bg-white/80 backdrop-blur-xl border ${invalidLinks[link.id] ? 'border-red-400 bg-red-50/50 shadow-[0_8px_30px_rgb(239,68,68,0.1)]' : 'border-amber-200/60 shadow-[0_8px_30px_-5px_rgba(245,158,11,0.15)] hover:shadow-[0_20px_50px_-10px_rgba(245,158,11,0.25)] hover:-translate-y-1 hover:border-amber-300/80'} transition-all duration-500`}
                    >
                      {/* Clean FX */}
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                      <div className="absolute right-0 top-0 w-32 h-32 bg-amber-100/40 rounded-bl-[100px] -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-110 pointer-events-none"></div>

                      {isAdmin && (
                        <div className="absolute top-4 right-4 flex gap-1 z-20">
                          <button
                            onClick={() => startEditingLink(link)}
                            className="text-slate-300 hover:text-amber-600 p-2 rounded-xl hover:bg-amber-50/80 backdrop-blur-sm transition-colors"
                            title="編輯此資源"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(link.id)}
                            className="text-slate-300 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50/80 backdrop-blur-sm transition-colors"
                            title="移除此資源"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                      
                      <div className="flex flex-col flex-grow relative z-10 w-full mt-1">
                        <div className="flex items-start justify-between w-full mb-6">
                           {/* Large Icon */}
                           <div className="relative group-hover:scale-[1.03] transition-transform duration-300 shrink-0">
                             <div className="absolute inset-0 bg-amber-200 blur-xl opacity-0 group-hover:opacity-40 transition-opacity rounded-3xl"></div>
                             {link.icon ? (
                               <div className="relative text-amber-500 bg-amber-50 shadow-[0_4px_15px_-3px_rgba(245,158,11,0.15)] w-[76px] h-[76px] sm:w-[88px] sm:h-[88px] flex items-center justify-center rounded-2xl border border-amber-100/80 group-hover:bg-white group-hover:shadow-[0_8px_30px_-5px_rgba(245,158,11,0.25)] transition-all">
                                 <i className={`${link.icon.replace(' icon', '')} text-4xl sm:text-[44px]`}></i>
                               </div>
                             ) : (
                               <div className="relative text-amber-500 bg-amber-50 shadow-[0_4px_15px_-3px_rgba(245,158,11,0.15)] w-[76px] h-[76px] sm:w-[88px] sm:h-[88px] flex items-center justify-center rounded-2xl border border-amber-100/80 group-hover:bg-white group-hover:shadow-[0_8px_30px_-5px_rgba(245,158,11,0.25)] transition-all">
                                 <LayoutTemplate size={36} className="sm:w-[44px] sm:h-[44px]" strokeWidth={1.5} />
                               </div>
                             )}
                           </div>
                           
                           {/* Badges */}
                           <div className="flex flex-col items-end gap-2 text-right pl-3 shrink-0">
                             <span className={`inline-flex items-center px-2.5 py-1 rounded-[10px] text-[11px] font-bold uppercase tracking-widest bg-slate-50 border border-slate-100 ${REGION_COLORS[link.region] || 'text-slate-600'}`}>
                               {link.category || '重點推薦'}
                             </span>
                             {link.badge && !invalidLinks[link.id] && (
                               <span className="inline-flex items-center px-2.5 py-1 rounded-[10px] text-[11px] font-bold uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100/60">
                                 {link.badge}
                               </span>
                             )}
                             {invalidLinks[link.id] && (
                               <span className="inline-flex items-center px-2.5 py-1 rounded-[10px] text-[11px] font-bold uppercase tracking-widest bg-red-50 text-red-600 border border-red-100 animate-pulse">
                                 連線異常
                               </span>
                             )}
                           </div>
                        </div>

                        {/* Title */}
                        <h4 className="text-[22px] sm:text-[26px] font-black text-slate-800 mb-3 line-clamp-2 leading-[1.3] group-hover:text-amber-600 transition-colors w-full tracking-tight">
                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="outline-none before:absolute before:inset-0" onClick={() => handleLinkClick(link)}>
                            {link.title}
                          </a>
                        </h4>
                        
                        {/* Description */}
                        {link.description ? (
                          <p className="text-[14px] sm:text-[15px] font-medium text-slate-500/90 mb-6 line-clamp-3 leading-[1.6] group-hover:text-slate-600 transition-colors w-full">
                            {link.description}
                          </p>
                        ) : (
                          <span className="text-[13px] text-slate-400 break-all line-clamp-1 mb-6 opacity-70 w-full">
                            {link.url.replace(/^https?:\/\//, '')}
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-auto pt-5 flex items-center justify-between relative z-10 w-full before:absolute before:top-0 before:inset-x-0 before:h-px before:bg-amber-100/40 group-hover:before:bg-amber-200/60 before:transition-colors">
                        <div 
                          className="text-[13px] font-black tracking-widest text-amber-600 group-hover:text-amber-700 flex items-center gap-2 outline-none uppercase"
                        >
                          <span className="relative pb-0.5 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-amber-500 after:transition-all after:duration-300 group-hover:after:w-full">前往探索</span>
                          <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                        </div>
                        <button 
                          onClick={(e) => toggleFavorite(link.id, e)}
                          className={`p-2.5 rounded-xl border transition-all relative z-20 hover:scale-110 active:scale-95 ${favorites.includes(link.id) ? 'bg-amber-100 border-amber-200 text-amber-600 shadow-sm' : 'bg-white border-slate-200 text-slate-300 hover:text-amber-500 hover:border-amber-200'}`}
                        >
                          <Bookmark size={18} fill={favorites.includes(link.id) ? 'currentColor' : 'none'} className={favorites.includes(link.id) ? 'drop-shadow-sm' : ''} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {regionKeys.map((region) => (
              <section key={region} className="mb-12">
                <div className="flex items-center space-x-4 mb-6 relative">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{region}</h3>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 shadow-sm">
                    {groupedLinks[region].length} 個資源庫
                  </span>
                  <div className="flex-grow h-px bg-gradient-to-r from-slate-200 to-transparent ml-2"></div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedLinks[region].map((link) => (
                    <motion.div
                      key={link.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`group relative overflow-hidden flex flex-col p-6 sm:p-8 rounded-[2rem] bg-white border ${invalidLinks[link.id] ? 'border-red-400 bg-red-50/50 shadow-[0_8px_30px_rgb(239,68,68,0.1)]' : 'border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_10px_40px_rgb(99,102,241,0.15)] hover:-translate-y-1.5 hover:border-indigo-200'} transition-all duration-500 will-change-transform`}
                    >
                      {/* Clean FX */}
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                      <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-100/40 rounded-bl-[100px] -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-110 pointer-events-none"></div>

                      {isAdmin && (
                        <div className="absolute top-4 right-4 flex gap-1 z-20">
                          <button
                            onClick={() => startEditingLink(link)}
                            className="text-slate-300 hover:text-indigo-600 p-2 rounded-xl hover:bg-indigo-50/80 backdrop-blur-sm transition-colors"
                            title="編輯此資源"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(link.id)}
                            className="text-slate-300 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50/80 backdrop-blur-sm transition-colors"
                            title="移除此資源"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                      
                      <div className="flex flex-col flex-grow relative z-10 w-full mt-1">
                        <div className="flex items-start justify-between w-full mb-6">
                           {/* Large Icon */}
                           <div className="relative group-hover:scale-[1.03] transition-transform duration-300 shrink-0">
                             <div className="absolute inset-0 bg-indigo-200 blur-xl opacity-0 group-hover:opacity-40 transition-opacity rounded-3xl"></div>
                             {link.icon ? (
                               <div className="relative text-indigo-500 bg-indigo-50 shadow-[0_4px_15px_-3px_rgba(99,102,241,0.12)] w-[76px] h-[76px] sm:w-[88px] sm:h-[88px] flex items-center justify-center rounded-2xl border border-indigo-100/80 group-hover:bg-white group-hover:shadow-[0_8px_30px_-5px_rgba(99,102,241,0.2)] transition-all">
                                 <i className={`${link.icon.replace(' icon', '')} text-4xl sm:text-[44px]`}></i>
                               </div>
                             ) : (
                               <div className="relative text-indigo-500 bg-indigo-50 shadow-[0_4px_15px_-3px_rgba(99,102,241,0.12)] w-[76px] h-[76px] sm:w-[88px] sm:h-[88px] flex items-center justify-center rounded-2xl border border-indigo-100/80 group-hover:bg-white group-hover:shadow-[0_8px_30px_-5px_rgba(99,102,241,0.2)] transition-all">
                                 <LayoutTemplate size={36} className="sm:w-[44px] sm:h-[44px]" strokeWidth={1.5} />
                               </div>
                             )}
                           </div>
                           
                           {/* Badges */}
                           <div className="flex flex-col items-end gap-2 text-right pl-3 shrink-0">
                             <span className={`inline-flex items-center px-2.5 py-1 rounded-[10px] text-[11px] font-bold uppercase tracking-widest bg-slate-50 border border-slate-100/80 ${REGION_COLORS[link.region] || 'text-slate-600'}`}>
                               {link.category || '落點分析'}
                             </span>
                             {link.badge && !invalidLinks[link.id] && (
                               <span className="inline-flex items-center px-2.5 py-1 rounded-[10px] text-[11px] font-bold uppercase tracking-widest bg-indigo-50 text-indigo-600 border border-indigo-100/60">
                                 {link.badge}
                               </span>
                             )}
                             {invalidLinks[link.id] && (
                               <span className="inline-flex items-center px-2.5 py-1 rounded-[10px] text-[11px] font-bold uppercase tracking-widest bg-red-50 text-red-600 border border-red-100 animate-pulse">
                                 連線異常
                               </span>
                             )}
                           </div>
                        </div>

                        {/* Title */}
                        <h4 className="text-[22px] sm:text-[26px] font-black text-slate-800 mb-3 line-clamp-2 leading-[1.3] group-hover:text-indigo-600 transition-colors w-full tracking-tight">
                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="outline-none before:absolute before:inset-0" onClick={() => handleLinkClick(link)}>
                            {link.title}
                          </a>
                        </h4>
                        
                        {/* Description */}
                        {link.description ? (
                          <p className="text-[14px] sm:text-[15px] font-medium text-slate-500/90 mb-6 line-clamp-3 leading-[1.6] group-hover:text-slate-600 transition-colors w-full">
                            {link.description}
                          </p>
                        ) : (
                          <span className="text-[13px] text-slate-400 break-all line-clamp-1 mb-6 opacity-70 w-full">
                            {link.url.replace(/^https?:\/\//, '')}
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-auto pt-5 flex items-center justify-between relative z-10 w-full before:absolute before:top-0 before:inset-x-0 before:h-px before:bg-slate-100 group-hover:before:bg-indigo-100/50 before:transition-colors">
                        <div 
                          className="text-[13px] font-black text-indigo-600 tracking-widest group-hover:text-indigo-700 flex items-center gap-2 outline-none uppercase"
                        >
                          <span className="relative pb-0.5 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-indigo-500 after:transition-all after:duration-300 group-hover:after:w-full">探索專區</span>
                          <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                        </div>
                        <button 
                          onClick={(e) => toggleFavorite(link.id, e)}
                          className={`p-2.5 rounded-xl border transition-all relative z-20 hover:scale-110 active:scale-95 ${favorites.includes(link.id) ? 'bg-indigo-100/80 border-indigo-200 text-indigo-600 shadow-sm' : 'bg-white/80 border-slate-200/80 text-slate-400 hover:text-indigo-500 hover:border-indigo-200 hover:bg-indigo-50'}`}
                        >
                          <Bookmark size={18} fill={favorites.includes(link.id) ? 'currentColor' : 'none'} className={favorites.includes(link.id) ? 'drop-shadow-sm' : ''} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            ))}
            
            {regionKeys.length === 0 && (
              <div className="text-center py-20 px-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                <div className="bg-slate-50 p-4 rounded-full text-slate-400 mb-4 border border-slate-100">
                  <Map size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">查無相符資料 或 本區尚未建置端點</h3>
                <p className="text-slate-500 max-w-md">
                  {isAdmin ? '點擊上方的「中控台 - 新增資料」來開始建構引導系統。' : '目前在該分類或是所有區域中沒有可顯示的資源，請嘗試切換上方的分類標籤。'}
                </p>
                {isAdmin && (
                  <div className="text-left w-full max-w-3xl mt-8 bg-slate-50 border border-amber-200 text-slate-700 p-5 rounded-xl">
                    <p className="text-sm font-bold text-amber-600 mb-2 flex items-center gap-2">
                      <Shield size={16} />
                      Supabase 初始化語法參考
                    </p>
                    <p className="text-xs text-slate-500 mb-3">若為首次部署，請於 Supabase SQL Editor 執行此指令建立基礎架構：</p>
                    <pre className="text-xs bg-slate-900 p-4 rounded-lg text-blue-100 overflow-x-auto font-mono">
{`CREATE TABLE public.exam_links (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  url text NOT NULL,
  region text NOT NULL,
  category text DEFAULT '考後落點',
  description text,
  icon text,
  badge text,
  pinned_start text,
  pinned_end text,
  click_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.announcements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text,
  is_active boolean DEFAULT true,
  display_type text DEFAULT 'banner',
  start_date text,
  end_date text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.admin_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  status text NOT NULL,
  user_agent text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.important_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  date text NOT NULL,
  time text,
  end_date text,
  end_time text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.exam_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow select" ON public.exam_links FOR SELECT USING (true);
CREATE POLICY "Allow insert" ON public.exam_links FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update" ON public.exam_links FOR UPDATE USING (true);
CREATE POLICY "Allow delete" ON public.exam_links FOR DELETE USING (true);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow select" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Allow insert" ON public.announcements FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update" ON public.announcements FOR UPDATE USING (true);
CREATE POLICY "Allow delete" ON public.announcements FOR DELETE USING (true);

ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow select" ON public.admin_logs FOR SELECT USING (true);
CREATE POLICY "Allow insert" ON public.admin_logs FOR INSERT WITH CHECK (true);

ALTER TABLE public.important_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow select" ON public.important_events FOR SELECT USING (true);
CREATE POLICY "Allow insert" ON public.important_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update" ON public.important_events FOR UPDATE USING (true);
CREATE POLICY "Allow delete" ON public.important_events FOR DELETE USING (true);

CREATE TABLE public.admin_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  password text NOT NULL
);

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow select" ON public.admin_settings FOR SELECT USING (true);
CREATE POLICY "Allow update" ON public.admin_settings FOR UPDATE USING (true);

INSERT INTO public.admin_settings (password) VALUES ('admin123');
`}
                    </pre>
                  </div>
                )}
              </div>
            )}
            </div>
            )}
          </>
        ) : activeTab === 'faq' ? (
          <section className="w-full max-w-4xl mx-auto flex flex-col gap-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-3">常見問答</h2>
              <p className="text-slate-500 font-medium">關於落點分析與志願選填的常見疑問，解答一次看懂。</p>
            </div>
            {links.filter(l => l.category === '常見問答').length > 0 ? (
              <div className="grid gap-4">
                {links.filter(l => l.category === '常見問答').map((faq, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={faq.id} 
                    className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-[100px] -mr-16 -mt-16 pointer-events-none group-hover:scale-110 transition-transform"></div>
                    
                    {isAdmin && (
                      <div className="absolute top-4 right-4 flex gap-1 z-20">
                        <button
                          onClick={() => startEditingLink(faq)}
                          className="text-slate-300 hover:text-indigo-600 p-2 rounded-xl hover:bg-indigo-50/80 backdrop-blur-sm transition-colors"
                          title="編輯此問答"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(faq.id)}
                          className="text-slate-300 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50/80 backdrop-blur-sm transition-colors"
                          title="移除此問答"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                    
                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex gap-3 relative z-10 leading-snug">
                      <span className="text-indigo-500 font-black shrink-0">Q.</span>
                      <span>{faq.title}</span>
                    </h3>
                    <div className="text-slate-600 leading-relaxed whitespace-pre-wrap flex gap-3 relative z-10">
                       <span className="text-emerald-500 font-black shrink-0">A.</span>
                       <span>{faq.description || (faq.url !== '#' && faq.url !== '' ? <a href={faq.url} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">參考連結</a> : '尚無詳細解答')}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 px-4 bg-white/60 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                <div className="bg-slate-50 p-4 rounded-full text-slate-400 mb-4 border border-slate-100">
                  <Info size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">尚無常見問答</h3>
                <p className="text-slate-500 max-w-md">
                  {isAdmin ? '點擊中控台的「新增資料」，分類選擇「常見問答」，標題填寫問題，描述填寫解答。' : '目前仍在整理常見問答中，敬請期待。'}
                </p>
              </div>
            )}
          </section>
        ) : null}
      </main>

      {/* Footer Element */}
      <footer className="relative w-full bg-slate-50 border-t border-slate-200/60 mt-auto overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-32 bg-indigo-100/30 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start gap-1">
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
                <Map size={16} />
              </div>
              <h4 className="text-lg font-black text-slate-800 tracking-tight">全國會考落點分析導航中心</h4>
            </div>
            <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Taiwan High School Admission Navigation</p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 bg-white/60 p-1.5 rounded-2xl border border-slate-200/50 shadow-sm backdrop-blur-md">
            <button 
              onClick={() => setShowAboutModal(true)} 
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-white rounded-xl transition-all outline-none"
            >
              <Info size={14} className="hidden sm:block" />
              關於我們
            </button>
            <div className="w-1 h-1 rounded-full bg-slate-300/50 hidden sm:block"></div>
            <button 
              onClick={() => setShowPrivacyModal(true)} 
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-white rounded-xl transition-all outline-none"
            >
              <FileText size={14} className="hidden sm:block" />
              隱私權政策
            </button>
            <div className="w-1 h-1 rounded-full bg-slate-300/50 hidden sm:block"></div>
            <button 
              onClick={() => setShowContactModal(true)} 
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-white rounded-xl transition-all outline-none"
            >
              <Mail size={14} className="hidden sm:block" />
              聯絡我們
            </button>
          </div>

          <div className="flex flex-col items-center lg:items-end gap-2 text-xs text-slate-400 font-medium">
            <span>&copy; {new Date().getFullYear()} TW會考落點分析團隊所屬</span>
            <span className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-100/50 rounded-lg border border-slate-200/50 text-slate-500">
              <Shield size={12} className="text-emerald-500" />
              <span>DB by Supabase</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Global Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-[200] max-w-sm flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border backdrop-blur-xl ${
              toastMessage.type === 'success' 
                ? 'bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/20' 
                : 'bg-rose-500 text-white border-rose-400 shadow-rose-500/20'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 size={24} className="shrink-0" />
            ) : (
              <X size={24} className="shrink-0" />
            )}
            <p className="font-bold text-sm tracking-wide">{toastMessage.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
