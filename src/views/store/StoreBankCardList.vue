<!--银行卡设置页面-->
<template>
  <a-card :bordered="false" class="sth">
    <h3>银行卡</h3>
    <div class="operation">
      <div>
        <span>提现到银行卡</span>
        <span>
          {{ dataAll.bankCard && dataAll.bankCard.bankCard ? dataAll.bankCard.bankCard : '未绑定' }}
        </span>
      </div>

      <span>
        <a @click="showBankCard(dataAll.bankCard)">设置</a>
      </span>
    </div>
    <!-- <h3>支付宝</h3>
    <div class="operation">
      <div>
        <span>提现到支付宝</span>
        <span>
          {{ dataAll.alipay && dataAll.alipay.bankCard ? dataAll.alipay.bankCard : '未绑定' }}
        </span>
      </div>

      <span>
        <a @click="handleEdit2(dataAll.alipay)">设置</a>
      </span>
    </div> -->

    <!--    &lt;!&ndash; 表单区域 &ndash;&gt; @keep="keep"-->
    <storeBankCard-modal ref="modalForm"></storeBankCard-modal>
    <alipay-modal ref="modalForm2"></alipay-modal>
  </a-card>
</template>

<script>
import StoreBankCardModal from './modules/StoreBankCardModal'
import AlipayModal from './modules/AlipayModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction, putAction, postAction } from '@/api/manage'
import Vue from 'vue'
export default {
  name: 'StoreBankCardList',
  mixins: [JeecgListMixin],
  components: {
    StoreBankCardModal,
    AlipayModal
  },
  data() {
    return {
      dataAll: {
        bankCard: {}, //银行卡信息
        alipay: {} //支付宝信息
      },
      description: '店铺银行卡管理页面',
      // 表头
      columns: [
        {
          title: '开户行名称',
          align: 'center',
          dataIndex: 'bankName'
        },
        {
          title: '银行卡号',
          align: 'center',
          dataIndex: 'bankCard'
        },
        {
          title: '持卡人',
          align: 'center',
          dataIndex: 'cardholder'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/storeBankCard/storeBankCard/list',
        delete: '/storeBankCard/storeBankCard/delete',
        deleteBatch: '/storeBankCard/storeBankCard/deleteBatch',
        exportXlsUrl: 'storeBankCard/storeBankCard/exportXls',
        importExcelUrl: 'storeBankCard/storeBankCard/importExcel',
        findStoreBankCard: '/storeBankCard/storeBankCard/findStoreBankCard' //提现信息银行卡返显接口
      }
    }
  },
  headers: {},
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  created() {
    const token = Vue.ls.get('ACCESS_TOKEN')
    this.headers = { 'X-Access-Token': token }
    getAction(this.url.findStoreBankCard).then(res => {
      if (res.success && res.result) {
        this.dataAll = res.result
      }
    })
  },
  methods: {
    handleEdit2(record) {
      this.$refs.modalForm2.edit(record)
      this.$refs.modalForm2.disableSubmit = false
    },
    showBankCard(record) {
      this.$refs.modalForm.showBankCard(record)
      this.$refs.modalForm.bankCardSubmit = false
    }
  }
}
</script>
<style scoped lang="less">
.operation {
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding-bottom: 15px;
  border-bottom: 1px solid gray;
  margin-bottom: 15px;

  > div:nth-child(1) {
    display: flex;
    justify-content: space-between;
    width: 30%;
  }
}
</style>
