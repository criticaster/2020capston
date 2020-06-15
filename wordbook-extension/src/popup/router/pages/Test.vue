<template>
    <div class="container">
        
            <div class="row">
                <div class="col-sm-12" style="text-align:center">
                    <br/>
                    <b-form-group label="시험 종류를 선택 해 주세요">
                        
                        <b-form-radio-group
                            id="btn-radios-1"
                            v-model="selected_type"
                            :options="options_type"
                            buttons
                            button-variant="outline-primary"
                            size="lg"
                            name="radios-btn-default" style="width:400px"
                    ></b-form-radio-group>
                    </b-form-group>
                </div>
            </div>
            


            <div class="row">
                <div class="col-sm-3"></div>
                <div class="col-sm-6">
                    <div v-if="selected_type === 'TOEIC'">
                        <b-form-select v-model="selected_category" :options="options_category"></b-form-select>
                    </div>

                    <div v-else-if="selected_type === 'TOEFL'">
                        <p>토플 시험은 아직 준비중입니다.</p>
                    </div>
                </div>
            </div>
            <br/>
            <div class="row" v-show="selected_category !== null">
                <div class="col-sm-3"></div>
                <div class="col-sm-6">
                    <b-form-select v-model="selected_problem_num" :options="options_problem_num"></b-form-select>
                </div>
                <div class="col-sm-3"></div>
            </div>  
            <br/>
            <div class="row text-center" v-if="selected_type !== null && selected_category !== null && selected_problem_num !== null">
                <div class="col-sm-12">
                    <b-button pill variant="success" v-on:click="goto">테스트 시작</b-button>
                </div>
            </div>
            
        
    </div>
</template>

<script>

export default {
    data() {
        return {
            toggle: true,
            selected_type : null,
            options_type : [
                {text: "TOEIC", value: "TOEIC"},
                {text: "TOEFL", value: "TOEFL"}
                
            ],
            selected_category : null,
            options_category : [
                {text : "난이도 점수를 선택해주세요" , value: null},
                {text : "기초", value: '기초'},
                {text : "800점", value: '800'},
                {text : "900점", value: '900'}
            ],
            selected_problem_num : null,
            options_problem_num : [
                {text : "문항 수를 선택해주세요", value : null},
                {text : "3", value: 3},
                {text : "5", value: 5},
                {text : "10", value: 10}
            ]
        }
    },
    methods : {
        goto() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.$router.push({
                name:"TestView",
                params : {
                    "type":this.selected_type,
                    "category":this.selected_category,
                    "problem_num": this.selected_problem_num
                }
            })
        },
    }
}
</script>

<style lang="scss" scoped>
  .selectbutton {
      height: 100%;
      width: 50%;
  }
</style>