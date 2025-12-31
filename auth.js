// Authentication System for Artemis Auctions

class AuthSystem {
    constructor() {
        this.users = this.getUsersFromStorage();
        this.currentUser = this.getCurrentUserFromStorage();
        this.adminCredentials = {
            username: 'admin',
            password: 'admin123',
            email: 'admin@artemisauctions.com'
        };
        
        this.init();
    }
    
    // Initialize authentication system
    init() {
        // Check if admin user exists, if not create it
        if (!this.users.some(user => user.username === 'admin')) {
            this.users.push({
                id: this.generateId(),
                username: 'admin',
                email: 'admin@artemisauctions.com',
                password: this.hashPassword('admin123'),
                role: 'admin',
                status: 'active',
                createdAt: new Date().toISOString(),
                lastLogin: null
            });
            this.saveUsersToStorage();
        }
        
        this.updateUI();
    }
    
    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Simple password hashing (in a real app, use proper hashing like bcrypt)
    hashPassword(password) {
        return btoa(password); // Base64 encoding for demo purposes
    }
    
    // Check if password matches hashed password
    checkPassword(password, hashedPassword) {
        return this.hashPassword(password) === hashedPassword;
    }
    
    // Get users from localStorage
    getUsersFromStorage() {
        const users = localStorage.getItem('auction_users');
        return users ? JSON.parse(users) : [];
    }
    
    // Save users to localStorage
    saveUsersToStorage() {
        localStorage.setItem('auction_users', JSON.stringify(this.users));
    }
    
    // Get current user from localStorage
    getCurrentUserFromStorage() {
        const user = localStorage.getItem('current_user');
        return user ? JSON.parse(user) : null;
    }
    
    // Save current user to localStorage
    saveCurrentUserToStorage() {
        if (this.currentUser) {
            localStorage.setItem('current_user', JSON.stringify(this.currentUser));
        } else {
            localStorage.removeItem('current_user');
        }
    }
    
    // Register new user
    register(username, email, password, role = 'bidder') {
        // Check if user already exists
        if (this.users.some(user => user.username === username)) {
            return { success: false, message: 'Username already exists' };
        }
        
        if (this.users.some(user => user.email === email)) {
            return { success: false, message: 'Email already registered' };
        }
        
        // Create new user
        const newUser = {
            id: this.generateId(),
            username,
            email,
            password: this.hashPassword(password),
            role,
            status: 'active',
            createdAt: new Date().toISOString(),
            lastLogin: null,
            bids: [],
            favorites: []
        };
        
        this.users.push(newUser);
        this.saveUsersToStorage();
        
        return { success: true, message: 'Registration successful!', user: newUser };
    }
    
    // Login user
    login(usernameOrEmail, password) {
        // Check admin credentials first
        if (usernameOrEmail === this.adminCredentials.username && password === this.adminCredentials.password) {
            const adminUser = {
                id: 'admin',
                username: 'admin',
                email: 'admin@artemisauctions.com',
                role: 'admin',
                status: 'active',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };
            
            this.currentUser = adminUser;
            this.saveCurrentUserToStorage();
            return { success: true, message: 'Admin login successful!', user: adminUser };
        }
        
        // Check regular users
        const user = this.users.find(user => 
            user.username === usernameOrEmail || user.email === usernameOrEmail
        );
        
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        
        if (!this.checkPassword(password, user.password)) {
            return { success: false, message: 'Incorrect password' };
        }
        
        if (user.status !== 'active') {
            return { success: false, message: 'Account is inactive' };
        }
        
        // Update last login
        user.lastLogin = new Date().toISOString();
        this.saveUsersToStorage();
        
        this.currentUser = user;
        this.saveCurrentUserToStorage();
        
        return { success: true, message: 'Login successful!', user };
    }
    
    // Logout current user
    logout() {
        this.currentUser = null;
        this.saveCurrentUserToStorage();
        return { success: true, message: 'Logged out successfully' };
    }
    
    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }
    
    // Check if user is admin
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }
    
    // Get all users (admin only)
    getAllUsers() {
        return this.users;
    }
    
    // Update user
    updateUser(userId, updates) {
        const userIndex = this.users.findIndex(user => user.id === userId);
        if (userIndex === -1) return false;
        
        this.users[userIndex] = { ...this.users[userIndex], ...updates };
        this.saveUsersToStorage();
        
        // Update current user if it's the same user
        if (this.currentUser && this.currentUser.id === userId) {
            this.currentUser = this.users[userIndex];
            this.saveCurrentUserToStorage();
        }
        
        return true;
    }
    
    // Delete user (admin only)
    deleteUser(userId) {
        const userIndex = this.users.findIndex(user => user.id === userId);
        if (userIndex === -1) return false;
        
        // Don't allow deleting admin if it's the only admin
        if (this.users[userIndex].role === 'admin') {
            const adminCount = this.users.filter(user => user.role === 'admin').length;
            if (adminCount <= 1) return false;
        }
        
        this.users.splice(userIndex, 1);
        this.saveUsersToStorage();
        return true;
    }
    
    // Update UI based on auth state
    updateUI() {
        // Update on index page
        if (document.getElementById('user-greeting')) {
            if (this.isLoggedIn()) {
                document.getElementById('user-greeting').textContent = `Hello, ${this.currentUser.username}`;
                document.getElementById('user-greeting').style.display = 'inline';
                document.getElementById('login-link').style.display = 'none';
                document.getElementById('register-link').style.display = 'none';
                document.getElementById('logout-btn').style.display = 'inline-block';
                
                if (this.isAdmin()) {
                    document.getElementById('admin-link').style.display = 'inline-block';
                } else {
                    document.getElementById('admin-link').style.display = 'none';
                }
            } else {
                document.getElementById('user-greeting').style.display = 'none';
                document.getElementById('login-link').style.display = 'inline-block';
                document.getElementById('register-link').style.display = 'inline-block';
                document.getElementById('logout-btn').style.display = 'none';
                document.getElementById('admin-link').style.display = 'none';
            }
        }
        
        // Update on admin page
        if (document.getElementById('admin-logout')) {
            if (!this.isAdmin()) {
                window.location.href = 'login.html';
            }
        }
        
        // Update on login page
        if (document.getElementById('login-form-content')) {
            if (this.isLoggedIn()) {
                window.location.href = 'index.html';
            }
        }
    }
}

// Initialize auth system
const auth = new AuthSystem();

// Event listeners for login page
document.addEventListener('DOMContentLoaded', function() {
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            
            const result = auth.login(username, password);
            
            const messageEl = document.getElementById('login-message');
            messageEl.textContent = result.message;
            messageEl.className = 'message ' + (result.success ? 'success' : 'error');
            
            if (result.success) {
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }
        });
    }
    
    // Registration form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('register-username').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            const role = document.querySelector('input[name="role"]:checked').value;
            
            // Validation
            if (password.length < 8) {
                showMessage('register-message', 'Password must be at least 8 characters', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showMessage('register-message', 'Passwords do not match', 'error');
                return;
            }
            
            const result = auth.register(username, email, password, role);
            
            const messageEl = document.getElementById('register-message');
            messageEl.textContent = result.message;
            messageEl.className = 'message ' + (result.success ? 'success' : 'error');
            
            if (result.success) {
                // Auto login after registration
                auth.login(username, password);
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }
        });
    }
    
    // Tab switching on login page
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginFormContent = document.getElementById('login-form-content');
    const registerFormContent = document.getElementById('register-form-content');
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.getElementById('switch-to-login');
    
    if (loginTab) {
        loginTab.addEventListener('click', () => switchTab('login'));
        registerTab.addEventListener('click', () => switchTab('register'));
        
        if (switchToRegister) {
            switchToRegister.addEventListener('click', (e) => {
                e.preventDefault();
                switchTab('register');
            });
        }
        
        if (switchToLogin) {
            switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                switchTab('login');
            });
        }
        
        // Check URL for registration parameter
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('register') === 'true') {
            switchTab('register');
        }
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            auth.logout();
            auth.updateUI();
            window.location.reload();
        });
    }
    
    // Admin logout button
    const adminLogoutBtn = document.getElementById('admin-logout');
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', function() {
            auth.logout();
            window.location.href = 'index.html';
        });
    }
    
    function switchTab(tab) {
        if (tab === 'login') {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginFormContent.classList.add('active');
            registerFormContent.classList.remove('active');
        } else {
            loginTab.classList.remove('active');
            registerTab.classList.add('active');
            loginFormContent.classList.remove('active');
            registerFormContent.classList.add('active');
        }
    }
    
    function showMessage(elementId, message, type) {
        const messageEl = document.getElementById(elementId);
        messageEl.textContent = message;
        messageEl.className = 'message ' + type;
    }
});