<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :footer="null"
  >
    <a-spin :spinning="confirmLoading">
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="marketingCertificateId"
        :columns="columns"
        :dataSource="dataSource"
      >
      </a-table>
    </a-spin>
  </a-modal>
</template>
<script>
import { getAction } from '@/api/manage'
export default {
  name: 'MarketingCertificateSeckillListLookCouponModal',
  data() {
    return {
      title: '查看券号',
      visible: false,
      model: {},
      confirmLoading: false,
      dataSource: [],
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '券号',
          align: 'center',
          dataIndex: 'qqzixuangu'
        },
        {
          title: '券id',
          align: 'center',
          dataIndex: 'marketingCertificateId'
        },
        {
          title: '券名称',
          align: 'center',
          dataIndex: 'name'
        }
      ],
      url: {
        //查看券号
        lookQqzixuanguByPayId:
          'marketingCertificateSeckillRecord/marketingCertificateSeckillRecord/lookQqzixuanguByPayId'
      }
    }
  },
  methods: {
    async show(record = {}) {
      this.visible = true
      this.confirmLoading = true
      this.model = record
      console.log(record)
      await this.$nextTick()
      getAction(this.url.lookQqzixuanguByPayId, { payId: record.payCertificateLogId || '' }).then(res => {
        this.confirmLoading = false
        if (res.success) {
          this.dataSource = res.result
        } else {
          this.$message.warn(res.message)
        }
      })
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>
