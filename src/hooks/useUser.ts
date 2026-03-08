// 用户身份、持久化、登录状态管理
import { computed, ref } from 'vue';

// 获取本地存储的用户quiz_user  currentUser
const currentUser = ref(localStorage.getItem('quiz_user') || '');
// 对用户进行操作（总 可以看成轻量级store  useUser
export const useUser = () => {
  // 判断用户是否登录  isLogined为布尔值，用计算属性去存储
  const isLogined = computed(() => !!currentUser.value);

  // 设置本地存储的用户name  setUsername
  const setUsername = (name: string) => {
    // 判断是否为空字符串
    if (!name.trim()) return;
    // 去除首尾空格
    currentUser.value = name.trim();
    // 存储到本地
    localStorage.setItem('quiz_user', currentUser.value);
  };

  // 删除本地存储的用户quiz_user  logout
  const logout = () => {
    currentUser.value = '';
    localStorage.removeItem('quiz_user');
  };

  return {
    currentUser,
    isLogined,
    setUsername,
    logout,
  };
};
