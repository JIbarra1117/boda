import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminLoginView from '../views/AdminLoginView.vue'
import AdminView from '../views/AdminView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/admin-login', component: AdminLoginView },
    {
      path: '/admin',
      component: AdminView,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth) {
    const isAuth = localStorage.getItem('admin_auth') === 'true'
    if (!isAuth) return next('/admin-login')
  }
  next()
})

export default router
