// Enhanced JavaScript for Modern TYCTW Platform
// Use persisted settings if available
let currentLanguage = localStorage.getItem('currentLanguage') || 'zh';
let currentMode = localStorage.getItem('currentMode') || 'dark';

const translations = {
  zh: {
    countdown: '115會考倒數',
    title: 'TYCTW會考資訊整合平台',
    comingSoonTitle: '更多功能即將推出！',
    comingSoonDesc: '我們正在不斷努力，為您開發更多有用的工具和資源。敬請期待！',
    footer1: '會考資訊整合平台. All rights reserved.',
    footer2: '由 TYCTW會考落點分析平台 設計與維護',
    loading: '載入中...',
    searchPlaceholder: '搜尋功能或工具...',
    searchTitle: '搜尋功能',
    searchSubtitle: '快速找到您需要的工具和服務',
    featuresTitle: '功能導航',
    featuresSubtitle: '探索我們提供的各種會考相關服務',
    stats: {
      users: '服務用戶',
      accuracy: '準確率',
      hours: '小時服務',
      rating: '用戶評分'
    }
  },
  en: {
    countdown: 'Countdown to 115 Exam',
    title: 'TYCTW Exam Information Integration Platform',
    comingSoonTitle: 'More features coming soon!',
    comingSoonDesc: 'We are constantly working to develop more useful tools and resources for you. Stay tuned!',
    footer1: 'Exam Information Integration Platform. All rights reserved.',
    footer2: 'Designed and maintained by TYCTW Exam Score Analysis Platform',
    loading: 'Loading...',
    searchPlaceholder: 'Search features or tools...',
    searchTitle: 'Search Features',
    searchSubtitle: 'Quickly find the tools and services you need',
    featuresTitle: 'Feature Navigation',
    featuresSubtitle: 'Explore the various exam-related services we provide',
    stats: {
      users: 'Service Users',
      accuracy: 'Accuracy Rate',
      hours: '24/7 Service',
      rating: 'User Rating'
    }
  }
};

// Enhanced Language and Theme Management
function switchLanguage() {
  currentLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
  localStorage.setItem('currentLanguage', currentLanguage);
  updateContent();
  updateLanguageButton();
}

function switchMode() {
  currentMode = currentMode === 'dark' ? 'light' : 'dark';
  localStorage.setItem('currentMode', currentMode);
  document.documentElement.setAttribute('data-theme', currentMode);
  document.body.setAttribute('data-theme', currentMode);
  updateModeIcon();
}

function updateLanguageButton() {
  const languageToggle = document.getElementById('languageToggle');
  if (languageToggle) {
    const btnText = languageToggle.querySelector('.btn-text');
    if (btnText) {
      btnText.textContent = currentLanguage === 'zh' ? 'EN' : '中';
    }
  }
}

function updateModeIcon() {
  const modeIcon = document.querySelector('#modeToggle i');
  if (modeIcon) {
    modeIcon.className = currentMode === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
}

function updateContent() {
  const t = translations[currentLanguage];
  
  // Update hero content
  const heroBadge = document.querySelector('.hero-badge span');
  if (heroBadge) {
    heroBadge.textContent = t.title;
  }
  
  // Update search section
  const searchTitle = document.querySelector('.search-section .section-title');
  if (searchTitle) {
    searchTitle.innerHTML = `<i class="fas fa-search"></i> ${t.searchTitle}`;
  }
  
  const searchSubtitle = document.querySelector('.search-section .section-subtitle');
  if (searchSubtitle) {
    searchSubtitle.textContent = t.searchSubtitle;
  }
  
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.placeholder = t.searchPlaceholder;
  }
  
  // Update features section
  const featuresTitle = document.querySelector('.features-section .section-title');
  if (featuresTitle) {
    featuresTitle.innerHTML = `<i class="fas fa-th-large"></i> ${t.featuresTitle}`;
  }
  
  const featuresSubtitle = document.querySelector('.features-section .section-subtitle');
  if (featuresSubtitle) {
    featuresSubtitle.textContent = t.featuresSubtitle;
  }
  
  // Update stats labels
  const statLabels = document.querySelectorAll('.stat-label');
  if (statLabels.length >= 4) {
    statLabels[0].textContent = t.stats.users;
    statLabels[1].textContent = t.stats.accuracy;
    statLabels[2].textContent = t.stats.hours;
    statLabels[3].textContent = t.stats.rating;
  }
  
  // Update coming soon section
  const comingSoonTitle = document.querySelector('.coming-soon-title');
  if (comingSoonTitle) {
    comingSoonTitle.textContent = t.comingSoonTitle;
  }
  
  const comingSoonDesc = document.querySelector('.coming-soon-description');
  if (comingSoonDesc) {
    comingSoonDesc.textContent = t.comingSoonDesc;
  }
  
  // Update footer
  const footerParas = document.querySelectorAll('.footer-copyright p');
  if (footerParas.length >= 2) {
    footerParas[0].textContent = `© 2025 ${t.footer1}`;
    footerParas[1].textContent = t.footer2;
  }
  
  // Update loading text
  const loadingText = document.querySelector('.loading-text');
  if (loadingText) {
    loadingText.textContent = t.loading;
  }
  
  // Update countdown label
  const countdownLabel = document.querySelector('.countdown-label span');
  if (countdownLabel) {
    countdownLabel.textContent = t.countdown;
  }
}

// Enhanced Countdown Timer
function updateCountdown() {
  const examDate = new Date("2026-05-16T00:00:00+08:00");
  const now = new Date();
  const difference = examDate - now;

  if (difference > 0) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // Update countdown display with animation
    updateCountdownElement('days', days);
    updateCountdownElement('hours', hours);
    updateCountdownElement('minutes', minutes);
    updateCountdownElement('seconds', seconds);
  } else {
    // Exam has passed
    document.querySelectorAll('.countdown-number').forEach(el => {
      el.textContent = '00';
    });
  }
}

function updateCountdownElement(id, value) {
  const element = document.getElementById(id);
  if (element && element.textContent !== value.toString().padStart(2, '0')) {
    element.style.transform = 'scale(1.1)';
    element.textContent = value.toString().padStart(2, '0');
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 200);
  }
}

// Enhanced Search Functionality
class SearchManager {
  constructor() {
    this.searchInput = document.getElementById('searchInput');
    this.searchClear = document.getElementById('searchClear');
    this.searchSuggestions = document.getElementById('searchSuggestions');
    this.navItems = [];
    this.searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    
    this.init();
  }
  
  init() {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', this.handleSearch.bind(this));
      this.searchInput.addEventListener('focus', this.showSuggestions.bind(this));
      this.searchInput.addEventListener('blur', this.hideSuggestions.bind(this));
    }
    
    if (this.searchClear) {
      this.searchClear.addEventListener('click', this.clearSearch.bind(this));
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', this.handleKeyboard.bind(this));
  }
  
  handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    
    if (query.length > 0) {
      this.searchClear.style.display = 'block';
      this.performSearch(query);
      this.showSuggestions();
    } else {
      this.searchClear.style.display = 'none';
      this.showAllItems();
      this.hideSuggestions();
    }
  }
  
  performSearch(query) {
    this.navItems.forEach((item, index) => {
      const title = item.querySelector('.nav-title')?.textContent.toLowerCase() || '';
      const description = item.querySelector('.nav-description')?.textContent.toLowerCase() || '';
      const isMatch = title.includes(query) || description.includes(query);
      
      if (isMatch) {
        item.style.display = 'block';
        item.style.animation = `fadeInUp 0.5s ease-out ${index * 0.1}s both`;
        this.highlightText(item, query);
      } else {
        item.style.display = 'none';
      }
    });
    
    // Add to search history
    if (query && !this.searchHistory.includes(query)) {
      this.searchHistory.unshift(query);
      this.searchHistory = this.searchHistory.slice(0, 5); // Keep only 5 recent searches
      localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }
  }
  
  highlightText(item, query) {
    const title = item.querySelector('.nav-title');
    const description = item.querySelector('.nav-description');
    
    if (title) {
      title.innerHTML = title.textContent.replace(
        new RegExp(`(${query})`, 'gi'),
        '<mark>$1</mark>'
      );
    }
    
    if (description) {
      description.innerHTML = description.textContent.replace(
        new RegExp(`(${query})`, 'gi'),
        '<mark>$1</mark>'
      );
    }
  }
  
  showAllItems() {
    this.navItems.forEach((item, index) => {
      item.style.display = 'block';
      item.style.animation = `fadeInUp 0.5s ease-out ${index * 0.1}s both`;
      
      // Remove highlighting
      const title = item.querySelector('.nav-title');
      const description = item.querySelector('.nav-description');
      
      if (title) title.innerHTML = title.textContent;
      if (description) description.innerHTML = description.textContent;
    });
  }
  
  showSuggestions() {
    if (this.searchHistory.length > 0 && this.searchInput.value.length === 0) {
      this.searchSuggestions.innerHTML = this.searchHistory
        .map(term => `<div class="suggestion-item" data-term="${term}">${term}</div>`)
        .join('');
      this.searchSuggestions.style.display = 'block';
      
      // Add click handlers to suggestions
      this.searchSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
          this.searchInput.value = item.dataset.term;
          this.handleSearch({ target: this.searchInput });
          this.hideSuggestions();
        });
      });
    }
  }
  
  hideSuggestions() {
    setTimeout(() => {
      this.searchSuggestions.style.display = 'none';
    }, 200);
  }
  
  clearSearch() {
    this.searchInput.value = '';
    this.searchClear.style.display = 'none';
    this.showAllItems();
    this.hideSuggestions();
    this.searchInput.focus();
  }
  
  handleKeyboard(e) {
    if (e.key === 'Escape') {
      this.clearSearch();
    }
  }
  
  setNavItems(items) {
    this.navItems = items;
  }
}

// Enhanced Navigation Effects
class NavigationManager {
  constructor() {
    this.navItems = [];
    this.observer = null;
    this.init();
  }
  
  init() {
    this.setupIntersectionObserver();
  }
  
  setupIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          this.animateNavItem(entry.target);
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
  }
  
  animateNavItem(item) {
    const index = Array.from(this.navItems).indexOf(item);
    item.style.animation = `fadeInUp 0.8s ease-out ${index * 0.1}s both`;
  }
  
  initializeNavEffects() {
    this.navItems = document.querySelectorAll('.nav-item');
    this.navItems.forEach(item => {
      this.observer.observe(item);
    });
  }
}

// Enhanced Stats Animation
class StatsManager {
  constructor() {
    this.stats = document.querySelectorAll('.stat-number');
    this.observer = null;
    this.init();
  }
  
  init() {
    this.setupIntersectionObserver();
  }
  
  setupIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateStat(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    this.stats.forEach(stat => {
      this.observer.observe(stat);
    });
  }
  
  animateStat(element) {
    const target = parseFloat(element.dataset.target);
    const duration = 2000;
    const start = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      
      const current = this.easeOutQuart(progress) * target;
      element.textContent = target % 1 === 0 ? Math.floor(current) : current.toFixed(1);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }
  
  easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }
}

// Enhanced Scroll Management
class ScrollManager {
  constructor() {
    this.scrollProgress = document.getElementById('scrollProgress');
    this.backToTop = document.getElementById('backToTop');
    this.init();
  }
  
  init() {
    this.setupScrollProgress();
    this.setupBackToTop();
    this.setupParallaxEffects();
  }
  
  setupScrollProgress() {
    if (this.scrollProgress) {
      window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        this.scrollProgress.style.transform = `scaleX(${scrollPercent / 100})`;
      });
    }
  }
  
  setupBackToTop() {
    if (this.backToTop) {
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
          this.backToTop.style.display = 'flex';
        } else {
          this.backToTop.style.display = 'none';
        }
      });
      
      this.backToTop.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }
  
  setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.gradient-orb');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${rate * speed}px)`;
      });
    });
  }
}

// Enhanced User Analytics
class AnalyticsManager {
  constructor() {
    this.sessionStart = Date.now();
    this.pageViews = parseInt(localStorage.getItem('pageViews') || '0') + 1;
    localStorage.setItem('pageViews', this.pageViews.toString());
    this.init();
  }
  
  init() {
    this.recordUserInfo();
    this.trackInteractions();
  }
  
  recordUserInfo() {
    const userInfo = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        colorDepth: window.screen.colorDepth,
        pixelRatio: window.devicePixelRatio
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      referrer: document.referrer,
      pagePath: window.location.pathname,
      sessionStart: this.sessionStart,
      pageViews: this.pageViews,
      timestamp: new Date().toISOString()
    };
    
    this.sendToBackend(userInfo);
  }
  
  trackInteractions() {
    // Track button clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('button, .nav-link, .cta-button')) {
        this.trackEvent('click', {
          element: e.target.tagName,
          text: e.target.textContent.trim(),
          className: e.target.className
        });
      }
    });
    
    // Track search queries
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      let searchTimeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          if (e.target.value.length > 2) {
            this.trackEvent('search', {
              query: e.target.value,
              length: e.target.value.length
            });
          }
        }, 500);
      });
    }
  }
  
  trackEvent(eventType, data) {
    const eventData = {
      type: eventType,
      data: data,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionStart
    };
    
    // Store locally for batch sending
    const events = JSON.parse(localStorage.getItem('analyticsEvents') || '[]');
    events.push(eventData);
    localStorage.setItem('analyticsEvents', JSON.stringify(events));
  }
  
  sendToBackend(data) {
    fetch('https://script.google.com/macros/s/AKfycbxeSuJw9T-vHLTHs4uKAaVqIWS4fvDbvZGC_wT_LlWzB6LEy-klJzvncI8eMnY-BpA7/exec', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(() => console.log('Analytics data sent successfully'))
    .catch(error => console.error('Error sending analytics data:', error));
  }
}

// Enhanced Loading Management
class LoadingManager {
  constructor() {
    this.overlay = document.getElementById('loadingOverlay');
    this.init();
  }
  
  init() {
    // Simulate loading time for better UX
    setTimeout(() => {
      this.hideLoading();
    }, 2000);
  }
  
  hideLoading() {
    if (this.overlay) {
      this.overlay.style.animation = 'fadeOut 0.5s ease-out forwards';
      setTimeout(() => {
        this.overlay.style.display = 'none';
      }, 500);
    }
  }
}

// Fetch Navigation Items
async function fetchNavItems() {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbwRsZhyEsERd2QAPJDVNOEKcIFf96C2EoL2N4n8nMErJpq-8FY9Th6JgrDoW_bU8Dewew/exec');
    const data = await response.json();
    
    const navList = document.getElementById('navList');
    if (navList) {
      navList.innerHTML = '';
      
      data.forEach((item, index) => {
        const navItem = document.createElement('div');
        navItem.className = 'nav-item';
        navItem.style.animationDelay = `${index * 0.1}s`;
        navItem.innerHTML = `
          <a href="${item.link}" class="nav-link">
            <i class="${item.icon} icon"></i>
            <span class="nav-title">${item.title}</span>
            <p class="nav-description">${item.description}</p>
            ${item.badge ? `<span class="badge ${item.badge}-badge">${item.badge}</span>` : ''}
          </a>
        `;
        navList.appendChild(navItem);
      });
      
      // Initialize navigation effects
      navigationManager.initializeNavEffects();
      searchManager.setNavItems(document.querySelectorAll('.nav-item'));
    }
  } catch (error) {
    console.error('Error fetching nav items:', error);
  }
}

// Initialize all managers
let searchManager, navigationManager, statsManager, scrollManager, analyticsManager, loadingManager;

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
  // Set initial theme and language
  document.documentElement.setAttribute('data-theme', currentMode);
  document.body.setAttribute('data-theme', currentMode);
  updateModeIcon();
  updateLanguageButton();
  
  // Initialize managers
  searchManager = new SearchManager();
  navigationManager = new NavigationManager();
  statsManager = new StatsManager();
  scrollManager = new ScrollManager();
  analyticsManager = new AnalyticsManager();
  loadingManager = new LoadingManager();
  
  // Set up event listeners
  document.getElementById('languageToggle')?.addEventListener('click', switchLanguage);
  document.getElementById('modeToggle')?.addEventListener('click', switchMode);
  
  // Initialize countdown
  updateCountdown();
  setInterval(updateCountdown, 1000);
  
  // Fetch navigation items
  fetchNavItems();
  
  // Update content with current language
  updateContent();
  
  // Add smooth scroll behavior for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Add CTA button functionality
  document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const buttonText = button.querySelector('span')?.textContent;
      
      if (buttonText?.includes('開始使用')) {
        document.querySelector('.search-section')?.scrollIntoView({
          behavior: 'smooth'
        });
      } else if (buttonText?.includes('了解更多')) {
        document.querySelector('.features-section')?.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
});

// Enhanced security features
document.addEventListener('copy', e => { 
  e.preventDefault(); 
  return false; 
});

document.addEventListener('keyup', e => {
  if (e.key === 'PrintScreen') {
    navigator.clipboard.writeText('');
    alert('截圖功能已被禁用');
  }
});

document.addEventListener('contextmenu', e => { 
  e.preventDefault(); 
});

document.onselectstart = () => false;

// Performance optimization
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    // Load non-critical resources
    console.log('Loading additional resources...');
  });
}

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}