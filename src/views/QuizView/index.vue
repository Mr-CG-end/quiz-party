<template>
  <Transition name="fade">
    <div
      v-if="statuses[step]"
      :class="[
        'fixed top-0 right-0 z-10 w-full h-full flex items-center justify-center text-center backdrop-blur-sm status',
        `status--${statuses[step]}`,
      ]"
    >
      <span class="status__text text-5xl md:text-[80px] font-black animate-show">{{ statusText }}</span>
    </div>
  </Transition>

  <DefaultLayout class="flex flex-col min-h-screen">
    <div v-if="isLoading" class="flex flex-col items-center justify-center h-[300px] text-white">
      <div class="w-10 h-10 border-4 border-white/10 border-t-primary rounded-full animate-spin mb-4"></div>
      <span>加载中...</span>
    </div>

    <div v-else>
      <div class="fixed top-0 right-0 h-1 bg-primary" :style="`width: ${width}%`"></div>

      <h1 class="font-bold text-black text-xl md:text-[28px] 2xl:text-[44px]">{{ currentQuiz?.title }}</h1>

      <div
        class="flex flex-wrap justify-center mt-10 md:mt-20 2xl:mt-32 quizzes"
        :style="isLocked ? 'pointer-events: none;' : ''"
      >
        <template v-for="answer in shuffledAnswers" :key="answer.id">
          <div
            class="relative flex items-center w-full md:basis-[491px] 2xl:basis-[600px] h-[136px] p-6 2xl:py-10 2xl:px-6 mb-10 md:mb-0 bg-white border-2 border-primary/10 rounded cursor-pointer transition-all duration-300 hover:border-primary/30 quiz"
            @click="checkAnswer(answer.id)"
          >
            <span class="text-black text-xl">{{ answer.title }}</span>
          </div>
        </template>
      </div>

      <div class="flex justify-center mt-12 md:mt-auto quiz-counters">
        <template v-for="counter in quizzesList.length" :key="counter">
          <span :class="counterClasses(counter - 1)" />
        </template>
      </div>
    </div>
  </DefaultLayout>
</template>

<script lang="ts" setup>
import DefaultLayout from '@/layouts/DefaultLayout/index.vue';

// Mock Api
import { getQuizzes } from '@/api/quiz';

// utils
import { shuffleArray } from '@/utils/index';

import { ref, computed, onMounted } from 'vue';
import type { Quiz } from '@/types';
import { useQuiz } from '@/hooks/useQuiz';

defineOptions({
  name: 'QuizView',
});

const quizzesList = ref<Quiz[]>([]);
const isLoading = ref(true);

// hooks
const { step, width, statuses, currentQuiz, isLocked, checkAnswer, startTimer } = useQuiz(quizzesList);

const statusText = computed(() => {
  if (!currentQuiz.value) return '';
  if (statuses.value[step.value] === 'timeout') {
    return '时间到了！';
  }

  return statuses.value[step.value] === 'win' ? currentQuiz.value.response.win : currentQuiz.value.response.lose;
});

const counterClasses = (counter: number) => {
  const base = 'h-6 border-2 border-primary transition-all duration-300';

  if (statuses.value[counter]) {
    switch (statuses.value[counter]) {
      case 'win':
        return `${base} w-6 rounded-xl bg-green`;
      case 'lose':
        return `${base} w-6 rounded-xl bg-red`;
      case 'timeout':
        return `${base} w-6 rounded-xl bg-gray-200`;
    }
  }

  const isCurrent = counter === step.value;
  return `${base} ${isCurrent ? 'w-12 rounded-full bg-primary/10' : 'w-6 rounded-xl'}`;
};

// 选项乱序逻辑
const shuffledAnswers = computed(() => {
  return currentQuiz.value ? shuffleArray([...currentQuiz.value.items]) : [];
});

onMounted(async () => {
  // 页面加载时，清空 localStorage 中的 score
  localStorage.removeItem('score');
  try {
    const data = await getQuizzes();
    quizzesList.value = shuffleArray(data);
    isLoading.value = false;
    startTimer();
  } catch (error) {
    console.error('获取测验失败:', error);
  }
});
</script>

<style scoped>
.quiz {
  counter-increment: quiz;
}

@media (min-width: 768px) {
  .quiz:nth-child(even) {
    margin-top: 2.5rem;
    margin-left: 3rem;
  }
}

.quiz::before {
  content: counter(quiz);
  display: flex;
  position: absolute;
  top: -1.5rem;
  left: -1.5rem;
  width: 3rem;
  height: 3rem;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 700;
  font-size: 1.75rem;
  color: var(--black);
  background-color: var(--white);
  border: 3px solid var(--primary);
}

.quiz-counters span:not(:first-child) {
  margin-left: 1rem;
}

.status--win {
  color: var(--green);
  background: rgba(79, 119, 45, 0.2);
}

.status--lose {
  color: var(--red);
  background: rgba(229, 56, 59, 0.2);
}

.status--timeout {
  color: var(--gray-400); /* Wait this might be missing in root variables from tailwind... assuming generic grey */
  background: rgba(211, 211, 211, 0.2);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
}

.fade-leave-to {
  opacity: 0;
}

.fade-leave-to .status__text {
  animation: leave 0.5s forwards;
}

@keyframes show {
  from {
    opacity: 0;
    margin-top: -10rem;
  }
  to {
    opacity: 1;
    margin-top: 0;
  }
}

@keyframes leave {
  from {
    opacity: 1;
    margin-top: 0;
  }
  to {
    opacity: 0;
    margin-top: -10rem;
  }
}
</style>
