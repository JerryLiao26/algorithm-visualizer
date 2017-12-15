<template>
  <div class="container">
    <h1>配置数据</h1>
    <select class="md-select" v-model="type">
      <option value="" disabled>请选择算法</option>
      <optgroup label="数">
        <option value="Sort">排序</option>
      </optgroup>
      <optgroup label="图">
        <option value="NearestPair">最近点对</option>
        <option value="MaxFlow">最大流</option>
      </optgroup>
    </select>
    <div class="row">
      <button class="md-button" @click="trigger()">
        {{ source_hint }}
      </button>
      <input type="file" id="file" v-on:change="read()">
    </div>
    <div class="row">
      <button class="md-button" @click="next()">
        下一步
      </button>
    </div>
  </div>
</template>

<script>
import router from '@/router'
export default {
  data() {
    return {
      type: '',
      source: '',
      source_hint: '选择数据源'
    }
  },
  methods: {
    read() {
      let that = this
      let reader = new FileReader()
      let file = document.getElementById('file').files[0]
      reader.readAsText(file)
      reader.onload = function(f) {
        that.source = this.result
        that.source_hint = '数据读取完成'
      }
    },
    trigger() {
      document.getElementById('file').click()
    },
    next() {
      localStorage.setItem('av_source', this.source)
      router.push({name: this.type})
    }
  }
}
</script>

<style>
#file {
  display: none;
}
</style>
