// Auction Splash Screen JavaScript
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
    
    // Auction data (simulated - will be replaced with live data)
    let auctionData = {
        currentBid: 42500,
        nextBid: 43000,
        activeBidders: 142,
        timeRemaining: 135, // seconds
        isLive: true,
        bidIncrement: 500
    };
    
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
        
        // Decrease time every second
        auctionData.timeRemaining--;
        
        // Update bidder count randomly to simulate activity
        if (Math.random() > 0.7 && auctionData.activeBidders < 200) {
            auctionData.activeBidders += Math.floor(Math.random() * 3);
            activeBiddersElement.textContent = auctionData.activeBidders;
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
        nextBidElement.textContent = formatCurrency(auctionData.nextBid);
    }
    
    // Handle bid button click
    function handleBid() {
        if (auctionData.timeRemaining <= 0) return;
        
        // Simulate bid placement
        auctionData.currentBid = auctionData.nextBid;
        auctionData.nextBid += auctionData.bidIncrement;
        
        // Update display
        updateBidDisplay();
        
        // Simulate bidder activity
        auctionData.activeBidders += Math.floor(Math.random() * 2);
        activeBiddersElement.textContent = auctionData.activeBidders;
        
        // Add visual feedback
        bidButton.textContent = "BID PLACED!";
        bidButton.style.backgroundColor = "#4CAF50";
        
        setTimeout(() => {
            bidButton.textContent = "PLACE BID";
            bidButton.style.backgroundColor = "#d4af37";
        }, 1500);
        
        // Reset timer a bit to simulate extended bidding
        if (auctionData.timeRemaining < 30) {
            auctionData.timeRemaining = 30;
        }
    }
    
    // Simulate external bid updates
    function simulateExternalBid() {
        if (auctionData.timeRemaining <= 0) return;
        
        // Random chance of external bid
        if (Math.random() > 0.85) {
            auctionData.currentBid = auctionData.nextBid;
            auctionData.nextBid += auctionData.bidIncrement;
            updateBidDisplay();
            
            // Flash current bid to indicate change
            currentBidElement.style.color = "#4CAF50";
            setTimeout(() => {
                currentBidElement.style.color = "#f5f5f5";
            }, 500);
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
    
    // Initialize
    function init() {
        updateBidDisplay();
        updateCountdown();
        
        // Set up intervals
        setInterval(updateCountdown, 1000);
        setInterval(simulateExternalBid, 5000);
        
        // Event listeners
        bidButton.addEventListener('click', handleBid);
        enterSiteLink.addEventListener('click', handleEnterSite);
        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            // Refresh the splash page
            window.location.reload();
        });
        
        // Initialize tooltips/info
        console.log("Auction splash screen initialized. Ready for live data integration.");
        console.log("Placeholder IDs available:");
        console.log("- current-bid, next-bid-amount, countdown-timer");
        console.log("- active-bidders, auction-status, current-lot");
        console.log("- lot-title, lot-artist, lot-description");
        console.log("- lot-dimensions, lot-medium, lot-location");
        console.log("- bidder-info, bid-button");
    }
    
    // Start the application
    init();
});