<!-- 宣传视频页面 -->
<template>
  <div>
    <video id="video" width="900px" height="600px" controls>
      <source src="../../assets/实训项目.mp4" type="video/mp4">
    </video>
  </div>
</template>

<script>
export default {
  name: "VideoPage",
  data () {
    return {
    }
  }
}
</script>

<style  scoped>
*{
  margin: 0;
  padding: 0;
}

#video{
  display: block;
  margin: -40px auto;
}
</style>
