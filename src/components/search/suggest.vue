<template>
  <div ref="rootRef" class="suggest" v-loading:[loadingText]="loading">
    <ul class="suggest-list">
      <li class="suggest-item" v-if="singer" @click="selectSinger(singer)">
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li
        class="suggest-item"
        v-for="song in songs"
        :key="song.id"
        @click="selectSong(song)"
      >
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">{{ song.singer }}-{{ song.name }}</p>
        </div>
      </li>
      <div class="suggest-item" v-loading:[loadingText]="pullUpLoading"></div>
    </ul>
  </div>
</template>

<script>
import { computed, nextTick, ref, watch } from 'vue'
import { search } from '@/service/search'
import { processSongs } from '@/service/songs'
import usePullUpLoad from './use-pull-up-load'

export default {
  props: {
    query: String,
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  emits: ['select-song'],
  setup(props, { emit }) {
    const singer = ref(null)
    const songs = ref([])
    const hasMore = ref(true)
    const page = ref(1)
    const loadingText = ref('')
    const manuaLoading = ref(false)
    const loading = ref(true)

    const pullUpLoading = computed(() => {
      return isPullUpLoad && hasMore.value
    })

    const preventPullUpLoad = computed(() => {
      return manuaLoading.value || loading.value
    })
    const { isPullUpLoad, rootRef, scroll } = usePullUpLoad(
      searchMore,
      preventPullUpLoad
    )

    watch(
      () => props.query,
      async (newQuery) => {
        if (!newQuery) {
          return
        }
        await serachFirst()
      }
    )

    async function serachFirst() {
      if (!props.query) {
        return
      }
      page.value = 1
      songs.value = []
      singer.value = null
      hasMore.value = true

      const result = await search(props.query, page.value, props.showSinger)
      songs.value = await processSongs(result.songs)

      loading.value = false

      singer.value = result.singer
      hasMore.value = result.hasMore
      await nextTick()
      await makeItScrollable()
    }

    async function searchMore() {
      if (!hasMore.value || !props.query) {
        return
      }

      page.value++
      const result = await search(props.query, page.value, props.showSinger)
      songs.value = songs.value.concat(await processSongs(result.songs))
      hasMore.value = result.hasMore
      await nextTick()
      await makeItScrollable()
    }

    async function makeItScrollable() {
      if (scroll.value.maxScrollY >= -1) {
        manuaLoading.value = true
        await searchMore()
        manuaLoading.value = false
      }
    }

    function selectSong(song) {
      emit('select-song', song)
    }

    function selectSinger(singer) {
      emit('select-singer', singer)
    }

    return {
      songs,
      singer,
      loadingText,
      loading,
      selectSong,
      selectSinger,
      // use-pull-up-load
      rootRef,
      isPullUpLoad,
      pullUpLoading
    }
  }
}
</script>

<style lang="scss" scoped>
.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .icon {
        flex: 0 0 30px;
        width: 30px;
        [class^='icon-'] {
          font-size: 14px;
          color: $color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include no-wrap();
        }
      }
    }
  }
}
</style>
