<template>
  <div class="container">
    <canvas class="canvas" id="canvas"></canvas>
    <div class="points" id="points">
      <div class="row" v-for="(item, index) in grouped_points" :key="index">
        <div class="point" :id="x.id" v-for="(x, i) in item" :key="i">
          {{ x.id }}:{{ x.val }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      points: [
        {id: 1, val: 'Hello'},
        {id: 2, val: 'World'},
        {id: 3, val: '!'},
        {id: 4, val: 'Hello'},
        {id: 5, val: 'World'},
        {id: 6, val: '!'}
      ],
      paths: [
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 6]
      ]
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
    }
  },
  mounted() {
    this.paint()
  },
  methods: {
    paint() {
      // Fetch canvas
      let item = document.getElementById('canvas')
      // Create canvas
      item.setAttribute('width', this.get_hw('points').w)
      item.setAttribute('height', this.get_hw('points').h)
      // Link points
      for (let each of this.paths) {
        this.link(each[0], each[1])
      }
      let canvas = document.getElementById('canvas')
      let points = document.getElementById('points')
      points.style.background = 'url(' + canvas.toDataURL() + ')'
    },
    link(a, b) {
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
      canvas.strokeStyle = 'black'
      canvas.lineWidth = 1
      // Draw
      canvas.moveTo(this.get_xy(a).x - x_off + a_x_mid, this.get_xy(a).y - y_off + a_y_mid)
      canvas.lineTo(this.get_xy(b).x - x_off + b_x_mid, this.get_xy(b).y - y_off + b_y_mid)
      canvas.stroke()
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
.row {
  width: 100%;
}

.canvas {
  display: none;
}

.point {
  margin: 50px;

  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 15px;
  padding-right: 15px;

  display: inline-block;


  background-color: yellow;
}
</style>
