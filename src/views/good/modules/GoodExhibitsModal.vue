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
          label="归属店铺">
          <a-select showSearch :options="options" :filterOption="filterOption" v-decorator="['storeManageId', { rules: [{ required: true, message: '请选择商户' }] }]"></a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="名称">
          <a-input placeholder="请输入名称" v-decorator="['exhibitsName', { rules: [{ required: true, message: '请输入名称' }] }]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="描述">
          <a-textarea placeholder="请输入描述" v-decorator="['exhibitsDescribe', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="主图">
          <a-upload
            :action="getUplosdUrl"
            :headers="headers"
            accept="image/*"
            list-type="picture-card"
            :file-list="mainfileList"
            @preview="mainhandlePreview"
            @change="mainhandleChange"
          >
            <div v-if="mainfileList.length < 5">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                Upload
              </div>
            </div>
          </a-upload>
          <a-modal :visible="mainpreviewVisible" :footer="null" @cancel="mainpreviewhandleCancel">
            <img alt="example" style="width: 100%" :src="mainpreviewImage" />
          </a-modal>
        </a-form-item>


        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="视频">
          <a-upload :action="getUplosdUrl" :headers="headers" :multiple="true" :file-list="fileList" @change="handleChange" > <a-button v-if="fileList.length<1"> Upload </a-button></a-upload>
        </a-form-item>



        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="详情图">
          <a-upload
            :action="getUplosdUrl"
            :headers="headers"
            accept="image/*"
            list-type="picture-card"
            :file-list="detailfileList"
            @preview="detailhandlePreview"
            @change="detailhandleChange"
          >
            <div v-if="detailfileList.length < 5">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                Upload
              </div>
            </div>
          </a-upload>
          <a-modal :visible="detailpreviewVisible" :footer="null" @cancel="detailpreviewhandleCancel">
            <img alt="example" style="width: 100%" :src="detailpreviewImage" />
          </a-modal>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import {getAction} from '@/api/manage';
  import ATextarea from 'ant-design-vue/es/input/TextArea'
  import Vue from 'vue'
  import {ACCESS_TOKEN} from "@/store/mutation-types"

  export default {
    name: "GoodExhibitsModal",
    components: { ATextarea },
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
        options:[],
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        },
        url: {
          add: "/good/goodExhibits/add",
          edit: "/good/goodExhibits/edit",
          getAllStoreList:"storeManage/storeManage/getAllStoreList"
        },
        //主图
        mainfileList:[],
        mainpreviewVisible:false,
        mainpreviewImage:[],
        mainimages:[],
        //详情
        detailfileList:[],
        detailpreviewVisible:false,
        detailpreviewImage:[],
        detailimages:[],
        //视频
        fileList:[],
        fileses:[],

        headers:{}
      }
    },
    created () {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token": token};
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        //主图，视频，详情图初始化处理
        this.mainfileList=[];
        this.mainimages=[];
        this.detailimages=[];
        this.detailfileList=[];
        this.fileList=[];
        this.fileses=[];
        if(this.options.length==0) {
          this.getAllStoreList();
        }
        this.form.resetFields();
        this.model = Object.assign({}, record);
        if(record.id){
          //主图
          this.mainimages=JSON.parse(record.mainPicture);
          let mainPictureIndex=0;
          for(let m of this.mainimages){
            this.mainfileList.push({
              url:this.getImgUrl(m),
              uid: mainPictureIndex,
              name: 'image.png',
              status: 'done',
            });
            mainPictureIndex++;
          }
          console.log('mainFileList:',this.mainfileList);
          //详情图
          this.detailimages=JSON.parse(record.detailsFigure);
          let detailPictureIndex=0;
          for(let m of this.detailimages){
            this.detailfileList.push({
              url:this.getImgUrl(m),
              uid: detailPictureIndex,
              name: 'image.png',
              status: 'done',
            });
            detailPictureIndex++;
          }
          console.log('detailimages:',this.detailimages);
        }
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'serialNumber','exhibitsName','storeManageId','exhibitsDescribe'))
		  //时间格式化
        });

      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
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
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            //验证判断
            if(this.mainimages.length==0){
              this.$message.warning("请提交主图");
              return;
            }
            if(this.detailimages.length==0){
              this.$message.warning("请提交详情图");
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
            //时间格式化
            formData.mainPicture=JSON.stringify(this.mainimages);
            formData.detailsFigure=JSON.stringify(this.detailimages);
            formData.video=JSON.stringify(this.fileses);
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
      //主图
      mainpreviewhandleCancel() {
        this.mainpreviewVisible = false;
      },
      async mainhandlePreview(file) {
        if (!file.url && !file.preview) {
          file.preview = await this.getBase64(file.originFileObj);
        }
        this.mainpreviewImage = file.url || file.preview;
        this.mainpreviewVisible = true;
      },
      mainhandleChange({ fileList }) {
        this.mainfileList = fileList;

//根据图片变化获取图片地址信息

        let imgUrls=[];
        this.mainfileList.forEach(fl=>{
          console.log(fl,"上传文件返回的报文值！！！");
          if(fl.response) {
            imgUrls.push(fl.response.message);
          }
          if(fl.url){
            imgUrls.push(fl.url.sub(fl.url.sub.indexOf(this.getImgUrl()+2),fl.url.length));
          }
        });
        this.mainimages=imgUrls;
        console.log(this.mainimages,"图片地址结果")
      },



      //详情
      detailpreviewhandleCancel() {
        this.detailpreviewVisible = false;
      },
      async detailhandlePreview(file) {
        if (!file.url && !file.preview) {
          file.preview = await this.getBase64(file.originFileObj);
        }
        this.detailpreviewImage = file.url || file.preview;
        this.detailpreviewVisible = true;
      },
      detailhandleChange({ fileList }) {
        this.detailfileList = fileList;

//根据图片变化获取图片地址信息

        let imgUrls=[];
        this.detailfileList.forEach(fl=>{
          console.log(fl,"上传文件返回的报文值！！！");
          if(fl.response) {
            imgUrls.push(fl.response.message);
          }
          if(fl.url){
            imgUrls.push(fl.url.sub(fl.url.sub.indexOf(this.getImgUrl()+2),fl.url.length));
          }
        });
        this.detailimages=imgUrls;
        console.log(this.detailimages,"图片地址结果")
      },


      //视频
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
        this.fileses=imgUrls;
        console.log(this.fileses,"文件地址结果")
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

    }
  }
</script>

<style lang="less" scoped>

</style>