<!--认证分布表单-->
<template>
  <a-card :bordered="false">
    <a-steps class="steps" :current="currentTab">
      <a-step title="基本信息" />
      <a-step title="证件信息" />
      <a-step title="确认信息" />
      <a-step title="提交审核" />
    </a-steps>
    <div class="content">
      <step1 v-if="currentTab === 0" @nextStep="nextStep" />
      <step2 v-if="currentTab === 1" @nextStep="nextStep" @prevStep="prevStep"  :step1Data="totalData"/>
      <step3 v-if="currentTab === 2" @nextStep="nextStep" @prevStep="prevStep"  :Alldata="totalData" />
      <step4 v-if="currentTab === 3" @prevStep="prevStep" @finish="finish"/>
    </div>
  </a-card>
</template>

<script>
  import Step1 from './StoreManage1'
  import Step2 from './StoreManage2'
  import Step3 from './StoreManage3'
  import Step4 from './StoreManage4'
  import {httpAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import {ACCESS_TOKEN} from "@/store/mutation-types"
  import {disabledAuthFilter} from "@/utils/authFilter"
  import Vue from 'vue'
  import {getAction} from '@/api/manage'
  import {duplicateCheck} from '@/api/api'
  import AUpload from "ant-design-vue/es/upload/Upload";
  export default {
    name: "StoreManageFrom",
    components: {
      Step1,
      Step2,
      Step3,
      Step4,
      AUpload
    },
    data () {
      return {
        description: '将一个冗长或用户不熟悉的表单任务分成多个步骤，指导用户完成。',
        currentTab: 0,
        title: "提交",
        visible: false,
        model: {},
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },

        confirmLoading: false,
        form: this.$form.createForm(this),
        uploadLoading: false,
        picUrl: "",
        picUrl1: "",
        picUrl2: "",
        headers: {},
        headers1: {},
        validatorRules: {},
        url: {
          add: "/storeManage/storeManage/add",
          edit: "/storeManage/storeManage/edit",
          fileUpload: window._CONFIG['domianURL'] + "/sys/common/upload",
          imgerver: window._CONFIG['domianURL'] + "/sys/common/view",
        },
        totalData:[

        ],
      }
    },
    created () {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token": token}
      this.headers1 = {"X-Access-Token": token}
    },
    computed: {
      uploadAction: function () {
        return this.url.fileUpload;
      },
      uploadAction1: function () {
        return this.url1.fileUpload1;
      },
    },
    methods: {

      // handler
      nextStep (info) {
        if(this.currentTab < 2 ){
          this.totalData.push(info)
        }
        if (this.currentTab < 3) {
          this.currentTab += 1
        }
      },
      prevStep () {
        if (this.currentTab > 0) {
          this.currentTab -= 1
          this.totalData.pop()
        }
      },
      finish () {
        this.currentTab = 0
      },
      onChange(value) {
        console.log(value);
      },
      getLogoAddrView(){
        console.log(this.url.imgerver + "/" + this.model.logoAddr)
        return this.url.imgerver + "/" + this.model.logoAddr;
      },
      getStorePictureView(){
        console.log(this.url.imgerver + "/" + this.model.storePicture)
        return this.url.imgerver + "/" + this.model.storePicture;
      },
      getLicenseForEnterpriseView(){
        console.log(this.url.imgerver + "/" + this.model.licenseForEnterprise)
        return this.url.imgerver + "/" + this.model.licenseForEnterprise;
      },
      getIdPictureZView(){
        console.log(this.url.imgerver + "/" + this.model.idPictureZ)
        return this.url.imgerver + "/" + this.model.idPictureZ;
      },
      getIdPictureFView(){
        console.log(this.url.imgerver + "/" + this.model.idPictureF)
        return this.url.imgerver + "/" + this.model.idPictureF;
      },
      getIdHandView(){
        console.log(this.url.imgerver + "/" + this.model.idHand)
        return this.url.imgerver + "/" + this.model.idHand;
      },
      getAgentAuthorizationView(){
        console.log(this.url.imgerver + "/" + this.model.agentAuthorization)
        return this.url.imgerver + "/" + this.model.agentAuthorization;
      },
      getAccordingStoreView(){
        console.log(this.url.imgerver + "/" + this.model.accordingStore)
        return this.url.imgerver + "/" + this.model.accordingStore;
      },
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.model.delFlag = 0;
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'year','month','day','sysUserId','storeName','subStoreName','logoAddr','storePicture','sysAreaId','areaAddress','storeAddress','openType','money','mainType','nextType','comprehensiveEvaluation','bossName','bossPhone','takeOutPhone','longitude','latitude','status','attestationStatus','remark','licenseForEnterprise','idCode','idPictureZ','idPictureF','delFlag','agentType','agentName','idHand','agentAuthorization','payStatus','payType','grade','accordingStore','straight'))
          //时间格式化
          this.form.setFieldsValue({startTime: this.model.startTime ? moment(this.model.startTime) : null})
          this.form.setFieldsValue({endTime: this.model.endTime ? moment(this.model.endTime) : null})
          this.form.setFieldsValue({payTime:this.model.payTime?moment(this.model.payTime):null})
        });
//预览显示图片
        /*if(record.hasOwnProperty("id")){
         this.logoAddrPic = "Has no pic url yet";
         }*/
        this.logoAddrPic = this.model.logoAddr;
        this.storePicturePic = this.model.storePicture;
        this.licenseForEnterprisePic = this.model.licenseForEnterprise;
        this.idPictureZPic = this.model.idPictureZ;
        this.idPictureFPic = this.model.idPictureF;
        this.idHandPic = this.model.idHand;
        this.agentAuthorizationPic = this.model.agentAuthorization;
        this.accordingStorePic = this.model.accordingStore;
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
          that.confirmLoading = true;
          let httpurl = '';
          let method = '';
          if (!this.model.id) {
            httpurl += this.url.add;
            method = 'post';
          } else {
            httpurl += this.url.edit;
            method = 'put';
          }
          let formData = Object.assign(this.model, values);
          //时间格式化
          formData.startTime = formData.startTime ? formData.startTime.format('YYYY-MM-DD HH:mm:ss') : null;
          formData.endTime = formData.endTime ? formData.endTime.format('YYYY-MM-DD HH:mm:ss') : null;
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
    handleCancel () {
      this.close()
    },


  }}
</script>

<style lang="scss" scoped>
  .steps {
    max-width: 750px;
    margin: 16px auto;
  }
</style>