<template>
<div>
  <a-upload
    :action="getUplosdUrl"
    :headers="headers"
    accept="image/*"
    list-type="picture-card"
    :file-list="fileList"
    :multiple="imgCount>1"
    @preview="handlePreview"
    @change="handleChange"
  >
    <div v-if="fileList.length < imgCount">
      <a-icon type="plus" />
      <div class="ant-upload-text">
        上传图片
      </div>
    </div>
  </a-upload>
  <span v-if="explain">{{explain}}</span>
  <a-modal :visible="previewVisible" :footer="null" @cancel="previewhandleCancel">
    <img alt="example" style="width: 100%" :src="previewImage" />
  </a-modal>
</div>
</template>

<script>
  import Vue from 'vue'
  import {ACCESS_TOKEN} from "@/store/mutation-types"
  export default {
    name: 'KqUpload',
    props:{
      imgCount:{
        type:Number,
        default:999
      },
      explain:{
        type:String,
        default:''
      }
    },
    data(){
      return{
        fileList:[],
        previewVisible:false,
        previewImage:[],
        headers:{}
      }
    },
    created () {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token": token};
    },
    methods:{
      init(imgs){
        this.fileList=[];
        let index = 0;
        for (let m of imgs) {
          this.fileList.push({
            url: this.getImgUrl(m),
            uid: index,
            name: 'image.png',
            status: 'done',
          });
          index++;
        }
        console.log('fileList:', this.fileList);
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
            console.log('上传图片地址',fl.url);
            let imgDomainURL = window._CONFIG['imgDomainURL']+'/'
            imgUrls.push(fl.url.substr(imgDomainURL.length));
          }
        });
        this.$emit('change',imgUrls);
        console.log(imgUrls,"图片地址结果")
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

<style scoped>

</style>