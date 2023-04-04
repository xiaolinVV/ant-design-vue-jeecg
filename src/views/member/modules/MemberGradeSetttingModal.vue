<template>
  <a-modal
    :confirmLoading="confirmLoading"
    :title="title"
    :visible="visible"
    :width="800"
    @cancel="handleCancel"
    @ok="handleOk"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="请选择会员等级">
          <a-select v-model="model.memberGradeId">
            <a-select-option :value="item.id" v-for="(item,index) in memberGradeList" :key="index">{{item.gradeName}}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { getAction } from '@/api/manage'
  import KqUpload from '@/components/kq/KqUpload/KqUpload'

  export default {
    name: 'MemberGradeSetttingModal',
    components:{
      KqUpload
    },
    data() {
      return {
        title: '操作',
        visible: false,
        model: {
          memberId: '',
          memberGradeId: ''
        },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },

        confirmLoading: false,
        url: {
          findMemberGradeList: 'memberGrade/memberGrade/findMemberGradeList',
          updateMemberGrade: 'memberGrade/memberGrade/updateMemberGrade'
        },
        memberGradeList:[],
      }
    },
    created() {
    },
    methods: {
      findMemberGradeList(){
        getAction(this.url.findMemberGradeList).then(res=>{
          this.memberGradeList = res.result
        })
      },
      show(record) {
        console.log(record);
        this.model.memberId=record.memberId;
        if(record.memberGradeId){
          this.model.memberGradeId=record.memberGradeId;
        }else{
          this.model.memberGradeId='';
        }

        this.findMemberGradeList();
        this.visible=true;
      },
      close() {
        this.$emit('close')
        this.visible = false
      },
      handleCancel(){
        this.close();
      },
      handleOk() {
        if(!this.model.memberGradeId){
          this.$message.warning('请选择会员等级');
          return ;
        }
        this.confirmLoading = true
        console.log(this.model);
        getAction(this.url.updateMemberGrade, this.model).then((res) => {
          if (res.success) {
            this.confirmLoading = false
            this.$emit('ok');
            this.close()
          } else {
            this.$message.warning(res.message);
          }
        });

      },
    }
  }
</script>

<style lang="less" scoped>
  .sjtj {
    display: flex;
    align-items: center;
    height: 100%;

    > div {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      margin-right: 20px;
    }
  }
</style>