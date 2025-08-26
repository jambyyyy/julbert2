class Dashboard {
  constructor() {
    this.currentSection = 'overview';
    this.isSidebarOpen = window.innerWidth > 768;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateResponsiveLayout();
  }

  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.updateResponsiveLayout();
    });
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && this.isSidebarOpen) {
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.querySelector('.menu-toggle');
        if (!sidebar || !menuToggle) return;
        if (!sidebar.contains(e.target) && e.target !== menuToggle) {
          this.closeSidebar();
        }
      }
    });
  }

  updateResponsiveLayout() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    if (!sidebar || !mainContent) return;

    if (window.innerWidth <= 768) {
      sidebar.classList.remove('open');
      mainContent.classList.add('expanded');
      this.isSidebarOpen = false;
    } else {
      sidebar.classList.remove('collapsed');
      mainContent.classList.remove('expanded');
      this.isSidebarOpen = true;
    }
  }

  showSection(sectionId) {
    const sections = document.querySelectorAll('.dashboard-section');
    sections.forEach((section) => section.classList.remove('active'));

    const targetSection = document.getElementById(sectionId);
    if (targetSection) targetSection.classList.add('active');

    const navItems = document.querySelectorAll('#sidebar .nav-item');
    navItems.forEach((item) => item.classList.remove('active'));

    const activeNavItem = Array.from(navItems).find((item) =>
      item.getAttribute('onclick')?.includes(sectionId)
    );
    if (activeNavItem) activeNavItem.classList.add('active');

    this.updatePageHeader(sectionId);

    this.currentSection = sectionId;

    if (window.innerWidth <= 768) {
      this.closeSidebar();
    }
  }

  updatePageHeader(sectionId) {
    const pageTitle = document.getElementById('pageTitle');
    const breadcrumb = document.getElementById('breadcrumb');

    const sectionTitles = {
      overview: 'Dashboard Overview',
      products: 'All Products',
      orders: 'Order History',
      tracking: 'Track Orders',
    };

    const sectionBreadcrumbs = {
      overview: 'Home > Dashboard',
      products: 'Home > Dashboard > Products',
      orders: 'Home > Dashboard > Orders',
      tracking: 'Home > Dashboard > Tracking',
    };

    if (pageTitle) pageTitle.textContent = sectionTitles[sectionId] || 'Dashboard';
    if (breadcrumb) breadcrumb.textContent = sectionBreadcrumbs[sectionId] || 'Home > Dashboard';
  }

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    if (!sidebar || !mainContent) return;

    if (window.innerWidth <= 768) {
      if (this.isSidebarOpen) {
        sidebar.classList.remove('open');
        this.isSidebarOpen = false;
      } else {
        sidebar.classList.add('open');
        this.isSidebarOpen = true;
      }
    } else {
      if (this.isSidebarOpen) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
        this.isSidebarOpen = false;
      } else {
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('expanded');
        this.isSidebarOpen = true;
      }
    }
  }

  closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    sidebar.classList.remove('open');
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
      ORD001: {
        status: 'In Transit',
        estimatedDelivery: '2025-08-28',
        currentLocation: 'Distribution Center - Manila',
        timeline: [
          { date: '2025-08-24', status: 'Order Placed', location: 'Online Store' },
          { date: '2025-08-25', status: 'Processing', location: 'Warehouse - Quezon City' },
          { date: '2025-08-26', status: 'Shipped', location: 'Distribution Center - Manila' },
          { date: '2025-08-27', status: 'In Transit', location: 'Distribution Center - Manila' },
        ],
      },
      ORD002: {
        status: 'Delivered',
        deliveredDate: '2025-08-20',
        currentLocation: 'Delivered to Customer',
        timeline: [
          { date: '2025-08-18', status: 'Order Placed', location: 'Online Store' },
          { date: '2025-08-19', status: 'Processing', location: 'Warehouse - Quezon City' },
          { date: '2025-08-19', status: 'Shipped', location: 'Distribution Center - Manila' },
          { date: '2025-08-20', status: 'Out for Delivery', location: 'Local Hub - Quezon City' },
          { date: '2025-08-20', status: 'Delivered', location: 'Customer Address' },
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
    modal.innerHTML = `
      <div class="tracking-modal">
        <div class="modal-header">
          <h3>Order Tracking - ${orderId}</h3>
          <button class="close-modal" aria-label="Close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="tracking-status">
            <h4>Current Status: <span class="status-badge">${trackingInfo.status}</span></h4>
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

    modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
  }

  updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const currentCount = parseInt(cartCount?.textContent || '0', 10);
    if (cartCount) {
      cartCount.textContent = currentCount + 1;
      cartCount.style.display = 'inline';
    }
  }

  searchProducts(query) {
    const productCards = document.querySelectorAll('.product-card');
    const searchQuery = (query || '').toLowerCase().trim();

    productCards.forEach((card) => {
      const productName = card.querySelector('.product-name, .product-title')?.textContent.toLowerCase();
      const productDescription = card.querySelector('.product-description')?.textContent.toLowerCase();

      if ((productName && productName.includes(searchQuery)) || (productDescription && productDescription.includes(searchQuery))) {
        card.style.display = '';
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
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach((card) => {
      const productCategory = card.dataset.category;
      if (category === 'all' || productCategory === category) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });

    document.querySelectorAll('.filter-btn').forEach((btn) => btn.classList.remove('active'));
    document.querySelector(`[data-filter="${category}"]`)?.classList.add('active');
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
});

function showSection(sectionId) {
  window.dashboard.showSection(sectionId);
}

function toggleSidebar() {
  window.dashboard.toggleSidebar();
}

function addToCart(productName, price) {
  window.dashboard.addToCart(productName, price);
  window.dashboard.updateCartCount();
}

function viewOrder(orderId) {
  window.dashboard.viewOrder(orderId);
}

function trackOrder(orderId) {
  window.dashboard.trackOrder(orderId);
}

function searchProducts() {
  const searchInput = document.getElementById('productSearch');
  window.dashboard.searchProducts(searchInput ? searchInput.value : '');
}

function filterProducts(category) {
  window.dashboard.filterProducts(category);
}

function loadMoreProducts() {
  window.dashboard.loadMoreProducts();
}

function exportOrders(format) {
  window.dashboard.exportOrders(format);
}
function logout() {
  alert('Logged out (stub). Hook up your auth here.');
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

document.addEventListener('DOMContentLoaded', populateCurrentUser);
