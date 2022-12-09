<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="缴费单号">
              <a-input placeholder="请输入缴费单号" v-model="queryParam.billNo"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="会员账号">
              <a-input placeholder="请输入会员账号" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="会员昵称">
              <a-input placeholder="请输入会员昵称" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="车牌号">
              <a-input placeholder="请输入车牌号" v-model="queryParam.licensePlateNumber"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="车牌类型">
              <a-select v-model="queryParam.licenseType" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">普通车牌</a-select-option>
                <a-select-option :value="1">新能源车牌</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="进场时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.startTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
              />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="出场时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.endTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange2"
              />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="创建时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.createTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange3"
              />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="付款时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.payTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange4"
              />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <!-- <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a> -->
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <!-- <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('车牌管理')">导出</a-button>
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
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down"/></a-button>
      </a-dropdown>
    </div> -->

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
        :scroll="{ x: 2000 }"
      >
        <template slot="preferentialTime" slot-scope="text, record">
          {{ text }}{{ record.timeType == 1 ? '分钟' : '小时' }}
        </template>
        <!-- <template slot="licenseType" slot-scope="text">
          <div v-if="text == 0">
            普通车牌
          </div>
          <div v-if="text == 1">
            新能源车牌
          </div>
        </template> -->
        <!-- <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span> -->
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <vehicleParkLicenseManagement-modal ref="modalForm" @ok="modalFormOk"></vehicleParkLicenseManagement-modal>
  </a-card>
</template>

<script>
import VehicleParkLicenseManagementModal from './modules/VehicleParkLicenseManagementModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'
export default {
  name: 'VehicleParkLicenseManagementList',
  mixins: [JeecgListMixin],
  components: {
    VehicleParkLicenseManagementModal
  },
  data() {
    return {
      description: '车牌管理管理页面',
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
          title: '会员账号',
          align: 'center',
          dataIndex: 'phone'
        },
        {
          title: '会员昵称',
          align: 'center',
          dataIndex: 'nickName'
        },

        // {
        //   title: '车牌类型',
        //   align: 'center',
        //   dataIndex: 'licenseType',
        //   scopedSlots: { customRender: 'licenseType' }
        // },
        {
          title: '车牌号',
          align: 'center',
          dataIndex: 'licensePlateNumber'
        },
        {
          title: '停车场',
          align: 'center',
          dataIndex: 'parkingLot'
        },
        {
          title: '收费系统',
          align: 'center',
          dataIndex: 'chargingSystem'
        },
        {
          title: '进场时间',
          align: 'center',
          dataIndex: 'startTime'
        },
        {
          title: '出场时间',
          align: 'center',
          dataIndex: 'endTime'
        },
        {
          title: '停车时长',
          align: 'center',
          dataIndex: 'parkingTime'
        },
        {
          title: '停车费用',
          align: 'center',
          dataIndex: 'parkingFee'
        },
        {
          title: '停车券',
          align: 'center',
          dataIndex: 'parkingCoupon'
        },
        {
          title: '优惠',
          align: 'center',
          dataIndex: 'preferentialTime',
          scopedSlots: { customRender: 'preferentialTime' }
        },
        {
          title: '应付金额',
          align: 'center',
          dataIndex: 'shouldPay'
        },
        {
          title: '实付金额',
          align: 'center',
          dataIndex: 'payResult'
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'crateTime'
        },
        {
          title: '付款时间',
          align: 'center',
          dataIndex: 'payTime'
        }

        // {
        //   title: '操作',
        //   dataIndex: 'action',
        //   align: 'center',
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      dataSource: [
        {
          id: 'asdfjsldkf123123lna',
          phone: '18750305745',
          nickName: '蓝色枫叶',
          licensePlateNumber: '闽D12345',
          parkingLot: '软件园停车场',
          chargingSystem: '科拓收费系统',
          startTime: '2021-01-02 11:12:11',
          endTime: '2021-01-02 14:07:24',
          preferentialTime: 2,
          parkingTime: '2小时55分13秒',
          parkingFee: '15.00',
          parkingCoupon: '软件园停车场2小时免费停车券',
          shouldPay: '5.00',
          payResult: '5.00',
          crateTime: '2021-01-02 14:07:24',
          payTime: '2021-01-02 14:07:24'
        }
      ],
      url: {
        list: '/vehicle/vehicleParkLicenseManagement/list',
        delete: '/vehicle/vehicleParkLicenseManagement/delete',
        deleteBatch: '/vehicle/vehicleParkLicenseManagement/deleteBatch',
        exportXlsUrl: 'vehicle/vehicleParkLicenseManagement/exportXls',
        importExcelUrl: 'vehicle/vehicleParkLicenseManagement/importExcel'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    loadData() {
      this.dataSource = [
        {
          id: 'asdfjsldkf123123lna',
          phone: '18750305745',
          nickName: '蓝色枫叶',
          licensePlateNumber: '闽D12345',
          parkingLot: '软件园停车场',
          chargingSystem: '科拓收费系统',
          startTime: '2021-01-02 11:12:11',
          endTime: '2021-01-02 14:07:24',
          preferentialTime: 2,
          parkingTime: '2小时55分13秒',
          parkingFee: '15.00',
          parkingCoupon: '软件园停车场2小时免费停车券',
          shouldPay: '5.00',
          payResult: '5.00',
          crateTime: '2021-01-02 14:07:24',
          payTime: '2021-01-02 14:07:24'
        }
      ]
    },
    /**查询栏时间区间查询*/
    getQueryParams() {
      console.log(this.queryParam.createTime)
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.createTime
      delete param.endTime
      delete param.createTime
      delete param.payTime
      return filterObj(param)
    },
    onDateChange: function(value, dateString) {
      this.queryParam.createTimeStart = dateString[0]
      this.queryParam.createTimeEnd = dateString[1]
    },
    onDateChange2: function(value, dateString) {
      this.queryParam.endTime_begin = dateString[0]
      this.queryParam.endTime_end = dateString[1]
    },
    onDateChange3: function(value, dateString) {
      this.queryParam.createTime_begin = dateString[0]
      this.queryParam.createTime_end = dateString[1]
    },
    onDateChange4: function(value, dateString) {
      this.queryParam.payTime_begin = dateString[0]
      this.queryParam.payTime_end = dateString[1]
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
