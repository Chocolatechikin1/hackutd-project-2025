<template>
  <div v-if="pending" class="loading-text">
    Loading profile...
  </div>
  <div v-else-if="user" class="profile-container">
    <img 
      v-if="user.picture"
      :src="user.picture" 
      :alt="user.name || 'User'" 
      class="profile-picture"
    />
    <div class="profile-info">
      <div class="profile-name">
        {{ user.name }}
      </div>
      <div class="profile-email">
        {{ user.email }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useUser()
const pending = ref(false)

// Simulate loading state for better UX
onMounted(() => {
  pending.value = true
  nextTick(() => {
    pending.value = false
  })
})
</script>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.profile-picture {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #63b3ed;
  transition: transform 0.3s ease-in-out;
}

.profile-picture:hover {
  transform: scale(1.05);
}

.profile-info {
  text-align: center;
}

.profile-name {
  font-size: 2rem;
  font-weight: 600;
  color: #f7fafc;
  margin-bottom: 0.5rem;
}

.profile-email {
  font-size: 1.15rem;
  color: #a0aec0;
}

.loading-text {
  font-size: 1.8rem;
  font-weight: 500;
  color: #a0aec0;
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
</style>