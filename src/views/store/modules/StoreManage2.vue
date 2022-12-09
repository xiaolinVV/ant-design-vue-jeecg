<!--分步表单-证件信息-->
<template>

  <div>
    <a-form style="max-width: 500px; margin: 40px auto 0;">
      <div v-if="step1Data[0].straight == 1">
        <h2>企业证件</h2>
        <a-form-item
          style="display: flex;"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="*统一信用代码">
          <a-input placeholder="请输入统一信用代码" v-model="AllData.socialCreditCode" style="width:400px;"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="*统一社会信用代码证：">
          <a-upload
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            :action="uploadAction"
            :data="{'isup':1}"
            :headers="headers"
            :beforeUpload="beforeUpload"
            @change="handleChange2"
          >
            <img preview="1" v-if="AllData.licenseForEnterprisePic" :src="AllData.licenseForEnterprisePic" alt="上传企业营业执照图片"
                 style="height:104px;max-width:300px"/>
            <div v-else>
              <a-icon :type="uploadLoading ? 'loading' : 'plus'"/>
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
        </a-form-item>
      </div>

      <h2>证件</h2>

      <a-form-item
        style="display: flex;"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="*经办人类型">
        <a-select
          placeholder="请选择经办人类型" v-model="AllData.agentType" >
          <a-select-option value="0">代办人</a-select-option>
          <a-select-option value="1" v-if="step1Data[0].straight == 0">本人</a-select-option>
          <a-select-option value="2" v-if="step1Data[0].straight == 1">法人本人</a-select-option>
        </a-select>
        <!--<j-dict-select-tag v-model="AllData.agentType" placeholder="请选择经办人类型"
                           dictCode="store_agent_type"/>-->
      </a-form-item>

      <a-form-item
        style="display: flex;"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="*姓名">
        <a-input placeholder="请输入姓名" v-model="AllData.agentName" style="width:350px;"/>
      </a-form-item>
      <p v-if="AllData.agentType == 0">
        请输入代办人姓名
      </p>
      <p v-if="AllData.agentType == 2">
        请填写法人姓名
      </p>
      <a-form-item
        style="display: flex;"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="*身份证号码">
        <a-input placeholder="请输入身份证号码" v-model="AllData.idCode" style="width:400px;"/>
      </a-form-item>
      <p v-if="AllData.agentType == 0">
        请填写代办人身份证号码
      </p>
      <p v-if="AllData.agentType == 2">
        请填写法人身份证号码
      </p>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="*身份证正面照片">
        <a-upload
          listType="picture-card"
          class="avatar-uploader"
          :showUploadList="false"
          :action="uploadAction"
          :data="{'isup':1}"
          :headers="headers"
          :beforeUpload="beforeUpload"
          @change="handleChange3"
        >
          <img preview="1" v-if="AllData.idPictureZPic" :src="AllData.idPictureZPic" alt="上传身份证正面照片"
               style="height:104px;max-width:300px"/>
          <div v-else>
            <a-icon :type="uploadLoading ? 'loading' : 'plus'"/>
            <div class="ant-upload-text">上传</div>
          </div>
        </a-upload>
      </a-form-item>
      <p v-if="AllData.agentType == 0">
        请上传代办人身份证正面
      </p>
      <p v-if="AllData.agentType == 2">
        请上传法人身份证正面
      </p>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="*身份证反面照片">
        <a-upload
          listType="picture-card"
          class="avatar-uploader"
          :showUploadList="false"
          :action="uploadAction"
          :data="{'isup':1}"
          :headers="headers"
          :beforeUpload="beforeUpload"
          @change="handleChange4"
        >
          <img preview="1" v-if="AllData.idPictureFPic" :src="AllData.idPictureFPic" alt="上传身份证反面照片"
               style="height:104px;max-width:300px"/>
          <div v-else>
            <a-icon :type="uploadLoading ? 'loading' : 'plus'"/>
            <div class="ant-upload-text">上传</div>
          </div>
        </a-upload>
      </a-form-item>
      <p v-if="AllData.agentType == 0">
        请上传代办人身份证反面
      </p>
      <p v-if="AllData.agentType == 2">
        请上传法人身份证反面
      </p>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="*手持身份证照片">
        <a-upload
          listType="picture-card"
          class="avatar-uploader"
          :showUploadList="false"
          :action="uploadAction"
          :data="{'isup':1}"
          :headers="headers"
          :beforeUpload="beforeUpload"
          @change="handleChange5"
        >
          <img preview="1" v-if="AllData.idHandPic" :src="AllData.idHandPic" alt="上传手持身份证照片" style="height:104px;max-width:300px"/>
          <div v-else>
            <a-icon :type="uploadLoading ? 'loading' : 'plus'"/>
            <div class="ant-upload-text">上传</div>
          </div>
        </a-upload>
      </a-form-item>
      <p v-if="AllData.agentType == 0">
        请上传代办人手持身份证
      </p>
      <p v-if="AllData.agentType == 2">
        请上传法人身份证正面
      </p>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-if="AllData.agentType==0"
        label="*授权书照片">
        <a-upload
          listType="picture-card"
          class="avatar-uploader"
          :showUploadList="false"
          :action="uploadAction"
          :data="{'isup':1}"
          :headers="headers"
          :beforeUpload="beforeUpload"
          @change="handleChange6"
        >
          <img preview="1" v-if="AllData.agentAuthorizationPic" :src="AllData.agentAuthorizationPic" alt="上传授权书照片"
               style="height:104px;max-width:300px"/>
          <div v-else>
            <a-icon :type="uploadLoading ? 'loading' : 'plus'"/>
            <div class="ant-upload-text">上传</div>
          </div>
        </a-upload>
      </a-form-item>

      <a-form-item :wrapperCol="{span: 19, offset: 5}">
        <a-button type="primary" @click="nextStep">下一步</a-button>
        <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
  import {httpAction,getAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  import {ACCESS_TOKEN} from "@/store/mutation-types"
  import {disabledAuthFilter} from "@/utils/authFilter"
  import Vue from 'vue'
  import {duplicateCheck} from '@/api/api'
  import AUpload from "ant-design-vue/es/upload/Upload";

  export default {
    name: "StoreManage2",
    components: {AUpload},
    props: [
      'step1Data'
    ],
    data() {
      return {
        title: "操作",
        visible: false,
        //代办人类型
        dbrclassify: 0,
        model: {},
        labelCol: {
          xs: {span: 24},
          sm: {span: 8},
        },
        wrapperCol: {
          xs: {span: 18},
          sm: {span: 15},
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        uploadLoading: false,
        headers: {},
        validatorRules: {},
        url: {
          add: "/storeManage/storeManage/add",
          edit: "/storeManage/storeManage/edit",
          fileUpload: window._CONFIG['domianURL'] + "/sys/common/upload",
          imgerver: window._CONFIG['domianURL'] + "/sys/common/view",
          identification: '/storeManage/storeManage/identification'
        },
        //所有数据
        AllData: {
          //步骤2
          step: '2',
          agentType: '',
          socialCreditCode: '', //信用代码
          agentName: '',
          idCode: '',
          //统一社会信用代码证图
          licenseForEnterprise: '',
          licenseForEnterprisePic: "",
          //身份证正面照
          idPictureZPic: "",
          idPictureZ: '',
          //身份证反面照
          idPictureFPic: "",
          idPictureF: '',
          //手持身份证照片
          idHand: '',
          idHandPic: "",
          //授权人证件照
          agentAuthorization: '',
          agentAuthorizationPic: "",
           status: "1",
           pickUpStatus: "0",
           distributionStatus: "0",
           attestationStatus: "0",
           delFlag: '0',
          cityDistributionType:"0",
          remark:"",
        },
      }
    },
    created() {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token": token};
      let StoreManageStep2 = localStorage.getItem('StoreManageStep2')
      if(StoreManageStep2){
        let data = JSON.parse(StoreManageStep2)
        let result = {
          //步骤2
          step: '2',
          agentType: data.agentType|| '',
          socialCreditCode: data.socialCreditCode|| '', //信用代码
          agentName: data.agentName|| '',
          idCode: data.idCode|| '',
          //统一社会信用代码证图
          licenseForEnterprise:data.licenseForEnterprise||  '',
          licenseForEnterprisePic: data.licenseForEnterprise?this.url.imgerver + '/' + data.licenseForEnterprise:'',
          //身份证正面照
          idPictureZPic: data.idPictureZ?this.url.imgerver + '/' + data.idPictureZ:'',
          idPictureZ: data.idPictureZ||  '',
          //身份证反面照
          idPictureFPic: data.idPictureF?this.url.imgerver + '/' + data.idPictureF:'',
          idPictureF: data.idPictureF||  '',
          //手持身份证照片
          idHand:data.idHand||  '',
          idHandPic:data.idHand?this.url.imgerver + '/' + data.idHand:'',
          //授权人证件照
          agentAuthorization:data.agentAuthorization||  '',
          agentAuthorizationPic:data.agentAuthorization?this.url.imgerver + '/' + data.agentAuthorization:'',

          status:data.status||  "1",
          pickUpStatus:data.pickUpStatus||  "0",
          distributionStatus: data.distributionStatus|| "0",
          attestationStatus: data.attestationStatus|| "0",
          delFlag: data.delFlag|| '0',
          cityDistributionType:data.cityDistributionType|| "0",
          remark:data.remark|| '',
          logoAddrShowUrl: data.logoAddr?this.url.imgerver + '/' + data.logoAddr:'',
          storePictureShowUrl:data.storePicture?this.url.imgerver + '/' + data.storePicture:'',
          accordingStoreShowUrl:data.accordingStore?this.url.imgerver + '/' + data.accordingStore:'',
        }
        if(this.step1Data[0].straight == 1 && result.agentType == 1){
          result.agentType = "0"
        }
        this.AllData = result;
        return;
      }
      getAction(this.url.identification).then(res => {
        let data = res.result
        if(data.areaAddress){
          this.areaAddressList = data.areaAddress.split(',')
        }else{
          this.areaAddressList = []
        }
        let result = {
          //步骤2
          step: '2',
          agentType: data.agentType|| '',
          socialCreditCode: data.socialCreditCode|| '', //信用代码
          agentName: data.agentName|| '',
          idCode: data.idCode|| '',
          //统一社会信用代码证图
          licenseForEnterprise:data.licenseForEnterprise||  '',
          licenseForEnterprisePic: data.licenseForEnterprise?this.url.imgerver + '/' + data.licenseForEnterprise:'',
          //身份证正面照
          idPictureZPic: data.idPictureZ?this.url.imgerver + '/' + data.idPictureZ:'',
          idPictureZ: data.idPictureZ||  '',
          //身份证反面照
          idPictureFPic: data.idPictureF?this.url.imgerver + '/' + data.idPictureF:'',
          idPictureF: data.idPictureF||  '',
          //手持身份证照片
          idHand:data.idHand||  '',
          idHandPic:data.idHand?this.url.imgerver + '/' + data.idHand:'',
          //授权人证件照
          agentAuthorization:data.agentAuthorization||  '',
          agentAuthorizationPic:data.agentAuthorization?this.url.imgerver + '/' + data.agentAuthorization:'',

          status:data.status||  "1",
          pickUpStatus:data.pickUpStatus||  "0",
          distributionStatus: data.distributionStatus|| "0",
          attestationStatus: data.attestationStatus|| "0",
          delFlag: data.delFlag|| '0',
          cityDistributionType:data.cityDistributionType|| "0",
          remark:data.remark|| '',
          logoAddrShowUrl: data.logoAddr?this.url.imgerver + '/' + data.logoAddr:'',
          storePictureShowUrl:data.storePicture?this.url.imgerver + '/' + data.storePicture:'',
          accordingStoreShowUrl:data.accordingStore?this.url.imgerver + '/' + data.accordingStore:'',
        }
//
//        data.logoAddrShowUrl = this.url.imgerver + '/' + data.logoAddr
//        data.storePictureShowUrl = this.url.imgerver + '/' + data.storePicture
//        data.accordingStoreShowUrl = this.url.imgerver + '/' + data.accordingStore
         //授权人证件照
//          data.agentAuthorizationPic = this.url.imgerver + '/' + data.agentAuthorization
          //统一社会信用代码证图
//          data.licenseForEnterprisePic = this.url.imgerver + '/' + data.licenseForEnterprise
          //身份证正面照
//          data.idPictureZPic = this.url.imgerver + '/' + data.idPictureZ
          //身份证反面照
//          data.idPictureFPic = this.url.imgerver + '/' + data.idPictureF
          //手持身份证照片
//          data.idHandPic = this.url.imgerver + '/' + data.idHand
        this.AllData = result
      })

    },

    computed: {
      uploadAction: function () {
        return this.url.fileUpload;
      },

    },
    methods: {
      nextStep() {
        if(!this.formCheck()){
          return false;
        }
        this.$emit('nextStep', this.AllData)
        console.log(this.AllData)
        debugger;
        localStorage.setItem('StoreManageStep2', JSON.stringify(this.AllData))
      },
      prevStep() {
        this.$emit('prevStep')
      },
      //图片校验
      beforeUpload: function (file) {
        var fileType = file.type;
        if (fileType.indexOf('image') < 0) {
          this.$message.warning('请上传图片');
          return false;
        }
        //TODO 验证文件大小
      },
      //企业营业执照上传
      handleChange2(info) {
        if (info.file.status === 'uploading') {
          this.uploadLoading = true;
          return
        }
        if (info.file.status === 'done') {
          let response = info.file.response;
          this.uploadLoading = false;
          this.AllData.licenseForEnterprise = response.message
          this.AllData.licenseForEnterprisePic = this.url.imgerver + "/" + response.message
          if (!response.success) {
            this.$message.warning(response.message);
          }
        }
      },
      //身份证正面照片
      handleChange3(info) {
        if (info.file.status === 'uploading') {
          this.uploadLoading = true;
          return
        }
        if (info.file.status === 'done') {
          let response = info.file.response;
          this.uploadLoading = false;
          this.AllData.idPictureZ = response.message
          this.AllData.idPictureZPic = this.url.imgerver + "/" + response.message
          if (!response.success) {
            this.$message.warning(response.message);
          }
        }
      },
      //身份证反面照片
      handleChange4(info) {
        if (info.file.status === 'uploading') {
          this.uploadLoading = true;
          return
        }
        if (info.file.status === 'done') {
          let response = info.file.response;
          this.uploadLoading = false;
          this.AllData.idPictureF = response.message
          this.AllData.idPictureFPic = this.url.imgerver + "/" + response.message
          if (!response.success) {
            this.$message.warning(response.message);
          }
        }
      },
      //手持身份证照片
      handleChange5(info) {
        if (info.file.status === 'uploading') {
          this.uploadLoading = true;
          return
        }
        if (info.file.status === 'done') {
          let response = info.file.response;
          this.uploadLoading = false;
          this.AllData.idHand = response.message
          this.AllData.idHandPic = this.url.imgerver + "/" + response.message
          if (!response.success) {
            this.$message.warning(response.message);
          }
        }
      },
      //授权书照片
      handleChange6(info) {
        let response = info.file.response;
        if (info.file.status === 'uploading') {
          this.uploadLoading = true;
          return
        }
        if (info.file.status === 'done') {
          this.uploadLoading = false;
          this.AllData.agentAuthorization = response.message
          this.AllData.agentAuthorizationPic = this.url.imgerver + "/" + response.message
          if (!response.success) {
            this.$message.warning(response.message);
          }
        }
      },
      //校验
      formCheck() {
        let data = this.AllData,
          nameReg = /^[\u4e00-\u9fa5]{2,4}$/, //姓名校验
          IDReg = new RegExp(/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/)
        /*if (!data.socialCreditCode) {
          this.$message.warn('请填写统一信用代码')
          return false;
        }*/
        /*if (!data.licenseForEnterprise) {
          this.$message.warn('请上传企业营业执照图')
          return false;
        }*/
        if (data.agentType + '' == '') {
          this.$message.warn('请选择经办人类型');
          return false;
        }
        if (!nameReg.test(data.agentName)) {
          this.$message.warn('证件姓名格式不正确');
          return false;
        }
        if (!IDReg.test(this.AllData.idCode)) {
          this.$message.warning('证件身份证格式错误');
          return false;
        }
        if (!data.idPictureZ) {
          this.$message.warn('请上传身份证正面照')
          return false;
        }
        if (!data.idPictureF) {
          this.$message.warn('请上传身份证反面照')
          return false;
        }
        if (!data.idHand) {
          this.$message.warn('请上传手持身份证照片')
          return false;
        }
       /* if (!data.agentAuthorization && data.agentType == 0) {
          this.$message.warn('请上传授权书照片')
          return false;
        }*/
        return true
      }
    },
  }
</script>
<style scoped>
</style>