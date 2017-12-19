<template>
  <div class="container">
    <canvas class="canvas" id="canvas" width="300" height="300"></canvas>
    <div class="points" id="points">
      <div class="row" v-for="(item, index) in grouped_points" :key="index">
        <template v-for="(x, i) in item">
          <div class="point" v-if="x.x != -1" :id="x.x + '-' + x.y">
            {{x.x}},{{x.y}}
          </div>
          <div class="placeholder" v-if="x.x == -1"></div>
        </template>
      </div>
    </div>
    <h3>当前最短距离：{{ min_hint }}</h3>
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
      points: [],
      dividers: [],
      min_hint: '暂无'
    }
  },
  mounted() {
    this.parse()
    this.paint()
  },
  computed: {
    grouped_points() {
      let group = []
      let order = 0
      let num = this.points.length
      while (num > 0) {
        let list = []
        for (let each of this.points) {
          if (each.y == order) {
            list[each.x] = each
            num--
          }
        }
        group.push(list)
        order++
      }
      // Filter
      for (var i = 0; i < group.length; i++) {
        for (var j = 0; j < group[i].length; j++) {
          if (group[i][j] === null || group[i][j] === undefined) {
            group[i][j] = {x: -1, y: -1}
          }
        }
      }
      return group
    }
  },
  methods: {
    back() {
      router.push({name: 'Start'})
    },
    last_step() {
      if (this.cur > 0) {
        this.cur -= 1
        // Dividers
        let len = this.steps.length
        if (JSON.stringify(this.steps[this.cur].div) === "[]") {
          this.dividers.push(this.steps[len - this.cur - 1].div)
        }
        else {
          this.dividers.pop()
        }
        // Minimium
        if (this.cur !== 0 && this.steps[this.cur-1].min != -1) {
          this.min_hint = this.steps[this.cur-1].min
        }
        else {
          this.min_hint = '暂无'
        }
        this.paint()
      }
      else {
        this.cur = 0
      }
    },
    next_step() {
      let len = this.steps.length
      if (this.cur < len) {
        this.cur += 1
        // Dividers
        if (JSON.stringify(this.steps[this.cur-1].div) === "[]") {
          this.dividers.pop()
        }
        else {
          this.dividers.push(this.steps[this.cur-1].div)
        }
        // Minimium
        if (this.steps[this.cur-1].min != -1) {
          this.min_hint = this.steps[this.cur-1].min
        }
        else {
          this.min_hint = '暂无'
        }
        this.paint()
      }
      else {
        this.cur = len
      }
    },
    show_canvas() {
      let canvas = document.getElementById('canvas')
      let points = document.getElementById('points')
      points.style.height = points.clientWidth + 'px'
      points.style.background = 'url(' + canvas.toDataURL() + ')'
    },
    paint() {
      this.draw_system()
      if (this.cur >= 1) {
        this.draw_dividers()
        for (let each of this.steps[this.cur-1].lines) {
          this.draw_line(each[0], each[1])
        }
      }
      this.show_canvas()
    },
    draw_system() {
      // Get canvas and configure
      let item = document.getElementById('canvas')
      let points = document.getElementById('points')
      points.style.height = points.clientWidth + 'px'
      let canvas = item.getContext('2d')
      // Create canvas
      item.setAttribute('width', this.get_hw('points').w)
      item.setAttribute('height', this.get_hw('points').h)
      // Draw
      canvas.beginPath()
      canvas.strokeStyle = 'black'
      canvas.lineWidth = 2
      // Axis
      // X Axis
      canvas.moveTo(20, 20)
      canvas.lineTo(20, points.clientWidth)
      canvas.moveTo(20, 20)
      canvas.lineTo(points.clientWidth, 20)
      canvas.closePath()
      canvas.stroke()
    },
    draw_dividers() {
      let system_shift = 20
      let item = document.getElementById('canvas')
      let canvas = item.getContext('2d')
      for (let each_list of this.dividers) {
        for (let each of each_list) {
          canvas.beginPath()
          canvas.strokeStyle = 'red'
          canvas.lineWidth = 2
          let shift = each * (system_shift * 2) + system_shift
          canvas.moveTo(shift, system_shift)
          canvas.lineTo(shift, document.getElementById('points').clientWidth)
          canvas.closePath()
          canvas.stroke()
        }
      }
    },
    draw_line(a, b) {
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
      // Store points
      let point_list = lines[0].split(' ')
      for (let each of point_list) {
        let obj = {
          x: each.split(',')[0],
          y: each.split(',')[1]
        }
        this.points.push(obj)
      }
      // Store steps
      for (var i = 1; i < lines.length; i+=3) {
        // Parse div
        let div_list = []
        for (let each of lines[i].split(' ')) {
          if (each !== '') {
            div_list.push(each)
          }
        }
        // Parse lines
        let lines_list = []
        for (let each of lines[i+2].split(' ')) {
          if (each !== '') {
            lines_list.push(each.split(','))
          }
        }
        let obj = {
          div: div_list,
          min: lines[i+1].trim(),
          lines: lines_list
        }
        this.steps.push(obj)
      }
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

<style>
.canvas {
  display: none;
}

.points {
  width: 100%;

  margin-left: auto;
  margin-right: auto;
}

.row {
  height: 40px;
}

.placeholder {
  display: inline-block;

  width: 40px;
  height: 40px;

  float: left;
}

.point {
  width: 30px;
  height: 30px;

  margin: 5px;

  font-size: 15px;
  line-height: 30px;

  display: inline-block;

  border-radius: 50%;

  background-color: yellow;

  float: left;
}
</style>
