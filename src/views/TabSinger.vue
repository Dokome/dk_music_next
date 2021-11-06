<template>
  <div class="singer" v-loading="!singerList.length">
    <index-list :data="singerList" @select="selectSinger"></index-list>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger"></component>
      </transition>
    </router-view>
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer'
import IndexList from '@/components/base/index-list/index-list.vue'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'
export default {
  components: {
    IndexList
  },
  data() {
    return {
      singerList: [],
      selectedSinger: null
    }
  },
  async created() {
    const result = await getSingerList()
    this.singerList = result.singers
  },
  methods: {
    selectSinger(singer) {
      this.selectedSinger = singer
      this.cacheSinger(singer)
      this.$router.push({
        path: `/singer/${singer.mid}`
      })
    },
    cacheSinger(singer) {
      storage.session.set(SINGER_KEY, singer)
    }
  }
}
</script>

<style scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
