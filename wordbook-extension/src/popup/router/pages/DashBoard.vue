<template>
    <div class="container">
        <b-img :src="img"></b-img>
        <h3 class="text-center">샘플 이미지</h3>
        
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