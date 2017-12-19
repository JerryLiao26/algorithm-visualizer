<template>
  <div class="container">
    <div class="points" id="points">
      <div class="point" v-for="(item, index) in display_points" :key="index">
        {{ item.index+1 }}:{{ item.val }}
      </div>
    </div>
    <div class="row">
      <button class="md-button" @click="last_step()">上一步</button>
      <span>当前第{{ cur }}步，共有{{ steps.length }}步</span>
      <button class="md-button" @click="next_step()">下一步</button>
    </div>
    <div class="row">
      <button class="md-button" @click="back()">返回</button>
    </div>
  </div>
</template>

<script>
import router from '@/router'
export default {
  data() {
    return {
      cur: 0,
      steps: [],
      points: []
    }
  },
  computed: {
    display_points() {
      if (this.cur == 0) {
        return this.points
      }
      else {
        let arr = []
        let orders = this.steps[this.cur-1]
        for (var i = 0; i < orders.length; i++) {
          for (let each of this.points) {
            if (each.index == orders[i]-1) {
              arr[i] = each
              break
            }
          }
        }
        return arr
      }
    }
  },
  created() {
    this.parse()
  },
  methods: {
    back() {
      router.push({name: 'Start'})
    },
    last_step() {
      if (this.cur > 0) {
        this.cur -= 1
      }
      else {
        this.cur == 0
      }
    },
    next_step() {
      let len = this.steps.length
      if (this.cur < len) {
        this.cur += 1
      }
      else {
        this.cur == len
      }
    },
    parse() {
      let that = this
      let source = localStorage.getItem('av_source')
      // Incorrect
      if (source.trim() == '') {
        alert('数据源配置有误，请重新选择')
        router.push({name: 'Start'})
      }
      // Parse
      let lines = source.trim().split('\n')
      let array = lines[0].split(' ')
      for (var i = 0; i < array.length; i++) {
        let obj = {
          index: i,
          val: array[i]
        }
        this.points.push(obj)
      }
      for (let each_line of lines.slice(1)) {
        this.steps.push(each_line.split(' '))
      }
    }
  }
}
</script>

<style scoped>
.container {
  margin-top: 100px;
}

.point {
  width: 40px;
  height: 40px;

  line-height: 40px;

  margin: 50px;

  display: inline-block;

  border-radius: 50%;

  background-color: yellow;
}
</style>
