<template>
<!--  :footer="null"-->
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    @ok="handleOk"
    cancelText="关闭">
    <a-form :form="form">
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="分类名称"
        >
         <a-input v-decorator="[ 'typeName',validatorRules.typeName]" placeholder="请输入分类名称">

         </a-input>
      </a-form-item>

      <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="上级分类名称"
          v-if="type == 'child'"
          >
          <a-input :disabled="true" v-model="model.typeName">

          </a-input>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="排序"
      >
        <a-input-number style="width: 150px" :min="0" :precision="0"  v-decorator="[ 'sort',validatorRules.sort]" placeholder="请输入排序"/>

      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="状态"
      >
        <a-select style="width: 120px" v-decorator="[ 'status',validatorRules.status]" >
          <a-select-option value="">
            请选择
          </a-select-option>
          <a-select-option value="0">
            停用
          </a-select-option>
          <a-select-option value="1">
            启用
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="福利金抵扣最低值"
      >
        <a-input-number style="width: 150px" :min="0" :precision="2"  v-decorator="[ 'smallWelfarePayments',validatorRules.smallWelfarePayments]" placeholder="请输入福利金抵扣最低值"/>%
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <span slot="label">
              <span class="dataCheckedStar">
                *
              </span>
              logo
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
          <div v-if="mainPictureFileList.length < 1">
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
  </a-modal>
</template>

<script>
  import Vue from 'vue'
  import {httpAction} from '@/api/manage'
  export default {
    name: 'StoreTypeListModalAdd',
    data(){
      return{
        title:'添加分类',
        confirmLoading:false,
        visible:false,
        form: this.$form.createForm(this),
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
        uploadAction: window._CONFIG['domianURL'] + '/sys/common/upload',
        validatorRules: {
          typeName: {rules: [{ required: true, message: '请输入分类名称' }], },
          sort:{rules:[{ required: true, message: '请输入排序' }]},
          status:{rules:[{ required: true, message: '请选择停用状态' }]},
          smallWelfarePayments:{rules:[{ required: true, message: '请输入福利金抵扣最低值' }]},
        },
        url:{
          setStoreType:"/storeType/storeType/setStoreType",//添加分类and添加子分类
          edit:"storeType/storeType/edit",//启用and停用 编辑
          delAndExplain:'storeType/storeType/delAndExplain',//删除and说明
        },
        id:'',
        model:{
          pid:''//父级分类id(添加子分类时传父级id,添加分类传空字符串
        },
        headers: '',
        //主图 配置
        mainPictureFileList: [],
        mainPicturePreviewVisible: false,
        mainPicturePreviewImage: '',
        mainPicturePic: true,
        type:'parent',
        //配置
        configure: {
          imgErver: window._CONFIG['domianURL'] + '/sys/common/view',
          fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
        }

        // pid
      }
    },
    created(){
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
      add() {
        this.edit({});
      },
      edit(record,type) {
        this.form.resetFields();
        this.model.pid  = ''
        this.type = type
        this.mainPictureFileList = []
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          if(this.type == 'child'){
            this.model = {
              typeName:this.model.typeName,
              pid:this.model.id
            }
            this.title = '添加子分类'
          }else{
            this.form.setFieldsValue(this.model)
            this.previewImage(record.logoAddr,"mainPictureFileList")
            this.title = '添加分类'
          }
        });
        console.log(this.model)
      },
      close() {
        this.$emit('close');
        this.visible = false;
      },
      handleOk() {
        const that = this;
        if(this.mainPictureFileList && this.mainPictureFileList.length <= 0){
          this.$message.warn('请上传logo！')
          return;
        }

        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if (!this.model.id) {
              httpurl += this.url.setStoreType;
              method = 'post';
            } else {
              httpurl += this.url.edit;
              method = 'put';
            }
            // values.logoAdd
            this.submitImage('mainPictureFileList','logoAddr');
            let formData = Object.assign(this.model, values);
            httpAction(httpurl, formData, method).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.$emit('ok');
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
          }
        })
      },
      handleCancel() {
        this.close()
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
    }
  }
</script>

<style scoped>

</style>