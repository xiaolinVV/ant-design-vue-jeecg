<template>
  <a-card :bordered="false" :title="title">
    <a-skeleton :loading="skeletonLoading">
      <a-form :form="form">
        <!--      v-decorator="[ 'remarkExplian', validatorRules.remarkExplian]"-->
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="类型">
          <a-radio-group v-decorator="['materialType', validatorRules.materialType]" @change="materialTypeChange">
            <a-radio value="1"> 图文素材 </a-radio>
            <a-radio value="2"> 视频素材 </a-radio>
            <a-radio value="3"> 活动素材 </a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          help="关联栏目后,报名活动的用户可以在该栏目下发表素材"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="栏目"
          v-if="!skeletonLoading"
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

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="关联活动"
          v-if="!skeletonLoading && AllData.materialType == 3"
        >
          <a-select
            style="width: 200px"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            show-search
            @search="handleSearch"
            v-decorator="['marketingActivityListId', validatorRules.marketingActivityListId]"
          >
            <a-select-option value=""> 请选择 </a-select-option>
            <a-select-option v-for="(item, index) in marketingActivityListIdLists" :key="index" :value="item.id">
              {{ item.activityName }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="标题">
          <a-input v-decorator="['title', validatorRules.title]"></a-input>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="作者">
          {{ AllData.author }}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="关键字">
          <a-input
            v-decorator="['keyword', validatorRules.keyword]"
            placeholder='请输入关键字以逗号 "," 隔开'
          ></a-input>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="摘要">
          <a-textarea
            v-decorator="['abstractDigest', validatorRules.abstractDigest]"
            placeholder="摘要说明"
          ></a-textarea>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          validate-status="validating"
          help=" 尺寸800*800 支持jpg、jpeg、png格式，大小不超过2M"
          :colon="false"
        >
          <div slot="label">
            <span class="dataCheckedStar"> * </span>
            <span style="margin-right: 10px"> 封面图: </span>
          </div>
          <a-upload
            :action="uploadAction"
            :headers="headers"
            :fileList="frontCoverFileList"
            :beforeUpload="frontCoverBeforeUpload"
            list-type="picture-card"
            @preview="frontCoverPreview"
            @change="frontCoverChange"
          >
            <div v-if="frontCoverFileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
          <a-modal :visible="frontCoverPreviewVisible" :footer="null" @cancel="frontCoverCancel">
            <img preview="1" alt="example" style="width: 100%" :src="frontCoverPreviewImage" />
          </a-modal>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          validate-status="validating"
          help="尺寸800*640 ，支持jpg、jpeg、png格式，大小不超过2M"
          :colon="false"
        >
          <div slot="label">
            <span class="dataCheckedStar"> * </span>
            <span style="color: red; margin-right: 10px"> 分享图: </span>
          </div>
          <a-upload
            :action="uploadAction"
            :headers="headers"
            :fileList="shareFileList"
            :beforeUpload="shareBeforeUpload"
            list-type="picture-card"
            @preview="sharePreview"
            @change="shareChange"
          >
            <div v-if="shareFileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
          <a-modal :visible="sharePreviewVisible" :footer="null" @cancel="shareCancel">
            <img preview="1" alt="example" style="width: 100%" :src="sharePreviewImage" />
          </a-modal>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          validate-status="validating"
          help="尺寸1428*2540，支持jpg、jpeg、png格式，大小不超过2M。必须预留好二维码位置。以免影响展示效果"
          :colon="false"
        >
          <div slot="label">
            <span class="dataCheckedStar"> * </span>
            <span style="margin-right: 10px"> 海报图: </span>
          </div>
          <a-upload
            :action="uploadAction"
            :headers="headers"
            :fileList="posterFileList"
            :beforeUpload="posterBeforeUpload"
            list-type="picture-card"
            @preview="posterPreview"
            @change="posterChange"
          >
            <div v-if="posterFileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
          <a-modal :visible="posterPreviewVisible" :footer="null" @cancel="posterCancel">
            <img preview="1" alt="example" style="width: 100%" :src="posterPreviewImage" />
          </a-modal>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="{
            xs: { span: 24 },
            sm: { span: 20 },
          }"
          :colon="false"
        >
          <div slot="label">
            <span class="dataCheckedStar"> * </span>
            <span style="margin-right: 10px"> 内容: </span>
          </div>
          <JEditor v-model="twContent"> </JEditor>
          <a-upload
            name="file"
            :headers="headers"
            :action="uploadAction"
            @change="videoChange"
            :fileList="videoFileList"
            :beforeUpload="videoBeforeUpload"
            v-if="AllData.materialType == 2"
          >
            <a-button style="font-size: 14px" v-if="videoFileList.length <= 0">
              <a-icon type="upload" />
              点击上传视频
            </a-button>
          </a-upload>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="{
            xs: { span: 24 },
            sm: { span: 20 },
          }"
          :colon="false"
        >
          <div slot="label">
            <!--            <span class="dataCheckedStar">-->
            <!--               *-->
            <!--             </span>-->
            <span style="margin-right: 10px"> 关联商品: </span>
          </div>
          <a-button type="primary" @click="showSelectGoodsPopUp"> 选择商品 </a-button>
          <a-alert
            message="重要提示：设定商品优惠券时请先核算好商品的利润，避免优惠后可能造成的利润亏损"
            type="info"
            style="margin-top: 10px"
          />
          <a-table :columns="columns" :data-source="dataSource">
            <template slot="mainPicture" slot-scope="text">
              <img
                preview="1"
                :src="getImgView(text)"
                alt=""
                style="width: 50px; height: 50px; display: block; margin: 0 auto"
              />
            </template>
            <template slot="action" slot-scope="text, record">
              <a-popconfirm v-if="dataSource.length" title="确定要删除吗?" @confirm="() => onDelete(record.goodListId)">
                <a href="javascript:">删除</a>
              </a-popconfirm>
            </template>
          </a-table>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="是否发布">
          <a-radio-group v-decorator="['isPublish', validatorRules.isPublish]">
            <a-radio value="1"> 是 </a-radio>
            <a-radio value="0"> 否 </a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="初始浏览量">
          <a-input-number
            :min="0"
            v-decorator="['initialViews', validatorRules.initialViews]"
            style="width: 250px"
          ></a-input-number>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="初始点赞数">
          <a-input-number
            :min="0"
            v-decorator="['initialPraise', validatorRules.initialPraise]"
            style="width: 250px"
          ></a-input-number>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
          <a-input-number :min="0" v-decorator="['sort', validatorRules.sort]" style="width: 250px"></a-input-number>
        </a-form-item>

        <div class="button-end"></div>

        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 150px;
            height: 100px;
            margin: 0 auto;
          "
        >
          <a-button type="white"> 取消 </a-button>
          <a-button type="primary" @click="submit"> 确定 </a-button>
        </div>
      </a-form>
    </a-skeleton>
    <select-goods-to-add-pop-up
      apiName="getMarketingMarKarKetingGood"
      :selectGoodsPopUpLists="dataSource"
      :marketingMaterialListId="AllData && AllData.id ? AllData.id : ''"
      ref="selectGoodsToAddPopUp"
      @handleOk="selectGoodsHandleOk"
      :selectGoodsPopUpIds="selectGoodsPopUpIds"
    >
    </select-goods-to-add-pop-up>
  </a-card>
</template>

<script>
import { mapGetters } from 'vuex'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
import ATextarea from 'ant-design-vue/es/input/TextArea'
import Vue from 'vue'
import JEditor from '@/components/jeecg/JEditor'
import selectGoodsToAddPopUp from '@/components/popUp/selectGoodsToAddPopUp.vue'
import { httpAction, postAction, getAction, putAction } from '@/api/manage'
const columns = [
  {
    title: '商品图片',
    dataIndex: 'mainPicture',
    width: 150,
    align: 'center',
    scopedSlots: { customRender: 'mainPicture' },
  },
  {
    title: '商品名称',
    dataIndex: 'goodName',
    align: 'center',
  },
  {
    title: '商品分类',
    dataIndex: 'goodTypeNames',
    align: 'center',
  },
  {
    title: '市场价',
    dataIndex: 'marketPrice',
    align: 'center',
  },
  {
    title: '销售价',
    dataIndex: 'price',
    align: 'center',
  },
  {
    title: '会员价',
    dataIndex: 'vipPrice',
    align: 'center',
  },
  {
    title: '库存',
    dataIndex: 'repertory',
    align: 'center',
  },
  {
    title: '供应商',
    dataIndex: 'realname',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    scopedSlots: { customRender: 'action' },
  },
]
export default {
  name: 'AddMarketingMaterialModel',
  components: { ATextarea, JEditor, selectGoodsToAddPopUp },
  data() {
    return {
      skeletonLoading: false,
      form: this.$form.createForm(this),
      title: '添加素材',
      uploadAction: window._CONFIG['domianURL'] + '/sys/common/upload',
      headers: '',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      validatorRules: {
        marketingMaterialColumnId: { rules: [{ required: true, message: '请选择栏目!' }] },
        marketingActivityListId: { rules: [{ required: true, message: '请选择关联活动!' }] },
        title: { rules: [{ required: true, message: '请输入标题!' }] },
        keyword: { rules: [{ required: true, message: '请输入关键字以，隔开!' }] },
        abstractDigest: { rules: [{ required: true, message: '请输入摘要说明!' }] },
        materialType: { rules: [{ required: true, message: '请选择类型!' }] },
        isPublish: { rules: [{ required: true, message: '请选择是否发布!' }] },
        initialViews: { rules: [{ required: true, message: '请输入初始浏览量!' }] },
        initialPraise: { rules: [{ required: true, message: '请输入初始点赞数!' }] },
        sort: { rules: [{ required: false, message: '请设置排序!' }] },
      },
      //封面图配置
      frontCoverFileList: [],
      frontCoverPic: true,
      frontCoverPreviewImage: '',
      frontCoverPreviewVisible: false,
      //分享图配置
      shareFileList: [],
      sharePic: true,
      sharePreviewImage: '',
      sharePreviewVisible: false,
      //海报图配置
      posterFileList: [],
      posterPic: true,
      posterPreviewImage: '',
      posterPreviewVisible: false,
      columns,
      dataSource: [],
      //图文数据
      twContent: '',
      //视频数据 视频上传
      videoFileList: [],
      //栏目列表数据
      marketingMaterialColumnData: [],
      //活动列表
      marketingActivityListIdLists: [],
      //选择商品弹窗回显需要的ids （数组形式）
      selectGoodsPopUpIds: [],
      //所有数据
      AllData: {
        id: '',
        content: '',
        author: '',
        marketingMaterialColumnId: '',
        marketingActivityListId: '',
        title: '',
        keyword: '',
        abstractDigest: '',
        surfacePlot: '', //封面图
        posters: '', //海报图
        coverPlan: '', //推广图、分享图
        materialVideo: '', //视频地址
        materialType: '1',
        isPublish: '1',
        marketingMaterialGoodDTOList: [],
        // marketingMaterialGoodDTOListStr:''
      },
      url: {
        // 栏目列表 GET
        getMarketingMaterialColumnListMap:
          '/marketingMaterialColumn/marketingMaterialColumn/getMarketingMaterialColumnListMap',
        // 活动列表 GET
        getFindMarketingActivityListByName: '/marketing/marketingActivityList/findMarketingActivityListByName',
        // 素材添加修改接口 POST
        addMarketingMaterialList: '/marketingMaterialList/marketingMaterialList/addMarketingMaterialList',
        // 素材选中商品回选 GET
        postGoodListList: 'marketingMaterialGood/marketingMaterialGood/postGoodListList',
        //获取作者
        queryById: '/sys/user/queryById',
      },
      //配置
      configure: {
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
      },
      //反显的关联商品
      editResultDataSource: [],
    }
  },
  async created() {
    this.skeletonLoading = true
    const token = Vue.ls.get('Access-Token')
    this.headers = { 'X-Access-Token': token }
    this.form.resetFields()
    let isEdit = this.$route.query.isEdit || ''
    let AddMarketingMaterialModelData = localStorage.getItem('AddMarketingMaterialModelData')
    if (AddMarketingMaterialModelData) {
      AddMarketingMaterialModelData = JSON.parse(AddMarketingMaterialModelData)
      if (!AddMarketingMaterialModelData.id) {
        AddMarketingMaterialModelData = ''
      }
    } else {
      AddMarketingMaterialModelData = ''
    }
    const getMarketingMaterialColumnList = await this.getMarketingMaterialColumnList()
    await this.getMarketingActivityList()
    if (isEdit == 2 || AddMarketingMaterialModelData) {
      let AddMarketingMaterialModelDataResult = AddMarketingMaterialModelData
      this.editShowHandleImg(AddMarketingMaterialModelDataResult.surfacePlot, 'frontCoverFileList')
      this.editShowHandleImg(AddMarketingMaterialModelDataResult.coverPlan, 'shareFileList')
      this.editShowHandleImg(AddMarketingMaterialModelDataResult.posters, 'posterFileList')
      this.editShowHandleImg(AddMarketingMaterialModelDataResult.materialVideo, 'videoFileList')
      this.twContent = AddMarketingMaterialModelData.content
      this.dataSource = AddMarketingMaterialModelData.marketingMaterialGoodDTOList
      this.editResultDataSource = AddMarketingMaterialModelData.marketingMaterialGoodDTOList
      this.AllData = Object.assign({}, this.AllData, AddMarketingMaterialModelData)
      this.$nextTick(() => {
        this.form.setFieldsValue(this.AllData)
      })
    } else {
      const getRealname = await this.getRealname()
      this.AllData = Object.assign({}, this.AllData)
      this.$nextTick(() => {
        this.form.setFieldsValue(this.AllData)
        localStorage.removeItem('AddMarketingMaterialModelData')
      })
    }
    this.skeletonLoading = false
  },

  methods: {
    ...mapGetters(['nickname', 'pictureAddr', 'userInfo']),
    //图片格式处理
    getImgView(url = '') {
      if (url) {
        return this.configure.imgerver + '/' + Object.values(JSON.parse(url))[0]
      }
    },
    //封面图
    frontCoverCancel() {
      this.frontCoverPreviewVisible = false
    },
    handleSearch(value) {
      this.getMarketingActivityList(value)
    },
    async frontCoverPreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.frontCoverPreviewImage = file.url || file.preview
      this.frontCoverPreviewVisible = true
    },
    frontCoverChange({ fileList }) {
      if (this.frontCoverPic) {
        this.frontCoverFileList = fileList
      }
    },
    frontCoverBeforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJpgOrPng) {
        this.$message.error('图片必须为jpeg，png,jpg格式!')
      }
      if (!isLt2M) {
        this.$message.error('图片大小必须在2M以内!')
      }
      this.frontCoverPic = isLt2M && isJpgOrPng
      return isLt2M && isJpgOrPng
    },
    //分享图
    shareCancel() {
      this.sharePreviewVisible = false
    },
    async sharePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.sharePreviewImage = file.url || file.preview
      this.sharePreviewVisible = true
    },
    shareChange({ fileList }) {
      if (this.sharePic) {
        this.shareFileList = fileList
      }
    },
    shareBeforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJpgOrPng) {
        this.$message.error('图片必须为jpeg，png,jpg格式!')
      }
      if (!isLt2M) {
        this.$message.error('图片大小必须在2M以内!')
      }
      this.sharePic = isLt2M && isJpgOrPng
      return isLt2M && isJpgOrPng
    },
    //海报图
    posterCancel() {
      this.posterPreviewVisible = false
    },
    async posterPreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.posterPreviewImage = file.url || file.preview
      this.posterPreviewVisible = true
    },
    posterChange({ fileList }) {
      if (this.posterPic) {
        this.posterFileList = fileList
      }
    },
    posterBeforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJpgOrPng) {
        this.$message.error('图片必须为jpeg，png,jpg格式!')
      }
      if (!isLt2M) {
        this.$message.error('图片大小必须在2M以内!')
      }
      this.posterPic = isLt2M && isJpgOrPng
      return isLt2M && isJpgOrPng
    },
    //上传视频
    videoChange(info) {
      if (this.canUploadVideo) {
        let fileList = [...info.fileList]
        // 1. Limit the number of uploaded files
        //    Only to show two recent uploaded files, and old ones will be replaced by the new
        fileList = fileList.slice(-2)
        // 2. read from response and show file link
        fileList = fileList.map((file) => {
          if (file.response) {
            // Component will show file.url as link
            file.url = file.response.url
          }
          return file
        })
        this.videoFileList = fileList
      }
    },
    //视频校验
    videoBeforeUpload(file) {
      const isVideo =
        file.type === 'video/mp4' ||
        file.type === 'video/rmvb' ||
        file.type === 'video/3gp' ||
        file.type === 'video/avi' ||
        file.type === 'video/mov' ||
        file.type === 'video/x-ms-wmv' ||
        file.type === 'video/flv' ||
        file.type === 'video/mkv'
      if (!isVideo) {
        this.$message.error('需上传支持mp4,rmvb,3gp,avi,mov,wmv,flv,mkv的视频格式!')
      }
      const isLt2M = file.size / 1024 / 1024 < 50
      if (!isLt2M) {
        this.$message.error('视频大小必须在50M以内!')
      }
      this.canUploadVideo = isVideo && isLt2M
      return isVideo && isLt2M
    },
    //显示选择商品弹窗
    showSelectGoodsPopUp() {
      // console.log(this.$refs.selectGoodsToAddPopUp)
      this.$refs.selectGoodsToAddPopUp.open()
    },
    //确认选择商品弹窗
    selectGoodsHandleOk(ids) {
      // let duplicationArray = ids ? ids.split(',') : [];
      // for(let item of this.dataSource){
      //   duplicationArray.push(item.goodListId)
      // }
      // ids = Array.from(new Set(duplicationArray)).join(',')
      this.selectGoodsPopUpIds = ids.split(',')
      postAction(this.url.postGoodListList, { ids, marketingMaterialListId: this.AllData.id || '' }).then((res) => {
        if (res.success) {
          this.dataSource = [...this.editResultDataSource, ...res.result]
        } else {
          this.$message.warn(res.message || '网络波动，请稍后重试！')
        }
      })
    },
    //图片校验
    imgUpLoadCheck() {
      //封面图
      if (!Array.isArray(this.frontCoverFileList) || this.frontCoverFileList.length <= 0) {
        this.$message.warn('请上传封面图！')
        return false
      }
      //分享图
      if (!Array.isArray(this.shareFileList) || this.shareFileList.length <= 0) {
        this.$message.warn('请上传分享图！')
        return false
      }
      //海报图
      if (!Array.isArray(this.posterFileList) || this.posterFileList.length <= 0) {
        this.$message.warn('请上传海报图！')
        return false
      }
      return true
    },
    materialTypeChange(e) {
      this.AllData.materialType = e.target.value
    },
    //提交
    submit() {
      console.log(this.videoFileList)
      if (!this.imgUpLoadCheck()) {
        return
      }
      if (this.AllData.materialType == 2 && (!Array.isArray(this.videoFileList) || this.videoFileList.length <= 0)) {
        this.$message.warn('请上传视频素材！')
        return
      }
      if (this.AllData.materialType == 1 && !this.twContent) {
        this.$message.warn('请编辑图文素材！')
        return
      }
      // if(this.dataSource.length <= 0 ){
      //   this.$message.warn('请选择商品！')
      //   return;
      // }
      this.form.validateFields((err, values) => {
        if (!err) {
          this.AllData.marketingMaterialGoodDTOList = this.dataSource
          // this.AllData.marketingMaterialGoodDTOListStr = JSON.stringify(this.dataSource)
          this.AllData.content = this.twContent
          console.log(JSON.stringify(this.dataSource))
          this.allHandleImg(() => {
            values = Object.assign({}, this.AllData, values)
            postAction(this.url.addMarketingMaterialList, values).then((res) => {
              if (res.success) {
                this.$message.success(res.message || '操作成功！')
                this.$router.push({ path: '/marketing/MarketingMaterialListList' })
              } else {
                this.$message.error(res.message || '操作失败！')
              }
            })
          })
        }
      })
    },
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
    //活动列表数据
    getMarketingActivityList(name = '') {
      return new Promise((resolve, reject) => {
        getAction(this.url.getFindMarketingActivityListByName, { name }).then((res) => {
          if (res.success) {
            console.log(res)
            this.marketingActivityListIdLists = res.result
            resolve('success')
          } else {
            this.$message.warn(res.message || '网络波动，请稍后刷新页面重试！')
            reject(`栏目列表接口500！具体原因${res.message}`)
          }
        })
      })
    },
    //提交前的处理图片格式方法（多图）
    beforeSubmitHandleImg(varName) {
      return new Promise((resolve, reject) => {
        let Obj = {},
          result = ''
        console.log(this[varName])
        if (this[varName].length > 0) {
          for (let index = 0; index < this[varName].length; index++) {
            Obj[index] = this[varName][index].response.message
          }
          result = JSON.stringify(Obj)
        } else {
          result = ''
        }
        resolve(result)
      })
    },
    //提交图片的数据处理封装
    async allHandleImg(callback) {
      this.AllData.coverPlan = await this.beforeSubmitHandleImg('shareFileList')
      this.AllData.surfacePlot = await this.beforeSubmitHandleImg('frontCoverFileList')
      this.AllData.posters = await this.beforeSubmitHandleImg('posterFileList')
      this.AllData.materialVideo = await this.beforeSubmitHandleImg('videoFileList')
      callback()
    },
    //编辑反显的处理图片格式方法（多图）
    editShowHandleImg(values, varName) {
      let sz = []
      if (values && values != '{}') {
        let result = Object.values(JSON.parse(values))
        for (let index = 0; index < result.length; index++) {
          sz.push({
            uid: index,
            url: this.configure.imgerver + '/' + result[index],
            response: {
              message: result[index],
            },
          })
        }
      }
      this[varName] = sz
    },
    //获取作者
    getRealname() {
      return new Promise((resolve, reject) => {
        getAction(this.url.queryById, { id: this.userInfo().id }).then((res) => {
          if (res.success) {
            this.AllData.author = res.result.realname
            resolve()
          } else {
            this.$message.error('网络超时，请稍后刷新页面重试')
            reject(`获取作者请求失败！原因:${res.message || ''}`)
          }
        })
      })
    },
    onDelete(goodListId) {
      const dataSource = [...this.dataSource]
      const editResultDataSource = [...this.editResultDataSource]
      this.dataSource = dataSource.filter((item) => item.goodListId !== goodListId)
      this.editResultDataSource = editResultDataSource.filter((item) => item.goodListId !== goodListId)
    },
  },
}
</script>

<style lang="scss">
.button-end {
  /*margin-bottom: 20px;*/
  border-bottom: 1px solid gray;
}
</style>
