<template>
  <UApp>
    <NuxtLoadingIndicator />
    <slot />
  </UApp>
</template>

<style>
/* Minimal layout for auth pages */
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>

