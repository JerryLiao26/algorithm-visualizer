<template>
  <div class="container">
    <canvas class="canvas" id="canvas"></canvas>
    <div class="points" id="points">
      <div class="row" v-for="(item, index) in grouped_points" :key="index">
        <div class="point" v-bind:id="x.id" v-for="(x, i) in item" :key="i">
          {{ x.id }}
          <span v-if="index == 0">S</span>
          <span v-if="index == 3">t</span>
        </div>
      </div>
    </div>
    <h3>当前路线：</h3>
    <p v-for="(item, index) in routes">
      {{ item }}
    </p>
    <h3>当前最大流：{{ max }}</h3>
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
      steps: [
        [
          {route: '1-2-3-6', flow: 4},
          {route: '1-2-5-6', flow: 2},
          {route: '1-4-5-6', flow: 2}
        ],
        [
          {route: '1-2-3-6', flow: 4},
          {route: '1-2-5-6', flow: 2},
          {route: '1-4-5-6', flow: 2},
          {route: '1-4-3-2-5-6', flow:2}
        ]
      ],
      paths: [],
      points: [],
      cap_points: []
    }
  },
  computed: {
    grouped_points() {
      let group = []
      let len = this.points.length
      let div = Math.floor(len/2)
      group[0] = [this.points[0]] // Start point
      group[1] = this.points.slice(1, div) // Upper line
      group[2] = this.points.slice(div, len-1) // Lower line
      group[3] = [this.points[len-1]] // End point
      return group
    },
    max() {
      if (this.cur >= 1) {
        let max = 0
        for (let each of this.steps[this.cur-1]) {
          max += each.flow
        }
        return max
      }
    },
    routes() {
      if (this.cur >= 1) {
        let routes = []
        for (let each of this.steps[this.cur-1]) {
          let str = each.route + '(' + each.flow + ')'
          routes.push(str)
        }
        return routes
      }
    }
  },
  created() {
    this.parse()
  },
  mounted() {
    this.paint()
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
        this.cur = 0
      }
      this.flow()
    },
    next_step() {
      let len = this.steps.length
      if (this.cur < len) {
        this.cur += 1
      }
      else {
        this.cur = len
      }
      this.flow()
    },
    flow() {
      if (this.cur >= 1) {
        // Reset graph
        this.cap_points = []
        this.paint()
        //  Flow
        for (let each of this.steps[this.cur-1]) {
          let list = each.route.split('-')
          for (var i = 0; i < list.length-1; i++) {
            this.link_flow(list[i], list[i+1])
          }
        }
      }
    },
    link_flow(a, b) {
      // Parent container offset
      let x_off = document.getElementsByClassName('container')[0].offsetLeft
      let y_off = document.getElementsByClassName('container')[0].offsetTop
      // Get point half-width
      let a_x_mid = this.get_hw(a).w / 2
      let a_y_mid = this.get_hw(a).h / 2
      let b_x_mid = this.get_hw(b).w / 2
      let b_y_mid = this.get_hw(b).h / 2
      // Get canvas and configure
      let item = document.getElementById('canvas')
      let canvas = item.getContext('2d')
      canvas.beginPath()
      canvas.strokeStyle = 'blue'
      canvas.lineWidth = 2
      // Calculate
      let a_center_x = this.get_xy(a).x - x_off + a_x_mid
      let a_center_y = this.get_xy(a).y - y_off + a_y_mid
      let b_center_x = this.get_xy(b).x - x_off + b_x_mid
      let b_center_y = this.get_xy(b).y - y_off + b_y_mid
      let ab_center_x = (a_center_x + b_center_x) / 2
      let ab_center_y = (a_center_y + b_center_y) / 2
      // Draw line
      canvas.moveTo(a_center_x, a_center_y)
      canvas.lineTo(b_center_x, b_center_y)
      canvas.closePath()
      canvas.stroke()
      // Display
      this.show_canvas()
    },
    mark_cap() {
      let item = document.getElementById('canvas')
      let canvas = item.getContext('2d')
      canvas.font = "15pt Arial bolder"
      // Search for overlap
      for (var i = 0; i < this.cap_points.length; i++) {
        for (var j = 0; j < this.cap_points.length; j++) {
          if (i != j) {
            if (this.cap_points[i].x == this.cap_points[j].x && this.cap_points[i].y == this.cap_points[j].y) {
              this.cap_points[i].x -= 15
              this.cap_points[j].x += 15
            }
          }
        }
      }
      // Mark
      for (let each of this.cap_points) {
        canvas.fillText(each.cap, each.x, each.y)
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
      let point_list = lines[0].split(' ')
      let path_list = lines[1].split(' ')
      // Store points
      for (let each of point_list) {
        let obj = {
          id: each
        }
        that.points.push(obj)
      }
      // Store paths
      for (let each of path_list) {
        let obj = [
          each.split(',')[0],
          each.split(',')[1],
          each.split(',')[2]
        ]
        that.paths.push(obj)
      }
    },
    paint() {
      // Fetch canvas
      let item = document.getElementById('canvas')
      // Create canvas
      item.setAttribute('width', this.get_hw('points').w)
      item.setAttribute('height', this.get_hw('points').h)
      // Link points
      for (let each of this.paths) {
        this.link(each[0], each[1], each[2])
      }
      this.mark_cap()
      this.show_canvas()
    },
    link(a, b, cap) {
      // Parent container offset
      let x_off = document.getElementsByClassName('container')[0].offsetLeft
      let y_off = document.getElementsByClassName('container')[0].offsetTop
      // Get point half-width
      let a_x_mid = this.get_hw(a).w / 2
      let a_y_mid = this.get_hw(a).h / 2
      let b_x_mid = this.get_hw(b).w / 2
      let b_y_mid = this.get_hw(b).h / 2
      // Get canvas and configure
      let item = document.getElementById('canvas')
      let canvas = item.getContext('2d')
      canvas.beginPath()
      canvas.strokeStyle = 'black'
      canvas.lineWidth = 1
      // Calculate
      let a_center_x = this.get_xy(a).x - x_off + a_x_mid
      let a_center_y = this.get_xy(a).y - y_off + a_y_mid
      let b_center_x = this.get_xy(b).x - x_off + b_x_mid
      let b_center_y = this.get_xy(b).y - y_off + b_y_mid
      let ab_center_x = (a_center_x + b_center_x) / 2
      let ab_center_y = (a_center_y + b_center_y) / 2
      // Store capacitiy
      let obj = {
        x: ab_center_x,
        y: ab_center_y,
        cap: cap
      }
      this.cap_points.push(obj)
      // Draw line
      canvas.moveTo(a_center_x, a_center_y)
      canvas.lineTo(b_center_x, b_center_y)
      canvas.closePath()
      canvas.stroke()
    },
    show_canvas() {
      let canvas = document.getElementById('canvas')
      let points = document.getElementById('points')
      points.style.background = 'url(' + canvas.toDataURL() + ')'
    },
    get_xy(id) {
      let item = document.getElementById(id)
      let obj = {
        x: item.offsetLeft,
        y: item.offsetTop
      }
      return obj
    },
    get_hw(id) {
      let item = document.getElementById(id)
      let obj = {
        w: item.clientWidth,
        h: item.clientHeight
      }
      return obj
    }
  }
}
</script>

<style scoped>
.canvas {
  display: none;
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
