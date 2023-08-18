<template>
  <a-modal
    :confirmLoading="confirmLoading"
    :title="title"
    :visible="visible"
    :width="1200"
    @cancel="handleCancel"
    @ok="handleOk"
    cancelText="关闭"
    class="MarketingStoreGiftCardMemberListListSendCouponModel"
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
              <a-select-option v-for="d in phoneList" :key="d.id" v-show="d.NAME && d.id">
                {{d.NAME}}
              </a-select-option>
            </a-select>
      </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" v-if="titleLabel == '礼品卡'">
            <span slot="label">
              <span class="dataCheckedStar">
                *
              </span>
              {{titleLabel}}
            </span>
            <a-button @click="PopUp(1)">
              选择礼品卡
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
              <template slot="status" slot-scope="text">
                <div v-if="text == 0">已失效</div>
                <div v-if="text == 1">可使用</div>
                <div v-if="text == 2">已赠送</div>
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
            </a-table>
          </a-form-item>

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
            {{popName}}编号：
            <a-input v-model="searchName" style="width: 200px;"/>
          </div>
          <div v-if="popPart == '0' || popPart == '1'">
            卡名称:
            <a-input v-model="queryParam.carName"  style="width: 200px;">

            </a-input>
          </div>
          <div v-if="popPart == 1">
            发行店铺:
            <a-input v-model="queryParam.storeName"  style="width: 200px;"/>
          </div>
          
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
          <template slot="status" slot-scope="text">
            <div v-if="text == 0">已失效</div>
            <div v-if="text == 1">可使用</div>
            <div v-if="text == 2">已赠送</div>
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
 
  const couponListColumns = [
    /*{
      title: '#',
      dataIndex: '#',
      width: columnsWidth,
      align: 'center'
    },*/
    {
      title: '礼品卡编号',
      dataIndex: 'serialNumber',
      width: columnsWidth,
      align: 'center'
    },
    {
      title: '卡名称',
      dataIndex: 'carName',
      width: columnsWidth,
      align: 'center'
    },
    {
      title: '面额',
      dataIndex: 'denomination',
      width: columnsWidth,
      align: 'center'
    },
    {
      title: '可选商品',
      dataIndex: 'goodCount',
      width: columnsWidth,
      align: 'center'
    },
    {
      title: '赠送数量',
      dataIndex: 'distributedAmount',
      scopedSlots: { customRender: 'distributedAmount' },
      width: columnsWidth,
      align: 'center'
    },
    {
      title: '有效期开始',
      dataIndex: 'startTime',
      width: columnsWidth,
      align: 'center'
    }, {
      title: '有效期结束',
      dataIndex: 'endTime',
      width: columnsWidth,
      align: 'center'
    }, {
      title: '发行店铺',
      align: 'center',
      dataIndex: 'storeName',
      width: columnsWidth,
    },{
      title: '状态',
      dataIndex: 'status',
      width: columnsWidth,
      scopedSlots: { customRender: 'status' },
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
    name: 'MarketingStoreGiftCardMemberListListSendCouponModel',
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
        titleLabel:'礼品卡',
        // certificateType: '',
        searchName: '',//查询内容
        columnsWidth,
        couponListColumns,
        //礼品卡列表数据
        couponListData: [],
        //兑换券列表数据
        exchangeCertificateListDatas: [],
        discoountAllData: [],//选择礼品卡所有数据
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
         discountIds: '',//选择礼品卡  ids
        },
        url:{
          
          //送礼品卡
          giveMarketingDiscount:"marketing/marketingStoreGiftCardMemberList/give",
          //校验手机号码接口 (通过手机号码获取会员信息)
          likeMemberByPhone: "/memberList/memberList/likeMemberByPhone",//校验手机号码接口 (通过手机号码获取会员信息)
          //选择兑换券弹窗列表(传入字段 certificateName(券名称),id(券id),certificateType(兑换方式；0：全部兑换；1：任选一个))
          exchangeCertificatePopUpList: '/marketingCertificate/marketingCertificate/findGiveMarketingCertificateVO',
          //选择礼品卡弹窗列表(传入字段 discoountName(券名称),id(券id),getRestrict(使用人限制:0 普通会员 1:vip),issuer(发行人))
          CouponPopupList: 'marketing/marketingStoreGiftCardList/list',
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
      //适用商品弹窗（礼品卡）
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
            //礼品卡
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
            status: 1,
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
            popName: '礼品卡',
            searchName: 'serialNumber',
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
                delete popUpColumns[4]
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
            if(this.titleLabel == '礼品卡'){
              if(!this.couponListData || (this.couponListData && this.couponListData.length <= 0)){
                this.$message.warn('请至少选择一张礼品卡！')
                return;
              }
              requestUrl = this.url.giveMarketingDiscount
              values.marketingStoreGiftCardList = this.toSubmitList()
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
        if(this.titleLabel == '礼品卡'){
          analysisList = this.couponListData
          analysisIdName = 'marketingStoreGiftCardListId'
        }else{
          analysisList = this.exchangeCertificateListDatas
          analysisIdName = 'marketingCertificateId'
        }
        for(let item of analysisList){
          list.push({
            [analysisIdName]:item.id,
            distributedAmount:item.distributedAmount,
          })
        }
        return list
      },
      open(value) {
        console.log('=open==============',value);
        this.visible = true
        this.title = value.modalTitle
        if(value.modalTitle == '赠送送礼品卡'){
          this.titleLabel = '礼品卡'
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