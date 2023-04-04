<template>
  <a-modal
    :title="title"
    :width="1000"
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
          label="品牌名称">
          <a-input placeholder="请输入品牌名称" v-decorator="['brandName', {rules: [{ required: true, message: '请输入品牌名称' }]}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="排序">
          <a-input-number :min="0" v-decorator="[ 'sort', {rules: [{ required: true, message: '请输入排序' }]}]"  style="width: 100%"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="品牌logo">
          <a-upload
            :action="getUplosdUrl"
            :headers="headers"
            accept="image/*"
            list-type="picture-card"
            :file-list="fileList"
            @preview="handlePreview"
            @change="handleChange"
          >
            <div v-if="fileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                Upload
              </div>
            </div>
          </a-upload>
          <span>请上传分类图片，支持jpg、jpeg、png格式，尺寸200*200，大小不超过2M</span>
          <a-modal :visible="previewVisible" :footer="null" @cancel="previewhandleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import Vue from 'vue'
  import {ACCESS_TOKEN} from "@/store/mutation-types"

  export default {
    name: "GoodBrandModal",
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
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
        },
        url: {
          add: "/good/goodBrand/add",
          edit: "/good/goodBrand/edit",
        },


        fileList:[],
        previewVisible:false,
        previewImage:[],
        images:[],
        headers:{}
      }
    },
    created () {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token": token};
    },
    methods: {

      previewhandleCancel() {
        this.previewVisible = false;
      },
      async handlePreview(file) {
        if (!file.url && !file.preview) {
          file.preview = await this.getBase64(file.originFileObj);
        }
        this.previewImage = file.url || file.preview;
        this.previewVisible = true;
      },
      handleChange({ fileList }) {
        this.fileList = fileList;


//根据图片变化获取图片地址信息


        let imgUrls=[];
        this.fileList.forEach(fl=>{
          console.log(fl,"上传文件返回的报文值！！！");
          if(fl.response) {
            imgUrls.push(fl.response.message);
          }
          if(fl.url){
            imgUrls.push(fl.url.sub(fl.url.sub.indexOf(this.getImgUrl()+2),fl.url.length));
          }
        });
        this.images=imgUrls;
        console.log(this.images,"图片地址结果")
      },
      getImgUrl(url){
        return window._CONFIG['imgDomainURL']+'/'+url;
      },
      getUplosdUrl(){
        return window._CONFIG['domianURL']+"/sys/common/upload";
      },


      getBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      },

      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);

        this.fileList=[];
        this.previewVisible=false;
        this.previewImage=[];
        this.images=[];


        if(this.model.id){
          this.images=JSON.parse(this.model.logoAddr);

          this.fileList.push({
            url:this.getImgUrl(this.images[0]),
            uid: 1,
            name: 'image.png',
            status: 'done',
          });

        }


        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'brandName','sort'))
		  //时间格式化
        });

      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            if(this.images.length==0){
              this.$message.warning("请上传品牌logo图片");
              return;
            }
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

            formData.logoAddr=JSON.stringify(this.images);



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
      handleCancel () {
        this.close()
      },


    }
  }
</script>

<style lang="less" scoped>

</style>