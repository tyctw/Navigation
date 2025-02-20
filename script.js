// Use persisted settings if available
let currentLanguage = localStorage.getItem('currentLanguage') || 'zh';
let currentMode = localStorage.getItem('currentMode') || 'dark';

const translations = {
  zh: {
    countdown: '114會考倒數:',
    title: 'TYCTW會考資訊整合平台',
    comingSoonTitle: '更多功能即將推出！',
    comingSoonDesc: '我們正在不斷努力，為您開發更多有用的工具和資源。敬請期待！',
    footer1: '會考資訊整合平台. All rights reserved.',
    footer2: '由 TYCTW會考落點分析平台 設計與維護',
    loading: '載入中...'
  },
  en: {
    countdown: 'Countdown to 114 Exam:',
    title: 'TYCTW Exam Information Integration Platform',
    comingSoonTitle: 'More features coming soon!',
    comingSoonDesc: 'We are constantly working to develop more useful tools and resources for you. Stay tuned!',
    footer1: 'Exam Information Integration Platform. All rights reserved.',
    footer2: 'Designed and maintained by TYCTW Exam Score Analysis Platform',
    loading: 'Loading...'
  }
};

function switchLanguage() {
  currentLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
  localStorage.setItem('currentLanguage', currentLanguage);
  updateContent();
  document.getElementById('languageToggle').textContent = currentLanguage === 'zh' ? 'EN' : '中';
}

function switchMode() {
  currentMode = currentMode === 'dark' ? 'light' : 'dark';
  localStorage.setItem('currentMode', currentMode);
  document.documentElement.setAttribute('data-theme', currentMode);
  document.body.setAttribute('data-theme', currentMode);
  updateModeIcon();
}

function updateModeIcon() {
  const modeIcon = document.querySelector('#modeToggle i');
  modeIcon.className = currentMode === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function updateContent() {
  // Update header title and countdown text
  const heroTitle = document.querySelector('.hero h1');
  if (heroTitle) {
    heroTitle.innerHTML = `<i class="fas fa-graduation-cap"></i> ${translations[currentLanguage].title}`;
  }
  
  updateCountdown();
  
  // Update coming soon section
  const comingSoonHeading = document.querySelector('.coming-soon h2');
  if (comingSoonHeading) {
    comingSoonHeading.innerHTML = `<i class="fas fa-rocket"></i> ${translations[currentLanguage].comingSoonTitle}`;
  }
  const comingSoonDesc = document.querySelector('.coming-soon p');
  if (comingSoonDesc) {
    comingSoonDesc.textContent = translations[currentLanguage].comingSoonDesc;
  }
  
  // Update footer text
  const footerParas = document.querySelectorAll('.footer p');
  if (footerParas.length >= 2) {
    footerParas[0].textContent = ` 2025 ${translations[currentLanguage].footer1}`;
    footerParas[1].textContent = translations[currentLanguage].footer2;
  }
  
  // Update loading text if visible
  const loadingText = document.querySelector('.loading-text');
  if (loadingText) {
    loadingText.textContent = translations[currentLanguage].loading;
  }
}

// Enhanced user information recording
function recordUserInfo() {
  // Get browser and OS info
  const ua = navigator.userAgent;
  const browserInfo = getBrowserInfo(ua);
  const osInfo = getOSInfo(ua);
  const deviceType = getDeviceType();

  // Get battery info
  let batteryInfo = { level: 'unknown', charging: 'unknown' };
  if ('getBattery' in navigator) {
    navigator.getBattery().then(battery => {
      batteryInfo = {
        level: battery.level,
        charging: battery.charging
      };
    });
  }

  // Get network info
  let networkType = 'unknown';
  if ('connection' in navigator) {
    networkType = navigator.connection.effectiveType || navigator.connection.type;
  }

  // Get CPU info
  const cpuCores = navigator.hardwareConcurrency || 'unknown';

  // Get memory info
  let memoryUsage = 'unknown';
  if ('memory' in performance) {
    memoryUsage = performance.memory.usedJSHeapSize;
  }

  // Session duration
  const sessionStart = sessionStorage.getItem('sessionStart') || Date.now();
  sessionStorage.setItem('sessionStart', sessionStart);
  const sessionDuration = Date.now() - sessionStart;

  // Compile user info
  const userInfo = {
    userAgent: navigator.userAgent,
    browser: browserInfo.browser,
    os: osInfo.os,
    deviceType: deviceType,
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
    sessionDuration: sessionDuration,
    memoryUsage: memoryUsage,
    networkType: networkType,
    cpuCores: cpuCores,
    battery: batteryInfo,
    timestamp: new Date().toISOString()
  };

  // Get IP and geo info
  fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
      userInfo.ip = data.ip;
      return fetch(`https://ipapi.co/${data.ip}/json/`);
    })
    .then(response => response.json())
    .then(geoData => {
      userInfo.geo = {
        country: geoData.country_name,
        region: geoData.region
      };
      
      // Send complete user info to backend
      sendToBackend(userInfo);
    })
    .catch(error => {
      console.error('Error getting location data:', error);
      sendToBackend(userInfo);
    });
}

function getBrowserInfo(ua) {
  if (ua.includes('Firefox')) return { browser: 'Firefox' };
  if (ua.includes('Chrome')) return { browser: 'Chrome' };
  if (ua.includes('Safari')) return { browser: 'Safari' };
  if (ua.includes('Edge')) return { browser: 'Edge' };
  if (ua.includes('Opera')) return { browser: 'Opera' };
  return { browser: 'Unknown' };
}

function getOSInfo(ua) {
  if (ua.includes('Windows')) return { os: 'Windows' };
  if (ua.includes('Mac')) return { os: 'MacOS' };
  if (ua.includes('Linux')) return { os: 'Linux' };
  if (ua.includes('Android')) return { os: 'Android' };
  if (ua.includes('iOS')) return { os: 'iOS' };
  return { os: 'Unknown' };
}

function getDeviceType() {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'Mobile';
  }
  return 'Desktop';
}

function sendToBackend(userInfo) {
  fetch('https://script.google.com/macros/s/AKfycbxeSuJw9T-vHLTHs4uKAaVqIWS4fvDbvZGC_wT_LlWzB6LEy-klJzvncI8eMnY-BpA7/exec', {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userInfo)
  })
  .then(() => console.log('User info recorded successfully'))
  .catch(error => console.error('Error recording user info:', error));
}

// New: Add staggered fade-in animation to navigation items for a smoother appearance.
function initializeNavEffects() {
  const navItems = document.querySelectorAll('#navList .nav-item');
  navItems.forEach((item, index) => {
    item.style.opacity = 0;
    item.style.animation = 'fadeInUp 0.8s ease forwards';
    item.style.animationDelay = `${index * 0.1}s`;
  });
}

// New: Filter navigation items based on the search input.
function filterNavItems() {
  const filter = document.getElementById('searchInput').value.toLowerCase();
  const navItems = document.querySelectorAll('#navList .nav-item');
  navItems.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(filter) ? "block" : "none";
  });
}

// New: Setup Back to Top button functionality.
function setupBackToTop() {
  const backToTopButton = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (document.documentElement.scrollTop > 200 || document.body.scrollTop > 200) {
      backToTopButton.style.display = 'block';
    } else {
      backToTopButton.style.display = 'none';
    }
  });
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function hideLoadingOverlay() {
  const overlay = document.getElementById('loadingOverlay');
  overlay.style.animation = 'fadeOut 0.5s ease-out forwards';
  setTimeout(() => {
    overlay.style.display = 'none';
  }, 500);
}

function updateCountdown() {
  const examDate = new Date("2025-05-17T00:00:00+08:00");
  const now = new Date();
  const difference = examDate - now;

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  const countdownElement = document.getElementById('countdown');
  if (countdownElement) {
    const dayLabel = currentLanguage === 'zh' ? '天' : 'd';
    const hourLabel = currentLanguage === 'zh' ? '小時' : 'h';
    const minuteLabel = currentLanguage === 'zh' ? '分' : 'm';
    const secondLabel = currentLanguage === 'zh' ? '秒' : 's';
    countdownElement.textContent = `${translations[currentLanguage].countdown} ${days}${dayLabel} ${hours}${hourLabel} ${minutes}${minuteLabel} ${seconds}${secondLabel}`;
  }
}

// Fetch navigation items from external source
function fetchNavItems() {
  fetch('https://script.google.com/macros/s/AKfycbwRsZhyEsERd2QAPJDVNOEKcIFf96C2EoL2N4n8nMErJpq-8FY9Th6JgrDoW_bU8Dewew/exec')
    .then(response => response.json())
    .then(data => {
      const navList = document.getElementById('navList');
      data.forEach(item => {
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.innerHTML = `
          <a href="${item.link}" class="nav-link">
            <i class="${item.icon} icon"></i>
            <span class="nav-title">${item.title}</span>
            <p class="nav-description">${item.description}</p>
            ${item.badge ? `<span class="badge ${item.badge}-badge">${item.badge}</span>` : ''}
          </a>
        `;
        navList.appendChild(li);
      });
      initializeNavEffects();
      updateContent();
      document.documentElement.setAttribute('data-theme', currentMode);
      document.body.setAttribute('data-theme', currentMode);
      updateModeIcon();
      hideLoadingOverlay();
    })
    .catch(error => {
      console.error('Error fetching nav items:', error);
      hideLoadingOverlay();
    });
}

// New: Add scroll progress indicator
function updateScrollProgress() {
  const scroll = document.createElement('div');
  scroll.className = 'scroll-progress';
  document.body.appendChild(scroll);

  window.addEventListener('scroll', () => {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / height) * 100;
    scroll.style.transform = `scaleX(${scrolled / 100})`;
  });
}

// New: Enhanced search functionality with highlighting
function searchAndHighlight() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const items = document.querySelectorAll('.nav-item');
  
  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    const match = text.includes(searchTerm);
    
    item.style.display = match ? 'block' : 'none';
    
    if (match && searchTerm) {
      const regex = new RegExp(`(${searchTerm})`, 'gi');
      const titleEl = item.querySelector('.nav-title');
      const descEl = item.querySelector('.nav-description');
      
      titleEl.innerHTML = titleEl.textContent.replace(regex, '<mark>$1</mark>');
      descEl.innerHTML = descEl.textContent.replace(regex, '<mark>$1</mark>');
    }
  });
}

// New: Add scroll-triggered animations
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.nav-item, .coming-soon').forEach(el => {
    observer.observe(el);
  });
}

// Main event listener
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.setAttribute('data-theme', currentMode);
  document.body.setAttribute('data-theme', currentMode);
  updateModeIcon();
  fetchNavItems();
  document.getElementById('languageToggle').addEventListener('click', switchLanguage);
  document.getElementById('modeToggle').addEventListener('click', switchMode);
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Attach event listener for the search functionality
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', filterNavItems);
  }
  
  // Initialize Back to Top button
  setupBackToTop();

  // New: Record user information when the page loads
  recordUserInfo();
  
  updateScrollProgress();
  initScrollAnimations();
  
  // Add search functionality
  if (searchInput) {
    searchInput.addEventListener('input', searchAndHighlight);
  }
  
  // Add smooth scroll behavior
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
});

// Disable copy, PrintScreen, context menu and text selection
document.addEventListener('copy', e => { e.preventDefault(); return false; });
document.addEventListener('keyup', e => {
  if (e.key === 'PrintScreen') {
    navigator.clipboard.writeText('');
    alert('截圖功能已被禁用');
  }
});
document.addEventListener('contextmenu', e => { e.preventDefault(); });
document.onselectstart = () => false;