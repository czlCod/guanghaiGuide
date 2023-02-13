/**
 * 酒店相关的路由
 */
import Layout from '../components/Layout.vue'
import Hotel from '../views/Hotel/Hotel.vue'
import HotelComment from '../views/Hotel/HotelComment.vue'

let HotelRouter = {
  path: '/hotel',
  name: 'Hotel',
  component: Layout,
  meta: {
    title: '教室管理'
  },
  children: [
    {
      path: 'index',
      // 路由名 /hotel/index ===> HotelIndex
      name: 'HotelIndex',
      component: Hotel,
      meta: {
        title: '教室信息管理'
      }
    },
    {
      path: 'comment',
      name: 'HotelComment',
      component: HotelComment,
      meta: {
        title: '教室评论管理'
      }
    }
  ]
}

export default HotelRouter
