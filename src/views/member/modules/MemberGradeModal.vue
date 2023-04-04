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
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="等级名称">
          <a-input placeholder="请输入等级名称" v-decorator="['gradeName', validatorRules.gradeName]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          validate-status="validating"
         label="等级图标">
          <kq-upload ref='gradeLogosUpload' :imgCount="1" explain="尺寸40*40 支持png格式，大小不超过200k" @change="e=>{gradeLogos=e}"></kq-upload>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
           <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
              升级条件
           </span>
          <div class="sjtj">
            <div>
              成长值达到
            </div>
            <div>
              <a-input-number :min="0" v-model="model.growthValueSmall" placeholder="最小值" />
            </div>
            <div style="height: 1px;width: 10px;background: black">
            </div>
            <div>
              <a-input-number :min="model.growthValueSmall" v-model="model.growthValueBig" placeholder="最大值" />
            </div>
          </div>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="级别">
          <a-input-number style="width: 90%" :min="0" v-decorator="[ 'sort', validatorRules.sort]"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import KqUpload from '@/components/kq/KqUpload/KqUpload'
  import pick from 'lodash.pick'
  import moment from 'moment'
  export default {
    name: 'MemberGradeModal',
    components:{
      KqUpload
    },
    data() {
      return {
        title: '操作',
        visible: false,
        //图标配置
        gradeLogos:[],
        model: {
          growthValueSmall: 0,
          growthValueBig: 0
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
        form: this.$form.createForm(this),
        validatorRules: {
          gradeName: { rules: [{ required: true, message: '请输入等级名称!' }] },
          sort: { rules: [{ required: true, message: '请输入级别!' }] }
        },
        url: {
          add: '/memberGrade/memberGrade/add',
          edit: '/memberGrade/memberGrade/edit'
        },
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

        this.gradeLogos=[];

        if(this.model.id){
          this.gradeLogos=JSON.parse(record.gradeLogo);
        }
        this.visible = true
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'gradeName',  'growthValueSmall', 'growthValueBig', 'sort', 'status'))
          //时间格式化
          this.form.setFieldsValue({ closeTime: this.model.closeTime ? moment(this.model.closeTime) : null })
          this.$refs.gradeLogosUpload.init(this.gradeLogos);
        })
      },
      close() {
        this.$emit('close')
        this.visible = false
      },
      handleCancel(){
        this.close();
      },
      isEmpty(number){
        if(number !== undefined && number !== null && number >= 0 ){
          return false
        }else{
          return true
        }
      },
      handleOk() {
        const that = this
        // 触发表单验证
        if(this.isEmpty(this.model.growthValueSmall)){
          this.$message.warn('请输入正确的升级条件最小值！')
          return;
        }
        if(this.isEmpty(this.model.growthValueBig)){
          this.$message.warn('请输入正确的升级条件最大值！')
          return;
        }
        if(this.model.growthValueBig < this.model.growthValueSmall){
          this.$message.warn('最大值须大于最小值！')
          return;
        }
        if(this.gradeLogos.length==0){
          this.$message.warn('请上传图标！')
          return;
        }
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
            formData.gradeLogo=JSON.stringify(this.gradeLogos);
              //时间格式化
              formData.closeTime = formData.closeTime ? formData.closeTime.format('YYYY-MM-DD HH:mm:ss') : null
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