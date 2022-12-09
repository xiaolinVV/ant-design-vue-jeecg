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
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="补发说明">
          <a-textarea  v-decorator="[ 'reissueExplain', validatorRules.reissueExplain]">

          </a-textarea>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
         >
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
              补发凭证
          </span>
          <a-upload
            :action="uploadAction"
            listType="picture-card"
            :fileList="mainPictureFileList"
            @preview="mainPictureHandlePreview"
            @change="mainPictureHandleChange"
            :headers="headers"
            :beforeUpload="mainPictureUpload"
          >
            <div v-if="mainPictureFileList.length < 5">
              <a-icon type="plus"/>
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :visible="mainPicturePreviewVisible" :footer="null" @cancel="mainPictureHandleCancel">
            <img alt="example" style="width: 100%" :src="mainPicturePreviewImage"/>
          </a-modal>

          <div>
            请上传分类图片，支持jpg、jpeg、png格式，大小不超过500k
          </div>


        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import Vue from 'vue'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "MarketingActivityRewardModal",
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        uploadAction: window._CONFIG['domianURL'] + '/sys/common/upload',
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          reissueExplain:{
            rules: [{
              required: true, message: '请输入补发说明!'
            }]},
          // reissueCertificate:{
          //   rules: [{
          //     required: true, message: '请上传图片!'
          //   }]}
        },
        url: {
          add: "/marketingActivityReward/marketingActivityReward/add",
          edit: "/marketingActivityReward/marketingActivityReward/edit",
        },
        //配置
        configure: {
          imgErver: window._CONFIG['domianURL'] + '/sys/common/view',
          fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
        },
        headers: '',
        //主图 配置
        mainPictureFileList: [],
        mainPicturePreviewVisible: false,
        mainPicturePreviewImage: '',
        mainPicturePic: true,
      }
    },
    created () {
      const token = Vue.ls.get('Access-Token')
      this.headers = { 'X-Access-Token': token }
    },
    methods: {
      mainPictureUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 0.5
        if (!isLt2M) {
          this.$message.error('图片大小必须在500k以内!')
        }
        this.mainPicturePic = isLt2M
        return isLt2M
      },
      //上传主图
      mainPictureHandleCancel() {
        this.mainPicturePreviewVisible = false
      },
      mainPictureHandlePreview(file) {
        this.mainPicturePreviewImage = file.url || file.thumbUrl
        this.mainPicturePreviewVisible = true
      },
      mainPictureHandleChange({ fileList }) {
        if(this.mainPicturePic){
          this.mainPictureFileList = fileList
        }
      },
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.mainPictureFileList = []
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(this.model)
          if(record.id){
            this.previewImage(record.reissueCertificate,"mainPictureFileList")
          }
		  //时间格式化
      //     this.form.setFieldsValue({reissueTime:this.model.reissueTime?moment(this.model.reissueTime):null})
        });

      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      //返显图片事件封装
      previewImage(imageLists,thisImageName){
        let that = this;
        if (imageLists && imageLists != '{}') {
          let image = Object.values(JSON.parse(imageLists))
          let sz = []
          for (let a = 0; a < image.length; a++) {
            let obj = {
              uid: a,
              url: that.configure.imgErver + '/' + image[a],
              response: {
                message: image[a]
              }
            }
            sz.push(obj)
          }
          that[thisImageName] = sz
        }
      },
      //提交图片事件封装
      submitImage(thisImageName,allDataImageName){
        let list = {},
          that = this;
        for (let count = 0; count < that[thisImageName].length; count++) {
          list[count] = that[thisImageName][count].response.message
        }
        that.model[allDataImageName] = JSON.stringify(list)
      },
      handleOk () {
        const that = this;
        if(this.mainPictureFileList && this.mainPictureFileList.length <= 0){
          this.$message.warn('请上传补发凭证！')
          return;
        }
        // 触发表单验证
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
            formData.reissueTime = formData.reissueTime?formData.reissueTime.format('YYYY-MM-DD HH:mm:ss'):null;
            this.submitImage('mainPictureFileList','reissueCertificate');
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
      handleCancel () {
        this.close()
      },


    }
  }
</script>

<style lang="less" scoped>

</style>