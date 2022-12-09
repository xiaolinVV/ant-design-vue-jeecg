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
          v-if="type==1"
          label="上级名称">
          {{myparentSeries.seriesName}}
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="系列名称">
          <a-input placeholder="请输入系列名称" v-decorator="['seriesName', { rules: [{ required: true, message: '请输入系列名称' }] }]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          v-if="type==0"
          :wrapperCol="wrapperCol"
          label="是否支持子级">
          <a-radio-group v-decorator="['hasChild', {}]">
            <a-radio value="0">否</a-radio>
            <a-radio value="1">是</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          v-if="type==0"
          :wrapperCol="wrapperCol"
          label="标签">
          <a-input placeholder="请输入标签" v-decorator="['label', { rules: [{ required: true, message: '请输入标签' }] }]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="图片">
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
          <a-modal :visible="previewVisible" :footer="null" @cancel="previewhandleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="type==1"
          label="摘要">
          <a-input placeholder="请输入摘要" v-decorator="['seriesAbstract', { rules: [{ required: true, message: '请输入摘要' }] }]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="type==1"
          label="简介">
          <JEditor v-model="briefIntroduction"> </JEditor>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="排序">
          <a-input-number style="width: 100%" placeholder="请输入排序" v-decorator="['sort', { rules: [{ required: true, message: '请输入排序' }] }]" />
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import Vue from 'vue'
  import {ACCESS_TOKEN} from "@/store/mutation-types"
  import ATextarea from 'ant-design-vue/es/input/TextArea'
  import JEditor from '@/components/jeecg/JEditor'

  export default {
    name: "StoreSeriesManageModal",
    components: { ATextarea,JEditor },
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
          add: "/store/storeSeriesManage/add",
          edit: "/store/storeSeriesManage/edit",
        },
        type:'',
        fileList:[],
        previewVisible:false,
        previewImage:[],
        images:[],
        headers:{},
        briefIntroduction:'',
        myparentSeries:{}
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
      edit (record,myparentSeries={}) {
        console.log(record);
        this.type=record.type;
        if(this.type==1) {
          this.myparentSeries = myparentSeries;
          console.log('parentSeries:', this.myparentSeries);
        }
        this.form.resetFields();
        this.model = Object.assign({}, record);
        if(!record.id){
          this.model.hasChild='0';
          this.briefIntroduction='';
          this.images=[];
          this.fileList=[];
        }else{
          this.images=[];
          this.fileList=[];
          this.images.push(record.picture);
          this.fileList.push({
            url:this.getImgUrl(record.picture),
            uid: 1,
            name: 'image.png',
            status: 'done',
          });
          this.briefIntroduction=record.briefIntroduction;
        }
        this.visible = true;
        console.log('model:',this.model);
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'seriesName','hasChild','label','seriesAbstract','sort'))
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
            if(this.type==1&&!this.briefIntroduction){
              this.$message.warning('请填写简介内容');
              return;
            }
            if(this.images.length==0){
              this.$message.warning('请填上传图片');
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
            formData.briefIntroduction=this.briefIntroduction;
            formData.picture=this.images[0];
            if(this.type==1){
              formData.parentId=this.myparentSeries.id;
            }
            //时间格式化

            console.log(formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                if(this.type==0){
                  that.$emit('ok');
                }
                if(this.type==1){
                  that.$emit('myOk');
                }

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