<template>
  <div>
    <div class="order-details">
      <div class="title">
        订单详情
      </div>
      <a-card :bordered="true" class="head-decoration">
        <!--交易关闭订单-->
        <div v-if="reusePage == 1">
          <div class="cnt-title">
            交易关闭
          </div>
          <div>{{ record.closeType }}&nbsp;&nbsp; {{ record.closeExplain }}</div>
        </div>
        <!--待付款订单-->
        <div v-if="reusePage == 2">
          <div style="float: left">
            <div class="cnt-title">
              待付款
            </div>
            <div style="display: flex;align-items: center">
              等待买家付款，倒计时

              <countDown :day="day" :hour="hour" :minute="minute" :second="second" v-if="countDownTime" />

              ，逾期未付款订单将取消
            </div>
          </div>
          <div style="float: right">
            <a-button type="primary" @click="showModalCancelInformation(record.id)" style="margin-right: 20px"
              >取消订单
            </a-button>
            <a-button
              type="primary"
              @click="
                showModalAddressInformation(
                  record.id,
                  record.memberListId,
                  record.consignee,
                  record.contactNumber,
                  record.shippingAddress
                )
              "
            >
              修改地址
            </a-button>
          </div>
        </div>
        <!-- 待发货订单-->
        <div v-if="reusePage == 3">
          <div style="float: left">
            <div class="cnt-title">
              待发货
            </div>
            <div>
              买家已经付款，请尽快发货
            </div>
          </div>
          <div style="float: right">
            <a-button
              type="primary"
              v-if="record.isSender == 1"
              @click="checkLogistics(record, 3)"
              style="margin-right: 20px"
              >查看物流
            </a-button>
            <a-button type="primary" @click="deliverGoods(record)">发货</a-button>
          </div>
        </div>
        <!-- 待发货订单-->
        <div v-if="reusePage == 4">
          <div style="float: left">
            <div class="cnt-title">
              待收货
            </div>
            <div style="display: flex;align-items: center">
              等待买家收货，买家还有
              <countDown :day="day" :hour="hour" :minute="minute" :second="second" v-if="countDownTime" />
              自动确认收货
            </div>
          </div>
          <div style="float: right">
            <a-button type="primary" @click="checkLogistics(record, 4)">查看物流</a-button>
          </div>
        </div>
        <!-- 交易完成订单-->
        <div v-if="reusePage == 5">
          <div style="float: left">
            <div class="cnt-title">
              交易完成
            </div>
            <div></div>
          </div>
          <div style="float: right">
            <a-button
              type="primary"
              v-if="record.isEvaluate == 1"
              @click="showAudiModal(record.id)"
              style="margin-right: 20px"
              >审批 </a-button
            ><!--v-if="record.isEvaluate == 1"-->
            <a-button
              type="primary"
              v-if="record.isEvaluate == 1"
              @click="showEvaluateModal(record.id)"
              style="margin-right: 20px"
              >查看评价 </a-button
            ><!--v-if="record.isEvaluate == 1"-->

            <a-button type="primary" @click="checkLogistics(record, 5)">查看物流</a-button>
          </div>
        </div>
      </a-card>
      <a-card class="wrap">
        <detail-list :col="4" style="border-bottom: 1px solid #e1e1e1;margin-bottom: 36px;">
          <detail-list-item v-for="item in card1Cnt" v-if="item.term" :term="item.term">
            {{ item.content }}
          </detail-list-item>
        </detail-list>

        <detail-list :col="4" style="border-bottom: 1px solid  #e1e1e1;">
          <detail-list-item v-for="item in card2Cnt" v-if="item.term" :term="item.term">
            {{ item.content }}
          </detail-list-item>
        </detail-list>
      </a-card>
      <a-card class="wrap">
        <detail-list :col="4" style="margin-bottom: 36px;">
          <detail-list-item v-for="item in card3Cnt" v-if="item.term" :term="item.term">
            {{ item.content }}
          </detail-list-item>
        </detail-list>
        <detail-list :col="4" style="margin-bottom: 36px;">
          <detail-list-item v-for="item in card4Cnt" v-if="item.term" :term="item.term">
            {{ item.content }}
          </detail-list-item>
        </detail-list>
        <detail-list :col="1" style="margin-bottom: 36px;">
          <detail-list-item v-for="item in card5Cnt" v-if="item.term" :term="item.term">
            {{ item.content }}
          </detail-list-item>
        </detail-list>
      </a-card>
      <a-card class="wrap">
        <!--<div class="head">
          <div class="cnt">
            <span class="term">
            供应商
          </span>
            <span class="item">
            厦门什么什么什么公司
          </span>
          </div>
          <div class="cnt">
            <span class="term">
            供应商订单编号
          </span>
            <span class="item">
            G201909081013123456
          </span>
          </div>
        </div>
        <detail-list  :col="4" style="margin-bottom: 36px;">
          <detail-list-item v-for='item in card4Cnt' :term="item.term" >
            {{item.content}}
          </detail-list-item>
        </detail-list>-->
        <div v-for="item of formList">
          <!--<s-table
            style="margin-bottom: 24px"
            :columns="goodsColumns"
            :pagination="false"
            :data="item.orderProviderGoodRecords"
            >
            &lt;!&ndash;loadGoodsData&ndash;&gt;
            &lt;!&ndash;<template
              slot="commodityPictures"
              slot-scope="commodityPictures">
              <img :src="commodityPictures" alt="" style="width: 50px;height: 50px;">
            </template>&ndash;&gt;
          </s-table>-->
          <div class="head">
            <div class="cnt">
              <span class="term">
                供应商
              </span>
              <span class="item">
                {{ item.sysUserName }}
              </span>
            </div>
            <div class="cnt">
              <span class="term">
                供应商订单编号
              </span>
              <span class="item">
                {{ item.orderNo }}
              </span>
            </div>
          </div>
          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :pagination="false"
            :columns="goodsColumns"
            :dataSource="item.orderProviderGoodRecordDTOList"
            style="margin-bottom: 24px"
            :scroll="{ x: 1500 }"
          >
            <!-- :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"-->
            <template slot="mainPicture" slot-scope="text, record, index">
              <div class="anty-img-wrap">
                <a-avatar
                  shape="square"
                  v-if="record.mainPicture != undefined"
                  :src="getAvatarView(JSON.parse(record.mainPicture)[0])"
                  icon="user"
                />
                <a-avatar
                  shape="square"
                  v-if="record.mainPicture == undefined || record.mainPicture == ''"
                  :src="getAvatarView(record.mainPicture)"
                  icon="user"
                />
              </div>
            </template>
            <template slot="unitPrice" slot-scope="text, record, index">
              <span>{{ text }}</span>
              <div v-if="record.memberGradeContent && record.memberDiscountPrice" class="anty-img-wrap">
                <span>{{ record.memberGradeContent }} , 优惠 {{ record.memberDiscountPrice }} 元</span>
              </div>
            </template>
          </a-table>
        </div>
      </a-card>
      <a-card class="wrap">
        <detail-list :col="4">
          <detail-list-item v-for="item in card6Cnt" v-if="item.term" :term="item.term">
            {{ item.content }}
          </detail-list-item>
        </detail-list>
        <div CLASS="link-top"></div>
        <detail-list :col="4" style="margin-bottom: 36px;">
          <detail-list-item v-for="item in card8Cnt" v-if="item.term" :term="item.term">
            {{ item.content }}
          </detail-list-item>
        </detail-list>
        <div CLASS="link-top"></div>
        <detail-list :col="4" style="margin-bottom: 36px;">
          <detail-list-item v-for="item in card12Cnt" v-if="item.term" :term="item.term">
            {{ item.content }}
          </detail-list-item>
        </detail-list>
        <div CLASS="link-top"></div>
        <detail-list :col="4" style="margin-bottom: 36px;">
          <detail-list-item v-for="item in card9Cnt" v-if="item.term" :term="item.term">
            {{ item.content }}
          </detail-list-item>
        </detail-list>
        <div CLASS="link-top"></div>
        <detail-list :col="4" style="margin-bottom: 36px;">
          <detail-list-item v-for="item in card11Cnt" v-if="item.term" :term="item.term">
            {{ item.content }}
          </detail-list-item>
        </detail-list>
      </a-card>

      <a-card class="wrap">
        <detail-list :col="4">
          <detail-list-item v-for="item in card10Cnt" v-if="item.term" :term="item.term">
            {{ item.content }}
          </detail-list-item>
        </detail-list>
      </a-card>

      <a-card class="wrap">
        <!-- <s-table
           style="margin-bottom: 24px"
           :columns="goodsColumns2"
           :data="formList">
         </s-table>-->
        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          :pagination="false"
          :columns="goodsColumns2"
          :dataSource="providerTemplateMaps"
          style="margin-bottom: 24px"
          :scroll="{ x: 1500 }"
        >
        </a-table>
      </a-card>
      <a-card class="wrap">
        <detail-list :col="4" style="margin-bottom: 36px;">
          <detail-list-item v-for="item in card7Cnt" v-if="item.term" :term="item.term">
            {{ item.content }}
          </detail-list-item>
        </detail-list>
      </a-card>
      <!-- 表单区域 -->
      <orderList-modal ref="modalForm" @ok="modalFormOk"></orderList-modal>
    </div>
    <!-- 表单区域 -->
    <orderList-modal ref="modalForm" @ok="modalFormOk"></orderList-modal>
  </div>
</template>

<script>
import OrderListModal from './modules/OrderListModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'
import DetailList from '@/components/tools/DetailList'
import STable from '@/components/table/'
import countDown from '@/components/tools/countDown'
import { getAction, postAction } from '@/api/manage'

const DetailListItem = DetailList.Item
//字典
import { filterDictText, initDictOptions } from '@/components/dict/JDictSelectUtil'

export default {
  name: 'OrderListList',
  mixins: [JeecgListMixin],
  components: {
    OrderListModal,
    DetailList,
    DetailListItem,
    STable,
    countDown
  },
  data() {
    return {
      description: '订单列表管理页面',
      formList: {},
      providerTemplateMaps: [], //运费模板数据
      orderType: '',
      orderProviderGoodRecords: [],
      reusePage: '',
      record: {},
      day: 2,
      hour: 20,
      minute: 20,
      second: 20,
      countDownTime: 0,
      //卡片1的上半部分内容
      card1Cnt: [
        {
          term: '订单编号',
          content: ' - - '
        },
        {
          term: '订单类型',
          content: ' - - '
        },
        {
          term: '创建时间',
          content: ' - - '
        },
        {
          term: '关闭时间',
          content: ' - - '
        },
        {
          term: '付款时间',
          content: ' - - '
        },
        {
          term: '发货时间',
          content: ' - - '
        },
        {
          term: '收货时间',
          content: ' - - '
        },
        {
          term: '完成时间',
          content: ' - - '
        },
        {
          term: '交易流水号',
          content: ' - - '
        }
      ],
      //卡片1下半部分内容
      card2Cnt: [
        {
          term: '商品总价',
          content: ' - - '
        },
        {
          term: '优惠金额',
          content: ' - - '
        },
        {
          term: '配送费用',
          content: ' - - '
        },
        {
          term: '实付款',
          content: ' - - '
        }
      ],
      //卡片2上半部信息
      card3Cnt: [
        {
          term: '买家账号',
          content: ' - - '
        },
        {
          term: '昵称',
          content: ' - - '
        },
        {
          term: '会员类型',
          content: ' - - '
        }
      ],
      //卡片2下半部信息
      card4Cnt: [
        {
          term: '收货人',
          content: ' - - '
        },
        {
          term: '联系电话',
          content: ' - - '
        },
        {
          term: '收货地址',
          content: ' - - '
        }
        //  {
        //   term: '门牌号',
        //   content: ' - - '
        // }
      ],
      //卡片2 留言
      card5Cnt: [
        {
          term: '留言信息',
          content: ' - - '
        }
      ],
      // 卡片3 信息
      card6Cnt: [
        {
          term: '优惠券抵扣',
          content: ''
        },
        {
          term: '优惠券id',
          content: ' - - '
        },
        {
          term: '优惠金额',
          content: ' - - '
        },
        {
          term: '优惠券名称',
          content: ' - - '
        },
        {
          term: '优惠券发行人',
          content: ' - - '
        },
        {
          term: '优惠券有效期',
          content: ' - - '
        }
      ],
      //卡片4 信息
      card7Cnt: [
        {
          term: '推广人',
          content: ' - - '
        },
        {
          term: '归属店铺',
          content: ' - - '
        },
        {
          term: '销售渠道',
          content: ' - - '
        }
      ],
      card8Cnt: [
        {
          term: '福利金抵扣',
          content: ''
        },
        {
          term: '支出福利金',
          content: ' - - '
        },

        {
          term: '优惠金额',
          content: ' - - '
        }
      ],
      card9Cnt: [
        {
          term: 'vip免福利金抵扣',
          content: ''
        },
        {
          term: '会员类型',
          content: ' - - '
        },
        {
          term: '会员直降',
          content: ' - - '
        }
      ],
      card10Cnt: [
        {
          term: '赠送福利金',
          content: ''
        },
        {
          term: '赠送内容',
          content: ' - - '
        },
        {
          term: '赠送规则',
          content: ' - - '
        }
      ],
      card12Cnt : [
        {
          term: '免费积分',
          content: ''
        },
        {
          term: '支出积分',
          content:  ' - - '
        },

        {
          term: '优惠金额',
          content: ' - - '
        }
      ],

      //  会员等级优惠
      card11Cnt: [
        {
          term: '会员等级优惠',
          content: ''
        },
        {
          term: '会员等级',
          content: ' - - '
        },
        {
          term: '优惠金额',
          content: ' - - '
        }
      ],
      goodsColumns: [
        {
          title: '商品编号',
          align: 'center',
          dataIndex: 'goodNo'
        },
        {
          title: '商品主图',
          align: 'center',
          dataIndex: 'mainPicture',
          scopedSlots: { customRender: 'mainPicture' }
        },
        {
          title: '商品名称',
          align: 'center',
          dataIndex: 'goodName'
        },

        {
          title: '商品规格',
          align: 'center',
          dataIndex: 'specification',
          scopedSlots: { customRender: 'specification' }
        },

        {
          title: '单价',
          align: 'center',
          dataIndex: 'unitPrice',
          scopedSlots: { customRender: 'unitPrice' }
        },
        {
          title: '数量',
          align: 'center',
          dataIndex: 'amount',
          scopedSlots: { customRender: 'amount' }
        },
        {
          title: '小计',
          align: 'center',
          dataIndex: 'total'
        },
        {
          title: '重量',
          align: 'center',
          dataIndex: 'weight'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      /*  loadGoodsData: () => {
            return new Promise((resolve => {
              resolve({
                data: data1,
                pageSize: 10,
                pageNo: 1,
                totalPage: 1,
                totalCount: 10
              })
            })).then(res => {
              return res
            })
          },*/
      goodsColumns2: [
        {
          title: '配送方式',
          align: 'center',
          dataIndex: 'distribution', //distribution_dictText
          sorter: true,
          // scopedSlots: {customRender: "distribution"}
          //sorter:true,
          customRender: text => {
            //字典值替换通用方法
            return filterDictText(this.distribution, text)
          }
        },
        {
          title: '供货商',
          align: 'center',
          dataIndex: 'sysUserName'
        },
        {
          title: '运费模板',
          align: 'center',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '计费规则',
          align: 'center',
          dataIndex: 'accountingRules',
          key: 'accountingRules'
        },
        {
          title: '计费方式',
          align: 'center',
          dataIndex: 'chargeMode',
          key: 'chargeMode'
        },
        {
          title: '总数',
          dataIndex: 'goodCount',
          key: 'goodCount',
          align: 'center'
        },
        {
          title: '配送费用',
          dataIndex: 'shipFee',
          key: 'shipFee',
          align: 'center'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadGoodsData2: () => {
        return new Promise(resolve => {
          resolve({
            data: data2,
            pageSize: 10,
            pageNo: 1,
            totalPage: 1,
            totalCount: 10
          })
        }).then(res => {
          return res
        })
      },

      url: {
        list: '/orderList/orderList/list',
        delete: '/orderList/orderList/delete',
        deleteBatch: '/orderList/orderList/deleteBatch',
        exportXlsUrl: 'orderList/orderList/exportXls',
        importExcelUrl: 'orderList/orderList/importExcel',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        //待支付订单计时器
        prepaidOrderTimer: 'orderList/orderList/prepaidOrderTimer',
        //确认收货订单计时器
        confirmReceiptTimer: 'orderList/orderList/confirmReceiptTimer'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  mounted() {
    this.init(() => {
      //**********************************数据渲染开始********************************************//
      /* if (localStorage.getItem('OrderDetails')) {
           let data = JSON.parse(localStorage.getItem('OrderDetails'))
           console.log("data",data)
         }else{
           let data = this.$route.query.record;
           console.log("data22",data)
         }*/
      let data = JSON.parse(localStorage.getItem('OrderDetails'))
      console.log('数据初始化', JSON.stringify(data))
      this.record = data
      //this.record = this.$route.query.record;
      // localStorage.setItem();
      // localStorage.getItem();
      if (this.orderType && this.orderType) {
        for (let item of this.orderType) {
          //字典值替换
          if (item.value == data.orderType) {
            data.orderType = item.text
            break
          }
        }
      }

      if (this.oderCloseType && data.closeType) {
        for (let item of this.oderCloseType) {
          //字典值替换
          if (item.value == data.closeType) {
            data.closeType = item.text
            break
          }
        }
      }

      if (data.closeExplain && this.oderCloseExplain) {
        for (let item of this.oderCloseExplain) {
          //字典值替换
          if (item.value == data.closeExplain) {
            data.closeExplain = item.text
            break
          }
        }
      }

      if (data.memberList) {
        if (data.memberList.memberType && this.memberTypeDict) {
          for (let item of this.memberTypeDict) {
            //字典值替换
            if (item.value == data.memberList.memberType) {
              data.memberList.memberType = item.text
              break
            }
          }
        }
      }

      /* for(let item of this.oderDistribution){//字典值替换
           console.log("this.oderDistribution",this.oderDistribution)
           debugger
           if(item.value == data.distribution){
             data.distribution = item.text
             debugger
             break;
           }
         }*/
      let memberList = data.memberList
      let orderProviderListDTOs = data.orderProviderListDTOs
      let providerTemplateMaps = data.providerTemplateMaps
      this.reusePage = this.$route.query.reusePage
      console.log('data', data)
      console.log('reusePage', this.reusePage)
      this.card1Cnt = [
        {
          term: '订单编号',
          content: data.orderNo || ' - - '
        },
        {
          term: '订单类型',
          content: data.orderType || ' - - '
        },
        {
          term: '创建时间',
          content: data.createTime || ' - - '
        },
        {
          term: '关闭时间',
          content: data.closeTime || ' - - '
        },
        {
          term: '付款时间',
          content: data.payTime || ' - - '
        },
        {
          term: '发货时间',
          content: data.shipmentsTime || ' - - '
        },
        {
          term: '收货时间',
          content: data.deliveryTime || ' - - '
        },
        {
          term: '完成时间',
          content: data.completionTime || ' - - '
        },
        {
          term: '交易流水号',
          content: data.serialNumber || ' - - '
        }
      ]
      this.card2Cnt = [
        {
          term: '商品总价',
          content: data.goodsTotal || ' - - '
        },
        {
          term: '优惠金额',
          content: data.coupon || ' - - '
        },
        {
          term: '配送费用',
          content: data.shipFee || ' - - '
        },
        {
          term: '实付款',
          content: data.actualPayment || ' - - '
        }
      ]
      this.card3Cnt = [
        {
          term: '买家账号',
          content: memberList ? memberList.phone || ' - - ' : ' - - '
        },
        {
          term: '昵称',
          content: memberList ? memberList.nickName || ' - - ' : ' - - '
        },
        {
          term: '会员类型',
          content: memberList ? memberList.memberType || ' - - ' : ' - - '
        },
        {
          term: '会员等级',
          content: data ? data.memberGrade || ' - - ' : ' - - '
        }
      ]
      this.card4Cnt = [
        {
          term: '收货人',
          content: data.consignee || ' - - '
        },
        {
          term: '联系电话',
          content: data.contactNumber || ' - - '
        },
        {
          term: '收货地址',
          content: data.shippingAddress || ' - - '
        }
        // {
        //   term: '门牌号',
        //   content: data ? data.houseNumber || ' - - ' : ' - - '
        // }
      ]
      this.card5Cnt = [
        {
          term: '留言信息',
          content: data.message || ' - - '
        }
      ]
      this.formList = orderProviderListDTOs //商品信息数据
      this.providerTemplateMaps = providerTemplateMaps
      this.card6Cnt = [
        {
          term: '优惠券抵扣',
          content: ''
        },
        {
          term: '优惠券id',
          content: data.marketingDiscountCouponId || ' - - '
        },
        {
          term: '优惠金额',
          content: data.coupon - (data.welfarePayments + data.vipLowerTotal + data.memberDiscountPriceTotal) || ' - - '
          // content: data.coupon
        },
        {
          term: '优惠券名称',
          content: data.marketingDiscountCoupon ? data.marketingDiscountCoupon.name || ' - - ' : ' - - '
        },
        {
          term: '优惠券发行人',
          content: data.marketingDiscountCoupon ? data.marketingDiscountCoupon.publisher || ' - - ' : ' - - '
        },
        {
          term: '优惠券有效期',
          content: data.marketingDiscountCoupon
            ? data.marketingDiscountCoupon.startTime + '至' + data.marketingDiscountCoupon.endTime || ' - - '
            : ' - - '
        }
      ]
      this.card7Cnt = [
        {
          term: '推广人',
          content: data.promoterName || ' - - '
        },
        {
          term: '归属店铺',
          content: data.affiliationStore || ' - - '
        },
        {
          term: '销售渠道',
          content: data.distributionChannelName || ' - - '
        }
      ]
      this.card8Cnt = [
        {
          term: '福利金抵扣',
          content: ''
        },
        {
          term: '支出福利金',
          content: data.welfarePayments || ' - - '
        },

        {
          term: '优惠金额',
          content: -data.welfarePayments || ' - - '
        }
      ]
      this.card12Cnt = [
        {
          term: '免费积分',
          content: ''
        },
        {
          term: '支出积分',
          content: data.integral || ' - - '
        },

        {
          term: '优惠金额',
          content: -data.integralPrice || ' - - '
        }
      ]
      this.card9Cnt = [
        {
          term: 'vip免福利金抵扣',
          content: ''
        },
        {
          term: '会员类型',
          content: memberList.memberType || ' - - '
        },
        {
          term: '会员直降',
          content: data.vipLowerTotal || ' - - '
        }
      ]

      this.card10Cnt = [
        {
          term: '赠送福利金',
          content: ''
        },
        {
          term: '赠送内容',
          content:
            data.giveWelfarePayments && data.giveWelfarePayments > 0 ? data.giveWelfarePayments + '福利金' : ' - - '
        },
        {
          term: '赠送规则',
          content: data.giveWelfarePayments && data.giveWelfarePayments > 0 ? '确认收货7天后到账' : ' - - '
        }
      ]
      this.card11Cnt = [
        {
          term: '会员等级优惠',
          content: ''
        },
        {
          term: '会员等级',
          content: data.memberGradeContent || ' - - '
        },
        {
          term: '优惠金额',
          content: data.memberDiscountPriceTotal || ' - - '
        }
      ]
      let apiName = 'prepaidOrderTimer'
      let requestInfo = {
        orderId: data.id,
        isPlatform: '1'
      }
      if (this.reusePage == 2) {
        //待支付
        apiName = 'prepaidOrderTimer'
      } else if (this.reusePage == 4) {
        //确认收货
        apiName = 'confirmReceiptTimer'
      }

      getAction(this.url[apiName], requestInfo).then(res => {
        if (res.success) {
          let dealTime = this.getDuration(Math.floor(res.result.timer))
          this.day = dealTime.day
          this.hour = dealTime.hour
          this.second = dealTime.second
          this.minute = dealTime.minute
          this.$nextTick(() => {
            this.countDownTime = res.result.timer
          })
        }
      })
    }) //字典加载
  },
  methods: {
    getAvatarView: function(mainPicture) {
      return this.url.imgerver + '/' + mainPicture
    },
    //字典
    init(callback) {
      this.initIndex(callback)
    },
    initIndex(callback) {
      //oderCloseType关闭类型字典
      initDictOptions('oder_close_type').then(res => {
        if (res.success) {
          this.oderCloseType = res.result
          console.log('this.oderCloseType关闭类型字典', this.oderCloseType)
        }
      }),
        // oder_close_explain订单关闭原因字典
        initDictOptions('oder_close_explain').then(res => {
          if (res.success) {
            this.oderCloseExplain = res.result

            console.log('this.oderCloseExplain订单关闭原因字典', this.oderCloseExplain)
          }
        }),
        //oder_distribution 订单配送方式字典
        initDictOptions('oder_distribution').then(res => {
          if (res.success) {
            this.oderDistribution = res.result
            this.distribution = res.result
            console.log('this.oderDistribution订单关闭原因字典', this.oderDistribution)
          }
        })
      //member_type 会员类型字典
      initDictOptions('member_type').then(res => {
        if (res.success) {
          this.memberTypeDict = res.result
          console.log('this.memberTypeDict会员类型类型字典', this.memberTypeDict)
          this.$nextTick(() => {
            callback()
          })
        }
      })
      //order_type 订单类型字典
      initDictOptions('order_type').then(res => {
        if (res.success) {
          this.orderType = res.result
          console.log('this.orderType订单类型字典', this.orderType)
          this.$nextTick(() => {
            callback()
          })
        }
      })
    },
    getDuration(my_time) {
      let days = my_time / 60 / 60 / 24
      let daysRound = Math.floor(days)
      let hours = my_time / 60 / 60 - 24 * daysRound
      let hoursRound = Math.floor(hours)
      let minutes = my_time / 60 - 24 * 60 * daysRound - 60 * hoursRound
      let minutesRound = Math.floor(minutes)
      let seconds = my_time - 24 * 60 * 60 * daysRound - 60 * 60 * hoursRound - 60 * minutesRound
      let time = {
        day: daysRound,
        hour: hoursRound,
        minute: minutesRound,
        second: seconds
      }
      return time
    },
    //取消按钮
    showModalCancelInformation(orderListId) {
      console.log(orderListId)
      this.$refs.modalForm.showModalCancelInformation(orderListId)
      this.$refs.modalForm.title = '取消按钮'
      this.$refs.modalForm.disableSubmit = false
    },
    //修改地址
    showModalAddressInformation(goodListId, memberListId, consignee, contactNumber, shippingAddress) {
      console.log(goodListId, memberListId, consignee, contactNumber, shippingAddress)
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
    //审批弹窗
    showAudiModal(id) {
      this.$refs.modalForm.showAudiModal(id)
      this.$refs.modalForm.title = '审批弹窗'
      this.$refs.modalForm.disableSubmit = false
    },
    //评论内容
    showEvaluateModal(id) {
      this.$refs.modalForm.showEvaluateModal(id)
      this.$refs.modalForm.title = '评论弹窗'
      this.$refs.modalForm.disableSubmit = false
    }
  }
}
</script>
<style lang="less">
.order-details {
  width: 100%;
  color: black;

  .title {
    font-size: 20px;
    font-weight: 700;
    padding: 0 20px;
    padding-top: 25px;
    margin-bottom: 25px;
  }

  .wrap {
    margin-top: 25px;
    padding: 20px;
    box-sizing: content-box;

    .head {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      color: black;

      .term {
        font-weight: 700;
        margin-right: 15px;
      }
    }
  }

  .head-decoration {
    background: #ececec;
    font-size: 14px;
    height: 150px;

    .ant-card-body {
      height: 100% !important;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      color: black;
    }
  }

  .cnt-title {
    font-size: 20px;
    font-weight: 700;
  }
  .link-top {
    width: 100%;
    height: 1px;
    border-top: solid #e3e3e3 1px;
    margin-bottom: 20px;
  }
}
</style>
