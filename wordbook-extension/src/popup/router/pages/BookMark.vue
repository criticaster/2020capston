<template>
        
        <div class="h2 mb-0">
        <br />
        <div class="row">
            <div class="col-sm-12">
                <h3><b-icon icon="clock-history"></b-icon> 검색 기록</h3>
                <vue-good-table
                ref="table"
                :columns="search_columns"
                :rows="search_rows"
                :pagination-options="{
                    rowsPerPageLabel: '데이터 보기',
                    enabled: true}">
                    <template slot="table-row" slot-scope="props">
                        
                        <span v-if="props.column.field == 'search'">
                            <b-button variant="outline-primary" size="sm" v-on:click="requestSearch(props.row)"><b-icon icon="search"></b-icon></b-button>
                        </span>
                        <span v-if="props.column.field == 'delete'">
                            <b-button variant="outline-primary" size="sm" v-on:click="deleteSearchHistory(props.row)"><b-icon icon="trash"></b-icon></b-button>
                        </span>
                        <span v-else>
                            {{props.formattedRow[props.column.field]}}
                        </span>
                    </template>
                </vue-good-table>
            </div>
        </div>
        <!-- <div>
        <p>data from firebase firestore</p>
        <ul>
            <li v-for="(value, idx) in words" v-bind:key="idx">단어 : {{ idx }} / 뜻 : {{ value }} </li>
        </ul>
        </div> -->
        <br/>
        <br/>
        <div class="row">
            <div class="col-sm-12">

                <h3><b-icon icon="book"></b-icon> 단어장</h3>
                <vue-good-table
                ref="table"
                :columns="columns"
                :rows="rows"
                :pagination-options="{
                    rowsPerPageLabel: '데이터 보기',
                    enabled: true}"
                :search-options="{
                    enabled: true,
                    skipDiacritics: true,
                    placeholder: 'Search this table'}">

                    <template slot="table-row" slot-scope="props">
                        <span v-if="props.column.field == 'icon'">
                            <b-button variant="outline-primary" size="sm" v-on:click="listen(props.row)"><b-icon icon="soundwave"></b-icon></b-button>
                        </span>
                        <span v-if="props.column.field == 'delete'">
                            <b-button variant="outline-primary" size="sm" v-on:click="deleteBookmark(props.row)"><b-icon icon="trash"></b-icon></b-button>
                        </span>
                        <span v-else>
                            {{props.formattedRow[props.column.field]}}
                        </span>
                    </template>
                </vue-good-table>
            </div>
        </div>


    </div>

    
</template>

<script>
import { db } from '../../../background'
import speaker_icon from '../../../icons/speaker.png'
export default {
    name: "Bookmark",
    mounted() {

        // chrome.storage.sync.get(['word_list'], function(userData) {
            
        //     var word_list = userData.word_list;
        //     console.log(word_list)
        //     
        // })

    },
    
    data() {
        return {
            temp_word_list:[],
            history:[],
            words:[],
            temp_history:[],
            search_columns: [
                {
                    label: '단어',
                    field: 'word',
                },
                {
                    label: '날짜',
                    field: 'date',
                    type: 'date',
                    dateInputFormat: 'yyyy-MM-dd',
                    dateOutputFormat: 'MM-dd',
                },
                {
                    label: '검색',
                    field: 'search',
                    tdClass: 'text-center'
                },
                {
                    label: '삭제',
                    field: 'delete',
                    tdClass: 'text-center'
                }
            ],
            search_rows: [],
            columns: [
                {
                label: '단어',
                field: 'word',
                width: '120px',
                tdClass: 'text-center'
                },
                {
                label: '뜻',
                field: 'mean',
                type: 'text',
                width: '250px',
                tdClass: 'text-center'
                },
                {
                label: '추가일',
                field: 'createdAt',
                type: 'date',
                dateInputFormat: 'yyyy-MM-dd',
                dateOutputFormat: 'MM-dd',
                width: '90px',
                tdClass: 'text-center'
                },
                {
                label: '듣기',
                field: 'icon',
                type: 'text',
                width: '70px',
                tdClass: 'text-center',
                sortable : false,

                },
                {
                label: '삭제',
                field: 'delete',
                type: 'text',
                width: '70px',
                tdClass: 'text-center',
                sortable : false
                }
                
         ],
        rows: [],
            // { id:1, word:"credential", mean: "신임장", createdAt: '2020-04-28' },
            // { id:2, word:"firsthand", mean: "직접적인", createdAt: '2020-04-28'},
            // { id:3, word:"on occasion", mean: "때때로", createdAt: '2020-04-29'},
            // { id:4, word:"command", mean: "구사력, 명령, 지배력", createdAt: '2020-05-02'},
            // { id:5, word:"eagerness", mean: "열의", createdAt: '2020-05-04'},
            // { id:6, word:"mindful", mean: "유념하는", createdAt: '2020-05-08'},
        
    }
    
  },
  created() {
        
        this.init();

    },

    methods: {
        init : function() {
            var self = this
            chrome.storage.sync.get(['word_list'], function(userData) {
                
                if(userData.word_list != null){

                    self.words = userData.word_list

                    console.log(self.words)
                    
                    for(var i=0; i<self.words.length; i++){
                    var id_data = i;
                    var word_data = self.words[i].word;
                    var mean_data = self.words[i].ko_means.toString();
                    var createdAt_data = self.words[i].date;
                    console.log(id_data + " "+ word_data + " "+ mean_data + "" + createdAt_data)
                    
                    self.rows.push({
                        "id":id_data, "word":word_data, "mean":mean_data, "createdAt":createdAt_data,
                        })
                    }
                }
            

            chrome.storage.sync.get(['search_history'], function(userData){
                
                console.log("history userData:::::::", userData)
                if(userData.search_history != null){
                    self.history = userData.search_history

                    for(var i=0; i<self.history.length; i++){
                        var id_data = i;
                        var word = self.history[i].word
                        var date = self.history[i].date

                        self.search_rows.push({
                            "id":id_data, "word":word, "date":date
                        })
                    }
                }
            })
            })
        },
        requestSearch(row){
            
                var val = row.word
                //alert(val)
                document.getElementById('search_input').value = val

                var btn = document.getElementById('search_button').click()
                var elem = document.getElementById('search_input')
                elem.scrollIntoView()
                
            
        },
        deleteSearchHistory(row){
            if(confirm(row.word + "를 검색 기록에서 삭제 하시겠습니까?")){
                
                chrome.storage.sync.get(['search_history'], function(userData){
                    console.log(JSON.stringify(userData))
                    const isRowData = (element) => element.word == row.word
    
                    console.log(userData.search_history.findIndex(isRowData))
                    var delete_data_index = userData.search_history.findIndex(isRowData)
                    var history = userData.search_history
    
                    this.temp_history = history
    
                    this.temp_history.splice(delete_data_index, 1)
                    
    
                    chrome.storage.sync.set({'search_history': history}, function(){
                        alert("삭제 되었습니다.")
                    })
                    
                })
            }
            this.$router.go()
        },
        listen(row) {
            var word = row.word
            chrome.tts.speak(word, {'lang':'en-US', 'rate':1.0});
        },
        deleteBookmark(row){
            
            if(confirm(row.word + "를 단어장에서 삭제 하시겠습니까?")){
                
                chrome.storage.sync.get(['word_list'], function(userData){
                    console.log(JSON.stringify(userData))
                    const isRowData = (element) => element.word == row.word
    
                    console.log(userData.word_list.findIndex(isRowData))
                    var delete_data_index = userData.word_list.findIndex(isRowData)
                    var word_list = userData.word_list
    
                    this.temp_word_list = word_list
    
                    this.temp_word_list.splice(delete_data_index, 1)
                    
    
                    chrome.storage.sync.set({'word_list': word_list}, function(){
                        alert("삭제 되었습니다.")
                    })
                    
                })
            }
            this.$router.go()
        }
        
    },
    firestore(){
    return {
      words : db.collection('TOEIC').doc('900')
    }
  },
}
</script>