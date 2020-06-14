
<template>
<div>

    <b-navbar toggleable="lg" type="dark" variant="info" sticky>
      <b-navbar-brand href="#">Highlight Dic</b-navbar-brand>
    </b-navbar>
  <div class="container">
    <div class="page">
        <div class="row">
          <b-input-group class="mt-3">
            <b-form-input id='search_input' v-model="user_input" placeholder="찾고싶은 영어 단어를 입력해주세요."></b-form-input>
            <b-input-group-append>
              <b-button variant="outline-success" v-on:click="search" id='search_button'>검색</b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
        <hr>
        <div id="search_result" class="container">
          <div class="row">
            <div class="alert alert-primary" role="alert" style="width:100%">
              <h4 class="alert-heading text-center">검색 결과</h4><hr>
              <div id="search-result"></div>
              <p class="text-center">{{search_result}}</p>
              <!--<hr>
              <p class="mb-0">검색 결과 2</p>-->
            </div>
          </div>
        </div>
      </div>
      
  
      
      <br/>

      <b-tabs content-class="mt-3" fill active-nav-item-class="font-weight-bold text-warning">
        <b-tab title="대시 보드">
          <DashBoard></DashBoard>
        </b-tab>
        <b-tab title="단어장">
          <BookMark></BookMark>
        </b-tab>
        <b-tab title="테스트">
          <Test></Test>
        </b-tab>
        <b-tab title="도움말">
          <About></About>
        </b-tab>
      </b-tabs>
    </div>
</div>
  
</template>

<script>

import { db } from '../../../background'
import DashBoard from "./DashBoard.vue"
import BookMark from "./BookMark.vue"
import Test from "./Test.vue"
import About from "./About.vue"
import axios from 'axios'
import 'expose-loader?$!expose-loader?jQuery!jquery'


export default {
  components: { DashBoard, BookMark , Test, About},
  data () {
    return {
      form: {},
      search_result : "검색을 해주세요",
      user_input: "",
      record: []
    }
  },
  beforeMount() {
    
  },
  mounted(){
    
  },
  created() {
    
  },
  methods: {
    search() { 
      var input = document.getElementById('search_input').value
      //alert("input:::::", input)
      if(input == "" || input == null){
        alert("검색어를 입력해주세요")
      }
      else {

      

        var myurl = 'https://dic.daum.net/search.do?q='+input
        axios.get(myurl, 
      
        {
          headers: {
          'Access-Control-Allow-Origin' : '*',
          'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
          'Content-Type': 'application/json'
          },
            crossDomain: true
        }).then(res => { 
            
            var searchResultDiv = document.querySelector('#search-result');
            searchResultDiv.innerHTML="";
            console.log("res data ::: " + res.data)
            var data = res.data


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
                        if(data = ""){
                          console.log("데이터없음")
                        }
                      this.search_result = null;

                      
          
          }).catch(error => {
              console.log('error', error);
              this.search_result = "검색 결과가 없거나 또는 오류입니다."
          })
      
        var search_history = []
        chrome.storage.sync.get(['search_history'], function(userData){
          search_history = userData.search_history
          console.log("get history:::",search_history)

          var isNew = true
          for(var i=0; i<search_history.length; i++){
            if(search_history[i].word == input){
              isNew = false
            }
          }

          if(isNew){

            var curDate = new Date();
            var new_data = {'word':input, 'date':curDate.getFullYear() + '-'+(parseInt(curDate.getMonth())+ 1) +'-'+curDate.getDate()};
            search_history.push(new_data);
  
            console.log("push history:::", search_history)
            chrome.storage.sync.set({'search_history': search_history}, function(){
              //alert("히스토리 생성")
            });
          }
          
        })
        
      
      }
    }
      
  }
}
</script>

<style lang="scss" scoped>
  
</style>
