console.log("service worker")

//state of timer
let timer_running=false
let seconds=25

//creating a timer of 25 minutes

chrome.alarms.onAlarm.addListener((alarm)=>{
   
    const minsLeft=Math.floor(seconds/(60*60))+" M"
    chrome.action.setBadgeText(
        {
            text:minsLeft
        }
    )
   
    seconds--;
    if (seconds<=0){
        clearAlarm('start-timer')
    }
    createNotification("Your time has finished, take a break!")
    chrome.contextMenus.update("start-timer",{
        title:"start-timer",
        contexts:["all"]
    })
    timer_running=false
});


//function to create alarm
function createAlarm(name){
    
    chrome.alarms.create(
        name,
        {
            periodInMinutes:1/60,
        },
       
    )
}

//function to clear alarm
function clearAlarm(name){
    chrome.alarms.clear(
        name,
       (wasCleared)=>{
        console.log(wasCleared)
       }
       
    )
}

//function for notifications
function createNotification(message) {
    chrome.notifications.create(
        {
            type: "basic", 
            iconUrl: "icons/time-128.png",
            title: "Timer",
            message: message,
            // The `items` property is not used for type "basic"
        },
        function(notificationId) {
            if (chrome.runtime.lastError) {
                console.error(`Error creating notification: ${chrome.runtime.lastError.message}`);
            } else {
                console.log(`Notification created with ID: ${notificationId}`);
            }
        }
    );
}


//context menu for the timer (start/stop timer)
chrome.contextMenus.create(
    {
        id:"start-timer",
        title:"start timer",
        contexts:["all"]
    }
)



//update context menu and alarm on click 
chrome.contextMenus.onClicked.addListener(function(info,tab){
    // console.log(info)
    // console.log(tab)
    switch(info.menuItemId){
        case "start-timer":
            //handle timer running state
            if(timer_running)
                {
                    timer_running=!timer_running
                    //clearing alarm
                    clearAlarm("start timer alarm")
                    createNotification("Stopping timer")
                    //reset the context menu to starrt timer
                    chrome.contextMenus.update("start-timer",{
                        title:"start-timer",
                        contexts:["all"]
                    })
                    return 
                }
            //create nofication indicating the start of timer
            createNotification("Timer has started")
            timer_running=true
            //reset the seconds
            seconds = 25 * 60; // Reset timer to 25 minutes in seconds
            console.log("Starting the timer")
            //create the alarm
            createAlarm("creating timer alarm")
            //update the menu to stop timer
            chrome.contextMenus.update("start-timer",{
                title:"stop-timer",
                contexts:["all"]
            })
            break

    }
});
