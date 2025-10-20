<script setup>
  import { useRoute, useRouter } from 'vue-router'

  const { modelValue, nameModal } = defineProps({
    modelValue: { type: Boolean, required: true },
    nameModal: { type: String, required: true },
  })
  const router = useRouter()
  const route = useRoute()
  function closeModal() {
    const { [nameModal]: _, ...rest } = route.query
    router.push({ query: { ...rest } })
  }
</script>

<template>
  <div v-if="modelValue" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <slot />
    </div>
  </div>
</template>
<style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: #fff;
    padding: 32px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
    min-width: 320px;
    max-width: 90vw;
    text-align: center;
  }

  .close-modal-btn {
    margin-top: 24px;
    background: #1976d2;
    color: #fff;
    border: none;
    padding: 8px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }

  .close-modal-btn:active {
    background: #115293;
  }
</style>
