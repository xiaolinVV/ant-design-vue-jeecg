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
          label="等级名称">
          <a-input placeholder="请输入等级名称" v-decorator="['gradeName', validatorRules.gradeName]"/>
        </a-form-item>
<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="等级图标">-->
<!--          <a-input placeholder="请输入等级图标" v-decorator="['gradeLogo', {}]"/>-->
<!--        </a-form-item>-->

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          validate-status="validating"
          help="尺寸40*40 支持png格式，大小不超过200k"
          :colon="false"
        >
          <div slot="label">
            <span class="dataCheckedStar">
               *
             </span>
            <span style="margin-right: 10px">
              等级图标:
            </span>
          </div>
          <a-upload
            :action="uploadAction"
            :headers="headers"
            :fileList="frontCoverFileList"
            :beforeUpload="frontCoverBeforeUpload"
            list-type="picture-card"
            @preview="frontCoverPreview"
            @change="frontCoverChange"
          >
            <div v-if="frontCoverFileList.length < 1">
              <a-icon type="plus"/>
              <div class="ant-upload-text">
                上传
              </div>
            </div>
          </a-upload>
          <a-modal :visible="frontCoverPreviewVisible" :footer="null" @cancel="frontCoverCancel">
            <img alt="example" style="width: 100%" :src="frontCoverPreviewImage"/>
          </a-modal>
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
              <a-input-number v-model="model.growthValueSmall" placeholder="最小值" />
            </div>
            <div style="height: 1px;width: 10px;background: black">
            </div>
            <div>
              <a-input-number v-model="model.growthValueBig" placeholder="最大值" />
            </div>
          </div>
        </a-form-item>

        <!--        <a-form-item-->
        <!--          :labelCol="labelCol"-->
        <!--          :wrapperCol="wrapperCol"-->
        <!--          label="成长值最小">-->
        <!--          <a-input-number v-model="growthValueSmall"  />-->
        <!--        </a-form-item>-->
        <!--        <a-form-item-->
        <!--          :labelCol="labelCol"-->
        <!--          :wrapperCol="wrapperCol"-->
        <!--          label="成长值最大">-->
        <!--          <a-input-number v-model="growthValueBig"  />-->
        <!--        </a-form-item>-->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="级别">
          <a-input-number v-decorator="[ 'sort', validatorRules.sort]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="等级会员"
        >
          <div class="sjtj">
            会员价折扣
             <a-input-number v-decorator="[ 'discount', validatorRules.discount]"/>
            %
          </div>
        </a-form-item>
        <!--        <a-form-item-->
        <!--          :labelCol="labelCol"-->
        <!--          :wrapperCol="wrapperCol"-->
        <!--          label="状态；0：停用；1：启用">-->
        <!--          <a-input placeholder="请输入状态；0：停用；1：启用" v-decorator="['status', {}]" />-->
        <!--        </a-form-item>-->
        <!--        <a-form-item-->
        <!--          :labelCol="labelCol"-->
        <!--          :wrapperCol="wrapperCol"-->
        <!--          label="停用时间">-->
        <!--          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'closeTime', {}]" />-->
        <!--        </a-form-item>-->
        <!--        <a-form-item-->
        <!--          :labelCol="labelCol"-->
        <!--          :wrapperCol="wrapperCol"-->
        <!--          label="停用说明">-->
        <!--          <a-input placeholder="请输入停用说明" v-decorator="['closeExplain', {}]" />-->
        <!--        </a-form-item>-->

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from 'moment'
  import Vue from 'vue'
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }
  export default {
    name: 'MemberGradeModal',
    data() {
      return {
        title: '操作',
        visible: false,
        uploadAction: window._CONFIG['domianURL'] + '/sys/common/upload',
        headers: '',
        //图标配置
        frontCoverFileList: [],
        frontCoverPic: true,
        frontCoverPreviewImage: '',
        frontCoverPreviewVisible: false,
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
          // gradeLogo: { rules: [{ required: true, message: '请输入标题!' }] },
          sort: { rules: [{ required: true, message: '请输入级别!' }] },
          discount: { rules: [{ required: true, message: '请输入会员价折扣!' }] }
        },
        url: {
          add: '/memberGrade/memberGrade/add',
          edit: '/memberGrade/memberGrade/edit'
        },
        //配置
        configure:{
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        }
      }
    },
    created() {
      const token = Vue.ls.get('Access-Token');
      this.headers = { 'X-Access-Token': token };
    },
    methods: {
      add() {
        this.edit({})
      },
      edit(record) {
        this.form.resetFields()
        this.editShowHandleImg(record.gradeLogo,'frontCoverFileList')
        this.model = Object.assign({}, record)
        this.visible = true
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'year', 'month', 'day', 'delFlag', 'gradeName', 'gradeLogo', 'growthValueSmall', 'growthValueBig', 'sort', 'discount', 'status', 'closeExplain'))
          //时间格式化
          this.form.setFieldsValue({ closeTime: this.model.closeTime ? moment(this.model.closeTime) : null })
        })
      },
      close() {
        this.$emit('close')
        this.visible = false
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
        if(!this.frontCoverFileList || !Array.isArray(this.frontCoverFileList) || this.frontCoverFileList.length <= 0){
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
            this.allHandleImg(res=>{
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
            })
          }
        })
      },
      //提交图片的数据处理封装
      async allHandleImg(callback){
        this.model.gradeLogo = await this.beforeSubmitHandleImg('frontCoverFileList')
        callback();
      },
      handleCancel() {
        this.close()
      },
      //提交前的处理图片格式方法（多图）
      beforeSubmitHandleImg(varName){
        return new Promise((resolve,reject)=>{
          let Obj = {},result = ''
          console.log(this[varName])
          if(this[varName].length > 0){
            for(let index = 0 ;index < this[varName].length;index++){
              Obj[index] = this[varName][index].response.message
            }
            result = JSON.stringify(Obj)
          }else{
            result = ''
          }
          resolve(result)
        })
      },
      //编辑反显的处理图片格式方法（多图）
      editShowHandleImg(values,varName){
        let sz = []
        if(values && values != '{}'){
          let result = Object.values(JSON.parse(values))
          for(let index = 0 ;index < result.length;index++){
            sz.push({
              uid:index,
              url:this.configure.imgerver + '/' + result[index],
              response:{
                message:result[index]
              }
            })
          }
        }
        this[varName] = sz
      },
      //封面图
      frontCoverCancel() {
        this.frontCoverPreviewVisible = false
      },
      async frontCoverPreview(file) {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj)
        }
        this.frontCoverPreviewImage = file.url || file.preview
        this.frontCoverPreviewVisible = true
      },
      frontCoverChange({ fileList }) {
        if (this.frontCoverPic) {
          this.frontCoverFileList = fileList
        }
      },
      frontCoverBeforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
        const isLt2M = file.size / 1024 / 1024 < 0.2
        if (!isJpgOrPng) {
          this.$message.error('图片必须为jpeg，png,jpg格式!')
        }
        if (!isLt2M) {
          this.$message.error('图片大小必须在200k以内!')
        }
        this.frontCoverPic = isLt2M && isJpgOrPng
        return isLt2M && isJpgOrPng
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