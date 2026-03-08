<template>
  <section id="leaderboard" class="p-6">
    <h2 class="text-2xl font-bold">排行榜</h2>

    <div v-if="leaderboard.length" class="mt-12 grid gap-6 grid-cols-[repeat(auto-fill,minmax(16rem,1fr))]">
      <template v-for="(leader, index) in leaderboard" :key="index">
        <div class="flex flex-col items-center bg-white border-2 border-primary rounded-2xl py-8 px-16">
          <div class="overflow-hidden w-32 h-32 rounded-full border-3 border-primary">
            <img :src="leader.image" :alt="leader.name" class="w-full h-full object-cover" />
          </div>

          <span class="text-xl mt-4">{{ leader.name }}</span>
          <span class="text-xl font-bold mt-4">{{ leader.score }} 分</span>
        </div>
      </template>
    </div>

    <div v-else class="mt-4">
      <span>暂无评分记录...</span>
    </div>
  </section>
</template>

<script lang="ts">
import type { LeaderboardItem } from '@/types';

export default {
  name: 'VLeaderboard',

  props: {
    leaderboard: {
      type: Array as () => LeaderboardItem[],
      required: true,
    },
  },

  setup() {},
};
</script>
