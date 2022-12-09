<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleOrderCancel"
    cancelText="关闭"
    :destroyOnClose=true>
    <a-form-item label="收款码："
                 :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <img :src="img"/>
    </a-form-item>
  </a-modal>
</template>

<script>
  import {getAction} from '@/api/manage';
  export default {
    name: 'StoreManageReceivingCode',
    data(){
      return{
        visible:false,
        confirmLoading:false,
        title:"店铺收款码",
        url: {
          getMoneyReceivingCode: '/storeManage/storeManage/getMoneyReceivingCode'
        },
        img:''
      }
    },
    methods:{
      showModal(record){
        console.log(record);
        this.visible=true;
        this.loadData(record);
      },
      loadData(record){
        getAction(this.url.getMoneyReceivingCode, {storeManageId: record.id}).then((res) => {

          if (res.success) {
            this.img=window._CONFIG['imgDomainURL']+"/"+res.result.address;
          } else {
            this.$message.warning(res.message);
          }
        });
      },
      handleOrderCancel(){
        this.visible=false;
      }
    }
  }
</script>

<style scoped>

</style>