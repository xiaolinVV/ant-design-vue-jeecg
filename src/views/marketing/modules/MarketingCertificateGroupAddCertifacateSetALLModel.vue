<template>
  <a-modal
    title="批量设置"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <div class="wrap">
      <div class="line">
        <div class="label">
          活动折扣:
        </div>
        <div class="value">
          <a-input-number :min="0" :precision="2" v-model="allData.discountActivity" style="margin-right:5px">
          </a-input-number>

          %
        </div>
      </div>

      <div class="line">
        <div class="label">
          是否限购:
        </div>
        <div class="value">
          <a-select v-model="allData.isLimit" placeholder="请选择" @change="limitChange">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option :value="0">不限购</a-select-option>
            <a-select-option :value="1">限购</a-select-option>
          </a-select>
        </div>
      </div>

      <div class="line">
        <div class="label">
          限购件数:
        </div>
        <div class="value">
          <a-input-number :disabled="!allData.isLimit" :min="0" :precision="0" v-model="allData.limitCount">
          </a-input-number>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: 'MarketingCertificateGroupAddCertifacateSetALLModel',
  data() {
    return {
      visible: false,
      confirmLoading: false,
      allData: {
        discountActivity: '0',
        isLimit: 0,
        limitCount: ''
      }
    }
  },

  methods: {
    limitChange(e) {
      if (e == 0) {
        this.allData.limitCount = ''
      }
    },
    handleOk() {
      let allData = {
        ...this.allData
      }
      this.$emit('handleOK', allData)
      this.handleCancel()
    },
    handleCancel() {
      this.visible = false
    },
    open() {
      this.visible = true
    }
  }
}
</script>

<style lang="less">
.wrap {
  width: 100%;
  .line {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 10px;
    width: 100%;
    height: 50px;
    .label {
      margin-left: 30px;
      margin-right: 30px;
    }
    .value {
      display: flex;
      align-items: center;
      > div {
        width: 100px;
        text-align: center;
      }
      // > input {
      //   width: 100px;
      // }
    }
  }
}
</style>
