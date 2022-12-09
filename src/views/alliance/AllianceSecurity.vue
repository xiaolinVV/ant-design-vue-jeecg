<!--安全设置-->
<template>
  <div>
    <a-card :bordered="false" class="sth">
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
    <a-modal :title="popTitle" v-model="visible" @ok="handleOk" :width="800"
             :okButtonProps="{ props: {disabled: !okButtonProps} }">
      <div class="line-wrap" v-for="(item,index) in popEditData" v-if="item.label != '邮箱验证码'">
        <div>
          <div>
              <span class="dataCheckedStar">
              *
            </span>
            {{item.label}}
          </div>
          <div class="right">
            <a-input v-model="item.value" :type="item.type" :disabled="index<=1"
                     :class="{wrongBorder:!item.isThrough && item.checkContent}">
            </a-input>
            <a-button style="margin-left: 20px;"
                      v-if="index == 2 || (index == 4 && (item.label == '新手机验证码' || item.label == '邮箱验证码'))"
                      @click="getQrCode(item)">
              获取验证码
            </a-button>
          </div>
        </div>
        <div v-if="!item.isThrough && item.checkContent" class="checkContent">
          {{item.checkContent}}
        </div>
      </div>
    </a-modal>
  </div>

</template>
<script>
  // import UserPassword from '@/UserPassword'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAction, putAction, postAction } from '@/api/manage'
  import Vue from 'vue'

  export default {
    name: 'StoreSecurity',
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
        visible: false,//是否显示修改弹窗
        url: {
          findUser: 'sys/user/findUser',//返回安全设置信息
          updatePassword: 'sys/user/updateFranchiseePassword', //密码设置接口
          updatePhone: 'sys/user/updateFranchiseePhone', //绑定手机号接口
          updateEmail: 'sys/user/updateEmail', //绑定邮箱接口
          verificationCode: 'storeBankCard/storeBankCard/bankCardByPhone' //获取验证码
        },
        //弹窗标题
        popTitle: '修改密码',
        //弹窗类型
        popType: '',
        //修改弹窗数据
        popEditData: [
          {
            label: '账号',
            value: '',
            type: 'text',
            isThrough: true, //是否通过校验
            checkContent: ''
          }, {
            label: '手机号',
            value: '',
            type: 'number',
            isThrough: true,
            checkContent: ''
          }, {
            label: '验证码',
            value: '',
            type: 'number',
            isThrough: false,
            checkContent: '请输入验证码'
          }, {
            label: '登录密码',
            value: '',
            type: 'password',
            isThrough: false,
            checkContent: '请输入登录密码'
          }, {
            label: '确认密码',
            value: '',
            type: 'password',
            isThrough: false,
            checkContent: '两次输入的密码不一样！'
          }
        ],
        //信息
        findUser: '',
        //是否可点击确认按钮  false不可点击
        okButtonProps: false
      }
    },
    watch: {
      visible() {
        let data = this.findUser
        if (!this.visible) {
          console.log('清空')
          for (let item of this.popEditData) {
            item.value = ''
          }
        } else {
          this.popEditData[0].value = data.username
          this.popEditData[1].value = data.phone
        }
      },
      popEditData: {
        handler() {
          let phoneText = /^1[3456789]\d{9}$/
          if (this.popType == 0) {
            this.popEditData.forEach((item, index) => {
              if (!item.value) {
                item.isThrough = false
              } else if (index == 4) {
                console.log(item.value, this.popEditData[3].value)
                if (item.value == this.popEditData[3].value && item.value) {
                  item.isThrough = true
                } else {
                  item.isThrough = false
                }
              } else {
                item.isThrough = true
              }
            })
          } else if (this.popType == 1) {
            this.popEditData.forEach((item, index) => {
              if (!item.value) {
                item.isThrough = false
                if (index == 3) {
                  item.checkContent = '请输入新手机！'
                }
              } else if (index == 3) {
                // console.log(item.value ,this.popEditData[3].value)
                if (item.value == this.popEditData[1].value) {
                  item.isThrough = false
                  item.checkContent = '新手机与旧手机号不得相同！'
                } else if (!phoneText.test(item.value)) {
                  item.isThrough = false
                  item.checkContent = '手机号格式不正确！'
                } else {
                  item.isThrough = true
                }
              } else {
                item.isThrough = true
              }
            })
          }
          this.$nextTick(() => {
            this.okButtonProps = this.popEditData.every((item, index) => {
              return item.isThrough
            })
          })
        },
        immediate: true,
        deep: true
      }
    },
    components: {
      // UserPassword,
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
    methods: {
      updatePassword() {
        let username = this.userInfo().username
        this.$refs.userPassword.show(username)
      },
      showModal(index = '') {
        let data = this.findUser
        switch (index * 1) {
          case 0:
            this.popTitle = '修改密码'
            this.popEditData[3].label = '登录密码'
            this.popEditData[4].label = '确认密码'
            this.popEditData[3].type = 'password'
            this.popEditData[4].type = 'password'
            this.popEditData[3].checkContent = '请输入登录密码'
            this.popEditData[4].checkContent = '请再次确认密码'
            // this.popEditData[3].value = data.password
            break
          case 1:
            this.popTitle = '修改手机'
            this.popEditData[3].label = '新手机'
            this.popEditData[4].label = '新手机验证码'
            this.popEditData[3].type = 'number'
            this.popEditData[4].type = 'number'
            this.popEditData[3].checkContent = '请输入新手机'
            this.popEditData[4].checkContent = '请输入新手机验证码'
            this.popEditData[3].value = ''
            break
          case 2:
            this.popTitle = '绑定邮箱'
            this.popEditData[3].label = '邮箱账号'
            this.popEditData[4].label = '邮箱验证码'
            this.popEditData[3].type = 'text'
            this.popEditData[4].type = 'text'
            break
        }
        this.popType = index
        this.visible = !this.visible
      },
      handleOk() {
        let type = this.popType,
          popEditData = this.popEditData,
          info
        switch (type * 1) {
          case 0:
            info = {
              id: this.findUser.id,
              username: popEditData[0].value,
              phone: popEditData[1].value,
              captcha: popEditData[2].value,
              password: popEditData[3].value,
              confirmpassword: popEditData[4].value
            }
            putAction(this.url.updatePassword, info).then(res => {
              if (res.success) {
                this.$message.success('修改密码成功！')
              } else {
                this.$message.warn('修改密码失败！')
              }
            })
            break
          case 1:
            info = {
              id: this.findUser.id,
              oldPhone: popEditData[1].value,
              oldPhoneCode: popEditData[2].value,
              newPhone: popEditData[3].value,
              newPhoneCode: popEditData[4].value
            }
            postAction(this.url.updatePhone, info).then(res => {
              if (res.success) {
                this.$message.success(res.message)
              } else {
                this.$message.warn(res.message)
              }
            })
            break
          case 2:

            break
        }
        this.showModal()
      },
      //获取验证码
      getQrCode(item) {
        let type = this.popType
        let that = this
        console.log(item, type)
        switch (type * 1) {
          case 0:
            if (item.label == '验证码') {
              that.apiQrCode(that.popEditData[1].value)
            }
            break
          case 1:
            if (item.label == '验证码') {
              that.apiQrCode(that.popEditData[1].value)
            }
            if (item.label == '新手机验证码' && that.popEditData[3].isThrough) {
              that.apiQrCode(that.popEditData[3].value)
            }
            break
          case 2:

            break
        }

      },
      //获取验证码接口方法
      apiQrCode(value) {
        getAction(this.url.verificationCode, { phone: value }).then(res => {
          if (res.success) {
            this.$message.success('验证码获取成功！')
          } else {
            this.$message.warn('验证码获取失败！')
          }
        })
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

  .wrongBorder {
    border: 1px solid red;
  }

  .wrongBorder:hover {
    border: 1px solid red !important;
  }

  .line-wrap {
    width: 80%;
    margin: 0 auto;
    margin-bottom: 20px;

    .checkContent {
      margin-left: calc(25% + 20px);
      min-width: 25%;
      text-align: left;
      margin-bottom: 20px;
      color: red;
      display: inline-block;
    }

    > div {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      > div:nth-child(1) {
        width: 25%;
        text-align: right;
        margin-right: 20px;
      }

      .right {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 75%;
      }
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