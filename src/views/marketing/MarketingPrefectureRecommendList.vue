<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="8" :sm="8">
            <a-form-item label="专区id">
              <a-input placeholder="请输入" v-model="queryParam.marketingPrefectureId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="专区名称">
              <a-input placeholder="请输入" v-model="queryParam.prefectureName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="推荐名称">
              <a-input placeholder="请输入" v-model="queryParam.recommendName"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="呈现方式">
                <a-select v-model="queryParam.appearType" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option value="0">栏目推荐</a-select-option>
                  <a-select-option value="1">列表推荐</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="状态">
                <a-select v-model="queryParam.status" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option value="0">停用</a-select-option>
                  <a-select-option value="1">启用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="创建时间">
                <a-range-picker
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange"
                  @ok="onDateOk"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="更新时间">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.updateTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange1"
                  @ok="onDateOk"
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
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('专区推荐')">导出</a-button>
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
    </div>

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
        :scroll="{x:2000}"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <template slot="appearType" slot-scope="text, record">
          <span v-if="text == 1">
            列表推荐
          </span>
          <span v-else>
            栏目推荐
          </span>
        </template>
        <template slot="coverPicture" slot-scope="text, record,index">
          <span v-if="record.appearType == 1">
            -
          </span>
          <img class="clickShowImage " :preview="'coverPicture' + index" :src="handleImageUrl(text)" alt="" v-else>
        </template>
        <template slot="recommendClassify" slot-scope="text, record">
          <span v-if="record.appearType != 1">
            -
          </span>
          <span v-else-if="text == 1">
            显示
          </span>
          <span v-else>
            不显示
          </span>
        </template>
        <template slot="status" slot-scope="text, record">
          <span v-if="text == 1">
            启用
          </span>
          <span v-else>
            停用
          </span>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
            <a v-if="record.status==1" @click="showStopStatus(record)">停用</a>
            <a v-else @click="showStartStatus(record)">启用</a>
          <a-divider type="vertical"/>
<!--           <a @click="showDelete(record)">删除</a>-->
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
           </a-popconfirm>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <prefectureRecommendStopOrStartModal ref="modalForm3" @ok="modalFormOk">
    </prefectureRecommendStopOrStartModal>
    <marketingPrefectureRecommend-modal ref="modalForm" @ok="modalFormOk"></marketingPrefectureRecommend-modal>
  </a-card>
</template>

<script>
  import { filterObj } from '@/utils/util';
  import MarketingPrefectureRecommendModal from './modules/MarketingPrefectureRecommendModal'
  import prefectureRecommendStopOrStartModal from './modules/prefectureRecommendStopOrStartModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'

  export default {
    name: "MarketingPrefectureRecommendList",
    mixins: [JeecgListMixin],
    components: {
      MarketingPrefectureRecommendModal,
      prefectureRecommendStopOrStartModal
    },
    data () {
      return {
        description: '专区推荐管理页面',
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
            title: '专区id',
            align: "center",
            dataIndex: 'marketingPrefectureId'
          },
          {
            title: '专区名称',
            align: "center",
            dataIndex: 'prefectureName'
          },
          {
            title: '推荐名称',
            align: "center",
            dataIndex: 'recommendName'
          },
          {
            title: '呈现方式',
            align: "center",
            dataIndex: 'appearType',
            scopedSlots: { customRender: 'appearType' },
          },
          {
            title: '推荐封面',
            align: "center",
            dataIndex: 'coverPicture',
            scopedSlots: { customRender: 'coverPicture' },
          },
          {
            title: '分类推荐',
            align: "center",
            dataIndex: 'recommendClassify',
            scopedSlots: { customRender: 'recommendClassify' },
          },
          {
            title: '排序',
            align: "center",
            dataIndex: 'sort'
          },
          {
            title: '状态',
            align: "center",
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' },
          },
          {
            title: '停用说明',
            align: "center",
            dataIndex: 'closeExplain'
          },
          {
            title: '创建时间',
            align: "center",
            dataIndex: 'createTime'
          },
          {
            title: '创建者',
            align: "center",
            dataIndex: 'createBy'
          },
          {
            title: '更新时间',
            align: "center",
            dataIndex: 'updateTime'
          },
          {
            title: '更新者',
            align: "center",
            dataIndex: 'updateBy'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
            fixed:"right",
            width:150
          }
        ],
        configure: {
          imgErver: window._CONFIG['domianURL'] + '/sys/common/view',
          fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
        },
        url: {
          list: "/marketingPrefectureRecommend/marketingPrefectureRecommend/list",
          delete: "/marketingPrefectureRecommend/marketingPrefectureRecommend/delete",
          deleteBatch: "/marketingPrefectureRecommend/marketingPrefectureRecommend/deleteBatch",
          exportXlsUrl: "marketingPrefectureRecommend/marketingPrefectureRecommend/exportXls",
          importExcelUrl: "marketingPrefectureRecommend/marketingPrefectureRecommend/importExcel",
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      showDelete(record = {}){
        this.$refs.modalForm3.showDelete(record);
      },
      showStopStatus(record = {}){
        this.$refs.modalForm3.showModalStopStatus(record);
      },
      showStartStatus(record = {}){
        this.$refs.modalForm3.showStartStatus(record);
      },
      //text
      handleImageUrl(url){
        if(url){
          return this.configure.imgErver + '/' + Object.values(JSON.parse(url))[0]
        }else{
          return ''
        }
      },
      /**查询栏时间区间查询*/
      getQueryParams(){
        var param = Object.assign({}, this.queryParam, this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        delete param.createTime;
        delete param.updateTime;
        return filterObj(param);
      },
      onDateChange: function (value, dateString) {
        this.queryParam.createTime_begin = dateString[0];
        this.queryParam.createTime_end = dateString[1];
      },
      onDateChange1: function (value, dateString) {
        this.queryParam.updateTime_begin = dateString[0];
        this.queryParam.updateTime_end = dateString[1];
      },
    }
  }
</script>
<style scoped>
</style>