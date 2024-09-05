<script setup>
import SearchBar from '@/components/input/SearchBar.vue'
import { useReportStore } from '@/stores/report/report-store';
import { storeToRefs } from 'pinia';
import { onMounted, ref, computed, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ApexCharts from "apexcharts";

const { t } = useI18n()

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time))
const props = defineProps(['id'])


//variables

//date filter init
let MINIMUM_DIGIT = 2
let date = new Date()
let firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
let tmpFirstYear = String(firstDay.getFullYear())
let tmpFirstMonth = String((firstDay.getMonth() + 1))
let tmpFirstDay = String(firstDay.getDate())

tmpFirstDay = tmpFirstDay.padStart(MINIMUM_DIGIT, "0")
tmpFirstMonth = tmpFirstMonth.padStart(MINIMUM_DIGIT, "0")

const startDate = ref(String(tmpFirstYear + '-' + tmpFirstMonth + '-' + tmpFirstDay))

let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
let tmpLastYear = String(lastDay.getFullYear())
let tmpLastMonth = String((lastDay.getMonth() + 1))
let tmpLastDay = String(lastDay.getDate())

tmpLastDay = tmpLastDay.padStart(MINIMUM_DIGIT, "0")
tmpLastMonth = tmpLastMonth.padStart(MINIMUM_DIGIT, "0")

const endDate = ref(String(tmpLastYear + '-' + tmpLastMonth + '-' + tmpLastDay))
const fileName = ref(String(startDate.value + '_' + endDate.value) + '_Report.csv')

//change date format to ISOString
const start = computed(() => {
  let tmpStart = startDate.value.split('-')
  let tmpYear = tmpStart[0]
  let tmpMonth = tmpStart[1]
  let tmpDay = tmpStart[2]
  console.log(tmpStart)
  return new Date(tmpYear, tmpMonth - 1, tmpDay, '00', '00', '00').toISOString()
  // return new Date(Date.UTC(tmpYear, tmpMonth-1, tmpDay, '00', '00', '00')).toISOString()
})
const end = computed(() => {
  let tmpEnd = endDate.value.split('-')
  let tmpYear = tmpEnd[0]
  let tmpMonth = tmpEnd[1]
  let tmpDay = tmpEnd[2]
  console.log(tmpEnd)
  return new Date(tmpYear, tmpMonth - 1, tmpDay, '24', '00', '00').toISOString()
  // return new Date(Date.UTC(tmpYear, tmpMonth-1, tmpDay, '24', '00', '00')).toISOString()
})

//stores
const reportStore = useReportStore()
const { reportIsEmpty, reportStatus, reportIsLoading, reportData } = storeToRefs(useReportStore())

const modalActive = ref(false)
const searchValue = ref()

const closeNotification = () => {
  modalActive.value = false
}

const reportParams = ref({
  code: null,
  start: start,
  end: end
})
//get data
async function fetchReport() {
  reportParams.value.code = props.id
  reportParams.value.start = start
  reportParams.value.end = end
  fileName.value = String(startDate.value + '_' + endDate.value) + '_Report.csv'
  await reportStore.getReport(reportParams.value)
  reportData.value.sort((a, b) => {
    let da = new Date(a.time),
      db = new Date(b.time);
    return da - db
  })
  console.log('report-data', reportData.value)
  //chart data
  if (chart) {
    let chartData = []
    reportData.value.map((data) => {
      let obj = {
        date: Math.floor(new Date(data.time).getTime()),
        tcmax: data.tcmax,
      }
      chartData.push(obj)
    })
    options.series = []
    options.series.push({
      name: 'Water pH',
      data: chartData.map(obj => [obj.date, obj.tcmax])
    })

    chart.updateSeries(options.series)
    console.log('chart-data', chartData)
  } else {
    console.error('Chart instance is not available.')
    return
  }
}



onMounted(async () => {
  fetchReport()
  console.log(options.series)
  const chartElement = document.querySelector("#chart");
  if (chartElement) {
    chart = new ApexCharts(chartElement, options)
    chart.render()
  }
})

onUnmounted(() => {
  if (chart) {
    chart.destroy()
    chart = null
    console.log('chart destroyed', chart)
  }
})

const header = [
  { text: 'Date', value: "time", sortable: true, width: 200 },
  { text: 'Name', value: "name", sortable: true, },
  { text: 'Water pH', value: "tcmax", sortable: true, },
]

let chart

var options = {
  chart: {
    type: "area",
    height: 300,
    foreColor: "#999",
    stacked: false,
    dropShadow: {
      enabled: true,
      enabledSeries: [0],
      top: -2,
      left: 2,
      blur: 5,
      opacity: 0.06
    }
  },
  stroke: {
    curve: "smooth",
    width: 3
  },
  dataLabels: {
    enabled: false
  },
  series: [],
  markers: {
    size: 0,
    strokeColor: "#fff",
    strokeWidth: 3,
    strokeOpacity: 1,
    fillOpacity: 1,
    hover: {
      size: 6
    }
  },
  xaxis: {
    type: "datetime",
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {

    title: {
      text: 'Water pH (pH)'  // Y-axis label with units
    },
    labels: {
      offsetX: 14,
      offsetY: -5
    },
  },
  grid: {
    padding: {
      left: -5,
      right: 5
    }
  },
  tooltip: {
    x: {
      formatter: function (val) {
        return new Date(val).toLocaleString(); // Formats the tooltip with date and time
      }
    }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left'
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: 0.5,
      opacityTo: 0,
      stops: [0, 90, 100]
    }
  }
}





</script>

<template>
    <div class="flex flex-col">
      <div
        class="flex-1 py-8 bg-bkg-primary rounded-[10px] flex-col gap-5 flex">
        <alert :message="reportStatus.message" :modalActive="modalActive" :isError="reportStatus.isError"
          @close="closeNotification" />
        <div class="mx-8 grid grid-row gap-4 md:gap-6">
          <p class="text-md font-medium">Device Code <span
              class="ml-2 text-sm font-semibold px-4 py-2 rounded-full bg-accent-1 text-white">{{ props.id }}</span></p>
          <div class="flex flex-col md:flex-row gap-4 md:justify-between">
            <div class="date-filter">
              <div class="flex flex-col gap-1">
                <label class="text-xs font-semibold text-accent-1">Start Date</label>
                <input type="date" class="date-picker" @change="fetchReport()" v-model="startDate" />
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-xs font-semibold text-accent-1">End Date</label>
                <input type="date" class="date-picker" @change="fetchReport()" v-model="endDate" />
              </div>
            </div>
            <div class="flex items-end">
              <SearchBar v-model="searchValue" />
            </div>
            <download-csv class="btn btn-default items-end flex w-[200px]" :data="reportData" :name="fileName">
              <div class="w-full">
                <BasicButton type="submit" class="primary" label="Export CSV" @click="newModalToggle()" />
              </div>
            </download-csv>
          </div>
        </div>
        <EasyDataTable :rows-per-page="10" table-class-name="customize-table"
          :headers="header" :items="reportData" theme-color="#1363df" :search-value="searchValue"
          :loading="reportIsLoading" header-text-direction="center" body-text-direction="center">
        </EasyDataTable>
        <div class="flex flex-col gap-4 pt-2">
          <div class="bg-bkg-secondary px-3 py-2 lg:px-10 lg:py-6">
            <p class="text-md font-medium text-accent-1">Chart</p>
          </div>
          <div id="chart" class="mx-3 my-2 lg:mx-10 lg:my-8 "></div>
        </div>
      </div>
    </div>
</template>

<style scoped>
p {
  @apply select-none
}

.date-filter {
  @apply relative lg:items-center flex flex-col lg:flex-row gap-4 lg:gap-6 w-full
}

::-webkit-calendar-picker-indicator {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 24 24"><path fill="%23bbbbbb" d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/></svg>');
}

.date-picker {
  @apply outline-none border border-bkg-tertiary rounded-lg px-4 py-2 bg-bkg-secondary hover:bg-bkg-tertiary text-[10px] lg:text-xs font-medium lg:min-w-[200px]
}


.customize-table {
  --easy-table-header-font-size: 10px;
  --easy-table-row-border: 0.2px solid #D2DDEE;
  --easy-table-header-height: 30px;

  --easy-table-body-row-font-size: 10px;
  --easy-table-body-row-height: 20px;

  --easy-table-footer-font-size: 8px;
  --easy-table-footer-height: 30px;
  --easy-table-footer-background-color: #F5F8FA;
  --easy-table-footer-font-color: #3A3A3E;

}

@media only screen and (min-width: 1536px) {
  .customize-table {
    --easy-table-header-font-size: 13px;
    --easy-table-header-height: 40px;
    --easy-table-row-border: 1px solid #D2DDEE;

    --easy-table-body-row-font-size: 13px;
    --easy-table-body-row-height: 40px;

    --easy-table-footer-font-size: 14px;
    --easy-table-footer-height: 50px;
    --easy-table-footer-background-color: #F5F8FA;
    --easy-table-footer-font-color: #3A3A3E;

  }
}
</style>
