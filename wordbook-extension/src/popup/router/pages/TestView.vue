<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="info" sticky>
            <b-navbar-brand href="#">{{type}} - {{category}}</b-navbar-brand>
        </b-navbar>
        
        <br/>
        <div class="row text-center" v-if="isLoaded">
            <div class="col-sm-12">
                <div v-show="toggle">
                    <h5>문 제</h5>
                    <legend>{{show_data[current_index].word}}</legend> 

                    <br/>
                    <b-form-group label="보기">
                        <b-form-radio-group
                            id="radio-group-1"
                            v-model="user_answer"   
                            :options="options"
                            name="radio-options"
                        ></b-form-radio-group>
                    </b-form-group>
                    <b-button v-on:click="next">{{button_text}}</b-button>
                </div>

                <div v-show="!toggle">
                    <p>결과 확인</p>
                    

                </div>
            </div>
        </div>
        
        
        
    </div>
    
</template>

<script>


import { db } from '../../../background'
export default {

    data() {
        return {
            data : {
                "TOEIC" : [
                    {"category" : "기초", "word" : "bend over", "mean" : "몸을 앞으로 숙이다"},
                    {"category" : "기초", "word" : "date", "mean" : "날짜"},
                    {"category" : "기초", "word" : "item", "mean" : "항목"},
                    {"category" : "기초", "word" : "ruler", "mean" : "자"},
                    {"category" : "기초", "word" : "fine", "mean" : "벌금, 연체료"},
                ]
            },
            category : this.$route.params.category,
            type : this.$route.params.type,
            show_data : [],
            data_index : 0,
            current_index : 0,
            user_answer_array : [],
            toggle : true,
            button_text : "다음",
            user_answer : '',
            options: [],
            words: [],
            isLoaded : false
            
        }
    },
    methods : {
        next() {

            this.user_answer_array.push({
                "word" : this.show_data[this.current_index].word,
                "answer" : this.user_answer
                })

            this.current_index++;

            if(this.current_index >= this.data_index){
                this.toggle = !this.toggle
                
            }

        }
    },
    created (){
        
        var data_index = this.data.TOEIC.length;
        this.data_index = data_index;
        console.log(this.data)
        console.log("길이" + data_index)

        function getRandomInt(min, max) { //min ~ max 사이의 임의의 정수 반환
            return Math.floor(Math.random() * (max - min)) + min;
        }

        var pre_data = this.data.TOEIC
        
        

        this.show_data = pre_data.sort(function(){
            return Math.random() - Math.random();
        }) //데이터 랜덤으로 섞기

        for(var i=0; i<data_index; i++){

            this.options.push({
                "text" : this.show_data[i].mean,
                "value" : this.show_data[i].mean,
            })
        }

        
    },
    firestore(){
        console.log("this is firestore section")
        var type = this.type
        console.log("TYPE : "+ type)

        var category = this.category

        console.log("Category:" + category)
        
        return {
            words : db.collection(type).doc(category)
        }
        
        
        
            
    }
}
</script>