import Vue from 'vue'
import Router from 'vue-router'
import answer from '../components/answer-one/answer'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/answer'
    },
    {
      path: '/answer',
      component: answer,
      name:'answer'
    }
  ]
})
