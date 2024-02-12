chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.CloseMe) {
        chrome.tabs.remove(sender.tab.id);
    }
});

// Function to remove expired blocked websites
function removeExpiredBlockedWebsites() {
    chrome.storage.local.get("BlockedUrl", (data) => {
        if (data.BlockedUrl !== undefined) {
            const currentDate = new Date();
            const currentTime = currentDate.getTime();
            
            const updatedBlockedUrls = data.BlockedUrl.filter((blockedUrl) => {
                // Check if the website is expired (next day)
                return blockedUrl.BlockTill > currentTime;
            });

            // Update the storage with the filtered blocked URLs
            chrome.storage.local.set({ "BlockedUrl": updatedBlockedUrls });
        }
    });
}

// Call the function to remove expired blocked websites when the extension is loaded
removeExpiredBlockedWebsites();

// Schedule a daily check to remove expired blocked websites
setInterval(removeExpiredBlockedWebsites, 24 * 60 * 60 * 1000); // Check every 24 hours
