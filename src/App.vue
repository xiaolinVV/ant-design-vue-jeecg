<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>
<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
  import enquireScreen from '@/utils/device'

  export default {
    data () {
      return {
        locale: zhCN,
      }
    },
    created () {
      let that = this
      enquireScreen(deviceType => {
        // tablet
        if (deviceType === 0) {
          that.$store.commit('TOGGLE_DEVICE', 'mobile')
          that.$store.dispatch('setSidebar', false)
        }
        // mobile
        else if (deviceType === 1) {
          that.$store.commit('TOGGLE_DEVICE', 'mobile')
          that.$store.dispatch('setSidebar', false)
        }
        else {
          that.$store.commit('TOGGLE_DEVICE', 'desktop')
          that.$store.dispatch('setSidebar', true)
        }

      })
    }
  }
</script>
<style lang='less'>
.ant-calendar-picker-input {
  min-width: 205px;
}
.clickShowImage {
  width: 32px;
  height: 32px;
  display: block;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  margin: 0 auto;
}
#app {
  height: 100%;
}
.ant-modal-content {
  margin: 0 auto;
}

.ant-table-bordered .ant-table-thead > tr > th,
.ant-table-bordered .ant-table-tbody > tr > td,
.ant-table-tbody > tr > td {
  word-break: break-all;
}

.table-operator {
  margin-bottom: 10px;

  button {
    margin-right: 8px;
  }
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input[type='number'] {
  -moz-appearance: textfield !important;
}

.dataCheckedStar {
  color: red;
  font-family: SimSun;
  line-height: 1;
  font-size: 14px;
  display: inline-block;
  margin-right: 4px;
}
.ant-input-number-handler-wrap {
  display: none;
}
</style>