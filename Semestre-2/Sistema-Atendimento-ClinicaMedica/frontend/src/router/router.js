import { createRouter, createWebHistory } from 'vue-router'

// Pages
import Login from '../pages/Login.vue'
import Registro from '../pages/Registro.vue'
import Dashboard from '../pages/Dashboard.vue'
import Agendamentos from '../pages/Agendamentos.vue'
import Admin from '../pages/Admin.vue'
import NovoAgendamento from '../pages/NovoAgendamento.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', component: Login },
  { path: '/registro', component: Registro },
  { path: '/dashboard', component: Dashboard, meta: { requerAutenticacao: true } },
  { path: '/agendamentos', component: Agendamentos, meta: { requerAutenticacao: true } },
  { path: '/novo-agendamento', component: NovoAgendamento, meta: { requerAutenticacao: true } },
  { path: '/admin', component: Admin, meta: { requerAutenticacao: true, requerAdmin: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const tipo = localStorage.getItem('usuarioTipo')

  if (to.meta.requerAutenticacao && !token) {
    next('/login')
  } else if (to.meta.requerAdmin && tipo !== 'admin' && tipo !== 'secretario') {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
