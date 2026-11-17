<script setup lang="ts">
import NavBar from '@/components/layout/NavBar.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import CookieConsent from '@/components/common/CookieConsent.vue'
import ScrollToTop from '@/components/common/ScrollToTop.vue'
import WhatsAppChat from '@/components/common/WhatsAppChat.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col overflow-x-clip bg-background">
    <NavBar />
    <div class="flex flex-1 flex-col">
      <slot />
    </div>
    <SiteFooter />
    <ScrollToTop />
    <WhatsAppChat />
    <CookieConsent />
  </div>
</template>
