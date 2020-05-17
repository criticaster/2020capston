var menuSearch = {
    "id":"highlight_save_word",
    "title":"HighLight 단어목록에 추가",
    "contexts":["selection"]
};

window.addEventListener("load", function(){        
    chrome.contextMenus.create(menuSearch);
    chrome.contextMenus.onClicked.addListener(function(clickData) {
        if(clickData.menuItemId == "highlight_save_word" && clickData.selectionText){
            var new_word = clickData.selectionText;
            var dic_url ="https://dic.daum.net/search.do?q=" + new_word;
            $.ajax({
                url: dic_url,
                crossDomain: false,
                dataType: 'html',
                success: function(string_url){
                    var h = string_url.indexOf('<strong class="tit_cleansch" data-tiara-id=');
                    if (h == -1){
                        alert("적절한 단어가 없습니다.");
                    }
                    else{
                        var key = string_url.substring(h + 44, h + 44 + 12);
                        var url_by_key = "https://dic.daum.net/word/view.do?wordid="+key;
                        $.ajax({
                            url: url_by_key,
                            crossDomain: false,
                            dataType: 'html',
                            success: function(data){
                                data = data.substring(data.indexOf('<span class="txt_cleanword"'));
                                var target_word = data.substring(28, data.indexOf('</span>'));

                                if (confirm(target_word + "를 추가하시겠습니까?")){
                                    chrome.storage.sync.get(['word_list'], function(userData){


                                        var word_list = userData.word_list;

                                        if(!word_list){
                                            word_list = new Array();
                                        }

                                        var isnovelword = true;
                                        for (var i = 0; i<word_list.length; i++){
                                            if (word_list[i]['word'] == target_word){
                                                isnovelword = false;
                                            }
                                        }
                                        if(isnovelword){
                                            var mean_list = new Array();

                                            string_url = string_url.substring(string_url.indexOf('<div class="search_box"'), string_url.indexOf('<div name="searchWords'));
                                            string_url = string_url.substring(string_url.indexOf('<li>'), string_url.indexOf('</ul>'));
                                            
                                            while(true) {
                                                var kor_mean = "";
                                                var index1 = string_url.indexOf('<span class="num_search">');
                                                if(index1 == -1){
                                                    index1 = string_url.indexOf('<span class="txt_search">');
                                                    if(index1 == -1){
                                                        break;
                                                    }
                                                }
                                                string_url = string_url.substring(string_url.indexOf('<span class="txt_search'));

                                                var partition = string_url.substring(0, string_url.indexOf('</span>'));
                                                while(true){
                                                    var index2 = partition.indexOf('<daum:word id');
                                                    if(index2 == -1){
                                                        break;
                                                    }
                                                    partition = partition.substring(index2 + 29);
                                                    kor_mean += partition.substring(0, partition.indexOf('</daum:word>'));
                                                }
                                                string_url = string_url.substring(string_url.indexOf('</span>'));
                                                mean_list.push(kor_mean);

                                            }
                        
                                            var mean_idx = string_url.indexOf('<sapn class="txt_search>');
                                            
                                            string_url = string_url.substring(mean_idx + 29);
                                
                                            var curDate = new Date();
                                            var dateInfo = curDate.getFullYear() + '-'+(parseInt(curDate.getMonth())+ 1) +'-'+curDate.getDate();
                                            var new_data = {'word':target_word, 'date':dateInfo, 'ko_means':mean_list};
    
                                            word_list.push(new_data);
                                            chrome.storage.sync.set({'word_list': word_list}, function(){
                                                var notifOptions = {
                                                    type: 'basic',
                                                    iconUrl:'icon48.png',
                                                    title: "highlight", 
                                                    message : target_word + "가 단어목록에 추가되었습니다.",
                                                    eventTime: Date.now() + 10
                                                }
                                                chrome.notifications.clear('wordAppendNotif');
                                                chrome.notifications.create('wordAppendNotif', notifOptions);
                                                chrome.notifications.clear('wordAppendNotif');
                                            });
                                        }
                                        else{
                                            alert(target_word + "가 이미 단어목록에 존재합니다.");
                                        }
                                    });
                                }
                                 
                            }
                        });
                    }
                }
            });
        }
    });
});