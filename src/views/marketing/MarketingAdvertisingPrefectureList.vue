<template>
  <div class="MarketingAdvertisingPrefectureList">
    <div style="width:calc(100vw - 250px)">
      <div style="clear: both"></div>
      <a-card :bordered="false" style="width: 19%;min-height: 700px;background: white;float: left">
        <a-spin :spinning="cardLoading">
          <a-input-search placeholder="请输入专区名称" @search="onSearch" enterButton />
          <a-list itemLayout="horizontal" :dataSource="listData">
            <div class="line-render-item" slot="renderItem" slot-scope="item, index" @click="loadData(item)">
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
              <a-col :md="8" :sm="8">
                <a-form-item label="广告名称">
                  <a-input placeholder="请输入广告名称" v-model="queryParam.title"></a-input>
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
              <a-col :md="8" :sm="8">
                <a-form-item label="更新时间">
                  <a-range-picker
                    format="YYYY-MM-DD"
                    :placeholder="['开始时间', '结束时间']"
                    @change="onDateChange"
                    @ok="onDateOk"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="8">
                <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                  <a-button type="primary" @click="loadData({ id: marketingPrefectureId })" icon="search"
                    >查询</a-button
                  >
                  <a-button
                    type="primary"
                    @click="loadData({ id: marketingPrefectureId })"
                    icon="reload"
                    style="margin-left: 8px"
                    >重置</a-button
                  >
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>

        <!-- 操作按钮区域 -->
        <div class="table-operator">
          <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
          <!-- <a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('专区广告')">导出</a-button>
          <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader"
                    :action="importExcelUrl" @change="handleImportExcel">
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
            bordered
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            @change="handleTableChange"
          >
            <template slot="pictureAddr" slot-scope="text, record">
              <img class="clickShowImage " :preview="'pictureAddr' + index" :src="url.imgerver + '/' + text" alt="" />
            </template>
            <template slot="goToType" slot-scope="text, record">
              <div v-if="text == 1">
                商品详情
              </div>
              <div v-else>
                无
              </div>
            </template>
            <template slot="status" slot-scope="text, record">
              <div v-if="text == 1">
                启用
              </div>
              <div v-else>
                停用
              </div>
            </template>

            <span slot="action" slot-scope="text, record">
              <a @click="handleEdit(record)">编辑</a>

              <a-divider type="vertical" />
              <a v-if="record.status == 1" @click="showModalStopStatus(record.id, '0')">停用</a>
              <a v-if="record.status == 0" @click="updateStatus(record.id, '1')">启用</a>
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
            </span>
          </a-table>
        </div>
        <!-- table区域-end -->

        <!-- 表单区域 -->
        <marketingAdvertisingPrefecture-modal
          ref="modalForm"
          @ok="modalFormOk"
          :marketingPrefectureId="marketingPrefectureId"
        ></marketingAdvertisingPrefecture-modal>
      </a-card>
      <div style="clear: both"></div>
    </div>
  </div>
</template>

<script>
import MarketingAdvertisingPrefectureModal from './modules/MarketingAdvertisingPrefectureModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '@/api/manage'
export default {
  name: 'MarketingAdvertisingPrefectureList',
  mixins: [JeecgListMixin],
  components: {
    MarketingAdvertisingPrefectureModal
  },
  data() {
    return {
      description: '专区广告管理页面',
      listData: [],
      //卡片加载
      cardLoading: false,
      marketingPrefectureId: '',
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
          title: '图片',
          align: 'center',
          dataIndex: 'pictureAddr',
          scopedSlots: { customRender: 'pictureAddr' }
        },
        // ；0：无；1：商品详情
        {
          title: '跳转类型',
          align: 'center',
          dataIndex: 'goToType',
          scopedSlots: { customRender: 'goToType' }
        },
        // {
        //      title: '如果广告类型为0代表平台商品id，如果为1代表店铺商品的id',
        //      align:"center",
        //      dataIndex: 'goodListId'
        //     },
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
        // ：0：停用；1：启用
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '状态说明',
          align: 'center',
          dataIndex: 'closeExplain',
          customRender: function(closeExplain) {
            if (!closeExplain) {
              return '-'
            } else {
              return closeExplain
            }
          }
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
        // {
        //      title: '删除状态（0，正常，1已删除）',
        //      align:"center",
        //      dataIndex: 'delFlag'
        //     },
        // {
        //      title: '专区id',
        //      align:"center",
        //      dataIndex: 'marketingPrefectureId'
        //     },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/marketingAdvertisingPrefecture/marketingAdvertisingPrefecture/list',
        delete: '/marketingAdvertisingPrefecture/marketingAdvertisingPrefecture/delete',
        deleteBatch: '/marketingAdvertisingPrefecture/marketingAdvertisingPrefecture/deleteBatch',
        exportXlsUrl: 'marketingAdvertisingPrefecture/marketingAdvertisingPrefecture/exportXls',
        importExcelUrl: 'marketingAdvertisingPrefecture/marketingAdvertisingPrefecture/importExcel',
        //专区分类左边  参数 prefectureName null || 指定名字
        getMarketingPrefecture: '/marketingPrefecture/marketingPrefecture/getMarketingPrefecture',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        updateStatus: '/marketingAdvertisingPrefecture/marketingAdvertisingPrefecture/updateStatus'
      },
      queryParam: {
        createTime_begin: '',
        createTime_end: '',
        createTime: ''
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
    onDateChange: function(value, dateString) {
      console.log('*****************************************************', dateString[0], dateString[1])
      this.queryParam.createTime_begin = dateString[0]
      this.queryParam.createTime_end = dateString[1]
    },
    onDateOk(value) {
      console.log(value)
    },
    // 分类左边方法封装
    leftListMethods(prefectureName = '') {
      this.cardLoading = true
      getAction(this.url.getMarketingPrefecture, {
        prefectureName,
        isViewType: '',
        isViewPrefectureRecommended: ''
      }).then(res => {
        if (res.success) {
          if (res.result.length > 0) {
            this.marketingPrefectureId = res.result[0].id
            this.loadData(res.result[0], true)
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
    handleTableChange(pagination, filters, sorter) {
      this.ipagination = pagination
      this.loadData(
        {
          id: this.marketingPrefectureId
        },
        true
      )
    },
    loadData(
      item = {
        id: this.marketingPrefectureId
      },
      isMore = false
    ) {
      if (!isMore) {
        this.ipagination.current = 1
      }
      let marketingPrefectureId = item.id
      let info = Object.assign({}, { marketingPrefectureId }, this.queryParam, {
        pageNo: this.ipagination.current,
        pageSize: 10
      })
      this.loading = true
      this.marketingPrefectureId = marketingPrefectureId
      getAction(this.url.list, info).then(res => {
        if (res.success) {
          this.dataSource = res.result.records
          this.ipagination.total = res.result.total
          console.log(res)
        }
        this.loading = false
      })
    },
    //搜索
    onSearch(value) {
      this.leftListMethods(value)
    },
    //启用
    updateStatus: function(id, status) {
      //this.stopRemark="";
      if (!this.url.updateStatus) {
        this.$message.error('请设置url.updateFrameStatus属性!')
        return
      }
      var that = this
      this.$confirm({
        title: '启用专区广告后，在专区中将展示该专区广告',
        content: '您确定要启用吗？',
        onOk: function() {
          getAction(that.url.updateStatus, { ids: id, closeExplain: '', status: status }).then(res => {
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
    }
  }
}
</script>
<style lang="less">
.MarketingAdvertisingPrefectureList {
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
