<template>
  <Transition name="fade">
    <div v-if="statuses[step]" :class="`status status--${statuses[step]}`">
      <span class="status__text">{{ statusText }}</span>
    </div>
  </Transition>

  <DefaultLayout class="quiz-view">
    <div v-if="isLoading" class="quiz-view__loading">
      <div class="loading-spinner"></div>
      <span>加载中...</span>
    </div>

    <div v-else>
      <div class="timeout" :style="`width: ${width}%`"></div>

      <h1 class="quiz-view__title">{{ currentQuiz?.title }}</h1>

      <div class="quizzes quiz-view__quizzes" :style="isLocked ? 'pointer-events: none;' : ''">
        <template v-for="answer in shuffledAnswers" :key="answer.id">
          <div class="quiz" @click="checkAnswer(answer.id)">
            <span class="quiz__title">{{ answer.title }}</span>
          </div>
        </template>
      </div>

      <div class="quiz-counters">
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
  if (statuses.value[counter]) {
    return `quiz-counters__couter quiz-counters__couter--${statuses.value[counter]}`;
  }

  return `quiz-counters__couter quiz-counters__couter--${counter === step.value ? 'current' : 'normal'}`;
};

// 选项乱序逻辑
const shuffledAnswers = computed(() => {
  return currentQuiz.value ? shuffleArray([...currentQuiz.value.items]) : [];
});
// 为什么浅拷贝，防止源数据混乱

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

<style src="./QuizView.scss" lang="scss" scoped />
