class Dashboard {
  constructor() {
    this.currentSection = 'overview';
    this.breakpoints = { mobile: 1024 };
    this.isSidebarOpen = window.innerWidth > this.breakpoints.mobile;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateResponsiveLayout();
    this.setupCategoryNavigation(); 
  }

  setupCategoryNavigation() {
    document.querySelectorAll('.category-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        document.querySelectorAll('.category-link').forEach(l => l.classList.remove('active'));

        link.classList.add('active');

        const href = link.getAttribute('href');
        const category = href.replace('#', '');

        this.filterProductsByCategory(category);
      });
    });

    document.querySelectorAll('.category-item').forEach(item => {
      const dropdown = item.querySelector('.dropdown-menu');
      if (dropdown) {
        item.addEventListener('mouseenter', () => {
          dropdown.style.display = 'block';
        });
        
        item.addEventListener('mouseleave', () => {
          dropdown.style.display = 'none';
        });
      }
    });

    document.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const itemText = item.textContent.toLowerCase();
        this.filterProductsBySubcategory(itemText);
      });
    });
  }

  filterProductsByCategory(category) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
      const productCategory = card.dataset.category;
      
      if (category === 'all-products' || productCategory === category) {
        card.style.display = 'block';
        card.style.animation = 'fadeIn 0.3s ease-in';
      } else {
        card.style.display = 'none';
      }
    });

    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    this.updateCategoryTitle(category);
  }

  filterProductsBySubcategory(subcategory) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
      const productTitle = card.querySelector('.product-title')?.textContent.toLowerCase() || '';
      const productDescription = card.querySelector('.product-description')?.textContent.toLowerCase() || '';
      
      if (productTitle.includes(subcategory) || productDescription.includes(subcategory)) {
        card.style.display = 'block';
        card.style.animation = 'fadeIn 0.3s ease-in';
      } else {
        card.style.display = 'none';
      }
    });

    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  updateCategoryTitle(category) {
    const categoryTitles = {
      'all-products': 'All Products',
      'business-cards': 'Business Cards',
      'marketing': 'Marketing Materials', 
      'signs-banners': 'Signs & Banners',
      'invitations': 'Invitations & Stationery',
      'stickers': 'Stickers & Labels',
      'gifts': 'Gifts & Décor',
    };
    const sectionTitle = document.querySelector('.section-title');
    if (sectionTitle) {
      sectionTitle.textContent = categoryTitles[category] || 'Products';
    }
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.updateResponsiveLayout());

    document.addEventListener('click', (e) => {
      if (window.innerWidth <= this.breakpoints.mobile && this.isSidebarOpen) {
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.querySelector('.menu-toggle');
        if (!sidebar || !menuToggle) return;
        if (!sidebar.contains(e.target) && e.target !== menuToggle) {
          this.closeSidebar();
        }
      }
    });

    const searchBtn = document.querySelector('.search-box button');
    const searchInput = document.querySelector('.search-box input');
    if (searchBtn) searchBtn.addEventListener('click', () => this.searchProducts());
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.searchProducts();
      });
    }
  }

  updateResponsiveLayout() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    if (!sidebar || !mainContent) return;

    if (window.innerWidth <= this.breakpoints.mobile) {
      sidebar.classList.add('collapsed');
      mainContent.classList.add('expanded');
      this.isSidebarOpen = false;
    } else {
      sidebar.classList.remove('collapsed');
      mainContent.classList.remove('expanded');
      this.isSidebarOpen = true;
    }
  }

  showSection(id) {
    document.querySelectorAll('.dashboard-section').forEach((s) => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) {
      target.classList.add('active');
      this.currentSection = id;
      this.updatePageHeader(id);
    }

    if (window.innerWidth <= this.breakpoints.mobile) this.closeSidebar();
  }

  updatePageHeader(sectionId) {
    const pageTitle = document.getElementById('pageTitle');
    const breadcrumb = document.getElementById('breadcrumb');

    const sectionTitles = {
      overview: 'Dashboard Overview',
      products: 'Our Products & Services',
      orders: 'Order History',
      tracking: 'Track Your Orders',
      cart: 'Shopping Cart',
    };

    const sectionBreadcrumbs = {
      overview: 'Home > Dashboard',
      products: 'Home > Dashboard > Products',
      orders: 'Home > Dashboard > Orders',
      tracking: 'Home > Dashboard > Tracking',
      cart: 'Home > Dashboard > Cart',
    };

    if (pageTitle) pageTitle.textContent = sectionTitles[sectionId] || 'Dashboard';
    if (breadcrumb) breadcrumb.textContent = sectionBreadcrumbs[sectionId] || 'Home > Dashboard';
  }

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    if (!sidebar || !mainContent) return;

    const isSmall = window.innerWidth <= this.breakpoints.mobile;

    if (sidebar.classList.contains('collapsed')) {
      sidebar.classList.remove('collapsed');
      this.isSidebarOpen = true;
      if (!isSmall) mainContent.classList.remove('expanded');
    } else {
      sidebar.classList.add('collapsed');
      this.isSidebarOpen = false;
      if (!isSmall) mainContent.classList.add('expanded');
    }
  }

  closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    sidebar.classList.add('collapsed');
    this.isSidebarOpen = false;
  }

  addToCart(productName, price) {
    console.log(`Added ${productName} (${price}) to cart`);
    alert(`${productName} has been added to your cart!`);
  }

  viewOrder(orderId) {
    console.log(`Viewing order: ${orderId}`);
    alert(`Viewing details for order ${orderId}`);
  }

  trackOrder(orderId) {
    console.log(`Tracking order: ${orderId}`);
    const trackingInfo = this.getTrackingInfo(orderId);
    this.showTrackingModal(orderId, trackingInfo);
  }

  getTrackingInfo(orderId) {
    const trackingData = {
      'JP-2025-001': {
        status: 'In Production',
        estimatedDelivery: '2025-01-18',
        currentLocation: 'Print Floor - Iligan City',
        timeline: [
          { date: '2025-01-15', status: 'Order Placed', location: 'Online Store' },
          { date: '2025-01-15', status: 'Processing', location: 'Prepress - Iligan City' },
          { date: '2025-01-16', status: 'Printing', location: 'Print Floor - Iligan City' },
          { date: '2025-01-17', status: 'In Production', location: 'Finishing - Iligan City' },
        ],
      },
      'JP-2025-003': {
        status: 'Waiting Approval',
        estimatedDelivery: '2025-01-22',
        currentLocation: 'Prepress - Iligan City',
        timeline: [
          { date: '2025-01-08', status: 'Order Placed', location: 'Online Store' },
          { date: '2025-01-08', status: 'Proof Sent', location: 'Prepress - Iligan City' },
          { date: '2025-01-09', status: 'Waiting Approval', location: 'Customer Review' },
        ],
      },
    };

    return (
      trackingData[orderId] || {
        status: 'Order Not Found',
        timeline: [],
        currentLocation: '—',
      }
    );
  }

  showTrackingModal(orderId, trackingInfo) {
    const modal = document.createElement('div');
    modal.className = 'tracking-modal-overlay';
    const status = (trackingInfo.status || '').toLowerCase();
    let badgeClass = 'status-processing';
    if (status.includes('delivered')) badgeClass = 'status-completed';
    else if (status.includes('waiting') || status.includes('pending')) badgeClass = 'status-pending';
    else if (status.includes('cancel')) badgeClass = 'status-cancelled';

    modal.innerHTML = `
      <div class="tracking-modal">
        <div class="modal-header">
          <h3>Order Tracking - ${orderId}</h3>
          <button class="close-modal" aria-label="Close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="tracking-status">
            <h4>Current Status: <span class="status-badge ${badgeClass}">${trackingInfo.status}</span></h4>
            ${
              trackingInfo.estimatedDelivery
                ? `<p>Estimated Delivery: <strong>${trackingInfo.estimatedDelivery}</strong></p>`
                : trackingInfo.deliveredDate
                ? `<p>Delivered on: <strong>${trackingInfo.deliveredDate}</strong></p>`
                : ''
            }
            <p>Current Location: <strong>${trackingInfo.currentLocation || '—'}</strong></p>
          </div>
          <div class="tracking-timeline">
            <h4>Tracking Timeline:</h4>
            ${
              (trackingInfo.timeline || [])
                .map(
                  (item) => `
              <div class="timeline-item">
                <div class="timeline-date">${item.date}</div>
                <div class="timeline-status">${item.status}</div>
                <div class="timeline-location">${item.location}</div>
              </div>`
                )
                .join('') || '<p>No timeline available.</p>'
            }
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });

    modal.querySelector('.close-modal')?.addEventListener('click', () => modal.remove());
  }

  updateCartCount(delta = 1) {
    const counters = document.querySelectorAll('.cart-count');
    counters.forEach((el) => {
      const current = parseInt(el.textContent || '0', 10);
      const next = Math.max(0, current + delta);
      el.textContent = String(next);
      el.style.display = next > 0 ? 'inline' : 'none';
    });
  }

  searchProducts(query) {
    const input = document.querySelector('.search-box input');
    const searchQuery = (typeof query === 'string' ? query : input?.value || '')
      .toLowerCase()
      .trim();

    this.showSection('products');

    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach((card) => {
      const productName = card.querySelector('.product-name, .product-title')?.textContent.toLowerCase();
      const productDescription = card.querySelector('.product-description')?.textContent.toLowerCase();

      if ((productName && productName.includes(searchQuery)) || (productDescription && productDescription.includes(searchQuery))) {
        card.style.display = 'block';
        card.style.animation = 'fadeIn 0.3s ease-in';
      } else {
        card.style.display = 'none';
      }
    });

    const visibleProducts = Array.from(productCards).filter((card) => card.style.display !== 'none');
    this.toggleNoResultsMessage(visibleProducts.length === 0);
  }

  toggleNoResultsMessage(show) {
    let noResultsMsg = document.getElementById('noResultsMessage');

    if (show && !noResultsMsg) {
      noResultsMsg = document.createElement('div');
      noResultsMsg.id = 'noResultsMessage';
      noResultsMsg.className = 'no-results-message';
      noResultsMsg.innerHTML = '<p>No products found matching your search.</p>';
      document.querySelector('.products-grid')?.appendChild(noResultsMsg);
    } else if (!show && noResultsMsg) {
      noResultsMsg.remove();
    }
  }

  filterProducts(category) {
    this.showSection('products');

    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach((card) => {
      const productCategory = card.dataset.category;
      if (category === 'all' || productCategory === category) {
        card.style.display = 'block';
        card.style.animation = 'fadeIn 0.3s ease-in';
      } else {
        card.style.display = 'none';
      }
    });
    
    document.querySelectorAll('.filter-btn').forEach((btn) => btn.classList.remove('active'));
    document.querySelector(`[data-filter="${category}"]`)?.classList.add('active');
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  filterProductsByCategory(category) {
    const productCards = document.querySelectorAll('.product-card');

    this.toggleNoResultsMessage(false);
    
    let visibleCount = 0;
    
    productCards.forEach((card) => {
      const productCategory = card.dataset.category;
      
      if (category === 'all-products' || productCategory === category) {
        card.style.display = 'block';
        card.style.animation = 'fadeIn 0.3s ease-in';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (visibleCount === 0) {
      this.toggleNoResultsMessage(true);
    }

    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  showAllProducts() {
    this.filterProducts('all');
  }

  loadMoreProducts() {
    console.log('Loading more products...');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
      loadMoreBtn.textContent = 'Loading...';
      loadMoreBtn.disabled = true;

      setTimeout(() => {
        loadMoreBtn.textContent = 'Load More Products';
        loadMoreBtn.disabled = false;
      }, 1500);
    }
  }

  exportOrders(format = 'csv') {
    console.log(`Exporting orders as ${format}...`);

    const orders = [
      { id: 'ORD001', date: '2025-08-24', total: '₱1,599.00', status: 'Processing' },
      { id: 'ORD002', date: '2025-08-20', total: '₱899.50', status: 'Delivered' },
    ];

    if (format === 'csv') {
      this.downloadCSV(orders);
    } else if (format === 'pdf') {
      this.downloadPDF(orders);
    }
  }

  downloadCSV(data) {
    const csvContent = [
      'Order ID,Date,Total,Status',
      ...data.map((o) => `${o.id},${o.date},${o.total},${o.status}`),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  downloadPDF(_data) {
    console.log('PDF export functionality would be implemented here');
    alert('PDF export feature coming soon!');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.dashboard = new Dashboard();
  populateCurrentUser();
});

function showSection(sectionId) {
  window.dashboard.showSection(sectionId);
}
function toggleSidebar() {
  window.dashboard.toggleSidebar();
}
function addToCart(productName, price) {
  window.dashboard.addToCart(productName, price);
  window.dashboard.updateCartCount(1);
}
function viewOrder(orderId) {
  window.dashboard.viewOrder(orderId);
}
function trackOrder(orderId) {
  window.dashboard.trackOrder(orderId);
}
function searchProducts() {
  const input = document.querySelector('.search-box input');
  window.dashboard.searchProducts(input ? input.value : '');
}
function filterProducts(category) {
  window.dashboard.filterProducts(category);
}
function showAllProducts() {
  window.dashboard.showAllProducts();
}
function loadMoreProducts() {
  window.dashboard.loadMoreProducts();
}
function exportOrders(format) {
  window.dashboard.exportOrders(format);
}

async function populateCurrentUser() {
  try {
    const res = await fetch('me.php', { credentials: 'include' });
    const data = await res.json();

    if (!data.ok) {
      window.location.replace('julbert.html');
      return;
    }

    const nameEl = document.querySelector('.user-name');
    const emailEl = document.querySelector('.user-email');
    const avatarEl = document.querySelector('.user-avatar');

    if (nameEl)  nameEl.textContent  = data.customer.full_name || '';
    if (emailEl) emailEl.textContent = data.customer.email || '';
    if (avatarEl) {
      const initials = (data.customer.full_name || '')
        .split(/\s+/)
        .filter(Boolean)
        .map(s => s[0].toUpperCase())
        .slice(0,2)
        .join('') || 'JP';
      avatarEl.textContent = initials;
    }
  } catch (e) {
    console.error(e);
  }
}

async function logout() {
  try {
    await fetch('logout.php', { method: 'POST', credentials: 'include' });
  } catch (_) {}
  window.location.replace('julbert.html');
}

function openDashboard() {
  document.getElementById('dashboardModal').style.display = 'flex';
  populateCurrentUser(); 
}

function closeDashboard() {
  document.getElementById('dashboardModal').style.display = 'none';
}

function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    logout();
  }
}

function toggleCart() {
  const cartModal = document.getElementById('cartModal');
  cartModal.classList.toggle('active');
}

function checkout() {
  alert('Checkout functionality would be implemented here');
}
