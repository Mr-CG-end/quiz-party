<template>
  <VModal :show="show">
    <div class="user-modal">
      <div class="user-modal__header">
        <h2 class="user-modal__title">欢迎来到测验派对！</h2>
        <p class="user-modal__subtitle">请输入你的昵称</p>
      </div>

      <form class="user-modal__form" @submit.prevent="handleStart">
        <div class="user-modal__input-group">
          <input
            v-model="name"
            type="text"
            class="user-modal__input"
            placeholder="请输入你的昵称..."
            required
            maxlength="12"
          />
        </div>

        <button type="submit" class="user-modal__button" :disabled="!isNameValid">准备好了，开始！</button>
      </form>
    </div>
  </VModal>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import VModal from '@/components/VModal/index.vue';
import { useUser } from '@/hooks/useUser';

defineOptions({
  name: 'UserModal',
});

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['start']);

const { setUsername } = useUser();
const name = ref('');

const isNameValid = computed(() => name.value.trim().length >= 2);

const handleStart = () => {
  if (!isNameValid.value) return;
  setUsername(name.value);
  emit('start');
};
</script>

<style src="./UserModal.scss" lang="scss" scoped />
