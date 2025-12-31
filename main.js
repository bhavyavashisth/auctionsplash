// Enhanced Auction Splash Screen JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const countdownTimer = document.getElementById('countdown-timer');
    const currentBidElement = document.getElementById('current-bid');
    const nextBidElement = document.getElementById('next-bid-amount');
    const bidButton = document.getElementById('bid-button');
    const activeBiddersElement = document.getElementById('active-bidders');
    const auctionStatusElement = document.getElementById('auction-status');
    const enterSiteLink = document.getElementById('enter-site');
    const homeLink = document.getElementById('home-link');
    const bidInput = document.getElementById('bid-input');
    const quickBidButtons = document.querySelectorAll('.quick-bid-btn');
    const autoBidCheckbox = document.getElementById('auto-bid-checkbox');
    const autoBidInputContainer = document.getElementById('auto-bid-input-container');
    const autoBidMaxInput = document.getElementById('auto-bid-max');
    const viewBidsBtn = document.getElementById('view-bids-btn');
    const viewAllBiddersBtn = document.getElementById('view-all-bidders');
    const activeBiddersTrigger = document.getElementById('active-bidders-trigger');
    const viewBidsTrigger = document.getElementById('view-bids-trigger');
    const zoomBtn = document.getElementById('zoom-btn');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const countdownProgress = document.getElementById('countdown-progress');
    const totalBidsElement = document.getElementById('total-bids');
    
    // Modal elements
    const biddersModal = document.getElementById('bidders-modal');
    const bidsModal = document.getElementById('bids-modal');
    const zoomModal = document.getElementById('zoom-modal');
    const biddersModalClose = document.getElementById('bidders-modal-close');
    const bidsModalClose = document.getElementById('bids-modal-close');
    const zoomModalClose = document.getElementById('zoom-modal-close');
    
    // Auction data (simulated - will be replaced with live data)
    let auctionData = {
        currentBid: 42500,
        nextBid: 43000,
        activeBidders: 142,
        timeRemaining: 135, // seconds
        totalTime: 300, // 5 minutes total
        isLive: true,
        bidIncrement: 500,
        totalBids: 24,
        bidders: [],
        bids: []
    };
    
    // Generate initial bidders data
    function generateBidders() {
        const bidderNames = [
            "ArtCollector88", "GalleryNY", "ModernArtFan", "VintageHunter", 
            "EuroCollector", "AsianArtLover", "PrivateClient12", "MuseumCurator",
            "InvestmentFundA", "Bidder#0872", "Bidder#1123", "Bidder#0456"
        ];
        
        const locations = ["New York", "London", "Hong Kong", "Paris", "Dubai", "Tokyo"];
        
        auctionData.bidders = [];
        
        for (let i = 0; i < auctionData.activeBidders; i++) {
            const name = i < bidderNames.length ? bidderNames[i] : `Bidder#${1000 + i}`;
            const location = locations[Math.floor(Math.random() * locations.length)];
            const bidCount = Math.floor(Math.random() * 5) + 1;
            const isActive = Math.random() > 0.3;
            
            auctionData.bidders.push({
                id: i + 1,
                name: name,
                location: location,
                bidCount: bidCount,
                isActive: isActive,
                lastActive: Math.floor(Math.random() * 10) + 1 // minutes ago
            });
        }
    }
    
    // Generate initial bids data
    function generateBids() {
        const bidderNames = ["ArtCollector88", "GalleryNY", "ModernArtFan", "VintageHunter", "EuroCollector"];
        
        auctionData.bids = [];
        let currentBidAmount = 35000;
        let timeOffset = 300; // 5 minutes ago
        
        for (let i = 0; i < auctionData.totalBids; i++) {
            const bidder = bidderNames[Math.floor(Math.random() * bidderNames.length)];
            currentBidAmount += Math.floor(Math.random() * 3 + 1) * 500;
            timeOffset -= Math.floor(Math.random() * 15) + 5;
            
            auctionData.bids.push({
                id: i + 1,
                amount: currentBidAmount,
                bidder: bidder,
                time: timeOffset > 0 ? `${timeOffset} seconds ago` : "Just now",
                isWinning: i === auctionData.totalBids - 1
            });
        }
        
        // Update current bid to match last bid
        auctionData.currentBid = currentBidAmount;
        auctionData.nextBid = currentBidAmount + auctionData.bidIncrement;
    }
    
    // Initialize countdown timer
    function updateCountdown() {
        if (auctionData.timeRemaining <= 0) {
            countdownTimer.textContent = "00:00:00";
            auctionStatusElement.textContent = "CLOSED";
            auctionStatusElement.style.color = "#aaa";
            auctionStatusElement.style.animation = "none";
            bidButton.disabled = true;
            bidButton.textContent = "AUCTION CLOSED";
            bidButton.style.backgroundColor = "#555";
            return;
        }
        
        const hours = Math.floor(auctionData.timeRemaining / 3600);
        const minutes = Math.floor((auctionData.timeRemaining % 3600) / 60);
        const seconds = auctionData.timeRemaining % 60;
        
        countdownTimer.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update progress bar
        const progressPercentage = ((auctionData.totalTime - auctionData.timeRemaining) / auctionData.totalTime) * 100;
        countdownProgress.style.width = `${Math.min(progressPercentage, 100)}%`;
        
        // Decrease time every second
        auctionData.timeRemaining--;
        
        // Update bidder count randomly to simulate activity
        if (Math.random() > 0.7 && auctionData.activeBidders < 200) {
            auctionData.activeBidders += Math.floor(Math.random() * 3);
            activeBiddersElement.textContent = auctionData.activeBidders;
            
            // Add new bidder to data
            const locations = ["New York", "London", "Hong Kong", "Paris", "Dubai", "Tokyo"];
            auctionData.bidders.push({
                id: auctionData.bidders.length + 1,
                name: `Bidder#${1000 + auctionData.bidders.length}`,
                location: locations[Math.floor(Math.random() * locations.length)],
                bidCount: 0,
                isActive: true,
                lastActive: 0
            });
        }
    }
    
    // Format currency
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(amount);
    }
    
    // Update bid amounts display
    function updateBidDisplay() {
        currentBidElement.textContent = formatCurrency(auctionData.currentBid);
        bidInput.min = auctionData.nextBid;
        bidInput.value = auctionData.nextBid;
        totalBidsElement.textContent = auctionData.totalBids;
        
        // Update bid input placeholder
        bidInput.setAttribute('placeholder', `Minimum: ${formatCurrency(auctionData.nextBid)}`);
    }
    
    // Populate bidders modal
    function populateBiddersModal() {
        const biddersList = document.getElementById('bidders-list');
        biddersList.innerHTML = '';
        
        // Sort bidders by activity (active first, then by bid count)
        const sortedBidders = [...auctionData.bidders].sort((a, b) => {
            if (a.isActive !== b.isActive) return b.isActive - a.isActive;
            return b.bidCount - a.bidCount;
        });
        
        // Show first 20 bidders
        const displayBidders = sortedBidders.slice(0, 20);
        
        displayBidders.forEach(bidder => {
            const bidderItem = document.createElement('div');
            bidderItem.className = 'bidder-item';
            
            bidderItem.innerHTML = `
                <div class="bidder-info-modal">
                    <div class="bidder-avatar-modal">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="bidder-details">
                        <h4>${bidder.name}</h4>
                        <p>${bidder.location} • ${bidder.bidCount} bids</p>
                    </div>
                </div>
                <div class="bidder-status">
                    <span class="bid-status" style="color: ${bidder.isActive ? '#4CAF50' : '#aaa'}">
                        ${bidder.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span class="bid-time">${bidder.lastActive} min ago</span>
                </div>
            `;
            
            biddersList.appendChild(bidderItem);
        });
        
        // Show count of total bidders
        const countElement = document.createElement('p');
        countElement.style.color = '#aaa';
        countElement.style.textAlign = 'center';
        countElement.style.marginTop = '20px';
        countElement.textContent = `Showing ${displayBidders.length} of ${auctionData.bidders.length} bidders`;
        biddersList.appendChild(countElement);
    }
    
    // Populate bids modal
    function populateBidsModal() {
        const bidsList = document.getElementById('bids-list');
        bidsList.innerHTML = '';
        
        // Sort bids by amount (highest first)
        const sortedBids = [...auctionData.bids].sort((a, b) => b.amount - a.amount);
        
        sortedBids.forEach(bid => {
            const bidItem = document.createElement('div');
            bidItem.className = 'bid-item';
            
            if (bid.isWinning) {
                bidItem.style.borderLeftColor = '#4CAF50';
            }
            
            bidItem.innerHTML = `
                <div>
                    <div class="bid-amount-modal">${formatCurrency(bid.amount)}</div>
                    <div class="bidder-name-modal">${bid.bidder}</div>
                </div>
                <div class="bid-time-modal">${bid.time}</div>
            `;
            
            bidsList.appendChild(bidItem);
        });
    }
    
    // Handle bid button click
    function handleBid() {
        if (auctionData.timeRemaining <= 0) return;
        
        const bidAmount = parseInt(bidInput.value);
        
        if (isNaN(bidAmount) || bidAmount < auctionData.nextBid) {
            alert(`Bid must be at least ${formatCurrency(auctionData.nextBid)}`);
            return;
        }
        
        // Update auction data
        auctionData.currentBid = bidAmount;
        auctionData.nextBid = bidAmount + auctionData.bidIncrement;
        auctionData.totalBids++;
        
        // Add bid to history
        const bidderNames = ["ArtCollector88", "GalleryNY", "ModernArtFan", "VintageHunter", "EuroCollector"];
        const randomBidder = bidderNames[Math.floor(Math.random() * bidderNames.length)];
        
        auctionData.bids.push({
            id: auctionData.bids.length + 1,
            amount: bidAmount,
            bidder: randomBidder,
            time: "Just now",
            isWinning: true
        });
        
        // Update previous winning bid
        if (auctionData.bids.length > 1) {
            auctionData.bids[auctionData.bids.length - 2].isWinning = false;
        }
        
        // Update display
        updateBidDisplay();
        
        // Simulate bidder activity
        auctionData.activeBidders += Math.floor(Math.random() * 2);
        activeBiddersElement.textContent = auctionData.activeBidders;
        
        // Add visual feedback
        bidButton.innerHTML = '<i class="fas fa-check"></i> BID PLACED!';
        bidButton.style.backgroundColor = "#4CAF50";
        
        setTimeout(() => {
            bidButton.innerHTML = '<i class="fas fa-gavel"></i> PLACE BID';
            bidButton.style.backgroundColor = "#d4af37";
        }, 2000);
        
        // Reset timer a bit to simulate extended bidding
        if (auctionData.timeRemaining < 30) {
            auctionData.timeRemaining = 30;
            auctionData.totalTime = Math.max(auctionData.totalTime, auctionData.timeRemaining + 10);
        }
    }
    
    // Handle quick bid buttons
    function handleQuickBid(e) {
        const increment = parseInt(e.target.dataset.increment);
        const currentValue = parseInt(bidInput.value);
        bidInput.value = currentValue + increment;
    }
    
    // Handle auto-bid checkbox
    function handleAutoBidToggle() {
        if (autoBidCheckbox.checked) {
            autoBidInputContainer.style.display = 'block';
            autoBidMaxInput.focus();
        } else {
            autoBidInputContainer.style.display = 'none';
        }
    }
    
    // Simulate external bid updates
    function simulateExternalBid() {
        if (auctionData.timeRemaining <= 0) return;
        
        // Random chance of external bid
        if (Math.random() > 0.9) {
            auctionData.currentBid = auctionData.nextBid;
            auctionData.nextBid += auctionData.bidIncrement;
            auctionData.totalBids++;
            
            // Add external bid to history
            const bidderNames = ["GalleryNY", "EuroCollector", "AsianArtLover"];
            const randomBidder = bidderNames[Math.floor(Math.random() * bidderNames.length)];
            
            auctionData.bids.push({
                id: auctionData.bids.length + 1,
                amount: auctionData.currentBid,
                bidder: randomBidder,
                time: "Just now",
                isWinning: true
            });
            
            // Update previous winning bid
            if (auctionData.bids.length > 1) {
                auctionData.bids[auctionData.bids.length - 2].isWinning = false;
            }
            
            updateBidDisplay();
            
            // Flash current bid to indicate change
            currentBidElement.style.color = "#ff5252";
            setTimeout(() => {
                currentBidElement.style.color = "#f5f5f5";
            }, 500);
        }
    }
    
    // Handle tab switching
    function handleTabClick(e) {
        const tabId = e.target.dataset.tab;
        
        // Remove active class from all tabs
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Remove active class from all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Add active class to clicked tab
        e.target.classList.add('active');
        
        // Show corresponding tab content
        const tabContent = document.getElementById(`${tabId}-tab`);
        if (tabContent) {
            tabContent.classList.add('active');
        }
    }
    
    // Handle enter site link
    function handleEnterSite(e) {
        e.preventDefault();
        
        // Add exit animation
        document.querySelector('.splash-container').style.opacity = '0';
        document.querySelector('.splash-container').style.transition = 'opacity 0.5s';
        
        // In a real implementation, this would redirect to the main site
        setTimeout(() => {
            alert("In a live implementation, this would redirect to the main auction site.");
            // window.location.href = "https://main-auction-site.com";
        }, 500);
    }
    
    // Modal functions
    function openModal(modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Initialize
    function init() {
        // Generate initial data
        generateBidders();
        generateBids();
        
        // Set initial display
        updateBidDisplay();
        updateCountdown();
        
        // Populate modals
        populateBiddersModal();
        populateBidsModal();
        
        // Set up intervals
        setInterval(updateCountdown, 1000);
        setInterval(simulateExternalBid, 8000); // Every 8 seconds
        
        // Event listeners
        bidButton.addEventListener('click', handleBid);
        enterSiteLink.addEventListener('click', handleEnterSite);
        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            // Refresh the splash page
            window.location.reload();
        });
        
        // Quick bid buttons
        quickBidButtons.forEach(btn => {
            btn.addEventListener('click', handleQuickBid);
        });
        
        // Auto-bid toggle
        autoBidCheckbox.addEventListener('change', handleAutoBidToggle);
        
        // Tab switching
        tabButtons.forEach(btn => {
            btn.addEventListener('click', handleTabClick);
        });
        
        // Modal triggers
        activeBiddersTrigger.addEventListener('click', () => openModal(biddersModal));
        viewBidsTrigger.addEventListener('click', () => openModal(bidsModal));
        viewBidsBtn.addEventListener('click', () => openModal(bidsModal));
        viewAllBiddersBtn.addEventListener('click', () => openModal(biddersModal));
        zoomBtn.addEventListener('click', () => openModal(zoomModal));
        
        // Modal close buttons
        biddersModalClose.addEventListener('click', () => closeModal(biddersModal));
        bidsModalClose.addEventListener('click', () => closeModal(bidsModal));
        zoomModalClose.addEventListener('click', () => closeModal(zoomModal));
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === biddersModal) closeModal(biddersModal);
            if (e.target === bidsModal) closeModal(bidsModal);
            if (e.target === zoomModal) closeModal(zoomModal);
        });
        
        // Initialize tooltips/info
        console.log("Enhanced auction splash screen initialized.");
        console.log("Features:");
        console.log("- Scrollable content with detailed lot information");
        console.log("- Interactive bidders modal (click on active bidders count)");
        console.log("- Bidding history modal");
        console.log("- Image zoom functionality");
        console.log("- Tabbed content sections");
        console.log("- Bid input with quick bid buttons");
        console.log("- Auto-bid option with max bid setting");
        console.log("- Progress bar for countdown timer");
    }
    
    // Start the application
    init();
});