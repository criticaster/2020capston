<template>
    <div class="container">
        <b-img :src="img"></b-img>
        <h3 class="text-center">샘플 이미지</h3>
        <p>Record :: {{record}}</p>
        <p>History :: {{history}}</p>
    </div>
    
</template>

<script>
import sample_image from '../../../image/sample.png'
export default {
    data() {
        return {
            img : sample_image,
            record : [],
            history: []
        }
    },
    created() {
        this.init()
    },
    mounted() {

    },
    methods: {
        init : function() {
            var self = this
            chrome.storage.sync.get(['test_record'], function(res) {

                self.record = res.test_record

                // for(var i=0; i<self.words.length; i++){
                //     var id_data = i;
                //     var word_data = self.words[i].word;
                //     var mean_data = self.words[i].ko_means.toString();
                //     var createdAt_data = self.words[i].date;
                //     console.log(id_data + " "+ word_data + " "+ mean_data + "" + createdAt_data)
                
                // self.rows.push({
                //     "id":id_data, "word":word_data, "mean":mean_data, "createdAt":createdAt_data,
                //     })
                // }
            })
            chrome.storage.sync.get(['search_history'], function(res){
                self.history = res.search_history
            })
        }
    }
}
</script>