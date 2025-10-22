<script setup>
  defineProps({
    userName: { type: String, default: 'Renato' },
    userPhoto: {
      type: String,
      default: 'https://cdn-icons-png.flaticon.com/512/53/53576.png',
    },
  })
</script>

<template>
  <nav class="menu-bar">
    <div class="menu-left">
      <span class="logo">Biblioteca</span>
    </div>
    <div class="menu-right">
      <img class="user-photo" alt="picture user" :src="userPhoto" />
      <span class="user-name">{{ userName }}</span>
    </div>
  </nav>
</template>
<style scoped>
  .menu-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #1976d2;
    padding: 0 24px;
    height: 56px;
    color: #fff;
    font-family: Arial, sans-serif;
  }

  .menu-left .logo {
    font-size: 1.5rem;
    font-weight: bold;
    letter-spacing: 1px;
  }

  .menu-right {
    display: flex;
    align-items: center;
  }

  .user-photo {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    margin-right: 10px;
    border: 2px solid #fff;
  }

  .user-name {
    font-size: 1rem;
    font-weight: 500;
  }
</style>
