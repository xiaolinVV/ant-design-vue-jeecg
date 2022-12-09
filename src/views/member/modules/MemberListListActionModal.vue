<template>
  <a-modal
    :confirmLoading="confirmLoading"
    :title="title"
    :visible="visible"
    :width="800"
    @cancel="handleCancel"
    @ok="handleOk"
    cancelText="关闭"
    class="MemberListListActionModal"
  >
    <!--    修改推广人-->
    <a-form v-if="title == '修改推广人'" :form="form">
      <a-form-item label="原推广人" :label-col="labelCol" :wrapper-col="wrapperCol">
        {{allData.promoterName}}
      </a-form-item>
      <a-form-item label="新推广人类型" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-radio-group @change="promoterTypesHandleChange" name="radioGroup"
                       v-decorator="[
          'promoterType',
          { rules: [{ required: true, message: '请选择新推广人类型!' }] },
        ]"
        >
          <a-radio :value="2">
            平台
          </a-radio>
          <a-radio :value="1">
            会员
          </a-radio>
          <a-radio :value="0">
            店铺
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="新会员编号" v-if="promoterTypes == 1" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input placeholder="请输入新会员编号"
                 v-decorator="[
          'promoter',
          { rules: [{ required: true, message: '请输入新会员编号!' }] },

        ]"
                 @change="inputChange"
        ></a-input>
      </a-form-item>

      <a-form-item label="新店铺编号" v-if="promoterTypes == 0" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input placeholder="请输入新店铺编号"
                 v-decorator="[
          'promoter',
          { rules: [{ required: true, message: '请输入新店铺编号!' }] },
        ]"
                 @change="inputChange"
        ></a-input>
      </a-form-item>
      <a-form-item label="会员信息" v-if="promoterTypes == 1" :label-col="labelCol" :wrapper-col="wrapperCol">
        {{memberInformation}}
      </a-form-item>
      <a-form-item label="店铺信息" v-if="promoterTypes == 0" :label-col="labelCol" :wrapper-col="wrapperCol">
        {{storeInformation}}
      </a-form-item>
      <a-form-item label="备注说明" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-textarea :rows="4" placeholder="备注说明" v-decorator="[
          'remark',
          { rules: [{ required: false, message: '请输入备注说明!' }] },
        ]"/>
      </a-form-item>
    </a-form>
    <!--    修改归属店铺-->
    <a-form v-if="title == '修改归属店铺'" :form="form">
      <a-form-item label="原归属店铺" :label-col="labelCol" :wrapper-col="wrapperCol">
        {{allData.storeName}}
      </a-form-item>
      <a-form-item label="有无归属店铺" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-radio-group name="radioGroup"  v-decorator="[
          'isHaveStore',
          { rules: [{ required: true, message: '请选择有无归属店铺!' }] },
        ]"
          @change="isHaveStoreChange"
        >
          <a-radio :value="1">
            有
          </a-radio>
          <a-radio :value="0">
            无
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="新店铺编号" :label-col="labelCol" :wrapper-col="wrapperCol" v-if="allData.isHaveStore == 1">
        <a-input placeholder="请输入新店铺编号"
                 v-decorator="[
          'sysUserId',
          { rules: [{ required: true, message: '请输入新店铺编号!' }] },
        ]"
        @change="inputChange"
        ></a-input>
      </a-form-item>
      <a-form-item label="店铺信息" :label-col="labelCol" :wrapper-col="wrapperCol"  v-if="allData.isHaveStore == 1">
        {{storeInformation}}
      </a-form-item>
      <a-form-item label="备注说明" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-textarea :rows="4" placeholder="备注说明" v-decorator="[
          'remark',
          { rules: [{ required: false, message: '请输入备注说明!' }] },
        ]"/>
      </a-form-item>

    </a-form>
    <template slot="footer">
      <a-button key="back" @click="handleCancel">
        取消
      </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
        确认
      </a-button>
    </template>

  </a-modal>


</template>

<script>
  function isEmpty(obj) {
    if (typeof obj === 'undefined' || obj == null) {
      return true;
    } else {
      return false;
    }
  }
  import { getAction, postAction, putAction, deleteAction } from '@/api/manage'

  export default {
    inject: ['rush'],
    name: 'MemberListListActionModal',
    data() {
      return {
        form: this.$form.createForm(this),
        labelCol: { span: 5 },
        wrapperCol: { span: 12 },
        promoterTypes: 0,
        loading:false,
        confirmLoading: false,
        visible: false,
        //修改推广人
        title: '',
        memberInformation: '请输入新会员编号',
        storeInformation: '请输入新店铺编号',
        inputChangeTimerOut:null,
        allData: {
          promoterType: 0,
          promoterName: '',
          promoter: '',
          remark: '',
          isHaveStore:1,//有无归属店铺
        },
        url: {
          returnPromoter: '/memberList/memberList/returnPromoter', //返回会员推广人 传入参数:id
          returnMemberNameById: '/memberList/memberList/returnMemberNameById', // 返回会员信息 传入参数:promoter , promoterType 0:店铺 1：会员 2：平台
          updatePromoter: '/memberList/memberList/updatePromoter',// 修改推广人  post remark
          returnMemberStore: '/memberList/memberList/returnMemberStore',//返回归属店铺
          memberStoreEdit:'/memberList/memberList/updateSysUserId'//修改归属店铺
        }
      }
    },
    methods: {
      handleOk() {
        if (this.title == '修改推广人') {
          if (this.promoterTypes == 1) {
            //会员
            if (this.memberInformation == '查询不到会员信息') {
              this.$message.warn('此会员编号查不到对应信息，请输入正确的会员编号！')
              return
            }
          } else if (this.promoterTypes == 0) {
            //店铺
            if (this.storeInformation == '查询不到店铺信息') {
              this.$message.warn('此店铺编号查不到对应信息，请输入正确的店铺编号！')
              return
            }
          }
        } else {
          //店铺
          if (this.storeInformation == '查询不到店铺信息') {
            this.$message.warn('此店铺编号查不到对应信息，请输入正确的店铺编号！')
            return
          }
        }
        this.form.validateFields((err, values) => {
          if (!err) {
            values = Object.assign({}, this.allData, values)
            if (values.promoter) {
              values.promoter = values.promoter.replace(/\s+/g, '')
            }
            if (values.sysUserId) {
              values.sysUserId = values.sysUserId.replace(/\s+/g, '')
            }
            if(this.title == '修改归属店铺'){
              if(!isEmpty(values.promoter))  delete values.promoter;
              if(!isEmpty(values.promoterName)) delete values.promoterName;
              if(!isEmpty(values.promoterType) ) delete values.promoterType;
              if(!isEmpty(values.storeName) ) delete values.storeName;
            }
            let methods = postAction //默认方法
            let apiName = 'updatePromoter' //默认接口
            //apiName 借口名称  methods 请求方法
            if(this.title == '修改归属店铺'){
              //如果是修改归属店铺，修改接口，请求方法
              apiName = 'memberStoreEdit'
              // methods = ''
            }
            methods(this.url[apiName], values).then((res) => {
              if (res.success) {
                this.rush()
                this.$message.success(res.message || '修改成功！')
              } else {
                this.$message.warn(res.message || '修改失败！')
              }
              this.handleCancel()
            })
          }
        })
      },
      handleCancel() {
        this.clear()
        this.visible = false
      },
      clear() {
        this.allData = Object.assign({}, this.allData, {
          // promoterType:0,
          promoterName: '',
          promoter: '',
          remark: ''
        })
        this.$nextTick(() => {
          this.form.setFieldsValue(this.allData)
          this.memberInformation = '请输入新会员编号'
          this.storeInformation = '请输入新店铺编号'
        })
      },
      isHaveStoreChange(e){
        this.allData.promoter = ''
        this.allData.remark = ''
        this.allData.isHaveStore = e.target.value
        this.$nextTick(() => {
          this.form.setFieldsValue(this.allData)
          this.storeInformation = '请输入新店铺编号'
        })
      },
      promoterTypesHandleChange(e) {
        this.promoterTypes = e.target.value
        this.allData.promoter = ''
        this.allData.remark = ''
        this.allData.promoterType = e.target.value
        this.$nextTick(() => {
          this.form.setFieldsValue(this.allData)
          this.memberInformation = '请输入新会员编号'
          this.storeInformation = '请输入新店铺编号'
        })
      },
      inputChange(e) {
        console.log(e)
        let promoter = e.target.value.replace(/\s+/g, '')
        if (!promoter) return
        this.loading = true
        if(this.inputChangeTimerOut){
          clearTimeout(this.inputChangeTimerOut)
          this.inputChangeTimerOut = null
        }
        setTimeout(() => {
          if (this.title == '修改归属店铺' && this.promoterTypes != 0) {
            this.promoterTypes = 0
          }
          let params = {
            promoter,
            promoterType: this.promoterTypes
          }
          getAction(this.url.returnMemberNameById, params).then((res) => {
            if (this.promoterTypes == 1) {
              //会员
              if (res.result) {
                this.memberInformation = res.result.information
              } else {
                this.memberInformation = '查询不到会员信息'
              }
            } else if (this.promoterTypes == 0) {
              //店铺
              if (res.result) {
                this.storeInformation = res.result.promoter
              } else {
                this.storeInformation = '查询不到店铺信息'
              }
            }
            this.inputChangeTimerOut =  setTimeout(()=>{
              this.loading = false
              clearTimeout(this.inputChangeTimerOut)
              this.inputChangeTimerOut = null
            },500)
            console.log(res)
          })
        }, 0)
      },
      open(value) {
        this.visible = true
        this.title = value.modalTitle || ''
        let apiName = 'returnPromoter'
        if (value.modalTitle == '修改归属店铺') {
          apiName = 'returnMemberStore'
        }
        getAction(this.url[apiName], { id: value.id }).then((res) => {
          if (res.success) {
            this.allData = Object.assign({}, this.allData, { id: value.id }, res.result)
            console.log(this.allData)
            setTimeout(() => {
              this.form.setFieldsValue(this.allData)
            }, 250)
          } else {
            this.clear()
          }
        }).catch(() => {
          this.clear()
        })
      }

    }
  }
</script>

<style scoped>
  .MemberListListActionModal {

  }
</style>