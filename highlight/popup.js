
window.addEventListener("load", function(){
    
    var searchInput = document.querySelector('#search-input');
    var searchButton = document.querySelector('#search-button');
    var searchResultDiv = document.querySelector('#search-result');
    
    searchButton.onclick  = function(){
        var word = searchInput.value;
 
        if(word.length != 0){
            var dic_url ="https://dic.daum.net/search.do?q=" + word;

            $.ajax({
                url: dic_url,
                crossDomain: false,
                dataType: 'html',
                success: function(data){
                    searchResultDiv.innerHTML="";
    
                  
          
                    data = data.substring(data.indexOf('<div class="search_box"'), data.indexOf('<div name="searchWords'));
                    while(true){
                        var ptr1 = data.indexOf('txt_emph1">');
                        if(ptr1 == -1){
                           break;
                        }
                        var divNode = document.createElement("div");
                        var divTitleNode = document.createElement("h2");
                        var divUlNode = document.createElement("ul");


                        data = data.substring(ptr1 + 11);
                        divTitleNode.innerText = data.substring(0, data.indexOf('</span>'));
                        data = data.substring(data.indexOf('list_search">') + 13);
                        var ptr3 = data.indexOf('<li>');
                        var ptr4 = data.indexOf('</ul>');
                        divUlNode.innerHTML = data.substring(ptr3, ptr4);
                        divNode.appendChild(divTitleNode);
                        divNode.appendChild(divUlNode);
                        searchResultDiv.appendChild(divNode);
                        data = data.substring(ptr4);
                    }
                }
            });
            searchButton.focus();
            searchButton.value = "저장";
        }
        // searchInput.value = "";
        return false;
    };

    searchInput.onfocus  = function(){
        searchResultDiv.innerHTML="";
        searchInput.value="";
        searchButton.value="검색";
    };
});