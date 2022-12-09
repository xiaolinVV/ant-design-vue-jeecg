<template>
  <a-card :bordered="false">
    <h3>银行卡</h3>
    <div class="operation">
      <div>
        <span>提现到银行卡</span>
        <span>
          {{dataAll.bankCard && dataAll.bankCard.bankCard ? dataAll.bankCard.bankCard : '未绑定'}}
        </span>
      </div>
      <span>
      <a @click="showBankCard(dataAll.bankCard)">设置</a>
    </span>
    </div>
    <!--<h3>支付宝</h3>
    <div class="operation">
    <div>
      <span>提现到支付宝</span>
      <span>
          {{dataAll.alipay && dataAll.alipay.bankCard ? dataAll.alipay.bankCard : '未绑定'}}
        </span>
    </div>
    <span>
      <a @click="showAlipay(dataAll.alipay)">设置</a>
    </span>
    </div>-->
    <!-- 表单区域 -->
    <agencyBankCard-modal ref="modalForm" @ok="modalFormOk"></agencyBankCard-modal>
  </a-card>
</template>

<script>
  import AgencyBankCardModal from './modules/AgencyBankCardModal'
  import Vue from 'vue'
  import {getAction, putAction, postAction} from '@/api/manage'
  export default {
    name: "AgencyBankCardList",
    components: {
      AgencyBankCardModal
    },
    data () {
      return {

        dataAll: {
          bankCard: {},//银行卡信息
          alipay: {}//支付宝信息
        },
        description: '代理银行卡管理页面',
        bankCardSubmit: true,
        url: {
          findAgencyBankCard: "/agencyBankCard/agencyBankCard/findAgencyBankCard"//返显
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    headers: {},
    created() {
//      const token = Vue.ls.get("ACCESS_TOKEN");
//      this.headers = {"X-Access-Token": token};
      getAction(this.url.findAgencyBankCard).then(res => {
        if ( res) {
          this.dataAll = res ;
        }
      })
    },
    methods: {
      showBankCard(record){
        this.$refs.modalForm.showBankCard(record);
        this.$refs.modalForm.bankCardSubmit = false;
      },
      showAlipay(record){
        this.$refs.modalForm.showAlipay(record);
        this.$refs.modalForm.alipaySubmit = false;
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

    >
    div:nth-child(1) {
      display: flex;
      justify-content: space-between;
      width: 30%;
    }

  }
</style>