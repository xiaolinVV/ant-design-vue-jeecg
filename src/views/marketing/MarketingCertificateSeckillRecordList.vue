<template>
  <div class="MarketingCertificateSeckillRecordList">
    <div style="width:calc(100vw - 250px)">
      <div style="clear: both"></div>
      <a-card :bordered="false" style="width: 19%;min-height: 700px;background: white;float: left">
        <a-spin :spinning="cardLoading">
          <a-input-search placeholder="请输入活动编号" @search="onSearch" enterButton />
          <a-list itemLayout="horizontal" :dataSource="listData">
            <div class="line-render-item" slot="renderItem" slot-scope="item" @click="loadData(item)">
              <!-- <img preview="1" :src="item['logoAddr']" alt="" /> -->
              <div :class="{ 'select-color': item.id == marketingCertificateSeckillActivityListId }">
                {{ item.activityNumber }}
              </div>
            </div>
          </a-list>
        </a-spin>
      </a-card>
      <a-card :bordered="false" style="width: 79%;min-height: 700px;background: white;float: right;">
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="24">
              <a-col :md="8" :sm="8">
                <a-form-item label="订单编号">
                  <a-input placeholder="请输入订单编号" v-model="queryParam.serialNumber"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="8">
                <a-form-item label="兑换券id">
                  <a-input placeholder="请输入兑换券id" v-model="queryParam.marketingCertificateId"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="8">
                <a-form-item label="兑换券名称">
                  <a-input placeholder="请输入兑换券名称" v-model="queryParam.certificateName"></a-input>
                </a-form-item>
              </a-col>

              <a-col :md="8" :sm="8">
                <a-form-item label="会员手机号">
                  <a-input placeholder="请输入会员手机号" v-model="queryParam.phone"></a-input>
                </a-form-item>
              </a-col>

              <a-col :md="8" :sm="8">
                <a-form-item label="购买时间">
                  <a-range-picker
                    format="YYYY-MM-DD HH:mm:ss"
                    v-model="queryParam.buyTime"
                    :placeholder="['开始时间', '结束时间']"
                    @change="onDateChange2"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>

        <!-- 操作按钮区域 -->
        <div class="table-operator">
          <a-button type="primary" @click="loadData({ id: marketingCertificateSeckillActivityListId })" icon="search"
            >查询</a-button
          >
          <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
          <!-- <a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('专区广告')">导出</a-button>
          <a-upload
            name="file"
            :showUploadList="false"
            :multiple="false"
            :headers="tokenHeader"
            :action="importExcelUrl"
            @change="handleImportExcel"
          >
            <a-button type="primary" icon="import">导入</a-button>
          </a-upload>
          <a-dropdown v-if="selectedRowKeys.length > 0">
            <a-menu slot="overlay">
              <a-menu-item key="1" @click="batchDel">
                <a-icon type="delete" />
                删除
              </a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px">
              批量操作
              <a-icon type="down" />
            </a-button>
          </a-dropdown> -->
        </div>

        <!-- table区域-begin -->
        <div>
          <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
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
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            @change="handleTableChange"
            :scroll="{ x: 2500 }"
          >
            <template slot="headPortrait" slot-scope="text">
              <a-avatar preview="1" :src="text" alt="" style="width: 40px;height: 40px;" />
            </template>
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

            <template slot="status" slot-scope="text">
              <div v-if="text == 1">
                启用
              </div>
              <div v-else>
                停用
              </div>
            </template>
            <template slot="purchase" slot-scope="text">
              <div v-if="text == 1">
                限购
              </div>
              <div v-else>
                不限购
              </div>
            </template>
            <template slot="purchaseNumber" slot-scope="text">
              <div v-if="text > 0">
                {{ text }}
              </div>
              <div v-else>
                -
              </div>
            </template>

            <!-- <span slot="action" slot-scope="text, record">
              <a @click="toEditRecord(record, 1)">排序</a>
              <a-divider type="vertical" />
              <a v-if="record.status == 1" @click="showTextareaModal(record, 1)">停用</a>
              <a v-else @click="showTextareaModal(record, 2)">启用</a>
              <a-divider type="vertical" />
              <a @click="toEditRecord(record, 2)">改活动价格</a>
              <a-divider type="vertical" />
              <a @click="showTextareaModal(record, 3)">删除</a>
              <a-divider type="vertical" />
            </span> -->
            <span slot="action" slot-scope="text, record" @click="lookCoupon(record)">
              <a>查看券号</a>
            </span>
          </a-table>
        </div>
        <!-- table区域-end -->

        <!-- 表单区域 -->
        <!-- <MarketingCertificateSeckillListModal ref="modalForm"></MarketingCertificateSeckillListModal> -->
        <MarketingCertificateSeckillListLookCouponModal
          ref="modalForm3"
        ></MarketingCertificateSeckillListLookCouponModal>
        <textAreaModal
          ref="modalForm2"
          :infos="modalForm2Infos"
          :record="modalForm2Record"
          @ok="modalForm2Ok"
        ></textAreaModal>
      </a-card>
      <div style="clear: both"></div>
    </div>
  </div>
</template>

<script>
// import MarketingCertificateSeckillListModal from './modules/MarketingCertificateSeckillListModal'
import MarketingCertificateSeckillListLookCouponModal from './modules/MarketingCertificateSeckillListLookCouponModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import textAreaModal from '@/components/popUp/textAreaModal'
import { filterObj } from '@/utils/util'
import { getAction, postAction, deleteAction } from '@/api/manage'
export default {
  name: 'MarketingCertificateSeckillRecordList',
  mixins: [JeecgListMixin],
  components: {
    // MarketingCertificateSeckillListModal,
    textAreaModal,
    MarketingCertificateSeckillListLookCouponModal
  },
  data() {
    return {
      description: '专区广告管理页面',
      listData: [],
      //卡片加载
      cardLoading: false,
      marketingCertificateSeckillActivityListId: '',
      // 表头
      columns: [
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
          title: '订单编号',
          align: 'center',
          dataIndex: 'serialNumber'
        },
        {
          title: '兑换券id',
          align: 'center',
          dataIndex: 'marketingCertificateId'
        },
        {
          title: '兑换券名称',
          align: 'center',
          dataIndex: 'certificateName'
        },
        {
          title: '主图',
          align: 'center',
          dataIndex: 'mainPicture',
          scopedSlots: { customRender: 'mainPicture' }
        },
        {
          title: '市场价',
          dataIndex: 'marketPrice',
          align: 'center'
        },
        {
          title: '销售价',
          dataIndex: 'price',
          align: 'center'
        },
        {
          title: '成本价',
          dataIndex: 'costPrice',
          align: 'center'
        },
        {
          title: '活动价',
          dataIndex: 'activityPrice',
          align: 'center'
        },
        {
          title: '会员头像',
          align: 'center',
          dataIndex: 'headPortrait',
          scopedSlots: { customRender: 'headPortrait' }
        },
        {
          title: '会员手机号',
          align: 'center',
          dataIndex: 'phone'
        },
        {
          title: '购买数量',
          align: 'center',
          dataIndex: 'quantity'
        },
        {
          title: '购买时间',
          align: 'center',
          dataIndex: 'buyTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ],
      modalForm2Record: {},
      modalForm2Infos: {},
      url: {
        list: '/marketingCertificateSeckillRecord/marketingCertificateSeckillRecord/list',
        delete: '/marketingCertificateSeckillRecord/marketingCertificateSeckillRecord/delete',
        deleteBatch: '/marketingCertificateSeckillRecord/marketingCertificateSeckillRecord/deleteBatch',
        exportXlsUrl: 'marketingCertificateSeckillRecord/marketingCertificateSeckillRecord/exportXls',
        importExcelUrl: 'marketingCertificateSeckillRecord/marketingCertificateSeckillRecord/importExcel',
        //专区分类左边  参数 activityNumber null || 指定名字
        marketingCertificateSeckillActivityList:
          '/marketingCertificateSeckillActivityList/marketingCertificateSeckillActivityList/list',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        updateStatus: '/marketingCertificateSeckillList/marketingCertificateSeckillList/updateStatus',
        edit: 'marketingCertificateSeckillList/marketingCertificateSeckillList/edit'
      },
      queryParam: {
        buyTime_begin: '',
        buyTime_end: '',
        buyTime: ''
      }
    }
  },
  created() {
    this.leftListMethods()
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    lookCoupon(record) {
      this.$refs.modalForm3.show(record)
    },
    handleImage(imgUrl) {
      if (imgUrl) {
        try {
          return this.url.imgerver + '/' + Object.values(JSON.parse(imgUrl))[0]
        } catch (error) {
          console.error(error, '图片解析出错')
        }
      }
      return ''
    },
    toEditRecord(record, type) {
      record.openType = type
      this.handleEdit(record)
    },
    async showTextareaModal(record, type) {
      const allInfos = [
        {
          title: '停用',
          mainText: '停用后，该券将不在活动中展示。',
          explainSureText: '您确定要停用吗'
        },
        {
          title: '启用',
          mainText: '启用后，该券将会在活动中展示。',
          explainSureText: '您确定要启用吗'
        },
        {
          title: '删除',
          mainText: '删除后，该券将不在活动中展示。',
          explainSureText: '您确定要删除吗'
        }
      ]
      this.modalForm2Record = record
      this.modalForm2Infos = allInfos[type - 1]
      await this.$nextTick()
      this.$refs.modalForm2.show()
    },
    async modalForm2Ok(infos) {
      const title = this.modalForm2Infos.title
      if (title == '停用') {
        infos.status = 0
      } else if (title == '启用') {
        infos.status = 1
      }
      let result
      if (title == '删除') {
        result = await deleteAction(this.url.delete, infos)
      } else {
        result = await postAction(this.url.edit, infos)
      }
      if (result.success) {
        this.$message.success(result.message)
        this.loadData()
      } else {
        this.$message.error(result.message)
      }

      console.log(infos)
    },
    /**查询栏时间区间查询*/
    getQueryParams() {
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.buyTime
      return filterObj(param)
    },
    onDateChange2: function(value, dateString) {
      this.queryParam.buyTime_begin = dateString[0]
      this.queryParam.buyTime_end = dateString[1]
    },
    onDateChange: function(value, dateString) {
      this.queryParam.updateTime_begin = dateString[0]
      this.queryParam.updateTime_end = dateString[1]
    },
    // 分类左边方法封装
    leftListMethods(activityNumber = '') {
      this.cardLoading = true
      getAction(this.url.marketingCertificateSeckillActivityList, {
        activityNumber: `*${activityNumber}*`
      }).then(res => {
        if (res.success) {
          if (res.result.records.length > 0) {
            this.marketingCertificateSeckillActivityListId = res.result.records[0].id
            this.loadData(res.result.records[0], true)
          }
          this.listData = res.result.records
        }
        this.cardLoading = false
      })
    },
    handleTableChange(pagination, filters, sorter) {
      this.ipagination = pagination
      this.loadData(
        {
          id: this.marketingCertificateSeckillActivityListId
        },
        true
      )
    },
    loadData(
      item = {
        id: this.marketingCertificateSeckillActivityListId
      },
      isMore = false
    ) {
      if (!isMore) {
        this.ipagination.current = 1
      }
      let marketingCertificateSeckillActivityListId = item.id
      let info = Object.assign({}, { marketingCertificateSeckillActivityListId }, this.getQueryParams(), {
        pageNo: this.ipagination.current,
        pageSize: 10
      })
      this.loading = true
      this.marketingCertificateSeckillActivityListId = marketingCertificateSeckillActivityListId
      getAction(this.url.list, info).then(res => {
        if (res.success) {
          this.dataSource = res.result.records
          this.ipagination.total = res.result.total
        }
        this.loading = false
      })
    },
    //搜索
    onSearch(value) {
      this.leftListMethods(value)
    }
  }
}
</script>
<style lang="less">
.MarketingCertificateSeckillRecordList {
  .select-color {
    color: #1890ff;
  }

  .spin-content {
    padding: 30px;
  }
  .line-render-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    min-height: 60px;
    font-weight: 700;
    font-size: 14px;
    img {
      margin-right: 10px;
      width: 40px;
      height: 40px;
    }
  }
  .line-render-item:hover {
    cursor: pointer;
    color: #1890ff;
  }
}
</style>
