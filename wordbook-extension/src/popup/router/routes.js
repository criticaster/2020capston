import PageIndex from './pages/Index'
import TestView from './pages/TestView'

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

  }
]
