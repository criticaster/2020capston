import PageIndex from './pages/Index'
import TestView from './pages/TestView'
import Bookmark from './pages/BookMark'
export default [
  
  
  {
    path: '/',
    component: PageIndex
  },
  {
    path: '/TestView',
    name: 'TestView',
    component : TestView,
    props : true

  },
  {
    path: '/Bookmark',
    name: 'Bookmark',
    component: Bookmark,
    props : true

  }
]
