import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'Home',
    path: '/',
    component: () => import('@/views/Home.vue'),
  },
  {
    name: 'Files',
    path: '/files/:path?',
    component: () => import('@/views/Dir.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      document.body.style.minHeight = savedPosition.top + window.innerHeight + 'px';
      return savedPosition;
    } else {
      document.body.style.removeProperty('min-height');
      return { top: 0 };
    }
  },
});

export default router;
