import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: '/search',
    children: [
      { path: 'search', component: () => import('pages/SearchPage.vue') },
      { path: 'admin', component: () => import('pages/ChatPage.vue') },
    ],
  },
  { path: '/stats', component: () => import('pages/ChartsPage.vue') },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    redirect: '/auth/login',
    children: [
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'register', component: () => import('pages/RegisterPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
