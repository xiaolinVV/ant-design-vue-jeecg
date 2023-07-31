<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="8" :sm="8">
            <a-form-item label="抢购编号">
              <a-input placeholder="请输入" v-model="queryParam.serialNumber"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="分类名称">
              <a-input placeholder="请输入" v-model="queryParam.rushName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="商品编号">
              <a-input placeholder="请输入商品编号" v-model="queryParam.goodNo"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="商品名称">
                <a-input placeholder="请输入商品名称" v-model="queryParam.goodName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="会员手机号">
                <a-input placeholder="请输入会员手机号" v-model="queryParam.phone"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="会员昵称">
                <a-input placeholder="请输入会员昵称" v-model="queryParam.nickName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="状态">
                <a-select v-model="queryParam.status" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option :value="0">失败</a-select-option>
                  <a-select-option :value="1">成功</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="抢购时间">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.createTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange"
                />
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
  <!--  <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('抢购活动-购买记录')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete"/>
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
    </div>-->

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a
        style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <template slot="mainPicture" slot-scope="text">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="getAvatarView(text)" icon="user" />
          </div>
        </template>
        <template slot="headPortrait" slot-scope="text">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="text" icon="user" />
          </div>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical"/>
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
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingRushRecord-modal ref="modalForm" @ok="modalFormOk"></marketingRushRecord-modal>
  </a-card>
</template>

<script>
  import MarketingRushRecordModal from './modules/MarketingRushRecordModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import { filterObj } from '@/utils/util'
  export default {
    name: "MarketingRushRecordList",
    mixins: [JeecgListMixin],
    components: {
      MarketingRushRecordModal
    },
    data () {
      return {
        description: '抢购活动-购买记录管理页面',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '抢购编号',
            align: "center",
            dataIndex: 'serialNumber'
          },
          {
            title: '分类名称',
            align: "center",
            dataIndex: 'rushName'
          },
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
            dataIndex: 'specification'
          },
          {
            title: '购买数量',
            align: 'center',
            dataIndex: 'amount'
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
            title: '会员昵称',
            align: 'center',
            dataIndex: 'nickName'
          },
          {
            title: '状态',
            align: "center",
            dataIndex: 'status',
            customRender: function (text) {
              if (text == 0) {
                return '失败'
              }else if (text == 1){
                return '成功'
              }
            },
          },
          {
            title: '创建时间',
            align: "center",
            dataIndex: 'createTime'
          },
        ],
        url: {
          list: "/marketingRushRecord/marketingRushRecord/list",
          delete: "/marketingRushRecord/marketingRushRecord/delete",
          deleteBatch: "/marketingRushRecord/marketingRushRecord/deleteBatch",
          exportXlsUrl: "marketingRushRecord/marketingRushRecord/exportXls",
          importExcelUrl: "marketingRushRecord/marketingRushRecord/importExcel",
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view'
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      getAvatarView: function(mainPicture) {
        if (mainPicture) {
          return this.url.imgerver + '/' + JSON.parse(mainPicture)[0]
        }
        return ''
      },
      getQueryParams() {
        console.log(this.queryParam.createTime)
        var param = Object.assign({}, this.queryParam, this.isorter)
        param.field = this.getQueryField()
        param.pageNo = this.ipagination.current
        param.pageSize = this.ipagination.pageSize
        delete param.createTime
        return filterObj(param)
      },
      onDateChange: function (value, dateString) {
        this.queryParam.createTime_begin = dateString[0]
        this.queryParam.createTime_end = dateString[1]
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>