console.log("service worker");

// State of the timer
let timer_running = false;
let intervalId;
let seconds = 25 * 60; // 25 minutes in seconds

// Function for notifications
function createNotification(message) {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/time-128.png",
        title: "Timer",
        message: message,
    }, function (notificationId) {
        if (chrome.runtime.lastError) {
            console.error(`Error creating notification: ${chrome.runtime.lastError.message}`);
        } else {
            console.log(`Notification created with ID: ${notificationId}`);
        }
    });
}

// Update the badge text
function updateBadge() {
    const minsLeft = Math.floor(seconds / 60) + " M";
    chrome.action.setBadgeText({ text: minsLeft });
}

// Start the timer
function startTimer() {
    if (intervalId) clearInterval(intervalId);
    seconds = 25 * 60; // 25 minutes in seconds
    
    intervalId = setInterval(() => {
        if (seconds > 0) {
            seconds--;
            updateBadge();
        } else {
            clearInterval(intervalId);
            createNotification("Your time has finished, take a break!");
            chrome.contextMenus.update("start-timer", {
                title: "start timer",
                contexts: ["all"]
            });
            timer_running = false;
            chrome.action.setBadgeText({ text: "" });
        }
    }, 1000);
}

// Clear the timer
function clearTimer() {
    if (intervalId) clearInterval(intervalId);
    chrome.action.setBadgeText({ text: "" });
}

// Create context menu for the timer (start/stop timer)
chrome.contextMenus.create({
    id: "start-timer",
    title: "start timer",
    contexts: ["all"]
});

// Update context menu and alarm on click 
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === "start-timer") {
        if (timer_running) {
            timer_running = false;
            clearTimer();
            createNotification("Stopping timer");
            chrome.contextMenus.update("start-timer", {
                title: "start timer",
                contexts: ["all"]
            });
        } else {
            createNotification("Timer has started");
            timer_running = true;
            console.log("Starting the timer");
            startTimer();
            chrome.contextMenus.update("start-timer", {
                title: "stop timer",
                contexts: ["all"]
            });
        }
    }
});