<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    ok-text="保存"
    cancel-text="取消"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="用户账号" v-if="model.id">
          {{model.username || ' - - '}}
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="用户账号" v-else>
          <a-select style="width: 120px" >
            <a-select-option value="" @change="userNumberChange">
              请选择
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="手机号" >
          <span >
             {{model.username || model.id?' - - ' : '请先选择用户账号'}}
          </span>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="用户名字">
           <span >
             {{model.realname || model.id?' - - ' : '请先选择用户账号'}}
          </span>


        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="公司名称" v-if="model.id">
          {{model.name || ' - - '}}
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="公司名称" v-else>
          <a-select style="width: 120px" >
            <a-select-option value="" @change="companyNameChange">
              请选择
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="分层比例">
          <a-input-number v-decorator="[ 'stratifiedProportion', validatorRules.stratifiedProportion]"/>
          %
          <div>
            分成比例将从主办人的比例中划分出来，当前当前可分配给合伙人的比例是100%
          </div>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="合作开始时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'startTime', validatorRules.startTime]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="合作结束时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'endTime', validatorRules.endTime]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注说明">
          <a-textarea placeholder="请输入备注说明" v-decorator="['remark', validatorRules.remark]"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from 'moment'
  import ATextarea from 'ant-design-vue/es/input/TextArea'

  export default {
    name: 'AlliancePartnerModal',
    components: { ATextarea },
    data() {
      return {
        title: '操作',
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          stratifiedProportion:{rules: [{required: true, message: '请输入分层比例!'}]},
          startTime:{rules: [{required: true, message: '请选择合作开始时间!'}]},
          endTime:{rules: [{required: true, message: '请选择合作结束时间!'}]},
          remark:{rules: [{required: true, message: '请输入备注说明!'}]},
        },
        url: {
          add: '/alliancePartner/alliancePartner/add',
          edit: '/alliancePartner/alliancePartner/edit'
        }
      }
    },
    created() {
    },
    methods: {
      add() {
        this.edit({})
      },
      edit(record) {
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'stratifiedProportion', 'remark','startTime','endTime'))
          //时间格式化
          this.form.setFieldsValue({ startTime: this.model.startTime ? moment(this.model.startTime) : null })
          this.form.setFieldsValue({ endTime: this.model.endTime ? moment(this.model.endTime) : null })
        })

      },
      close() {
        this.$emit('close')
        this.visible = false
      },
      userNumberChange(value){

      },
      companyNameChange(value){

      },
      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            let httpurl = ''
            let method = ''
            if (!this.model.id) {
              httpurl += this.url.add
              method = 'post'
            } else {
              httpurl += this.url.edit
              method = 'put'
            }
            let formData = Object.assign(this.model, values)
            //时间格式化
            formData.startTime = formData.startTime ? formData.startTime.format('YYYY-MM-DD HH:mm:ss') : null
            formData.endTime = formData.endTime ? formData.endTime.format('YYYY-MM-DD HH:mm:ss') : null

            console.log(formData)
            httpAction(httpurl, formData, method).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            }).finally(() => {
              that.confirmLoading = false
              that.close()
            })


          }
        })
      },
      handleCancel() {
        this.close()
      }


    }
  }
</script>

<style lang="less" scoped>

</style>