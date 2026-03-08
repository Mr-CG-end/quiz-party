import { ref } from 'vue';
import { getLeaderboard } from '@/api/quiz';
import type { LeaderboardItem } from '@/types';

/**
 * 排行榜状态管理 Hook
 * 逻辑：
 * 1. 提供全局单例的 leaderboard 状态（跨页面共享数据）
 * 2. 封装 API 获取 + 本地存储兜底逻辑
 * 3. 封装新增记录 + 排序 + 本地同步逻辑
 */

// --- 全局状态 ---
// 在函数外部定义，确保 HomeView 和 ResultView 引用的是同一个响应式数组
const leaderboard = ref<LeaderboardItem[]>([]);

export const useLeaderboard = () => {
  // --- 核心方法 ---

  /**
   * 获取排行榜数据（合并策略）
   *
   * 逻辑：
   * 1. 声明基础数据：先从 localStorage 获取本地记录 localData
   * 2. 获取新数据：try 调用 getLeaderboard() 获取 apiData
   * 3. 【核心】数据合并：将 localData 和 apiData 合并到一个数组中 [...localData, ...apiData]
   * 4. 【核心】去重处理：过滤掉 重复(name 和 score 相同) 的记录
   * 5. 排序与更新：对去重后的数组进行 从高到低排序，并取前 10 名
   * 6. 同步展示：更新 leaderboard.value
   * 7. 备份数据：将最终合并结果存回 localStorage
   */
  const fetchLeaderboard = async () => {
    // 1. 获取本地
    const data = localStorage.getItem('leaderboard');
    const localData: LeaderboardItem[] = data ? JSON.parse(data) : [];

    // 2. 尝试获取 API
    try {
      const apiData = await getLeaderboard();
      // 3. 合并与去重 (去掉大括号实现隐式返回)
      const mergedList = [...apiData, ...localData];
      const uniqueList = mergedList.filter(
        (item, index, self) => index === self.findIndex((t) => t.name === item.name && t.score === item.score),
      );

      // 4. 排序与裁剪
      const sortedList = uniqueList.sort((a, b) => b.score - a.score).slice(0, 10);

      // 5. 更新状态与本地同步
      leaderboard.value = sortedList;
      localStorage.setItem('leaderboard', JSON.stringify(leaderboard.value));
    } catch (error) {
      console.error('获取排行榜失败，使用本地缓存', error);
      // 失败则降级使用本地，并确保排序和数量符合要求
      leaderboard.value = localData.sort((a, b) => b.score - a.score).slice(0, 10);
    }
  };

  /**
   * 添加新的得分记录
   * @param entry 包含 name, score, image 的记录对象
   *
   * 1. 将新记录推入 leaderboard.value
   * 2. 对 leaderboard.value 进行从高到低排序 (sort)
   * 3. (可选) 只保留前 10 名 (slice)
   * 4. 将最新结果转为 JSON 字符串存入 localStorage('leaderboard')
   */
  const addEntry = (entry: LeaderboardItem) => {
    leaderboard.value.push(entry);
    leaderboard.value = leaderboard.value.sort((a, b) => b.score - a.score).slice(0, 10);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard.value));
  };

  return {
    // 暴露状态和方法
    leaderboard,
    fetchLeaderboard,
    addEntry,
  };
};
