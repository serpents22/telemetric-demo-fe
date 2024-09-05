
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { defineAsyncComponent } from 'vue'

import App from './App.vue'
import router from './router'
import './index.css'
import DeleteConfirmationModal from '@/components/modal/DeleteConfirmationModal.vue'
import loading from '@/components/loading.vue'
import BaseInput from '@/components/input/BaseInput.vue'
import BaseButton from '@/components/input/BaseButton.vue'
import BaseDropdown from '@/components/input/BaseDropdown.vue'
import SideNav from '@/components/navigation/SideNav.vue'
import TopBar from '@/components/navigation/TopBar.vue'
import Vue3EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'
import i18n from './locales/i18n'
import JsonCSV from 'vue-json-csv'

const app = createApp(App)
const pinia = createPinia()

app.use(i18n)
app.use(router)
app.use(pinia)

app.mount('#app')



app
.component('EasyDataTable', Vue3EasyDataTable)
.component('BasicInput', BaseInput)
.component('BasicButton', BaseButton)
.component('BasicDropdown', BaseDropdown)
.component('SideNav', SideNav)
.component('TopBar', TopBar)
.component('loading', loading)
.component('DeleteConfirmationModal', DeleteConfirmationModal)
.component('downloadCsv', JsonCSV)

app.component('alert', defineAsyncComponent(() =>
  import('@/components/alert/BaseAlert.vue')
))