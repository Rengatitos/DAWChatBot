<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated class="bg-white text-primary">
      <q-toolbar>
        <q-btn flat round dense icon="menu" @click="toggleDrawer" />
        <q-toolbar-title>Onboarding TCS</q-toolbar-title>

        <div v-if="auth.user" class="header-user">
          <user-card :user="auth.user" />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Drawer -->
    <q-drawer v-model="drawer" show-if-above bordered>
      <q-list>
        <q-item clickable v-ripple @click="go('/chat')">
          <q-item-section avatar><q-icon name="chat" /></q-item-section>
          <q-item-section>Chatbot</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="go('/actividades')">
          <q-item-section avatar><q-icon name="event" /></q-item-section>
          <q-item-section>Actividades</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="go('/recursos')">
          <q-item-section avatar><q-icon name="folder" /></q-item-section>
          <q-item-section>Recursos</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="go('/perfil')">
          <q-item-section avatar><q-icon name="person" /></q-item-section>
          <q-item-section>Perfil</q-item-section>
        </q-item>

        <q-separator />

        <q-item v-if="isAdmin" clickable v-ripple @click="go('/admin')">
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section>Admin Home</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Main Content -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/authStore'
import UserCard from 'src/components/UserCard.vue'

const drawer = ref(false)
const router = useRouter()
const auth = useAuthStore()

function toggleDrawer() {
  drawer.value = !drawer.value
}
function go(path) {
  router.push(path)
  drawer.value = false
}

const isAdmin = computed(() =>
  auth.user &&
  auth.user.rol &&
  auth.user.rol.toLowerCase().includes('admin')
)
</script>

<style scoped lang="scss">
@import 'src/styles/palette.scss';

.header-user {
  margin-left: 12px;
}
</style>
