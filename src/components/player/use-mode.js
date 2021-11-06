import { PLAY_MODE } from '@/assets/js/constant'
import { useStore } from 'vuex'
import { computed } from 'vue'

export default function useMode() {
  const store = useStore()
  const playMode = computed(() => store.state.playMode)

  const modeIcon = computed(() => {
    const playModeValue = playMode.value
    return playModeValue === PLAY_MODE.sequence
      ? 'icon-sequence'
      : playModeValue === PLAY_MODE.random
      ? 'icon-random'
      : 'icon-loop'
  })

  const modeText = computed(() => {
    const playModeValue = playMode.value
    return playModeValue === PLAY_MODE.sequence
      ? '顺序播放'
      : playModeValue === PLAY_MODE.random
      ? '随机播放'
      : '循环播放'
  })

  function changeMode() {
    const mode = (playMode.value + 1) % 3
    store.dispatch('changeMode', mode)
  }

  return {
    modeIcon,
    changeMode,
    modeText
  }
}
