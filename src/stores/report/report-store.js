

import { defineStore } from 'pinia'
import reportApi from '@/services/report/report-api'
import { ref } from 'vue'
import moment from 'moment'

export const useReportStore = defineStore('report', {
  state: () => ({
    reportIsEmpty: ref(false),
    reportData: ref([]),
    reportIsLoading: ref(false),
    reportStatus: ref({
      message: null,
      code: null,
      isError: false,
    }),
  }),
  actions: {
    async getReport(params) {
      this.reportIsLoading = true
      try {
        const res = await reportApi.getReport(params)
        console.log(res)
        if (res.data.report.length === 0) {
          this.reportIsEmpty = true
        } else {
          this.reportIsEmpty = false
        }
        this.reportData = res.data.report
        this.reportData.map((item) => {
          item.time = moment(item.time).format("YYYY-MM-DD HH:mm")
        })
        this.reportIsLoading = false
        this.reportStatus.message = 'Data Fetched'
        this.reportStatus.isError = false
      } catch (err) {
        console.error(err)
        this.reportStatus.message = err.response.data.error
        this.reportStatus.isError = true
        this.reportIsLoading = false
        return err
      }
    },
    async downloadreport(params) {
      this.reportIsLoading = true
      try {
        const res = await reportApi.downloadreport(params)
        window.open(res.request.responseURL)
        this.reportIsLoading = false
      } catch (err) {
        console.error(err)
        this.reportIsLoading = false
        return err
      }
    },
  }
})