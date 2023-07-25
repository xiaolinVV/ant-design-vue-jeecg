<template>
  <a-card :bordered="false">
    <a @click="showModalRejectReason(record.id)">拒绝</a>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="订单编号">
              <a-input placeholder="请输入订单编号" v-model="queryParam.orderNo"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div>
      <!-- <a-button @click="checkGoodsRepertory" type="primary" icon="plus">新增</a-button>-->
    </div>

    <!--&lt;!&ndash; 操作按钮区域 &ndash;&gt;-->
    <!--<div class="table-operator">-->
    <!--<a-button type="primary" icon="download"  :loading="exportLoading"  @click="orderListExport()">导出预览</a-button>-->
    <!--</div>-->
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('订单-平台订单-售后订单')">导出</a-button>
    </div>

    <!--<div class="table-operator">
    &lt;!&ndash;  <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>&ndash;&gt;
      &lt;!&ndash;<a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('订单列表')">导出</a-button>&ndash;&gt;
      <a-button type="primary" icon="download"  :loading="exportLoading"  @click="orderListExport()">导出预览</a-button>

      &lt;!&ndash;<a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>&ndash;&gt;
    </div>-->

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
        >项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :scroll="{ x: 2500 }"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="memberPhone" slot-scope="text, record, index">
          <div>
            <a
              @click="
                showModalEmemberInformation(
                  record.memberList,
                  record.consignee,
                  record.contactNumber,
                  record.shippingAddress,
                  record.houseNumber
                )
              "
              >{{ record.memberId_dictText }}</a
            >
          </div>
        </template>
        <template slot="goods" slot-scope="text, record, index">
          <div>
            <a @click="showModalGoodsInformation(record)">商品信息</a>
          </div>
        </template>
        <template slot="application" slot-scope="text, record, index">
          <div>
            <a @click="showModalRemark(record)">查看说明</a>
          </div>
        </template>
        <template slot="voucher" slot-scope="text, record, index">
          <div>
            <a @click="showImagePrew(record)">查看图片</a>
          </div>
        </template>
        <template slot="refundType" slot-scope="text, record, index">
          <div v-if="record.refundType == 0">仅退款</div>
          <div v-if="record.refundType == 1">退货退款</div>
          <div v-if="record.refundType == 2">换货</div>
        </template>

        <template slot="distribution" slot-scope="text, record, index">
          <a @click="showModalDistributionInformation(record.providerTemplateMaps)">
            <div v-for="item of distribution">
              <div v-if="record.distribution == item.value">{{ item.text }}</div>
            </div>
          </a>
        </template>

        <template slot="giveWelfarePayments" slot-scope="text, record, index">
          <div>
            <a v-if="record.giveWelfarePayments != 0" @click="showModalGivingInformation(record.giveWelfarePayments)"
              >福利金</a
            >
            <a v-else>-</a>
          </div>
        </template>
        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status == 0">待处理</span>
            <span shape="square" v-if="record.status == 1">待买家退回</span>
            <span shape="square" v-if="record.status == 2">换货中</span>
            <span shape="square" v-if="record.status == 3">退款中</span>
            <span shape="square" v-if="record.status == 4">退款成功</span>
            <span shape="square" v-if="record.status == 5">已拒绝</span>
            <span shape="square" v-if="record.status == 6">退款关闭</span>
            <span shape="square" v-if="record.status == 7">换货关闭</span>
            <span shape="square" v-if="record.status == 8">换货完成</span>
          </div>
        </template>
        <template slot="orderType" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.orderType == 0">普通订单</span>
            <span shape="square" v-if="record.orderType == 1">拼团订单</span>
            <span shape="square" v-if="record.orderType == 2">抢购订单</span>
            <span shape="square" v-if="record.orderType == 3">自选订单</span>
            <span shape="square" v-if="record.orderType == 4">兑换订单</span>
          </div>
        </template>
        <template slot="action" slot-scope="text, record">
          <div v-if="record.status == 0">
            <a @click="showModalRejectReason(record.id)">拒绝</a>
            <a-divider type="vertical" />
            <a @click="showModalAgreeWith(record)">通过</a>
          </div>

          <a v-if="record.status == 3 || record.status == 4" @click="showModalMoneyDetail(record)">退款金额明细</a>

          <a v-if="record.status == 5" @click="showModalRefusedExplain(record)">拒绝原因</a>

          <a v-if="record.status == 1 || record.status == 2" @click="showModalLogitic(record)">查看物流</a>

          <a v-if="record.status == 8" @click="showMidalChangeGoods(record)">换货明细</a>
          <!-- 待付款订单操作
          <div v-if="record.status == '0'">
            <a @click="showModalCancelInformation(record.id)">取消</a>
            <a-divider type="vertical" />
            <a
              @click="
                showModalAddressInformation(
                  record.id,
                  record.memberListId,
                  record.consignee,
                  record.contactNumber,
                  record.shippingAddress
                )
              "
              >修改地址</a
            >
            <a-divider type="vertical" />
            <a @click="particulars(record, 2)">详情</a>
          </div> -->
          <!--待发货订单操作-->
          <!-- <div v-if="record.status == '1'">
            <a @click="showModalCancelInformation(record.id)">取消</a>
            <a-divider type="vertical" />
            <a @click="refundAndAbrogateOrderModalClick(record.id)">取消并退款</a>
            <a-divider type="vertical" />
            <a @click="deliverGoods(record)">发货</a>
            <a-divider type="vertical" />
            <a @click="particulars(record, 3)">详情</a>

            <a-divider v-if="record.isSender == 1" type="vertical" />
            <a v-if="record.isSender == 1" @click="checkLogistics(record, 3)">查看物流</a>
          </div> -->
          <!--待收货订单操作-->
          <!-- <div v-if="record.status == '2'">
            <a @click="showModalCancelInformation(record.id)">取消</a>
            <a-divider type="vertical" />
            <a @click="refundAndAbrogateOrderModalClick(record.id)">取消并退款</a>
            <a-divider type="vertical" />
            <a @click="checkLogistics(record, 4)">查看物流</a>
            <a-divider type="vertical" />
            <a @click="particulars(record, 4)">详情</a>
          </div> -->
          <!--交易成功订单操作-->
          <!-- <div v-if="record.status == '3'">
            <a @click="showAudiModal(record.id)" v-if="record.isEvaluate == 1">审批</a>
            <a-divider type="vertical" />
            <a @click="refundAndAbrogateOrderModalClick(record.id)">取消并退款</a>

            <a-divider type="vertical" v-if="record.isEvaluate == 1" />
            <a @click="showEvaluateModal(record.id)" v-if="record.isEvaluate == 1">查看评价</a>

            <a-divider type="vertical" v-if="record.isEvaluate == 1" />
            <a @click="checkLogistics(record, 5)">查看物流</a>
            <a-divider type="vertical" />
            <a @click="particulars(record, 5)">详情</a>
          </div> -->
          <!--已取消订单操作-->
          <!-- <div v-if="record.status == '4'">
            <a @click="particulars(record, 1)">详情</a>
            <a-divider type="vertical" />
            <a @click="showModalDeletess(record.id)">删除</a>
          </div> -->
          <!--交易完成订单操作-->
          <!-- <div v-if="record.status == '5'">
            <a @click="showAudiModal(record.id)" v-if="record.isEvaluate == 1">审批</a
            >
            <a-divider type="vertical" />
            <a @click="refundAndAbrogateOrderModalClick(record.id)">取消并退款</a>
            <a-divider type="vertical" v-if="record.isEvaluate == 1" />
            <a @click="showEvaluateModal(record.id)" v-if="record.isEvaluate == 1">查看评价</a
            >
            <a-divider type="vertical" v-if="record.isEvaluate == 1" />
            <a @click="checkLogistics(record, 5)">查看物流</a>
            <a-divider type="vertical" />
            <a @click="particulars(record, 5)">详情</a>
          </div> -->
        </template>
      </a-table>
    </div>
    <!-- table区域-end -->
    <a-modal
      title="商品信息"
      :footer="null"
      :width="1000"
      v-model="visiblGoodsInformation"
      okText="确认"
      cancelText="取消"
    >
      <div>
        <a-table
          size="middle"
          bordered
          :columns="goodscolumns"
          :pagination="false"
          :dataSource="orderProviderGoodRecordDTOList"
        >
          <!-- :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"-->
          <template slot="goodMainPicture" slot-scope="text, record, index">
            <div class="anty-img-wrap">
              <a-avatar
                shape="square"
                v-if="record.goodMainPicture != undefined"
                :src="getAvatarView(JSON.parse(record.goodMainPicture)[0])"
                icon="user"
              />
              <a-avatar
                shape="square"
                v-if="record.goodMainPicture == undefined || record.goodMainPicture == ''"
                :src="getAvatarView(record.goodMainPicture)"
                icon="user"
              />
            </div>
          </template>
        </a-table>
      </div>
    </a-modal>

    <!-- 拒绝原因弹窗 -->
    <a-modal
      title="拒绝原因"
      v-model="visiblRefusedExplain"
      @ok="confiemeModalExpress()"
      :footer="null"
      :width="800"
      okText="确认"
      cancelText="取消"
    >
      <div>
        <a-form>
          <a-form-item label="取消原因">
            <a-textarea disabled v-model="closeExplain" placeholder="请输入100以内" show-count :maxlength="100" />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
    <!-- 展示退款凭证 -->
    <a-modal
      title="退款凭证"
      v-model="visiblRefundCertificate"
      :footer="null"
      :width="800"
      okText="确认"
      cancelText="取消"
    >
      <div class="imageContainer">
        <div class="imgLeft" @click="reduceImage">
          <a-icon type="left" />
        </div>
        <img class="imageCover" :src="refundCertificateList[indeImage]" alt="" />
        <div class="imgLeft" @click="addImage">
          <a-icon type="right" />
        </div>
      </div>
    </a-modal>
    <!-- 表单区域 -->
    <orderList-modal ref="modalForm" @ok="modalFormOk"></orderList-modal>

    <!--取消并退款-->
    <refund-and-abrogate-order-modal
      ref="refundAndAbrogateOrderModal"
      @ok="modalFormOk"
    ></refund-and-abrogate-order-modal>
  </a-card>
</template>

<script>
import OrderListModal from './modules/OrderListModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj, getUrlParams } from '@/utils/util'
import RefundAndAbrogateOrderModal from './modules/RefundAndAbrogateOrderModal'
import { deleteAction, getAction } from '@/api/manage'
//字典
import { initDictOptions } from '@/components/dict/JDictSelectUtil'
export default {
  name: 'OrderListList',
  mixins: [JeecgListMixin],
  components: {
    OrderListModal,
    RefundAndAbrogateOrderModal,
  },
  data() {
    return {
      indeImage: 0,
      refundCertificateList: [],
      visiblRefundCertificate: false,
      closeExplain: '',
      visiblRefusedExplain: false,
      visiblGoodsInformation: false,
      orderProviderGoodRecordDTOList: [],
      goodscolumns: [
        // {
        //     title: '商品编号',
        //     align: 'center',
        //     dataIndex: 'goodNo'
        //   },
        {
          title: '商品主图',
          align: 'center',
          dataIndex: 'goodMainPicture',
          scopedSlots: { customRender: 'goodMainPicture' },
        },
        {
          title: '商品名称',
          align: 'center',
          dataIndex: 'goodName',
          width: 200,
        },

        {
          title: '商品规格',
          align: 'center',
          dataIndex: 'goodSpecification',
          scopedSlots: { customRender: 'specification' },
        },

        {
          title: '单价',
          align: 'center',
          dataIndex: 'goodRecordActualPayment',
        },
        {
          title: '数量',
          align: 'center',
          dataIndex: 'goodRecordAmount',
          scopedSlots: { customRender: 'amount' },
        },
        {
          title: '小计',
          align: 'center',
          dataIndex: 'goodRecordTotal',
        },
      ],
      description: '订单列表管理页面',
      distribution: '',
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        {
          title: '订单编号',
          align: 'center',
          dataIndex: 'orderNo',
        },
        {
          title: '售后单编号',
          align: 'center',
          dataIndex: 'id',
        },
        {
          title: '订单类型',
          align: 'center',
          dataIndex: 'orderType_dictText',
          // scopedSlots: { customRender: 'orderType' }
          // sorter:true,
        },
        // {
        //   title: '店铺名称',
        //   align: 'center',
        //   dataIndex: 'merchantConsigneeName'
        //   // sorter:true,
        // },
        {
          title: '买家',
          align: 'center',
          dataIndex: 'memberId_dictText',
          // scopedSlots: { customRender: 'memberPhone' }
        },

        // {
        //   title: '留言',
        //   align: 'center',
        //   dataIndex: 'message',
        //   scopedSlots: { customRender: 'message' }
        // },
        {
          title: '售后商品',
          align: 'center',
          dataIndex: 'goods',
          scopedSlots: { customRender: 'goods' },
        },
        {
          title: '售后申请类型',
          align: 'center',
          dataIndex: 'refundType',
          scopedSlots: { customRender: 'refundType' },
          // sorter:true,
        },
        {
          title: '商品原价',
          align: 'center',
          dataIndex: 'goodRecordTotal',
          // sorter:true,
        },
        {
          title: '售后数量',
          align: 'center',
          dataIndex: 'goodRecordAmount',
          // sorter:true,
        },
        {
          title: '售后商品总原价',
          align: 'center',
          dataIndex: 'goodUnitPrice',
          // sorter:true,
        },
        {
          title: '优惠金额',
          align: 'center',
          dataIndex: 'goodRecordTotalCoupon',
          // sorter:true,
        },
        {
          title: '售后商品总实付款',
          align: 'center',
          dataIndex: 'goodRecordActualPayment',
          // sorter:true,
        },
        {
          title: '退款申请金额',
          align: 'center',
          dataIndex: 'refundPrice',
          // sorter:true,
        },
        {
          title: '售后原因',
          align: 'center',
          dataIndex: 'refundReason_dictText',
          // sorter:true,
        },
        {
          title: '申请说明',
          align: 'center',
          dataIndex: 'application',
          scopedSlots: { customRender: 'application' },
          // sorter:true,
        },
        {
          title: '凭证',
          align: 'center',
          dataIndex: 'voucher',
          scopedSlots: { customRender: 'voucher' },
          // sorter:true,
        },
        {
          title: '售后处理进度',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          // sorter:true,
        },
        {
          title: '售后发起时间',
          align: 'center',
          dataIndex: 'createTime',
          // sorter:true,
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 300,
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/order/orderRefundList/list',
        delete: '/orderList/orderList/delete',
        deleteBatch: '/orderList/orderList/deleteBatch',
        exportXlsUrl: '/order/orderRefundList/exportXls',
        // importExcelUrl: '/order/orderRefundList/exportXls',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        //checkGoodsRepertory:"/orderList/orderList/checkGoodsRepertory"
      },
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    reduceImage() {
      if (this.indeImage == 0) {
        this.indeImage = this.refundCertificateList.length - 1
      } else {
        this.indeImage = this.indeImage - 1
      }
      console.log(this.indeImage)
    },
    addImage() {
      if (this.indeImage == this.refundCertificateList.length - 1) {
        this.indeImage = 0
      } else {
        this.indeImage = this.indeImage + 1
      }
      console.log(this.indeImage)
    },
    showImagePrew(record) {
      let that = this
      this.indeImage = 0
      if (record.refundCertificate != '' && record.refundCertificate != null && record.refundCertificate != undefined) {
        let list = record.refundCertificate.split(',')
        that.refundCertificateList = list
        that.visiblRefundCertificate = true
      } else {
        that.$message.success('暂无凭证')
      }
    },
    getAvatarView: function (mainPicture) {
      return this.url.imgerver + '/' + mainPicture
    },
    refundAndAbrogateOrderModalClick(param) {
      this.$refs.refundAndAbrogateOrderModal.open(param)
    },
    /**查询栏时间区间查询*/
    getQueryParams() {
      console.log(this.queryParam.createTime)
      let pathQueryParam = getUrlParams()
      var param = Object.assign({}, this.queryParam, this.isorter, pathQueryParam)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.createTime // 时间参数不传递后台
      delete param.closeTime
      delete param.payTime
      delete param.shipmentsTime
      delete param.deliveryTime
      return filterObj(param)
    },
    onDateChange: function (value, dateString) {
      console.log('*****************************************************', dateString[0], dateString[1])
      this.queryParam.createTime_begin = dateString[0]
      this.queryParam.createTime_end = dateString[1]
    },
    onDateChange1: function (value, dateString) {
      console.log('*****************************************************', dateString[0], dateString[1])
      this.queryParam.closeTime_begin = dateString[0]
      this.queryParam.closeTime_end = dateString[1]
    },
    onDateChange2: function (value, dateString) {
      console.log('*****************************************************', dateString[0], dateString[1])
      this.queryParam.payTime_begin = dateString[0]
      this.queryParam.payTime_end = dateString[1]
    },
    onDateChange3: function (value, dateString) {
      console.log('*****************************************************', dateString[0], dateString[1])
      this.queryParam.shipmentsTime_begin = dateString[0]
      this.queryParam.shipmentsTime_end = dateString[1]
    },
    onDateChange4: function (value, dateString) {
      console.log('*****************************************************', dateString[0], dateString[1])
      this.queryParam.deliveryTime_begin = dateString[0]
      this.queryParam.deliveryTime_end = dateString[1]
    },

    onDateOk(value) {
      console.log(value)
    },
    onDateOk1(value) {
      console.log(value)
    },
    /*****弹窗*****/
    //会员信息
    showModalEmemberInformation(memberList, consignee, contactNumber, shippingAddress, houseNumber) {
      this.$refs.modalForm.showModalEmemberInformation(
        memberList,
        consignee,
        contactNumber,
        shippingAddress,
        houseNumber
      )
      this.$refs.modalForm.title = '会员信息'
      this.$refs.modalForm.disableSubmit = false
    },
    //商品信息
    showModalGoodsInformation(record) {
      this.orderProviderGoodRecordDTOList = []
      this.orderProviderGoodRecordDTOList.push(record)
      this.visiblGoodsInformation = true
      // this.$refs.modalForm.showModalGoodsInformation(orderProviderListDTOs)
      // this.$refs.modalForm.title = '商品信息'
      // this.$refs.modalForm.disableSubmit = false
    },
    //申请说明
    showModalRemark(record) {
      if (record.remarks == '') {
        return this.$message.success('暂无说明')
      }
      this.$refs.modalForm.showModalRemark(record)
      this.$refs.modalForm.title = '申请说明'
      this.$refs.modalForm.disableSubmit = false
    },
    //留言信息
    showModalMessageInformation(Message) {
      this.$refs.modalForm.showModalMessageInformation(Message)
      this.$refs.modalForm.title = '留言信息'
      this.$refs.modalForm.disableSubmit = false
    },
    //赠送
    showModalGivingInformation(giveWelfarePayments) {
      this.$refs.modalForm.showModalGivingInformation(giveWelfarePayments)
      this.$refs.modalForm.title = '赠送信息'
      this.$refs.modalForm.disableSubmit = false
    },
    //优惠金额
    showModalCouponInformation(record) {
      this.$refs.modalForm.showModalCouponInformation(record)
      this.$refs.modalForm.title = '优惠券'
      this.$refs.modalForm.disableSubmit = false
    },
    //配送方式信息
    showModalDistributionInformation(providerTemplateMaps) {
      this.$refs.modalForm.showModalDistributionInformation(providerTemplateMaps)
      this.$refs.modalForm.title = '配送方式'
      this.$refs.modalForm.disableSubmit = false
    },
    //取消按钮
    showModalCancelInformation(orderListId) {
      this.$refs.modalForm.showModalCancelInformation(orderListId)
      this.$refs.modalForm.title = '取消按钮'
      this.$refs.modalForm.disableSubmit = false
    },
    //修改地址
    showModalAddressInformation(goodListId, memberListId, consignee, contactNumber, shippingAddress) {
      this.$refs.modalForm.showModalAddressInformation(
        goodListId,
        memberListId,
        consignee,
        contactNumber,
        shippingAddress
      )
      this.$refs.modalForm.title = '修改地址'
      this.$refs.modalForm.disableSubmit = false
    },
    //删除
    showModalDeletess: function (id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')

        return
      }
      var that = this
      this.$confirm({
        title: '确定要删除订单吗，删除后不可恢复。',
        content: '确定要删除吗？',
        onOk: function () {
          deleteAction(that.url.delete, { id: id }).then((res) => {
            console.log(res)
            if (res.success) {
              that.$message.success(res.message)
              that.loadData()
            } else {
              that.$message.warning(res.message)
            }
          })
        },
      })
    },
    //跳转详情
    particulars(record, reusePage) {
      //reusePage：1 已取消订单 2 待付款订单 3 待发货订单 4 待收货订单 5 交易成功订单
      localStorage.setItem('OrderDetails', JSON.stringify(record))
      this.$router.push({ path: '/order/OrderDetails', query: { record: record, reusePage: reusePage } }) //reusePage=1
    },
    //发货
    deliverGoods(record) {
      localStorage.setItem('deliverGoods', JSON.stringify(record))
      this.$router.push({ path: '/order/modules/OrderDeliverGoods', query: { record: record } }) //reusePage=3
    },
    //查看物流
    checkLogistics(record, reusePage) {
      localStorage.setItem('deliverGoods', JSON.stringify(record))
      this.$router.push({ path: '/order/OrderLogisticsGoods', query: { record: record, reusePage: reusePage } }) //reusePage=4
    },
    //评论内容
    showEvaluateModal(id) {
      this.$refs.modalForm.showEvaluateModal(id)
      this.$refs.modalForm.title = '评论弹窗'
      this.$refs.modalForm.disableSubmit = false
    },
    //审批弹窗
    showAudiModal(id) {
      this.$refs.modalForm.showAudiModal(id)
      this.$refs.modalForm.title = '审批弹窗'
      this.$refs.modalForm.disableSubmit = false
    },
    //拒绝
    showModalRejectReason(id) {
      this.$refs.modalForm.showRejectReasonModa(id)
      this.$refs.modalForm.title = '拒绝原因'
      this.$refs.modalForm.disableSubmit = false
    },
    //同意
    showModalAgreeWith(record) {
      if (record.refundType == 0) {
        this.$refs.modalForm.showAgreeWithModa(record)
        this.$refs.modalForm.title = ''
        this.$refs.modalForm.disableSubmit = false
      } else {
        this.$refs.modalForm.showModalEditLogistics(record)
        this.$refs.modalForm.title = ''
        this.$refs.modalForm.disableSubmit = false
      }
    },
    //拒绝原因展示
    showModalRefusedExplain(record) {
      this.closeExplain = record.refusedExplain
      this.visiblRefusedExplain = true
    },
    //换货明细
    showMidalChangeGoods(record) {
      this.$refs.modalForm.showMidalChangeGoods(record)
      this.$refs.modalForm.title = ''
      this.$refs.modalForm.disableSubmit = false
    },
    //查看物流
    showModalLogitic(record) {
      this.$refs.modalForm.showModalLogistics(record)
      this.$refs.modalForm.title = ''
      this.$refs.modalForm.disableSubmit = false
    },
    //填写物流
    showModalEditLogitic() {
      this.$refs.modalForm.showModalEditLogistics()
      this.$refs.modalForm.title = ''
      this.$refs.modalForm.disableSubmit = false
    },
    //资金明细
    showModalMoneyDetail(record) {
      this.$refs.modalForm.showModalMoneyDetail(record)
      this.$refs.modalForm.title = ''
      this.$refs.modalForm.disableSubmit = false
    },

    init() {
      this.initIndex()
    },
    initIndex() {
      initDictOptions('oder_distribution').then((res) => {
        if (res.success) {
          /*for(let item of res.result){
              if(item.value == this.distribution  ){
                this.distribution = item.title
              }
            }*/
          this.distribution = res.result
        }
      })
    },

    checkGoodsRepertory() {
      getAction(this.url.checkGoodsRepertory).then((res) => {
        console.log(res)
      })
    },
    orderListExport() {
      let urlParam = '&'

      if (this.paramsUrl) {
        urlParam = this.convertObj(this.paramsUrl)
      }
      let HOST =
        window.location.protocol +
        '//' +
        window.location.host +
        '/jeecg-boot/ureport/preview?' +
        '_u=file:%25E8%25AE%25A2%25E5%258D%2595-%25E8%25AE%25A2%25E5%258D%2595%25E5%2588%2597%25E8%25A1%25A8-%25E8%25B0%25A2.ureport.xml&' +
        urlParam
      window.open(HOST)
    },
    //转url参数
    convertObj(data) {
      var _result = []
      for (var key in data) {
        var value = data[key]
        if (value.constructor == Array) {
          value.forEach(function (_value) {
            _result.push(key + '=' + _value)
          })
        } else {
          _result.push(key + '=' + value)
        }
      }
      return _result.join('&')
    },
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
.imageContainer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.imageCover {
  display: flex;
  flex: 1;
  height: 600px;
}
.imgLeft {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 600px;
  cursor: pointer;
}
</style>
