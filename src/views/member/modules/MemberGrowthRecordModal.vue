<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
      
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="创建年">-->
<!--          <a-input-number v-decorator="[ 'year', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="创建月">-->
<!--          <a-input-number v-decorator="[ 'month', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="创建日">-->
<!--          <a-input-number v-decorator="[ 'day', {}]" />-->
<!--        </a-form-item>-->
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="删除状态（0，正常，1已删除）">-->
<!--          <a-input placeholder="请输入删除状态（0，正常，1已删除）" v-decorator="['delFlag', {}]" />-->
<!--        </a-form-item>-->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="会员编号">
          <a-input placeholder="请输入会员编号" v-decorator="['memberListId', validatorRules.memberListId]" @change="memberListIdHandleChange"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="会员账号">
          {{phone}}
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="会员昵称">
          {{nickName}}
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="途径">
<!--          交易类型；0：订单；1：礼包；2：平台补发-->
<!--          <a-input placeholder="请输入交易类型；0：订单；1：礼包；2：平台补发" v-decorator="['tradeType', {}]" />-->
          <a-select v-decorator="['tradeType', validatorRules.tradeType]" style="width: 120px"  placeholder="请选择途径">
            <a-select-option value="4" >
              平台补发
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="成长值">
          <a-input-number style="width: 120px" v-decorator="[ 'growthValue', validatorRules.growthValue]" placeholder="请输入成长值" :min="0" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注">
          <a-textarea  placeholder="请输入备注" v-decorator="['remark', {}]"/>
        </a-form-item>
      </a-form>
    </a-spin>
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
  import { httpAction } from '@/api/manage'
  import {  getAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "MemberGrowthRecordModal",
    data () {
      return {
        title:"补发",
        visible: false,
        loading:false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        inputChangeTimerOut:null,
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          memberListId: { rules: [{ required: true, message: '请输入会员编号!' }] },
          tradeType: { rules: [{ required: true, message: '请选择途径!' }] },
          growthValue: { rules: [{ required: true, message: '请选择途径!' }] },
        },
        url: {
          // add: "/memberGrowthRecord/memberGrowthRecord/add",
          edit: "/memberGrowthRecord/memberGrowthRecord/edit",
          //根据会员编号获取信息
          queryById:"memberList/memberList/queryById",
          add:"memberGrowthRecord/memberGrowthRecord/supplyAgain"
        },
        information:{
          nickName:'',
          phone:'',
        }
      }
    },
    computed:{
      nickName(){
        if(this.information.nickName){
          return this.information.nickName
        }else{
          return '请输入正确的会员编号'
        }
      },
      phone(){
        if(this.information.phone){
          return this.information.phone
        }else{
          return '请输入正确的会员编号'
        }
      },
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'year','month','day','delFlag','memberListId','tradeNo','tradeType','remark','growthValue'))
		  //时间格式化
        });

      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.information = {
          nickName:'',
          phone:'',
        }
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        if(this.nickName == '请输入正确的会员编号'){
          return
        }
        this.form.validateFields((err, values) => {
          if (!err) {
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
            let formData = Object.assign(this.model, values);
            //时间格式化
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
          }
        })
      },
      memberListIdHandleChange(e){
        console.log(e)
        let id = e.target.value.replace(/\s+/g, '')
        if (!id) return
        this.loading = true
        if(this.inputChangeTimerOut){
          clearTimeout(this.inputChangeTimerOut)
          this.inputChangeTimerOut = null
        }
        setTimeout(() => {
          let params = {
            id
          }
          getAction(this.url.queryById, params).then((res) => {
              if (res.result) {
                this.information = {
                  nickName:res.result.nickName,
                  phone:res.result.phone
                }
              } else {
                this.information = {
                  nickName:'',
                  phone:''
                }
              }
            this.inputChangeTimerOut =  setTimeout(()=>{
              this.loading = false
              clearTimeout(this.inputChangeTimerOut)
              this.inputChangeTimerOut = null
            },500)
          })
        }, 0)
      },

      handleCancel () {
        this.close()
      },


    }
  }
</script>

<style lang="less" scoped>

</style>