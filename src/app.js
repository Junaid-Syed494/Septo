// QuickFix Customer App
class QuickFixCustomerApp {
    constructor() {
        this.currentUser = null;
        this.currentView = 'home';
        this.websocket = null;
        this.currentLocation = null;
        this.activeOrder = null;
        
        // Service categories
        this.services = [
            {
                id: 'plumbing',
                name: 'Plumbing',
                icon: '🔧',
                price: '₹500-2000',
                eta: '30 mins',
                available: true
            },
            {
                id: 'electrical',
                name: 'Electrician',
                icon: '⚡',
                price: '₹300-1500',
                eta: '45 mins',
                available: true
            },
            {
                id: 'cleaning',
                name: 'Cleaning',
                icon: '🧹',
                price: '₹400-1200',
                eta: '2 hours',
                available: true
            },
            {
                id: 'ac_service',
                name: 'AC Service',
                icon: '❄️',
                price: '₹600-2500',
                eta: '1 hour',
                available: true
            },
            {
                id: 'carpentry',
                name: 'Carpentry',
                icon: '🔨',
                price: '₹800-3000',
                eta: '3 hours',
                available: true
            },
            {
                id: 'painting',
                name: 'Painting',
                icon: '🎨',
                price: '₹1500-5000',
                eta: '1 day',
                available: false
            }
        ];

        // Sample user data
        this.userData = {
            id: 'user_123',
            name: 'John Doe',
            phone: '+91 9876543210',
            email: 'john@example.com',
            addresses: [
                {
                    id: 'addr_1',
                    type: 'Home',
                    address: 'A-123, Sector 62, Noida',
                    coordinates: { lat: 28.6139, lng: 77.2090 },
                    isDefault: true
                }
            ],
            paymentMethods: [
                { id: 'pm_1', type: 'UPI', details: 'john@paytm', isDefault: true },
                { id: 'pm_2', type: 'Card', details: '**** 1234', isDefault: false }
            ]
        };

        // Sample order data
        this.orderHistory = [
            {
                id: 'order_001',
                service: 'Plumbing',
                provider: 'Rajesh Kumar',
                date: '2025-08-20',
                status: 'completed',
                amount: 800,
                rating: 5
            }
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.requestNotificationPermission();
        this.connectWebSocket();
        this.getCurrentLocation();
        this.renderApp();
    }

    setupEventListeners() {
        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });

        // Handle browser back button
        window.addEventListener('popstate', () => {
            this.renderApp();
        });
    }

    async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            console.log('Notification permission:', permission);
        }
    }

    connectWebSocket() {
        // Simulate WebSocket connection
        console.log('Connecting to WebSocket...');
        
        // Simulate receiving order updates
        setTimeout(() => {
            if (this.activeOrder) {
                this.handleOrderUpdate({
                    orderId: this.activeOrder.id,
                    status: 'provider_assigned',
                    provider: {
                        name: 'Rajesh Kumar',
                        phone: '+91 9876543210',
                        rating: 4.8
                    }
                });
            }
        }, 3000);
    }

    async getCurrentLocation() {
        if ('geolocation' in navigator) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                
                this.currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                console.log('Location obtained:', this.currentLocation);
            } catch (error) {
                console.error('Location error:', error);
            }
        }
    }

    renderApp() {
        const app = document.getElementById('app');
        
        switch (this.currentView) {
            case 'home':
                app.innerHTML = this.renderHomeView();
                break;
            case 'service':
                app.innerHTML = this.renderServiceView();
                break;
            case 'booking':
                app.innerHTML = this.renderBookingView();
                break;
            case 'orders':
                app.innerHTML = this.renderOrdersView();
                break;
            case 'profile':
                app.innerHTML = this.renderProfileView();
                break;
            default:
                app.innerHTML = this.renderHomeView();
        }

        this.attachEventListeners();
    }

    renderHomeView() {
        return `
            <div class="app">
                <header class="header">
                    <div class="header-content">
                        <div class="logo">
                            🔧 QuickFix
                        </div>
                        <button class="location-btn" onclick="app.selectLocation()">
                            📍 ${this.userData.addresses[0].address.split(',')[0]}
                        </button>
                    </div>
                </header>

                <main class="main">
                    <div class="search-container">
                        <h2>What service do you need?</h2>
                        <div class="services-grid">
                            ${this.services.map(service => `
                                <div class="service-card ${!service.available ? 'disabled' : ''}" 
                                     onclick="app.selectService('${service.id}')">
                                    <span class="service-icon">${service.icon}</span>
                                    <div class="service-name">${service.name}</div>
                                    <div class="service-price">${service.price}</div>
                                    <div class="service-eta">⏱ ${service.eta}</div>
                                    ${!service.available ? '<div class="unavailable">Currently unavailable</div>' : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    ${this.activeOrder ? this.renderActiveOrder() : ''}
                </main>

                ${this.renderBottomNav()}
            </div>
        `;
    }

    renderActiveOrder() {
        return `
            <div class="order-status">
                <h3>Current Order</h3>
                <div class="provider-card">
                    <div class="provider-avatar">👨‍🔧</div>
                    <div class="provider-info">
                        <div class="provider-name">${this.activeOrder.provider?.name || 'Finding provider...'}</div>
                        <div class="provider-rating">
                            <span class="rating-stars">⭐ ${this.activeOrder.provider?.rating || 'N/A'}</span>
                            <span>• ETA: ${this.activeOrder.eta || 'Calculating...'}</span>
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="app.viewOrderDetails()">
                        Track
                    </button>
                </div>

                <div class="status-timeline">
                    <div class="status-step completed">
                        <div class="status-icon">✓</div>
                        <div class="status-label">Booked</div>
                    </div>
                    <div class="status-step ${this.activeOrder.status === 'provider_assigned' ? 'active' : ''}">
                        <div class="status-icon">👤</div>
                        <div class="status-label">Assigned</div>
                    </div>
                    <div class="status-step ${this.activeOrder.status === 'en_route' ? 'active' : ''}">
                        <div class="status-icon">🚗</div>
                        <div class="status-label">On the way</div>
                    </div>
                    <div class="status-step ${this.activeOrder.status === 'completed' ? 'active' : ''}">
                        <div class="status-icon">✅</div>
                        <div class="status-label">Completed</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderServiceView() {
        const selectedService = this.services.find(s => s.id === this.selectedServiceId);
        
        return `
            <div class="app">
                <header class="header">
                    <div class="header-content">
                        <button onclick="app.goBack()" style="background:none;border:none;color:white;font-size:1.5rem;">←</button>
                        <div class="logo">${selectedService.name} Service</div>
                        <div></div>
                    </div>
                </header>

                <main class="main">
                    <div class="service-details">
                        <div class="service-card">
                            <span class="service-icon" style="font-size: 4rem;">${selectedService.icon}</span>
                            <h2>${selectedService.name}</h2>
                            <p class="service-price">${selectedService.price}</p>
                            <p class="service-eta">⏱ Estimated time: ${selectedService.eta}</p>
                        </div>

                        <div class="booking-form">
                            <h3>Book ${selectedService.name} Service</h3>
                            
                            <div class="form-group">
                                <label class="form-label">Describe your issue</label>
                                <textarea class="form-input form-textarea" 
                                          placeholder="Please describe what needs to be fixed or serviced..."
                                          id="serviceDescription"></textarea>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Preferred Time</label>
                                <select class="form-input" id="preferredTime">
                                    <option>ASAP (30 mins)</option>
                                    <option>Within 1 hour</option>
                                    <option>Within 2 hours</option>
                                    <option>Schedule for later</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Service Address</label>
                                <select class="form-input" id="serviceAddress">
                                    ${this.userData.addresses.map(addr => `
                                        <option value="${addr.id}" ${addr.isDefault ? 'selected' : ''}>
                                            ${addr.type}: ${addr.address}
                                        </option>
                                    `).join('')}
                                </select>
                            </div>

                            <button class="btn btn-primary" style="width:100%;margin-top:1rem;" onclick="app.proceedToBooking()">
                                Book ${selectedService.name} Service
                            </button>
                        </div>
                    </div>
                </main>

                ${this.renderBottomNav()}
            </div>
        `;
    }

    renderBookingView() {
        return `
            <div class="app">
                <header class="header">
                    <div class="header-content">
                        <button onclick="app.goBack()" style="background:none;border:none;color:white;font-size:1.5rem;">←</button>
                        <div class="logo">Confirm Booking</div>
                        <div></div>
                    </div>
                </header>

                <main class="main">
                    <div class="booking-summary">
                        <h3>Booking Summary</h3>
                        
                        <div class="summary-card">
                            <div class="summary-row">
                                <span>Service:</span>
                                <strong>${this.selectedService?.name}</strong>
                            </div>
                            <div class="summary-row">
                                <span>Time:</span>
                                <strong>ASAP (30 mins)</strong>
                            </div>
                            <div class="summary-row">
                                <span>Address:</span>
                                <strong>${this.userData.addresses[0].address}</strong>
                            </div>
                            <div class="summary-row">
                                <span>Estimated Cost:</span>
                                <strong>₹800</strong>
                            </div>
                        </div>

                        <div class="payment-section">
                            <h4>Payment Method</h4>
                            ${this.userData.paymentMethods.map(pm => `
                                <label class="payment-option">
                                    <input type="radio" name="payment" value="${pm.id}" ${pm.isDefault ? 'checked' : ''}>
                                    <span>${pm.type}: ${pm.details}</span>
                                </label>
                            `).join('')}
                        </div>

                        <button class="btn btn-primary" style="width:100%;margin-top:2rem;" onclick="app.confirmBooking()">
                            Confirm Booking - ₹800
                        </button>
                    </div>
                </main>

                ${this.renderBottomNav()}
            </div>
        `;
    }

    renderOrdersView() {
        return `
            <div class="app">
                <header class="header">
                    <div class="header-content">
                        <div class="logo">My Orders</div>
                    </div>
                </header>

                <main class="main">
                    ${this.activeOrder ? `
                        <div class="active-orders">
                            <h3>Active Order</h3>
                            ${this.renderActiveOrder()}
                        </div>
                    ` : ''}

                    <div class="order-history">
                        <h3>Order History</h3>
                        ${this.orderHistory.map(order => `
                            <div class="order-card">
                                <div class="order-header">
                                    <strong>${order.service}</strong>
                                    <span class="order-date">${order.date}</span>
                                </div>
                                <div class="order-details">
                                    <p>Provider: ${order.provider}</p>
                                    <p>Status: <span class="status-${order.status}">${order.status}</span></p>
                                    <p>Amount: ₹${order.amount}</p>
                                    ${order.rating ? `<p>Rating: ${'⭐'.repeat(order.rating)}</p>` : ''}
                                </div>
                                <div class="order-actions">
                                    <button class="btn btn-primary" onclick="app.reorderService('${order.id}')">
                                        Book Again
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </main>

                ${this.renderBottomNav()}
            </div>
        `;
    }

    renderProfileView() {
        return `
            <div class="app">
                <header class="header">
                    <div class="header-content">
                        <div class="logo">Profile</div>
                    </div>
                </header>

                <main class="main">
                    <div class="profile-section">
                        <div class="profile-header">
                            <div class="profile-avatar">👤</div>
                            <div class="profile-info">
                                <h3>${this.userData.name}</h3>
                                <p>${this.userData.phone}</p>
                                <p>${this.userData.email}</p>
                            </div>
                        </div>

                        <div class="profile-menu">
                            <div class="menu-item" onclick="app.manageAddresses()">
                                <span>📍 Manage Addresses</span>
                                <span>→</span>
                            </div>
                            <div class="menu-item" onclick="app.managePayments()">
                                <span>💳 Payment Methods</span>
                                <span>→</span>
                            </div>
                            <div class="menu-item" onclick="app.viewSupport()">
                                <span>🎧 Support</span>
                                <span>→</span>
                            </div>
                            <div class="menu-item" onclick="app.viewSettings()">
                                <span>⚙️ Settings</span>
                                <span>→</span>
                            </div>
                        </div>
                    </div>
                </main>

                ${this.renderBottomNav()}
            </div>
        `;
    }

    renderBottomNav() {
        return `
            <nav class="bottom-nav">
                <a href="#" class="nav-item ${this.currentView === 'home' ? 'active' : ''}" onclick="app.navigateTo('home')">
                    <div class="nav-icon">🏠</div>
                    <div>Home</div>
                </a>
                <a href="#" class="nav-item ${this.currentView === 'orders' ? 'active' : ''}" onclick="app.navigateTo('orders')">
                    <div class="nav-icon">📋</div>
                    <div>Orders</div>
                </a>
                <a href="#" class="nav-item ${this.currentView === 'profile' ? 'active' : ''}" onclick="app.navigateTo('profile')">
                    <div class="nav-icon">👤</div>
                    <div>Profile</div>
                </a>
            </nav>
        `;
    }

    attachEventListeners() {
        // Prevent default link behavior
        document.querySelectorAll('a[href="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
            });
        });
    }

    // Navigation methods
    navigateTo(view) {
        this.currentView = view;
        this.renderApp();
    }

    selectService(serviceId) {
        const service = this.services.find(s => s.id === serviceId);
        if (!service || !service.available) return;

        this.selectedServiceId = serviceId;
        this.selectedService = service;
        this.currentView = 'service';
        this.renderApp();
    }

    proceedToBooking() {
        const description = document.getElementById('serviceDescription')?.value;
        const preferredTime = document.getElementById('preferredTime')?.value;
        const serviceAddress = document.getElementById('serviceAddress')?.value;

        if (!description.trim()) {
            alert('Please describe the service you need');
            return;
        }

        this.bookingDetails = {
            description,
            preferredTime,
            serviceAddress
        };

        this.currentView = 'booking';
        this.renderApp();
    }

    confirmBooking() {
        // Simulate booking confirmation
        this.activeOrder = {
            id: 'order_' + Date.now(),
            service: this.selectedService.name,
            status: 'searching_provider',
            eta: 'Finding provider...',
            provider: null,
            amount: 800,
            address: this.userData.addresses[0]
        };

        // Show confirmation
        alert('Booking confirmed! Finding the best provider for you.');
        
        // Navigate to home to show tracking
        this.currentView = 'home';
        this.renderApp();

        // Simulate provider assignment
        setTimeout(() => {
            this.handleOrderUpdate({
                orderId: this.activeOrder.id,
                status: 'provider_assigned',
                provider: {
                    name: 'Rajesh Kumar',
                    phone: '+91 9876543210',
                    rating: 4.8
                },
                eta: '25 mins'
            });
        }, 3000);
    }

    handleOrderUpdate(update) {
        if (this.activeOrder && this.activeOrder.id === update.orderId) {
            this.activeOrder.status = update.status;
            if (update.provider) this.activeOrder.provider = update.provider;
            if (update.eta) this.activeOrder.eta = update.eta;

            // Show notification
            this.showNotification(`Order Update: ${this.getStatusText(update.status)}`);
            
            // Re-render if on home screen
            if (this.currentView === 'home') {
                this.renderApp();
            }
        }
    }

    getStatusText(status) {
        const statusTexts = {
            'searching_provider': 'Finding provider',
            'provider_assigned': 'Provider assigned',
            'en_route': 'Provider on the way',
            'arrived': 'Provider arrived',
            'in_progress': 'Work in progress',
            'completed': 'Service completed'
        };
        return statusTexts[status] || status;
    }

    showNotification(message) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('QuickFix', {
                body: message,
                icon: '/icon-192x192.png'
            });
        }
    }

    // Utility methods
    goBack() {
        if (this.currentView === 'service') {
            this.currentView = 'home';
        } else if (this.currentView === 'booking') {
            this.currentView = 'service';
        } else {
            this.currentView = 'home';
        }
        this.renderApp();
    }

    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    // Placeholder methods for future implementation
    selectLocation() { alert('Location selection coming soon!'); }
    viewOrderDetails() { alert('Order details coming soon!'); }
    reorderService(orderId) { alert('Reorder functionality coming soon!'); }
    manageAddresses() { alert('Address management coming soon!'); }
    managePayments() { alert('Payment management coming soon!'); }
    viewSupport() { alert('Support coming soon!'); }
    viewSettings() { alert('Settings coming soon!'); }
}