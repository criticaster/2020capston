window.addEventListener("load", function(){
    var searchInput = document.querySelector('#search-input');
    var searchButton = document.querySelector('#search-button');
    var searchResultDiv = document.querySelector('#search-result');
    
    searchButton.onclick  = function(){
        var word = searchInput.value;
        if(word.length != 0){
            var txtNode = document.createTextNode(word);
            var divNode = document.createElement("div");
            divNode.appendChild(txtNode);
            searchResultDiv.appendChild(divNode);
        }
        searchInput.value = "";
        return false;
    };

    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        searchInput.value = "pop";
        // alert("I am popup!");
    });
    
});