<template>
    <div>
        <br />
        <div>
        <p>data from firebase firestore</p>
        <ul>
            <li v-for="(value, idx) in words" v-bind:key="idx">단어 : {{ idx }} / 뜻 : {{ value }} </li>
        </ul>
        </div>

        <vue-good-table
        :columns="columns"
        :rows="rows"
        :search-options="{
            enabled: true,
            skipDiacritics: true,
            placeholder: 'Search this table'
        }">
        </vue-good-table>






    </div>
    
</template>

<script>
import { db } from '../../../background'

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
            words:[],
            columns: [
                {
                label: '단어',
                field: 'word',
                },
                {
                label: '뜻',
                field: 'mean',
                type: 'text',
                },
                {
                label: '추가일',
                field: 'createdAt',
                type: 'date',
                dateInputFormat: 'yyyy-MM-dd',
                dateOutputFormat: 'yyyy-MM-dd',
                },
                
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
            })
        }
    },
    firestore(){
    return {
      words : db.collection('TOEIC').doc('900')
    }
  },
}
</script>