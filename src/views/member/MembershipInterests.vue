<template>
    <a-card class="MembershipInterests" ref="MembershipInterests">
      <a-spin :spinning="confirmLoading">
        <h2 class="title">
          会员权益
        </h2>
        <a-form :form="form">
          <a-form-item label="标题" :label-col="labelCol" :wrapper-col="wrapperCol">
            <!--          v-model="AllData.name"-->
            <a-input
              v-decorator="['title',verificationRules.title]"
              placeholder="请输入标题"/>
          </a-form-item>

          <a-form-item label="会员权益" :label-col="labelCol" :wrapper-col="wrapperCol">
            <!--          v-model="AllData.name"-->
            <j-editor v-decorator="[ 'equities',verificationRules.equities  ]" triggerChange></j-editor>
          </a-form-item>

          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" validate-status="error"
                       help="尺寸800*640 ，支持jpg、jpeg、png格式，大小不超过2M">
          <span slot="label">
              <span class="dataCheckedStar">
                *
              </span>
            <span>
              分享图
            </span>

         </span>
            <a-upload
              :action="uploadAction"
              listType="picture-card"
              :fileList="coverPlanFileList"
              @preview="coverPlanPreview"
              @change="coverPlanChange"
              :headers="headers"
              :beforeUpload="coverPlanUpload"
            >
              <div v-if="coverPlanFileList.length < 1">
                <a-icon type="plus"/>
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
            <a-modal :visible="coverPlanVisible" :footer="null" @cancel="coverPlanCancel">
              <img preview="1" alt="example" style="width: 100%" :src="coverPlanImage"/>
            </a-modal>
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" validate-status="error"
                       help="尺寸1428*2540，支持jpg、jpeg、png格式，大小不超过2M。必须预留好二维码位置。以免影响展示效果。">
          <span slot="label">
            <span class="dataCheckedStar">
                *
              </span>
            <span>
              海报图
            </span>
         </span>
            <a-upload
              :action="uploadAction"
              listType="picture-card"
              :fileList="postersFileList"
              @preview="postersPreview"
              @change="postersChange"
              :headers="headers"
              :beforeUpload="postersUpload"
            >
              <div v-if="postersFileList.length < 1">
                <a-icon type="plus"/>
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
            <a-modal :visible="postersVisible" :footer="null" @cancel="postersCancel">
              <img preview="1" alt="example" style="width: 100%" :src="postersImage"/>
            </a-modal>
          </a-form-item>
        </a-form>
        <div class="button-operation">
          <a-button @click="cancel">
            取消
          </a-button>
          <a-button type="primary" @click="sure">
            确认
          </a-button>
        </div>
      </a-spin>

    </a-card>
</template>

<script>
  import JEditor from '@/components/jeecg/JEditor'
  import Vue from 'vue'
  import { getAction,postAction } from '@/api/manage'
  export default {
    name: 'MembershipInterests',
    data(){
      return{
        form: this.$form.createForm(this),
        confirmLoading:false,
        wrapperCol:{ span: 12 },
        labelCol: { span: 2 },
        uploadAction: window._CONFIG['domianURL'] + '/sys/common/upload',
        //配置
        configure: {
          imgErver: window._CONFIG['domianURL'] + '/sys/common/view'
        },
        allData:{
          title:'',
          equities:'',
          coverPlan:'',
          id:'',
          posters:'',
        },
        verificationRules:{
          title: { rules: [{ required: true, message: '请输入标题' },{max:50,message:'字数不能超过50个字'}] },
          equities:{ rules: [{ required: true, message: '请输入会员权益' }] },
        },
        //分享图 配置
        coverPlanFileList: [],
        coverPlanVisible: false,
        coverPlanImage: '',
        coverPlanPic: true,
        //海报图 配置
        postersFileList: [],
        postersVisible: false,
        postersImage: '',
        postersPic: true,
        headers: '',
        url:{
          returnMemberEquities:"memberEquities/memberEquities/returnMemberEquities",  //返显
          setMemberEquities:"/memberEquities/memberEquities/setMemberEquities",//提交
        }
      }
    },
    components:{
      JEditor
    },
    created(){
      const token = Vue.ls.get('Access-Token')
      this.headers = { 'X-Access-Token': token }
      this.load();
    },
    methods:{
      load(){
        this.confirmLoading = true
        getAction(this.url.returnMemberEquities).then(res=>{
          this.confirmLoading = false
          if(res.result && res.success){
            this.allData = res.result;
            this.$nextTick(()=>{
              this.previewImage(res.result.posters,"postersFileList")
              this.previewImage(res.result.coverPlan,"coverPlanFileList")
              this.form.setFieldsValue(this.allData)
            })
          }else if(!res.success){
            this.$message.warn(res.message)
          }
        })
      },
      sure(){
        this.form.validateFields((err, values) => {
          if(!this.imageUpLoad()) return;
          if (!err){
            this.submitImage('coverPlanFileList','coverPlan');
            this.submitImage('postersFileList','posters');
            this.allData = Object.assign({}, this.allData, values)
            this.$nextTick(()=>{
              postAction(this.url.setMemberEquities,this.allData).then(res=>{
                if(res.success){
                  this.$message.success(res.message || '提交成功！')
                  this.load()
                }else{
                  this.$message.warn(res.message || '提交失败！')
                }
              })
            })
          }
        })
      },
      cancel(){

      },
      //上传 分享图
      coverPlanUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJpgOrPng) {
          this.$message.error('图片必须为jpeg，png,jpg格式!')
        }
        if (!isLt2M) {
          this.$message.error('图片大小必须在2M以内!')
        }
        this.coverPlanPic = isLt2M && isJpgOrPng
        return isLt2M && isJpgOrPng
      },
      coverPlanCancel() {
        this.coverPlanVisible = false
      },
      coverPlanPreview(file) {
        this.coverPlanImage = file.url || file.thumbUrl
        this.coverPlanVisible = true
      },
      coverPlanChange({ fileList }) {
        if (this.coverPlanPic) {
          this.coverPlanFileList = fileList
        }
      },
      //上传 海报图
      postersUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJpgOrPng) {
          this.$message.error('图片必须为jpeg，png,jpg格式!')
        }
        if (!isLt2M) {
          this.$message.error('图片大小必须在2M以内!')
        }
        this.postersPic = isLt2M && isJpgOrPng
        return isLt2M && isJpgOrPng
      },
      postersCancel() {
        this.postersVisible = false
      },
      postersPreview(file) {
        this.postersImage = file.url || file.thumbUrl
        this.postersVisible = true
      },
      postersChange({ fileList }) {
        if (this.postersPic) {
          this.postersFileList = fileList
        }
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
        that.allData[allDataImageName] = JSON.stringify(list)
      },
      //图片上传校验
      imageUpLoad() {
        if(this.coverPlanFileList.length <= 0){
          this.$message.warn('请上传分享图');
          return false
        }
        if(this.postersFileList.length <= 0){
          this.$message.warn('请上传海报图');
          return false
        }
        return true

      },
    }
  }
</script>

<style scoped lang="scss">
  .title {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    padding: 0 5px 0 20px;
    align-items: center;
    /*border-bottom: 1px solid gray;*/
    font-weight: 600;
    margin-bottom: 20px;

  /*span:nth-child(2) {*/
  /*  padding: 15px;*/
  /*  cursor: pointer;*/
  /*}*/
  }
  .button-operation {
    display: flex;
    justify-content: space-between;
    width: 200px;
    margin: 0 auto;

    button {
      width: 80px;
    }
  }
  .button-end {
    padding-bottom: 40px;
    border-bottom: 1px solid gray;
  }
</style>