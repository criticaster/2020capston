function searchForTooltip(word) {
    var tooltip_content = "";
    var dic_url ="https://endic.naver.com/popManager.nhn?sLn=kr&m=search&searchOption=&query=" + word;
    $.ajax({
        url: dic_url,
        crossDomain: false,
        dataType: 'html',
        async: false,
        success: function(data){
            var head = data.indexOf('<dt class="first">');
            if (head == -1) {
                tooltip_content = "검색결과가 없는데요?";
            }
            else {
                data = data.substring(head);
                tooltip_content = data.substring(data.indexOf('<p>')+4, data.indexOf('</p>'));
            }
        }
    });
    return tooltip_content;
}

window.addEventListener("load", function(){
    
    var searchInput = document.querySelector('#search-input');
    var searchButton = document.querySelector('#search-button');
    var searchResultDiv = document.querySelector('#search-result');


    var url_front = "https://dict.naver.com/search.nhn?dicQuery=";
    var url_middle = "&query=";
    var url_rear = "target=dic&ie=utf8&query_utf=&isOnlyViewEE=";
    
    searchButton.onclick  = function(){
        searchResultDiv.innerHTML = "";
        var word = searchInput.value;
        if(word.length != 0){
            var dic_url = url_front + word + url_middle + word + url_rear;
            var no_result = true;
            $.ajax({
                url: dic_url,
                crossDomain: false,
                dataType: 'html',
                async : false,
                success: function(data){
                    // searchResultDiv.appendChild(document.createTextNode(data));
                    searchResultDiv.innerHTML = data;
                }
            });
        }
        searchInput.value = "";
        return false;
    };
});