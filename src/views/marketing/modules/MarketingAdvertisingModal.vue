<template>
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
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="广告类型">
          <!--；建立数据字典读取，字典名称：ad_type；0:为平台广告；1：店铺广告"-->
          <!-- <j-dict-select-tag @change="chooseMedicineAdType" v-decorator="['adType', validatorRules.adType]"
                             :triggerChange="true" placeholder="请选择广告类型"
                             dictCode="ad_type"/>-->
          <div>
            <a-radio-group v-decorator="['adType', validatorRules.adType]" @change="chooseMedicineAdType">
              <a-radio value="0">
                平台广告
              </a-radio>
              <a-radio value="1">
                店铺广告
              </a-radio>
            </a-radio-group>
          </div>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="店铺" v-if="dianpu">
          <!--；0：无；1：商品详情-->
          <a-select
            show-search
            placeholder="请选择店铺"
            @focus="handleFocusStore"
            @change="handleChangesStore"
            @search="filterOptionStore"
            :filter-option="false"
            :not-found-content="fetchingStore ? undefined : null"
            v-decorator="['sysUserId', validatorRules.sysUserId]"
          >
            <a-spin v-if="fetchingStore" slot="notFoundContent" size="small" />
            <a-select value="" v-else>请选择</a-select>
            <a-select-option
              @click="chooseSysUserId(item.sysUserId)"
              :value="item.sysUserId"
              v-for="item in dianpulist"
              >{{ item.storeName }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="广告位置">
          <j-dict-select-tag
            v-decorator="['adLocation', validatorRules.adLocation]"
            :triggerChange="true"
            placeholder="请选择广告位置"
            dictCode="ad_location"
            @change="adLocationChange"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="图片">
          <a-upload
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            :action="uploadAction"
            :data="{ isup: 1 }"
            :headers="headers"
            :beforeUpload="beforeUpload"
            @change="handleChange"
            help="请上传广告图片338*100,支持jpg、jpeg、png格式，大小不超过5M"
          >
            <img v-if="picUrl" :src="getAvatarView()" alt="头像" style="height:100px;max-width:338px" />
            <div v-else>
              <a-icon :type="uploadLoading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="轮播图背景色" v-if="showHeaderColor">
          <div style="display: flex;align-items: center;height:40px">
            <a-input
              @change="headColorChange"
              v-decorator="[
                'headColor',
                { rules: [{ required: false, message: '请输入颜色值（HEX,RGB,RGBA等形式）' }] }
              ]"
              placeholder="请输入颜色值(HEX,RGB,RGBA)"
              style="width: 210px;margin-right: 10px;"
            ></a-input>
            <div
              style="width: 50px;height: 50px;transition: all .2s linear"
              :style="{ background: model.headColor }"
            ></div>
          </div>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="跳转类型">
          <div>
            <a-radio-group v-decorator="['goToType', validatorRules.goToType]" @change="chooseMedicineGoToType">
              <a-radio value="0">
                无
              </a-radio>
              <a-radio value="1">
                商品详情
              </a-radio>
              <a-radio value="2">
                详情图
              </a-radio>
<!--              <a-radio value="4">-->
<!--                封坛礼包-->
<!--              </a-radio>-->
              <a-radio v-if="adType == 0" value="3">
                素材
              </a-radio>
            </a-radio-group>
          </div>
        </a-form-item>
        <a-form-item
          v-if="goToType == 2"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          validate-status="validating"
          help="请上传广告详情图图片，宽度800，高度不限，支持jpg、jpeg、png格式，大小不超过5M"
        >
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            <span>
              地址
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
            <!--            v-if="picFileList.length < 1"-->
            <div>
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :footer="null" :visible="picPreviewVisible" @cancel="picHandleCancel">
            <img :src="picPreviewImage" alt="example" style="width: 100%" />
          </a-modal>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="平台/店铺商品" v-if="goToType == 1">
          <a-select
            show-search
            placeholder="请选择商品"
            @focus="selectFocusGood"
            @search="handleChangeGood"
            :filter-option="false"
            :not-found-content="fetching ? undefined : null"
            v-decorator="['goodListId', validatorRules.goodListId]"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select value="" v-else>请选择</a-select>

            <a-select-option v-for="item in goodlist" :key="item.id" 　>{{ item.goodName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="素材" v-if="goToType == 3">
          <!--@focus="selectFocusMarketingMaterialList"-->
          <a-select
            show-search
            placeholder="请选择素材"
            @search="handleChangeMarketingMaterialList"
            :filter-option="false"
            :not-found-content="fetching ? undefined : null"
            v-decorator="['marketingMaterialListId', validatorRules.marketingMaterialListId]"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select value="" v-else>请选择</a-select>

            <a-select-option v-for="item in marketingMaterialList" :key="item.id" 　>{{ item.title }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
          <a-input placeholder="请输入排序" v-decorator="['sort', validatorRules.sort]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开始时间">
          <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="['startTime', validatorRules.startTime]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="结束时间">
          <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="['endTime', validatorRules.endTime]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态"
          ><!--0：停用；1：启用-->
          <a-select v-decorator="['status', validatorRules.status]" placeholder="请选择">
            <a-select-option value="0">停用</a-select-option>
            <a-select-option value="1">启用</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { disabledAuthFilter } from '@/utils/authFilter'
import debounce from 'lodash/debounce'
import pick from 'lodash.pick'
import moment from 'moment'
import Vue from 'vue'
import { getAction } from '@/api/manage'
import { duplicateCheck } from '@/api/api'
import { mapGetters } from 'vuex'

export default {
  name: 'MarketingAdvertisingModal',
  data() {
    this.lastFetchId = 0
    this.lastFetchIdStore = 0

    this.filterOptionStore = debounce(this.filterOptionStore, 800)
    this.handleChangeGood = debounce(this.handleChangeGood, 800)
    return {
      title: '操作',
      showHeaderColor: false,
      visible: false,
      goToType: 0,
      dianpu: false,
      fetching: false,
      fetchingStore: false,
      dianpulist: [],
      goodlist: [],
      marketingMaterialList: [],
      adType: 0,
      model: {},
      headers: {},
      aa: [],
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
      uploadLoading: false,
      picUrl: '',
      sysUserId: '',
      delFlag: '',
      validatorRules: {
        title: { rules: [{ required: true, message: '请输入标题!' }] },
        adType: { rules: [{ required: true, message: '请选择' }] },
        adLocation: { rules: [{ required: true, message: '请选择' }] },
        goToType: { rules: [{ required: true, message: '请选择' }] },
        goodListId: { rules: [{ required: true, message: '请选择' }] },
        sort: { rules: [{ required: true, pattern: /^\d+$/, message: '只能输入数字' }] },
        startTime: { rules: [{ required: true, message: '请选择' }] },
        endTime: { rules: [{ required: true, message: '请选择' }] },
        status: { rules: [{ required: true, message: '请选择状态!' }] },
        sysUserId: { rules: [{ required: true, message: '请选择!' }] },
        marketingMaterialListId: { rules: [{ required: true, message: '请选择!' }] }
      },
      url: {
        add: '/marketingAdvertising/marketingAdvertising/add',
        edit: '/marketingAdvertising/marketingAdvertising/edit',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        goodListOk: '/marketingAdvertising/marketingAdvertising/goodListOk',
        findStoreList: '/storeManage/storeManage/storeListAndName',
        getMarketingMaterialList: '/marketingMaterialList/marketingMaterialList/list'
      }
    }
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
  },
  computed: {
    uploadAction: function() {
      return this.url.fileUpload
    }
  },
  watch: {
    goToType(newVal) {
      if (newVal == 3) {
        this.selectFocusMarketingMaterialList()
      }
    }
  },
  methods: {
    headColorChange(e) {
      this.model.headColor = e.target.value
      console.log(e.target.value)
    },
    adLocationChange(value) {
      if (value * 1 === 0) {
        this.showHeaderColor = true
      } else {
        this.showHeaderColor = false
      }
    },
    //图片上传
    normFile(e) {
      console.log('Upload event:', e)
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    },
    beforeUpload: function(file) {
      var fileType = file.type
      if (fileType.indexOf('image') < 0) {
        this.$message.warning('请上传图片')
        return false
      }
      //TODO 验证文件大小
    },
    handleChange(info) {
      this.picUrl = ''
      if (info.file.status === 'uploading') {
        this.uploadLoading = true
        return
      }
      if (info.file.status === 'done') {
        var response = info.file.response
        this.uploadLoading = false
        console.log(response)
        if (response.success) {
          //this.model.avatar = response.message;
          this.model.pictureAddr = response.message
          console.log('this.pictureAddr:', this.pictureAddr)
          this.picUrl = 'Has no pic url yet'
        } else {
          this.$message.warning(response.message)
        }
      }
    },
    getAvatarView() {
      console.log(this.url.imgerver + '/' + this.model.pictureAddr)
      return this.url.imgerver + '/' + this.model.pictureAddr
    },
    ...mapGetters(['nickname', 'pictureAddr', 'userInfo']),
    findStoreList(storeName = '', sysUserId = '') {
      return new Promise((resolve, reject) => {
        getAction(this.url.findStoreList, { storeName, sysUserId }).then(res => {
          if (res.success) {
            console.log('res.result', res.result)
            this.dianpulist = res.result
            this.$nextTick(() => {
              resolve(res.result)
            })
            // this.dataSource2 = res.result.listGoodList;
          } else {
            reject('fail')
          }
        })
      })
    },
    /*图片上传结束*/
    add() {
      this.edit({})
    },
    async edit(record) {
      this.goodlist = []
      this.dianpulist = []
      this.picFileList = []
      this.goToType = record.goToType
      this.adType = record.adType
      this.form.resetFields()

      this.model.sysUserId = record.sysUserId
      this.sysUserId = record.sysUserId
      if (record.pictureDetails) {
        try {
          let pictureDetails = Object.values(JSON.parse(record.pictureDetails))
          let count = 0
          for (let item of pictureDetails) {
            count++
            this.picFileList.push({
              url: this.url.imgerver + '/' + item,
              uid: count,
              response: {
                message: item
              }
            })
          }
        } catch {
          console.warn('pictureDetails商品详情图字段为多图格式！')
        }
      }
      this.model = Object.assign({}, record)
      if (!record.id) {
        this.model = Object.assign({}, this.model, { goToType: '0', adType: '0' })
      }
      let hasId = false
      let findStoreList = []
      let findStoreList2 = await this.findStoreList('')
      for (let item of findStoreList2) {
        if (record.sysUserId == item.sysUserId) {
          hasId = true
          break
        }
      }
      if (!hasId) {
        findStoreList = await this.findStoreList('', record.sysUserId)
        this.dianpulist = [...this.dianpulist, ...findStoreList]
      }
      // this.findStoreList()
      this.goToType = this.model.goToType
      if (this.model.delFlag) {
        this.model.delFlag = 0
      }
      if (this.model.adType) {
        //查询添加商品列表
        this.adType = this.model.adType
        //this.goodlist=[];
        getAction(this.url.goodListOk, {
          adType: this.model.adType,
          sysUserId: this.model.sysUserId,
          goodName: this.goodName
        }).then(res => {
          if (res.success) {
            this.goodlist = res.result.goodlist
            // this.dataSource2 = res.result.listGoodList;
          }
        })
      }
      this.dianpu = this.model.adType == 1 ? true : false
      console.log('this.model.sysUserId===', this.model.sysUserId)
      //预览显示图片
      if (record.hasOwnProperty('id')) {
        this.picUrl = 'Has no pic url yet'
      }

      this.visible = true
      this.$nextTick(() => {
        this.adLocationChange(this.model.adLocation)
        this.form.setFieldsValue(
          pick(
            this.model,
            'year',
            'month',
            'day',
            'sysUserId',
            'title',
            'adType',
            'adLocation',
            'pictureAddr',
            'goToType',
            'goodListId',
            'sort',
            'status',
            'delFlag',
            'marketingMaterialListId',
            'pictureDetails',
            'headColor'
          )
        )
        //时间格式化
        this.form.setFieldsValue({})
        this.form.setFieldsValue({ startTime: this.model.startTime ? moment(this.model.startTime) : null })
        this.form.setFieldsValue({ endTime: this.model.endTime ? moment(this.model.endTime) : null })
        console.log('this.model', this.model)
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.picUrl = ''
      this.sysUserId = ''
      this.delFlag = ''
    },
    handleOk() {
      const that = this
      if (this.goToType == 2 && this.picFileList.length <= 0) {
        this.$message.warn('请上传详情图！')
        return
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
          } else {
            httpurl += this.url.edit
            method = 'put'
          }
          let formData = Object.assign(this.model, values)
          formData.sysUserId = this.sysUserId //保存店铺Id
          //时间格式化
          formData.startTime = formData.startTime ? formData.startTime.format('YYYY-MM-DD HH:mm:ss') : null
          formData.endTime = formData.endTime ? formData.endTime.format('YYYY-MM-DD HH:mm:ss') : null
          console.log(formData)
          if (formData.goToType == 0) {
            formData.goodListId = ''
          }
          if (formData.goToType == 2 && this.picFileList.length > 0) {
            let pictureDetailsObj = {}
            for (let index = 0; index < this.picFileList.length; index++) {
              pictureDetailsObj[index] = this.picFileList[index].response.message
            }
            formData.pictureDetails = JSON.stringify(pictureDetailsObj)
          } else {
            formData.pictureDetails = ''
          }

          httpAction(httpurl, formData, method)
            .then(res => {
              console.log(formData)
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
    //广告类型
    chooseMedicineAdType: function(value) {
      let that = this
      this.adType = value.target.value
      console.log('this.adType', this.adType)
      this.goodlist = []
      this.goodListId = ''
      if (this.adType == 1) {
        this.dianpu = true
      } else {
        this.sysUserId = ''
        this.dianpu = false
      }
      //this.validatorRules.goodListId ='';
      //this.form.resetFields(['goodListId'])
      this.goToType = '0'
      setTimeout(() => {
        this.form.setFieldsValue({ goodListId: '', goToType: '0' })
      }, 200)

      /*if(this.adType!=null || this.adType!=undefined){
          //this.goodlist=[];
          getAction(this.url.goodListOk,{adType: this.adType }).then((res) => {
            if (res.success) {
              console.log("res.result.goodlist===",res.result.goodlist)
              this.goodlist = res.result.goodlist;
              // this.dataSource2 = res.result.listGoodList;
            }
          })
        }*/
    },
    //选择店铺Id
    chooseSysUserId(sysUserId) {
      this.sysUserId = sysUserId
      this.form.setFieldsValue({ goodListId: '' })
      /*if (this.adType) {
          //this.goodlist=[];
          this.validatorRules.goodListId = '';
          getAction(this.url.goodListOk, { adType: this.adType, sysUserId: sysUserId }).then((res) => {
            if (res.success) {
              console.log('res.result.goodlist===', res.result.goodlist)
              this.goodlist = res.result.goodlist
              // this.dataSource2 = res.result.listGoodList;
            }
          })
        }*/
    },

    //跳转类型
    chooseMedicineGoToType: function(value) {
      console.log('goToType---' + value.target.value)
      let that = this
      this.goToType = value.target.value
      this.picFileList = []
      this.form.setFieldsValue({ goodListId: '' })
    },

    handleChangeGood(value) {
      // console.log(value);
      //let goodName = value
      this.goodName = value
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      //this.goodlist = [];
      this.fetching = true
      if (fetchId !== this.lastFetchId) {
        return
      }
      getAction(this.url.goodListOk, { adType: this.adType, sysUserId: this.sysUserId, goodName: this.goodName }).then(
        res => {
          if (res.success) {
            this.goodlist = res.result.goodlist
          }
          //this.fetching = false;
        }
      )
    },
    changeGoodListId: function(value) {
      console.log(value)
      value = ''
    },

    handleChangesStore(value) {
      console.log(`selected ${value}`)
      //this.form.resetFields(['goodListId'])

      //this.filterOptionStore();
    },
    // handleBlur() {
    //
    //   console.log('blur')
    // },
    handleFocusStore() {
      console.log('handleFocusStore')
      this.filterOptionStore()
    },

    searchGoodsOption(goodName) {
      getAction(this.url.goodListOk, { adType: this.adType, sysUserId: this.sysUserId, goodName }).then(res => {
        if (res.success) {
          this.goodlist = res.result.goodlist
          resolve('success')
          // this.dataSource2 = res.result.listGoodList;
        } else {
          reject('fail:' + res.message)
        }
      })
      // })
    },
    filterOptionStore(value) {
      let storeName = value
      this.lastFetchIdStore += 1
      const fetchId = this.lastFetchIdStore
      //this.dianpulist = [];
      this.fetchingStore = true
      if (fetchId !== this.lastFetchIdStore) {
        return
      }
      getAction(this.url.findStoreList, { storeName: storeName }).then(res => {
        if (res.success) {
          console.log('res.result', res.result)
          this.dianpulist = res.result
        }
        this.fetchingStore = false
      })
    },
    //查询商品
    selectFocusGood() {
      console.log('selectFocusGood ')
      this.handleFocusGood()
    },
    handleFocusGood() {
      // return new Promise((resolve,reject)=>{
      getAction(this.url.goodListOk, { adType: this.adType, sysUserId: this.sysUserId, goodName: this.goodName }).then(
        res => {
          if (res.success) {
            this.goodlist = res.result.goodlist
            // this.dataSource2 = res.result.listGoodList;
            // resolve('success')
          } else {
            // reject('fail')
          }
        }
      )

      // })
    },
    //查询素材
    selectFocusMarketingMaterialList() {
      this.handleFocusMarketingMaterialList()
    },
    handleFocusMarketingMaterialList() {
      getAction(this.url.getMarketingMaterialList, { isPublish: 1 }).then(res => {
        if (res.success) {
          this.marketingMaterialList = res.result.records
        } else {
        }
      })
    },

    handleChangeMarketingMaterialList(value) {
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      //this.goodlist = [];
      this.fetching = true
      if (fetchId !== this.lastFetchId) {
        return
      }
      getAction(this.url.getMarketingMaterialList, { isPublish: 1, title: value }).then(res => {
        if (res.success) {
          this.marketingMaterialList = res.result.records
        }
        //this.fetching = false;
      })
    },

    //图片上传验证
    picFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 5
      const fileType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      if (!fileType) {
        this.$message.error('请上传jpg、jpeg、png格式的图片')
      }
      if (!isLt2M) {
        this.$message.error('图片大小必须在5M以内!')
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
      let index = fileList.length - 1
      if (
        fileList[index].size / 1024 / 1024 < 5 &&
        (fileList[index].type === 'image/jpeg' ||
          fileList[index].type === 'image/png' ||
          fileList[index].type === 'image/jpg')
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
    }
  }
}
</script>

<style lang="less" scoped></style>
