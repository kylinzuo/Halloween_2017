import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Home from '@/pages/home/Home'
import Demo from '@/pages/demo/Demo'
import Audio from '@/pages/audio/Audio'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    }, {
      path: '/demo',
      name: 'Demo',
      component: Demo
    }, {
      path: '/audio',
      name: 'Audio',
      component: Audio
    }
  ]
})
