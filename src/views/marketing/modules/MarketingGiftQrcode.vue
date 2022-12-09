<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleOrderCancel"
    @ok="submitOrderCancel"
    cancelText="关闭">
    <a-form-item label="手机号："
                 :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
      <a-input v-model="phone"/>
      <a-button type="primary" @click="getAddress" >
        查询
      </a-button>
    </a-form-item>
    <a-form-item label="分享码："
                 :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
      <img :src="address">
    </a-form-item>
  </a-modal>
</template>

<script>
  import {getAction} from '@/api/manage';
  export default {
    name: 'MarketingGiftQrcode',
    data(){
      return{
        visible:false,
        confirmLoading:false,
        title:"礼包二维码",
        url:{
          getShareAddress:"/marketingGiftBag/marketingGiftBag/getShareAddress"
        },
        address:"",
        phone:"",
        marketingGiftBagId:""
      }
    },
    methods:{
      showMarketingGiftQrcodeModal(record){
        console.log(record);
        this.visible=true;
        this.marketingGiftBagId=record.id;
        this.address="";
        this.phone="";
      },
      getAddress(){
        getAction(this.url.getShareAddress, {marketingGiftBagId: this.marketingGiftBagId,phone:this.phone}).then((res) => {
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