class ContentLoader {
    constructor() {
      this.progressBar = null;
      this.loadedSections = new Set();
      this.init();
    }
  
    init() {
      this.createProgressBar();
      this.observeSections();
      this.handleScroll();
    }
  
    createProgressBar() {
      const bar = document.createElement('div');
      bar.className = 'progress-bar';
      bar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: #007bff;
        transition: width 0.3s ease;
        z-index: 1000;
      `;
      document.body.prepend(bar);
      this.progressBar = bar;
    }
  
    observeSections() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadSection(entry.target);
            this.updateProgress();
          }
        });
      }, { threshold: 0.1 });
  
      document.querySelectorAll('.resume-section').forEach(section => {
        observer.observe(section);
      });
    }
  
    loadSection(section) {
      if (this.loadedSections.has(section.id)) return;
      
      // Add loading animation
      section.style.opacity = '0';
      section.style.transform = 'translateY(20px)';
      
      // Simulate content loading
      setTimeout(() => {
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
        this.loadedSections.add(section.id);
      }, 300);
    }
  
    handleScroll() {
      window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        this.progressBar.style.width = `${scrolled}%`;
      });
    }
  
    updateProgress() {
      const totalSections = document.querySelectorAll('.resume-section').length;
      const loadedPercentage = (this.loadedSections.size / totalSections) * 100;
      this.progressBar.style.width = `${loadedPercentage}%`;
    }
  }
  
  // Initialize loader
  window.addEventListener('DOMContentLoaded', () => {
    new ContentLoader();
  });