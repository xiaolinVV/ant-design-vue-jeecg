<!--优惠券新增编辑页面-->
<!---->
<template>
  <div class="AddMarketingDiscountStoreModel" ref="AddMarketingDiscountStoreModel">
    <div class="title">{{ part == 2 ? '编辑' : '添加' }}券</div>

    <a-form :form="form" class="wrap">
      <!--        v-model="AllData.name"-->
      <a-form-item :label-col="labelCol" :wrapper-col="{ span: 12 }" label="优惠券名称">
        <a-input
          placeholder="请输入优惠券名称,字数不超过50个字"
          v-decorator="[
            'name',
            { rules: [{ required: true, message: '请输入优惠券名称' }, { max: 50, message: '字数不能超过50个字' }] }
          ]"
        />
      </a-form-item>

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="{ span: 12 }"
        help="尺寸800*800 支持jpg、jpeg、png格式，大小不超过2M"
        label="主图"
        validate-status="error"
      >
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
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :footer="null" :visible="mainPicturePreviewVisible" @cancel="mainPictureHandleCancel">
          <img :src="mainPicturePreviewImage" alt="example" style="width: 100%" />
        </a-modal>
      </a-form-item>

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="{ span: 12 }"
        help="尺寸800*640 ，支持jpg、jpeg、png格式，大小不超过2M"
        label="分享图"
        validate-status="error"
      >
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
        :wrapper-col="{ span: 12 }"
        help="尺寸1428*2540，支持jpg、jpeg、png格式，大小不超过2M。必须预留好二维码位置。以免影响展示效果。"
        label="海报图"
        validate-status="error"
      >
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

      <a-form-item :label-col="labelCol" :wrapper-col="{ span: 12 }" label="使用门槛">
        <!--        v-model="AllData.isThreshold"-->
        <a-radio-group
          @change="useThreshold"
          v-decorator="['isThreshold', { rules: [{ required: true, message: '请选择使用门槛' }] }]"
        >
          <a-radio :style="radioStyle" :value="0">无门槛</a-radio>
          <a-radio :style="radioStyle" :value="1">
            订单满
            <a-input :disabled="AllData.isThreshold == 0" v-model="AllData.completely" />
            元
          </a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="{ span: 12 }" class="Discount" label="优惠内容">
        减
        <!--        v-model="AllData.subtract"-->
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
      <a-form-item :label-col="labelCol" :wrapper-col="{ span: 18 }" label="用券时间">
        <!--        v-model="AllData.vouchersWay"-->
        <a-radio-group
          @change="useCouponTime"
          style="display: flex;align-items: center;flex-wrap: wrap;"
          v-decorator="['vouchersWay', { rules: [{ required: true, message: '请选择用券时间' }] }]"
        >
          <div>
            <a-radio :value="0">
              <a-range-picker :disabled="AllData.vouchersWay != 0" v-model="selectDateToTime" />
            </a-radio>
          </div>
          <div>
            <a-radio :value="1">
              领券当日起
              <a-input :disabled="AllData.vouchersWay != 1" style="width: 75px;" v-model="AllData.today" />
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
              <a-input :disabled="AllData.vouchersWay != 2" style="width: 75px;" v-model="AllData.tomorow" />
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

      <a-form-item :label-col="labelCol" :wrapper-col="{ span: 18 }" label="适用商品">
        <!--        <span slot="label">-->
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
          class="attention"
          message="重要提示：设定商品优惠券时请先核算好商品的利润，避免优惠后可能造成的利润亏损。"
        />
        <a-table
          :columns="isSelectColumns"
          :dataSource="isSelectData"
          :pagination="{ pageSize: 5 }"
          bordered
          style="margin-top: 20px;"
        >
          <template slot="mainPicture" slot-scope="text">
            <img :src="text" alt=" " style="width: 40px;height: 40px;" />
          </template>
          <template slot="operation" slot-scope="text, record">
            <a-popconfirm @confirm="() => onDelete(record.id)" title="确定要删除吗?" v-if="isSelectData.length">
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
        <a-radio-group v-decorator="['isDistribution', { rules: [{ required: true, message: '请选择适用商品分销' }] }]">
          <a-radio :style="radioStyle" value="1">参与分销</a-radio>
          <a-radio :style="radioStyle" value="0">不参与分销</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="{ span: 12 }" label="发放总量">
        <!--        v-model="AllData.total"-->
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
        <!--        ,{validator: totalDetermine,}-->
        <!--          编辑时仅能编辑剩余发行量，请谨慎设置-->
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="{ span: 12 }" class="line-special" label="使用人限制">
        <!--        v-model="AllData.userRestrict"-->
        <a-checkbox-group
          :options="plainOptions"
          v-decorator="['userRestrict', { rules: [{ required: true, message: '请选择使用人限制' }] }]"
        />
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="{ span: 12 }" class="line-special" label="赠送设置">
        <!--        v-model="AllData.isGive"-->
        <a-radio-group v-decorator="['isGive', { rules: [{ required: true, message: '请选择赠送设置' }] }]">
          <a-radio :style="radioStyle" :value="0">不支持</a-radio>
          <a-radio :style="radioStyle" :value="1">支持</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="{ span: 12 }" class="line-special" label="过期提醒">
        <!--        v-model="AllData.isWarn"-->
        <a-radio-group
          @change="expiredReminder"
          v-decorator="['isWarn', { rules: [{ required: true, message: '请选择过期提醒' }] }]"
        >
          <a-radio :style="radioStyle" :value="0">
            不提醒
          </a-radio>
          <a-radio :style="radioStyle" :value="1">
            过期前
            <a-input :disabled="AllData.isWarn == 0" style="width: 75px;margin: 0 10px;" v-model="AllData.warnDays" />
            天
          </a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="{ span: 12 }" class="line-special" label="券类型">
        <!--        v-model="AllData.isNomal"-->
        <a-radio-group
          @change="couponClassification"
          v-decorator="['isNomal', { rules: [{ required: true, message: '请选择券类型' }] }]"
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
        :label-col="labelCol"
        :wrapper-col="{ span: 12 }"
        class="line-special"
        label="领取人限制"
        v-show="AllData.isNomal == 0"
      >
        <!--        v-model="AllData.getRestrict"-->
        <a-checkbox-group
          :options="plainOptions1"
          v-decorator="[
            'getRestrict',
            { rules: [{ required: AllData.isNomal == 0 ? true : false, message: '请选择领取人限制' }] }
          ]"
        />
      </a-form-item>

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="{ span: 12 }"
        class="line-special"
        label="再次领取"
        v-show="AllData.isNomal == 0"
      >
        <!--        v-model="AllData.isGetThe"-->
        <a-radio-group
          @change="noCouponGet"
          v-decorator="[
            'isGetThe',
            { rules: [{ required: AllData.isNomal == 0 ? true : false, message: '请设置再次领取' }] }
          ]"
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
        :label-col="labelCol"
        :wrapper-col="{ span: 14 }"
        class="line-special"
        label="再次领取条件"
        v-if="AllData.isGetThe == 1 && AllData.isNomal == 0"
      >
        <!--        v-model="AllData.againGet"-->
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

      <!-- <a-form-item :label-col="labelCol" :wrapper-col="{ span: 12 }" label="投放渠道" v-show="AllData.isNomal == 0">
        <a-checkbox-group
          :options="deliveryChannel"
          @change="deliveryChannelChange"
          v-decorator="[
            'marketingChannelId',
            { rules: [{ required: AllData.isNomal == 0 ? true : false, message: '请选择投放渠道' }] }
          ]"
        />
      </a-form-item> -->
      <a-form-item :label-col="labelCol" :wrapper-col="{ span: 12 }" class="line-special-second" label="券说明">
        <JEditor v-model="AllData.discountExplain"> </JEditor>
        <!-- <a-textarea :rows="4" placeholder="券说明能让用户更加了解券" v-model="AllData.discountExplain"/> -->
      </a-form-item>
    </a-form>
    <div class="button-end"></div>
    <div class="button-operation">
      <a-button>
        取消
      </a-button>
      <a-button @click="sure" type="primary">
        确认
      </a-button>
    </div>

    <select-goods-to-add-pop-up
      ref="selectGoodsToAddPopUp"
      :selectGoodsPopUpLists="isSelectData"
      apiName="queryGoodStoreStoreList"
      @handleCancel="PopUp"
      @handleOk="selectGoodsHandleOk"
      :selectGoodsPopUpIds="selectGoodsPopUpIds"
    >
    </select-goods-to-add-pop-up>
  </div>
</template>
<script>
import { getAction, postAction } from '@/api/manage'
import moment from 'moment'
import dayjs from 'dayjs'
import Vue from 'vue'
import selectGoodsToAddPopUp from '@/components/popUp/selectGoodsToAddPopUp.vue'
import JEditor from '@/components/jeecg/JEditor'
const selectStoreColumns = [
  {
    title: '商品图片',
    dataIndex: 'mainPicture',
    scopedSlots: { customRender: 'mainPicture' },
    width: 150
  },
  {
    title: '商品名称',
    className: 'column-money',
    dataIndex: 'goodName',
    width: 150
  },
  {
    title: '商品分类',
    dataIndex: 'typeName',
    width: 150
  },
  {
    title: '市场价',
    dataIndex: 'marketPrice',
    width: 150
  },

  {
    title: '销售价',
    dataIndex: 'price',
    width: 150
  },
  {
    title: '成本价',
    dataIndex: 'costPrice',
    width: 150
  },
  {
    title: '会员价',
    dataIndex: 'vipPrice',
    width: 150
  },
  {
    title: '库存',
    dataIndex: 'repertory',
    width: 150
  }
]

export default {
  name: 'AddMarketingDiscountStoreModel',
  data() {
    return {
      form: this.$form.createForm(this),
      radioStyle: {
        height: '30px',
        lineHeight: '15px'
      },
      headers: '',
      labelCol: { span: 2 },
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
      uploadAction: window._CONFIG['domianURL'] + '/sys/common/upload',
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
          title: '操作',
          dataIndex: 'operation',
          // className: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      //已经选择的选择商品数据
      isSelectData: [],
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
      //选择商品表格
      selectStoreData: '',
      //所有数据
      selectAllStoreData: '',
      //表单加载
      tableLoading: false,
      //选择商品弹窗表头
      selectStoreColumns,
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
      //默认领券方式id
      marketingChannelIdDefault: [''],
      //接口
      url: {
        //确定添加
        add: '/marketingDiscount/marketingDiscount/add',
        edit: '/marketingDiscount/marketingDiscount/edit',
        //适用商品返显
        findByMarketingDiscount: '/marketingDiscount/marketingDiscount/findByMarketingDiscountStore',
        //返显
        findChannelByDiscountId: '/marketingDiscount/marketingDiscount/findChannelByDiscountId',
        //投放渠道列表
        queryChannelList: '/marketingChannel/marketingChannel/queryList',
        //使用商品选择商品弹窗数据
        queryGoodStoreList: '/goodStoreList/goodStoreList/findStoreList'
      },
      //开始结束时间未处理
      selectDateToTime: '',
      //日期选择器返现参数
      dateFormat: 'YYYY-MM-DD',
      //参数
      AllData: {
        isNomal: 0, //券类型
        delFlag: '0', //删除状态
        name: '', //优惠券名称
        completely: '0', //满多少钱
        isThreshold: 0, //有无门槛
        subtract: '0', //减多少钱  优惠内容
        total: '', //发放总量
        isUniqueness: false, //使用方式
        isDistribution: '1', //适用商品分销
        userRestrict: ['普通会员', 'VIP会员'], //使用人限制
        getRestrict: ['普通会员', 'VIP会员'], //领取人限制
        isGive: 1, //赠送设置
        isWarn: 1, //是否过期提醒
        vouchersWay: 0, //用券方式
        warnDays: '3', //过期前多少天提醒
        isGetThe: 1, //再次领取
        //用券时间
        startTime: '', //开始时间
        endTime: '', //结束时间
        today: '0', //当日起
        tomorow: '0', //次日起
        monad: '天', //单位
        goodStoreListIds: '', //商品ids
        marketingChannelId: [], //投放渠道选择值
        channelIds: '',
        discountExplain: '', //券说明
        status: '1', //优惠券状态
        againGet: [], //再次领取条件
        isPlatform: '0', //0,店铺 ; 1,平台
        shopTotal: '', //商品总量
        releasedQuantity: '0', //已发放数量
        mainPicture: '',
        coverPlan: '',
        mainPictures: '',
        coverPlans: ''
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
      console.log('selectedRowKeys changed: ', selectedRowKeys)
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
    //发行总量判定
    totalDetermine(rule, value, callback) {
      if (!this.isSelectData || this.isSelectData.length <= 0) {
        callback()
      } else if (this.isSelectData.length > 0 && value) {
        let number = 0
        for (let item of this.isSelectData) {
          number += item.repertory * 1
        }
        console.log(number)
        if (value > number) {
          callback('发放总量应小于适用商品中所有商品的库存总量')
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    PopUp() {
      this.ShowPopUp = !this.ShowPopUp
      this.$nextTick(() => {
        if (this.ShowPopUp) {
          this.$refs.selectGoodsToAddPopUp.open()
        }
      })
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
      // debugger;
    },

    //确定添加优惠券
    sure() {
      this.form.validateFields((err, values) => {
        // if(this.isSelectData.length<=0){
        //   this.$message.warn('请选择适用商品！')
        //   return;
        // }
        if (!err) {
          this.AllData = Object.assign({}, this.AllData, values)
          this.$nextTick(() => {
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
            this.AllData.marketingChannelId = sz2.join(',')
            this.AllData.channelIds = sz2.join(',')
            console.log(this.AllData)
            debugger
            postAction(url, this.AllData)
              .then(res => {
                if (res.success) {
                  this.$message.success('成功！')
                  this.$router.push('/marketing/MarketingDiscountList')
                } else {
                  this.$message.warn('失败')
                }
              })
              .catch(err => {
                this.$message.warn('失败')
              })
          })
        }
      })
    },
    //确认选择商品弹窗
    selectGoodsHandleOk(ids, sz) {
      this.AllData.goodStoreListIds = ids
      this.goodStoreListIds = ids
      this.isSelectData = sz
      this.PopUp()
    },
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
    //选择商品分页加载
    loadingPage() {}
  },
  created() {
    const token = Vue.ls.get('Access-Token')
    this.headers = { 'X-Access-Token': token }
    //页面加载判断是否是点击编辑进入页面  编辑返回2
    let part = this.$route.query.part ? this.$route.query.part : '1'
    let marketingDiscountData = localStorage.getItem('marketingDiscountData')
    this.part = part
    let that = this
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
          if (part == 2 && marketingDiscountData) {
            //编辑
            marketingDiscountData = JSON.parse(marketingDiscountData)
            let allData = {
              // id: marketingDiscountData.id,
              // delFlag: marketingDiscountData.delFlag,//删除状态
              // name: marketingDiscountData.name,//优惠券名称marketingDiscountData.delFlag
              // completely: marketingDiscountData.completely,//满多少钱
              isThreshold: marketingDiscountData.isThreshold * 1, //有无门槛
              // subtract: marketingDiscountData.subtract,//减多少钱  优惠内容
              // total: marketingDiscountData.total,//发放总量
              userRestrict: marketingDiscountData.userRestrict.split(','), //使用人限制
              getRestrict: marketingDiscountData.getRestrict.split(','), //领取人限制
              isGive: marketingDiscountData.isGive * 1, //赠送设置
              isWarn: marketingDiscountData.isWarn * 1, //是否过期提醒
              vouchersWay: marketingDiscountData.vouchersWay * 1, //用券方式
              // warnDays: marketingDiscountData.warnDays,//过期前多少天提醒
              isGetThe: marketingDiscountData.isGetThe * 1, //再次领取
              isNomal: marketingDiscountData.isNomal * 1, //券类型
              isUniqueness: marketingDiscountData.isUniqueness * 1 == 1 ? true : false, //使用方式
              //用券时间
              // startTime: marketingDiscountData.startTime,//开始时间
              // endTime: marketingDiscountData.endTime,//结束时间
              // disData: marketingDiscountData.disData,//多少天、周、月  数字形式
              // monad: marketingDiscountData.monad,//单位
              // goodStoreListIds: marketingDiscountData.goodStoreListIds,//商品ids
              marketingChannelId: [], //投放渠道选择值 marketingDiscountData.marketingChannelId.split(',')
              // discountExplain: marketingDiscountData.discountExplain,//券说明
              againGet: marketingDiscountData.againGet.split(',') //再次领取条件
            }
            allData = Object.assign({}, marketingDiscountData, allData)
            this.selectDateToTime =
              marketingDiscountData.startTime && marketingDiscountData.endTime
                ? [
                    moment(marketingDiscountData.startTime, this.dateFormat),
                    moment(marketingDiscountData.endTime, this.dateFormat)
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
            for (let a = 0; a < allData.againGet.length; a++) {
              allData.againGet[a] = this.receiveAgainplainOptions[allData.againGet[a]]
            }
            allData = Object.assign({}, marketingDiscountData, allData)
            let info = {
              pageNo: this.pageNo,
              marketingDiscountId: allData.id,
              id: allData.id
            }
            getAction(that.url.findChannelByDiscountId, info).then(res => {
              let sz = []
              for (let item of res) {
                sz.push(item.marketingChannelId)
              }
              for (let item of sz) {
                for (let item2 of this.qudaoNoneChange) {
                  if (item2.id == item) {
                    allData.marketingChannelId.push(item2.name)
                  }
                }
              }
              if (allData.startTime && allData.endTime) {
                this.selectDateToTime = [
                  moment(allData.startTime, this.dateFormat),
                  moment(allData.endTime, this.dateFormat)
                ]
              }
              this.AllData = allData
              this.$nextTick(() => {
                this.form.setFieldsValue(allData)
              })
            })
            //使用商品列表请求接口返先
            //参数  marketingDiscountId
            getAction(that.url.findByMarketingDiscount, info).then(res => {
              if (res.success) {
                this.isSelectData = res.result.records
                this.selectAllStoreData = [...this.selectAllStoreData, ...res.result.records]
                for (let item of res.result.records) {
                  if (item.mainPicture) {
                    try {
                      item.mainPicture = this.configure.imgErver + '/' + Object.values(JSON.parse(item.mainPicture))[0]
                    } catch (e) {}
                  }
                  item.operation = '删除'
                  this.selectedRowKeys.push(item.id)
                }
                this.goodStoreListIds = this.selectedRowKeys.join(',')
              }
            })
          }
        })
        if (this.part == 1) {
          this.AllData.marketingChannelId.push(res[0].name)
          this.$nextTick(() => {
            this.form.setFieldsValue(this.AllData)
          })
        }
      }
    })
  },
  computed: {
    selectGoodsPopUpIds() {
      return this.goodStoreListIds ? this.goodStoreListIds.split(',') || [] : []
    }
  }
}
</script>
<style lang="less">
.AddMarketingDiscountStoreModel {
  background: white;
  width: 100%;
  .el-dialog {
    -webkit-backface-visibility: hidden;
  }

  .title {
    font-size: 16px;
    font-weight: 700;
    padding: 25px;
    border-bottom: 1px solid #d9d9d9;
    margin-top: 12px;
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
    margin-bottom: 0;
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
    padding-bottom: 20px;
    button {
      width: 80px;
    }
  }
  .button-end {
    margin-bottom: 40px;
    border-bottom: 1px solid gray;
  }
}
</style>
