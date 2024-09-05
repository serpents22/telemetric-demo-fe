import { defineStore } from 'pinia'
import telemetryAPI from '@/services/telemetry/telemetry-api'
import { ref } from 'vue'
import moment from 'moment'
import { createStatusDeviceEventSource, createDeviceDetailsEventSource } from '@/services/sse'

function rssiToDbm(rssi) {
  const minDbm = -100;
  const maxDbm = 0;
  const minRssi = 0;
  const maxRssi = 255;

  // Linear mapping from RSSI to dBm
  return minDbm + (rssi - minRssi) * (maxDbm - minDbm) / (maxRssi - minRssi);
}
function formatUptime(uptimeInSeconds) {
  const days = Math.floor(uptimeInSeconds / (3600 * 24));
  const hours = Math.floor((uptimeInSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((uptimeInSeconds % 3600) / 60);

  let formattedString = '';
  if (days > 0) {
    formattedString += days + ' day' + (days > 1 ? 's ' : ' ');
  }
  if (hours > 0) {
    formattedString += hours + ' hour' + (hours > 1 ? 's ' : ' ');
  }
  if (minutes > 0 || formattedString === '') {
    formattedString += minutes + ' min' + (minutes > 1 ? 's ' : ' ');
  }

  return formattedString.trim();
}


function convertToArray(data) {
  let result = [];

  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      result.push({
        timestamp: data[key]._time,
        tag: key,
        value: data[key]._value
      });
    }
  }
  return result;
}

export const useTelemetryStore = defineStore('Telemetry', {
  state: () => ({
    isNoDevices: ref(false),
    lastUpdated: ref(),
    isThereOfflineDevice: ref(false),
    offlineDevices: ref(),
    totalDevices: ref(),
    totalGateways: ref(),
    totalNodes: ref(),
    totalOnline: ref(),
    onlineGateways: ref(),
    onlineNodes: ref(),
    totalOffline: ref(),
    offlineGateways: ref(),
    offlineNodes: ref(),
    devicesData: ref([]),
    nodesData: ref([]),
    telemetryData: ref([]),
    getTelemetryDetailStatus: ref({
      isError: null,
      message: null,
      code: null,
    }),
    getTelemetryDetailLoading: ref(false),
    eventSource: null,
    telemetryDetailEventSource: null,
    eventData: ref(),
    detailEventData: ref(),
    statusDeviceDetail: ref({}),
    deviceDataLogs: ref('')
  }),
  actions: {
    async getTelemetryDetail(serialNumber) {
      this.getTelemetryDetailLoading = true
      try {
        const res = await telemetryAPI.getTelemetryDetail(serialNumber)
        this.statusDeviceDetail = res.data.statusDevice
        this.statusDeviceDetail._time = new Date(this.statusDeviceDetail._time).toLocaleString()
        this.statusDeviceDetail.humidity = this.statusDeviceDetail.humidity.toFixed(1)
        this.statusDeviceDetail.temperature = this.statusDeviceDetail.temperature.toFixed(1)
        this.statusDeviceDetail.uptime = formatUptime(this.statusDeviceDetail.uptime)
        this.statusDeviceDetail.rssi = Math.floor(rssiToDbm(this.statusDeviceDetail.rssi))

        this.deviceDataLogs = convertToArray(res.data.telemetry)
        this.deviceDataLogs.map((data) => {
          data.timestamp = new Date(data.timestamp).toLocaleString()
        })
        console.log(this.deviceDataLogs)
        this.getTelemetryDetailLoading = false
        this.getTelemetryDetailStatus.code = res.status
        this.getTelemetryDetailStatus.message = 'Data Fetched'
        this.getTelemetryDetailStatus.isError = false
      } catch (err) {
        console.error(err)
        this.getTelemetryDetailLoading = false
        this.getTelemetryDetailStatus.code = err.response.data.status
        this.getTelemetryDetailStatus.message = JSON.stringify(err.response.data.data)
        this.getTelemetryDetailStatus.isError = true
        return err
      }
    },
    listenTelemetryDetail(serialNumber) {
      this.getTelemetryDetailLoading = true
      this.telemetryDetailEventSource = createDeviceDetailsEventSource(serialNumber)
      this.telemetryDetailEventSource.onmessage = (event) => {
        this.detailEventData = JSON.parse(event.data).data.telemetry
        console.log(this.detailEventData)
        this.statusDeviceDetail = this.detailEventData.statusDevice
        this.statusDeviceDetail._time = new Date(this.statusDeviceDetail._time).toLocaleString()
        this.statusDeviceDetail.humidity = this.statusDeviceDetail.humidity.toFixed(1)
        this.statusDeviceDetail.temperature = this.statusDeviceDetail.temperature.toFixed(1)
        this.statusDeviceDetail.uptime = formatUptime(this.statusDeviceDetail.uptime)
        this.statusDeviceDetail.rssi = Math.floor(rssiToDbm(this.statusDeviceDetail.rssi))
        this.deviceDataLogs = convertToArray(this.detailEventData.telemetry)
        this.deviceDataLogs.map((data) => {
          data.timestamp = new Date(data.timestamp).toLocaleString()
        })
      }
    },
    stopListenTelemetryDetail() {
      if (this.telemetryDetailEventSource) {
        this.telemetryDetailEventSource.close()
        this.telemetryDetailEventSource = null
      }
    },
    startListening() {
      this.eventSource = createStatusDeviceEventSource()
      this.eventSource.onmessage = (event) => {
        this.eventData = JSON.parse(event.data).data
        console.log(this.eventData)
        this.devicesData = this.eventData.devices
        this.devicesData.map((data) => {
          data.telemetry.engineStatus =  data.telemetry.engineStatus == '0' ? 'M' : 'A'
          data.telemetry.lastHeard = moment(data.telemetry.lastHeard).format('MM/DD/YYYY , HH:mm')
          data.telemetry.gsmModel = data.telemetry.gsm.split(',')[0]
          data.telemetry.gsmMcc = data.telemetry.gsm.split(',')[1]
          data.telemetry.gsmMnc = data.telemetry.gsm.split(',')[2]
          data.telemetry.gsmRssi = data.telemetry.gsm.split(',')[3]
          // data._time = new Date(data._time).toLocaleString()
          // data.lastHeard = formatUptime(Math.floor((new Date() - new Date(data._time)) / 1000))
          // data.humidity = data.humidity.toFixed(1)
          // data.temperature = data.temperature.toFixed(1)
          // data.uptime = formatUptime(data.uptime)
          // data.rssi = Math.floor(rssiToDbm(data.rssi))
        })
      }
      this.eventSource.onerror = (err) => {
        console.error('EventSource failed:', err)
        this.stopListening(); // Stop listening on error
      }
    },
    stopListening() {
      if (this.eventSource) {
        this.eventSource.close()
        this.eventSource = null
      }
    },
  }
})