<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleOrderCancel"
    @ok="submitOrderCancel"
    cancelText="关闭"
    :destroyOnClose=true>
    <a-form-item label="修改销售渠道："
                 :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
      <a-select showSearch :options="options" style="width: 100%" :filterOption="filterOption" v-model="storeManageId"></a-select>
    </a-form-item>
  </a-modal>
</template>

<script>
  import {getAction} from '@/api/manage';
  export default {
    name: 'MarketingGiftBagRecordChannelModel',
    data(){
      return{
        visible:false,
        confirmLoading:false,
        title:"销售渠道",
        options:[],
        storeManageId:'',
        id:'',
        url:{
          getAllStoreList:"storeManage/storeManage/getAllStoreList",
          getBySysUserId:"storeManage/storeManage/getBySysUserId",
          updateDistributionChannel:"marketingGiftBagRecord/marketingGiftBagRecord/updateDistributionChannel"
        }
      }
    },
    methods:{
      getBySysUserId(sysUserId){
        getAction(this.url.getBySysUserId, {
          sysUserId:sysUserId
        }).then((res) => {

          if (res.success) {
            console.log(res.result);
            this.storeManageId=res.result.id;
          } else {
            this.$message.warning(res.message);
          }
        });
      },
      getAllStoreList(){
        getAction(this.url.getAllStoreList, {}).then((res) => {

          if (res.success) {
            console.log(res.result);
            this.options=[];
            for (let r of res.result) {
              this.options.push({
                value:r.id,
                label:r.storeName+"("+r.bossPhone+")"
              });
            }
          } else {
            this.$message.warning(res.message);
          }
        });
      },
      filterOption(inputValue, option){
        return option.componentOptions.children[0].text.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
      },
      showModal(record){
        this.id=record.id;
        if(record.distributionChannel){
          this.getBySysUserId(record.distributionChannel);
        }else{
          this.storeManageId='';
        }

        if(this.options.length==0){
          this.getAllStoreList();
        }
        console.log(record);
        this.visible=true;
      },
      handleOrderCancel(){
        this.visible=false;
      },
      submitOrderCancel(){
        if(!this.storeManageId){
          this.$message.warning("请先选择销售渠道");
          return;
        }
        getAction(this.url.updateDistributionChannel, {
          id:this.id,
          storeManageId:this.storeManageId
        }).then((res) => {

          if (res.success) {
            this.visible=false;
            this.$emit("ok");
          } else {
            this.$message.warning(res.message);
          }
        });

      }
    }
  }
</script>

<style scoped>

</style>