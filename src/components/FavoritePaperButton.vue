<template>
  <button
    v-if="id && user.enabled"
    title="Add paper to your favorites"
    v-on:click="toggleFavorite"
  >
    <OutlineHeartIcon v-if="!isFavorite()" class="h-5 w-5 text-purple-500" />
    <HeartIcon v-if="isFavorite()" class="h-5 w-5 text-purple-500" />
  </button>
</template>

<script lang="ts">
import { PaperID } from '@/types/incitefulTypes'
import { defineComponent, PropType } from 'vue'
import { HeartIcon } from '@heroicons/vue/solid'
import { HeartIcon as OutlineHeartIcon } from '@heroicons/vue/outline'
import { useUserStore } from '@/stores/userStore'

export default defineComponent({
  name: 'FavoritePaperButton',
  components: { OutlineHeartIcon, HeartIcon },
  props: {
    id: {} as PropType<PaperID | undefined>
  },
  setup (props) {
    let user = useUserStore()

    let isFavorite = function (): boolean {
      return props.id ? user.isPaperFavorite(props.id) : false
    }

    let toggleFavorite = function () {
      if (props.id) user.toggleFavorite(props.id)
    }

    // if(!user.isSignedIn) {
    //   toggleFavorite = () => {

    //   }
    // }

    return {
      isSubmitted: false,
      isFavorite,
      toggleFavorite,
      user
    }
  }
})
</script>
