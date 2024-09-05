<script>
import { onMounted } from 'vue'
import Tab from '@/components/tab/Tab.vue'
import { useLocalStorage } from '@vueuse/core'
import EngineDevice from './EngineDevice.vue'
import Temperature from './Temperature.vue'
import VibrationWind from './VibrationWind.vue'
import router from '@/router'
import { useI18n } from 'vue-i18n'

export default {
  components: {
    Tab, EngineDevice, Temperature, VibrationWind
  },
  props: ['id'],

  setup(props) {
    const { t } = useI18n()

    const selectedComponent = useLocalStorage('SelectedConfigurationTab', 'EngineDevice')
    const tabs = [
      {
        title: t('engineAndDevice'),
        value: 'EngineDevice',
      },
      {
        title: t('temperature'),
        value: 'Temperature',
      },
      {
        title: t('vibrationAndWind'),
        value: 'VibrationWind',
      }
    ]

    function changeNavigation(navigation) {
      var subNavs = document.getElementsByClassName("nav")
      console.log(subNavs)
      for (var i of subNavs) {
        i.classList.remove("active");
      }
      console.log(navigation)
      // event.target.classList.add("active")
      event.target.className += " active"
      selectedComponent.value = navigation
    }

    function goBack() {
      router.go(-1)
    }
    onMounted(async () => {
      var element = document.getElementById(selectedComponent.value)
      element.classList.add("active")
    })

    return {
      selectedComponent,
      tabs,
      changeNavigation,
      props,
      goBack
    }
  }
}
</script>

<template>
  <!-- <alert :message="status.message" :modalActive="modalActive" :isError="status.isError"
    @close="closeNotification" /> -->
  <div class="flex">
    <SideNav :isDashboardActive="true" />
    <div class="flex flex-col w-screen">
      <TopBar>
        <p class="text-label-primary">{{$t('deviceConfiguration')}}</p>
      </TopBar>
      <div
        class=" m-2 lg:m-[20px] flex-1 bg-bkg-primary rounded-[10px] shadow border border-bkg-secondary flex-col flex">

        <div class="px-3 py-2 lg:px-6 lg:py-4 bg-bkg-secondary flex items-center gap-4">
          <img @click="goBack()" src="../../assets/back-icon.svg" alt="" height="32px" width="32px"
            class="cursor-pointer hover:scale-110 transition-transform duration-150">
          <p class="text-accent-1 font-medium text-base">{{ props.id }}</p>
        </div>
        <div class="tab-wrapper">
          <div class="tab">
            <button v-for="(tab, index) in tabs" :key="tab.value" @click="changeNavigation(tab.value)" class="nav"
              :value="index" :id="tab.value">{{ tab.title }}
            </button>
          </div>
        </div>
        <div class="component-wrapper">
          <component :is="selectedComponent" :id="props.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
p {
  @apply select-none
}

.tab-wrapper {
  @apply px-3 py-2 lg:px-[46px] lg:py-[32px] sticky top-0 shadow-sm
}

.component-wrapper {
  @apply px-3 py-6 lg:px-[46px] lg:py-[32px]
}

.tab {
  @apply flex justify-between w-fit border border-bkg-tertiary rounded-lg shadow-inner p-1 bg-bkg-secondary gap-2
}

button {
  @apply disabled:opacity-75 flex justify-center items-center relative text-label-primary cursor-pointer p-2 lg:py-[6px] lg:px-6 rounded-md w-[full] text-[9px] lg:text-[14px] font-medium
}

button:hover {
  @apply bg-bkg-primary text-label-primary transition-colors duration-700
}

.active {
  @apply bg-bkg-primary text-accent-1 transition-colors duration-300
}

.active:hover {
  @apply bg-bkg-primary text-accent-1 transition-colors duration-300 cursor-default
}
</style>
