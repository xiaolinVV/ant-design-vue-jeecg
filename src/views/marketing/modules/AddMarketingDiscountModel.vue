<!--平台优惠券新增编辑页面-->
<!---->
<template>
  <a-card class="AddMarketingDiscountStoreModel" ref="AddMarketingDiscountStoreModel">
    <div class="title">{{ part == 2 ? '编辑' : '添加' }}券</div>
    <div class="wrap">
      <a-form :form="form">
        <!--v-decorator="['优惠券名称', { rules: [{ required: true, message: '请输入优惠券名称,字数不超过50个字' }] }]"-->
        <a-form-item label="优惠券名称" :label-col="labelCol" :wrapper-col="{ span: 12 }">
          <!--          v-model="AllData.name"-->
          <a-input
            v-decorator="[
              'name',
              { rules: [{ required: true, message: '请输入优惠券名称' }, { max: 50, message: '字数不能超过50个字' }] }
            ]"
            placeholder="请输入优惠券名称,字数不超过50个字"
          />
        </a-form-item>

        <a-form-item
          :label-col="labelCol"
          :wrapper-col="{ span: 12 }"
          validate-status="error"
          help="尺寸800*800 支持jpg、jpeg、png格式，大小不超过2M"
        >
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            主图
          </span>
          <a-upload
            :action="uploadAction"
            listType="picture-card"
            :fileList="mainPictureFileList"
            @preview="mainPictureHandlePreview"
            @change="mainPictureHandleChange"
            :headers="headers"
            :beforeUpload="mainPictureUpload"
          >
            <div v-if="mainPictureFileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :visible="mainPicturePreviewVisible" :footer="null" @cancel="mainPictureHandleCancel">
            <img alt="example" style="width: 100%" :src="mainPicturePreviewImage" />
          </a-modal>
        </a-form-item>
        <a-form-item
          :label-col="labelCol"
          :wrapper-col="{ span: 12 }"
          validate-status="error"
          help="尺寸800*640 ，支持jpg、jpeg、png格式，大小不超过2M"
        >
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            分享图
          </span>
          <a-upload
            :action="uploadAction"
            listType="picture-card"
            :fileList="diagramFileList"
            @preview="diagramHandlePreview"
            @change="diagramHandleChange"
            :headers="headers"
            :beforeUpload="diagramFileUpload"
          >
            <div v-if="diagramFileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :visible="diagramPreviewVisible" :footer="null" @cancel="diagramHandleCancel">
            <img alt="example" style="width: 100%" :src="diagramPreviewImage" />
          </a-modal>
        </a-form-item>
        <a-form-item
          :label-col="labelCol"
          :wrapper-col="{ span: 12 }"
          validate-status="error"
          help="尺寸1428*2540，支持jpg、jpeg、png格式，大小不超过2M。必须预留好二维码位置。以免影响展示效果。"
        >
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            海报图
          </span>
          <a-upload
            :action="uploadAction"
            listType="picture-card"
            :fileList="postersFileList"
            @preview="postersHandlePreview"
            @change="postersHandleChange"
            :headers="headers"
            :beforeUpload="postersFileUpload"
          >
            <div v-if="postersFileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :visible="postersPreviewVisible" :footer="null" @cancel="postersHandleCancel">
            <img alt="example" style="width: 100%" :src="postersPreviewImage" />
          </a-modal>
        </a-form-item>
        <a-form-item label="使用门槛" :label-col="labelCol" :wrapper-col="{ span: 12 }">
          <!--          v-model="AllData.isThreshold"-->
          <a-radio-group
            v-decorator="['isThreshold', { rules: [{ required: true, message: '请选择使用门槛' }] }]"
            @change="useThreshold"
          >
            <a-radio :style="radioStyle" :value="0">无门槛</a-radio>
            <a-radio :style="radioStyle" :value="1">
              订单满
              <a-input v-model="AllData.completely" :disabled="AllData.isThreshold == 0" />
              元
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="优惠内容" :label-col="labelCol" :wrapper-col="{ span: 12 }" class="Discount">
          <!--          v-model="AllData.subtract"-->
          减
          <a-input
            v-decorator="[
              'subtract',
              {
                rules: [
                  { required: true, message: '请输入优惠内容' },
                  {
                    pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
                    message: '请填写正确的金额'
                  }
                ]
              }
            ]"
          />
          元
        </a-form-item>
        <a-form-item label="用券时间" :label-col="labelCol" :wrapper-col="{ span: 18 }">
          <!--          v-model="AllData.vouchersWay"-->
          <a-radio-group
            style="display: flex;align-items: center;flex-wrap: wrap;"
            v-decorator="['vouchersWay', { rules: [{ required: true, message: '请选择用券时间' }] }]"
            @change="useCouponTime"
          >
            <div>
              <a-radio :value="0">
                <a-range-picker
                  v-model="selectDateToTime"
                  :disabled="AllData.vouchersWay != 0"
                  :defaultValue="
                    AllData.startTime && AllData.startTime
                      ? [moment(AllData.startTime, dateFormat), moment(AllData.endTime, dateFormat)]
                      : ''
                  "
                />
              </a-radio>
            </div>
            <div>
              <a-radio :value="1">
                领券当日起
                <a-input style="width: 75px;" v-model="AllData.today" :disabled="AllData.vouchersWay != 1" />
                <a-select defaultValue="天" style="width: 120px;margin-left: 10px;" v-model="AllData.monad">
                  <a-select-option value="天">
                    天
                  </a-select-option>
                  <a-select-option value="周">
                    周
                  </a-select-option>
                  <a-select-option value="月">
                    月
                  </a-select-option>
                </a-select>
                内可用
              </a-radio>
            </div>
            <div>
              <a-radio :value="2">
                领券次日起
                <a-input style="width: 75px;" v-model="AllData.tomorow" :disabled="AllData.vouchersWay != 2" />
                <a-select defaultValue="天" style="width: 120px;margin-left: 10px;" v-model="AllData.monad">
                  <a-select-option value="天">
                    天
                  </a-select-option>
                  <a-select-option value="周">
                    周
                  </a-select-option>
                  <a-select-option value="月">
                    月
                  </a-select-option>
                </a-select>
                内可用
              </a-radio>
            </div>
          </a-radio-group>
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="{ span: 20 }" label="适用商品">
          <!--          <span slot="label">-->
          <!--          <span class="dataCheckedStar">-->
          <!--            *-->
          <!--          </span>-->
          <!--          适用商品-->
          <!--        </span>-->
          <a-button @click="PopUp">
            选择商品
          </a-button>
          <a-alert
            :closable="true"
            message="重要提示：设定商品优惠券时请先核算好商品的利润，避免优惠后可能造成的利润亏损。"
            class="attention"
          />
          <a-table
            :columns="isSelectColumns"
            :dataSource="isSelectData"
            :pagination="{ pageSize: pageSize }"
            bordered
            style="margin-top: 20px;"
          >
            <template slot="mainPicture" slot-scope="text">
              <img :src="text" alt=" " style="width: 40px;height: 40px;" />
            </template>
            <template slot="operation" slot-scope="text, record">
              <a-popconfirm v-if="isSelectData.length" title="确定要删除吗?" @confirm="() => onDelete(record.id)">
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </template>
          </a-table>
          <div>已选择商品共计{{ isSelectData.length }}件</div>
        </a-form-item>

        <a-form-item label="使用方式" :label-col="labelCol" :wrapper-col="{ span: 12 }" class="line-special">
          <a-checkbox :checked="AllData.isUniqueness" @change="isUniquenessHandleChange">
            唯一选项
          </a-checkbox>
          <div>
            说明：默认为不勾选，即该优惠券可以多选适用商品加入购物车下单。勾选，即该优惠券仅可选择一个商品进行立即购买下单。
          </div>
        </a-form-item>

        <a-form-item label="适用商品分销" :label-col="labelCol" :wrapper-col="{ span: 12 }" class="line-special">
          <a-radio-group
            v-decorator="['isDistribution', { rules: [{ required: true, message: '请选择适用商品分销' }] }]"
          >
            <a-radio :style="radioStyle" value="1">参与分销</a-radio>
            <a-radio :style="radioStyle" value="0">不参与分销</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="发放总量" :label-col="labelCol" :wrapper-col="{ span: 12 }">
          <!--          v-model="AllData.total"-->
          <a-input
            type="number"
            v-decorator="[
              'total',
              {
                rules: [
                  { required: true, message: '请输入发放总量' },
                  { pattern: /^[+]{0,1}(\d+)$/, message: '发放总量为正整数！' }
                ]
              }
            ]"
          />
          <!--          编辑时仅能编辑剩余发行量，请谨慎设置-->
        </a-form-item>

        <a-form-item label="使用人限制" :label-col="labelCol" :wrapper-col="{ span: 12 }" class="line-special">
          <!--          v-model="AllData.userRestrict"-->
          <a-checkbox-group
            :options="plainOptions"
            v-decorator="['userRestrict', { rules: [{ required: true, message: '请选择使用人限制' }] }]"
          />
        </a-form-item>
        <a-form-item label="赠送设置" :label-col="labelCol" :wrapper-col="{ span: 12 }" class="line-special">
          <!--          v-model="AllData.isGive"-->
          <a-radio-group v-decorator="['isGive', { rules: [{ required: true, message: '请选择赠送设置' }] }]">
            <a-radio :style="radioStyle" :value="0">不支持</a-radio>
            <a-radio :style="radioStyle" :value="1">支持</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="过期提醒" :label-col="labelCol" :wrapper-col="{ span: 12 }" class="line-special">
          <!--          v-model="AllData.isWarn"-->
          <a-radio-group
            v-decorator="['isWarn', { rules: [{ required: true, message: '请选择过期提醒' }] }]"
            @change="expiredReminder"
          >
            <a-radio :style="radioStyle" :value="0">
              不提醒
            </a-radio>
            <a-radio :style="radioStyle" :value="1">
              过期前
              <a-input style="width: 75px;margin: 0 10px;" v-model="AllData.warnDays" :disabled="AllData.isWarn == 0" />
              天
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="券类型" :label-col="labelCol" :wrapper-col="{ span: 12 }" class="line-special">
          <!--          v-model="AllData.isNomal"-->
          <a-radio-group
            v-decorator="['isNomal', { rules: [{ required: true, message: '请选择券类型' }] }]"
            @change="couponClassification"
          >
            <a-radio :style="radioStyle" :value="0">
              普通券
            </a-radio>
            <a-radio :style="radioStyle" :value="1">
              活动券
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="领取人限制"
          :label-col="labelCol"
          :wrapper-col="{ span: 12 }"
          v-show="AllData.isNomal == 0"
          class="line-special"
        >
          <!--          v-model="AllData.getRestrict"-->
          <a-checkbox-group
            :options="plainOptions1"
            v-decorator="[
              'getRestrict',
              { rules: [{ required: AllData.isNomal == 0 ? true : false, message: '请选择领取人限制' }] }
            ]"
          />
        </a-form-item>
        <a-form-item
          label="再次领取"
          :label-col="labelCol"
          :wrapper-col="{ span: 12 }"
          class="line-special"
          v-show="AllData.isNomal == 0"
        >
          <!--          v-model="AllData.isGetThe"-->
          <a-radio-group
            v-decorator="[
              'isGetThe',
              { rules: [{ required: AllData.isNomal == 0 ? true : false, message: '请设置再次领取' }] }
            ]"
            @change="noCouponGet"
          >
            <a-radio :style="radioStyle" :value="0">
              不支持
            </a-radio>
            <a-radio :style="radioStyle" :value="1">
              支持
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="再次领取条件"
          :label-col="labelCol"
          :wrapper-col="{ span: 14 }"
          class="line-special"
          v-if="AllData.isGetThe == 1 && AllData.isNomal == 0"
        >
          <!--          v-model="AllData.againGet"-->
          <a-checkbox-group
            :options="receiveAgainplainOptions"
            v-decorator="[
              'againGet',
              {
                rules: [
                  {
                    required: AllData.isGetThe == 1 && AllData.isNomal == 0 ? true : false,
                    message: '请选择再次领取条件'
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <!-- <a-form-item label="投放渠道" :label-col="labelCol" :wrapper-col="{ span: 12 }" v-show="AllData.isNomal == 0">
          <a-checkbox-group
            :options="deliveryChannel"
            @change="deliveryChannelChange"
            v-decorator="[
              'marketingChannelId',
              { rules: [{ required: AllData.isNomal == 0 ? true : false, message: '请选择投放渠道' }] }
            ]"
          />
        </a-form-item> -->
        <a-form-item label="券说明" :label-col="labelCol" :wrapper-col="{ span: 12 }" class="line-special-second">
          <JEditor v-model="AllData.discountExplain"> </JEditor>
          <!-- <a-textarea placeholder="券说明能让用户更加了解券" :rows="4" v-model="AllData.discountExplain"/> -->
        </a-form-item>
      </a-form>
    </div>
    <div class="button-end"></div>
    <div class="button-operation">
      <a-button @click="cancel">
        取消
      </a-button>
      <a-button type="primary" @click="sure">
        确认
      </a-button>
    </div>

    <select-goods-to-add-pop-up
      ref="selectGoodsToAddPopUp"
      :selectGoodsPopUpLists="isSelectData"
      @handleCancel="PopUp"
      @handleOk="selectGoodsHandleOk"
      :selectGoodsPopUpIds="selectGoodsPopUpIds"
    >
    </select-goods-to-add-pop-up>
  </a-card>
</template>
<script>
const columnsWidth = 200
import { httpAction, postAction, getAction, putAction } from '@/api/manage'
import selectGoodsToAddPopUp from '@/components/popUp/selectGoodsToAddPopUp.vue'
import moment from 'moment'
import pick from 'lodash.pick'
import dayjs from 'dayjs'
import Vue from 'vue'
import JEditor from '@/components/jeecg/JEditor'

export default {
  data() {
    return {
      form: this.$form.createForm(this),
      labelCol: { span: 2 },
      radioStyle: {
        height: '30px',
        lineHeight: '15px'
      },
      headers: '',
      //主图 配置
      mainPictureFileList: [],
      mainPicturePreviewVisible: false,
      mainPicturePreviewImage: '',
      mainPicturePic: true,
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
      //弹窗表单width宽度
      columnsWidth,
      //搜索名
      // searchName: '',

      //查询table分页配置
      selectPagination: {
        current: 1,
        pageSize: 10,
        total: 1
      },
      //商品返现表头
      isSelectColumns: [
        {
          title: '商品图片',
          dataIndex: 'mainPicture',
          scopedSlots: { customRender: 'mainPicture' }
        },
        {
          title: '商品名称',
          className: 'column-money',
          dataIndex: 'goodName'
        },
        {
          title: '商品分类',
          dataIndex: 'typeName'
        },
        {
          title: '市场价',
          dataIndex: 'marketPrice'
        },

        {
          title: '销售价',
          dataIndex: 'price'
        },
        {
          title: '成本价',
          dataIndex: 'costPrice'
        },
        {
          title: '会员价',
          dataIndex: 'vipPrice'
        },
        {
          title: '库存',
          dataIndex: 'repertory'
        },
        {
          title: '供应商',
          dataIndex: 'name'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          // className: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      //已经选择的选择商品数据
      isSelectData: [],
      //弹窗表加载
      tableLoading: false,
      //配置
      configure: {
        imgErver: window._CONFIG['domianURL'] + '/sys/common/view'
      },
      //总共页码
      totalPage: 5,
      //一页显示多少条,
      pageSize: 5,
      //请求页码
      pageNo: 1,

      //选择商品表格（全部数据）
      // noChangeSelectStoreData: [],
      //选择商品保存的id
      selectedRowKeys: [],
      plainOptions: ['普通会员', 'VIP会员'],
      plainOptions1: ['普通会员', 'VIP会员'],
      receiveAgainplainOptions: ['已送出', '已使用', '已过期'],
      //投放渠道列表数据
      deliveryChannel: [],
      //渠道列表数据(不变)
      qudaoNoneChange: [],
      //投放渠道选择值
      ShowPopUp: false,
      //判断是点击添加进入页面还是编辑   编辑 2 添加 1
      part: '1',
      //接口
      url: {
        //确定添加
        add: '/marketingDiscount/marketingDiscount/add',
        edit: '/marketingDiscount/marketingDiscount/edit',
        //适用商品返显
        findByMarketingDiscount: '/marketingDiscount/marketingDiscount/findByMarketingDiscount',
        //返显
        findMarketingDiscountDTO: '/marketingDiscount/marketingDiscount/findChannelByDiscountId',
        //投放渠道列表
        queryChannelList: '/marketingChannel/marketingChannel/queryList',
        //使用商品选择商品弹窗数据
        queryGoodStoreList: '/goodList/goodList/findGoodList'
        //          fileUpload: window._CONFIG['domianURL'] + "/sys/common/upload",
      },
      uploadAction: window._CONFIG['domianURL'] + '/sys/common/upload',
      //开始结束时间
      selectDateToTime: '',
      //日期选择器返现参数
      dateFormat: 'YYYY-MM-DD',
      //默认领券方式id
      marketingChannelIdDefault: [''],
      listGoodType1: [],
      listGoodType2: [],
      queryParam: {
        goodTypeIdOne: '',
        goodTypeIdTwo: '',
        goodTypeIdThree: ''
      },
      //参数
      AllData: {
        isNomal: 0, //券类型
        delFlag: '0', //删除状态
        name: '', //优惠券名称
        completely: '0', //满多少钱
        isThreshold: 0, //有无门槛
        subtract: '0', //减多少钱  优惠内容
        total: '', //发放总量
        userRestrict: ['普通会员', 'VIP会员'], //使用人限制
        getRestrict: ['普通会员', 'VIP会员'], //领取人限制
        isDistribution: '1', //适用商品分销
        isGive: 1, //赠送设置
        isWarn: 1, //是否过期提醒
        vouchersWay: 1, //用券方式
        warnDays: '3', //过期前多少天提醒
        isGetThe: 1, //再次领取
        isUniqueness: false, //使用方式
        //用券时间
        startTime: '', //开始时间
        endTime: '', //结束时间
        today: '0', //当日起
        tomorow: '0', //次日起
        monad: '天', //单位
        goodStoreListIds: '', //商品ids
        marketingChannelId: '', //投放渠道选择值
        // channelIds:"",
        discountExplain: '', //券说明
        status: '1', //优惠券状态
        againGet: [], //再次领取条件
        isPlatform: '1', //0,店铺 ; 1,平台
        shopTotal: '', //商品总量
        releasedQuantity: '0', //已发放数量
        mainPicture: '',
        coverPlan: '',
        mainPictures: '',
        coverPlans: '',
        posters: '' //海报图
      },
      goodStoreListIds: ''
    }
  },
  components: {
    selectGoodsToAddPopUp,
    JEditor
  },
  methods: {
    moment,
    mainPictureUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isLt2M) {
        this.$message.error('图片大小必须在5M以内!')
      }
      this.mainPicturePic = isLt2M
      return isLt2M
    },
    diagramFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isLt2M) {
        this.$message.error('图片大小必须在5M以内!')
      }
      this.diagramFilePic = isLt2M
      return isLt2M
    },
    postersFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isLt2M) {
        this.$message.error('图片大小必须在5M以内!')
      }
      this.postersFilePic = isLt2M
      return isLt2M
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    //使用方式
    isUniquenessHandleChange(e) {
      this.AllData.isUniqueness = e.target.checked
    },
    //过期提醒
    expiredReminder(e) {
      this.AllData.isWarn = e.target.value
    },
    //用券时间单选框
    useCouponTime(e) {
      this.AllData.vouchersWay = e.target.value
    },
    //券类型单选框
    couponClassification(e) {
      this.AllData.isNomal = e.target.value
    },
    //使用门槛单选框
    useThreshold(e) {
      this.AllData.isThreshold = e.target.value
    },
    //再次领取单选
    noCouponGet(e) {
      this.AllData.isGetThe = e.target.value
    },
    PopUp() {
      this.ShowPopUp = !this.ShowPopUp
      this.$nextTick(() => {
        if (this.ShowPopUp) {
          this.$refs.selectGoodsToAddPopUp.open()
        }
      })
    },
    // handleSelectTableChange(pagination){
    //   console.log(pagination);
    //   this.selectPagination.current = pagination.current;
    //   this.search(this.searchName)
    // },
    //确定选择商品
    // selectStoreSure() {
    //   this.selectedRowKeys = Array.from(new Set(this.selectedRowKeys))
    //   this.$nextTick(()=>{
    //     let ids = this.selectedRowKeys,
    //     sz = [];
    //     this.AllData.goodStoreListIds = ids.join(',')
    //     for (let item of ids) {
    //       for (let item2 of this.noChangeSelectStoreData) {
    //         if (item == item2.id) {
    //           item2.key = item2.id
    //           item2.operation = '删除'
    //           sz.push(item2)
    //           break;
    //         }
    //       }
    //     }
    //     this.isSelectData = sz
    //     this.PopUp()
    //   })
    // },
    selectGoodsHandleOk(ids, sz) {
      this.AllData.goodStoreListIds = ids
      this.goodStoreListIds = ids
      this.isSelectData = sz
      this.PopUp()
    },
    //查询
    // search(goodName = '',pagination = this.selectPagination) {
    //   let that = this
    //   this.tableLoading = true
    //   //请求选择商品弹窗接口
    //   let requestOptions = Object.assign({},{goodName},pagination,{pageNo:pagination.current})
    //   getAction(that.url.queryGoodStoreList, requestOptions).then((res) => {
    //     this.tableLoading = false
    //     if (res.success) {
    //       res.result.records.map(item => {
    //         item.key = item.id
    //         try{
    //           if(item.mainPicture){
    //             item.mainPicture = this.configure.imgErver + '/' + Object.values(JSON.parse(item.mainPicture))[0]
    //           }
    //         }catch(e){
    //
    //         }
    //         return item
    //       })
    //       if(this.noChangeSelectStoreData.length>0){
    //         for(let item of res.result.records){
    //           let canPush = true
    //           for(let item2 of this.noChangeSelectStoreData){
    //             if(item2.id === item.id){
    //               canPush = false
    //               break;
    //             }
    //           }
    //           if(canPush){
    //             this.noChangeSelectStoreData.push(item)
    //           }
    //         }
    //       }else{
    //         this.noChangeSelectStoreData = res.result.records
    //       }
    //       this.selectStoreData = res.result.records
    //       this.selectPagination.total = res.result.total
    //       this.selectPagination.pageSize = res.result.size
    //     }
    //   })
    // },
    //上传主图
    mainPictureHandleCancel() {
      this.mainPicturePreviewVisible = false
    },
    mainPictureHandlePreview(file) {
      this.mainPicturePreviewImage = file.url || file.thumbUrl
      this.mainPicturePreviewVisible = true
    },
    mainPictureHandleChange({ fileList }) {
      this.mainPictureFileList = fileList
    },
    //分享图
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
    //确定添加优惠券
    sure() {
      this.form.validateFields((err, values) => {
        // if (this.isSelectData.length <= 0) {
        //   this.$message.warn('请选择适用商品！')
        //   return
        // }
        if (!err) {
          this.AllData = Object.assign({}, this.AllData, values)
          this.$nextTick(() => {
            let that = this
            let url = this.url.add
            if (this.part == 2) {
              url = this.url.edit
            }
            let mainPictureFileList = {}
            let coverPlan = {}
            let postersCK = {}
            for (let count = 0; count < this.mainPictureFileList.length; count++) {
              mainPictureFileList[count] = this.mainPictureFileList[count].response.message
            }
            for (let count = 0; count < this.diagramFileList.length; count++) {
              coverPlan[count] = this.diagramFileList[count].response.message
            }
            for (let count = 0; count < this.postersFileList.length; count++) {
              postersCK[count] = this.postersFileList[count].response.message
            }
            this.AllData.mainPictures = this.mainPictureFileList.length > 0 ? JSON.stringify(mainPictureFileList) : ''

            this.AllData.coverPlans = this.diagramFileList.length > 0 ? JSON.stringify(coverPlan) : ''
            this.AllData.posters = this.postersFileList.length > 0 ? JSON.stringify(postersCK) : ''

            if (this.AllData.mainPictures == '') {
              this.$message.warn('请上传主图！')
              return
            }
            if (this.AllData.coverPlans == '') {
              this.$message.warn('请上传分享图！')
              return
            }
            if (this.AllData.posters == '') {
              this.$message.warn('请上传海报图！')
              return
            }

            this.AllData.isUniqueness = this.AllData.isUniqueness ? 1 : 0 //使用方式
            if (this.selectDateToTime) {
              let startTime = new Date(this.selectDateToTime[0]._d),
                endTime = new Date(this.selectDateToTime[1]._d)
              this.AllData.startTime = dayjs(startTime).format('YYYY-MM-DD HH:mm:ss')
              this.AllData.endTime = dayjs(endTime).format('YYYY-MM-DD HH:mm:ss')
            }
            this.AllData.shopTotal = this.isSelectData.length || 0
            if (this.AllData.userRestrict) {
              let sz = []
              let sz2 = []
              for (let item of this.AllData.userRestrict) {
                if (item == '普通会员') {
                  sz.push('0')
                }
                if (item == 'VIP会员') {
                  sz.push('1')
                }
              }
              this.AllData.userRestrict = sz.join(',')
              if (this.isSelectData.length > 0) {
                for (let item of this.isSelectData) {
                  sz2.push(item.id)
                }
                this.AllData.goodStoreListIds = sz2.join(',')
              } else {
                this.AllData.goodStoreListIds = ''
              }
            }
            if (this.AllData.getRestrict) {
              let sz = []
              for (let item of this.AllData.getRestrict) {
                if (item == '普通会员') {
                  sz.push('0')
                }
                if (item == 'VIP会员') {
                  sz.push('1')
                }
              }
              this.AllData.getRestrict = sz.join(',')
            }
            if (this.AllData.againGet) {
              let sz = []
              for (let item of this.AllData.againGet) {
                if (item == '已送出') {
                  sz.push('0')
                }
                if (item == '已使用') {
                  sz.push('1')
                }
                if (item == '已过期') {
                  sz.push('2')
                }
              }
              this.AllData.againGet = sz.join(',')
            }
            let sz2 = []
            for (let item of this.AllData.marketingChannelId) {
              for (let item2 of this.qudaoNoneChange) {
                if (item2.name == item) {
                  sz2.push(item2.id)
                }
              }
            }
            delete this.AllData['againGet_dictText']
            this.AllData.marketingChannelId = sz2.join(',')
            postAction(url, this.AllData)
              .then(res => {
                if (res.success) {
                  that.$message.success('成功！')
                  that.$router.push('/marketing/MarketingDiscountListTerrace')
                } else {
                  that.$message.warn('失败')
                }
              })
              .catch(err => {
                that.$message.warn('失败')
              })
          })
        }
      })
    },
    cancel() {
      this.$router.push('/marketing/MarketingDiscountListTerrace')
    },
    onDelete(id) {
      const dataSource = [...this.isSelectData]
      const selectedRowKeys = [...this.selectedRowKeys]
      this.selectedRowKeys = selectedRowKeys.filter(item => item !== id)
      this.isSelectData = dataSource.filter(item => item.id !== id)
    },

    //投放渠道选择
    deliveryChannelChange(checkedValues) {
      if (checkedValues.indexOf(this.marketingChannelIdDefault[0]) == -1) {
        this.AllData.marketingChannelId = [...this.marketingChannelIdDefault, ...this.AllData.marketingChannelId]
      }
    },
    //选择商品分页加载
    loadingPage() {}
  },
  created() {
    const token = Vue.ls.get('Access-Token')
    this.headers = { 'X-Access-Token': token }
    //页面加载判断是否是点击编辑进入页面  编辑返回2
    let part = this.$route.query.part ? this.$route.query.part : '1'
    let marketingDiscountListTerraceData = localStorage.getItem('marketingDiscountListTerraceData')
    let allData
    this.part = part
    let that = this
    if (part == 2 && marketingDiscountListTerraceData) {
      //编辑
      marketingDiscountListTerraceData = JSON.parse(marketingDiscountListTerraceData)
      allData = {
        // id: marketingDiscountListTerraceData.id,
        // delFlag: marketingDiscountListTerraceData.delFlag,//删除状态
        // name: marketingDiscountListTerraceData.name,//优惠券名称marketingDiscountData.delFlag
        // completely: marketingDiscountListTerraceData.completely,//满多少钱
        isThreshold: marketingDiscountListTerraceData.isThreshold * 1, //有无门槛
        // subtract: marketingDiscountListTerraceData.subtract,//减多少钱  优惠内容
        // total: marketingDiscountListTerraceData.total,//发放总量
        userRestrict: marketingDiscountListTerraceData.userRestrict.split(','), //使用人限制
        getRestrict: marketingDiscountListTerraceData.getRestrict.split(','), //领取人限制
        isGive: marketingDiscountListTerraceData.isGive * 1, //赠送设置
        isWarn: marketingDiscountListTerraceData.isWarn * 1, //是否过期提醒
        vouchersWay: marketingDiscountListTerraceData.vouchersWay * 1, //用券方式
        // warnDays: marketingDiscountListTerraceData.warnDays,//过期前多少天提醒
        isGetThe: marketingDiscountListTerraceData.isGetThe * 1, //再次领取
        isNomal: marketingDiscountListTerraceData.isNomal * 1, //券类型
        isUniqueness: marketingDiscountListTerraceData.isUniqueness * 1 == 1 ? true : false, //使用方式
        //用券时间
        // startTime: marketingDiscountListTerraceData.startTime,//开始时间
        // endTime: marketingDiscountListTerraceData.endTime,//结束时间
        // disData: marketingDiscountListTerraceData.disData,//多少天、周、月  数字形式
        // monad: marketingDiscountListTerraceData.monad,//单位
        // goodStoreListIds: marketingDiscountListTerraceData.goodStoreListIds,//商品ids
        // marketingChannelId:marketingDiscountListTerraceData.marketingChannelId?marketingDiscountListTerraceData.marketingChannelId.split(','):'', //投放渠道选择值
        // discountExplain: marketingDiscountListTerraceData.discountExplain,//券说明
        againGet: marketingDiscountListTerraceData.againGet.split(',') //再次领取条件
      }

      allData = Object.assign({}, marketingDiscountListTerraceData, allData)
      this.selectDateToTime =
        marketingDiscountListTerraceData.startTime && marketingDiscountListTerraceData.endTime
          ? [
              moment(marketingDiscountListTerraceData.startTime, this.dateFormat),
              moment(marketingDiscountListTerraceData.endTime, this.dateFormat)
            ]
          : ''
      for (let a = 0; a < allData.userRestrict.length; a++) {
        allData.userRestrict[a] = this.plainOptions[allData.userRestrict[a]]
      }
      for (let a = 0; a < allData.getRestrict.length; a++) {
        allData.getRestrict[a] = this.plainOptions1[allData.getRestrict[a]]
      }
      if (allData.mainPictures && allData.coverPlans && allData.posters) {
        let mainPictures = Object.values(JSON.parse(allData.mainPictures))
        let coverPlans = Object.values(JSON.parse(allData.coverPlans))
        let posters = Object.values(JSON.parse(allData.posters))
        let mainPicturesSz = []
        let coverPlansSz = []
        let postersSz = []
        //主图返显
        for (let a = 0; a < mainPictures.length; a++) {
          let obj = {
            uid: a,
            url: this.configure.imgErver + '/' + mainPictures[a],
            response: {
              message: mainPictures[a]
            }
          }
          mainPicturesSz.push(obj)
        }
        //分享图返显
        for (let a = 0; a < coverPlans.length; a++) {
          let obj = {
            uid: a,
            url: this.configure.imgErver + '/' + coverPlans[a],
            response: {
              message: coverPlans[a]
            }
          }
          coverPlansSz.push(obj)
        }
        //海报图返显
        for (let a = 0; a < posters.length; a++) {
          let obj = {
            uid: a,
            url: this.configure.imgErver + '/' + posters[a],
            response: {
              message: posters[a]
            }
          }
          postersSz.push(obj)
        }
        if (allData.mainPictures && allData.coverPlans && allData.posters) {
          this.mainPictureFileList = mainPicturesSz
          this.diagramFileList = coverPlansSz
          this.postersFileList = postersSz
        }
      } else {
        console.warn('没有mainPictures coverPlans字段')
      }

      // for (let a = 0; a < allData.marketingChannelId.length; a++) {
      //   allData.marketingChannelId[a] = this.deliveryChannel[allData.marketingChannelId[a]]
      // }

      for (let a = 0; a < allData.againGet.length; a++) {
        allData.againGet[a] = this.receiveAgainplainOptions[allData.againGet[a]]
      }

      //使用商品列表请求接口返显
      //参数  marketingDiscountId
      let info = {
        pageNo: this.pageNo,
        marketingDiscountId: allData.id
      }
      getAction(that.url.findByMarketingDiscount, info).then(res => {
        if (res.success) {
          this.isSelectData = res.result.records
          // this.noChangeSelectStoreData = [...this.noChangeSelectStoreData,...res.result.records]
          let sz = []
          for (let item of res.result.records) {
            if (item.mainPicture) {
              item.mainPicture = this.configure.imgErver + '/' + Object.values(JSON.parse(item.mainPicture))[0]
            }
            sz.push(item.id)
          }
          this.AllData.goodStoreListIds = sz.join(',')
          this.goodStoreListIds = sz.join(',')
          this.selectedRowKeys = sz
        }
      })
    }
    //请求投放渠道列表接口
    getAction(that.url.queryChannelList).then(res => {
      if (res) {
        let sz = []
        let sz2 = []
        for (let item of res) {
          sz.push(item.name)
          sz2.push({
            id: item.id,
            name: item.name
          })
        }
        this.deliveryChannel = sz
        this.qudaoNoneChange = sz2
        this.marketingChannelIdDefault = [res[0].name]
        this.$nextTick(() => {
          if (this.part != 1) {
            getAction(that.url.findMarketingDiscountDTO, { id: allData.id }).then(res2 => {
              let sz = []
              if (res2.length > 0) {
                for (let item of this.qudaoNoneChange) {
                  for (let item2 of res2) {
                    if (item.id == item2.marketingChannelId) {
                      sz.push(item.name)
                    }
                  }
                }
                allData.marketingChannelId = sz
                this.AllData = allData
                this.$nextTick(() => {
                  this.form.setFieldsValue(allData)
                })
              }
            })
          } else {
            this.AllData.marketingChannelId = [res[0].name]
            console.log(this.AllData)
            this.$nextTick(() => {
              this.form.setFieldsValue(this.AllData)
            })
          }
        })
      }
    })
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this
      return {
        selectedRowKeys,
        onChange: this.onSelectChange,
        hideDefaultSelections: true,
        selections: [
          {
            key: 'all-data',
            text: 'Select All Data',
            onSelect: () => {
              this.selectedRowKeys = [...Array(46).keys()] // 0...45
            }
          }
        ],
        onSelection: this.onSelection
      }
    },
    selectGoodsPopUpIds() {
      return this.goodStoreListIds ? this.goodStoreListIds.split(',') || [] : []
    }
    //      uploadAction: function () {
    //        return this.url.fileUpload;
    //      },
  }
}
</script>
<style lang="less">
.AddMarketingDiscountStoreModel {
  width: 100%;

  .el-dialog {
    -webkit-backface-visibility: hidden;
  }

  .title {
    font-size: 16px;
    font-weight: 700;
    padding-bottom: 25px;
    /*border-bottom: 1px solid gray;*/
    /*margin-top: 30px;*/
  }

  .wrap {
    margin-top: 30px;

    .Discount {
      input {
        width: 75px;
        margin: 0 15px;
      }
    }

    .attention {
      margin-top: 10px;
      /*width: 1080px;*/
      font-size: 13px;
      line-height: 34px;
      padding: 0 20px;
      color: black;
      background: rgb(204, 235, 255);
      border: 1px solid rgb(0, 153, 255);
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
    }
  }

  .operation {
    color: rgb(24, 144, 255);
    cursor: pointer;
  }

  .line-special .ant-checkbox-group,
  .line-special .ant-radio-group {
    width: 300px;
    height: 39px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .ant-radio-wrapper {
      display: flex;
      align-items: center;
    }
  }

  .line-special-second {
    .ant-checkbox-group {
      display: flex;
      justify-content: space-around;
      flex-direction: column;
      height: 100px;
    }
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
    margin-bottom: 40px;
    border-bottom: 1px solid gray;
  }

  .popUp {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 999;
    background: rgba(0, 0, 0, 0.3);

    .pop-wrap {
      margin: 0 auto;
      margin-top: 5vh;
      width: 50%;
      background: white;
      font-size: 12px;

      .title {
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: space-between;
        padding: 0 5px 0 20px;
        align-items: center;
        border-bottom: 1px solid gray;

        span:nth-child(2) {
          padding: 15px;
          cursor: pointer;
        }
      }
    }

    .cnt {
      padding: 20px;
      width: 100%;

      input {
        width: 120px;
      }

      .title2 {
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
</style>
