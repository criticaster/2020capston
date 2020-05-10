
<template>
<div>

    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">Highlight Dic</b-navbar-brand>
    </b-navbar>
  <div class="container">
    <div class="page">
        <div class="row">
          <b-input-group class="mt-3">
            <b-form-input v-model="user_input" placeholder="찾고싶은 영어 단어를 입력해주세요."></b-form-input>
            <b-input-group-append>
              <b-button variant="outline-success" v-on:click="search">검색</b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
        <hr>
        <div id="search_result" class="container">
          <div class="row">
            <div class="alert alert-primary" role="alert" style="width:100%">
              <h4 class="alert-heading">검색 결과</h4><hr>
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
      search_result : "검색 결과가 없어요!",
      user_input: "",
    }
  },
  beforeMount() {
    
  },
  mounted(){
    
  },
  created() {
    
  },
  methods: {
    search() { //CORS 오류 계속남 
    chrome.runtime.sendMessage(
      
        {contentScriptQuery: "queryWord", user_input: this.user_input},
        (res) => {
          console.log(res)
        }
      
    )
    alert("동작")
    //   const options = {
    //     url: 'https://dic.daum.net/search.do?q='+this.user_input,
    //     method: 'GET',
    //     headers: { 
    //     'Access-Control-Allow-Origin' : '*'},
    //   }
    //   this.$axios(options)
    //   .then((res) => {
    //     console.log(res.data)
    //     alert("검색!")
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //     alert("검색!")
    //   })
      
    // },
      }
    }
  }
</script>

<style lang="scss" scoped>
  
</style>
