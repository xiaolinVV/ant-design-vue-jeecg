<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleOrderCancel"
    @ok="submitOrderCancel"
    cancelText="关闭">
    <a-form-item label="礼包名称"
                 :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
      <span>{{record.giftName}}</span>
    </a-form-item>
    <a-form-item label="礼包编号"
                 :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
      <span>{{record.giftNo}}</span>
    </a-form-item>
    <a-form-item label="分享人"
                 :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
      <span>{{record.shareName}}</span>
    </a-form-item>
  </a-modal>
</template>

<script>
  export default {
    name: 'MarketingGiftStrikeBalance',
    data(){
      return{
        visible:false,
        confirmLoading:false,
        record:{},
        title:"礼包冲账"
      }
    },
    methods:{
      showMarketingGiftStrikeBalanceModal(record){
        console.log(record);
        this.record=record;
        this.visible=true;
      },
      handleOrderCancel(){
        this.visible=false;
      }
    }

  }
</script>

<style scoped>

</style>