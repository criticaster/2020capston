<template>
<div class="container text-center">
    <div class="row">
        <div class="col-sm-12">
            <h4>영단어 테스트, 사전 기능 통합 확장프로그램</h4>
            <h2 style="color:green">Highlight Dictionary</h2>
        </div>
    </div>
    <br/>
    <br/> 
    <div class="row">
        <div class="col-sm-12">
           <b-carousel
      id="carousel-1"
      v-model="slide"
      :interval="4000"
      controls
      indicators
      background="#ababab"
      img-width="1024"
      img-height="480"
      style="text-shadow: 1px 1px 2px #333;"
      @sliding-start="onSlideStart"
      @sliding-end="onSlideEnd"
    >
      <!-- Text slides with image -->
      <b-carousel-slide
        img-src="https://i.postimg.cc/rwJfd819/1.jpg"
      ></b-carousel-slide>
      <b-carousel-slide
        img-src="https://i.postimg.cc/T14Ckh4j/1.jpg"
      ></b-carousel-slide>
      <b-carousel-slide
        img-src="https://i.postimg.cc/136JHmc6/2.jpg"
      ></b-carousel-slide>
      <b-carousel-slide
        img-src="https://i.postimg.cc/j5v87M6F/1.jpg"
      ></b-carousel-slide>
      <b-carousel-slide
        img-src="https://i.postimg.cc/kG4TFWfX/2.jpg"
      ></b-carousel-slide>
      <b-carousel-slide
        img-src="https://i.postimg.cc/Pr0SYpZT/1.jpg"
      ></b-carousel-slide>
      <b-carousel-slide
        img-src="https://i.postimg.cc/T2772H3y/2.jpg"
      ></b-carousel-slide>
      <b-carousel-slide
        img-src="https://i.postimg.cc/xTXsXyX6/3.jpg"
      ></b-carousel-slide>
      
           </b-carousel>
  
            <h5>사용 방법 및 기능 설명</h5>
            <legend>[1] 검색 </legend>
            <p>상단의 검색 창에 검색하고 싶은 영어 단어를 검색합니다.</p>
            <p>Daum 사전에서 검색한 결과를 보여줍니다.</p>
            <p>웹에서 사용 할 수 있는 툴팁 사전을 스위치 버튼으로 기능을 끄고 켤 수 있습니다.</p>
            <br/>
            <legend>[2] 대시 보드</legend>
            <p>사용자의 테스트 기록을 차트로 보여줍니다.</p>
            <p>아래의 테스트 기록 테이블에서 오답 노트를 볼 수 있습니다.</p>
            <br/>
            <legend>[3] 단어장</legend>
            <p>사용자가 원하는 단어를 추가하고 삭제할 수 있습니다.</p>
            <p>테스트 후 또는 웹 서핑시 우클릭 메뉴로 북마크에 단어를 추가 할 수 있습니다.</p>
            <p>검색 기록을 볼 수 있으며, 바로 검색을 제공합니다.</p>
            <br/>
            <legend>[4] 테스트</legend>
            <p>TOEIC 기출 영단어 테스트를 제공합니다.</p>
            <p>기초, 800점, 900점으로 분류 되있으며 해당 점수에 맞는 단어를 제공합니다.</p>
            <p>테스트는 매 회 3, 5, 10 문항으로 사용자가 고를 수 있습니다.</p>
            <p>문제 당 20초가 주어지며 제한시간 내에 보기를 선택하는 객관식 형태입니다.</p>
        </div>
        
    </div>
</div>
</template>

<script>
import wb1 from '../../../image/단어장1.jpg'
import wb2 from '../../../image/단어장2.jpg'
import ds1 from '../../../image/대시보드1.jpg'
import ds2 from '../../../image/대시보드2.jpg'
import tt1 from '../../../image/테스트1.jpg'
import tt2 from '../../../image/테스트2.jpg'
import tt3 from '../../../image/테스트3.jpg'

export default {
    data() {
        return {
            wb1 : wb1,
            wb2 : wb2,
            ds1 : ds1,
            ds2 : ds2,
            tt1 : tt1,
            tt2 : tt2,
            tt3 : tt3
        }
    }
}
</script>