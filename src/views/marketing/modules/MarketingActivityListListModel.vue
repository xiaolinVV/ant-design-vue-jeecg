<template>
  <a-card title="添加活动">
    <a-form :form="form">
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="活动类型">
        <a-radio-group v-decorator="validatorRules.activityType" @change="activityTypeChange">
          <a-radio :value="0"> 线下活动 </a-radio>
          <a-radio :value="1"> 线上活动 </a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="活动标题">
        <a-input placeholder="请输入活动标题" style="width: 205px" v-decorator="validatorRules.activityName" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="报名开始时间">
        <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="validatorRules.registrationTime" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="活动开始时间">
        <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="validatorRules.startTime" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="活动结束时间">
        <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="validatorRules.endTime" />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="活动名额" v-if="activityType == 0">
        <a-input-number :precision="0" style="width: 205px" v-decorator="validatorRules.places" />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="activityType == 0">
        <!-- :defaultValue="defaultCity" -->
        <span slot="label">
          <span class="dataCheckedStar"> * </span>
          活动地址
        </span>
        <a-cascader
          :options="cityAllData"
          @change="cityAllDataChange"
          :loadData="cityAllDataLoad"
          changeOnSelect
          v-model="defaultCity"
          v-if="canShowDefaultCity"
          placeholder="请选择区域"
          style="width: 205px"
        />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="详细地址" v-if="activityType == 0">
        <a-input style="width: 450px" placeholder="请输入详细地址" v-decorator="validatorRules.detailedAddress" />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系电话" v-if="activityType == 0">
        <a-input-number
          :precision="0"
          style="width: 205px"
          placeholder="请输入联系电话"
          v-decorator="validatorRules.phone"
        />
      </a-form-item>

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        help="尺寸800*640 ，支持jpg、jpeg、png格式，大小不超过2M"
        validate-status="error"
      >
        <span slot="label">
          <span class="dataCheckedStar"> * </span>
          分享图
        </span>
        <a-upload
          :action="uploadAction"
          :beforeUpload="diagramFileUpload"
          :fileList="diagramFileList"
          :headers="headers"
          @change="diagramHandleChange"
          @preview="diagramHandlePreview"
          listType="picture-card"
        >
          <div v-if="diagramFileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :footer="null" :visible="diagramPreviewVisible" @cancel="diagramHandleCancel">
          <img :src="diagramPreviewImage" alt="example" style="width: 100%" />
        </a-modal>
      </a-form-item>

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        help="尺寸1428*2540，支持jpg、jpeg、png格式，大小不超过2M。必须预留好二维码位置。以免影响展示效果。"
        validate-status="error"
      >
        <span slot="label">
          <span class="dataCheckedStar"> * </span>
          海报图
        </span>
        <a-upload
          :action="uploadAction"
          :beforeUpload="postersFileUpload"
          :fileList="postersFileList"
          :headers="headers"
          @change="postersHandleChange"
          @preview="postersHandlePreview"
          listType="picture-card"
        >
          <div v-if="postersFileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :footer="null" :visible="postersPreviewVisible" @cancel="postersHandleCancel">
          <img :src="postersPreviewImage" alt="example" style="width: 100%" />
        </a-modal>
      </a-form-item>

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        help="尺寸800*400 ，支持jpg、jpeg、png格式，大小不超过2M"
        validate-status="error"
      >
        <span slot="label">
          <span class="dataCheckedStar"> * </span>
          活动封面
        </span>
        <a-upload
          :action="uploadAction"
          :beforeUpload="surfacePlotFileUpload"
          :fileList="surfacePlotFileList"
          :headers="headers"
          @change="surfacePlotHandleChange"
          @preview="surfacePlotHandlePreview"
          listType="picture-card"
        >
          <div v-if="surfacePlotFileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :footer="null" :visible="surfacePlotPreviewVisible" @cancel="surfacePlotHandleCancel">
          <img :src="surfacePlotPreviewImage" alt="example" style="width: 100%" />
        </a-modal>
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="活动参与条件" v-if="activityType == 1">
        <div style="display: flex; align-items: center">
          <a-checkbox v-model="model.isMemberOpen"> 普通会员 </a-checkbox>
          <a-input
            style="width: 200px"
            :disabled="!model.isMemberOpen"
            v-model="model.memberIdentification"
            placeholder="请输入身份名称"
          ></a-input>
        </div>
        <div style="display: flex; align-items: center">
          <a-checkbox v-model="model.isDesignationMemberOpen"> 称号会员 </a-checkbox>
          <a-input
            style="width: 200px"
            :disabled="!model.isDesignationMemberOpen"
            v-model="model.designationMemberIdentification"
            placeholder="请输入身份名称"
          ></a-input>
        </div>
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="参与活动报名奖励" v-if="activityType == 1">
        <a-input-number
          :min="0"
          :precision="2"
          placeholder="请输入参与活动报名奖励"
          style="width: 205px"
          v-decorator="validatorRules.signUpReward"
        />
        福利金(0即为不送)
      </a-form-item>

      <a-form-item
        help="关联栏目后,报名活动的用户可以在该栏目下发表素材"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="用户栏目"
        v-if="activityType == 1"
      >
        <a-select
          style="width: 200px"
          v-decorator="['marketingMaterialColumnId', validatorRules.marketingMaterialColumnId]"
        >
          <a-select-option value=""> 请选择 </a-select-option>

          <a-select-option v-for="(item, index) in marketingMaterialColumnData" :key="index" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
        <span slot="label">
          <span class="dataCheckedStar"> * </span>
          活动内容
        </span>
        <JEditor v-model="model.content"> </JEditor>
      </a-form-item>
    </a-form>
    <div class="button-operation">
      <a-button @click="handleOk" type="primary"> 确认 </a-button>
    </div>
  </a-card>
</template>
<script>
import JEditor from '@/components/jeecg/JEditor'
import { httpAction, getAction } from '@/api/manage'
import Vue from 'vue'
import pick from 'lodash.pick'
import moment from 'moment'
export default {
  name: 'MarketingActivityListListModel',
  components: {
    JEditor,
  },
  data() {
    return {
      headers: '',
      model: {},

      //分享图配置
      diagramFileList: [],
      diagramPreviewVisible: false,
      diagramPreviewImage: '',
      diagramFilePic: true,
      //海报图配置
      postersFileList: [],
      postersPreviewVisible: false,
      postersPreviewImage: '',
      postersFilePic: true,
      //封面图配置
      surfacePlotFileList: [],
      surfacePlotPreviewVisible: false,
      surfacePlotPreviewImage: '',
      surfacePlotFilePic: true,
      //栏目列表数据
      marketingMaterialColumnData: [],
      //所在城市联想
      cityAllData: [],
      //可以显示回显默认地址
      canShowDefaultCity: false,
      //编辑回显的默认地址
      defaultCity: '',
      //地址转换拼接地址
      areaAddressList: [],
      activityType: 0,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      form: this.$form.createForm(this),
      validatorRules: {
        activityName: ['activityName', { rules: [{ required: true, message: '请输入活动标题!' }] }],
        marketingMaterialColumnId: { rules: [{ required: false, message: '请选择栏目!' }] },
        signUpReward: ['signUpReward', { rules: [{ required: true, message: '请输入参与活动报名奖励!' }] }],
        activityType: ['activityType', { rules: [{ required: true, message: '请选择活动类型!' }] }],
        registrationTime: ['registrationTime', { rules: [{ required: true, message: '请选择报名开始时间!' }] }],
        startTime: ['startTime', { rules: [{ required: true, message: '请选择活动开始时间!' }] }],
        endTime: ['endTime', { rules: [{ required: true, message: '请选择活动结束时间!' }] }],
        places: ['places', { rules: [{ required: false, message: '请输入活动名额!' }] }],
        phone: ['phone', { rules: [{ required: true, message: '请输入联系电话!' }] }],
        detailedAddress: ['detailedAddress', { rules: [{ required: true, message: '请输入详细地址!' }] }],
        defaultCity: [
          'defaultCity',
          {
            rules: [
              {
                required: true,
                message: '请选择所在城市!',
              },
            ],
          },
        ],
      },

      url: {
        // 栏目列表 GET
        getMarketingMaterialColumnListMap:
          '/marketingMaterialColumn/marketingMaterialColumn/getMarketingMaterialColumnListMap',
        add: '/marketing/marketingActivityList/add',
        edit: '/marketing/marketingActivityList/edit',
        //获取经纬度
        getLngAndLat: '/storeManage/storeManage/getLngAndLat',
        getList: '/sysArea/sysArea/getList',
        findByParentId: '/sysArea/sysArea/findByParentId',
      },
      //配置
      configure: Object.freeze({
        imgErver: window._CONFIG['domianURL'] + '/sys/common/view',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
      }),
    }
  },
  created() {
    const token = Vue.ls.get('Access-Token')
    this.headers = { 'X-Access-Token': token }
    this.activityType = (this.$route.query.record && this.$route.query.record.activityType) || 0
    this.getMarketingMaterialColumnList()
  },
  watch: {
    activityType: {
      handler(newVal) {
        this.edit(this.$route.query.record)
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    //栏目列表数据
    getMarketingMaterialColumnList() {
      return new Promise((resolve, reject) => {
        getAction(this.url.getMarketingMaterialColumnListMap).then((res) => {
          if (res.success) {
            console.log(res)
            this.marketingMaterialColumnData = res.result
            resolve('success')
          } else {
            this.$message.warn(res.message || '网络波动，请稍后刷新页面重试！')
            reject(`栏目列表接口500！具体原因${res.message}`)
          }
        })
      })
    },
    activityTypeChange(e) {
      this.activityType = e.target.value
    },
    add() {
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      this.model = {}
      this.getList(() => {
        if (record.sysAreaIds && record.sysAreaExplain) {
          this.areaAddressList = record.sysAreaExplain.split(',')
          this.cityEchoDisplay(record)
        } else {
          this.areaAddressList = []
          this.canShowDefaultCity = true
        }
        if (record && record.id) {
          try {
            if (record.coverPlan) {
              let coverPlans = Object.values(JSON.parse(record.coverPlan))
              let coverPlansSz = []
              //分享图返显
              for (let a = 0; a < coverPlans.length; a++) {
                let obj = {
                  uid: a,
                  url: this.configure.imgErver + '/' + coverPlans[a],
                  response: {
                    message: coverPlans[a],
                  },
                }
                coverPlansSz.push(obj)
              }
              this.diagramFileList = coverPlansSz
            }
            if (record.posters) {
              let posters = Object.values(JSON.parse(record.posters))
              let postersSz = []
              //海报图返显
              for (let a = 0; a < posters.length; a++) {
                let obj = {
                  uid: a,
                  url: this.configure.imgErver + '/' + posters[a],
                  response: {
                    message: posters[a],
                  },
                }
                postersSz.push(obj)
              }
              this.postersFileList = postersSz
            }
            if (record.surfacePlot) {
              let surfacePlot = Object.values(JSON.parse(record.surfacePlot))
              let surfacePlotSz = []
              //封面图返显
              for (let a = 0; a < surfacePlot.length; a++) {
                let obj = {
                  uid: a,
                  url: this.configure.imgErver + '/' + surfacePlot[a],
                  response: {
                    message: surfacePlot[a],
                  },
                }
                surfacePlotSz.push(obj)
              }
              this.surfacePlotFileList = surfacePlotSz
            }
          } catch (e) {
            console.error('解析图出错', e)
          }
        }
        record.isMemberOpen = record.isMemberOpen == 1 ? true : false
        record.isDesignationMemberOpen = record.isDesignationMemberOpen == 1 ? true : false
        this.model = Object.assign({}, this.model, record)

        console.log(this.model, 'this.modelthis.model')

        this.$nextTick(() => {
          this.form.setFieldsValue(this.model)
          this.form.setFieldsValue({ activityType: this.activityType })
          //时间格式化
          this.form.setFieldsValue({ startTime: this.model.startTime ? moment(this.model.startTime) : null })
          this.form.setFieldsValue({ endTime: this.model.endTime ? moment(this.model.endTime) : null })

          this.form.setFieldsValue({
            registrationTime: this.model.registrationTime ? moment(this.model.registrationTime) : null,
          })
        })
      })
    },
    handleOk() {
      const that = this
      if (!this.model.content) {
        this.$message.warn('请填写活动内容！')
        return false
      }
      if (!Array.isArray(this.diagramFileList) || this.diagramFileList.length <= 0) {
        this.$message.warn('请上传分享图！')
        return false
      }
      if (!Array.isArray(this.postersFileList) || this.postersFileList.length <= 0) {
        this.$message.warn('请上传海报图！')
        return false
      }
      if (!Array.isArray(this.surfacePlotFileList) || this.surfacePlotFileList.length <= 0) {
        this.$message.warn('请上传封面图！')
        return false
      }
      if ((!Array.isArray(this.defaultCity) || this.defaultCity.length <= 0) && this.activityType == 0) {
        this.$message.warn('请选择活动地址！')
        return false
      }

      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let httpurl = ''
          let method = ''
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
            values.status = 1
          } else {
            httpurl += this.url.edit
            method = 'put'
          }
          let formData = Object.assign({}, this.model, values)
          formData.isMemberOpen = formData.isMemberOpen ? 1 : 0
          formData.isDesignationMemberOpen = formData.isDesignationMemberOpen ? 1 : 0
          //时间格式化
          formData.startTime = formData.startTime ? formData.startTime.format('YYYY-MM-DD HH:mm:ss') : null
          formData.endTime = formData.endTime ? formData.endTime.format('YYYY-MM-DD HH:mm:ss') : null
          formData.sysAreaExplain = this.areaAddressList.join(',')
          formData.registrationTime = formData.registrationTime
            ? formData.registrationTime.format('YYYY-MM-DD HH:mm:ss')
            : null
          let coverPlan = {}
          let postersCK = {}
          let surfacePlot = {}
          for (let count = 0; count < this.diagramFileList.length; count++) {
            coverPlan[count] = this.diagramFileList[count].response.message
          }
          for (let count = 0; count < this.postersFileList.length; count++) {
            postersCK[count] = this.postersFileList[count].response.message
          }
          for (let count = 0; count < this.surfacePlotFileList.length; count++) {
            surfacePlot[count] = this.surfacePlotFileList[count].response.message
          }
          formData.coverPlan = this.diagramFileList.length > 0 ? JSON.stringify(coverPlan) : ''
          formData.posters = this.postersFileList.length > 0 ? JSON.stringify(postersCK) : ''
          formData.surfacePlot = this.surfacePlotFileList.length > 0 ? JSON.stringify(surfacePlot) : ''
          httpAction(httpurl, formData, method)
            .then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$router.push({ path: '/marketing/MarketingActivityListList' })
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              // that.confirmLoading = false
              // that.close()
            })
        }
      })
    },
    uploadAction() {
      return this.configure.fileUpload
    },
    //分享图
    diagramFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小必须在2M以内!')
      }
      this.diagramFilePic = isLt2M
      return isLt2M
    },
    diagramHandleCancel() {
      this.diagramPreviewVisible = false
    },
    diagramHandlePreview(file) {
      this.diagramPreviewImage = file.url || file.thumbUrl
      this.diagramPreviewVisible = true
    },
    diagramHandleChange({ fileList }) {
      this.diagramFileList = fileList
    },
    //海报图
    postersFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小必须在2M以内!')
      }
      this.postersFilePic = isLt2M
      return isLt2M
    },
    postersHandleCancel() {
      this.postersPreviewVisible = false
    },
    postersHandlePreview(file) {
      this.postersPreviewImage = file.url || file.thumbUrl
      this.postersPreviewVisible = true
    },
    postersHandleChange({ fileList }) {
      this.postersFileList = fileList
    },

    //封面图
    surfacePlotFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小必须在2M以内!')
      }
      this.surfacePlotFilePic = isLt2M
      return isLt2M
    },
    surfacePlotHandleCancel() {
      this.surfacePlotPreviewVisible = false
    },
    surfacePlotHandlePreview(file) {
      this.surfacePlotPreviewImage = file.url || file.thumbUrl
      this.surfacePlotPreviewVisible = true
    },
    surfacePlotHandleChange({ fileList }) {
      this.surfacePlotFileList = fileList
    },
    //所在城市点击一级，二级，三级分类动态展示数据
    cityAllDataLoad(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      getAction(this.url.findByParentId, { id: targetOption.value }).then((res) => {
        targetOption.loading = false
        if (res.success && res.result.length > 0) {
          let sz = []
          for (let item of res.result) {
            sz.push({
              label: item.name,
              value: item.id,
              isLeaf: false,
            })
          }
          targetOption.children = sz
        }
        this.cityAllData = [...this.cityAllData]
      })
    },
    getList(callback) {
      getAction(this.url.getList).then((res) => {
        if (res.success) {
          let sz3 = []
          for (let item of res.result) {
            sz3.push({
              label: item.name,
              value: item.id,
              isLeaf: false,
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
    async cityEchoDisplay(info) {
      let sz = info.sysAreaIds.split(',')
      let cityAllData = this.cityAllData
      this.defaultCity = info.sysAreaIds.split(',').map((item) => {
        return item * 1
      })
      // this.$nextTick(()=>{
      //   this.form.setFieldsValue(Object.assign({},info,this.defaultCity));
      // })
      // console.log();
      // debugger;
      if (this.areaAddressList.length <= 1) {
        this.$message.warn('很抱歉,您的所属城市数据有误，请重新设置！')
        this.canShowDefaultCity = true
      } else {
        //第一个id请求其对应的子地址
        getAction(this.url.findByParentId, { id: sz[0] }).then((res) => {
          if (res.success && res.result.length > 0) {
            let sz2 = [] //子地址
            for (let item of res.result) {
              sz2.push({
                label: item.name,
                value: item.id,
                isLeaf: false,
              })
            }
            for (let item of cityAllData) {
              //找到对应的label添加children
              if (this.areaAddressList[0] == item.label) {
                item.children = sz2
                getAction(this.url.findByParentId, { id: sz[1] }).then((res2) => {
                  if (res2.success && res2.result.length > 0) {
                    let sz3 = []
                    for (let item of res2.result) {
                      sz3.push({
                        label: item.name,
                        value: item.id,
                        isLeaf: false,
                      })
                    }
                    for (let item2 of sz2) {
                      if (this.areaAddressList[1] == item2.label) {
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
      }
    },
    //所在城市地址选择完成事件
    cityAllDataChange(value, selectedOptions) {
      let sz = []
      for (let item of selectedOptions) {
        sz.push(item.label)
      }
      this.model.sysAreaIds = value.join(',')
      this.areaAddressList = sz
    },
  },
}
</script>
<style lang="scss">
.button-operation {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  padding-bottom: 20px;
  width: 200px;

  button {
    width: 80px;
  }
}
</style>
