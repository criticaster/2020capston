var tooltip = null;

function getSelectedText(){
    var txt = '';
    if( window.getSelection){
        txt =  window.getSelection().toString();
    }
    else if (window.document.getSelection) {
        txt =window.document.getSelection().toString();
    }
    else if (window.document.selection) {
        txt = window.document.selection.createRange().text;
    }
    return txt;
}


function createTooltip(){
    tooltip = document.createElement("div");
    tooltip.id = "TOOLTIP";
    tooltip.style.width = "auto";
    tooltip.style.height = "auto";
    tooltip.style.position = "fixed";
    tooltip.style.paddingBottom = "1px";
    tooltip.style.paddingTop = "0px";
    tooltip.style.paddingLeft = "3px";
    tooltip.style.paddingRight = "3px";


    tooltip.style.margin = "0px";
    tooltip.style.display = "none";
    tooltip.style.borderRadius = "7px";
    tooltip.style.backgroundColor = '#373737';
    document.body.appendChild(tooltip);
}

function mousewheelEvent(e){
    if (tooltip != null){    
        tooltip.style.display = "none";
    } 
}


function mouseupEvent(e){
   
    var selectedText = getSelectedText();
    if(selectedText != ''){
        if (tooltip.style.display == "none"){
            tooltip.style.left = (e.clientX)+"px";
            tooltip.style.top = (e.clientY+20)+"px";
            selectedText = selectedText.toLowerCase();
            selectedText = selectedText.trim();
            var no_space = selectedText.indexOf(' ');
            if (no_space == -1) {
                chrome.runtime.sendMessage({todo: "searchThis", word : selectedText}, function(response){
                    if (response.res == "NO_SEARCH_RESULT"){
                        tooltip.style.display = "none";
                    }
                    else{
                        
                        tooltip.innerHTML = response.res;
                        btn = tooltip.querySelector(".highlight_tooltip_word");
                        btn.onclick = function(){
                            chrome.runtime.sendMessage({todo: "speakIt", word : btn.innerHTML}); 
                        };
                        tooltip.style.display = "block";
                    }
                });   
            }
            else{
                tooltip.style.display = "none";
            }
        }
    }
    else{
        tooltip.style.display = "none";
    }
}



function init(){
    createTooltip();
    window.addEventListener('mouseup',mouseupEvent,false);
    window.addEventListener('wheel' ,mousewheelEvent, true);
}


init();