import { createRouter, createWebHashHistory } from 'vue-router'
const TabSearch = () =>
  import(/* webpackChunkName: "TabSearch" */ '@/views/TabSearch.vue')
const TabRecommend = () =>
  import(/* webpackChunkName: "TabRecommend" */ '@/views/TabRecommend.vue')
const TabTopList = () =>
  import(/* webpackChunkName: "TabTopList" */ '@/views/TabTopList.vue')
const TabSinger = () =>
  import(/* webpackChunkName: "TabSinger" */ '@/views/TabSinger.vue')
const DetailSinger = () =>
  import(/* webpackChunkName: "DetailSinger" */ '@/views/DetailSinger.vue')
const DetailTop = () =>
  import(/* webpackChunkName: "DetailTop" */ '@/views/DetailTop.vue')
const Album = () => import(/* webpackChunkName: "Album" */ '@/views/album.vue')
const UserCenter = () =>
  import(/* webpackChunkName: "UserCenter" */ '@/views/UserCenter.vue')

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/user',
    components: {
      user: UserCenter
    }
  },
  {
    path: '/recommend',
    component: TabRecommend,
    children: [
      {
        path: ':id',
        component: Album
      }
    ]
  },
  {
    path: '/search',
    component: TabSearch
  },
  {
    path: '/top-list',
    component: TabTopList,
    children: [
      {
        path: ':id',
        component: DetailTop
      }
    ]
  },
  {
    path: '/singer',
    component: TabSinger,
    children: [
      {
        path: ':id',
        component: DetailSinger
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
