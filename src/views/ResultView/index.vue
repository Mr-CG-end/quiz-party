<template>
  <VModal :show="isModalOpen" @on-close="closeModal">
    <div class="flex flex-col items-center">
      <div class="relative overflow-hidden w-32 h-32 rounded-full border-3 border-primary">
        <img :src="character?.image" :alt="character?.name" class="absolute top-0 left-0 w-full h-full object-cover" />
      </div>

      <span class="font-bold text-black text-2xl mt-8">{{ character?.name }}</span>

      <p class="text-center text-gray mt-6">
        您成功获得了角色 <span class="font-bold text-black">«{{ character?.name }}»</span>！
        {{ character?.summary }}
      </p>
    </div>

    <button
      class="w-full border-none outline-none cursor-pointer font-bold text-white text-sm mt-12 rounded-lg py-4 px-6 bg-primary border border-primary transition-opacity hover:opacity-90"
      @click="onCharacterSubmited"
    >
      接受角色
    </button>
  </VModal>

  <DefaultLayout class="flex flex-col min-h-screen items-center justify-center">
    <h1 class="font-bold text-black text-[28px]">结束了！</h1>
    <span class="text-gray mt-4">恭喜！您在本次测验中获得了 {{ score }} 分！</span>

    <div class="mt-14">
      <button
        class="border border-primary outline-none cursor-pointer font-bold text-white text-sm rounded-lg py-4 px-6 bg-primary transition-opacity hover:opacity-90"
        @click="openModal"
      >
        查看结果
      </button>
      <RouterLink
        to="/quiz"
        class="font-bold text-sm text-primary ml-4 rounded-lg py-4 px-6 border border-primary transition-colors hover:bg-primary/10"
        >重试</RouterLink
      >
    </div>
  </DefaultLayout>
</template>

<script lang="ts" setup>
import VModal from '@/components/VModal/index.vue';
import DefaultLayout from '@/layouts/DefaultLayout/index.vue';

// Mock Api 换成 apifox
import { getCharacters } from '@/api/quiz';

import { ref, computed, onBeforeMount, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { Character } from '@/types';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useUser } from '@/hooks/useUser';

defineOptions({
  name: 'ResultView',
});

const { currentUser } = useUser();
const { addEntry } = useLeaderboard();
const score = ref(0);
const isModalOpen = ref(false);
const charactersList = ref<Character[]>([]);

const router = useRouter();

const character = computed(() => {
  return charactersList.value.find((c) => score.value >= c.minimumScore);
});

onBeforeMount(() => {
  if (localStorage.getItem('score')) {
    score.value = JSON.parse(localStorage.getItem('score') || '0');
  }
});

onMounted(async () => {
  try {
    const data = await getCharacters();
    charactersList.value = data;
  } catch (error) {
    console.error('获取角色失败:', error);
  }
});

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const onCharacterSubmited = () => {
  if (!character.value) return;
  addEntry({
    image: character.value.image,
    name: currentUser.value || '未知玩家',
    score: score.value,
  });
  localStorage.removeItem('score');
  isModalOpen.value = false;
  router.push('/');
};
</script>

<style scoped>
:deep(.modal) {
  max-width: 24rem;
}
</style>
