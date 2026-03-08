<template>
  <VModal :show="show">
    <div class="flex flex-col items-center gap-6 p-4 text-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">欢迎来到测验派对！</h2>
        <p class="text-sm text-gray-400 leading-relaxed">请输入你的昵称</p>
      </div>

      <form class="w-full flex flex-col gap-5" @submit.prevent="handleStart">
        <div class="relative w-full">
          <input
            v-model="name"
            type="text"
            class="w-full px-4 py-3.5 bg-white/5 border border-black/10 rounded-xl text-black text-base transition-all duration-300 outline-none placeholder:text-gray-400 focus:bg-white/10 focus:border-primary focus:ring-4 focus:ring-primary/20"
            placeholder="请输入你的昵称..."
            required
            maxlength="12"
          />
        </div>

        <button
          type="submit"
          class="w-full p-3.5 bg-gradient-to-br from-primary to-red-600 border-none rounded-xl text-white text-base font-semibold cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(186,24,27,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(186,24,27,0.4)] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          :disabled="!isNameValid"
        >
          准备好了，开始！
        </button>
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
