<template>
    <div class="container">
        <b-img :src="img"></b-img>
        <h3>샘플 이미지입니다</h3>
    </div>
    
</template>

<script>
import sample_image from '../../../image/sample.png'
export default {
    data() {
        return {
            img : sample_image
        }
    }
}
</script>