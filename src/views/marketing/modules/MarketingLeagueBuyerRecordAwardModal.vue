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
    <div>奖励小计：{{record.awardTotal}}</div>
    <a-table style="margin-top: 10px" :loading="loading"  :columns="columns" :data-source="data" :pagination="false">

    </a-table>
  </a-modal>
</template>

<script>
  import {getAction} from '@/api/manage';
  export default {
    name: 'MarketingLeagueBuyerRecordAwardModal',
    data(){
      return{
        visible:false,
        confirmLoading:false,
        title:"奖励明细",
        record:{},
        loading:false,
        url: {
          getMarketingLeagueAwardListById: '/marketing/marketingLeagueBuyerRecord/getMarketingLeagueAwardListById'
        },
        columns : [
          {
            dataIndex: '账号',
            key: 'phone'
          },
          {
            title: '昵称',
            dataIndex: 'nickName',
            key: 'nickName',
          },
          {
            title: '身份',
            dataIndex: 'identityName',
            key: 'identityName',
          },
          {
            title: '奖励类型',
            key: 'rewardType',
            dataIndex: 'rewardType',
            customRender:function(text) {
              //奖励类型；0：复购直推奖励；1：复购间推奖励；2：直推奖励；3：店长奖励；4：店长管理奖励；5：店长扶植奖励;6:超级合伙人奖励
              if(text==0){
                return "复购直推奖励";
              }
              if(text==1){
                return "复购间推奖励";
              }
              if(text==2){
                return "直推奖励";
              }
              if(text==3){
                return "店长奖励";
              }
              if(text==4){
                return "店长管理奖励";
              }
              if(text==5){
                return "店长扶植奖励";
              }
              if(text==6){
                return "超级合伙人奖励";
              }
              if(text==7){
                return "城市服务商奖励";
              }
            }
          },
          {
            title: '奖励金额',
            key: 'award',
            dataIndex: 'award'
          },
        ],
        data : []
      }
    },
    methods:{
      showModal(record){
        console.log(record);
        this.record=record;
        this.visible=true;
        this.loading=true;
        this.data =[];
        getAction(this.url.getMarketingLeagueAwardListById, {marketingLeagueBuyerRecordId: record.id}).then((res) => {

          if (res.success) {
            this.data=res.result;
            this.loading=false;
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