import { createRouter, createWebHistory } from "vue-router";
import LoginView from '../views/LoginView.vue';
import RegistroView from '../views/RegistroView.vue'
import MapaView from '../views/MapaView.vue'
import ForumView from '../views/ForumView.vue'

const routes = [
  { path: '/', name: 'login', component: LoginView },
  { path: '/registro', name: 'registro', component: RegistroView }, // ADICIONE ESTA LINHA
  { path: '/mapa', name: 'mapa', component: () => import('../views/MapaView.vue') }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/registro',
      name: 'registro',
      component: RegistroView
    },
     {
      path: '/mapa',
      name: 'mapa',
      component: MapaView
    },
    {
      path: '/desabafos',
      name: 'forum',
      component: ForumView
    }
  ]
})

export default router