// Admin Panel Logic for Artemis Auctions

class AdminPanel {
    constructor() {
        this.auth = auth; // Use the same auth instance
        this.items = this.getItemsFromStorage();
        this.bids = this.getBidsFromStorage();
        this.settings = this.getSettingsFromStorage();
        
        this.init();
    }
    
    // Initialize admin panel
    init() {
        if (!this.auth.isAdmin()) {
            window.location.href = 'login.html';
            return;
        }
        
        this.loadStats();
        this.loadUsers();
        this.loadItems();
        this.loadBids();
        this.setupEventListeners();
    }
    
    // Get items from localStorage
    getItemsFromStorage() {
        const items = localStorage.getItem('auction_items');
        return items ? JSON.parse(items) : [];
    }
    
    // Save items to localStorage
    saveItemsToStorage() {
        localStorage.setItem('auction_items', JSON.stringify(this.items));
    }
    
    // Get bids from localStorage
    getBidsFromStorage() {
        const bids = localStorage.getItem('auction_bids');
        return bids ? JSON.parse(bids) : [];
    }
    
    // Save bids to localStorage
    saveBidsToStorage() {
        localStorage.setItem('auction_bids', JSON.stringify(this.bids));
    }
    
    // Get settings from localStorage
    getSettingsFromStorage() {
        const settings = localStorage.getItem('auction_settings');
        return settings ? JSON.parse(settings) : {
            siteTitle: 'Artemis Auctions',
            commissionRate: 15,
            auctionAutoExtend: 2,
            minBidIncrement: 500,
            adminEmail: 'admin@artemisauctions.com'
        };
    }
    
    // Save settings to localStorage
    saveSettingsToStorage() {
        localStorage.setItem('auction_settings', JSON.stringify(this.settings));
    }
    
    // Load stats
    loadStats() {
        const users = this.auth.getAllUsers();
        const activeUsers = users.filter(user => user.status === 'active').length;
        
        // Calculate active bidders (users who placed bids recently)
        const activeBidders = users.filter(user => {
            if (user.lastLogin) {
                const lastLogin = new Date(user.lastLogin);
                const now = new Date();
                const diffHours = (now - lastLogin) / (1000 * 60 * 60);
                return diffHours < 24; // Active in last 24 hours
            }
            return false;
        }).length;
        
        // Calculate total revenue (sum of winning bids)
        const totalRevenue = this.bids
            .filter(bid => bid.status === 'winning')
            .reduce((sum, bid) => sum + bid.amount, 0);
        
        // Update DOM
        document.getElementById('total-users').textContent = users.length;
        document.getElementById('active-bidders-count').textContent = activeBidders;
        document.getElementById('total-items').textContent = this.items.length;
        document.getElementById('total-revenue').textContent = `$${totalRevenue.toLocaleString()}`;
        
        // Update changes (simulated)
        document.getElementById('user-change').textContent = `+${Math.floor(Math.random() * 5)} today`;
        document.getElementById('bidder-change').textContent = `+${Math.floor(Math.random() * 3)} now`;
        document.getElementById('item-change').textContent = `+${Math.floor(Math.random() * 2)} this week`;
        document.getElementById('revenue-change').textContent = `+${(Math.random() * 15).toFixed(1)}% this month`;
    }
    
    // Load users table
    loadUsers() {
        const users = this.auth.getAllUsers();
        const tbody = document.getElementById('users-table-body');
        
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        users.forEach(user => {
            const row = document.createElement('tr');
            
            // Format date
            const joinDate = new Date(user.createdAt);
            const formattedDate = joinDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            row.innerHTML = `
                <td>${user.id.substring(0, 8)}...</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td><span class="user-role ${user.role}">${user.role}</span></td>
                <td>
                    <span class="user-status ${user.status}"></span>
                    ${user.status}
                </td>
                <td>${formattedDate}</td>
                <td class="user-actions">
                    <button class="action-btn edit" data-user-id="${user.id}">Edit</button>
                    ${user.role !== 'admin' ? `<button class="action-btn delete" data-user-id="${user.id}">Delete</button>` : ''}
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        // Add event listeners for action buttons
        document.querySelectorAll('.action-btn.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = e.target.dataset.userId;
                this.editUser(userId);
            });
        });
        
        document.querySelectorAll('.action-btn.delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = e.target.dataset.userId;
                if (confirm('Are you sure you want to delete this user?')) {
                    this.deleteUser(userId);
                }
            });
        });
    }
    
    // Load items grid
    loadItems() {
        const itemsGrid = document.getElementById('items-grid');
        
        if (!itemsGrid) return;
        
        itemsGrid.innerHTML = '';
        
        this.items.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.className = 'item-card';
            
            const statusClass = item.status || 'upcoming';
            const statusText = item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Upcoming';
            
            itemCard.innerHTML = `
                <img src="${item.imageUrl || 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}" 
                     alt="${item.title}" class="item-image">
                <div class="item-content">
                    <h3 class="item-title">${item.title}</h3>
                    <p class="item-details">${item.artist} • ${item.category}</p>
                    <div class="item-meta">
                        <span>Starting: $${item.startingPrice?.toLocaleString() || '0'}</span>
                        <span>${item.currentBid ? `Current: $${item.currentBid.toLocaleString()}` : 'No bids'}</span>
                    </div>
                    <div class="item-status ${statusClass}">${statusText}</div>
                    <div class="item-actions">
                        <button class="action-btn edit" data-item-id="${item.id}">Edit</button>
                        <button class="action-btn delete" data-item-id="${item.id}">Delete</button>
                        ${item.status !== 'live' ? `<button class="action-btn" data-item-id="${item.id}" data-action="start">Start Auction</button>` : ''}
                    </div>
                </div>
            `;
            
            itemsGrid.appendChild(itemCard);
        });
        
        // Add event listeners for item action buttons
        document.querySelectorAll('.item-actions .action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.dataset.itemId;
                const action = e.target.dataset.action;
                
                if (action === 'start') {
                    this.startAuction(itemId);
                } else if (e.target.classList.contains('edit')) {
                    this.editItem(itemId);
                } else if (e.target.classList.contains('delete')) {
                    if (confirm('Are you sure you want to delete this item?')) {
                        this.deleteItem(itemId);
                    }
                }
            });
        });
    }
    
    // Load bids table
    loadBids() {
        const bidsBody = document.getElementById('bids-table-body');
        
        if (!bidsBody) return;
        
        bidsBody.innerHTML = '';
        
        // Get items for reference
        const itemsMap = {};
        this.items.forEach(item => {
            itemsMap[item.id] = item.title;
        });
        
        // Sort bids by time (newest first)
        const sortedBids = [...this.bids].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        sortedBids.forEach(bid => {
            const row = document.createElement('tr');
            const bidTime = new Date(bid.timestamp);
            const formattedTime = bidTime.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            row.innerHTML = `
                <td>${bid.id.substring(0, 8)}...</td>
                <td>${itemsMap[bid.itemId] || 'Unknown Item'}</td>
                <td>${bid.bidderName}</td>
                <td>$${bid.amount.toLocaleString()}</td>
                <td>${formattedTime}</td>
                <td class="bid-status ${bid.status}">${bid.status}</td>
            `;
            
            bidsBody.appendChild(row);
        });
    }
    
    // Add new auction item
    addItem(itemData) {
        const newItem = {
            id: this.generateId(),
            ...itemData,
            createdAt: new Date().toISOString(),
            currentBid: itemData.startingPrice || 0,
            bidCount: 0,
            bids: []
        };
        
        this.items.push(newItem);
        this.saveItemsToStorage();
        
        // Update the auction page if this item is live
        if (itemData.status === 'live') {
            this.updateLiveAuction(newItem);
        }
        
        return newItem;
    }
    
    // Update live auction display
    updateLiveAuction(item) {
        // This would update the main auction page
        // In a real app, you might use a real-time update system
        console.log('Live auction updated:', item.title);
        
        // Save current live item to localStorage for the auction page
        localStorage.setItem('current_live_item', JSON.stringify(item));
    }
    
    // Start auction for an item
    startAuction(itemId) {
        const itemIndex = this.items.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;
        
        this.items[itemIndex].status = 'live';
        this.items[itemIndex].startTime = new Date().toISOString();
        
        // Calculate end time based on timer
        const timerMinutes = this.items[itemIndex].timer || 5;
        const endTime = new Date();
        endTime.setMinutes(endTime.getMinutes() + timerMinutes);
        this.items[itemIndex].endTime = endTime.toISOString();
        
        this.saveItemsToStorage();
        this.updateLiveAuction(this.items[itemIndex]);
        this.loadItems();
        
        this.showMessage('add-item-message', 'Auction started successfully!', 'success');
    }
    
    // Edit user
    editUser(userId) {
        const users = this.auth.getAllUsers();
        const user = users.find(u => u.id === userId);
        
        if (!user) return;
        
        const newRole = prompt('Enter new role (admin/bidder):', user.role);
        if (newRole && (newRole === 'admin' || newRole === 'bidder')) {
            this.auth.updateUser(userId, { role: newRole });
            this.loadUsers();
            this.showMessage('add-item-message', 'User updated successfully!', 'success');
        }
    }
    
    // Delete user
    deleteUser(userId) {
        const success = this.auth.deleteUser(userId);
        if (success) {
            this.loadUsers();
            this.loadStats();
            this.showMessage('add-item-message', 'User deleted successfully!', 'success');
        } else {
            this.showMessage('add-item-message', 'Cannot delete user', 'error');
        }
    }
    
    // Edit item
    editItem(itemId) {
        const item = this.items.find(i => i.id === itemId);
        
        if (!item) return;
        
        // In a real app, you would show a modal form
        const newTitle = prompt('Enter new title:', item.title);
        if (newTitle) {
            const itemIndex = this.items.findIndex(i => i.id === itemId);
            this.items[itemIndex].title = newTitle;
            this.saveItemsToStorage();
            this.loadItems();
            this.showMessage('add-item-message', 'Item updated successfully!', 'success');
        }
    }
    
    // Delete item
    deleteItem(itemId) {
        const itemIndex = this.items.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;
        
        this.items.splice(itemIndex, 1);
        this.saveItemsToStorage();
        this.loadItems();
        this.loadStats();
        this.showMessage('add-item-message', 'Item deleted successfully!', 'success');
    }
    
    // Generate ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Show message
    showMessage(elementId, message, type) {
        const messageEl = document.getElementById(elementId);
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.className = 'message ' + type;
            
            // Clear message after 3 seconds
            setTimeout(() => {
                messageEl.textContent = '';
                messageEl.className = 'message';
            }, 3000);
        }
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Tab switching
        const adminTabs = document.querySelectorAll('.admin-tab');
        const tabContents = document.querySelectorAll('.tab-content');
        
        adminTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.dataset.tab;
                
                // Update active tab
                adminTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show corresponding content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${tabId}-tab`) {
                        content.classList.add('active');
                    }
                });
                
                // Load data for the tab if needed
                if (tabId === 'users') {
                    this.loadUsers();
                } else if (tabId === 'items') {
                    this.loadItems();
                } else if (tabId === 'bids') {
                    this.loadBids();
                } else if (tabId === 'settings') {
                    this.loadSettings();
                }
            });
        });
        
        // Add item form submission
        const addItemForm = document.getElementById('add-item-form');
        if (addItemForm) {
            addItemForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form values
                const itemData = {
                    title: document.getElementById('item-title').value,
                    artist: document.getElementById('item-artist').value,
                    category: document.getElementById('item-category').value,
                    year: document.getElementById('item-year').value,
                    description: document.getElementById('item-description').value,
                    startingPrice: parseFloat(document.getElementById('item-starting-price').value),
                    estimateMin: document.getElementById('item-estimate-min').value ? 
                        parseFloat(document.getElementById('item-estimate-min').value) : null,
                    estimateMax: document.getElementById('item-estimate-max').value ? 
                        parseFloat(document.getElementById('item-estimate-max').value) : null,
                    dimensions: document.getElementById('item-dimensions').value,
                    medium: document.getElementById('item-medium').value,
                    imageUrl: document.getElementById('item-image-url').value,
                    timer: parseInt(document.getElementById('item-timer').value),
                    status: document.getElementById('item-status').value,
                    provenance: document.getElementById('item-provenance').value,
                    condition: document.getElementById('item-condition').value
                };
                
                // Validation
                if (!itemData.title || !itemData.artist || !itemData.startingPrice || !itemData.imageUrl) {
                    this.showMessage('add-item-message', 'Please fill in all required fields', 'error');
                    return;
                }
                
                if (itemData.startingPrice <= 0) {
                    this.showMessage('add-item-message', 'Starting price must be greater than 0', 'error');
                    return;
                }
                
                // Add the item
                const newItem = this.addItem(itemData);
                
                // Show success message
                this.showMessage('add-item-message', 
                    `Item "${newItem.title}" added successfully!`, 'success');
                
                // Reset form
                addItemForm.reset();
                
                // Reload items and stats
                this.loadItems();
                this.loadStats();
                
                // Switch to items tab
                document.querySelector('.admin-tab[data-tab="items"]').click();
            });
        }
        
        // Save settings
        const saveSettingsBtn = document.getElementById('save-settings');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                this.settings = {
                    siteTitle: document.getElementById('site-title').value,
                    commissionRate: parseFloat(document.getElementById('commission-rate').value),
                    auctionAutoExtend: parseInt(document.getElementById('auction-auto-extend').value),
                    minBidIncrement: parseFloat(document.getElementById('min-bid-increment').value),
                    adminEmail: document.getElementById('admin-email').value
                };
                
                this.saveSettingsToStorage();
                this.showMessage('add-item-message', 'Settings saved successfully!', 'success');
            });
        }
        
        // Load settings into form
        this.loadSettings();
    }
    
    // Load settings into form
    loadSettings() {
        document.getElementById('site-title').value = this.settings.siteTitle;
        document.getElementById('commission-rate').value = this.settings.commissionRate;
        document.getElementById('auction-auto-extend').value = this.settings.auctionAutoExtend;
        document.getElementById('min-bid-increment').value = this.settings.minBidIncrement;
        document.getElementById('admin-email').value = this.settings.adminEmail;
    }
}

// Initialize admin panel when on admin page
if (window.location.pathname.includes('admin.html')) {
    const adminPanel = new AdminPanel();
}