<script>
import { useLoadingStore } from '@/stores/loading-store'
import { useLocaleStore } from './stores/localization/LocaleStore'

export default {
  watch: {
    '$route'(to, from) {
      if (to.params.lang !== this.localStore.locale) {
        const lang = to.params.lang
        this.localStore.setLocale(lang)
        this.$i18n.locale = lang
      }
      document.title = to.meta.title || 'Telemetric Demo'
    }
  },
  setup() {
    const loadingStore = useLoadingStore()
    const localStore = useLocaleStore()
    return {
      localStore,
      loadingStore,
    }
  },
  
  mounted() {
      this.$i18n.locale = this.localStore.locale
  }
}
</script>

<template>
  <RouterView />
  <loading :loading="loadingStore.loading" />
</template>

<style>
:root {
  @apply bg-bkg-base
}
</style>
