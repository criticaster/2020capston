<template>
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <reactive :chart-data="datacollection"></reactive>
            </div>
        </div>
        <button id="btn" v-on:click="fillData" hidden>차트보기</button>
        
        <div class="h2 mb-0">
        <br />
        <br />
        <div class="row">
            <div class="col-sm-12">
                <h3><b-icon icon="clock-history"></b-icon>테스트 기록</h3>
                <vue-good-table
                ref="table"
                :columns="columns"
                :rows="rows"
                :pagination-options="{
                    rowsPerPageLabel: '데이터 보기',
                    enabled: true}">
                    <template slot="table-row" slot-scope="props">
                        
                        <span v-if="props.column.field == 'content'">
                            <b-button variant="outline-primary" size="sm" v-on:click="lookTest(props.row)">자세히 보기 <b-icon icon="search"></b-icon></b-button>
                        </span>
                        <!-- <span v-if="props.column.field == 'delete'">
                            <b-button variant="outline-primary" size="sm" v-on:click="deleteTest(props.row)">삭제 <b-icon icon="trash"></b-icon></b-button>
                        </span> -->
                        <span v-else>
                            {{props.formattedRow[props.column.field]}}
                        </span>
                    </template>
                </vue-good-table>
            </div>
        </div>
    </div>
</div>

    
</template>

<script>

import Reactive from './Reactive'

export default {
    components:{
        Reactive
    },
    data() {
        return {
            record : [],
            history: [],
            datacollection: null,
            modal_header:'',
            modal_body:'',
            modal_footer:'',
            rows : [],
            columns: [
                
                {
                    label: '날짜',
                    field: 'date',
                    type: 'date',
                    dateInputFormat: 'yyyy-MM-dd',
                    dateOutputFormat: 'MM-dd',
                    tdClass: 'text-center'
                },
                {
                    label: '시험 종류',
                    field: 'type_category',
                    tdClass: 'text-center'
                },
                {
                    label: '적중률',
                    field: 'accuracy',
                    tdClass: 'text-center'
                },
                {
                    label: '상세정보',
                    field: 'content',
                    tdClass: 'text-center'
                },
                // {
                //     label: '삭제',
                //     field: 'delete',
                //     tdClass: 'text-center'
                // }
            ]
            
        }
        
    },
    created() {
        this.init()
    },
    mounted() {
        
        
    },
    methods: {
        deleteTest(row) {
            //if(confirm("해당 기록을 삭제 하시겠습니까?")){
                
                chrome.storage.sync.get(['record'], function(userData){
                    
                    
                    const isRowData = (element) => element.incorrect_words == row.detail

                    var delete_data_index = userData.record.findIndex(isRowData)
                    console.log("delete_data_index!!!!!",delete_data_index)   
                    var record = userData.record
    
                    //record.splice(delete_data_index, 1)
                    
    
                    // chrome.storage.sync.set({'record': record}, function(){
                    //    alert("삭제 되었습니다.")
                    // })
                    
                })
            //}
            //this.$router.go()
        },
        lookTest(row){
            var txt = ''
            
            for(var i=0; i<row.detail.length; i++){
                txt += "["+(i+1) + "] "
                txt += row.detail[i].word
                txt += ' : '
                txt += row.detail[i].mean
                txt += '\r\n'
            }
            this.$swal({
                title : '오답 노트',
                text : txt,
                icon : 'info',
                button: '확인'
            })
            

        },
        init() {
            var self = this
            chrome.storage.sync.get(['record'], function(res) {
                self.record = res.record

                var rows = []
                
                for(var i=0; i<self.record.length; i++){
                    
                    //console.log(i+"번쨰 incorrect words"+ JSON.stringify(self.record[i].incorrect_words))
                    var incorrect_words = []
                    for(var j=0; j<self.record[i].incorrect_words.length; j++){
                        incorrect_words.push(self.record[i].incorrect_words[j])
                    }
                    rows.push({date:self.record[i].date, type_category:self.record[i].type + " / " +self.record[i].category +"점", accuracy:self.record[i].accuracy+"%", detail:incorrect_words})
                }
                self.rows = rows
                chrome.storage.sync.get(['search_history'], function(res){
                    self.history = res.search_history
                })

                document.getElementById('btn').click()
            })
            // { id:1, word:"credential", mean: "신임장", createdAt: '2020-04-28' }
            
        },
        fillData() {
        
        var rec = this.record
        var labels_ = []
        var data_ = []

        for(var i=0; i<rec.length; i++){
            labels_.push(rec[i].date)
            data_.push(rec[i].accuracy)
        }
        
        this.datacollection = {
                // Data for the y-axis of the chart
                labels : labels_,
                //   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 
                //   'September', 'October', 'November', 'December'],
                datasets: [
                    {
                    label: '적중률',
                    backgroundColor: '#f87979',
                    // Data for the x-axis of the chart
                    data: data_
                    }
                ]
        }
            // console.log("this.recorddddddd", this.record)
            

            // function label_delay(item, targetArray){
            //     return new Promise(resolve => setTimeout(() => {
            //         targetArray.push(item)
            //         resolve()}, 1000))
            //     }
            // function data_delay(item, targetArray){
            //     return new Promise(resolve => setTimeout(() => {
            //         targetArray.push(item)
            //         resolve()}, 1000))
            //     }

            // async function loop(array){
            //     var labels_ = []
            //     var data_ = []
            //     for(const number of array){
            //         await label_delay(array[number].date, labels_)
            //         await data_delay(array[number].accuracy, data_)
            //     }

                
    

            //loop(this.record)
            
            // for(var i=0; this.record.length; i++){
            //     labels_.push(this.record[i].date)
            //     data_.push(this.record[i].accuracy)
            // }

    
        
      },
        
    }
}
</script>