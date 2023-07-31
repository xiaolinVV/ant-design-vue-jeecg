<template>
  <div class="marketingPrefectureType">
    <div style="width:calc(100vw - 250px)">
      <div style="clear: both"></div>
      <a-card :bordered="false" style="width: 19%;min-height: 700px;background: white;float: left">
        <a-spin :spinning="cardLoading">
          <a-input-search placeholder="请输入专区名称" @search="onSearch" enterButton />
          <a-list itemLayout="horizontal" :dataSource="listData">
            <div class="line-render-item" slot="renderItem" slot-scope="item, index" @click="loadData(item, true)">
              <img preview="1" :src="item['logoAddr']" alt="" />
              <div :class="{ 'select-color': item.id == marketingPrefectureId }">
                {{ item.prefectureName }}
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
              <a-col :md="6" :sm="8">
                <a-form-item label="专区分类id">
                  <a-input placeholder="请输入" v-model="queryParam.id"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="8">
                <a-form-item label="专区分类">
                  <a-input placeholder="请输入" v-model="queryParam.typeName"></a-input>
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
              <!--时间选择框-->
              <a-col :md="6" :sm="8">
                <a-form-item label="更新时间">
                  <a-range-picker
                    style="width: 100%"
                    format="YYYY-MM-DD"
                    :placeholder="['开始时间', '结束时间']"
                    @change="onDateChange"
                    @ok="onDateOk"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="8">
                <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                  <a-button type="primary" @click="loadData({ id: marketingPrefectureId }, true)" icon="search"
                    >查询</a-button
                  >
                  <a-button
                    type="primary"
                    @click="
                      searchReset()
                      loadData({ id: marketingPrefectureId }, true)
                    "
                    icon="reload"
                    style="margin-left: 8px"
                    >重置</a-button
                  >
                  <!--              <a @click="handleToggleSearch" style="margin-left: 8px">-->
                  <!--                {{ toggleSearchStatus ? '收起' : '展开' }}-->
                  <!--                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>-->
                  <!--              </a>-->
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>

        <!-- 操作按钮区域 -->
        <div class="table-operator">
          <a-button @click="handleAdd(marketingPrefectureId)" type="primary" icon="plus">新增</a-button>
          <!-- <a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('平台专区分类')">导出</a-button>
          <a-upload
            name="file"
            :showUploadList="false"
            :multiple="false"
            :headers="tokenHeader"
            :action="importExcelUrl"
            @change="handleImportExcel"
          >
            <a-button type="primary" icon="import">导入</a-button>
          </a-upload> -->
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
            rowKey="onlyKey"
            :columns="columns"
            :scroll="{ x: 1500 }"
            :expandedRowKeys="expandedRowKeys"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            @change="handleTableChange"
            @expand="handleExpand"
            v-bind="tableProps"
          >
            <template slot="status" slot-scope="text, record, index">
              <div class="anty-img-wrap">
                <span shape="square" v-if="record.status == 0">停用</span>
                <span shape="square" v-if="record.status == 1">启用</span>
              </div>
            </template>
            <template slot="level" slot-scope="text, record, index">
              <div class="anty-img-wrap">
                <span shape="square" v-if="record.level == 1">一级分类</span>
                <span shape="square" v-if="record.level == 2">二级分类</span>
              </div>
            </template>
            <template slot="logoAddr" slot-scope="text, record, index">
              <img class="clickShowImage " :preview="'logoAddr' + index" :src="handleImage(text)" alt="" />
            </template>
            <span slot="action" slot-scope="text, record">
              <!--           @click="editData(record,'child')" v-if="record.level <= 1 " -->
              <a @click="handleEdit(record, '添加子分类')" v-if="record.level <= 1">添加子分类</a>
              <a-divider type="vertical" v-if="record.level <= 1" />
              <a @click="handleEdit(record, '编辑')">编辑</a>
              <a-divider type="vertical" />
              <a v-if="record.status == 1" @click="showModalStopStatus(record.id, '0')">停用</a>
              <a v-if="record.status == 0" @click="updateStatus(record.id, '1')">启用</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                <a>删除</a>
              </a-popconfirm>
            </span>
          </a-table>
        </div>
        <!-- table区域-end -->

        <!-- 表单区域 -->
        <marketingPrefectureType-modal ref="modalForm" @ok="modalFormOk"></marketingPrefectureType-modal>
      </a-card>
      <div style="clear: both"></div>
    </div>
  </div>
</template>

<script>
import MarketingPrefectureTypeModal from './modules/MarketingPrefectureTypeModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction, putAction } from '@/api/manage'
import { filterObj } from '@/utils/util'

export default {
  name: 'MarketingPrefectureTypeList',
  mixins: [JeecgListMixin],
  components: {
    MarketingPrefectureTypeModal
  },
  data() {
    return {
      description: '平台专区分类管理页面',
      listData: [],
      //卡片加载
      cardLoading: false,
      marketingPrefectureId: '',
      expandedRowKeys: [],
      hasChildrenField: 'hasChild',
      pidField: 'id',
      // 表头
      columns: [
        // {
        //   title: '#',
        //   dataIndex: '',
        //   key: 'rowIndex',
        //   width: 60,
        //   align: 'right',
        //   customRender: function(t, r, index) {
        //     return parseInt(index) + 1
        //   }
        // },
        {
          title: '专区分类id',
          align: 'left',
          dataIndex: 'id'
        },

        {
          title: '专区分类名称',
          align: 'center',
          dataIndex: 'typeName'
        },
        {
          title: '分类级别',
          align: 'center',
          dataIndex: 'level',
          scopedSlots: { customRender: 'level' }
        },
        {
          title: '分类图片',
          align: 'center',
          dataIndex: 'logoAddr',
          scopedSlots: { customRender: 'logoAddr' }
        },
        {
          title: '专区分类排序',
          align: 'center',
          dataIndex: 'sort'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '停用说明',
          align: 'center',
          dataIndex: 'closeExplain'
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '创建者',
          align: 'center',
          dataIndex: 'createBy'
        },
        {
          title: '更新时间',
          align: 'center',
          dataIndex: 'updateTime'
        },
        {
          title: '更新者',
          align: 'center',
          dataIndex: 'updateBy'
        },

        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
          fixed: 'right',
          width: 250
        }
      ],
      url: {
        //专区分类右边 参数 marketingPrefectureType  marketingPrefectureId(必填)
        list: '/marketingPrefectureType/marketingPrefectureType/list',
        delete: '/marketingPrefectureType/marketingPrefectureType/delete',
        deleteBatch: '/marketingPrefectureType/marketingPrefectureType/deleteBatch',
        exportXlsUrl: 'marketingPrefectureType/marketingPrefectureType/exportXls',
        importExcelUrl: 'marketingPrefectureType/marketingPrefectureType/importExcel',
        updateStatus: '/marketingPrefectureType/marketingPrefectureType/updateStatus',
        edit: '/marketingPrefectureType/marketingPrefectureType/edit',
        //专区分类左边  参数 prefectureName null || 指定名字
        getMarketingPrefecture: '/marketingPrefecture/marketingPrefecture/getMarketingPrefecture',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        childList: 'marketingPrefectureType/marketingPrefectureType/getUnderlingList'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
    tableProps() {
      let _this = this
      return {
        // 列表项是否可选择
        rowSelection: {
          selectedRowKeys: _this.selectedRowKeys,
          onChange: selectedRowKeys => (_this.selectedRowKeys = selectedRowKeys)
        }
      }
    }
  },
  created() {
    this.leftListMethods()
  },
  methods: {
    searchReset() {
      this.queryParam = {}
    },

    handleImage(url) {
      if (url) {
        url = this.url.imgerver + '/' + Object.values(JSON.parse(url))[0]
      } else {
        url = ''
      }
      return url
    },
    // 生成全局唯一id
    generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    },
    handleExpand(expanded, record) {
      // 判断是否是展开状态
      if (expanded) {
        this.expandedRowKeys.push(record.onlyKey)
        if (record.children.length > 0 && record.children[0].isLoading === true) {
          let params = this.getQueryParams() //查询条件
          params[this.pidField] = record.id
          getAction(this.url.childList, params).then(res => {
            if (res.success) {
              if (res.result && res.result.length > 0) {
                record.children = this.getDataByResult(res.result)
                this.dataSource = [...this.dataSource]
              } else {
                record.children = ''
                record.hasChildrenField = '0'
              }
            } else {
              this.$message.warning(res.message)
            }
          })
        }
      } else {
        let keyIndex = this.expandedRowKeys.indexOf(record.onlyKey)
        if (keyIndex >= 0) {
          this.expandedRowKeys.splice(keyIndex, 1)
        }
      }
    },
    loadData(
      item = {
        id: this.marketingPrefectureId
      },
      isMore = false
    ) {
      if (isMore) {
        this.ipagination.current = 1
      }
      let marketingPrefectureId = item.id
      let info = Object.assign({}, { marketingPrefectureId }, this.queryParam, {
        pageNo: this.ipagination.current,
        pageSize: 10
      })
      this.loading = true
      this.marketingPrefectureId = marketingPrefectureId
      this.expandedRowKeys = []
      getAction(this.url.list, info).then(res => {
        if (res.success) {
          this.dataSource = this.getDataByResult(res.result.records)
          this.ipagination.total = res.result.total
          console.log(res)
        }
        this.loading = false
      })
    },
    getDataByResult(result) {
      return result.map(item => {
        //判断是否标记了带有子节点
        item.onlyKey = this.generateUUID()
        if (item[this.hasChildrenField] == '1') {
          let loadChild = {
            id: item.id,
            name: 'loading...',
            isLoading: true,
            onlyKey: this.generateUUID(),
            level: item.level
          }
          item.children = [loadChild]
        }
        return item
      })
    },
    //搜索
    onSearch(value) {
      this.leftListMethods(value)
    },
    handleTableChange(pagination, filters, sorter) {
      this.ipagination = pagination
      this.loadData({
        id: this.marketingPrefectureId
      })
    },
    //新增
    handleAdd: function() {
      // marketingPrefectureId
      this.$refs.modalForm.add(this.marketingPrefectureId)
      this.$refs.modalForm.title = '新增'
      this.$refs.modalForm.disableSubmit = false
    },

    // 分类左边方法封装
    leftListMethods(prefectureName = '') {
      this.cardLoading = true
      getAction(this.url.getMarketingPrefecture, {
        prefectureName,
        isViewType: '1',
        isViewPrefectureRecommended: ''
      }).then(res => {
        if (res.success) {
          if (res.result.length > 0) {
            this.marketingPrefectureId = res.result[0].id
            this.loadData(res.result[0])
          }
          for (let item of res.result) {
            if (item['logoAddr']) {
              item['logoAddr'] = this.url.imgerver + '/' + Object.values(JSON.parse(item['logoAddr']))[0]
            } else {
              item['logoAddr'] = ''
            }
          }
          this.listData = res.result
        }
        this.cardLoading = false
      })
    },
    //启用
    updateStatus: function(id, status) {
      //this.stopRemark="";
      if (!this.url.edit) {
        this.$message.error('请设置url.updateFrameStatus属性!')
        return
      }
      var that = this
      this.$confirm({
        title: '启用专区分类后，在专区中将展示该专区分类',
        content: '您确定要启用吗？',
        onOk: function() {
          putAction(that.url.edit, { id, closeExplain: '', status: status }).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadData()
              that.onClearSelected()
            } else {
              that.$message.warning(res.message)
            }
          })
        }
      })
    },
    //停用
    showModalStopStatus(id) {
      this.$refs.modalForm.showModalStopStatus(id)
      this.$refs.modalForm.title = '停用'
      this.$refs.modalForm.disableSubmit = false
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
    }
  }
}
</script>
<style lang="less">
.marketingPrefectureType {
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
    font-size: 14px;
    font-weight: 700;
    min-height: 60px;
    width: 100%;
    img {
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }
  }

  .line-render-item:hover {
    cursor: pointer;
    color: #1890ff;
  }
}
</style>
