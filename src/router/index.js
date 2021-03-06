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
    path: "/contacts",
    name: "Contacts",
    component: resolve => require(["../views/contacts/index.vue"], resolve)
  },
  {
    path: "/rail",
    name: "Rail",
    component: resolve => require(["../views/rail/index.vue"], resolve)
  },
  {
    path: "/map",
    name: "Map",
    component: resolve => require(["../views/map/index.vue"], resolve)
  },
  {
    path: "/corporation",
    name: "Corporation",
    redirect: "/corporation/corporation_info",
    component: resolve => require(["@/views/corporation/index.vue"], resolve),
    children: [
      {
        path: "/corporation/corporation_info",
        name: "corporation_info",
        component: resolve => require(["@/views/corporation/components/info.vue"], resolve)
      },
      {
        path: "/corporation/corporation_authority",
        name: "corporation_authority",
        component: resolve => require(["@/views/corporation/components/authority.vue"], resolve)
      },
      {
        path: "/corporation/corporation_set",
        name: "corporation_set",
        component: resolve => require(["@/views/corporation/components/set.vue"], resolve)
      },
      {
        path: "/corporation/corporation_config",
        name: "corporation_config",
        component: resolve => require(["@/views/corporation/components/config.vue"], resolve)
      }
    ]
  },
  {
    path: "/manual",
    name: "Manual",
    component: resolve => require(["@/views/documents/manual.vue"], resolve)
  },
  {
    path: "/privacy",
    name: "privacy",
    component: resolve => require(["@/views/documents/privacy.vue"], resolve)
  },
  {
    path: "/updateLog",
    name: "updateLog",
    component: resolve => require(["@/views/documents/updateLog.vue"], resolve)
  },
  {
    path: "/userAgreement",
    name: "userAgreement",
    component: resolve => require(["@/views/documents/userAgreement.vue"], resolve)
  }
]

//避免对当前位置的冗余导航
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  mode: "hash",  // history
  routes
})

export default router
