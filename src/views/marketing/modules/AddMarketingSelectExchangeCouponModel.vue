<template>
  <a-modal
    :title="title"
    :width="1200"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <div class="operation">
        <div>
          兑换券id：
          <a-input v-model="querySearch.id"/>
        </div>
        <div>
          兑换券名称：
          <a-input v-model="querySearch.searchName"/>
        </div>
<!--        <div>-->
<!--          兑换商品：-->
<!--          <a-input v-model="querySearch.store"/>-->
<!--        </div>-->
        <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
      </div>
      <a-table :columns="exchangeCertificateListComumns" :dataSource="popUpData" :loading="tableloading"
               :pagination="selectPagination"
               :rowKey="record => popPart==2?record.sysUserId:record.id"
               :rowSelection="rowSelection"
               :scroll="{y:300,x:(exchangeCertificateListComumns.length + 1) * columnsWidth}"
               bordered
               style="margin-top: 20px;"
               @change="handleSelectTableChange"
      >
<!--        <template slot="logoAddr" slot-scope="text">-->
<!--          <img preview="1" :src="text" alt="" style="width: 40px;height: 40px;">-->
<!--        </template>-->
        <!--        <template slot="distributedAmount" slot-scope="text">-->
        <!--          - - -->
        <!--        </template>-->
        <!--        <template slot="validityType" slot-scope="text">-->
        <!--          - - -->
        <!--        </template>-->
        <!--        <template slot="operation" slot-scope="text">-->
        <!--          - - -->
        <!--        </template>-->

      </a-table>
    </a-spin>
  </a-modal>
</template>

<script>

  const columnsWidth = 160
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
      width: columnsWidth,
      align: 'center'
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
    }
  ]
  import { httpAction, getAction, postAction, putAction } from '@/api/manage'
  export default {
    name: 'AddMarketingSelectExchangeCouponModel',
    data() {
      return {
        title: '选择兑换券',
        visible: false,
        columnsWidth,
        querySearch: {
          searchName: '',
          id: '',
          store: ''
        },
        //查询table分页配置
        selectPagination: {
          current: 1,
          pageSize: 10,
          total: 1
        },
        //弹窗表头
        popUpColumns: '',
        //弹窗数据
        popUpData: [],
        //弹窗名称
        // popName: '',
        popPart: 0,
        //弹窗表格加载
        tableloading: false,
        // model: {},
        // labelCol: {
        //   xs: { span: 24 },
        //   sm: { span: 5 },
        // },
        // wrapperCol: {
        //   xs: { span: 24 },
        //   sm: { span: 16 },
        // },
        confirmLoading: false,
        //兑换券列表表头
        exchangeCertificateListComumns,
        //兑换券列表数据
        exchangeCertificateListDatas: [],
        certificateSelectedRowKeys: [],
        certificateAllData: '',//选择兑换券所有数据
        selectedRowKeys: [],
        url: {
          //选择兑换券弹窗列表(传入字段 certificateName )
          exchangeCertificatePopUpList: '/marketingCertificate/marketingCertificate/findCertificate',
          //兑换券返显
          findCertificateById: '/marketingGiftBag/marketingGiftBag/findCertificateById'
        }

      }
    },
    computed: {
      rowSelection() {
        const { selectedRowKeys } = this
        return {
          selectedRowKeys,
          type:'radio',
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
      }
    },
    methods: {
      //选择确定弹窗
      handleOk() {
        if( !this.selectedRowKeys ||  this.selectedRowKeys.length <= 0){
          this.$message.warn('请先选择！');
          return;
        }
        let ids = this.selectedRowKeys,
          sz = []
        let attributeName = [
          {
            ids: 'certificateIds',
            data: 'exchangeCertificateListDatas',
            selectedRowKeys: 'certificateSelectedRowKeys',
            allData:'certificateAllData'
          }, {
            ids: 'discountIds',
            data: 'couponListData',
            selectedRowKeys: 'discountRowKeys',
            allData:'discoountAllData'
          }, {
            ids: 'storeIds',
            data: 'upperStoreDatas',
            selectedRowKeys: 'storeSelectedRowKeys',
            allData:'storeAllData'
          }
        ]
        for (let item of ids) {
          for (let item2 of this[attributeName[this.popPart].allData]) {
            if (item == (this.popPart == 2 ? item2.sysUserId : item2.id)) {
              // item2.operation = '删除'
              // item2.validityType = 0
              // item2.distributedAmount = 1
              sz.push(item2)
            }
          }
        }

        // if (this.popPart == 2) {
        //   this.AllData[attributeName[this.popPart].ids] = ids.join(',')
        // }
        // console.log(sz)
        // this[attributeName[this.popPart].data] = sz
        // this[attributeName[this.popPart].selectedRowKeys] = ids
        this.$emit('handleOk',sz)
        this.$nextTick(() => {
          this.selectedRowKeys = []
        })
        this.handleCancel();
      },
      searchQuery() {
        this.search(true)
      },
      handleCancel() {
        this.close()
      },
      close() {
        this.$emit('close')
        this.visible = false
        this.selectPagination.current = 1
      },
      open(key = '') {
        this.visible = true
        if(key){
          this.certificateSelectedRowKeys = [key]
        }else{
          this.certificateSelectedRowKeys = []
        }
        console.log(key)
        this.search()
      },
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys
        console.log(selectedRowKeys)
      },
      handleSelectTableChange(pagination) {
        console.log(pagination)
        this.selectPagination.current = pagination.current
        this.search()
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
          }
        ]
        if (index != '-1') {
          this.tableloading = true
          // this.popUpColumns = this[Interface[index].columns]
          let requestOptions = Object.assign({}, this.selectPagination, { pageNo: this.selectPagination.current }, { [Interface[index].searchName]: this.querySearch.searchName },this.querySearch)
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
              // this.$nextTick(() => {
              this.popUpData = datas.records
              // if (!clickSearch) {
              //   if (this[Interface[index].allData].length > 0) {
              //     for (let item of datas.records) {
              //       let canPush = true
              //       for (let item2 of this[Interface[index].allData]) {
              //         if (item2.id === item.id) {
              //           canPush = false
              //           break
              //         }
              //       }
              //       if (canPush) {
              //         this[Interface[index].allData].push(item)
              //       }
              //     }
              //   } else {
               this[Interface[index].allData] = datas.records
              //   }
              // }
              this.selectPagination.total = res.result.total
              this.selectPagination.pageSize = res.result.size
              this.tableloading = false
              this.selectedRowKeys = this[Interface[index].selectedRowKeys]
              // this.popName = Interface[index].popName
              console.log(this[Interface[index].selectedRowKeys])
              // })
            }
          })
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .operation {
    display: flex;
    align-items: center;
    justify-content: space-between;

    > div {
      display: flex;
      align-items: center;
      justify-content: center;

      input {
        width: 150px;
      }
    }
  }
</style>