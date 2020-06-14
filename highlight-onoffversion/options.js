window.addEventListener("load", function(){    


    var tooltip_on_off_button = document.querySelector('#tooltip_on_off_button');
    var tooltip_state_span = document.querySelector('#tooltip_cur_state');
    
    chrome.storage.sync.get(['tooltip_option'], function(userOptions){
        if(userOptions.tooltip_option == undefined){
            userOptions.tooltip_option = "on";
        }

        if (userOptions.tooltip_option == "on"){
            tooltip_state_span.innerHTML = "켜져있음";
            tooltip_on_off_button.innerHTML = "끔";
        }
        
        else {
            tooltip_state_span.innerHTML = "꺼져있음";
            tooltip_on_off_button.innerHTML = "켬";
        }
    });

    tooltip_on_off_button.onclick = function(){
        var changed_option = "on";
        chrome.storage.sync.get(['tooltip_option'], function(userOptions){
            if(userOptions.tooltip_option == undefined){
                changed_option = "on";
            }
            else if (userOptions.tooltip_option  == "on"){
                changed_option = "off";
            }

            else if (userOptions.tooltip_option  == "off"){
                changed_option = "on";
            }
            chrome.storage.sync.set({'tooltip_option': changed_option});
            chrome.runtime.sendMessage({todo: "backgroundUpdate", opt:changed_option});
        });
        location.reload(true);
    }
});

