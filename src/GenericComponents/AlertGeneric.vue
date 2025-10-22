<script setup lang="ts">
  import { ref, watch } from 'vue'

  interface ToastProps {
    message: string
    type?: 'success' | 'error' | 'warning' | 'info'
    duration?: number
    errors?: string[]
  }

  const props = withDefaults(defineProps<ToastProps>(), {
    type: 'info',
    duration: 5000,
    errors: () => [],
  })

  const emit = defineEmits<{
    close: []
  }>()

  const visible = ref(true)
  const isClosing = ref(false)

  const close = () => {
    isClosing.value = true
    setTimeout(() => {
      visible.value = false
      emit('close')
    }, 300)
  }

  if (props.duration > 0) {
    setTimeout(close, props.duration)
  }

  const iconMap = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  }

  const colorMap = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  }
</script>

<template>
  <Transition name="toast">
    <div
      v-if="visible"
      :class="['toast-notification', type, { closing: isClosing }]"
      :style="{ borderLeftColor: colorMap[type] }"
    >
      <div class="toast-icon" :style="{ backgroundColor: colorMap[type] }">
        {{ iconMap[type] }}
      </div>
      <div class="toast-content">
        <strong class="toast-title">{{ message }}</strong>
        <ul v-if="errors?.length" class="toast-errors">
          <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
        </ul>
      </div>
      <button class="toast-close" @click="close" aria-label="Fechar">×</button>
    </div>
  </Transition>
</template>

<style scoped>
  .toast-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    min-width: 300px;
    max-width: 500px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: flex-start;
    padding: 16px;
    gap: 12px;
    border-left: 4px solid;
    z-index: 9999;
    animation: slideIn 0.3s ease-out;
  }

  .toast-notification.closing {
    animation: slideOut 0.3s ease-in;
  }

  .toast-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    flex-shrink: 0;
  }

  .toast-content {
    flex: 1;
    min-width: 0;
  }

  .toast-title {
    display: block;
    margin-bottom: 4px;
    font-size: 14px;
    color: #1f2937;
  }

  .toast-errors {
    margin: 8px 0 0 0;
    padding-left: 20px;
    font-size: 13px;
    color: #6b7280;
    list-style: disc;
  }

  .toast-errors li {
    margin-bottom: 4px;
  }

  .toast-close {
    background: none;
    border: none;
    font-size: 24px;
    color: #9ca3af;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: color 0.2s;
  }

  .toast-close:hover {
    color: #4b5563;
  }

  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }

  .toast-enter-active,
  .toast-leave-active {
    transition: all 0.3s ease;
  }

  .toast-enter-from {
    transform: translateX(400px);
    opacity: 0;
  }

  .toast-leave-to {
    transform: translateX(400px);
    opacity: 0;
  }
</style>
