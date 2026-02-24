<template>
  <DefaultLayout>
    <header class="header">
      <span class="header__text">准备好来一场小测验了吗？</span>
      <RouterLink class="header__link" to="/quiz">开始新测验</RouterLink>
    </header>

    <VLeaderboard :leaderboard="leaderboard" class="leaderboard" />
  </DefaultLayout>
</template>

<script>
import DefaultLayout from '@/layouts/DefaultLayout/index.vue';
import VLeaderboard from '@/components/VLeaderboard/index.vue';

import { ref } from 'vue';

export default {
  name: 'HomeView',

  components: {
    VLeaderboard,
    DefaultLayout,
  },

  setup() {
    const leaderboard = ref([]);
    leaderboard.value = localStorage.getItem('leaderboard') ? JSON.parse(localStorage.getItem('leaderboard')) : [];

    return { leaderboard };
  },
};
</script>

<style src="./HomeView.scss" lang="scss" sciped />
