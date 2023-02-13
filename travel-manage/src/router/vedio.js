/**
 * 视频相关的路由
 */
 import Layout from '../components/Layout.vue'
 import vedioPage from '../views/VedioPage/vedioPage.vue'
 
 let VedioRouter = {
   path: '/vedio',
   name: 'vedio',
   component: Layout,
   meta: {
     title: '视频展示'
   },
   children: [
    {
      path: 'index',
      name: 'vedioIndex',
      component: vedioPage,
      meta: {
        title: '宣传视频'
      }
    },
  ]
 }
 
 export default VedioRouter
 