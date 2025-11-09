<script setup lang="ts">
const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#1b1718' : 'white')

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Nuxt Dashboard Template'
const description = 'A professional dashboard template built with Nuxt UI, featuring multiple pages, data visualization, and comprehensive management capabilities for creating powerful admin interfaces.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/dashboard-light.png',
  twitterImage: 'https://ui.nuxt.com/assets/templates/nuxt/dashboard-light.png',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <div class="app-root">
      <NuxtLoadingIndicator />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </UApp>
</template>

<!-- allow pages to grow and scroll; prevent overlays from forcing height/overflow hidden -->
<style>
/* Ensure root + layout components allow pages to grow and scroll */
html, body, #__nuxt, #app, .u-app, .nuxt-layout, .nuxt, .v-application {
  height: auto !important;
  min-height: 100% !important;
  margin: 0;
  overflow: auto !important;
  -webkit-overflow-scrolling: touch;
}

/* ensure Nuxt root children can be full height when needed */
#__nuxt > * {
  min-height: 100vh;
}

/* Undo common library/kit rules that may set full-screen and overflow hidden */
.u-app, UApp, .nuxt-layout {
  height: auto !important;
  overflow: visible !important;
  display: block !important;        /* ensure not using centered flex layout */
  align-items: stretch !important;  /* remove vertical centering if present */
}

/* wrapper that ensures pages take full viewport and can scroll */
.app-root {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  box-sizing: border-box;
}

/* utility: allow SVG / interactive children to receive pointer events */
.pointer-events-auto { pointer-events: auto !important; }

/* avoid accidental body-level clipping */
body { overscroll-behavior: auto; }
</style>