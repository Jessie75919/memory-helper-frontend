import Vue from 'vue';
import VueRouter from 'vue-router';
import ReviewPage from '@/views/Review';
import store from '@/store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: ReviewPage,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login'),
  },
  {
    path: '/create',
    name: 'Create',
    component: () => import(/* webpackChunkName: "create" */ '../views/Create'),
  },
  {
    path: '/review',
    name: 'Review',
    component: () => import(/* webpackChunkName: "review"*/ '../views/Review'),
  },
  {
    path: '/study/:mode?',
    name: 'Study',
    props: true,
    component: () => import(/* webpackChunkName: "study"*/ '../views/Study'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !store.getters.isAuthenticated) {
    window.location.href = '/login';
  } else {
    next();
  }
});

export default router;
