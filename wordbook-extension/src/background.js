import firebase from 'firebase'
import vuefire from 'vuefire'
import axios from 'axios'
import 'expose-loader?$!expose-loader?jQuery!jquery'
import icon48 from './icons/icon_48.png'

//alert('This is background.js alert msdddg!!')

var config = {
    apiKey: "AIzaSyDYVVe-sqMuX0eOReRSNaolmJrw2oqvUq8",
    authDomain: "wordbook-e869a.firebaseapp.com",
    databaseURL: "https://wordbook-e869a.firebaseio.com",
    projectId: "wordbook-e869a",
    storageBucket: "wordbook-e869a.appspot.com",
    messagingSenderId: "552444774891",
    appId: "1:552444774891:web:6cb7aae0c02635c5b971ae"
  };

  export const db = firebase.initializeApp(config).firestore()

  var contextMenuItem = {
    "id": "bookmark",
    "title" : "Highlight사전 단어장에 추가",
    "contexts" : ["selection"]
  }

  var show_tooltip = true;
  // chrome.contextMenus.create(contextMenuItem)
  chrome.runtime.onInstalled.addListener(function(){
    chrome.contextMenus.create(contextMenuItem)
  })
  

  function isEnglishWord(str){
    var letters = /^[a-zA-Z]+$/;
    if(letters.test(str)) {
        return true;
    }
    return false;
}
  
function convertToProperWord(word) { // 다음사전에 들어가서 단어를 변경한다.
    var daum_dic_url ="https://dic.daum.net/search.do?q=" + word;
    var changed_word = "";
    $.ajax({
        url: daum_dic_url,
        crossDomain: false,
        dataType: 'html',
        async: false,
        success: function(page_source){
            var has_result = page_source.indexOf('<strong class="tit_cleansch" data-tiara-id=');
            if (has_result == -1){ //다음사전에서 결과가 없으면 word를 그대로 반환한다.
                changed_word = word;
            }
            else {
                var head = page_source.indexOf('"txt_emph1"');
                if (head == -1){
                    changed_word = word;  //다음사전에서 결과가 없으면 word를 그대로 반환한다.
                }
                else{
                page_source = page_source.substring(head + 12);
                var tail = page_source.indexOf('</span>');
                changed_word = page_source.substring(0, tail); //결과가 있으면 결과를 리턴한다.
                }
            }
        }
    });
    return changed_word;
}

function toBookMarkData(word) { // word 를 네이버 사전에 물어보고 단어와 뜻을 가져온다.
    var DATA = [];
    DATA[0] = "NO_SEARCH_RESULT";
    DATA[1] = "NO_SEARCH_RESULT";
    var dic_url = "http://tooltip.dic.naver.com/tooltip.nhn?wordString=" + word + "&languageCode=4&nlp=false";
    $.ajax({
        url: dic_url,
        crossDomain: false,
        dataType: 'html',
        async: false,
        success: function(data){
            var has_result = data.indexOf('{"entryID":');
            if(has_result != -1) {
                data = data.substring(data.indexOf('"entryName":') + 13);
                var entryName = data.substring(0, data.indexOf('"'));
                var mean_list_src = data.substring(data.indexOf('"mean":[') + 7, data.indexOf('"],"') + 2);
                var mean_list = [];
                var count = 0;

                while(true){
                    var head = mean_list_src.indexOf('"');
                    if (head == -1){
                        break;
                    }
                    mean_list_src = mean_list_src.substring(head + 1);
                    var tail = mean_list_src.indexOf('"');
                    mean_list.push(mean_list_src.substring(0, tail));
                    mean_list_src = mean_list_src.substring(tail + 1);

                    count++;
                    if(count > 30) {
                        break;
                    }
                }
                DATA[0] = entryName;
                DATA[1] = mean_list;
            }
        }
    });
    return DATA; // [0]에 영어단어, [1]에 뜻 배열이 담김. 검색 결과가 없으면 [0]과 [1]에 "NO_SEARCH_RESULT"가 담김
}

  chrome.contextMenus.onClicked.addListener(function(clickData) {
    if(clickData.menuItemId == "bookmark" && clickData.selectionText){

         //드래그된 문자열 전처리
         var seleted_str = clickData.selectionText.toLowerCase();  
         seleted_str = seleted_str.trim();
        
        alert(seleted_str)

         //영어인지 확인
         if(isEnglishWord(seleted_str)){
             var word = convertToProperWord(seleted_str);
             var data = toBookMarkData(word);
             if (data[0] == "NO_SEARCH_RESULT"){
                 alert("검색 결과가 없습니다.");
             }
             else{
                 if (confirm(data[0] + "를 단어장에 추가하시겠습니까?")){
                     chrome.storage.sync.get(['word_list'], function(userData){
                         var word_list = userData.word_list;
                         if(!word_list){
                             word_list = new Array();
                         }
                         var is_new_word = true;
                         for (var i = 0; i<word_list.length; i++){
                             if (word_list[i]['word'] == data[0]){
                                 is_new_word = false;
                             }
                         }
                         if(is_new_word){
                             var curDate = new Date();
                             var new_data = {'word':data[0], 'date':curDate.getFullYear() + '-'+(parseInt(curDate.getMonth())+ 1) +'-'+curDate.getDate(), 'ko_means':data[1]};
                             word_list.push(new_data);
                             chrome.storage.sync.set({'word_list': word_list}, function(){
                                 var notifOptions = {
                                     type: 'basic',
                                     iconUrl:icon48,
                                     title: "highlight", 
                                     message : data[0] + "가 단어장에 추가되었습니다.",
                                     eventTime: Date.now() + 10
                                 }
                                 // alert(new_data.word + " "+ new_data['date']+ " " +new_data.ko_means);
                                 chrome.notifications.clear('wordAppendNotif');
                                 chrome.notifications.create('wordAppendNotif', notifOptions);
                                 chrome.notifications.clear('wordAppendNotif');
                             });
                         }
                         else{
                             alert(data[0] + "가 이미 단어장에 존재합니다.");                    
                         }
                     });
                 }
             }
         }
         else{
             alert("영어단어가 아닙니다.");
         }
        }
});


function searchForTooltip(selected_str) {

    var word = selected_str.toLowerCase();

    word = word.trim();
    var tooltip_content = "";

    if(isEnglishWord(word)){
        word = convertToProperWord(word);
        if (word == "NO_SEARCH_RESULT"){
            tooltip_content = "NO_SEARCH_RESULT";
        }
        else{
            var dic_url = "http://tooltip.dic.naver.com/tooltip.nhn?wordString=" + word + "&languageCode=4&nlp=false";
            $.ajax({
                url: dic_url,
                crossDomain: false,
                dataType: 'html',
                async: false,
                success: function(data){
                    var has_result = data.indexOf('{"entryID":');
                    if(has_result == -1){
                        tooltip_content = "NO_SEARCH_RESULT";
                    }
                    else {
                        data = data.substring(data.indexOf('"entryName":') + 13);
                        var entryName = data.substring(0, data.indexOf('"'));
                        tooltip_content = '<b-button class="highlight_tooltip_word" style="color:yellow;">';
                        tooltip_content += entryName + ' <img src="https://raw.githubusercontent.com/km01/km01.github.io/master/assets/img/mic16_3.png"> </b-button>';
                        var mean_list_src = data.substring(data.indexOf('"mean":[') + 7, data.indexOf('"],"') + 2);
                        var mean_list = [];
                        var count = 0;
                        tooltip_content += '<span class="highlight_tooltip_colon" style="font-size:0.7em; font-weight:900; margin-top:0px; color:white;"> : </span>';
                        tooltip_content += '<span class="highlight_tooltip_mean" style="font-size:0.7em; font-weight:400; margin-top:0px; color:white;">';
                        while(true){
                            var head = mean_list_src.indexOf('"');
                            if (head == -1){
                                break;
                            }
                            mean_list_src = mean_list_src.substring(head + 1);
                            var tail = mean_list_src.indexOf('"');
                            mean_list.push(mean_list_src.substring(0, tail));
                            mean_list_src = mean_list_src.substring(tail + 1);
        
                            count++;
                            if(count > 30) {
                                break;
                            }
                        }
                        for (var i = 0; i<mean_list.length-1; i++){
                            tooltip_content += mean_list[i] + ", ";
                        }
                        tooltip_content += mean_list[mean_list.length - 1] + " ";
                        tooltip_content += '</span>';
                    }
                }
            });
        } 
    }
    else{
        tooltip_content = "NO_SEARCH_RESULT";
    }
    return tooltip_content;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.todo == "searchThis") {
        //alert("searchThis accept")
        sendResponse({res: searchForTooltip(request.word)});
    }
    if(request.todo == "speakIt"){

        chrome.tts.speak(request.word, {'lang':'en-US', 'rate':1.0});
    }
});
