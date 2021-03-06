import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Start from '@/components/Start'
import Sort from '@/components/Sort'
import MaxFlow from '@/components/MaxFlow'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/start',
      name: 'Start',
      component: Start
    },
    {
      path: '/sort',
      name: 'Sort',
      component: Sort
    },
    {
      path: '/max_flow',
      name: 'MaxFlow',
      component: MaxFlow
    }
  ]
})
