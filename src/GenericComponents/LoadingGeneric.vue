<script setup lang="ts">
  interface LoadingProps {
    size?: 'small' | 'medium' | 'large'
    message?: string
    color?: string
  }

  const props = withDefaults(defineProps<LoadingProps>(), {
    size: 'medium',
    message: 'Carregando...',
    color: '#1976d2',
  })

  const sizeMap = {
    small: '24px',
    medium: '40px',
    large: '60px',
  }
</script>

<template>
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p v-if="message" class="loading-message">{{ message }}</p>
  </div>
</template>

<style scoped>
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .loading-spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #1976d2;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loading-message {
    margin-top: 12px;
    font-size: 14px;
    color: #666;
    font-weight: 500;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
