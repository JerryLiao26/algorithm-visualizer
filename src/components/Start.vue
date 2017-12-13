<template>
  <div class="container">
    <h1>配置数据</h1>
    <select class="md-select" v-model="type">
      <option value="" disabled>请选择数据类型</option>
      <optgroup label="数">
        <option value="array">数组</option>
      </optgroup>
      <optgroup label="图">
        <option value="unoriented">无向图</option>
        <option value="oriented">有向图</option>
      </optgroup>
    </select>
    <input class="md-input" type="text" v-model="source" placeholder="数据源路径">
    <button class="md-button" @click="next()">
      下一步
    </button>
  </div>
</template>

<script>
import router from '@/router'
export default {
  data() {
    return {
      type: '',
      source: ''
    }
  },
  methods: {
    next() {
      localStorage.setItem('av_type', this.type)
      localStorage.setItem('av_source', this.source)
      router.push({name: 'Show'})
    }
  }
}
</script>

<style>

</style>
