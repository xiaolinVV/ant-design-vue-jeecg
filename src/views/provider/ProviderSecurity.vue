<!--安全设置-->
<template>
  <div>
    <a-card :bordered="false" class="sth" title="安全设置">
      <h3></h3>
      <div class="operation" v-for="(item,index) in dataList">
        <div>
          <div class="bottom">{{item.title}}</div>
          <div class="bottom">
            {{item.label}} ：<span :style="{color:index == 0?passwordLevel:'black'}">{{item.content}}</span>
          </div>
        </div>
        <a class="bottom" @click="showModal(index)">修改</a>
      </div>
    </a-card>

    <!--    修改弹窗-->
    <provider-security-model :findUser="findUser" ref="ProviderSecurityModel">

    </provider-security-model>
  </div>
</template>
<script>
  // import UserPassword from '@/UserPassword'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAction, putAction, postAction } from '@/api/manage'
  import ProviderSecurityModel from './modules/ProviderSecurityModel'
  import Vue from 'vue'
  export default {
    name: 'ProviderSecurity',
    data() {
      return {
        dataList: [{
          title: '账户密码',
          label: '当前密码强度',
          content: '中'
        }, {
          title: '绑定手机号',
          label: '已绑定手机',
          content: ''
        }
          //   {
          //   title:'绑定邮箱',
          //   label:'已绑定邮箱',
          //   content:'未绑定'
          // }
        ],
        passwordLevel: 'red',  //red yellow green
        url: {
          findUser: 'sys/user/findUser',//返回安全设置信息
          updatePassword: 'sys/user/updateStorePassword', //密码设置接口
          updatePhone: 'sys/user/updateStorePhone', //绑定手机号接口
          updateEmail: 'sys/user/updateEmail', //绑定邮箱接口
          verificationCode: 'storeBankCard/storeBankCard/bankCardByPhone' //获取验证码
        },
        findUser:''
      }
    },
    components: {
      // UserPassword,
      ProviderSecurityModel
    },

    created() {
      const token = Vue.ls.get('ACCESS_TOKEN')
      this.headers = { 'X-Access-Token': token }
      getAction(this.url.findUser).then(res => {
        if (res.success && res.result) {
          // console.log(res);
          let data = res.result
          this.findUser = data
          this.dataList[1].content = data.phone || '暂未绑定手机号码'
        }
      })
    },

    methods:{
      showModal(index){
        this.$refs.ProviderSecurityModel.showModal(index)
      }
    }
  }
</script>
<style lang="less" scoped>
  .sth {
    .ant-card-body {
      padding: 0;
    }
  }


  .operation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #CCCCCC;
    margin-bottom: 25px;

    .bottom {
      margin-bottom: 15px;
    }
  }
</style>