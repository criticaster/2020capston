
window.addEventListener("load", function(){
    
    chrome.storage.sync.get(['word_list'], function(userData){
        var user_word_list = userData.word_list;
        var user_word_list_div = document.querySelector('#word-list');
        for (var i = 0; i<user_word_list.length; i++){
            user_word_list_div.innerHTML += user_word_list[i]+'<br>';
        }
    });
});