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
/* Ensure root elements are properly sized */
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden !important;
}

#__nuxt {
  height: 100% !important;
  overflow: hidden !important;
}

/* wrapper that ensures pages take full viewport */
.app-root {
  height: 100% !important;
  width: 100% !important;
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden !important;
}

/* Fix Nuxt UI Dashboard components to allow scrolling */
:deep(.u-dashboard-group) {
  height: 100vh !important;
  max-height: 100vh !important;
  overflow: hidden !important;
  display: flex !important;
}

/* Ensure sidebar doesn't interfere */
:deep(.u-dashboard-sidebar) {
  flex-shrink: 0 !important;
  overflow-y: auto !important;
  height: 100vh !important;
}

/* Make dashboard panels scrollable - target the panel container */
:deep(.u-dashboard-panel),
:deep([data-ui="dashboard-panel"]) {
  flex: 1 !important;
  height: 100vh !important;
  max-height: 100vh !important;
  overflow: hidden !important;
  display: flex !important;
  flex-direction: column !important;
}

/* Target the body slot specifically - this is what should scroll */
:deep(.u-dashboard-panel [data-slot="body"]),
:deep([data-ui="dashboard-panel"] [data-slot="body"]),
:deep(.u-dashboard-panel) > div:not([data-slot="header"]):not([data-slot="footer"]),
:deep([data-ui="dashboard-panel"]) > div:not([data-slot="header"]):not([data-slot="footer"]) {
  flex: 1 !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  -webkit-overflow-scrolling: touch !important;
  min-height: 0 !important;
}

/* Ensure nested divs don't block scrolling */
:deep(.u-dashboard-panel) div,
:deep([data-ui="dashboard-panel"]) div {
  min-height: 0;
}

/* utility: allow SVG / interactive children to receive pointer events */
.pointer-events-auto { 
  pointer-events: auto !important; 
}

/* avoid accidental body-level clipping */
body { 
  overscroll-behavior: auto; 
}
</style>