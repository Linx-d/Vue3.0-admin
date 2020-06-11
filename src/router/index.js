import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: "/index"
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
    component: () => import("../views/profile/index.vue"),
    children: [
      {
        path: "/profile/profile_info",
        name: "Profile_info",
        component: () => import("../views/profile/components/info.vue")
      },
      {
        path: "/profile/profile_juris",
        name: "Profile_juris",
        component: () => import("../views/profile/components/juris.vue")
      },
      {
        path: "/profile/profile_set",
        name: "Profile_set",
        component: () => import("../views/profile/components/set.vue")
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
