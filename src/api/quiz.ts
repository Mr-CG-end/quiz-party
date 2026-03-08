import request from './request';
import type { Quiz, Character, LeaderboardItem } from '@/types';

/**
 * 获取所有测验问题
 */
export const getQuizzes = (): Promise<Quiz[]> => {
  return request.get('/api/quizzes');
};

/**
 * 获取角色等级
 */
export const getCharacters = (): Promise<Character[]> => {
  return request.get('/api/characters');
};

/**
 * 获取排行榜
 */
export const getLeaderboard = (): Promise<LeaderboardItem[]> => {
  return request.get('/api/leaderboard');
};
