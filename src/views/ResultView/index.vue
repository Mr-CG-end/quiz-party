<template>
  <VModal :show="isModalOpen" @on-close="closeModal">
    <div class="character">
      <div class="character__avatar-box">
        <img :src="character?.image" :alt="character?.name" class="character__avatar" />
      </div>

      <span class="character__name">{{ character?.name }}</span>

      <p class="character__summary">
        您成功获得了角色 <span class="character__summary-bold">«{{ character?.name }}»</span>！
        {{ character?.summary }}
      </p>
    </div>

    <button class="action" @click="onCharacterSubmited">接受角色</button>
  </VModal>

  <DefaultLayout class="result-view">
    <h1 class="result-view__title">结束了！</h1>
    <span class="result-view__description">恭喜！您在本次测验中获得了 {{ score }} 分！</span>

    <div class="result-view__actions">
      <button class="result-view__show-results" @click="openModal">查看结果</button>
      <RouterLink to="/quiz" class="result-view__retry">重试</RouterLink>
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

<style src="./ResultView.scss" lang="scss" scoped />
