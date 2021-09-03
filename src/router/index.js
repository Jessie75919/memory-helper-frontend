import Vue from 'vue';
import VueRouter from 'vue-router';
import ReviewPage from '@/views/Review';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: ReviewPage
  },
  {
    path: '/create',
    name: 'Create',
    component: () => import(/* webpackChunkName: "create" */ '../views/Create')
  },
  {
    path: '/review',
    name: 'Review',
    props: true,
    component: () => import(/* webpackChunkName: "review"*/ '../views/Review')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
