<script setup>
import { useDeviceConfigStore } from '@/stores/master-data/config-store'
import { onMounted, ref } from 'vue'
import BaseInput from '@/components/input/BaseInput.vue'
import BaseButton from '@/components/input/BaseButton.vue'
import { Form as VeeForm } from 'vee-validate'
import * as yup from 'yup'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time))
const props = defineProps(['id'])

const deviceConfigStore = useDeviceConfigStore()
const { deviceConfigs, getDeviceConfigStatus, getDeviceConfigIsLoading, postDeviceConfigIsLoading, postDeviceConfigStatus } = storeToRefs(useDeviceConfigStore())

const deviceConfigParams = ref({
  code: null,
  command: 'CONFIG',
  fields: 'out1mode,in2,in2pol,timezone,tstat,treport'
})

const engineData = ref({
  OUT1MODE: '0',
  IN2: '0',
  IN2POL: '0',
  TIMEZONE: 'Asia/Jakarta',
  TSTAT: '200',
  TREPORT: '10',
})

async function getDeviceConfigData() {
  await deviceConfigStore.getDeviceConfig(deviceConfigParams.value)
  engineData.value.OUT1MODE = deviceConfigs.value.out1mode
  engineData.value.IN2 = deviceConfigs.value.in2
  engineData.value.IN2POL = deviceConfigs.value.in2pol
  engineData.value.TIMEZONE = deviceConfigs.value.timezone
  engineData.value.TSTAT = deviceConfigs.value.tstat
  engineData.value.TREPORT = deviceConfigs.value.treport
  console.log(engineData.value)
}

onMounted(async () => {
  deviceConfigParams.value.code = props.id
  getDeviceConfigData()
})

//alert control
const modalActive = ref(false)
const closeNotification = () => {
  modalActive.value = false
}

//update
const submitLabel = ref('Update')
const submitClicked = ref(0)

const schema = yup.object({
  TSTAT: yup.number().required().min(0).max(3600),
  TREPORT: yup.number().required().min(0).max(3600),
})

const postEngineConfigBody = ref({
  code: null,
  command: 'CONFIG',
  payload: {}
})

const onSubmit = async (values) => {
  submitClicked.value = ++submitClicked.value
  if (submitClicked.value === 1) {
    submitLabel.value = 'the data entered is correct?'
  }
  postEngineConfigBody.value.code = props.id
  postEngineConfigBody.value.payload = engineData.value

  if (submitClicked.value === 2) {
    await deviceConfigStore.postDeviceConfig(postEngineConfigBody.value)
    modalActive.value = true
    submitLabel.value = 'Update'
    submitClicked.value = 0
    if (postDeviceConfigStatus.value.isError) {
      closeNotification()
    } else {
      await delay(1000)
      closeNotification()
      getDeviceConfigData()
    }
  }
}




const timezones =
  [
    ["Atlantic/Cape_Verde", "<-01>1"],
    ["Etc/GMT+1", "<-01>1"],
    ["Atlantic/Azores", "<-01>1<+00>,M3.5.0/0,M10.5.0/1"],
    ["Etc/GMT+2", "<-02>2"],
    ["America/Godthab", "<-02>2<-01>,M3.5.0/-1,M10.5.0/0"],
    ["America/Argentina/Buenos_Aires", "<-03>3"],
    ["Etc/GMT+3", "<-03>3"],
    ["America/Miquelon", "<-03>3<-02>,M3.2.0,M11.1.0"],
    ["Etc/GMT+4", "<-04>4"],
    ["America/Asuncion", "<-04>4<-03>,M10.1.0/0,M3.4.0/0"],
    ["America/Santiago", "<-04>4<-03>,M9.1.6/24,M4.1.6/24"],
    ["Etc/GMT+5", "<-05>5"],
    ["Pacific/Galapagos", "<-06>6"],
    ["Etc/GMT+6", "<-06>6"],
    ["Pacific/Easter", "<-06>6<-05>,M9.1.6/22,M4.1.6/22"],
    ["Etc/GMT+7", "<-07>7"],
    ["Pacific/Pitcairn", "<-08>8"],
    ["Etc/GMT+8", "<-08>8"],
    ["Pacific/Gambier", "<-09>9"],
    ["Etc/GMT+9", "<-09>9"],
    ["Pacific/Marquesas", "<-0930>9:30"],
    ["Pacific/Tahiti", "<-10>10"],
    ["Etc/GMT+10", "<-10>10"],
    ["Pacific/Niue", "<-11>11"],
    ["Etc/GMT+11", "<-11>11"],
    ["Etc/GMT+12", "<-12>12"],
    ["Antarctica/Troll", "<+00>0<+02>-2,M3.5.0/1,M10.5.0/3"],
    ["Africa/Casablanca", "<+01>-1"],
    ["Etc/GMT-1", "<+01>-1"],
    ["Etc/GMT-2", "<+02>-2"],
    ["Europe/Istanbul", "<+03>-3"],
    ["Etc/GMT-3", "<+03>-3"],
    ["Asia/Tehran", "<+0330>-3:30"],
    ["Asia/Dubai", "<+04>-4"],
    ["Indian/Mahe", "<+04>-4"],
    ["Indian/Mauritius", "<+04>-4"],
    ["Indian/Reunion", "<+04>-4"],
    ["Etc/GMT-4", "<+04>-4"],
    ["Asia/Kabul", "<+0430>-4:30"],
    ["Indian/Maldives", "<+05>-5"],
    ["Etc/GMT-5", "<+05>-5"],
    ["Asia/Colombo", "<+0530>-5:30"],
    ["Asia/Kathmandu", "<+0545>-5:45"],
    ["Indian/Chagos", "<+06>-6"],
    ["Etc/GMT-6", "<+06>-6"],
    ["Asia/Yangon", "<+0630>-6:30"],
    ["Indian/Cocos", "<+0630>-6:30"],
    ["Asia/Bangkok", "<+07>-7"],
    ["Etc/GMT-7", "<+07>-7"],
    ["Asia/Kuala_Lumpur", "<+08>-8"],
    ["Asia/Singapore", "<+08>-8"],
    ["Etc/GMT-8", "<+08>-8"],
    ["Australia/Eucla", "<+0845>-8:45"],
    ["Pacific/Palau", "<+09>-9"],
    ["Etc/GMT-9", "<+09>-9"],
    ["Asia/Vladivostok", "<+10>-10"],
    ["Etc/GMT-10", "<+10>-10"],
    ["Australia/Lord_Howe", "<+1030>-10:30<+11>-11,M10.1.0,M4.1.0"],
    ["Asia/Magadan", "<+11>-11"],
    ["Etc/GMT-11", "<+11>-11"],
    ["Pacific/Norfolk", "<+11>-11<+12>,M10.1.0,M4.1.0/3"],
    ["Pacific/Fiji", "<+12>-12"],
    ["Etc/GMT-12", "<+12>-12"],
    ["Pacific/Chatham", "<+1245>-12:45<+1345>,M9.5.0/2:45,M4.1.0/3:45"],
    ["Pacific/Apia", "<+13>-13"],
    ["Etc/GMT-13", "<+13>-13"],
    ["Pacific/Kiritimati", "<+14>-14"],
    ["Etc/GMT-14", "<+14>-14"],
    ["Australia/Darwin", "ACST-9:30"],
    ["Australia/Adelaide", "ACST-9:30ACDT,M10.1.0,M4.1.0/3"],
    ["Australia/Lindeman", "AEST-10"],
    ["Australia/Melbourne", "AEST-10AEDT,M10.1.0,M4.1.0/3"],
    ["Australia/Sydney", "AEST-10AEDT,M10.1.0,M4.1.0/3"],
    ["America/Anchorage", "AKST9AKDT,M3.2.0,M11.1.0"],
    ["America/Puerto_Rico", "AST4"],
    ["America/Santo_Domingo", "AST4"],
    ["Atlantic/Bermuda", "AST4ADT,M3.2.0,M11.1.0"],
    ["Australia/Perth", "AWST-8"],
    ["Africa/Kigali", "CAT-2"],
    ["Africa/Algiers", "CET-1"],
    ["Africa/Tunis", "CET-1"],
    ["Europe/Amsterdam", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["Europe/Andorra", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["Europe/Belgrade", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["Europe/Berlin", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["Europe/Bratislava", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["Europe/Brussels", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["Europe/Budapest", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["Europe/Busingen", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["Europe/Copenhagen", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["Europe/Gibraltar", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["Europe/Ljubljana", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["Europe/Luxembourg", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["Europe/Madrid", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["Europe/Malta", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["Europe/Monaco", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["Europe/Oslo", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["Europe/Paris", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["Europe/Podgorica", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["Europe/Prague", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["Europe/Rome", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["Europe/San_Marino", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["Europe/Sarajevo", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["Europe/Skopje", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["Europe/Stockholm", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["Europe/Tirane", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["Europe/Vaduz", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["Europe/Vatican", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["Europe/Vienna", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["Europe/Warsaw", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["Europe/Zagreb", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["Europe/Zurich", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["Pacific/Guam", "ChST-10"],
    ["Asia/Macau", "CST-8"],
    ["Asia/Shanghai", "CST-8"],
    ["Asia/Taipei", "CST-8"],
    ["America/Havana", "CST5CDT,M3.2.0/0,M11.1.0/1"],
    ["America/Bahia_Banderas", "CST6"],
    ["America/Belize", "CST6"],
    ["America/Chihuahua", "CST6"],
    ["America/Costa_Rica", "CST6"],
    ["America/El_Salvador", "CST6"],
    ["America/Guatemala", "CST6"],
    ["America/Managua", "CST6"],
    ["America/Merida", "CST6"],
    ["America/Mexico_City", "CST6"],
    ["America/Monterrey", "CST6"],
    ["America/Regina", "CST6"],
    ["America/Swift_Current", "CST6"],
    ["America/Tegucigalpa", "CST6"],
    ["America/Chicago", "CST6CDT,M3.2.0,M11.1.0"],
    ["America/Indiana/Knox", "CST6CDT,M3.2.0,M11.1.0"],
    ["America/Indiana/Tell_City", "CST6CDT,M3.2.0,M11.1.0"],
    ["America/Matamoros", "CST6CDT,M3.2.0,M11.1.0"],
    ["America/Menominee", "CST6CDT,M3.2.0,M11.1.0"],
    ["America/North_Dakota/Beulah", "CST6CDT,M3.2.0,M11.1.0"],
    ["America/North_Dakota/Center", "CST6CDT,M3.2.0,M11.1.0"],
    ["America/North_Dakota/New_Salem", "CST6CDT,M3.2.0,M11.1.0"],
    ["America/Ojinaga", "CST6CDT,M3.2.0,M11.1.0"],
    ["America/Rainy_River", "CST6CDT,M3.2.0,M11.1.0"],
    ["America/Rankin_Inlet", "CST6CDT,M3.2.0,M11.1.0"],
    ["America/Resolute", "CST6CDT,M3.2.0,M11.1.0"],
    ["America/Winnipeg", "CST6CDT,M3.2.0,M11.1.0"],
    ["Africa/Addis_Ababa", "EAT-3"],
    ["Africa/Asmara", "EAT-3"],
    ["Africa/Dar_es_Salaam", "EAT-3"],
    ["Africa/Djibouti", "EAT-3"],
    ["Africa/Kampala", "EAT-3"],
    ["Africa/Mogadishu", "EAT-3"],
    ["Africa/Nairobi", "EAT-3"],
    ["Indian/Antananarivo", "EAT-3"],
    ["Indian/Comoro", "EAT-3"],
    ["Indian/Mayotte", "EAT-3"],
    ["Africa/Tripoli", "EET-2"],
    ["Europe/Kaliningrad", "EET-2"],
    ["Asia/Gaza", "EET-2EEST,M3.4.4/50,M10.4.4/50"],
    ["Asia/Hebron", "EET-2EEST,M3.4.4/50,M10.4.4/50"],
    ["Europe/Chisinau", "EET-2EEST,M3.5.0,M10.5.0/3"],
    ["Asia/Beirut", "EET-2EEST,M3.5.0/0,M10.5.0/0"],
    ["Asia/Famagusta", "EET-2EEST,M3.5.0/3,M10.5.0/4"],
    ["Asia/Nicosia", "EET-2EEST,M3.5.0/3,M10.5.0/4"],
    ["Europe/Athens", "EET-2EEST,M3.5.0/3,M10.5.0/4"],
    ["Europe/Bucharest", "EET-2EEST,M3.5.0/3,M10.5.0/4"],
    ["Europe/Helsinki", "EET-2EEST,M3.5.0/3,M10.5.0/4"],
    ["Europe/Kiev", "EET-2EEST,M3.5.0/3,M10.5.0/4"],
    ["Europe/Mariehamn", "EET-2EEST,M3.5.0/3,M10.5.0/4"],
    ["Europe/Riga", "EET-2EEST,M3.5.0/3,M10.5.0/4"],
    ["Europe/Sofia", "EET-2EEST,M3.5.0/3,M10.5.0/4"],
    ["Europe/Tallinn", "EET-2EEST,M3.5.0/3,M10.5.0/4"],
    ["Europe/Uzhgorod", "EET-2EEST,M3.5.0/3,M10.5.0/4"],
    ["Europe/Vilnius", "EET-2EEST,M3.5.0/3,M10.5.0/4"],
    ["Europe/Zaporozhye", "EET-2EEST,M3.5.0/3,M10.5.0/4"],
    ["Africa/Cairo", "EET-2EEST,M4.5.5/0,M10.5.4/24"],
    ["America/Atikokan", "EST5"],
    ["America/Cancun", "EST5"],
    ["America/Cayman", "EST5"],
    ["America/Jamaica", "EST5"],
    ["America/Panama", "EST5"],
    ["America/Detroit", "EST5EDT,M3.2.0,M11.1.0"],
    ["America/Grand_Turk", "EST5EDT,M3.2.0,M11.1.0"],
    ["America/Indiana/Indianapolis", "EST5EDT,M3.2.0,M11.1.0"],
    ["America/Indiana/Marengo", "EST5EDT,M3.2.0,M11.1.0"],
    ["America/Indiana/Petersburg", "EST5EDT,M3.2.0,M11.1.0"],
    ["America/Indiana/Vevay", "EST5EDT,M3.2.0,M11.1.0"],
    ["America/Indiana/Vincennes", "EST5EDT,M3.2.0,M11.1.0"],
    ["America/Indiana/Winamac", "EST5EDT,M3.2.0,M11.1.0"],
    ["America/Iqaluit", "EST5EDT,M3.2.0,M11.1.0"],
    ["America/Kentucky/Louisville", "EST5EDT,M3.2.0,M11.1.0"],
    ["America/Kentucky/Monticello", "EST5EDT,M3.2.0,M11.1.0"],
    ["America/Montreal", "EST5EDT,M3.2.0,M11.1.0"],
    ["America/Nassau", "EST5EDT,M3.2.0,M11.1.0"],
    ["America/New_York", "EST5EDT,M3.2.0,M11.1.0"],
    ["America/Nipigon", "EST5EDT,M3.2.0,M11.1.0"],
    ["America/Pangnirtung", "EST5EDT,M3.2.0,M11.1.0"],
    ["America/Port-au-Prince", "EST5EDT,M3.2.0,M11.1.0"],
    ["America/Thunder_Bay", "EST5EDT,M3.2.0,M11.1.0"],
    ["America/Toronto", "EST5EDT,M3.2.0,M11.1.0"],
    ["Africa/Abidjan", "GMT0"],
    ["Africa/Accra", "GMT0"],
    ["Africa/Bamako", "GMT0"],
    ["Africa/Banjul", "GMT0"],
    ["Africa/Bissau", "GMT0"],
    ["Africa/Conakry", "GMT0"],
    ["Africa/Dakar", "GMT0"],
    ["Africa/Freetown", "GMT0"],
    ["Africa/Lome", "GMT0"],
    ["Africa/Monrovia", "GMT0"],
    ["Africa/Nouakchott", "GMT0"],
    ["Africa/Ouagadougou", "GMT0"],
    ["Africa/Sao_Tome", "GMT0"],
    ["America/Danmarkshavn", "GMT0"],
    ["Atlantic/Reykjavik", "GMT0"],
    ["Atlantic/St_Helena", "GMT0"],
    ["Etc/GMT", "GMT0"],
    ["Etc/GMT-0", "GMT0"],
    ["Etc/GMT0", "GMT0"],
    ["Etc/GMT+0", "GMT0"],
    ["Etc/Greenwich", "GMT0"],
    ["Europe/Guernsey", "GMT0BST,M3.5.0/1,M10.5.0"],
    ["Europe/Isle_of_Man", "GMT0BST,M3.5.0/1,M10.5.0"],
    ["Europe/Jersey", "GMT0BST,M3.5.0/1,M10.5.0"],
    ["Europe/London", "GMT0BST,M3.5.0/1,M10.5.0"],
    ["Asia/Hong_Kong", "HKT-8"],
    ["Pacific/Honolulu", "HST10"],
    ["America/Adak", "HST10HDT,M3.2.0,M11.1.0"],
    ["Europe/Dublin", "IST-1GMT0,M10.5.0,M3.5.0/1"],
    ["Asia/Jerusalem", "IST-2IDT,M3.4.4/26,M10.5.0"],
    ["Asia/Kolkata", "IST-5:30"],
    ["Asia/Tokyo", "JST-9"],
    ["Asia/Pyongyang", "KST-9"],
    ["Asia/Seoul", "KST-9"],
    ["Europe/Moscow", "MSK-3"],
    ["Europe/Simferopol", "MSK-3"],
    ["America/Creston", "MST7"],
    ["America/Dawson", "MST7"],
    ["America/Dawson_Creek", "MST7"],
    ["America/Fort_Nelson", "MST7"],
    ["America/Hermosillo", "MST7"],
    ["America/Mazatlan", "MST7"],
    ["America/Phoenix", "MST7"],
    ["America/Whitehorse", "MST7"],
    ["America/Boise", "MST7MDT,M3.2.0,M11.1.0"],
    ["America/Cambridge_Bay", "MST7MDT,M3.2.0,M11.1.0"],
    ["America/Denver", "MST7MDT,M3.2.0,M11.1.0"],
    ["America/Edmonton", "MST7MDT,M3.2.0,M11.1.0"],
    ["America/Inuvik", "MST7MDT,M3.2.0,M11.1.0"],
    ["America/Yellowknife", "MST7MDT,M3.2.0,M11.1.0"],
    ["America/St_Johns", "NST3:30NDT,M3.2.0,M11.1.0"],
    ["Antarctica/McMurdo", "NZST-12NZDT,M9.5.0,M4.1.0/3"],
    ["Pacific/Auckland", "NZST-12NZDT,M9.5.0,M4.1.0/3"],
    ["Asia/Karachi", "PKT-5"],
    ["Asia/Manila", "PST-8"],
    ["America/Los_Angeles", "PST8PDT,M3.2.0,M11.1.0"],
    ["America/Tijuana", "PST8PDT,M3.2.0,M11.1.0"],
    ["America/Vancouver", "PST8PDT,M3.2.0,M11.1.0"],
    ["Africa/Johannesburg", "SAST-2"],
    ["Africa/Maseru", "SAST-2"],
    ["Africa/Mbabane", "SAST-2"],
    ["Pacific/Midway", "SST11"],
    ["Pacific/Pago_Pago", "SST11"],
    ["Etc/UCT", "UTC0"],
    ["Etc/UTC", "UTC0"],
    ["Etc/Universal", "UTC0"],
    ["Etc/Zulu", "UTC0"],
    ["Africa/Bangui", "WAT-1"],
    ["Africa/Brazzaville", "WAT-1"],
    ["Atlantic/Canary", "WET0WEST,M3.5.0/1,M10.5.0"],
    ["Atlantic/Faroe", "WET0WEST,M3.5.0/1,M10.5.0"],
    ["Atlantic/Madeira", "WET0WEST,M3.5.0/1,M10.5.0"],
    ["Europe/Lisbon", "WET0WEST,M3.5.0/1,M10.5.0"],
    ["Asia/Jakarta", "WIB-7"],
    ["Asia/Pontianak", "WIB-7"],
    ["Asia/Jayapura", "WIT-9"],
    ["Asia/Makassar", "WITA-8"]
  ]

</script>
<template>
  <alert :message="postDeviceConfigStatus.message" :modalActive="modalActive" :isError="postDeviceConfigStatus.isError"
    @close="closeNotification" />
  <VeeForm :validation-schema="schema" v-slot="{ handleSubmit }" as="div" ref="form">
    <form @submit="handleSubmit($event, onSubmit)" class="form-wrapper">
      <div class="w-fit flex flex-col lg:flex-row gap-[20px] lg:gap-[70px]">
        <div class="flex flex-col gap-[5px] lg:gap-[10px] pb:[12px] lg:pr-[70px] max-w-[400px]">
          <p class="text-accent-1 font-bold text-xs lg:text-base">{{ $t('engineConfiguration') }}</p>
          <p class="text-label-secondary text-xs lg:text-sm">{{ $t('engineConfigurationDescription') }}</p>
        </div>
        <div
          class="flex flex-col gap-[24px] pb-[20px] lg:pr-[70px] border-b lg:border-r lg:border-b-0 w-full max-w-[400px]">
          <div class="input-wrapper border-label-secondary">
            <label for="type" class="text-[12px] font-semibold select-none text-label-primary">{{
              $t('workingModeEngine') }}</label>
            <select name="type" v-model="engineData.OUT1MODE" class="cursor-pointer text-sm" required>
              <option value="0">
                {{ $t('manual') }}
              </option>
              <option value="1">
                {{ $t('automatic') }}
              </option>
            </select>
          </div>
          <div class="input-wrapper border-label-secondary">
            <label for="type" class="text-[12px] font-semibold select-none text-label-primary">{{
              $t('engineOperatingMode') }}</label>
            <select name="type" v-model="engineData.IN2" class="cursor-pointer text-sm" required>
              <option value="0">
                {{ $t('disabled') }}
              </option>
              <option value="1">
                {{ $t('notificationOnly') }}
              </option>
              <option value="2">
                {{ $t('alarm') }}
              </option>
              <option value="3">
                {{ $t('alarmEngineOff') }}
              </option>
            </select>
          </div>
          <div class="input-wrapper border-label-secondary">
            <label for="type" class="text-[12px] font-semibold select-none text-label-primary">{{ $t('operationModeIn2')
              }}</label>
            <select name="type" v-model="engineData.IN2POL" class="cursor-pointer text-sm" required>
              <option value="0">
                {{ $t('no') }}
              </option>
              <option value="1">
                {{ $t('nc') }}
              </option>
            </select>
          </div>
        </div>
        <div class="flex flex-col gap-[5px] lg:gap-[10px] pb:[12px] lg:pr-[70px] max-w-[400px]">
          <p class="text-accent-1 font-bold text-xs lg:text-base">{{ $t('devicePreferences') }}</p>
          <p class="text-label-secondary text-xs lg:text-sm">{{ $t('devicePreferencesDescription') }}</p>
        </div>
        <div class="flex flex-col gap-[24px] pb-[20px] lg:pr-[70px] w-full max-w-[400px]">
          <div class="input-wrapper border-label-secondary">
            <label for="type" class="text-[12px] font-semibold select-none text-label-primary">{{
              $t('setLocationTimezone') }}</label>
            <select name="type" v-model="engineData.TIMEZONE" class="cursor-pointer text-sm" required>
              <option v-for="zone in timezones" :value="zone[1]">
                {{ zone[0] }}
              </option>
            </select>
          </div>
          <BaseInput name="TSTAT" type="text" placeholder="0 to 3600" :label="t('sendingIntervalStatus')"
            v-model="engineData.TSTAT" />
          <BaseInput name="TREPORT" type="text" placeholder="0 to 3600" :label="t('reportSendingInterval')"
            v-model="engineData.TREPORT" />
        </div>
      </div>
      <div class="w-full lg:w-fit py-3 lg:py-[32px]">
        <BaseButton type="submit" class="primary" :label="submitLabel" :loading="postDeviceConfigIsLoading" />
      </div>
    </form>
  </VeeForm>
</template>

<style scoped>
p {
  @apply select-none
}

.input-wrapper {
  @apply flex flex-col gap-1 text-left w-full px-4 py-2 rounded-[10px] border
}

select {
  @apply cursor-pointer text-xs lg:text-[14px] font-medium bg-transparent outline-none text-label-primary
}

option {
  @apply text-xs lg:text-sm
}

.text-field {
  @apply flex flex-col gap-1
}

.label {
  @apply text-[9px] lg:text-[12px] font-semibold select-none text-label-primary
}

input {
  @apply outline-none text-xs lg:text-[14px] bg-transparent font-medium text-label-primary
}

input::placeholder {
  @apply text-xs lg:text-[14px] text-label-secondary font-normal
}



.modal {
  @apply fixed top-0 left-0 w-full h-full overflow-x-hidden overflow-y-auto bg-[#ABADAF]/20 z-50
}

.modal-inner {
  @apply max-w-[500px] my-[100px] mx-auto
}

.modal-content {
  @apply relative w-[600px] p-[40px] bg-white rounded-xl gap-[40px] flex flex-col
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.drop-in-enter-active,
.drop-in-leave-active {
  transition: all 0.3s ease-out;
}

.drop-in-enter-from,
.drop-in-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}

.button-wrapper {
  @apply flex justify-between gap-8
}
</style>
