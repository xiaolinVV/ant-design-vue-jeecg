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
          label="广告标题">
          <a-input placeholder="请输入广告标题" v-decorator="['advertisingTitle', { rules: [{ required: true, message: '请输入广告标题' }] }]" />
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
          label="跳转类型">
        <a-radio-group v-model="jumpType" v-decorator="['jumpType', {}]">
          <a-radio value="0">无</a-radio>
          <a-radio value="1">店铺</a-radio>
        </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="jumpType==1"
          label="跳转">
          <a-select showSearch :options="options" :filterOption="filterOption" v-decorator="['jumpId', { rules: [{ required: true, message: '请选择商户' }] }]"></a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="排序">
          <a-input-number style="width: 50%" v-decorator="[ 'sort', { rules: [{ required: true, message: '请输入排序' }] }]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="开始时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'startTime', { rules: [{ required: true, message: '选择开始时间' }] }]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="结束时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'endTime', { rules: [{ required: true, message: '选择结束时间' }] }]" />
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
  import {getAction} from '@/api/manage';

  export default {
    name: "StoreSeriesAdvertisingModal",
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
          add: "/store/storeSeriesAdvertising/add",
          edit: "/store/storeSeriesAdvertising/edit",
          getAllStoreList:"storeManage/storeManage/getAllStoreList"
        },
        fileList:[],
        previewVisible:false,
        previewImage:[],
        images:[],
        headers:{},
        jumpType:'',
        options:[]
      }
    },
    created () {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token": token};
    },
    methods: {
      getAllStoreList(){
        getAction(this.url.getAllStoreList, {}).then((res) => {

          if (res.success) {
            console.log(res.result);
            this.options=[];
            for (let r of res.result) {
              this.options.push({
                value:r.id,
                label:r.storeName+"("+r.bossPhone+")"
              });
            }
          } else {
            this.$message.warning(res.message);
          }
        });
      },
      filterOption(inputValue, option){
        return option.componentOptions.children[0].text.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
      },

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
      add () {
        this.edit({});
      },
      edit (record) {
        this.getAllStoreList();
        if(!record.id){
          this.images=[];
          this.fileList=[];
          record.jumpType="0";
          this.jumpType="0";
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
          this.jumpType=record.jumpType;
        }
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'advertisingTitle','jumpType','jumpId','sort'))
		  //时间格式化
          this.form.setFieldsValue({startTime:this.model.startTime?moment(this.model.startTime):null})
          this.form.setFieldsValue({endTime:this.model.endTime?moment(this.model.endTime):null})
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
              this.$message.warning('请上传图片');
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
            formData.picture=this.images[0];
            //时间格式化
            formData.startTime = formData.startTime?formData.startTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.endTime = formData.endTime?formData.endTime.format('YYYY-MM-DD HH:mm:ss'):null;

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