import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.VUE_APP_BASE_URL),
  routes: [
    {
      path: '/', // Redirect for URLs without a language prefix
      redirect: '/en', // Redirect to the default language
    },
    {
      path: '/:lang/',
      name: 'login',
      meta: { requiresAuth: false },
      component: () => import('../views/auth/LoginView.vue')
    },
    {
      path: '/:lang/signup',
      name: 'signup',
      meta: { requiresAuth: false },
      component: () => import('../views/auth/SignupView.vue')
    },
    {
      path: '/:lang/signup',
      name: 'checkEmail',
      meta: { requiresAuth: false },
      component: () => import('../views/auth/CheckEmail.vue')
    },
    {
      path: '/:lang/reset-password',
      name: 'resetPassword',
      meta: { requiresAuth: false },
      component: () => import('../views/auth/ResetPassword.vue')
    },
    {
      path: '/:lang/new-password/:email',
      name: 'newPassword',
      props: true,
      meta: { requiresAuth: false },
      component: () => import('../views/auth/NewPassword.vue')
    },

    {
      path: '/:lang/dashboard',
      name: 'dashboard',
      meta: { requiresAuth: true },
      component: () => import('../views/dashboard/Dashboard.vue')
    },
    {
      path: '/:lang/device-config/:id',
      name: 'deviceConfig',
      props: true,
      meta: { requiresAuth: true },
      component: () => import('../views/configuration/DevicesConfiguration.vue')
    },,
    {
      path: '/:lang/device-setting/:id',
      name: 'deviceSetting',
      props: true,
      meta: { requiresAuth: true },
      component: () => import('../views/setting/DeviceSetting.vue')
    },
    {
      path: '/:lang/devices',
      name: 'devicesManagement',
      meta: { requiresAuth: true },
      component: () => import('../views/devices/DevicesManagement.vue')
    },
    {
      path: '/:lang/reset-password-succes',
      name: 'resetPasswordSuccess',
      meta: { requiresAuth: false },
      component: () => import('../views/auth/ResetPasswordSuccess.vue')
    },
    {
      path: '/:lang/report/:id',
      name: 'report',
      props: true,
      meta: { requiresAuth: true },
      component: () => import('../views/report/Report.vue')
    }
  ]
})


router.beforeEach(async (to, from, next) => {
  document.title = 'AID Farm'
  if (to.meta.requiresAuth && !localStorage.getItem('auth.accessToken')) {
    next({ name: 'login' })
  } else if (to.meta.requiresAuth && localStorage.getItem('auth.accessToken') || to.meta.freeAccess) {
    next()
  } else if (!to.meta.requiresAuth && localStorage.getItem('auth.accessToken')) {
    next({ name: 'devicesManagement' })
  } else next()
})

export default router
