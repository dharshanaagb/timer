console.log("service worker")

//state of timer
let timer_running=false
//bell
let s=0
chrome.alarms.onAlarm.addListener((alarm)=>{
    //no of calls 
    console.log(++s)
});


//function to create alarm
function createAlarm(name){
    chrome.alarms.create(
        name,
        //alarm info obj
        //periods in mins disp
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


chrome.contextMenus.create(
    // createProperties:CreateProperties,
    // callback?:function,
    {
        id:"start-timer",
        title:"start timer",
        contexts:["all"]
    }
)
chrome.contextMenus.create(
    // createProperties:CreateProperties,
    // callback?:function,
    {
        id:"reset-timer",
        title:"reset timer",
        contexts:["all"]
    }
)

//update context menu to reset while alarm is running

//onclick of context
chrome.contextMenus.onClicked.addListener(function(info,tab){
    // console.log(info)
    // console.log(tab)
    switch(info.menuItemId){
        case "start-timer":
            //handle timer running state
            if(timer_running)
                {
                    timer_running=!timer_running
                    clearAlarm("start timer alarm")
                    //reset to start timer
                    chrome.contextMenus.update("start-timer",{
                        title:"start-timer",
                        contexts:["all"]
                    })
                    return 
                }
            timer_running=true
            console.log("Starting the timer")
            //create the alarm
            createAlarm("start timer alarm")
            chrome.contextMenus.update("start-timer",{
                title:"stop-timer",
                contexts:["all"]
            })
            break

    }
});
