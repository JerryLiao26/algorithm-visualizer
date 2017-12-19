<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.container {
  width: 80%;
  min-width: 320px;
  max-width: 800px;

  margin-left: auto;
  margin-right: auto;

  padding-bottom: 75px;

  overflow: hidden;
}

.row {
  width: 100%;
}

.md-button {
  height: 40px;

  font-size: 1.2em;

  padding-left: 15px;
  padding-right: 15px;

  margin-top: 15px;
  margin-bottom: 15px;

  box-sizing: border-box;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12);
  background-color: #3f51b5;

  color: white;

  border-style: none;

  cursor: pointer;
}

.md-select {
  width: 71%;
  height: 30px;

  display: block;

  font-size: 1.1em;

  margin-top: 25px;
  margin-bottom: 25px;
  margin-left: auto;
  margin-right: auto;

  padding-left: 5px;
  padding-right: 5px;

  border-top-style: none;
  border-left-style: none;
  border-right-style: none;
  border-bottom-style: solid;
  border-bottom-width: 1.5px;
  border-bottom-color: rgba(0,0,0,.12);

  background-color: transparent;

  outline: none;

  transition: border-bottom-color 0.5s;
}

.md-select:focus {
  border-bottom-color: #3f51b5;
}

.md-select > option {
  background-color: transparent;
  cursor: pointer;
}

.md-input {
  width: 70%;

  display: block;

  font-size: 1.1em;

  margin-top: 25px;
  margin-bottom: 25px;
  margin-left: auto;
  margin-right: auto;

  padding-left: 5px;
  padding-right: 5px;

  border-top-style: none;
  border-left-style: none;
  border-right-style: none;
  border-bottom-style: solid;
  border-bottom-width: 1.5px;
  border-bottom-color: rgba(0,0,0,.12);

  outline: none;

  transition: border-bottom-color 0.5s;
}

.md-input:focus {
  border-bottom-color: #3f51b5;
}

</style>
