<template>
  <DefaultLayout>
    <header class="flex p-6 items-center justify-between border-b border-gray-200">
      <span class="font-bold text-black text-base">
        {{ isLogined ? `欢迎回来，${currentUser}` : '准备好来一场小测验了吗？' }}</span
      >
      <button
        class="font-bold text-white text-sm rounded-lg py-4 px-6 bg-primary cursor-pointer"
        @click="handleStartClick"
      >
        开始新测验
      </button>
    </header>

    <VLeaderboard :leaderboard="leaderboard" class="mt-8" />
    <UserModal :show="showLogin" @start="onUserModalStart" />
  </DefaultLayout>
</template>

<script lang="ts" setup>
import DefaultLayout from '@/layouts/DefaultLayout/index.vue';
import VLeaderboard from '@/components/VLeaderboard/index.vue';
import UserModal from '@/components/UserModal/index.vue';

import { ref, onMounted } from 'vue';

import { useUser } from '@/hooks/useUser';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'HomeView',
});

const router = useRouter();
const showLogin = ref(false);

const { isLogined, currentUser } = useUser();
const { leaderboard, fetchLeaderboard } = useLeaderboard();

onMounted(() => {
  fetchLeaderboard();
});

/**
 * 任务 A: 处理“开始测验”点击事件
 * 逻辑：
 * 1. 判断 isLogined.value
 * 2. 如果已登录，直接 router.push('/quiz')
 * 3. 如果没登录，让 showLogin.value 变成 true
 */
const handleStartClick = () => {
  if (isLogined.value) {
    router.push('/quiz');
  } else {
    showLogin.value = true;
  }
};
/**
 * 任务 B: 处理起名弹窗成功的事件 (@start)
 * 逻辑：
 * 1. 关闭弹窗 (showLogin.value = false)
 * 2. 跳转测验页 (router.push('/quiz'))
 */
const onUserModalStart = () => {
  showLogin.value = false;
  router.push('/quiz');
};
</script>
