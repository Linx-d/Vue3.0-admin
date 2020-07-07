import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: "/map"
  },
  {
    path: "/index",
    name: "Index",
    component: () => import("../views/index/index.vue")
  },
  {
    path: "/contacts",
    name: "Contacts",
    component: () => import("../views/contacts/index.vue")
  },
  {
    path: "/rail",
    name: "Rail",
    component: () => import("../views/rail/index.vue")
  },
  {
    path: "/map",
    name: "Map",
    component: () => import("../views/map/index.vue")
  },
  {
    path: "/corporation",
    name: "Corporation",
    redirect: "/corporation/corporation_info",
    component: () => import("@/views/corporation/index.vue"),
    children: [
      {
        path: "/corporation/corporation_info",
        name: "corporation_info",
        component: () => import("@/views/corporation/components/info.vue")
      },
      {
        path: "/corporation/corporation_authority",
        name: "corporation_authority",
        component: () => import("@/views/corporation/components/authority.vue")
      },
      {
        path: "/corporation/corporation_set",
        name: "corporation_set",
        component: () => import("@/views/corporation/components/set.vue")
      }
    ]
  }
]

//避免对当前位置的冗余导航
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  mode: "history",  // history
  routes
})

export default router
