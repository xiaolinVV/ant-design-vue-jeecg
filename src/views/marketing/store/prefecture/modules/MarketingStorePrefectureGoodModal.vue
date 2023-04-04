<template>
  <j-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :fullscreen="true"
    switchFullscreen
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-descriptions title="基本信息：" bordered>
        <a-descriptions-item label="归属店铺">{{storeInfo.title}}</a-descriptions-item>
        <a-descriptions-item label="专区名称">{{prefectureInfo.title}}</a-descriptions-item>
      </a-descriptions>
      <a-card title="选择商品：" style="margin-top: 30px;">
        <select-store-good :storeManageId="storeInfo.key" @change="getGoodList"></select-store-good>
      </a-card>
    </a-spin>
  </j-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import SelectStoreGood from'../../../common/SelectStoreGood/SelectStoreGood'

  export default {
    name: "MarketingStorePrefectureGoodModal",
    components:{
      SelectStoreGood
    },
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},

        confirmLoading: false,

        url: {
          add: "/marketing.store.prefecture/marketingStorePrefectureGood/add",
          edit: "/marketing.store.prefecture/marketingStorePrefectureGood/edit",
        },
        prefectureInfo:{},
        storeInfo:{},
        goodDataSource:[]
      }
    },
    created () {
    },
    methods: {
      getGoodList(e){
        console.log('选择的商品：',e);
        this.goodDataSource=e;
      },
      add (param,storeParam) {

        this.edit({},param,storeParam);
      },
      edit (record,param,storeParam) {
        this.model = Object.assign({}, record);
        this.prefectureInfo=param;
        this.storeInfo=storeParam;
        this.goodDataSource=[];
        console.log(this.prefectureInfo,this.storeInfo);
        this.visible = true;
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        if(this.goodDataSource.length==0){
          this.$message.warning('请选择需要添加的商品');
          return ;
        }
        const that = this;
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            let formData = Object.assign(this.model);
            //时间格式化
            formData.marketingStorePrefectureListId=this.prefectureInfo.key;
            formData.goodDataSource=JSON.stringify(this.goodDataSource);
            console.log(formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
      },
      handleCancel () {
        this.close()
      },


    }
  }
</script>

<style lang="less" scoped>

</style>