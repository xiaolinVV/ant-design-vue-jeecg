<!--分步表单-提交成功页面-跳转-->
<template>

  <div>
    <a-form style="margin: 40px auto 0;">
      <result title="认证信息提交成功!" :is-success="true" description="请耐心等待平台申核,通过后会通过短信通知您!~"></result>
    </a-form>
    <div style="display: flex;align-items: center;justify-content: center;margin: 0 auto;">
      <a-button type="primary" icon="plus" @click="toAudit()" style="margin-right: 20px;">查看已提交信息</a-button>
      <a-button @click="StoreManageInforMation">返回工作台</a-button>
    </div>
  </div>



</template>

<script>
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import Result from '../../result/Result'
  import DetailList from '@/components/tools/DetailList'
  import Vue from 'vue'
  const DetailListItem = DetailList.Item
  export default {
    name: "StoreManage4",
    mixins: [JeecgListMixin],
    components: {
      Result,
      DetailListItem
    },
    data () {
      return {
        loading: false
      }
    },
    methods: {
      finish () {
        this.$emit('finish')
      },
      StoreManageInforMation () {
        this.$router.push('/store/Workbench')
      },
      toAudit(){
        let id = localStorage.getItem('storeID')
        console.log(id)
        this.$router.push({path:'/store/modules/ToAudit',query:{
            AllData:{
                id
            }
        }})
      },
    }
  }
</script>
<style lang="scss" scoped>
  .information {
    line-height: 22px;

    .ant-row:not(:last-child) {
      margin-bottom: 24px;
    }
  }
  .money {
    font-family: "Helvetica Neue",sans-serif;
    font-weight: 500;
    font-size: 20px;
    line-height: 14px;
  }
</style>