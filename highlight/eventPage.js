var menuSearch = {
    "id":"highlight_search",
    "title":"HighLight 사전에서 검색",
    "contexts":["selection"]
};

chrome.contextMenus.create(menuSearch);

function fixedEncodeURI(str){
    return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
}
chrome.contextMenus.onClicked.addListener(function(clickData) {
    if(clickData.menuItemId == "highlight_search" && clickData.selectionText){
        var url_dic = "https://en.dict.naver.com/#/search?query=" + fixedEncodeURI(clickData.selectionText);
        var createData = {
            "url":url_dic,
            "type": "popup",
            "top":5,
            "left":5,
            "width": parseInt(screen.availWidth/2),
            "height": parseInt(screen.availHeight/2)
        };
        chrome.windows.create(createData, function(){});
    }
});
