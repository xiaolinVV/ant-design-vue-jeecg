<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="停车券编号">
              <a-input placeholder="请输入停车券编号" v-model="queryParam.serialNumber"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="券名称">
              <a-input placeholder="请输入券名称" v-model="queryParam.ticketName"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParam.status" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">停用</a-select-option>
                <a-select-option :value="1">启用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="获得时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.getTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
              />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <!-- <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('券记录')">导出</a-button>
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
        <template slot="mainPicture" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            v-if="text != undefined"
            :preview="'mainPicture' + index"
            :src="handleImage(text)"
            alt=""
          />
          <a-avatar shape="square" v-if="text == undefined || text == ''" :src="handleImage(text)" icon="user" />
        </template>
        <template slot="preferentialTime" slot-scope="text, record">
          {{ text }}{{ record.timeType == 1 ? '分钟' : '小时' }}
        </template>
        <template slot="effectiveDays" slot-scope="text">
          {{ text }} 天有效（含当日)
        </template>
        <template slot="getWay" slot-scope="text, record">
          {{ text == 0 ? '送券活动' : '' }}{{ record.vehicleParkTicketId }}
        </template>
        <template slot="status" slot-scope="text">
          <div class="anty-img-wrap">
            <div v-if="text == 0">未使用</div>
            <div v-if="text == 1">已使用</div>
            <div v-if="text == 2">已过期</div>
          </div>
        </template>

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
    <vehicleParkTicketRecord-modal ref="modalForm" @ok="modalFormOk"></vehicleParkTicketRecord-modal>
  </a-card>
</template>

<script>
import VehicleParkTicketRecordModal from './modules/VehicleParkTicketRecordModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'
export default {
  name: 'VehicleParkTicketRecordList',
  mixins: [JeecgListMixin],
  components: {
    VehicleParkTicketRecordModal
  },
  data() {
    return {
      description: '券记录管理页面',
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
          title: '停车券编号',
          align: 'center',
          dataIndex: 'serialNumber'
        },
        {
          title: '券号',
          align: 'center',
          dataIndex: 'ticketNo'
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

        {
          title: '券名称',
          align: 'center',
          dataIndex: 'ticketName'
        },

        {
          title: '主图',
          align: 'center',
          dataIndex: 'mainPicture',
          scopedSlots: { customRender: 'mainPicture' }
        },
        {
          title: '优惠',
          align: 'center',
          dataIndex: 'preferentialTime',
          scopedSlots: { customRender: 'preferentialTime' }
        },
        {
          title: '有效期',
          align: 'center',
          dataIndex: 'effectiveDays',
          scopedSlots: { customRender: 'effectiveDays' }
        },
        {
          // 0：送券活动
          title: '获取方式',
          align: 'center',
          dataIndex: 'getWay',
          scopedSlots: { customRender: 'getWay' }
        },
        {
          title: '获得时间',
          align: 'center',
          dataIndex: 'getTime'
        },
        {
          // ；0：未使用；1：已使用；2：已过期
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '使用时间',
          align: 'center',
          dataIndex: 'userTime'
        },
        {
          title: '过期时间',
          align: 'center',
          dataIndex: 'expirationTime'
        },
        {
          title: '交易单号',
          align: 'center',
          dataIndex: 'tradeNo'
        }
        // {
        //   title: '时间类型；0：时；1：分',
        //   align: 'center',
        //   dataIndex: 'timeType'
        // },
        // {
        //   title: '有效天数',
        //   align: 'center',
        //   dataIndex: 'effectiveDays'
        // },

        // {
        //   title: '状态说明',
        //   align: 'center',
        //   dataIndex: 'statusExplain'
        // },

        // {
        //   title: '会员列表id',
        //   align: 'center',
        //   dataIndex: 'memberListId'
        // },
        // {
        //   title: '开始时间',
        //   align: 'center',
        //   dataIndex: 'startTime'
        // },
        // {
        //   title: '结束时间',
        //   align: 'center',
        //   dataIndex: 'endTime'
        // },
        // {
        //   title: '券id',
        //   align: 'center',
        //   dataIndex: 'vehicleParkTicketId'
        // },

        // {
        //   title: '活动编号',
        //   align: 'center',
        //   dataIndex: 'activityNo'
        // }

        // {
        //   title: '操作',
        //   dataIndex: 'action',
        //   align:"center",
        //   scopedSlots: { customRender: 'action' },
        // }
      ],
      url: {
        list: '/vehicle/vehicleParkTicketRecord/list',
        delete: '/vehicle/vehicleParkTicketRecord/delete',
        deleteBatch: '/vehicle/vehicleParkTicketRecord/deleteBatch',
        exportXlsUrl: 'vehicle/vehicleParkTicketRecord/exportXls',
        importExcelUrl: 'vehicle/vehicleParkTicketRecord/importExcel',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
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
    /**查询栏时间区间查询*/
    getQueryParams() {
      console.log(this.queryParam.createTime)
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.getTime
      return filterObj(param)
    },
    onDateChange: function(value, dateString) {
      this.queryParam.getTimeStart = dateString[0]
      this.queryParam.getTimeEnd = dateString[1]
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
