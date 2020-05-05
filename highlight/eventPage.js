var menuSearch = {
    "id":"highlight_search",
    "title":"HighLight 단어목록에 추가",
    "contexts":["selection"]
};

chrome.contextMenus.create(menuSearch);

function fixedEncodeURI(str){
    return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
}

function isEnglishWord(str){
    var letters = /^[a-zA-Z]+$/;
    if(letters.test(str)) {
       return true;
    }
    return false;
}

chrome.contextMenus.onClicked.addListener(function(clickData) {
    if(clickData.menuItemId == "highlight_search" && clickData.selectionText){
        if (isEnglishWord(clickData.selectionText)){
            chrome.storage.sync.get(['word_list'], function(userData){

                var new_word_list = userData.word_list;
                if(!new_word_list){
                    new_word_list = new Array();
                }
                new_word_list.push(clickData.selectionText);
                chrome.storage.sync.set({'word_list':new_word_list }, function(){
                    var notifOptions = {
                        type: 'basic',
                        iconUrl:'icon48.png',
                        title: "highlight",
                        message : clickData.selectionText + "가 단어목록에 추가되었습니다."
                    }
                    chrome.notifications.clear('wordAppendNotif');
                    chrome.notifications.create('wordAppendNotif', notifOptions);
                    chrome.notifications.clear('wordAppendNotif');
                });
            });
        }
        else {
            alert('영어단어가 아닙니다.');
        }
    }
});

// chrome.contextMenus.onClicked.addListener(function(clickData) {
//     if(clickData.menuItemId == "highlight_search" && clickData.selectionText){
//         var url_dic = "https://en.dict.naver.com/#/search?query=" + fixedEncodeURI(clickData.selectionText);
//         var createData = {
//             "url":url_dic,
//             "type": "popup",
//             "top":5,
//             "left":5,
//             "width": parseInt(screen.availWidth/2),
//             "height": parseInt(screen.availHeight/2)
//         };
//         chrome.windows.create(createData, function(){});
//     }
// });
