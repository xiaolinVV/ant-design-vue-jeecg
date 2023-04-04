<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="广告标题">
              <a-input placeholder="请输入广告标题" v-model="queryParam.title"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="广告类型">
              <j-dict-select-tag v-model="queryParam.adType" placeholder="请选择广告类型" dictCode="ad_type" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="广告位置">
              <j-dict-select-tag v-model="queryParam.adLocation" placeholder="请选择广告位置" dictCode="ad_location" />
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="8">
            <a-form-item label="跳转类型">
              <a-select v-model="queryParam.goToType" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">无</a-select-option>
                <a-select-option :value="1">商品详情</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParam.status" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">停用</a-select-option>
                <a-select-option :value="1">启用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!--时间选择框-->
          <a-col :md="8" :sm="8">
            <a-form-item label="开始时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.startTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChangeStartTime"
                @ok="onDateOk"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="结束时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.endTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChangeEndTime"
                @ok="onDateOk"
              />
            </a-form-item>
          </a-col>
          <!--时间选择框-->
          <a-col :md="8" :sm="8">
            <a-form-item label="创建时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam.createTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
                @ok="onDateOk"
              />
            </a-form-item>
          </a-col>

          <template v-if="toggleSearchStatus"> </template>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <!--<a-button type="primary" icon="download" @click="handleExportXls('广告管理')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>-->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down"/></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;width: 100%">
      <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
      <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
      >项
      <a style="margin-left: 24px" @click="onClearSelected">清空</a>
    </div>
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :scroll="{ x: 2500 }"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="avatarslot" slot-scope="text, record, index">
          <img
            class="clickShowImage "
            :preview="'avatarslot' + index"
            :src="getAvatarView(record.pictureAddr)"
            alt=""
          />
        </template>
        <template slot="headColor" slot-scope="text">
          {{ text ? text : '-' }}
        </template>
        <template slot="goToType" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.goToType == 0">无</span>
            <span shape="square" v-if="record.goToType == 1">商品详情</span>
            <span shape="square" v-if="record.goToType == 2">详情图</span>
            <span shape="square" v-if="record.goToType == 3">素材</span>
          </div>
        </template>
        <template slot="goodName" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.goToType == 0">无</span>
            <span shape="square" v-if="record.goToType == 1">{{ record.goodName }}</span>
            <a-avatar
              v-if="record.goToType == 2"
              shape="square"
              :src="getAvatarView(record.pictureDetails)"
              icon="user"
            />
            <span shape="square" v-if="record.goToType == 3">{{ record.marketingMaterialTitle }}</span>
          </div>
        </template>

        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status == 0">停用</span>
            <span shape="square" v-if="record.status == 1">启用</span>
          </div>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleStatus(record.id)" v-if="record.status == 1">停用</a>
          <a @click="handleStatus(record.id)" v-if="record.status == 0">启用</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)"> <a>删除</a> </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingAdvertising-modal ref="modalForm" @ok="modalFormOk"></marketingAdvertising-modal>
  </a-card>
</template>

<script>
import MarketingAdvertisingModal from './modules/MarketingAdvertisingModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { putAction } from '@/api/manage'
import { getAction } from '@/api/manage'
import { frozenBatch } from '@/api/api'
import { mapGetters } from 'vuex'
import { filterObj } from '@/utils/util'
//字典
import { filterDictText, initDictOptions } from '@/components/dict/JDictSelectUtil'
export default {
  name: 'MarketingAdvertisingList',
  mixins: [JeecgListMixin],
  components: {
    MarketingAdvertisingModal
  },
  data() {
    return {
      description: '广告管理管理页面',
      userId: '',
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
          title: '广告标题',
          align: 'center',
          dataIndex: 'title'
        },
        {
          title: '广告类型',
          align: 'center',
          dataIndex: 'adType_dictText',
          sorter: true
        },
        {
          title: '广告位置', //建立数据字典读取，字典名称：ad_location；0:首页；1：分类
          align: 'center',
          dataIndex: 'adLocation',
          customRender: text => {
            //字典值替换通用方法
            return filterDictText(this.adLocation, text)
          }
        },
        {
          title: '图片',
          align: 'center',
          width: 120,
          dataIndex: 'pictureAddr',
          scopedSlots: { customRender: 'avatarslot' }
        },
        {
          title: '背景色',
          align: 'center',
          dataIndex: 'headColor',
          scopedSlots: { customRender: 'headColor' }
        },
        {
          title: '跳转类型', //；0：无；1：商品详情
          align: 'center',
          dataIndex: 'goToType',
          scopedSlots: { customRender: 'goToType' }
        },

        {
          title: '地址', //平台广告为空，店铺广告填写角色问店铺的商家
          align: 'center',
          dataIndex: 'goodName',
          scopedSlots: { customRender: 'goodName' }
        },
        {
          title: '排序',
          align: 'center',
          dataIndex: 'sort'
        },
        {
          title: '开始时间',
          align: 'center',
          dataIndex: 'startTime'
        },
        {
          title: '结束时间',
          align: 'center',
          dataIndex: 'endTime'
        },
        {
          title: '状态', //：0：停用；1：启用
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '创建者',
          align: 'center',
          dataIndex: 'createBy'
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '更新者',
          align: 'center',
          dataIndex: 'updateBy'
        },
        {
          title: '更新时间',
          align: 'center',
          dataIndex: 'updateTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 300,
          scopedSlots: { customRender: 'action' }
        }
      ],
      adLocation: [],
      url: {
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        list: '/marketingAdvertising/marketingAdvertising/list',
        delete: '/marketingAdvertising/marketingAdvertising/delete',
        deleteBatch: '/marketingAdvertising/marketingAdvertising/deleteBatch',
        updateStatus: '/marketingAdvertising/marketingAdvertising/updateStatus',
        exportXlsUrl: 'marketingAdvertising/marketingAdvertising/exportXls',
        importExcelUrl: 'marketingAdvertising/marketingAdvertising/importExcel'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    getAvatarView: function(pictureAddr) {
      return this.url.imgerver + '/' + pictureAddr
    },

    handleStatus: function(id) {
      var that = this
      getAction(that.url.updateStatus, { id: id }).then(res => {
        if (res.code == 200) {
          that.$message.success(res.message)
          that.loadData()
        } else {
          that.$message.success('修改失败')
        }
      })
    },
    ...mapGetters(['nickname', 'avatar', 'userInfo']),
    //
    init() {
      this.initIndex()
      this.userId = this.userInfo().id
      console.log('this.userId', this.userId)
    },
    initIndex() {
      initDictOptions('ad_location').then(res => {
        if (res.success) {
          this.adLocation = res.result
        }
      })
    },

    /**查询栏时间区间查询*/
    getQueryParams() {
      console.log(this.queryParam.createTime)
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.createTime // 时间参数不传递后台
      delete param.startTime // 时间参数不传递后台
      delete param.endTime // 时间参数不传递后台
      return filterObj(param)
    },
    onDateChange: function(value, dateString) {
      console.log('*****************************************************', dateString[0], dateString[1])
      this.queryParam.createTime_begin = dateString[0]
      this.queryParam.createTime_end = dateString[1]
    },

    onDateChangeStartTime: function(value, dateString) {
      console.log('*****************************************************', dateString[0], dateString[1])
      this.queryParam.startTime_begin = dateString[0]
      this.queryParam.startTime_end = dateString[1]
    },
    onDateChangeEndTime: function(value, dateString) {
      console.log('*****************************************************', dateString[0], dateString[1])
      this.queryParam.endTime_begin = dateString[0]
      this.queryParam.endTime_end = dateString[1]
    },
    onDateOk(value) {
      console.log(value)
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
/* .ant-table-wrapper {
    width: 2000px;
    !*overflow-x: scroll !important;*!
  }*/
</style>
