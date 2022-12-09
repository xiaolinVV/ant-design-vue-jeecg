<template>
  <a-modal
    title="直播流信息"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :footer="null"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="推流地址">
          {{ model.pushStreamAddress }}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="OBS推流地址">
          {{ model.obsStreamAddress }}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="OBS推流名称">
          {{ model.obsStreamName }}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="RTMP播放地址">
          {{ model.rtmpBroadcastAddress }}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="FLV播放地址">
          {{ model.flvBroadcastAddress }}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="HLS播放地址">
          {{ model.hlsBroadcastAddress }}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="UDP播放地址">
          {{ model.udpBroadcastAddress }}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="过期时间">
          {{ model.streamEndTime }}
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
export default {
  name: 'MarketingLiveStreamingInfoModal',
  data() {
    return {
      model: {},
      visible: false,
      confirmLoading: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
  },
  methods: {
    async open(record) {
      this.visible = true
      this.confirmLoading = true
      this.model = record
      await this.$nextTick()
      this.confirmLoading = false
    },
    handleCancel() {
      this.model = {}
      this.visible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.MarketingLiveStreamingInfoModal {
}
</style>
