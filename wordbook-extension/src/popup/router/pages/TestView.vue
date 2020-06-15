<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="info" sticky>
            <b-navbar-brand href="#">{{type}} - {{category}}</b-navbar-brand>
        </b-navbar>
        
        <br/>
        <div class="row text-center" v-if="isLoaded">
            <div class="col-sm-12">
                <div v-show="toggle">
                    <div class="row">
                        <div class="col-sm-8">  
                        </div>
                        <div class="col-sm-4">
                            <span>&#9; &#9;남은 시간 : {{time}}초</span>
                        </div>
                    </div>
                    <h5>문 제 ({{current_index+1}} / {{problem_num}}) </h5>
                    <h6 v-if="answer[current_index].type == 'wordToMean'">제한 시간 내에 다음 보기에 알맞은 단어 뜻을 고르세요.</h6>
                    <h6 v-else>제한 시간 내에다음 보기에 알맞은 단어를 고르세요.</h6>
                    <br/>
                    <legend v-if="answer[current_index].type == 'wordToMean'">{{answer[current_index].question}}</legend> 
                    <legend v-else>{{answer[current_index].question}}</legend> 

                    <br/>
                    <b-form-group label="보기">
                        <b-form-radio-group
                            id="radio-group-1"
                            v-model="selected"   
                            :options="options"
                            name="radio-options"
                        ></b-form-radio-group>
                    </b-form-group>
                    <b-button v-on:click="next" v-if="current_index < problem_num - 1" name="button">다음</b-button>
                    <b-button v-else @click="getResult()" name="button" id="resultbutton">결과 확인</b-button>
                </div>

            </div>
        </div>
        
        <div class="row text-center" v-if="isResult">
            <div class="col-sm-12">
                <h4>총 문항 수 : {{correct+incorrect}} 개</h4>
            </div>
            <div class="col-sm-12">
                <h4>정답 수 : {{correct}} 개</h4>
            </div>
            <div class="col-sm-12">
                <h4>적중률 : {{Math.round(correct / (correct+incorrect) * 100)}}%</h4><br/>
            </div>

            <div class="col-sm-12">
                <vue-good-table
                    :columns="columns"
                    :rows="rows"
                    :sort-options="{enabled: false}"
                    :line-numbers="true">
                    <template slot="table-row" slot-scope="props">
                        <span v-if="props.column.field == 'result'">
                            <span v-if="props.row.correctness == true" style="font-weight:bold; color:blue">O</span>
                            <span v-else style="font-weight:bold; color:red">X</span>
                        </span>
                        <span v-if="props.column.field == 'bookmark'">
                            <b-button variant="outline-primary" size="sm" v-on:click="addBookmark(props.row)"><b-icon icon="bookmark-plus"></b-icon></b-button>
                        </span>
                        <span v-else>
                            {{props.formattedRow[props.column.field]}}
                        </span>
                    </template>
                    </vue-good-table>
            <br/>
                <div class="row">
                    <div class="col-sm-12">
                        <b-button variant="outline-primary" v-on:click="gotoMain">메인 화면</b-button>
                    </div>
                </div>
            </div>

                
            
        </div>
        
        
        
    </div>
    
</template>

<script>


import { db } from '../../../background'
import icon48 from '../../../icons/icon_48.png'

export default {

    
    data() {
        return {
           
            category : this.$route.params.category,
            type : this.$route.params.type,
            problem_num : this.$route.params.problem_num,
            show_data : [], // 문제 보기
            data_index : 0, // 전체 문제 길이
            current_index : 0, // 현재 문제 번호
            user_answer_array : [],
            options: [],
            full_options:[],
            selected: '',
            words: [],
            isLoaded : false,
            answer:[],
            wrong_answer:[],
            incorrect_words:[],
            toggle : true,
            isResult : false,
            keepGoing : true,
            correct : 0,
            incorrect : 0,
            time : this.$route.params.problem_num * 10,
            columns: [
                {
                    label: '문제',
                    field: 'word',
                    type: 'text',
                    width: '150px',
                },
                {
                    label: '정답',
                    field: 'mean',
                    type: 'text',
                    width: '200px',
                },
                {
                    label: '정답 여부',
                    field: 'result',
                    type: 'text',
                    width: '80px',
                },
                {
                    label: '선택한 답',
                    field: 'user_answer',
                    type: 'text',
                    width: '200px',
                },
                {
                    label: '북마크',
                    field: 'bookmark',
                    type: 'text',
                    width: '120px',
                }
            ],
            rows: [],
            // { id:1, word:"credential", mean: "신임장", createdAt: '2020-04-28' },

            
        }
    },
    
    methods : {
        timer() {
            
            if(this.time > 0 && this.keepGoing){
                setTimeout(()=>{
                    this.time -= 1
                    this.timer()
                }, 1000)
            }
            else if(this.time <= 0) {
                alert("시간 초과!\n결과 화면으로 이동합니다.")
                this.getResult()
            }
        },
        next() { //다음 버튼 눌렀을 때

            this.current_index++;

            console.log("this.showdata WORD:::::::", this.show_data[this.current_index - 1].word)

            if(this.current_index < this.problem_num){
                
                var word = this.show_data[this.current_index - 1].word
                var mean = this.show_data[this.current_index - 1].mean
                var answer = this.show_data[this.current_index - 1].answer
                var user_answer = this.selected
                var correctness = null
                console.log("answer",answer)
                console.log("user_answer",user_answer)
                console.log("answer == user_answer", answer == user_answer)
                if(answer == user_answer){
                    correctness = true
                }
                else{
                    correctness = false
                }

                this.user_answer_array.push({
                    "word" : word,
                    "mean" : mean,
                    "answer": answer,
                    "user_answer" : user_answer,
                    "correctness" : correctness
                })

                this.makeOptions(this.full_options, this.current_index)

                this.selected = ''
                console.log(JSON.stringify(this.user_answer_array))
            }
            

        },
        getResult() {
            
            
                var word = this.show_data[this.current_index].word
                var mean = this.show_data[this.current_index].mean
                var answer = this.show_data[this.current_index].answer
                var user_answer = this.selected
                var correctness = null
                
                console.log("answer",answer)
                console.log("user_answer",user_answer)
                console.log("answer == user_answer", answer == user_answer)

                if(answer == user_answer)
                    correctness = true
                else
                    correctness = false

                this.user_answer_array.push({
                    "word" : word,
                    "mean" : mean,
                    "answer": answer,
                    "user_answer" : user_answer,
                    "correctness" : correctness
                })

            var rows = []
            
            //console.log(JSON.stringify(this.user_answer_array))

            for(var i=0; i<this.user_answer_array.length; i++){
                if(this.user_answer_array[i].correctness == true)
                    this.correct++
                else{
                    this.incorrect++
                    //this.incorrect_words = []
                    this.incorrect_words.push({"word":this.user_answer_array[i].word, "mean":this.user_answer_array[i].mean})
                }
                
                rows.push(this.user_answer_array[i])

            }
            this.rows = rows

            console.log("rows::::::", this.rows)
            

            this.isLoaded = false
            this.isResult = true
            this.keepGoing = false

        },
        addBookmark(rowprop){

            var word = rowprop.word
            var ko_means = rowprop.mean
            if (confirm(word + "를 단어장에 추가하시겠습니까?")){
                     chrome.storage.sync.get(['word_list'], function(userData){
                         var word_list = userData.word_list;
                         if(!word_list){
                             word_list = new Array();
                         }
                         var is_new_word = true;
                         for (var i = 0; i<word_list.length; i++){
                             if (word_list[i]['word'] == word){
                                 is_new_word = false;
                             }
                         }
                         if(is_new_word){
                             var curDate = new Date();
                             var new_data = {'word':word, 'date':curDate.getFullYear() + '-'+(parseInt(curDate.getMonth())+ 1) +'-'+curDate.getDate(), 'ko_means':ko_means};
                             word_list.push(new_data);
                             chrome.storage.sync.set({'word_list': word_list}, function(){
                                 alert(word+"가 단어장에 추가 되었습니다.")
                             });
                         }
                         else{
                             alert(word + "가 이미 단어장에 존재합니다.");                    
                         }
                     });
                 }
        },
        gotoMain(){
            //기록 저장
                
                var record = []
                var currentDate = new Date()
                var correct_num = this.correct
                var problem_num = this.problem_num
                var accuracy = Math.round(correct_num / problem_num * 100)
                var type = this.type
                var category = this.category

                var new_record = {'accuracy':accuracy, 'correct_num':correct_num, 'problem_num':problem_num, 'incorrect_words':this.incorrect_words,
                                'type':type, 'category':category,
                                'date':currentDate.getFullYear() + '-'+(parseInt(currentDate.getMonth())+ 1) +'-'+currentDate.getDate()}

                console.log("new record", new_record)

                chrome.storage.sync.get(['record'], function(userData) {

                    console.log("userData.record:",userData.record)

                    if(userData.record != null){
                        record = userData.record
                        console.log("record = userData.record:",record)
                    }
                    
                    record.push(new_record)

                    console.log("after push record",record)
                    
                    chrome.storage.sync.set({'record':record}, function(){
                            
                    })
                })

            if(confirm("메인 화면으로 돌아가시겠습니까?")){
            
                
                this.$router.push('/')
                
            }
        },
        makeOptions(full_options, current_index){

                var options = full_options[current_index]

                options.sort(function(){
                    return 0.5 - Math.random();
                })

                this.options = options
        },
        getData() {
            
            var ref = db.collection(this.type).doc(this.category)
            
            var problem_num = this.problem_num; // 문항 수

            const option_num = 5; // 옵션 갯수 (보기 갯수 5개 고정)

            var getData = ref.get() // 데이터 가져오기
            .then(doc => {
                if (!doc.exists) {
                console.log('No such document!');
                } else {
                    console.log('Document data:', doc.data());
                    this.words = doc.data().data // this.words에 firestore 데이터 저장
                    
                    console.log("this word : ", this.words)

                    this.data_index = this.words.length; // 데이터 전체 길이

                    console.log("데이터 전체 길이" + this.data_index)

                    function getRandomInt(min, max) { //min ~ max 사이의 임의의 정수 반환
                        return Math.floor(Math.random() * (max - min)) + min;
                    }


                    var pre_data = this.words //전처리 할 임시 전체 데이터 저장
                    
                    console.log("PRE DATA ::::::::::::", pre_data)

                    var problem_data = _.sampleSize(pre_data, problem_num) //문제로 낼 갯수만큼 전체 데이터에서 문항 수 만큼 랜덤으로 가져오기

                    console.log("PROBLEM DATA::::::::::::", problem_data)

                    var for_option_data = _.difference(pre_data, problem_data) // 문제로 내는 데이터를  전체 데이터에서 제외

                    //for_option_data = _.sampleSize(for_option_data, 100) //db가 커질수록 옵션 데이터 수를 지정

                    console.log("OPTION DATA:::::::::::", for_option_data)

                    this.show_data = problem_data // 문제로 낼 데이터로 설정

                    var answer = []
                    var wrong_answer = []

                    console.log("SHOW DATA::::::::::::::",this.show_data)

                    var wordToMean = Math.round(problem_num / 2)
                    var meanToWord = problem_num - wordToMean

                    for(var i=0; i<wordToMean; i++){ //영어단어보고 한글 뜻 맞추기
                    
                        answer.push({
                            "text" : this.show_data[i].word,
                            "value" : this.show_data[i].word,
                            "type" : "wordToMean",
                            "class" : this.show_data[i].class.split(','),
                            "question" : this.show_data[i].mean,
                            "answer": this.show_data[i].word,
                            "correctness" : true,
                            "word" : this.show_data[i].word,
                            "mean" : this.show_data[i].mean
                            })
                    }

                    for(var i=wordToMean; i<problem_num; i++){ // 한글 뜻 보고 영어단어 맞추기

                        //console.log("i:::::",i)
                        answer.push({
                            "text" : this.show_data[i].mean,
                            "value" : this.show_data[i].mean,
                            "type" : "meanToWord",
                            "class" : this.show_data[i].class.split(','),
                            "question" : this.show_data[i].word,
                            "answer" : this.show_data[i].mean,
                            "correctness" : true,
                            "word" : this.show_data[i].word,
                            "mean" : this.show_data[i].mean
                            })
                    }

                    //console.log("ANSWER", answer)
                        
                    for(var i=0; i<answer.length; i++){
                        
                        var filterArray = for_option_data.filter(function(ele){
                            return ele.class.includes(answer[i].class[0] || answer[i].class[1])
                        })

                        //console.log("filterArray",filterArray)

                        var optionArray = _.sampleSize(filterArray, 4)

                        //console.log("option Array ", optionArray)
                        if(answer[i].type == "wordToMean"){ // 오답 보기 만들기

                            for(var j=0; j<optionArray.length; j++){
                                wrong_answer.push({
                                    "text" : optionArray[j].word,
                                    "value" : optionArray[j].word,
                                    "type" : "wordToMean",
                                    "class" : optionArray[j].class.split(','),
                                    "question" : optionArray[j].mean,
                                    "answer" : optionArray[j].word,
                                    "correctness" : false,
                                    "word" : optionArray[j].word,
                                    "mean" : optionArray[j].mean,
                                })
                            }
                        }
                        else if(answer[i].type == "meanToWord"){

                            for(var j=0; j<optionArray.length; j++){ // 오답 보기 만들기
                                wrong_answer.push({
                                    "text" : optionArray[j].mean,
                                    "value" : optionArray[j].mean,
                                    "type" : "meanToWord",
                                    "class" : optionArray[j].class.split(','),
                                    "question" : optionArray.word,
                                    "answer" : optionArray[j].mean,
                                    "correctness": false,
                                    "word" : optionArray.word,
                                    "mean" : optionArray.mean
                                }) 
                            }
                        }
                        

                    }
                    this.answer = answer
                    this.show_data = answer

                    Array.prototype.division = function (n) {
                        var arr = this;
                        var len = arr.length;
                        var cnt = Math.floor(len / n);
                        var tmp = [];

                        for (var i = 0; i <= cnt; i++) {
                            tmp.push(arr.splice(0, n));
                        }

                        return tmp;
                    }

                    this.wrong_answer = wrong_answer.division(4)

                    //console.log("answer", this.answer)
                    //console.log("THIS WRONG ANSWER", this.wrong_answer)

                    for(var i =0; i<this.answer.length; i++){
                        var option = []
                        option.push(this.answer[i])
                        for(var j=0; j<this.wrong_answer[i].length; j++){
                            option.push(this.wrong_answer[i][j])
                        }
                        this.full_options.push(option)
                    }
                    

                    //console.log("full_options", this.full_options)
                    
                    this.makeOptions(this.full_options, this.current_index)
                    this.isLoaded = true

                }
            })
            .catch(err => {
                console.log('Error getting document', err);
            });

        }   
    },
    mounted () {
       //console.log("mounted :"+this.category) 
       this.getData()
       this.timer()
    
    }
}
</script>