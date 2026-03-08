<template>
  <Transition name="modal">
    <div
      v-if="show"
      class="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm bg-[#d9d9d9]/10 modal-wrapper z-50"
    >
      <div class="modal bg-white rounded-2xl py-12 px-6 shadow-[0_2px_4px_2px_rgba(11,9,10,0.04)] animate-show">
        <slot />
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { toRef, watch } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['on-close']);

const show = toRef(props, 'show');

const onClose = () => {
  emit('on-close');
};

const onBackgroundClicked = (e: MouseEvent) => {
  const modalWrapper = document.querySelector('.modal-wrapper');

  if (e.target === modalWrapper) {
    onClose();
  }
};

const onEscapeKeyClicked = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    onClose();
  }
};

const watchHandler = (canShow: boolean) => {
  if (canShow) {
    document.addEventListener('keyup', onEscapeKeyClicked);
    document.addEventListener('click', onBackgroundClicked);
  } else {
    document.removeEventListener('keyup', onEscapeKeyClicked);
    document.removeEventListener('click', onBackgroundClicked);
  }
};

watch(show, watchHandler, { immediate: true });
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-leave-to .modal {
  animation: leave 0.5s forwards;
}

@keyframes show {
  from {
    opacity: 0.7;
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
