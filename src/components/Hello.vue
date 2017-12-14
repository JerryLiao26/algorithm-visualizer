<template>
  <div class="container">
    <h1>Hello!</h1>
    <button class="md-button" @click="start()">
      开始
    </button>
  </div>
</template>

<script>
import router from '@/router'
export default {
  name: 'HelloWorld',
  data () {
    return {

    }
  },
  methods: {
    start() {
      router.push({name: 'Start'})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
