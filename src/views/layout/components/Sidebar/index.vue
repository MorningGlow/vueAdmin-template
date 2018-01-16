<template>
  <scroll-bar>
    <el-menu mode="vertical" unique-opened :default-active="$route.path" :collapse="isCollapse" background-color="#304156" text-color="#fff" active-text-color="#409EFF">
      <sidebar-item :routes="routes"></sidebar-item>
      <!--<div>{{routes}}}</div>-->
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'
import store from '../../../../store'
export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      console.log('navbar routes:' + store.getters.routers)
      store.getters.routers.forEach(router => {
        console.log(router.name)
      })
      return store.getters.routers
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
