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
    path: "/profile",
    name: "Profile",
    redirect: "/profile/profile_info",
    component: () => import("@/views/profile/index.vue"),
    children: [
      {
        path: "/profile/profile_info",
        name: "Profile_info",
        component: () => import("@/views/profile/components/info.vue")
      },
      {
        path: "/profile/profile_juris",
        name: "Profile_juris",
        component: () => import("@/views/profile/components/juris.vue")
      },
      {
        path: "/profile/profile_set",
        name: "Profile_set",
        component: () => import("@/views/profile/components/set.vue")
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
  mode: "history",
  routes
})

export default router
