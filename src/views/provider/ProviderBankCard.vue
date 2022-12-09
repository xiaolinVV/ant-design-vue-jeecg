<!--银行卡设置页面-->
<template>
  <a-card :bordered="false" class="sth" >
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
    <ProviderBankCard-modal ref="modalForm"></ProviderBankCard-modal>
  </a-card>
</template>
<script>
  import {getAction, putAction, postAction} from '@/api/manage'
  import Vue from 'vue'
  import ProviderBankCardModal from './modules/ProviderBankCardModal'
  export default {
    name: "ProviderBankCard",
    components:{
      ProviderBankCardModal
    },
    data() {
      return {
        dataAll: {
          bankCard:{},//银行卡信息
          alipay:{}//支付宝信息
        },
        bankCardSubmit:true,
        description: '供应商银行卡管理页面',
        url: {
          returnBankCard:"/providerBankCard/providerBankCard/returnBankCard"//提现信息返显
        }
      }
    },
    headers: {},
    created() {
//      const token = Vue.ls.get("ACCESS_TOKEN");
//      this.headers = {"X-Access-Token": token};
      getAction(this.url.returnBankCard).then(res => {
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

    > div:nth-child(1) {
      display: flex;
      justify-content: space-between;
      width: 30%;
    }
  }
</style>