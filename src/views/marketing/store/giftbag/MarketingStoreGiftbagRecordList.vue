<template>
  <a-row :gutter="10">
    <a-col :span="4">
      <a-card :bordered="false" style="min-height: 800px">
        <a-input-search v-model="searchValue" style="margin-bottom: 8px" placeholder="店铺查询" @change="onChange" />

        <a-tree v-if="storeList.length > 0" :tree-data="storeListFilt" @select="getSelectStore"> </a-tree>
      </a-card>
    </a-col>
    <a-col :span="8">
      <a-card :bordered="false" style="min-width: 1400px; min-height: 800px">
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="24">
              <!-- <a-col :md="6" :sm="8">
                <a-form-item label="创建年">
                  <a-input placeholder="请输入创建年" v-model="queryParam.year"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="8">
                <a-form-item label="创建月">
                  <a-input placeholder="请输入创建月" v-model="queryParam.month"></a-input>
                </a-form-item>
              </a-col> -->
              <!--        <template v-if="toggleSearchStatus">
        <a-col :md="6" :sm="8">
            <a-form-item label="创建日">
              <a-input placeholder="请输入创建日" v-model="queryParam.day"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="删除状态（0，正常，1已删除）">
              <a-input placeholder="请输入删除状态（0，正常，1已删除）" v-model="queryParam.delFlag"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="会员列表id">
              <a-input placeholder="请输入会员列表id" v-model="queryParam.memebrListId"></a-input>
            </a-form-item>
          </a-col>
          </template>-->
              <a-col :md="6" :sm="8">
                <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
                  <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                  <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
                  <!--    <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>-->
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>

        <!-- 操作按钮区域 -->
        <div class="table-operator">
          <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button> -->
          <a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('店铺营销-礼包团-购买记录')">导出</a-button>
          <!-- <a-upload
            name="file"
            :showUploadList="false"
            :multiple="false"
            :headers="tokenHeader"
            :action="importExcelUrl"
            @change="handleImportExcel"
          >
            <a-button type="primary" icon="import">导入</a-button>
          </a-upload> -->
          <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
            <a-menu slot="overlay">
              <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
          </a-dropdown> -->
        </div>

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
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            @change="handleTableChange"
          >
            <span slot="action" slot-scope="text, record">
              <a @click="handleEdit(record)">分红明细</a>

              <!--          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>-->
            </span>
          </a-table>
        </div>
        <!-- table区域-end -->

        <!-- 表单区域 -->
        <marketingStoreGiftbagRecord-modal ref="modalForm" @ok="modalFormOk"></marketingStoreGiftbagRecord-modal>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
import MarketingStoreGiftbagRecordModal from './modules/MarketingStoreGiftbagRecordModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '@/api/manage'

export default {
  name: 'MarketingStoreGiftbagRecordList',
  mixins: [JeecgListMixin],
  components: {
    MarketingStoreGiftbagRecordModal,
  },
  data() {
    return {
      description: '礼包团-购买记录管理页面',
      storeList: [],
      storeListFilt: [],
      storeInfo: {},
      searchValue: '',
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
          title: '商户名称',
          align: 'center',
          dataIndex: 'storeName',
        },
        {
          title: '交易单号',
          align: 'center',
          dataIndex: 'serialNumber',
        },
        {
          title: '会员账号',
          align: 'center',
          dataIndex: 'phone',
        },
        {
          title: '会员昵称',
          align: 'center',
          dataIndex: 'nickName',
        },
        {
          title: '购买时间',
          align: 'center',
          dataIndex: 'createTime',
        },
        {
          title: '支付金额',
          align: 'center',
          dataIndex: 'totalFee',
        },
        {
          title: '支付余额',
          align: 'center',
          dataIndex: 'balance',
        },
        {
          title: '三方支付类型',
          align: 'center',
          dataIndex: 'payModel',
          customRender(text) {
            if (text == 0) {
              return '微信支付'
            }
            if (text == 1) {
              return '支付宝支付'
            }
            if (text == 2) {
              return '无'
            }
          },
        },
        {
          title: '三方支付金额',
          align: 'center',
          dataIndex: 'payPrice',
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/marketing.store.giftbag/marketingStoreGiftbagRecord/list',
        delete: '/marketing.store.giftbag/marketingStoreGiftbagRecord/delete',
        deleteBatch: '/marketing.store.giftbag/marketingStoreGiftbagRecord/deleteBatch',
        exportXlsUrl: 'marketing.store.giftbag/marketingStoreGiftbagRecord/exportXls',
        importExcelUrl: 'marketing.store.giftbag/marketingStoreGiftbagRecord/importExcel',
        getAllStoreList: 'storeManage/storeManage/getAllStoreList',
      },
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
  created() {
    this.getAllStoreList()
  },
  methods: {
    onChange(e) {
      console.log(this.searchValue)
      if (this.searchValue) {
        this.storeListFilt = this.storeList.filter((item) => item.title.indexOf(this.searchValue) > -1)
      } else {
        this.storeListFilt = this.storeList
      }
    },
    getSelectStore(e) {
      this.storeInfo = this.storeListFilt.find((item) => item.key === e[0])
      this.queryParam = {
        ...this.queryParam,
        storeManageId: this.storeInfo.key,
      }
      // this.url.list = '/marketing.store.giftbag/marketingStoreGiftbagRecord/list?storeManageId=' + this.storeInfo.key
      this.modalFormOk()
    },
    getAllStoreList() {
      getAction(this.url.getAllStoreList, {}).then((res) => {
        if (res.success) {
          for (let s of res.result) {
            this.storeList.push({
              title: s.storeName,
              key: s.id,
            })
            this.storeListFilt.push({
              title: s.storeName,
              key: s.id,
            })
          }
          console.log(this.storeList)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
