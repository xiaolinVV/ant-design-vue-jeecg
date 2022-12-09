<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="8" :sm="8">
            <a-form-item label="资金池编号">
              <a-input placeholder="请输入" v-model="queryParam.id"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="资金池类型">
              <a-select v-model="queryParam.capitalType" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">非称号</a-select-option>
                <a-select-option :value="1">称号</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="资金池名称">
              <a-input placeholder="请输入" v-model="queryParam.capitalName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="称号资金开关">
              <a-select v-model="queryParam.sessionControl" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">关闭</a-select-option>
                <a-select-option :value="1">开启</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="创建时间">
              <j-date
                placeholder="请选择开始日期"
                class="query-group-cust"
                v-model="queryParam.createTime_begin"
              ></j-date>
              <span class="query-group-split-cust"></span>
              <j-date
                placeholder="请选择结束日期"
                class="query-group-cust"
                v-model="queryParam.createTime_end"
              ></j-date>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="更新时间">
              <j-date
                placeholder="请选择开始日期"
                class="query-group-cust"
                v-model="queryParam.updateTime_begin"
              ></j-date>
              <span class="query-group-split-cust"></span>
              <j-date
                placeholder="请选择结束日期"
                class="query-group-cust"
                v-model="queryParam.updateTime_end"
              ></j-date>
            </a-form-item>
          </a-col>
          <!--<template v-if="toggleSearchStatus">

            </template>-->
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <!-- <a @click="handleToggleSearch" style="margin-left: 8px">
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <!--<a-button type="primary" icon="download" @click="handleExportXls('资金配置')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>-->
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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <template slot="sessionControl" slot-scope="text, record, index">
          <div class="anty-img-wrap" v-if="record.sessionControl =='0' ">关闭 </div>
          <div class="anty-img-wrap" v-if="record.sessionControl =='1' ">开启,{{record.weeks}} </div>
        </template>
        <template slot="amountShare" slot-scope="text, record, index">
          <div class="anty-img-wrap" v-if="record.whetherDividend =='0' ">无 </div>
          <div class="anty-img-wrap" v-if="record.whetherDividend =='1' ">{{record.amountShare}} </div>
        </template>
        <template slot="investmentAmount" slot-scope="text, record, index">
          <div class="anty-img-wrap" v-if="record.whetherComplex =='0' ">无 </div>
          <div class="anty-img-wrap" v-if="record.whetherComplex =='1' ">{{record.investmentAmount}} </div>
        </template>
        <template slot="isView" slot-scope="text, record, index">
          <div class="anty-img-wrap" v-if="record.capitalType =='1' ">-</div>
          <div class="anty-img-wrap" v-if="record.capitalType =='0'">
            <a-switch
              checkedChildren="显示"
              unCheckedChildren="隐藏"
              v-model="record.isView"
              @change="switchChange(record)"
            />
          </div>
        </template>
        <span slot="action" slot-scope="text, record">
          <a v-if="record.sessionControl == 1" @click="showTextareaModal(record, 1)">称号资金停用</a>
          <a v-else @click="showTextareaModal(record, 2)">称号资金启用</a>
          <a-divider type="vertical"/>
          <a @click="handleEdit(record)">编辑</a>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingBusinessCapital-modal ref="modalForm" @ok="modalFormOk"></marketingBusinessCapital-modal>
    <textAreaModal
      ref="modalForm2"
      :infos="modalForm2Infos"
      :record="modalForm2Record"
      @ok="modalForm2Ok"
    ></textAreaModal>
  </a-card>
</template>

<script>
  import MarketingBusinessCapitalModal from './modules/MarketingBusinessCapitalModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import JDate from '@/components/jeecg/JDate.vue'
  import { postAction } from '@/api/manage'
  import textAreaModal from '@/components/popUp/textAreaModal'
  import Vue from 'vue'
  export default {
    name: "MarketingBusinessCapitalList",
    mixins: [JeecgListMixin],
    components: {
      textAreaModal,
      JDate,
      MarketingBusinessCapitalModal
    },
    inject: ['rush'],
    data () {
      return {
        description: '资金配置管理页面',
        modalForm2Record: {},
        modalForm2Infos: {},
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
            title: '资金池编号',
            align: "center",
            dataIndex: 'id'
          },
          {
            title: '资金池类型',
            align: "center",
            dataIndex: 'capitalType',
            scopedSlots: {
              customRender: 'capitalType'
            },
            customRender: function (text) {
              if (text == 0) {
                return '非称号'
              } else if (text == 1) {
                return '称号'
              }
            }
          },
          {
            title: '资金池名称',
            align: "center",
            dataIndex: 'capitalName',
          },
          {
            title: '进账比例',
            align: "center",
            dataIndex: 'makeProportion'
          },
          {
            title: '进账开关',
            align: "center",
            dataIndex: 'sessionControl',
            scopedSlots: {
              customRender: 'sessionControl'
            },
          },
          {
            title: '出账方式',
            align: "center",
            dataIndex: 'paymentsModel',
            scopedSlots: {
              customRender: 'paymentsModel'
            },
            customRender: function (text) {
              if (text == 0) {
                return '无'
              } else if (text == 1) {
                return '每日分红'
              }else {
                return '手动出账'
              }
            }
          },
          {
            title: '分红金额',
            align: "center",
            dataIndex: 'amountShare',
            scopedSlots: {
              customRender: 'amountShare'
            },
          },
          {
            title: '复投金额',
            align: "center",
            dataIndex: 'investmentAmount',
            scopedSlots: {
              customRender: 'investmentAmount'
            },
          },
          {
            title: '是否显示',
            align: "center",
            dataIndex: 'isView',
            width: 100,
            scopedSlots: {
              customRender: 'isView'
            },
          },
          {
            title: '说明',
            align: "center",
            dataIndex: 'sessionControlExplain'
          },
          {
            title: '创建时间',
            align: "center",
            dataIndex: 'createTime'
          },
          {
            title: '创建人',
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
          }
        ],
        url: {
          list: "/marketingBusinessCapital/marketingBusinessCapital/list",
          delete: "/marketingBusinessCapital/marketingBusinessCapital/delete",
          deleteBatch: "/marketingBusinessCapital/marketingBusinessCapital/deleteBatch",
          exportXlsUrl: "marketingBusinessCapital/marketingBusinessCapital/exportXls",
          importExcelUrl: "marketingBusinessCapital/marketingBusinessCapital/importExcel",
          isViewUpdate:"marketingBusinessCapital/marketingBusinessCapital/isViewUpdate",
          edit:"marketingBusinessCapital/marketingBusinessCapital/edit"
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      async showTextareaModal(record, type) {
        const allInfos = [
          {
            title: '停用',
            mainText: '关闭该资金分配项后,该称号的资金将停止累积。',
            explainSureText: '您确定要停用吗'
          },
          {
            title: '启用',
            mainText: '启用该称号资金后，该称号的资金将开始累积。',
            explainSureText: '您确定要启用吗'
          },
        ]
        this.modalForm2Record = record
        this.modalForm2Infos = allInfos[type - 1]
        await this.$nextTick()
        this.$refs.modalForm2.show()
      },
      async modalForm2Ok(infos) {
        const title = this.modalForm2Infos.title
        if (title == '停用') {
          infos.sessionControl = 0
        } else if (title == '启用') {
          infos.sessionControl = 1
        }
        let result
        if (title == '删除') {
          /*infos.delExplain = infos.modalExplain
          result = await postAction(this.url.delete, infos)*/
        } else {
          infos.sessionControlExplain = infos.modalExplain
          infos.isView = infos.isView?"1":"0"
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
      switchChange(item) {
        console.log(item)
        let info = {
          isView: item.isView ? true : false,
          id: item.id
        }
        postAction(this.url.isViewUpdate, info)
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>