<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="素材编号">
              <a-input placeholder="请输入" v-model="queryParam.id"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="标题">
              <a-input placeholder="请输入" v-model="queryParam.title"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="作者">
              <a-input placeholder="请输入" v-model="queryParam.author"></a-input>
            </a-form-item>
          </a-col>

          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="栏目">
                <a-select v-model="queryParam.marketingMaterialColumnId" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option v-for="item in marketingMaterialColumnList" :value="item.id"
                    >{{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="素材类型">
                <a-select v-model="queryParam.materialType" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option :value="1">图文素材</a-select-option>
                  <a-select-option :value="2">视频素材</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="状态">
                <a-select v-model="queryParam.isPublish" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option :value="0">取消发布</a-select-option>
                  <a-select-option :value="1">发布</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <!--时间选择框-->
            <a-col :md="6" :sm="8">
              <a-form-item label="创建时间">
                <a-range-picker
                  style="width: 210px"
                  v-model="queryParam.createTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange"
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
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="routerTo(1)" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('素材列表')">导出</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel"
      >
        <!-- <a-button type="primary" icon="import">导入</a-button>1 -->
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
      </a-dropdown>
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
        :scroll="{ x: true }"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="surfacePlot" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            v-if="record.surfacePlot != undefined"
            :preview="'surfacePlot' + index"
            :src="getAvatarView(record.surfacePlot)"
            alt=""
          />
          <a-avatar
            shape="square"
            v-if="record.surfacePlot == undefined || record.surfacePlot == ''"
            :src="getAvatarView(record.surfacePlot)"
            icon="user"
          />
        </template>
        <template slot="materialType" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.materialType == 1">图文</span>
            <span shape="square" v-if="record.materialType == 2">视频</span>
          </div>
        </template>
        <template slot="isPublish" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.isPublish == 0">未发布</span>
            <span shape="square" v-if="record.isPublish == 1">已发布</span>
          </div>
        </template>
        <template slot="dianzanCounts" slot-scope="text, record, index">
          <a @click="modalOpen(record, 'thumbsUp')">{{ text }}</a>
        </template>
        <template slot="browseCount" slot-scope="text, record, index">
          <a @click="modalOpen(record, 'browse')">{{ text }}</a>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="routerTo('2', record)">编辑</a>

          <a-divider type="vertical" />
          <a v-if="record.isPublish == 1" @click="updateIsPublish(record.id, '0')">取消发布</a>
          <a v-if="record.isPublish == 0" @click="updateIsPublish(record.id, '1')">发布</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <!--    browse-->
    <!--    thumbsUp-->
    <member-info-modal ref="modalForm" :type="infoModalType"></member-info-modal>
  </a-card>
</template>

<script>
import memberInfoModal from '@/components/popUp/memberInfoModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '@/api/manage'
import JDate from '@/components/jeecg/JDate'
import { filterObj } from '@/utils/util'

export default {
  name: 'MarketingMaterialListList',
  mixins: [JeecgListMixin],
  components: {
    memberInfoModal
  },
  data() {
    return {
      description: '素材列表管理页面',
      marketingMaterialColumnList: [],
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
          title: '编号',
          align: 'center',
          dataIndex: 'id'
        },

        {
          title: '素材标题',
          align: 'center',
          dataIndex: 'title'
        },
        {
          title: '封面图片',
          align: 'center',
          dataIndex: 'surfacePlot',
          scopedSlots: { customRender: 'surfacePlot' }
        },
        {
          title: '作者',
          align: 'center',
          dataIndex: 'author'
        },
        {
          title: '栏目',
          align: 'center',
          dataIndex: 'marketingMaterialColumnName'
        },
        {
          title: '素材类型', //；1：图文素材；2：视频素材
          align: 'center',
          dataIndex: 'materialType',
          scopedSlots: { customRender: 'materialType' }
        },
        {
          title: '关联商品',
          align: 'center',
          dataIndex: 'goodListCount'
        },
        {
          title: '初始浏览量',
          align: 'center',
          dataIndex: 'initialViews'
        },
        {
          title: '会员浏览量',
          align: 'center',
          dataIndex: 'browseCount',
          scopedSlots: { customRender: 'browseCount' }
        },
        {
          title: '初始赞数',
          align: 'center',
          dataIndex: 'initialPraise'
        },
        {
          title: '会员点赞数',
          align: 'center',
          dataIndex: 'dianzanCount',
          scopedSlots: { customRender: 'dianzanCounts' }
        },
        {
          title: '评论',
          align: 'center',
          dataIndex: 'commentCount'
        },
        {
          title: '排序',
          align: 'center',
          dataIndex: 'sort'
        },
        {
          title: '状态', //；0：否；1：是
          align: 'center',
          dataIndex: 'isPublish',
          scopedSlots: { customRender: 'isPublish' }
        },

        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        },

        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/marketingMaterialList/marketingMaterialList/list',
        delete: '/marketingMaterialList/marketingMaterialList/delete',
        deleteBatch: '/marketingMaterialList/marketingMaterialList/deleteBatch',
        exportXlsUrl: 'marketingMaterialList/marketingMaterialList/exportXls',
        importExcelUrl: 'marketingMaterialList/marketingMaterialList/importExcel',
        updateIsPublish: '/marketingMaterialList/marketingMaterialList/updateIsPublish',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        getMarketingMaterialColumnListMap:
          '/marketingMaterialColumn/marketingMaterialColumn/getMarketingMaterialColumnListMap'
      },
      infoModalType: 'browse'
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  mounted() {
    //获取素材栏目列表
    this.getMarketingMaterialColumnListMap()
  },
  methods: {
    getAvatarView: function(mainPicture) {
      if (mainPicture) {
        return this.url.imgerver + '/' + Object.values(JSON.parse(mainPicture))[0]
      } else {
        return ''
      }
    },
    routerTo(isEdit, record = {}) {
      localStorage.setItem('AddMarketingMaterialModelData', JSON.stringify(record))
      this.$router.push({ path: '/marketing/modules/AddMarketingMaterialModel', query: { isEdit } })
    },
    modalOpen(record = {}, infoModalType) {
      this.infoModalType = infoModalType
      this.$nextTick(() => {
        this.$refs.modalForm.edit(record)
      })
    },
    //发布修改
    updateIsPublish(id, isPublish) {
      getAction(this.url.updateIsPublish, { ids: id, isPublish: isPublish }).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.loadData()
          this.onClearSelected()
        } else {
          this.$message.warning(res.message)
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
      return filterObj(param)
    },
    onDateChange: function(value, dateString) {
      console.log('*****************************************************', dateString[0], dateString[1])
      this.queryParam.createTime_begin = dateString[0]
      this.queryParam.createTime_end = dateString[1]
    },
    onDateOk(value) {
      console.log(value)
    },
    getMarketingMaterialColumnListMap() {
      getAction(this.url.getMarketingMaterialColumnListMap).then(res => {
        if (res.success) {
          this.marketingMaterialColumnList = res.result
        } else {
          this.$message.warning(res.message)
        }
      })
    }
  }
}
</script>
<style scoped lang="less"></style>
