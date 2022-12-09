<template>
  <div>
    <a-modal
      :title="title"
      :width="800"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      cancelText="关闭"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="广告标题">
            <a-input placeholder="请输入广告标题" v-decorator="['title', validatorRules.title]" />
          </a-form-item>
          <!-- <a-form-item
             :labelCol="labelCol"
             :wrapperCol="wrapperCol"
             label="广告类型"> &lt;!&ndash;；建立数据字典读取，字典名称：ad_type；0:为平台广告；1：店铺广告"&ndash;&gt;
             <j-dict-select-tag @change="chooseMedicineAdType"   v-decorator="['adType', validatorRules.adType]" :triggerChange="true" placeholder="请选择广告类型"
                                dictCode="ad_type"/>
           </a-form-item>-->
          <a-form-item
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            validate-status="validating"
            help="请上传上传分类图片,支持jpg、jpeg、png格式，大小不超过500k"
          >
            <span slot="label">
              <span class="dataCheckedStar">
                *
              </span>
              <span>
                图片
              </span>
            </span>
            <a-upload
              :action="uploadAction"
              :beforeUpload="picFileUpload"
              :fileList="picFileList"
              :headers="headers"
              @change="picHandleChange"
              @preview="picHandlePreview"
              listType="picture-card"
            >
              <div v-if="picFileList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
            <a-modal :footer="null" :visible="picPreviewVisible" @cancel="picHandleCancel">
              <img preview="1" :src="picPreviewImage" alt="example" style="width: 100%" />
            </a-modal>
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="跳转类型"
            ><!--；0：无；1：商品详情-->
            <a-select
              @change="chooseMedicineGoToType"
              v-decorator="['goToType', validatorRules.goToType]"
              placeholder="请选择跳转类型"
            >
              <a-select-option value="0">无</a-select-option>
              <a-select-option value="1">商品详情</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="专区商品" v-if="GoToType">
            <a-select v-decorator="['goodListId', validatorRules.goodListId]" placeholder="请选择">
              <a-select-option v-for="item in goodlist" :value="item.id">{{ item.good_name }}</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
            <a-input placeholder="请输入排序" v-decorator="['sort', validatorRules.sort]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开始时间">
            <a-date-picker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              v-decorator="['startTime', validatorRules.startTime]"
            />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="结束时间">
            <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="['endTime', validatorRules.endTime]" />
          </a-form-item>
          <!--        <a-form-item-->
          <!--          :labelCol="labelCol"-->
          <!--          :wrapperCol="wrapperCol"-->
          <!--          label="状态">&lt;!&ndash;0：停用；1：启用&ndash;&gt;-->
          <!--          <a-select v-decorator="['status',  validatorRules.status]" placeholder="请选择">-->
          <!--            <a-select-option value="0">停用</a-select-option>-->
          <!--            <a-select-option value="1">启用</a-select-option>-->
          <!--          </a-select>-->
          <!--        </a-form-item>-->
        </a-form>
      </a-spin>
    </a-modal>
    <!--停用弹出-->
    <a-modal title="停用" v-model="visibleStopStatus" @ok="hideModalStopStatus()" okText="确认" cancelText="取消">
      <input style="display: none" :value="marketingAdvertisingPrefectureId" placeholder="id" />
      <h3>停用专区广告后，在专区中将不展示该专区广告</h3>
      <p>您确定要停用吗？</p>
      <a-textarea placeholder="停用原因" v-model="closeExplain" :autosize="{ minRows: 3, maxRows: 6 }" />
    </a-modal>
  </div>
</template>

<script>
import { httpAction, getAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import Vue from 'vue'

export default {
  name: 'MarketingAdvertisingPrefectureModal',
  props: {
    marketingPrefectureId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      title: '操作',
      visible: false,
      GoToType: false,
      visibleStopStatus: false,
      marketingAdvertisingPrefectureId: '',
      closeExplain: '',
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      //图片上传配置
      picFileList: [],
      picPreviewImage: [],
      picPreviewVisible: false,
      picFilePic: true,
      confirmLoading: false,
      form: this.$form.createForm(this),
      headers: '',
      uploadAction: window._CONFIG['domianURL'] + '/sys/common/upload',
      goodlist: [],
      validatorRules: {
        title: { rules: [{ required: true, message: '请输入标题!' }] },
        goToType: { rules: [{ required: true, message: '请选择' }] },
        goodListId: { rules: [{ required: true, message: '请选择' }] },
        sort: { rules: [{ required: true, pattern: /^\d+$/, message: '只能输入数字' }] },
        startTime: { rules: [{ required: true, message: '请选择' }] },
        endTime: { rules: [{ required: true, message: '请选择' }] }
        // status:{rules: [{ required: true, message: '请选择状态!' }]},
      },
      url: {
        add: '/marketingAdvertisingPrefecture/marketingAdvertisingPrefecture/add',
        edit: '/marketingAdvertisingPrefecture/marketingAdvertisingPrefecture/edit',
        getMarketingPrefectureGoodName:
          '/marketingPrefectureGood/marketingPrefectureGood/getMarketingPrefectureGoodName',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        updateStatus: '/marketingAdvertisingPrefecture/marketingAdvertisingPrefecture/updateStatus'
      }
    }
  },
  created() {
    const token = Vue.ls.get('Access-Token')
    this.headers = { 'X-Access-Token': token }
  },
  methods: {
    add() {
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'year',
            'month',
            'day',
            'title',
            'pictureAddr',
            'goToType',
            'goodListId',
            'sort',
            'status',
            'delFlag',
            'marketingPrefectureId'
          )
        )
        if (record.pictureAddr) {
          this.picFileList = [
            {
              url: this.url.imgerver + '/' + record.pictureAddr,
              uid: 1,
              response: {
                message: record.pictureAddr
              }
            }
          ]
        }

        //时间格式化
        this.form.setFieldsValue({ startTime: this.model.startTime ? moment(this.model.startTime) : null })
        this.form.setFieldsValue({ endTime: this.model.endTime ? moment(this.model.endTime) : null })
      })
    },
    //跳转类型
    chooseMedicineGoToType: function(value) {
      this.GoToType = false
      this.adType = '1'
      if (value == 1) {
        this.GoToType = true
        if (this.adType != null || this.adType != undefined) {
          getAction(this.url.getMarketingPrefectureGoodName, {
            marketingPrefectureId: this.marketingPrefectureId
          }).then(res => {
            if (res.success) {
              this.goodlist = res.result
              // this.dataSource2 = res.result.listGoodList;
            }
          })
        }
      }
    },
    //图片上传验证
    picFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 0.5
      const fileType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      if (!fileType) {
        this.$message.error('请上传jpg、jpeg、png格式的图片')
      }
      if (!isLt2M) {
        this.$message.error('图片大小必须在500k以内!')
      }
      this.picFilePic = isLt2M
      return isLt2M && fileType
    },
    //图片上传
    picHandleChange({ fileList }) {
      if (fileList.length <= 0) {
        this.picFileList = []
        return
      }
      if (
        fileList[0].size / 1024 / 1024 < 0.5 &&
        (fileList[0].type === 'image/jpeg' || fileList[0].type === 'image/png' || fileList[0].type === 'image/jpg')
      ) {
        this.picFileList = fileList
      }
    },
    //图片预览
    picHandlePreview(file) {
      this.picPreviewImage = file.url || file.thumbUrl
      this.picPreviewVisible = true
    },
    //图片取消预览
    picHandleCancel() {
      this.picPreviewVisible = false
    },
    close() {
      this.$emit('close')
      this.form.setFieldsValue({})
      this.picFileList = []
      this.visible = false
    },
    handleOk() {
      const that = this
      // 触发表单验证
      if (!this.picFileList || this.picFileList.length <= 0) {
        this.$message.warn('请上传分类图片')
        return
      }
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
          // values.logoAddr = JSON.stringify({ 0: this.picFileList[0].response.message })
          values.pictureAddr = this.picFileList[0].response.message
          let formData = Object.assign(this.model, values)
          //时间格式化
          formData.startTime = formData.startTime ? formData.startTime.format('YYYY-MM-DD HH:mm:ss') : null
          formData.endTime = formData.endTime ? formData.endTime.format('YYYY-MM-DD HH:mm:ss') : null
          formData.marketingPrefectureId = this.marketingPrefectureId
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
      this.close()
    },
    //停用弹窗
    showModalStopStatus(id) {
      this.marketingAdvertisingPrefectureId = id
      this.visibleStopStatus = true
      this.closeExplain = ''
    },
    //停用
    hideModalStopStatus() {
      this.visibleStopStatus = false
      console.log('this.closeExplain=', this.closeExplain)
      var that = this
      getAction(that.url.updateStatus, {
        ids: this.marketingAdvertisingPrefectureId,
        closeExplain: this.closeExplain,
        status: '0'
      }).then(res => {
        if (res.code == 200) {
          that.$message.success(res.message)
          that.$emit('ok') //发送父级主键刷新
        } else {
          that.$message.success('修改失败')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
