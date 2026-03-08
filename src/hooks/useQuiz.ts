import { ref, computed, onUnmounted, Ref, isRef } from 'vue';
import { useRouter } from 'vue-router';
import type { Quiz } from '@/types';

/**
 * 核心测验逻辑 Hook
 * 负责管理：计时器、进度、得分、状态反馈、步骤切换
 *
 * @param quizzes 测验题目列表
 */
export const useQuiz = (quizzes: Quiz[] | Ref<Quiz[]>) => {
  const quizzesData = computed(() => (isRef(quizzes) ? quizzes.value : quizzes));

  const router = useRouter();

  // --- 响应式状态 ---

  // 当前题目索引 (从 0 开始)
  const step = ref(0);

  // 进度条宽度 (100 -> 0)
  const width = ref(100);

  // 计时器实例 ID
  const timer = ref<ReturnType<typeof setInterval> | null>(null);

  // 每道题的状态记录 ('win' | 'lose' | 'timeout' 等)
  const statuses = ref<string[]>([]);

  // 锁定状态（用于防止用户在反馈期间重复点击）
  const isLocked = ref(false);

  // --- 计算属性 ---

  // 当前题目对象
  const currentQuiz = computed(() => quizzesData.value[step.value]);

  // --- 核心方法 ---

  /**
   * 停止当前计时器
   */
  const stopTimer = () => {
    // 如果 timer 存在，清除 interval 并置为空
    if (!timer.value) return;
    clearInterval(timer.value);
    timer.value = null;
  };

  /**
   * 处理超时逻辑
   * 1. 停止计时器
   * 2. 更新 statuses[step.value] 为 'timeout'
   * 3. 调用 nextStep()
   */
  const onTimeout = () => {
    isLocked.value = true;
    stopTimer();
    statuses.value[step.value] = 'timeout';
    nextStep();
  };

  /**
   * 开始/重置计时器
   * 1. 先调用 stopTimer 清除旧计时器
   * 2. 重置进度条宽度为 100
   * 3. 开启 setInterval，每 100ms 减少宽度 1 (总计 10s)
   * 4. 当宽度归零时，调用 onTimeout
   */
  const startTimer = () => {
    stopTimer();
    width.value = 100;
    timer.value = setInterval(() => {
      width.value--;
      if (!width.value) return onTimeout();
    }, 100);
  };

  /**
   * 计算最终得分
   * 逻辑：根据 statuses 统计正确数量，乘以单题分值 (如 100)
   */
  const calculateScore = () => {
    const rightNum = statuses.value.filter((status) => status === 'win').length;
    return rightNum * 1000;
  };

  /**
   * 切换到下一步或结束测验
   * 1. 延迟 2 秒（让用户看清答案反馈）
   * 2. 解除 isLocked 锁定
   * 3. 如果是最后一题：
   *    - 计算分数
   *    - 存储分数到 localStorage
   *    - 跳转到 /result 页面
   * 4. 如果不是最后一题：
   *    - step 加 1
   *    - 重新开始计时 startTimer()
   */
  const nextStep = () => {
    setTimeout(() => {
      if (step.value >= quizzesData.value.length - 1) {
        localStorage.setItem('score', JSON.stringify(calculateScore()));
        router.push('/result');
      } else {
        isLocked.value = false;
        step.value++;
        startTimer();
      }
    }, 2000);
  };

  /**
   * 校验用户选择的答案
   * @param answerId 用户点击的选项 ID
   *
   * 1. 如果已锁定，直接返回
   * 2. 设置 isLocked 为 true
   * 3. 停止计时器 stopTimer()
   * 4. 比较 answerId 与 currentQuiz.value.currectAnswer
   * 5. 更新 statuses[step.value] 为 'win' 或 'lose'
   * 6. 调用 nextStep()
   */
  const checkAnswer = (answerId: number) => {
    if (isLocked.value) return;
    isLocked.value = true;
    stopTimer();
    statuses.value[step.value] = answerId === currentQuiz.value.currectAnswer ? 'win' : 'lose';
    nextStep();
  };

  // --- 生命周期 ---

  // 组件销毁前确保清除计时器，防止内存泄漏
  onUnmounted(() => {
    stopTimer();
  });

  // --- 暴露给组件 ---
  return {
    // 状态
    step,
    width,
    statuses,
    currentQuiz,
    isLocked,
    // 方法
    checkAnswer,
    startTimer,
  };
};
