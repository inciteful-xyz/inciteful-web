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
import { PaperID } from '@/types/inciteful'
import { defineComponent, PropType } from 'vue'
import { HeartIcon } from '@heroicons/vue/solid'
import { HeartIcon as OutlineHeartIcon } from '@heroicons/vue/outline'
import { useDBStore } from '@/stores/db'
import { useUserStore } from '@/stores/user'

export default defineComponent({
  name: 'FavoritePaperButton',
  components: { OutlineHeartIcon, HeartIcon },
  props: {
    id: {} as PropType<PaperID | undefined>
  },
  setup (props) {
    let user = useUserStore()
    let db = useDBStore()

    let isFavorite = function (): boolean {
      return props.id ? db.isPaperFavorite(props.id) : false
    }

    let toggleFavorite = function () {
      if (props.id) db.toggleFavorite(props.id)
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
