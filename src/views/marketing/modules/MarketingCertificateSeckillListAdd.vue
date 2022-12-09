<template>
  <a-card title="添加限时券" class="MarketingCertificateSeckillListAdd">
    <a-alert
      message="重要提示：先批量设置过后再单独调整价格，避免单独设置的价格被批量操作覆盖。选择商品时请合理设置价格，避免造成不必要的亏损"
      type="info"
      show-icon
    />
    <div class="table-page-search-wrapper">
      <a-form layout="inline" style="margin-top: 20px" @submit="handleSubmit">
        <a-row :gutter="24">
          <a-col :md="6" :sm="6">
            <a-form-item label="兑换券id">
              <a-input placeholder="请输入兑换券id" v-model="queryParam.id" style="width: 100%"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="6">
            <a-form-item label="兑换券名称">
              <a-input placeholder="请输入兑换券名称" v-model="queryParam.name" style="width: 100%"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" icon="search" @click="searchResult">查询</a-button>
              <a-button type="primary" @click="selectStore" icon="select" style="margin-left: 8px">选择兑换券</a-button>
              <a-button type="primary" icon="setting" style="margin-left: 8px" @click="setAll">批量设置</a-button>
            </span>
          </a-col>
          <a-col :md="24" :sm="24" style="margin-top: 10px">
            <a-table
              :columns="columns"
              :dataSource="dataSource"
              :loading="tableLoading"
              class="components-table-demo-nested"
              rowKey="id"
            >
              <template slot="mainPicture" slot-scope="text, record, index">
                <img
                  class="clickShowImage"
                  v-if="record.mainPicture != undefined"
                  :preview="'mainPicture' + index"
                  :src="handleImage(text)"
                  alt=""
                />
                <a-avatar
                  shape="square"
                  v-if="record.mainPicture == undefined || record.mainPicture == ''"
                  :src="handleImage(text)"
                  icon="user"
                />
              </template>
              <template slot="operation" slot-scope="text, record, index">
                <a-popconfirm v-if="dataSource.length" title="确定删除吗？" @confirm="() => onDelete(record)">
                  <a href="javascript:;">删除</a>
                </a-popconfirm>
              </template>
              <template slot="discountActivity" slot-scope="text, record, index">
                <a-input-number
                  :min="0"
                  :precision="2"
                  @change="e => certificateHandleChange(e, record.id, 'discountActivity')"
                  v-model="record.discountActivity"
                ></a-input-number>
                %
              </template>
              <template slot="activityPrice" slot-scope="text, record, index">
                <a-input-number
                  :min="0"
                  :precision="2"
                  @change="e => certificateHandleChange(e, record.id, 'activityPrice')"
                  v-model="record.activityPrice"
                ></a-input-number>
              </template>
              <template slot="isLimit" slot-scope="text, record, index">
                <a-select
                  v-model="record.isLimit"
                  placeholder="请选择"
                  @change="e => certificateHandleChange(e, record.id, 'isLimit')"
                >
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option :value="0">不限购</a-select-option>
                  <a-select-option :value="1">限购</a-select-option>
                </a-select>
              </template>

              <template slot="limitCount" slot-scope="text, record, index">
                <a-input-number
                  :min="0"
                  :precision="0"
                  @change="e => certificateHandleChange(e, record.id, 'limitCount')"
                  v-model="record.limitCount"
                  :disabled="record.isLimit != 1"
                ></a-input-number>
              </template>
            </a-table>
          </a-col>
        </a-row>
        <a-button type="primary" html-type="submit" style="margin: 30px auto;display: block;">
          提交
        </a-button>
      </a-form>
    </div>
    <a-modal title="选择兑换券" :visible="ShowPopUp" :width="1200" @ok="selectLineData" @cancel="PopUp">
      <div class="MarketingCertificateSeckillListAddCnt">
        <div class="title2">
          <div>
            兑换券名称：
            <a-input v-model="popUpSearchQuery.certificateName" style="width: 200px" />
          </div>
          <div>
            券id:
            <a-input v-model="popUpSearchQuery.id" style="width: 200px"> </a-input>
          </div>
          <a-button type="primary" @click="search"> 查询 </a-button>
        </div>
        <a-table
          :columns="popUpColumns"
          :dataSource="popUpData"
          :loading="popUPTableLoading"
          :pagination="selectPagination"
          rowKey="id"
          :rowSelection="rowSelection"
          bordered
          @change="handleSelectTableChange"
        >
          <template slot="mainPicture" slot-scope="text, record, index">
            <img
              class="clickShowImage"
              v-if="record.mainPicture != undefined"
              :preview="'mainPicture' + index"
              :src="handleImage(text)"
              alt=""
            />
            <a-avatar
              shape="square"
              v-if="record.mainPicture == undefined || record.mainPicture == ''"
              :src="handleImage(text)"
              icon="user"
            />
          </template>
        </a-table>
      </div>
    </a-modal>
    <MarketingCertificateGroupAddCertifacateSetALLModel
      ref="MarketingCertificateGroupAddCertifacateSetALLModel"
      @handleOK="setAllOk"
    >
    </MarketingCertificateGroupAddCertifacateSetALLModel>
  </a-card>
</template>
<script>
const columnsWidth = 160
const exchangeCertificateListComumns = [
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
    title: '主图',
    dataIndex: 'mainPicture',
    scopedSlots: { customRender: 'mainPicture' },
    width: columnsWidth,
    align: 'center'
  },
  {
    title: '市场价',
    dataIndex: 'marketPrice',
    width: columnsWidth,
    align: 'center'
  },
  {
    title: '销售价',
    dataIndex: 'price',
    width: columnsWidth,
    align: 'center'
  },
  {
    title: '成本价',
    dataIndex: 'costPrice',
    width: columnsWidth,
    align: 'center'
  },
  {
    title: '库存',
    dataIndex: 'discountSurplus',
    width: columnsWidth,
    align: 'center'
  }
  // {
  //   title: '发放数量',
  //   dataIndex: 'total',
  //   width: columnsWidth,
  //   align: 'center'
  // }
]
import { httpAction, getAction, postAction, putAction } from '@/api/manage'
import MarketingCertificateGroupAddCertifacateSetALLModel from './MarketingCertificateGroupAddCertifacateSetALLModel'
export default {
  name: 'MarketingCertificateSeckillListAdd',
  data() {
    return {
      queryParam: {},
      columns: Object.freeze([
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
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
          title: '主图',
          dataIndex: 'mainPicture',
          scopedSlots: { customRender: 'mainPicture' },
          width: columnsWidth,
          align: 'center'
        },
        {
          title: '市场价',
          dataIndex: 'marketPrice',
          width: columnsWidth,
          align: 'center'
        },
        {
          title: '销售价',
          dataIndex: 'price',
          width: columnsWidth,
          align: 'center'
        },
        {
          title: '成本价',
          dataIndex: 'costPrice',
          width: columnsWidth,
          align: 'center'
        },
        {
          title: '库存',
          dataIndex: 'discountSurplus',
          width: columnsWidth,
          align: 'center'
        },
        {
          title: '活动折扣',
          dataIndex: 'discountActivity',
          width: columnsWidth,
          scopedSlots: { customRender: 'discountActivity' },
          align: 'center'
        },
        {
          title: '活动价',
          dataIndex: 'activityPrice',
          width: columnsWidth,
          scopedSlots: { customRender: 'activityPrice' },
          align: 'center'
        },
        {
          title: '是否限购',
          dataIndex: 'isLimit',
          width: columnsWidth,
          scopedSlots: { customRender: 'isLimit' },
          align: 'center'
        },
        {
          title: '限购件数',
          dataIndex: 'limitCount',
          width: columnsWidth,
          scopedSlots: { customRender: 'limitCount' },
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'operation' }
        }
      ]),
      dataSource: [],
      tableLoading: false,
      ShowPopUp: false,
      popUpColumns: exchangeCertificateListComumns,
      popUpData: [],
      popUPTableLoading: false,
      popUpSearchQuery: {},
      marketingCertificateSeckillActivityListId: '',
      //查询table分页配置
      selectPagination: {
        current: 1,
        pageSize: 10,
        total: 1
      },
      selectedRowKeys: [],
      selectedRows: [],
      url: {
        //选择兑换券弹窗列表(传入字段 certificateName )
        exchangeCertificatePopUpList: 'marketingCertificate/marketingCertificate/findCertificateData',
        addBatch: 'marketingCertificateSeckillList/marketingCertificateSeckillList/addBatch'
      },
      //配置
      configure: {
        imgErver: window._CONFIG['domianURL'] + '/sys/common/view',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
      }
    }
  },
  created() {
    this.marketingCertificateSeckillActivityListId = this.$route.query.marketingCertificateSeckillActivityListId
  },
  components: {
    MarketingCertificateGroupAddCertifacateSetALLModel
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this
      return {
        selectedRowKeys,
        onChange: this.onSelectChange,
        hideDefaultSelections: true,
        onSelection: this.onSelection,
        getCheckboxProps: record => ({
          props: {
            disabled: record.ifSelected == 1 // Column configuration not to be checked
          }
        })
      }
    }
  },
  methods: {
    searchResult() {
      console.log('searchResult')
      let queryParam = this.queryParam
      this.dataSource = this.selectedRows.filter(
        item =>
          (item.name.indexOf(queryParam.name) != -1 || !queryParam.name) &&
          (item.id.indexOf(queryParam.id) != -1 || !queryParam.id)
      )
    },
    handleImage(imgUrl) {
      if (imgUrl) {
        try {
          return this.configure.imgErver + '/' + Object.values(JSON.parse(imgUrl))[0]
        } catch (error) {
          console.error(error, '图片解析出错')
        }
      }
      return ''
    },
    onDelete(record) {
      this.dataSource = this.dataSource.filter(item => item.id !== record.id)
      this.selectedRowKeys = this.selectedRowKeys.filter(item => item !== record.id)
      this.selectedRows = this.selectedRows.filter(item => item.id !== record.id)
    },
    selectStore() {
      this.PopUp()
      this.search()
    },
    certificateHandleChange(value, key, column) {
      const newData = [...this.dataSource]
      const target = newData.filter(item => key === item.id)[0]
      if (target) {
        if (column == 'discountActivity') {
          //活动折扣
          target.activityPrice = (target.price * value) / 100 || 0
        }
        if (column == 'activityPrice') {
          //活动价
          target.discountActivity = !target.price ? 0 : (value * 100) / target.price || 0
        }
        target[column] = value
        this.dataSource = newData
      }
    },
    search(clickSearch = false) {
      if (clickSearch) {
        this.selectPagination.current = 1
      }
      this.popUPTableLoading = true
      getAction(this.url.exchangeCertificatePopUpList, {
        ...this.selectPagination,
        ...this.popUpSearchQuery,
        marketingCertificateType: 0,
        marketingCertificateSeckillActivityListId: this.marketingCertificateSeckillActivityListId
      }).then(res => {
        this.popUPTableLoading = false
        if (res.success) {
          console.log(res.result)
          this.popUpData = res.result.records
          this.selectPagination.total = res.result.total
          this.selectPagination.pageSize = res.result.size
        } else {
        }
      })
    },
    setAll() {
      this.$refs.MarketingCertificateGroupAddCertifacateSetALLModel.open()
    },
    setAllOk(allData) {
      console.log(allData)
      this.dataSource = this.dataSource.map(item => {
        Object.keys(allData).forEach(key => {
          item[key] = allData[key]
          if (key == 'discountActivity') {
            item.activityPrice = (item.discountActivity * item.price) / 100
          }
        })
        return item
      })
    },
    handleSubmit(e) {
      e.preventDefault()
      let submitData = this.dataSource
      if (submitData.length <= 0) {
        this.$message.error('请选择需要添加的券')
        return
      }
      let result = submitData.every(
        item =>
          this.isNotEmpty(item.discountActivity) &&
          this.isNotEmpty(item.activityPrice) &&
          this.isNotEmpty(item.isLimit) &&
          (this.isNotEmpty(item.limitCount) || item.isLimit != 1)
      )
      if (!result) {
        this.$message.error('请填写完整表中的信息')
      } else {
        submitData = submitData.map(item => ({
          discountActivity: item.discountActivity,
          activityPrice: item.activityPrice,
          purchase: item.isLimit,
          purchaseNumber: item.limitCount,
          marketingCertificateId: item.id,
          marketingCertificateSeckillActivityListId: this.marketingCertificateSeckillActivityListId
        }))
        postAction(this.url.addBatch, JSON.stringify(submitData), {
          'Content-Type': 'application/json'
        }).then(res => {
          if (res.success) {
            this.$message.success(res.message)
            this.$router.push({ path: '/marketing/MarketingCertificateSeckillListList' })
          } else {
            this.$message.error(res.message)
          }
        })
      }
    },
    isNotEmpty(num) {
      return typeof num === 'number' || (typeof num === 'string' && !isNaN(num))
    },
    selectLineData() {
      this.PopUp()
      this.dataSource = this.selectedRows
    },
    PopUp() {
      this.ShowPopUp = !this.ShowPopUp
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      console.log(selectedRowKeys, selectedRows)
    },
    async handleSelectTableChange(pagination) {
      console.log(pagination)
      this.selectPagination.current = pagination.current
      await this.$nextTick()
      this.search()
    }
  }
}
</script>
<style lang="less">
// .MarketingCertificateSeckillListAdd {
.MarketingCertificateSeckillListAddCnt {
  input {
    width: 120px;
  }

  .title2 {
    display: flex;
    margin-bottom: 10px;
    > div {
      margin-right: 15px;
    }
  }

  .info {
    display: flex;
    float: right;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
    min-width: 250px;
  }
}
// }
</style>
