<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="close"
    :footer="null"
  >
    <div class="center">
      <div class="centerline">
        <div class="centerleft">买家账号</div>
        <div>{{ record.phone }}</div>
      </div>
      <div class="centerline">
        <div class="centerleft">买家昵称</div>
        <div>{{ record.nickName }}</div>
      </div>
      <div class="centerline" v-if="record.prizeType == 0">
        <div class="centerleft">联系电话</div>
        <div>{{ record.contactNumber }}</div>
      </div>
      <div class="centerline" v-if="record.prizeType == 0">
        <div class="centerleft">收货人</div>
        <div>{{ record.consignee }}</div>
      </div>
      <div class="centerline" v-if="record.prizeType == 0">
        <div class="centerleft">收货地址</div>
        <div>{{ record.shippingAddress }}</div>
      </div>
      <div class="centerline" v-if="record.prizeType == 1">
        <div class="centerleft">券号</div>
        <div>{{ record.qqzixuangu }}</div>
      </div>
      <div class="centerline" v-if="record.prizeType == 1">
        <div class="centerleft">券名称</div>
        <div>{{ record.DiscountName }}</div>
      </div>
    </div>
  </a-modal>
</template>
<script>
import { getAction } from '@/api/manage'
export default {
  name: 'MarketingZoneGroupOrderListDetail',
  data() {
    return {
      title: '领取信息',
      visible: false,

      record: {}
    }
  },
  methods: {
    close() {
      this.$emit('close')
      this.visible = false
    },
    async show(record) {
      this.visible = true
      this.confirmLoading = true
      this.record = record
      console.log(this.record, 'record')
      await this.$nextTick()
    }
  }
}
</script>
<style lang="scss">
.center {
  background-color: #f2f2f2;
  padding: 20px;
  margin-bottom: 20px;
  .title {
    font-weight: bold;
  }

  .centerline {
    display: flex;
    margin-top: 20px;
  }
  .centerleft {
    margin-right: 30px;
    width: 100px;
  }
}
</style>
