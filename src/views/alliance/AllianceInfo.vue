<!--加盟商信息页面-->
<template>
  <a-card :bordered="false">
    <a-form style="max-width: 100%; margin: 40px auto 0;">
      <a-alert
        :closable="true"
        message="重要提示：加盟商信息由平台设定，如信息有误请联系管理员。"
        style="margin-bottom: 24px;"
      />
    </a-form>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="加盟商编号">
          {{AllData.id}}
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="用户账号">
          {{AllData.username}}
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
              头像
          </span>
          <a-upload
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            :action="uploadAction"
            :data="{'isup':1}"
            :headers="headers"
            :beforeUpload="logoBeforeUpload"
            @change="handleChange"
          >
            <img v-if="AllData.logoShowAddr" :src="AllData.logoShowAddr" alt="上传"
                 style="height:104px;max-width:300px"/>
            <div v-else>
              <a-icon :type="uploadLoading ? 'loading' : 'plus'"/>
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
          <div>
            支持jpg、jpeg、png格式，大小不超过500k
          </div>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="公司名称">
          {{AllData.name}}
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="用户名字">
          {{AllData.realname}}
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="手机号码">
          {{AllData.phone}}
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="所在城市">
          <a-cascader :options="cityAllData" @change="cityAllDataChange" :loadData="cityAllDataLoad"
                      changeOnSelect
                      v-decorator="[
          'defaultCity',
          {
          initialValue:defaultCity,
            rules: [
              {
                required: true,
                message: '请选择所在城市!',
              }
            ],
          },
        ]"
                      v-if="canShowDefaultCity" placeholder="请选择区域"/>
          <!--<a-input placeholder="请输入城市区域地址说明" v-decorator="['areaAddress', {}]"/>-->
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="详细地址">
          <a-input v-decorator="[ 'areaAddress', validatorRules.areaAddress]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="公司电话"
        >
          <a-input placeholder=""  v-decorator="[ 'companyPhone', validatorRules.companyPhone]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注说明"
        >
          <a-textarea placeholder="" v-decorator="[ 'remarkExplian', validatorRules.remarkExplian]"/>
        </a-form-item>
<!--        v-if="AllData.showSmallcodeAddress" :src="AllData.showSmallcodeAddress"-->



        <a-button type="primary" style="display: block;margin: 0 auto;" @click="keepData">
          保存
        </a-button>
      </a-form>
<!--     qrCodeShow:二维码完整地址 avatarShow：头像地址 qrCodeNumber：二维码编号 buttonText：下载按钮文案-->
      <qrCode :qrCodeShow="qrCodeShow" :avatarShow="avatarShow" qrCodeNumber="">

      </qrCode>
    </a-spin>
  </a-card>
</template>
<script>
  import {ACCESS_TOKEN} from "@/store/mutation-types"
  import Vue from 'vue'
  import {getAction, putAction, postAction} from '@/api/manage'
  import AUpload from "ant-design-vue/es/upload/Upload";
  import ATextarea from 'ant-design-vue/es/input/TextArea'
  import qrCode from '@/components/qrCode/qrCode'
  export default {
    name: "AllianceInfo",
    components: {
      ATextarea,
      AUpload,
      qrCode
    },
    data () {
      return {
        title: "操作",
        visible: false,
        model: {},
        labelCol: {
          xs: {span: 24},
          sm: {span: 2},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 10},
        },

        AllData: {
          id:'',//加盟商编号
          username:'',//用户账号
          avatar:'',//用户头像
          name:'',//公司名称
          realname:'',//用户名字
          phone:'',//用户手机号
          agencyAreaId:'',//所在城市三个逗号隔开(区域id)
          areaAddress:'',//详细地址
          companyPhone:'',//公司电话
          remarkExplian:'',//备注说明
          sysUserId:'',//用户id
        },
        validatorRules:{
          defaultName:{rules: [{required: true, message: '请选择所在城市!'}]},
          areaAddress:{rules: [{required: true, message: '请输入详细地址!'}]},
          companyPhone:{rules: [{required: true, message: '请输入公司电话!'}]},
          remarkExplian:{rules: [{required: false, message: '请输入备注说明!'}]},
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        uploadLoading: false,
        headers: {},
        url: {
          findAllianceManageInfo: "/allianceManage/allianceManage/findAllianceManageInfo",  //返显接口
          updataAllianceManageInfo: '/allianceManage/allianceManage/updataAllianceManageInfo',//保存接口
          getList: '/sysArea/sysArea/getList',
          findByParentId: '/sysArea/sysArea/findByParentId',
          add: "/storeManage/storeManage/add",
          edit: "/storeManage/storeManage/edit",
          fileUpload: window._CONFIG['domianURL'] + "/sys/common/upload",
          imgerver: window._CONFIG['domianURL'] + "/sys/common/view",

        },
        //所在城市联想
        cityAllData: [],
        //可以显示回显默认地址
        canShowDefaultCity: false,
        //编辑回显的默认地址
        defaultCity: '',
        //地址转换拼接地址
        areaAddressList: [],

      }
    },
    async created () {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token": token};
      let that = this;
      const getList = await this.getList();
      getAction(that.url.findAllianceManageInfo).then((res) => {
        if (res.success &&  res.result) {
          if(res.result.agencyAreaId){
            this.cityEchoDisplay(res.result);
          }else{
            console.warn('agencyAreaId 不存在')
            this.canShowDefaultCity = true
          }
          if(res.result.avatar){
            res.result.logoAddr = res.result.avatar
            res.result.logoShowAddr = this.url.imgerver + '/' + res.result.avatar
          }
          this.AllData = Object.assign({},this.AllData,res.result)
          this.$nextTick(()=>{
            this.form.setFieldsValue( this.AllData)
            // this.canShowDefaultCity = true
          })
        }else{
          this.canShowDefaultCity = true
        }
      })
    },
    computed: {
      uploadAction: function () {
        return this.url.fileUpload;
      },
      avatarShow(){
        return this.url.imgerver + '/' + this.AllData.avatar
      },
      qrCodeShow(){
        return this.url.imgerver + '/' + this.AllData.address
      }
    },
    methods: {
      //logo校验
      logoBeforeUpload(file) {
        const isPic = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
        if (!isPic) {
          this.$message.error('图片格式仅支持JPG,PNG,JEPG格式!');
        }
        const isLt2M = file.size / 1024 / 1024 < 0.5;
        if (!isLt2M) {
          this.$message.error('图片大小必须在500k以内!');
        }
        return isPic && isLt2M;
      },
      //logo图片
      handleChange (info) {
        if (info.file.status === 'uploading') {
          this.uploadLoading = true;
          return
        }
        if (info.file.status === 'done') {
          let response = info.file.response;
          this.uploadLoading = false;
          this.AllData.logoAddr = response.message
          this.AllData.logoShowAddr = this.url.imgerver + "/" + response.message
          if (!response.success) {
            this.$message.warning(response.message);
          }
        }
      },
      //保存
      keepData(){
        if (!this.checkForm()) {
          return false;
        }
        this.form.validateFields((err, values) => {
          if(err) return;
          values.agencyAreaId = values.defaultCity.join(',')
          values.avatar = this.AllData.logoAddr
          this.AllData = Object.assign({},this.AllData,values)
          postAction(this.url.updataAllianceManageInfo, this.AllData).then((res) => {
            if (res.success) {
              this.$message.success(res.message)
            } else {
              this.$message.warn(res.message)
            }
            console.log(res);
          })
        })

      },
      //校验
      checkForm(){
        let data = this.AllData
        if (!data.logoAddr) {
          this.$message.warn('请上传logo图片！');
          return false;
        }
        return true;
      },
      //所在城市地址选择完成事件
      cityAllDataChange(value, selectedOptions) {
        let sz = []
        for (let item of selectedOptions) {
          sz.push(item.label)
        }
        this.model.agencyAreaId = value.join(',')
        this.areaAddressList = sz
      },
      //所在城市点击一级，二级，三级分类动态展示数据
      cityAllDataLoad(selectedOptions) {
        const targetOption = selectedOptions[selectedOptions.length - 1]
        targetOption.loading = true
        getAction(this.url.findByParentId, {id: targetOption.value}).then((res) => {
          targetOption.loading = false
          if (res.success && res.result.length > 0) {
            let sz = []
            for (let item of res.result) {
              sz.push({
                label: item.name,
                value: item.id,
                isLeaf: false
              })
            }
            targetOption.children = sz
          }
          this.cityAllData = [...this.cityAllData]
        })
      },
      //所在城市回显
      cityEchoDisplay(info) {
        let sz = info.agencyAreaId.split(',')
        let cityAllData = this.cityAllData
        this.defaultCity = info.agencyAreaId.split(',').map(item => {
          return item * 1
        })
        // this.$nextTick(()=>{
        //   this.form.setFieldsValue(Object.assign({},info,this.defaultCity));
        // })
        // console.log();
        // debugger;
        // if (this.areaAddressList.length <= 1) {
        //   this.$message.warn('很抱歉,您的所属城市数据有误，请重新设置！')
        //   this.canShowDefaultCity = true
        // } else {
          //第一个id请求其对应的子地址
          getAction(this.url.findByParentId, {id: sz[0]}).then(res => {
            if (res.success && res.result.length > 0) {
              let sz2 = [] //子地址
              for (let item of res.result) {
                sz2.push({
                  label: item.name,
                  value: item.id,
                  isLeaf: false
                })
              }
              for (let item of cityAllData) {
                //找到对应的label添加children
                if (sz[0] == item.value) {
                  item.children = sz2
                  getAction(this.url.findByParentId, {id: sz[1]}).then(res2 => {
                    if (res2.success && res2.result.length > 0) {
                      let sz3 = []
                      for (let item of res2.result) {
                        sz3.push({
                          label: item.name,
                          value: item.id,
                          isLeaf: false
                        })
                      }
                      for (let item2 of sz2) {
                        if (sz[1] == item2.value) {
                          item2.children = sz3
                          this.$nextTick(() => {
                            this.canShowDefaultCity = true
                          })
                          break
                        }
                      }
                    } else {
                      this.canShowDefaultCity = true
                      console.log('没有第三季地址')
                    }
                  })
                  break
                }
              }
            } else {
              this.canShowDefaultCity = true
              console.log('空值')
            }
          })
        // }
      },
      //获取包邮配送区域地址和所在城市一级options联想地址
      getList() {
        return new Promise((resolve,reject)=>{
          getAction(this.url.getList).then((res) => {
            if (res.success) {
              let sz3 = []
              for (let item of res.result) {
                sz3.push({
                  label: item.name,
                  value: item.id,
                  isLeaf: false
                })
              }
              //所在城市
              this.cityAllData = sz3
              this.$nextTick(() => {
                resolve('success')
              })
            } else {
              this.$message.warning(res.message)
              reject(res.message)
            }
          })
        })
      },

    }
  }
</script>

<style lang="less" scoped>

</style>