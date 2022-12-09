<template>
  <a-modal
    :confirmLoading="confirmLoading"
    :title="title"
    :visible="visible"
    :width="1200"
    @cancel="handleCancel"
    @ok="handleOk"
    cancelText="关闭"
    class="MarketingDiscountCouponListTarraceSendCouponModel"
  >

        <a-form :form="form">
          <a-form-item label="获赠账号" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-select
              show-search
              v-decorator="[ 'memberListId', { rules: [{ required: true, message: '请输入获赠账号!' }] } ]"
              placeholder="请输入"
              style="width: 100%"
              :filter-option="false"
              :not-found-content="fetching ? undefined : null"
              @search="fetchPhone"
              @change="phoneChange"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option v-for="d in phoneList" :key="d.id" v-if="d.NAME && d.id">
                {{d.NAME}}
              </a-select-option>
            </a-select>

    <!--        <div class="datasCheck">-->
<!--            <span v-if="!phoneIsStandard">-->
<!--              手机号格式有误！请重新输入-->
<!--            </span>-->
<!--          <span v-if="phoneIsStandard && !phoneIsExistence">-->
<!--              不存在此手机号！-->
<!--            </span>-->
<!--        </div>-->

<!--        <a-input placeholder="请输入获赠账号"-->
<!--                 v-decorator="[-->
<!--          'memberListId',-->
<!--          { rules: [{ required: true, message: '请输入获赠账号!' }] },-->
<!--        ]"></a-input>-->


      </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" v-if="titleLabel == '兑换券'">
            <span slot="label">
              <span class="dataCheckedStar">
                *
              </span>
              {{titleLabel}}
            </span>
            <a-button @click="PopUp(0)">
              选择兑换券
            </a-button>
            <a-table :columns="exchangeCertificateListComumns" :dataSource="exchangeCertificateListDatas"
                     :pagination="{pageSize:5}" :scroll="{x:exchangeCertificateListComumns.length * columnsWidth}"
                     bordered
                     rowKey="id"
                     style="margin-top: 20px;">
              <template slot="goodQuantity" slot-scope="text, record, index">
                <a @click="showExchangeGoodInformation(record.id)">{{record.goodQuantity}}</a>
              </template>
              <template slot="certificateType" slot-scope="text, record, index">
                <div v-if="record.certificateType == 1">
                  可兑换的商品任选一个
                </div>
                <div v-else>
                  可兑换的商品全部兑换
                </div>
              </template>
              <template slot="distributedAmount" slot-scope="text, record, index">
                <a-input-number
                  :min="1"
                  :precision="0"
                  @change="e => certificateHandleChange(e, record.id, 'distributedAmount','exchangeCertificateListDatas')"
                  v-model="record.distributedAmount"></a-input-number>
              </template>
              <template slot="operation" slot-scope="text, record">
                <a-popconfirm
                  @confirm="() => onDelete(record.id,0)"
                  title="确定要删除吗?"
                  v-if="exchangeCertificateListDatas.length"
                >
                  <a href="javascript:;">删除</a>
                </a-popconfirm>
              </template>
              <template slot="validityType" slot-scope="text, record, index">
                <a-select v-model="record.validityType * 1"
                          @change="value => certificateHandleChange(value, record.id, 'validityType','exchangeCertificateListDatas')"
                          v-if="record.distributedAmount > 1"
                          style="width: 120px">
                  <a-select-option :value="0">连续有效期</a-select-option>
                  <a-select-option :value="1">相同有效期</a-select-option>
                </a-select>
                <div v-else>
                  相同有效期
                </div>
              </template>
            </a-table>
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" v-if="titleLabel == '优惠券'">
            <span slot="label">
              <span class="dataCheckedStar">
                *
              </span>
              {{titleLabel}}
            </span>
            <a-button @click="PopUp(1)">
              选择优惠券
            </a-button>
            <a-table :columns="couponListColumns" :dataSource="couponListData" :pagination="{pageSize:5}"
                     :scroll="{x:couponListColumns.length * columnsWidth}"
                     bordered
                     rowKey="id"
                     style="margin-top: 20px;">
              <template slot="applyGood" slot-scope="text, record, index">
                <a @click="showGoodInformation(record.id)">{{record.applyGood}}</a>
              </template>
              <template slot="distributedAmount" slot-scope="text, record, index">
                <a-input-number
                  :min="1"
                  :precision="0"
                  @change="e => certificateHandleChange(e, record.id, 'distributedAmount','couponListData')"
                  v-model="record.distributedAmount"></a-input-number>
              </template>
              <template slot="operation" slot-scope="text, record">
                <a-popconfirm
                  @confirm="() => onDelete(record.id,1)"
                  title="确定要删除吗?"
                  v-if="couponListData.length"
                >
                  <a href="javascript:;">删除</a>
                </a-popconfirm>
              </template>
              <template slot="validityType" slot-scope="text, record, index">
                <a-select v-model="record.validityType * 1"
                          @change="value => certificateHandleChange(value, record.id, 'validityType','couponListData')"
                          style="width: 120px"
                          v-if="record.distributedAmount > 1"
                >
                  <a-select-option :value="0">连续有效期</a-select-option>
                  <a-select-option :value="1">相同有效期</a-select-option>
                </a-select>
                <div v-else>
                  相同有效期
                </div>
              </template>
            </a-table>
          </a-form-item>
<!--      <a-form-item :label="titleLabel" :label-col="labelCol" :wrapper-col="wrapperCol" >-->
<!--        <a-select-->
<!--          labelInValue-->
<!--          style="width: 120px"-->
<!--          v-decorator="[-->
<!--          'marketingDiscountId',-->
<!--          { rules: [{ required: true, message: '请选择' + titleLabel + '!' }] },-->
<!--        ]"-->
<!--          v-if="titleLabel == '优惠券'"-->
<!--        >-->
<!--          <a-select-option value="jack">请选择</a-select-option>-->
<!--          <a-select-option value="jack">Jack (100)</a-select-option>-->
<!--          <a-select-option value="lucy">Lucy (101)</a-select-option>-->
<!--        </a-select>-->

<!--        <a-select-->
<!--          labelInValue-->
<!--          style="width: 120px"-->
<!--          v-decorator="[-->
<!--          'marketingCertificateId',-->
<!--          { rules: [{ required: true, message: '请选择' + titleLabel + '!' }] },-->
<!--        ]"-->
<!--          v-else-->
<!--        >-->
<!--          <a-select-option value="jack">请选择</a-select-option>-->
<!--          <a-select-option value="jack">Jack (100)</a-select-option>-->
<!--          <a-select-option value="lucy">Lucy (101)</a-select-option>-->
<!--        </a-select>-->
<!--      </a-form-item>-->

<!--      <a-form-item label="赠送数量" :label-col="labelCol" :wrapper-col="wrapperCol">-->
<!--        <a-input-number placeholder="请输入赠送数量"-->
<!--                        v-decorator="['quantity',{ rules: [{ required: true, message: '请输入赠送数量!' }] },]"-->
<!--                        :min="1"-->
<!--                        :precision="0"-->
<!--                        style="width: 150px"-->
<!--        ></a-input-number>-->
<!--      </a-form-item>-->
      <a-form-item label="赠送说明" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-textarea :rows="4" placeholder="赠送说明" v-decorator="[
          'giveExplain',
          { rules: [{ required: true, message: '请输入赠送说明!' }] },
        ]"/>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false">
        <div slot="label">

        </div>
        <a-checkbox v-model="isSure">我确认以上信息无误。</a-checkbox>

      </a-form-item>

    </a-form>
    <a-modal
      :title="'选择' + popName"
      :visible="ShowPopUp"
      :width="1200"
      @ok="selectLineData"
      @cancel="PopUp"
    >
      <div id="cnt">
        <div class="title2">
          <div>
            {{popName}}名称：
            <a-input v-model="searchName" style="width: 200px;"/>
            <!--                商品分类：-->
            <!--                <a-select defaultValue="请选择" style="width: 120px">-->

            <!--                </a-select>-->
            <!--                <a-select defaultValue="请选择" style="width: 120px;margin-left: 20px;">-->

            <!--                </a-select>-->
            <!--                <a-select defaultValue="请选择" style="width: 120px;margin-left: 20px;">-->

            <!--                </a-select>-->
          </div>
          <div v-if="popPart == '0' || popPart == '1'">
            券id:
            <a-input v-model="queryParam.id"  style="width: 200px;">

            </a-input>
          </div>
          <!--<div v-if="popPart == '1'">
            使用人限制:
            <j-dict-select-tag placeholder="请选择状态" v-model="queryParam.getRestrict" style="width: 200px" dictCode="member_type"/>
          </div>-->
          <div v-if="popPart == 1">
            发行人：
            <a-input v-model="queryParam.issuer"  style="width: 200px;"/>
          </div>
          <div v-if="popPart == '0'">
            兑换方式：
            <a-select v-model="queryParam.certificateType" placeholder="请选择" style="width: 200px">
              <a-select-option value="">请选择</a-select-option>
              <a-select-option value="0">可兑换的商品全部兑换</a-select-option>
              <a-select-option value="1">可兑换的商品任选一个</a-select-option>
            </a-select>
          </div>
          <div v-if="popPart == 2">
            <!--门店名称：
            <a-input v-model="searchName"/>-->
            <!--分店名称：
            <a-input/>-->
          </div>
          <!--<div v-if="popPart == 2">
            所属城市：
            <a-select defaultValue="请选择" style="width: 120px">

            </a-select>
            <a-select defaultValue="请选择" style="width: 120px;margin-left: 20px;">

            </a-select>
            <a-select defaultValue="请选择" style="width: 120px;margin-left: 20px;">

            </a-select>
          </div>-->

          <a-button @click="PopUp(popPart,'true')" type="primary">
            查询
          </a-button>
        </div>
        <a-table :columns="popUpColumns" :dataSource="popUpData" :loading="tableloading"
                 :pagination="selectPagination"
                 :rowKey="record => popPart==2?record.sysUserId:record.id"
                 :rowSelection="rowSelection"
                 :scroll="{y:300,x:(popUpColumns.length + 1) * columnsWidth}"
                 bordered
                 style="margin-top: 20px;"
                 @change="handleSelectTableChange"
        >
          <template slot="goodQuantity" slot-scope="text, record, index">
            <a @click="showExchangeGoodInformation(record.id)">{{record.goodQuantity}}</a>
          </template>
          <template slot="applyGood" slot-scope="text, record, index">
            <a @click="showGoodInformation(record.id)">{{record.applyGood}}</a>
          </template>
          <template slot="logoAddr" slot-scope="text">
            <img :src="text" alt="" style="width: 40px;height: 40px;">
          </template>
          <template slot="distributedAmount" slot-scope="text">
            - -
          </template>
          <template slot="validityType" slot-scope="text">
            - -
          </template>
          <template slot="operation" slot-scope="text">
            - -
          </template>

        </a-table>
      </div>
    </a-modal>

    <AppMarketingCertificateGoodModal ref="AppMarketingCertificateGoodModal"></AppMarketingCertificateGoodModal>
    <AppMarketingGoodModal ref="AppMarketingGoodModal"></AppMarketingGoodModal>
  </a-modal>
</template>

<script>
  const columnsWidth = 160
  import { getAction, postAction, putAction, deleteAction } from '@/api/manage'
  import debounce from 'lodash/debounce';
  const exchangeCertificateListComumns = [
    /*{
      title: '#',
      dataIndex: '#',
      width: columnsWidth,
      align: 'center'
    },*/
    {
      title: '兑换券id',
      dataIndex: 'id',
      width: columnsWidth,
      align: 'center'
    },
    {
      title: '兑换券名称',
      dataIndex: 'name',
      width: columnsWidth,
      align: 'center'
    },
    {
      title: '用券时间',
      dataIndex: 'usrTime',
      width: columnsWidth,
      align: 'center'
    },
    {
      title: '兑换商品',
      dataIndex: 'goodQuantity',
      scopedSlots: { customRender: 'goodQuantity' },
      width: columnsWidth,
      align: 'center'
    }, {
      title: '兑换方式',
      dataIndex: 'certificateType',
      width: columnsWidth,
      align: 'center',
      scopedSlots: { customRender: 'certificateType' }
    },
    {
      title: '使用人限制',
      dataIndex: 'memberTypeName',
      width: columnsWidth,
      align: 'center'
    }, {
      title: '券剩余发行量',
      dataIndex: 'discountSurplus',
      width: columnsWidth,
      align: 'center'
    }, {
      title: '核销门店',
      dataIndex: 'storeQuantity',
      width: columnsWidth,
      align: 'center'
    }, {
      title: '核销奖励',
      dataIndex: 'theReward',
      width: columnsWidth,
      align: 'center'
    }, {
      title: '发放数量',
      dataIndex: 'distributedAmount',
      scopedSlots: { customRender: 'distributedAmount' },
      width: columnsWidth,
      align: 'center'
    }, {
      title: '有效期控制',
      dataIndex: 'validityType',
      scopedSlots: { customRender: 'validityType' },
      width: columnsWidth,
      align: 'center'
    }, {
      title: '操作',
      dataIndex: 'operation',
      // className: 'operation',
      scopedSlots: { customRender: 'operation' },
      align: 'center'
    }
  ]
  const couponListColumns = [
    /*{
      title: '#',
      dataIndex: '#',
      width: columnsWidth,
      align: 'center'
    },*/
    {
      title: '优惠券id',
      dataIndex: 'id',
      width: columnsWidth,
      align: 'center'
    },
    {
      title: '优惠券名称',
      dataIndex: 'name',
      width: columnsWidth,
      align: 'center'
    },
    {
      title: '使用门槛',
      dataIndex: 'usingThreshold',
      width: columnsWidth,
      align: 'center'
    },
    {
      title: '优惠内容',
      dataIndex: 'preferentialContent',
      width: columnsWidth,
      align: 'center'
    },
    {
      title: '用券时间',
      dataIndex: 'usrTime',
      width: columnsWidth,
      align: 'center'
    }, {
      title: '适用商品',
      dataIndex: 'applyGood',
      scopedSlots: { customRender: 'applyGood' },
      width: columnsWidth,
      align: 'center'
    }, {
      title: '使用人限制',
      dataIndex: 'memberTypeName',
      width: columnsWidth,
      align: 'center'
    }, {
      title: '发行人',
      dataIndex: 'issuer',
      width: columnsWidth,
      align: 'center'
    }, {
      title: '券剩余发行量',
      dataIndex: 'discountSurplus',
      width: columnsWidth,
      align: 'center'
    }, {
      title: '发放数量',
      dataIndex: 'distributedAmount',
      scopedSlots: { customRender: 'distributedAmount' },
      width: columnsWidth,
      align: 'center'
    }, {
      title: '有效期控制',
      dataIndex: 'validityType',
      scopedSlots: { customRender: 'validityType' },
      width: columnsWidth,
      align: 'center'
    }, {
      title: '操作',
      dataIndex: 'operation',
      className: 'operation',
      scopedSlots: { customRender: 'operation' },
      align: 'center'
    }
  ]
  import AppMarketingCertificateGoodModal from './AppMarketingCertificateGoodModal'
  import AppMarketingGoodModal from './AppMarketingGoodModal'
  export default {
    name: 'MarketingDiscountCouponListTarraceSendCouponModel',
    data() {
      this.lastFetchId = 0;
      this.fetchPhone = debounce(this.fetchPhone, 800);
      return {
        form: this.$form.createForm(this),
        fetching: false,
        phoneList:[],//手机号模糊查询
        labelCol: { span: 2 },
        wrapperCol: { span: 22 },
        queryParam:{},
        tableloading:false,
        confirmLoading: false,
        modalTableType: 'checkbox',
        ShowPopUp: false,
        title: '',
        visible: false,
        isSure:false,
        titleLabel:'优惠券',
        // certificateType: '',
        searchName: '',//查询内容
        columnsWidth,
        exchangeCertificateListComumns,
        couponListColumns,
        //优惠券列表数据
        couponListData: [],
        //兑换券列表数据
        exchangeCertificateListDatas: [],
        discoountAllData: [],//选择优惠券所有数据
        certificateAllData: [],//选择兑换券所有数据
        //弹窗名称
        popName: '',
        //弹窗表头
        popUpColumns: [],
        //弹窗数据
        popUpData:[],
        popPart: 1,
        selectedRowKeys: [], // Check here to configure the default column
        certificateSelectedRowKeys: [],
        discountRowKeys: [],
        //查询table分页配置
        selectPagination: {
          current: 1,
          pageSize: 10,
          total: 1
        },
        AllData:{
         certificateIds: '',//选择兑换券ids
         discountIds: '',//选择优惠券  ids
        },
        url:{
          //送兑换券
          giveMarketingCertificate:"marketingCertificateRecord/marketingCertificateRecord/giveMarketingCertificate",
          //送优惠券
          giveMarketingDiscount:"marketingDiscountCoupon/marketingDiscountCoupon/giveMarketingDiscount",
          //校验手机号码接口 (通过手机号码获取会员信息)
          likeMemberByPhone: "/memberList/memberList/likeMemberByPhone",//校验手机号码接口 (通过手机号码获取会员信息)
          //选择兑换券弹窗列表(传入字段 certificateName(券名称),id(券id),certificateType(兑换方式；0：全部兑换；1：任选一个))
          exchangeCertificatePopUpList: '/marketingCertificate/marketingCertificate/findGiveMarketingCertificateVO',
          //选择优惠券弹窗列表(传入字段 discoountName(券名称),id(券id),getRestrict(使用人限制:0 普通会员 1:vip),issuer(发行人))
          CouponPopupList: '/marketingDiscount/marketingDiscount/findGiveMarketingDiscountVO',
        },
        //配置
        configure: {
          imgErver: window._CONFIG['domianURL'] + '/sys/common/view',
          fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
        }
      }
    },
    computed:{
      rowSelection() {
        const { selectedRowKeys } = this
        return {
          selectedRowKeys,
          onChange: this.onSelectChange,
          hideDefaultSelections: true,
          type: this.modalTableType,
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
      }
    },
    components:{
      AppMarketingCertificateGoodModal,
      AppMarketingGoodModal
    },
    methods: {
      //适用商品弹窗(兑换券)
      showExchangeGoodInformation(id){
        this.$refs.AppMarketingCertificateGoodModal.showModalVisible(id);
      },
      //适用商品弹窗（优惠券）
      showGoodInformation(id){
        this.$refs.AppMarketingGoodModal.showModalVisible(id);
      },
      handleCancel() {
        this.visible = false
      },
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys
      },
      handleSelectTableChange(pagination) {
        console.log(pagination)
        this.selectPagination.current = pagination.current
        this.search()
      },
      //选择确定弹窗
      selectLineData() {
        let ids = this.selectedRowKeys,
          sz = []
        let attributeName = [
          {
            ids: 'certificateIds',
            data: 'exchangeCertificateListDatas',
            selectedRowKeys: 'certificateSelectedRowKeys',
            allData: 'certificateAllData'
          }, {
            ids: 'discountIds',
            data: 'couponListData',
            selectedRowKeys: 'discountRowKeys',
            allData: 'discoountAllData'
          }, {
            ids: 'storeIds',
            data: 'upperStoreDatas',
            selectedRowKeys: 'storeSelectedRowKeys',
            allData: 'storeAllData'
          }, {
            ids: 'giftBagIds',
            data: 'giftBagData',
            selectedRowKeys: 'giftBagSelectedRowKeys',
            allData: 'giftBagAllData'
          }
        ]

        for (let item of ids) {
          for (let item2 of this[attributeName[this.popPart].allData]) {
            if (item == (this.popPart == 2 ? item2.sysUserId : item2.id)) {
              item2.operation = '删除'
              item2.validityType = 1
              item2.distributedAmount = 1
              sz.push(item2)
            }
          }
        }
        if (this.popPart == 2) {
          this.AllData[attributeName[this.popPart].ids] = ids.join(',')
        }
        console.log(sz)
        this[attributeName[this.popPart].data] = sz
        this[attributeName[this.popPart].selectedRowKeys] = ids
        this.$nextTick(() => {
          this.selectedRowKeys = []
        })
        this.PopUp()
      },
      onDelete(id, index) {
        let that = this
        let attributeName = [
          //兑换券
          {
            ids: 'certificateIds',
            data: 'exchangeCertificateListDatas',
            selectedRowKeys: 'certificateSelectedRowKeys'
          }, {
            //优惠券
            ids: 'discountIds',
            data: 'couponListData',
            selectedRowKeys: 'discountRowKeys'
          }, {
            //门店
            ids: 'storeIds',
            data: 'upperStoreDatas',
            selectedRowKeys: 'storeSelectedRowKeys'
          }, {
            //礼包
            ids: 'giftBagIds',
            data: 'giftBagData',
            selectedRowKeys: 'giftBagSelectedRowKeys'
          }
        ]
        //.....
        const dataSource = [...this[attributeName[index].data]]
        const selectedRowKeys = [...this[attributeName[index].selectedRowKeys]]
        this[attributeName[index].selectedRowKeys] = selectedRowKeys.filter(item => item !== id)
        this[attributeName[index].data] = dataSource.filter(item => (index == 2 ? item.sysUserId : item.id) !== id)
      },
      PopUp(index = '-1', isSearch = 'false') {
        // this.selectedRowKeys = []
        this.popPart = index
        if (index == 3) {
          this.modalTableType = 'radio'
        } else {
          this.modalTableType = 'checkbox'
        }
        if (isSearch == 'false') {
          this.ShowPopUp = !this.ShowPopUp
          this.searchName = ''
          // this.certificateType = ''
          this.queryParam = {

          }
          this.search()
        } else {
          this.search(true)
        }
      },
      search(clickSearch = false) {
        if (clickSearch) {
          this.selectPagination.current = 1
        }
        let index = this.popPart
        let that = this
        let Interface = [
          {
            columns: 'exchangeCertificateListComumns',
            url: 'exchangeCertificatePopUpList',
            selectedRowKeys: 'certificateSelectedRowKeys',
            popName: '兑换券',
            searchName: 'certificateName',
            allData: 'certificateAllData'
          }, {
            columns: 'couponListColumns',
            url: 'CouponPopupList',
            selectedRowKeys: 'discountRowKeys',
            popName: '优惠券',
            searchName: 'discoountName',
            allData: 'discoountAllData'
          }, {
            columns: 'upperStoreColumns',
            url: 'storePopUpList',
            selectedRowKeys: 'storeSelectedRowKeys',
            popName: '门店',
            searchName: 'storeName',
            allData: 'storeAllData'
          }, {
            // giftBagColumns
            columns: 'giftBagColumns',
            url: 'isPrepositionList',
            selectedRowKeys: 'giftBagSelectedRowKeys',
            popName: '礼包',
            searchName: 'giftBagName',
            allData: 'giftBagAllData'
          }
        ]
        if (index != '-1') {
          this.tableloading = true
          let requestOptions = Object.assign({}, this.selectPagination, { pageNo: this.selectPagination.current }, { [Interface[index].searchName]: this.searchName },this.queryParam)
          // if (index == '0') {
          //   requestOptions = Object.assign({}, requestOptions, { certificateType: this.certificateType })
          // }
          getAction(that.url[Interface[index].url], requestOptions).then((res) => {
            if (res.success) {
              let datas = res.result
              let popUpColumns = [...this[Interface[index].columns]]
              datas.records.map((item, index) => {
                item.key = item.id
                // item.operation = '删除'
                /*item['#'] = index + 1*/
                if (item.logoAddr) item.logoAddr = that.configure.imgErver + '/' + item.logoAddr
                return item
              })
              if(index == 0 || index == 1){
                delete popUpColumns[popUpColumns.length - 1]
                delete popUpColumns[popUpColumns.length - 2]
                delete popUpColumns[popUpColumns.length - 3]
              }
              this.popUpColumns = popUpColumns
              this.$nextTick(() => {
                this.popUpData = datas.records
                // if (isSearch == 'false') {
                if (this[Interface[index].allData].length > 0) {
                  for (let item of datas.records) {
                    let canPush = true
                    for (let item2 of this[Interface[index].allData]) {
                      if (item2.id === item.id) {
                        canPush = false
                        break
                      }
                    }
                    if (canPush) {
                      this[Interface[index].allData].push(item)
                    }
                  }
                } else {
                  this[Interface[index].allData] = datas.records
                }
                this.selectPagination.total = res.result.total
                this.selectPagination.pageSize = res.result.size

                this.tableloading = false
                this.selectedRowKeys = this[Interface[index].selectedRowKeys]
                this.popName = Interface[index].popName
                console.log(this[Interface[index].selectedRowKeys])
              })
            }
          })
        }
      },
      certificateHandleChange(value, key, column, dataSource) {
        const newData = [...this[dataSource]]
        const target = newData.filter(item => key === item.id)[0]
        if (target) {
          target[column] = value
          if(column == 'distributedAmount' && value <= 1){
            target.validityType = 1
          }
          this[dataSource] = newData
        }
      },
      //获取手机号
      phoneChange(id){
        if(id){
          this.form.setFieldsValue({memberListId:id})
          // if(this.visiblwelfarePaymentsProInformation){
          //   this.tarrace.id = id
          // }
          // if(this.visiblwelfarePaymentsInformation){
          //   this.dataAll.id = id
          // }
        }
      },
      fetchPhone(phone) {
        let apiName = this.url.likeMemberByPhone;
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.data = [];
        this.fetching = true;
        let formData = {
          phone,
          // userType:this.tarrace.userType
        }
        getAction(apiName, formData).then((res) => {
          if (fetchId !== this.lastFetchId) {
            // for fetch callback order
            return;
          }
          // this.phoneIsExistence = res
          this.phoneList = res
          this.fetching = false;
        })
      },
      handleOk() {
        // if(!this.isSure){
        //   this.$message.warn('请确认信息无误！');
        //   return;
        // }

        this.form.validateFields((err, values) => {
          if (!err) {
            let requestUrl
            if(this.titleLabel == '优惠券'){
              if(!this.couponListData || (this.couponListData && this.couponListData.length <= 0)){
                this.$message.warn('请至少选择一张优惠券！')
                return;
              }
              requestUrl = this.url.giveMarketingDiscount
              values.marketingGiftBagDiscountList = this.toSubmitList()
            }else{
              if(!this.exchangeCertificateListDatas || (this.exchangeCertificateListDatas && this.exchangeCertificateListDatas.length <= 0)){
                this.$message.warn('请至少选择一张兑换券！')
                return;
              }
              requestUrl = this.url.giveMarketingCertificate
              values.marketingGiftBagCertificateList = this.toSubmitList()
            }
            if(!this.isSure){
              this.$message.warn('请确认信息无误！')
              return;
            }
            console.log(values);
            this.confirmLoading = true;
            postAction(requestUrl,values).then(res=>{
              this.confirmLoading = false;
              if(res.success){
                this.$message.success(res.message || '赠送成功！')
                this.$emit('success')
                this.handleCancel();
              }else{
                this.$message.warn(res.message || '赠送失败!')
              }
            })
          }
        })
      },
      toSubmitList(){
        let list = [],
           analysisList,
          analysisIdName;
        if(this.titleLabel == '优惠券'){
          analysisList = this.couponListData
          analysisIdName = 'marketingDiscountId'
        }else{
          analysisList = this.exchangeCertificateListDatas
          analysisIdName = 'marketingCertificateId'
        }
        for(let item of analysisList){
          list.push({
            [analysisIdName]:item.id,
            distributedAmount:item.distributedAmount,
            validityType:item.validityType
          })
        }
        return list
      },
      open(value) {
        this.visible = true
        this.title = value.modalTitle
        if(value.modalTitle == '送优惠券'){
          this.titleLabel = '优惠券'
        }else{
          this.titleLabel = '兑换券'
        }
        this.form.resetFields();
        this.isSure = false
        this.phoneList = [];
        this.couponListData = []
        this.exchangeCertificateListDatas =[]
      }
    }
  }
</script>

<style lang="scss" scoped>
  #cnt {
  input {
    width: 120px;
  }

  .title2 {
    display: flex;
    justify-content: space-between;
  }

  .info {
    margin-top: 15px;
    float: right;
    min-width: 250px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  }
</style>