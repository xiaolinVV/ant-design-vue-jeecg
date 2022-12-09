<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-form :form="form">
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系人手机号">
        <!-- <a-input-number :disabled="model.id" style="width: 100%;" v-decorator="['phone', validatorRules.phone]" /> -->
        <a-input-number style="width: 100%;" v-decorator="['phone', validatorRules.phone]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="收款人">
        <a-input v-decorator="['cardholder', validatorRules.cardholder]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="身份证号">
        <a-input v-decorator="['identityNumber', validatorRules.identityNumber]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="银行">
        <!-- <a-input v-decorator="['bankName', validatorRules.bankName]" /> -->
        <a-select placeholder="请选择银行" style="width: 120px" v-decorator="['bankName', validatorRules.bankName]">
          <a-select-option v-for="(item, index) in bankList" :key="index" :value="item">
            {{ item }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="银行卡号">
        <!--        :precision='0'-->
        <a-input style="width: 100%;" v-decorator="['bankCard', validatorRules.bankCard]" />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开户行分支行" >
        <a-input placeholder="请输入开户行分支行" v-decorator="['openingBank', validatorRules.openingBank]" />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开户行所在城市" >
        <!-- <a-input placeholder="请选择开户行所在城市" v-decorator="['citys', validatorRules.citys]" @change="showcs1" v-if="showcs" /> -->
        
        <a-cascader
          :options="bankCitys"
          v-decorator="['citysCode', validatorRules.citysCode]"
          placeholder="请选择开户行所在城市"
          @change="citysCodeChange"
          
        />
      </a-form-item>

      <!-- <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol">

        <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          开户行所在城市
        </span>
        <a-cascader
          :options="cityAllData"
          @change="cityAllDataChange"
          :loadData="cityAllDataLoad"
          changeOnSelect
          v-model="defaultCity"
          v-if="canShowDefaultCity"
          placeholder="请选择区域"
          style="width:205px"
        />
      </a-form-item> -->

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="变更说明">
        <a-textarea v-decorator="['updateExplain', validatorRules.updateExplain]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
        <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          变更凭证
        </span>
        <!--        updateCertificate-->
        <a-upload
          :action="uploadAction"
          :beforeUpload="mainPictureUpload"
          :fileList="mainPictureFileList"
          :headers="headers"
          @change="mainPictureHandleChange"
          @preview="mainPictureHandlePreview"
          listType="picture-card"
        >
          <div v-if="mainPictureFileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">上传</div>
          </div>
        </a-upload>
        <a-modal :footer="null" :visible="mainPicturePreviewVisible" @cancel="mainPictureHandleCancel">
          <img :src="mainPicturePreviewImage" alt="example" style="width: 100%" />
        </a-modal>
        <div>
          支持jpg、jpeg、png格式，大小不超过500k
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { httpAction, getAction, postAction } from '@/api/manage'
import Vue from 'vue'
import ATextarea from 'ant-design-vue/es/input/TextArea'
export default {
  name: 'PublicCorrespondentCardsEditModal',
  components: { ATextarea },
  created() {
    const token = Vue.ls.get('Access-Token')
    this.headers = { 'X-Access-Token': token }
  },
  props: {
    //接口编辑
    urlEditName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      title: '编辑',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      showcs: true,
      model: {},
      headers: '',
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      validatorRules: {
        phone: {
          rules: [
            {
              required: true,
              message: '请输入手机号!'
            },
            {
              required: true,
              pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
              message: '请输入正确的手机号码！'
            }
          ]
        },
        cardholder: {
          rules: [
            {
              required: true,
              message: '请输入收款人!'
            }
          ]
        },
        bankName: {
          rules: [
            {
              required: true,
              message: '请选择银行!'
            }
          ]
        },
        citys: {
            rules: [
              {
                required: true,
                message: '请选择城市!'
              }
            ]
        },
        bankCard: {
          rules: [
            {
              required: true,
              message: '请输入银行卡号!'
            },
            {
              required: true,
              pattern: /^([1-9]{1})(\d{14}|\d{18})$/,
              message: '请输入正确的银行卡号！'
            }
          ]
        },
        identityNumber: {
          rules: [
            {
              required: true,
              message: '请输入身份证号!'
            },
            {
              required: true,
              pattern: /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0[1-9]|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
              message: '请输入正确的身份证号！'
            }
          ]
        },
        updateExplain: {
          rules: [
            {
              required: true,
              message: '请输入变更说明!'
            }
          ]
        },
        citysCode: { rules: [{ required: true, message: '请选择开户行所在城市' }] },
        openingBank: { rules: [{ required: false, message: '请输入开户行分支行' }] }
      },
      uploadAction: window._CONFIG['domianURL'] + '/sys/common/upload',
      //变更说明 配置
      mainPictureFileList: [],
      mainPicturePreviewVisible: false,
      mainPicturePreviewImage: '',
      mainPicturePic: true,
      //所在城市联想
      cityAllData: [],
      //可以显示回显默认地址
      canShowDefaultCity: false,
      //编辑回显的默认地址
      citysCode: '',
      //地址转换拼接地址
      areaAddressList: [],
      url: {
        // edit:'storeBankCard/storeBankCard/edit',
        // edit:'agencyBankCard/agencyBankCard/edit'
        //获取经纬度
        getLngAndLat: '/storeManage/storeManage/getLngAndLat',
        getList: '/sysArea/sysArea/getList',
        findByParentId: '/sysArea/sysArea/findByParentId'
      },
      //配置
      configure: {
        imgErver: window._CONFIG['domianURL'] + '/sys/common/view',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
      }
    }
  },
   
  computed: {
    bankList() {
      return JSON.parse(localStorage.getItem('blankList')).bankNameList
    },
    bankCitys() {
      return JSON.parse(localStorage.getItem('bankBindCitysCode'))
    }
  },
  methods: {
    showcs1(){
      this.showcs = false
      console.log('111')
    },
   
    citysCodeChange(value, options) {
      let citys = []
      options.map(item => {
        citys.push(item.label)
      })
      this.model.citys = citys.join(',')
    },
    //所在城市点击一级，二级，三级分类动态展示数据
    cityAllDataLoad(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      getAction(this.url.findByParentId, { id: targetOption.value }).then(res => {
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
    getList(callback) {
      getAction(this.url.getList).then(res => {
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
            callback()
          })
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    //所在城市回显
    cityEchoDisplay(info) {
      
      let sz = info.citysCode
      let cityAllData = this.cityAllData
      this.citysCode = info.citysCode
      console.log( this.citysCode,'this.citysCode')
      // this.$nextTick(()=>{
      //   this.form.setFieldsValue(Object.assign({},info,this.defaultCity));
      // })
      // console.log();
      // debugger;
      if (this.areaAddressList.length <= 1) {
        // this.$message.warn('很抱歉,您的所属城市数据有误，请重新设置！')
        // this.canShowDefaultCity = true
      } else {
        //第一个id请求其对应的子地址
        getAction(this.url.findByParentId, { id: sz[0] }).then(res => {
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
              if (this.areaAddressList[0] == item.label) {
                item.children = sz2
                getAction(this.url.findByParentId, { id: sz[1] }).then(res2 => {
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
                      if (this.areaAddressList[1] == item2.label) {
                        item2.children = sz3
                        console.log(this.areaAddressList, 'this.areaAddressList')
                        console.log(this.citysCode, 'this.defaultCity')
                        console.log(this.cityAllData, 'this.cityAllData')
                        // this.$nextTick(() => {
                        //   // this.canShowDefaultCity = true
                        // })
                        break
                      }
                    }
                  } else {
                    // this.canShowDefaultCity = true
                    console.log('没有第三季地址')
                  }
                })
                break
              }
            }
          } else {
            // this.canShowDefaultCity = true
            console.log('空值')
          }
        })
      }
    },
    //所在城市地址选择完成事件
    cityAllDataChange(value, selectedOptions) {
      let sz = []
      for (let item of selectedOptions) {
        sz.push(item.label)
      }
      this.model.citysCode = value.join(',')
      this.areaAddressList = sz
    },
    mainPictureUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 0.5
      if (!isLt2M) {
        this.$message.error('图片大小必须在500k以内!')
      }
      this.mainPicturePic = isLt2M
      return isLt2M
    },
    mainPictureHandleChange({ fileList }) {
      this.mainPictureFileList = fileList
    },
    mainPictureHandlePreview(file) {
      this.mainPicturePreviewImage = file.url || file.thumbUrl
      this.mainPicturePreviewVisible = true
    },
    mainPictureHandleCancel() {
      this.mainPicturePreviewVisible = false
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // if (!this.mainPictureFileList || this.mainPictureFileList.length <= 0) {
        //   this.$message.warn('请上传变更说明！')
        //   return
        // }
        // if (!Array.isArray(this.defaultCity) || this.defaultCity.length <= 0) {
        //   this.$message.warn('请选择开户行所在城市！')
        //   return
        // }
        if (!err) {
          that.confirmLoading = true
          let httpurl = this.urlEditName
          if (!httpurl) {
            this.$message.warn('请设置编辑地址！')
            return
          }
          let method = 'post'
          let formData = Object.assign(this.model, values)
          let mainPictureFileList = {}
          for (let count = 0; count < this.mainPictureFileList.length; count++) {
            mainPictureFileList[count] = this.mainPictureFileList[count].response
              ? this.mainPictureFileList[count].response.message
              : ''
          }
          formData.updateCertificate = this.mainPictureFileList.length > 0 ? JSON.stringify(mainPictureFileList) : ''
          // formData.citys = this.areaAddressList.join(',')
          formData.citysCode = formData.citysCode && formData.citysCode.length > 0 ? formData.citysCode.join(',') : ''

          httpAction(httpurl, formData, method)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
              that.close()
            })
        }
      })
    },
    handleCancel() {
      this.visible = false
      this.mainPictureFileList = []
      this.$nextTick(() => {
        this.form.resetFields()
      })
      this.$emit('close')
    },
    close() {
      this.handleCancel()
    },
    add() {
      this.edit({})
    },
    async edit(record) {
      // this.getList(async () => {
      // this.defaultCity = ''
      // this.canShowDefaultCity = false

      // if (record.citys) {
      //   this.showcs = true
      //   // record.citys = record.citys.split(',').join('')
      // }
      if (record.citysCode) {
          // record.citysCode = record.citysCode.split(',')
          this.cityEchoDisplay(record)
          console.log(record.citysCode,'record.citysCode')
      }
      if (record.updateCertificate) {
        let mainPicture = Object.values(JSON.parse(record.updateCertificate))
        let mainPicturesSz = []
        //主图返显
        for (let a = 0; a < mainPicture.length; a++) {
          let obj = {
            uid: a,
            url: this.configure.imgErver + '/' + mainPicture[a],
            response: {
              message: mainPicture[a]
            }
          }
          mainPicturesSz.push(obj)
        }
        this.mainPictureFileList = mainPicturesSz
      }
       
      try {
        if (record.citysCode) {
          record.citysCode = record.citysCode.split(',')
          this.cityEchoDisplay(record)
          console.log(record.citysCode,'record.citysCode')
        } else {
          record.citysCode = []
        }
      } catch (error) {
        console.warn('citysCodeError', error)
      }

      this.model = Object.assign({}, this.model, record)
      await this.$nextTick()
      // if (record && record.citysCode && record.citys) {
      //   this.areaAddressList = record.citys.split(',')
      //   this.cityEchoDisplay(record)
      // } else {
      //   this.areaAddressList = []
      //   this.canShowDefaultCity = true
      // }
      this.visible = true
      await this.$nextTick()
      this.form.setFieldsValue(this.model)
      // })
    }
  }
}
</script>

<style scoped></style>
