// Add favicon dynamically
function addFavicon() {
  // Check if favicon already exists
  if (!document.querySelector('link[rel="icon"]')) {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = 'logo.png';
    document.head.appendChild(link);
  }
}

// Common Navigation Component
function loadNavigation() {
  const headerHTML = `
    <div class="header-container">
      <a href="index.html" class="logo-container">
        <img src="logo.png" alt="Waterfront Energy Logo" class="logo-image" />
      </a>
      <button class="menu-toggle" onclick="toggleMenu()" aria-label="Toggle menu">☰</button>
      <nav id="mainNav">
        <ul>
          <li><a href="about.html">About Us</a></li>
          <li><a href="index.html#business">Business Areas</a></li>
          <li><a href="index.html#projects">Projects</a></li>
          <li><a href="index.html#leadership">Leadership</a></li>
          <li><a href="index.html#investors">Investors</a></li>
          <li><a href="regulatory.html">Regulatory</a></li>
          <li><a href="index.html#contact">Contact Us</a></li>
        </ul>
      </nav>
    </div>
  `;
  
  const header = document.querySelector('header');
  if (header) {
    header.innerHTML = headerHTML;
  }
}

// Common Footer Component
function loadFooter() {
  const footerHTML = `
    <div class="footer-content">
      <div class="footer-section">
        <h4>Company</h4>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About Us</a></li>
          <li><a href="index.html#leadership">Leadership</a></li>
        </ul>
      </div>
      <div class="footer-section">
        <h4>Services</h4>
        <ul>
          <li><a href="index.html#business">Business Areas</a></li>
          <li><a href="index.html#projects">Projects</a></li>
          <li><a href="index.html#investors">Investors</a></li>
        </ul>
      </div>
      <div class="footer-section">
        <h4>Regulatory</h4>
        <ul>
          <li><a href="merc-petitions.html">MERC Petitions</a></li>
          <li><a href="cerc-petitions.html">CERC Petitions</a></li>
          <li><a href="merc-orders.html">MERC Orders</a></li>
          <li><a href="cerc-orders.html">CERC Orders</a></li>
        </ul>
      </div>
      <div class="footer-section">
        <h4>Connect With Us</h4>
        <p style="color: rgba(255,255,255,0.8); margin-bottom: 1rem;">Follow us on social media</p>
        <div class="social-icons">
          <div class="social-icon" aria-label="Facebook">f</div>
          <div class="social-icon" aria-label="Twitter">𝕏</div>
          <div class="social-icon" aria-label="LinkedIn">in</div>
          <div class="social-icon" aria-label="Instagram">📷</div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2025 Waterfront Constructions Pvt Ltd. All rights reserved.</p>
    </div>
  `;
  
  const footer = document.querySelector('footer');
  if (footer) {
    footer.innerHTML = footerHTML;
  }
}

// Load both navigation and footer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  addFavicon();
  loadNavigation();
  loadFooter();
});

