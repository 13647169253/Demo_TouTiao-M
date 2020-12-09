<template>
  <div id="app">
<!-- 路由的出口 -->
    <router-view/>
    <h1><i class="iconfont icon-dianzan"></i>黑马头条</h1>
  </div>
</template>

<script>
 export default {
/* 在Vue调试工具中方便调试，也可以在进行组件缓存的时候需要 */
  name: 'App',
}
</script>

<style lang="less">
</style>
