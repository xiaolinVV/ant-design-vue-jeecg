<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleOrderCancel"
    @ok="submitOrderCancel"
    cancelText="关闭">
    <a-form-item label="分享码："
                 :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
      <img :src="address">
    </a-form-item>
  </a-modal>
</template>

<script>
  import {getAction} from '@/api/manage';
  export default {
    name: 'MarketingGiftRecordQrcode',
    data(){
      return{
        visible:false,
        confirmLoading:false,
        title:"礼包二维码",
        url:{
          getShareAddress:"/marketingGiftBagRecord/marketingGiftBagRecord/getShareAddress"
        },
        address:""
      }
    },
    methods:{
      showMarketingGiftRecordQrcodeModal(record){
        console.log(record);
        this.visible=true;
        let marketingGiftBagId=record.marketingGiftBagId;
        let memberListId=record.memberListId;
        getAction(this.url.getShareAddress, {marketingGiftBagId: marketingGiftBagId,memberListId:memberListId}).then((res) => {
          if (res.success) {
            this.address=window._CONFIG['imgDomainURL']+"/"+res.message;
            console.log(this.address);
          } else {
            this.$message.warning(res.message);
          }
        });
      },
      handleOrderCancel(){
        this.visible=false;
      },
      submitOrderCancel(){
        this.visible=false;
      }
    }
  }
</script>

<style scoped>

</style>