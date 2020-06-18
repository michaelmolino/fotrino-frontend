import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/Home.vue'),
    children: [
      {
        path: '',
        redirect: 'welcome'
      },
      {
        path: 'welcome',
        component: () => import('pages/Welcome.vue')
      },
      {
        path: 'gallery/:albumId?',
        component: () => import('pages/Gallery.vue')
      },
      {
        path: 'public/:albumUuid',
        component: () => import('pages/Gallery.vue')
      },
      {
        path: 'about',
        component: () => import('pages/About.vue')
      },
      {
        path: 'help',
        component: () => import('pages/Help.vue')
      },
      {
        path: '409',
        component: () => import('pages/errors/409.vue')
      },
      {
        path: '403',
        component: () => import('pages/errors/403.vue')
      },
      {
        path: '*',
        component: () => import('pages/errors/404.vue')
      }
    ]
  }
];

export default routes;
