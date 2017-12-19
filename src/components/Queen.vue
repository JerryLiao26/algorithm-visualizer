<template>
  <div class="container">
    <canvas class="canvas" id="canvas" width="300" height="300"></canvas>
    <div class="points" id="points">
      <div class="row" v-for="(item, index) in grouped_points" :key="index">
        <template v-for="(x, i) in item">
          <div class="point" v-if="x.x != -1" :id="x.x + '-' + x.y">
            {{ x.x }},{{ x.y }}
          </div>
          <div class="placeholder" v-if="x.x == -1"></div>
        </template>
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
      scale: null
    }
  },
  mounted() {
    this.parse()
    this.paint()
  },
  computed: {
    grouped_points() {
      if (this.cur >= 1) {
        let group = []
        let order = 0
        let points = this.steps[this.cur-1]
        let num = points.length
        while (num > 0) {
          let list = []
          for (let each of points) {
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
      else {
        return []
      }
    }
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
    },
    next_step() {
      let len = this.steps.length
      if (this.cur < len) {
        this.cur += 1
      }
      else {
        this.cur = len
      }
    },
    show_canvas() {
      let canvas = document.getElementById('canvas')
      let points = document.getElementById('points')
      points.style.background = 'url(' + canvas.toDataURL() + ')'
    },
    paint() {
      this.draw_board()
      this.show_canvas()
    },
    draw_board() {
      // Get canvas and configure
      let item = document.getElementById('canvas')
      let points = document.getElementById('points')
      let num = (40 * this.scale) + 'px'
      points.style.width = num
      points.style.height = num
      let canvas = item.getContext('2d')
      // Create canvas
      item.setAttribute('width', '40px')
      item.setAttribute('height', '40px')
      // Draw
      canvas.beginPath()
      canvas.strokeStyle = 'black'
      canvas.lineWidth = 2
      // Rectangle
      canvas.moveTo(0, 0)
      canvas.lineTo(0, 40)
      canvas.moveTo(0, 0)
      canvas.lineTo(40, 0)
      canvas.moveTo(40, 40)
      canvas.lineTo(40, 0)
      canvas.moveTo(40, 40)
      canvas.lineTo(0, 40)
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
      this.scale = lines[0].trim()
      // Store steps
      for (let each_line of lines.slice(1)) {
        let list = []
        for (let each of each_line.split(' ')) {
          let obj = {
            x: each.split(',')[0],
            y: each.split(',')[1]
          }
          list.push(obj)
        }
        this.steps.push(list)
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
  width: 40px;
  height: 40px;

  line-height: 40px;

  display: inline-block;

  border-radius: 50%;

  background-color: yellow;

  float: left;
}
</style>
