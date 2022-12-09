<template>
  <a-modal title="上架门店"
           v-model="visible"
           :footer="null"
           :width="1200"
           @cancel="handleCancel"
  >
    <div id="cnt">
      <div class="title2">
        <div>
          门店名称：
          <a-input v-model="searchName" style="width:  200px;"/>
          <!--                商品分类：-->
          <!--                <a-select defaultValue="请选择" style="width: 120px">-->

          <!--                </a-select>-->
          <!--                <a-select defaultValue="请选择" style="width: 120px;margin-left: 20px;">-->

          <!--                </a-select>-->
          <!--                <a-select defaultValue="请选择" style="width: 120px;margin-left: 20px;">-->

          <!--                </a-select>-->
        </div>
<!--        <div v-if="popPart == '0' || popPart == '1'">-->
<!--          券id:-->
<!--          <a-input v-model="queryParam.id" style="width:  200px;">-->

<!--          </a-input>-->
<!--        </div>-->
        <!--<div v-if="popPart == '1'">
          使用人限制:
          <j-dict-select-tag placeholder="请选择状态" v-model="queryParam.getRestrict" style="width:  200px" dictCode="member_type"/>
        </div>-->
<!--        <div v-if="popPart == 1">-->
<!--          发行人：-->
<!--          <a-input v-model="queryParam.issuer" style="width: 200px;"/>-->
<!--        </div>-->
<!--        <div v-if="popPart == '0'">-->
<!--          兑换方式：-->
<!--          <a-select v-model="queryParam.certificateType" placeholder="请选择" style="width: 200px">-->
<!--            <a-select-option value="">请选择</a-select-option>-->
<!--            <a-select-option value="0">可兑换的商品全部兑换</a-select-option>-->
<!--            <a-select-option value="1">可兑换的商品任选一个</a-select-option>-->
<!--          </a-select>-->
<!--        </div>-->
        <div >
          <!--门店名称：
          <a-input v-model="searchName"/>-->
          <!--分店名称：
          <a-input/>-->
        </div>
        <!--<div >
          所属城市：
          <a-select defaultValue="请选择" style="width: 120px">

          </a-select>
          <a-select defaultValue="请选择" style="width: 120px;margin-left: 20px;">

          </a-select>
          <a-select defaultValue="请选择" style="width: 120px;margin-left: 20px;">

          </a-select>
        </div>-->

        <a-button @click="search(true)" type="primary">
          查询
        </a-button>
      </div>
      <a-table v-if="popUpColumns && popUpData" :columns="popUpColumns" :dataSource="popUpData" :loading="tableloading"
               :pagination="selectPagination"
               :rowKey="record => popPart==2?record.sysUserId:record.id"

               :scroll="{y:300,x:(popUpColumns.length + 1) * columnsWidth}"
               bordered
               style="margin-top: 20px;"
               @change="handleSelectTableChange"
      >
<!--        <template slot="goodQuantity" slot-scope="text, record, index">-->
<!--          <a @click="showExchangeGoodInformation(record.id)">{{record.goodQuantity}}</a>-->
<!--        </template>-->
<!--        <template slot="applyGood" slot-scope="text, record, index">-->
<!--          <a @click="showGoodInformation(record.id)">{{record.applyGood}}</a>-->
<!--        </template>-->
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
</template>

<script>
  const columnsWidth = 160
  const upperStoreColumns = [
    /*{
      title: '#',
      dataIndex: '#',
      width: columnsWidth,
      align: 'center'
    },*/
    {
      title: 'logo',
      dataIndex: 'logoAddr',
      scopedSlots: { customRender: 'logoAddr' },
      width: columnsWidth,
      align: 'center'
    },
    {
      title: '门店名称',
      dataIndex: 'storeName',
      width: columnsWidth,
      align: 'center'
    },
    {
      title: '分店名称',
      dataIndex: 'subStoreName',
      width: columnsWidth,
      align: 'center'
    },
    {
      title: '所属城市',
      dataIndex: 'areaAddress',
      width: columnsWidth,
      align: 'center'
    },
    {
      title: '门店地址',
      dataIndex: 'storeAddress',
      width: columnsWidth,
      align: 'center'
    },
    // {
    //   title: '操作',
    //   dataIndex: 'operation',
    //   // className: 'operation',
    //   scopedSlots: { customRender: 'operation' },
    //   align: 'center'
    // }
  ]
  import { httpAction, getAction, postAction, putAction } from '@/api/manage'
  export default {
    name: 'MarketingGiftBagBatchListShowStoreModal',
    data(){
      return{
        model:{},
        visible:false,
        searchName:'',
        popPart:2,
        selectedRowKeys:[],
        storeAllData: [],//门店所有数据
        storeSelectedRowKeys: [],
        //弹窗表头
        popUpColumns: '',
        upperStoreColumns,
        //弹窗数据
        popUpData: [],
        //查询table分页配置
        selectPagination: {
          current: 1,
          pageSize: 10,
          total: 1
        },
        queryParam: {},
        tableloading:false,
        columnsWidth,
        url:{
          //选择门店弹窗列表(传入字段 storeName)
          storePopUpList: 'marketingGiftBagStoreBatch/marketingGiftBagStoreBatch/findGiftBagStoreById',
        },
        //配置
        configure: {
          imgErver: window._CONFIG['domianURL'] + '/sys/common/view',
          fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
        }
      }
    },
    methods:{
      handleCancel(){
        this.visible = false
      },
      PopUp(index = '-1', isSearch = 'false',record) {
        // this.selectedRowKeys = []
        this.visible = true;
        this.popPart = index
        this.model = record
        // if (index == 3) {
        //   this.modalTableType = 'radio'
        // } else {
        //   this.modalTableType = 'checkbox'
        // }
        if (isSearch == 'false') {
          // this.ShowPopUp = !this.ShowPopUp
          this.searchName = ''
          // this.certificateType = ''
          this.queryParam = {}
          this.search()
        } else {
          this.search(true)
        }
      },
      handleSelectTableChange(pagination) {
        console.log(pagination)
        this.selectPagination.current = pagination.current
        this.search()
      },
      search(clickSearch = false) {
        let that = this
        if (clickSearch) {
          that.selectPagination.current = 1
        }
        // that.popPart
        let index = 2

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
            popName: '上架门店',
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
          that.tableloading = true
          let requestOptions = Object.assign({}, that.selectPagination, { pageNo: that.selectPagination.current },{pageSize:10}, { [Interface[index].searchName]: that.searchName }, that.queryParam,{id:that.model.id})
          // if (index == '0') {
          //   requestOptions = Object.assign({}, requestOptions, { certificateType: this.certificateType })
          // }
          let popUpColumns = [...that[Interface[index].columns]]
          that.popUpColumns = popUpColumns
          getAction(that.url[Interface[index].url], requestOptions).then((res) => {
            if (res.success) {
              let datas = res.result
              datas.records.map((item, index) => {
                item.key = item.id
                // item.operation = '删除'
                /*item['#'] = index + 1*/
                if (item.logoAddr) item.logoAddr = that.configure.imgErver + '/' + item.logoAddr
                return item
              })
                that.popUpData = datas.records
                // if (isSearch == 'false') {
                if (that[Interface[index].allData].length > 0) {
                  for (let item of datas.records) {
                    let canPush = true
                    for (let item2 of that[Interface[index].allData]) {
                      if (item2.id === item.id) {
                        canPush = false
                        break
                      }
                    }
                    if (canPush) {
                      that[Interface[index].allData].push(item)
                    }
                  }
                } else {
                  that[Interface[index].allData] = datas.records
                }
                // }

                that.selectPagination.total = res.result.total
                that.selectPagination.pageSize = res.result.size

                that.tableloading = false
                that.selectedRowKeys = that[Interface[index].selectedRowKeys]
                // that.popName = Interface[index].popName
                console.log(that[Interface[index].selectedRowKeys])

            }
          })
        }
      },
    },
    computed:{
      rowSelection() {
        const { selectedRowKeys } = this
        return {
          selectedRowKeys,
          onChange: this.onSelectChange,
          hideDefaultSelections: true,
          // type: this.modalTableType,
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
    }
  }
</script>

<style scoped lang="less">
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