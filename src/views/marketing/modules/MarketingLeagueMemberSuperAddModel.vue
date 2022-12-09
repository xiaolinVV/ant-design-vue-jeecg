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
      <div v-if="!record">
      <a-form-item label="会员编号"
                   :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input @change="getMember" v-model="resultData.mid" v-decorator="['mid', { rules: [{ required: true, message: '请输入会员编号' }] }]"></a-input>
      </a-form-item>
      <a-form-item label="会员手机号"
                   :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <span v-if="!resultData.phone">请先输入会员编号</span>
        <span v-else>{{resultData.phone}}</span>
      </a-form-item>
        <a-form-item label="会员昵称"
                     :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <span v-if="!resultData.nickName">请先输入会员编号</span>
          <span v-else>{{resultData.nickName}}</span>
        </a-form-item>
      </div>
      <div v-if="record">
        <a-form-item label="会员编号"
                     :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <span v-if="!resultData.mid">请先输入会员编号</span>
          <span v-else>{{resultData.mid}}</span>
        </a-form-item>
        <a-form-item label="会员手机号"
                     :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <span v-if="!resultData.phone">请先输入会员编号</span>
          <span v-else>{{resultData.phone}}</span>
        </a-form-item>
        <a-form-item label="会员昵称"
                     :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <span v-if="!resultData.nickName">请先输入会员编号</span>
          <span v-else>{{resultData.nickName}}</span>
        </a-form-item>
      </div>
      <a-form-item label="超级合伙人奖励比例"
                   :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input-number style="width: 95%" v-model="resultData.rewardRatio" v-decorator="['mid', { rules: [{ required: true, message: '请输入超级合伙人奖励比例' }] }]"></a-input-number>%
      </a-form-item>
    </a-modal>

</template>

<script>
  import {getAction} from '@/api/manage';
  export default {
    name: 'marketingLeagueMemberSuperAddModel',
    data(){
      return{
        visible:false,
        confirmLoading:false,
        title:"添加",
        record:{},
        resultData:{
          mid:"",
          phone:"",
          nickName:"",
          rewardRatio:""
        },
        url: {
          queryById : '/memberList/memberList/queryById',
          settingSupper:'/marketing/marketingLeagueMember/settingSupper'
        },
        type:'0'
      }
    },
    methods:{
      showModal(record){
        console.log(record);
        this.record=record;
        this.visible=true;
        if(!record) {
          this.resultData = {
            mid: "",
            phone: "",
            nickName: "",
            rewardRatio: ""
          }
        }else{
          this.resultData.mid=record.mid;
          this.resultData.phone=record.phone;
          this.resultData.nickName=record.nickName;
          this.resultData.rewardRatio=record.rewardRatio;
          this.type='1';
        }
      },
      handleOrderCancel(){
        this.visible=false;
      },
      submitOrderCancel(){
        this.confirmLoading=true;

        if(!this.resultData.mid){
          this.$message.warn("会员id不能为空");
          this.confirmLoading=false;
          return;
        }

        if(!this.resultData.phone){
          this.$message.warn("会员手机号不能为空");
          this.confirmLoading=false;
          return;
        }

        if(!this.resultData.rewardRatio){
          this.$message.warn("会员奖励比例不能为空");
          this.confirmLoading=false;
          return;
        }

        getAction(this.url.settingSupper, {mid:this.resultData.mid,rewardRatio:this.resultData.rewardRatio,type:this.type}).then((res) => {

          if (res.success) {
            this.$emit('ok');
            this.$message.success(res.message);
          } else {
            this.$message.warning(res.message);
          }
        });

       this.confirmLoading=false;
        this.visible=false;
      },
      getMember(){
        if(this.resultData.mid){
          getAction(this.url.queryById, {id: this.resultData.mid}).then((res) => {

            if (res.success) {
              this.resultData.phone=res.result.phone;
              this.resultData.nickName=res.result.nickName;
            } else {
              that.$message.warning(res.message);
            }
          });
        }
      }
    }
  }
</script>

<style scoped>

</style>