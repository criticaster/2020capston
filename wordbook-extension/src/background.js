import firebase from 'firebase'
import vuefire from 'vuefire'
import axios from 'axios'

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

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.contentScriptQuery == "queryWord") {
        var url = "https://dic.daum.net/search.do?q="+encodeURIComponent(request.user_input);
        alert(url)
        
        fetch(url)
            .then(response => response.text())
            .then(response => sendResponse(response))
            .catch(error => console.log(error))
        return true;  // Will respond asynchronously.
      }
    });