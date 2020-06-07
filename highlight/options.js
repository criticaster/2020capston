window.addEventListener("load", function(){    
    chrome.storage.sync.get(['word_list'], function(userData){
        if (userData.word_list != undefined) {
            var wordTable = document.querySelector('#highlight_tbody');
            for (var i = 0; i<userData.word_list.length; i++){
                var row = wordTable.insertRow(wordTable.rows.length);
                var cell1 = row.insertCell(0); //단어 칸
                var cell2 = row.insertCell(1); // 뜻 칸
                var cell3 = row.insertCell(2); //저장날짜 칸
                var cell4 = row.insertCell(3); // 듣기 칸
                var cell5 = row.insertCell(4); // 삭제 칸
                
                //단어 칸
                cell1.innerHTML = "<strong>"+userData.word_list[i].word + "</strong>";
                
                //뜻 칸
                cell2.innerHTML= userData.word_list[i].ko_means;
                
                //저장날짜칸
                cell3.innerHTML = userData.word_list[i].date;


                // 듣기칸
                cell4.innerHTML = "<input type='image' src='speaker.png' id='btn_"+userData.word_list[i].word  + "' >";
                document.getElementById("btn_"+ userData.word_list[i].word).onclick= function(){
                    var word = this.id.substring(4);
                    chrome.tts.speak(word, {'lang':'en-US', 'rate':1.0});
                };

                //삭제 칸
                cell5.innerHTML = "<input type='button' value='제거' id='del_"+userData.word_list[i].word  + "' >";
                document.getElementById("del_"+ userData.word_list[i].word).onclick= function(){
                    var word = this.id.substring(4);
                    var idx_to_del = 0;
                    for (var i = 0; i<userData.word_list.length; i++){
                        if (userData.word_list[i]['word'] == word){
                            idx_to_del = i;
                            break;
                        }
                    }
                    if (confirm(word + "를 제거하시겠습니까?")){
                        var updated_word_list = userData.word_list.splice(idx_to_del, 1);
                        updated_word_list = userData.word_list

                        chrome.storage.sync.set({'word_list': updated_word_list}, function(){
                            var notifOptions = {
                                type: 'basic',
                                iconUrl:'icon48.png',
                                title: "highlight", 
                                message : word + "가 단어목록에서 제거되었습니다.",
                                eventTime: Date.now() + 10
                            }
                            chrome.notifications.clear('wordDeleteNotif');
                            chrome.notifications.create('wordDeleteNotif', notifOptions);
                            chrome.notifications.clear('wordDeleteNotif');
                        });
                        location.reload(true);
                    }
                };
            }
        }
    });
});
