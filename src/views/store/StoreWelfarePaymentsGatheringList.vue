<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="8" :sm="8">
            <a-form-item label="店铺编号">
              <a-input placeholder="请输入" v-model="queryParam.storeManageId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="店铺账号">
              <a-input placeholder="请输入" v-model="queryParam.username"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="联系人">
              <a-input placeholder="请输入" v-model="queryParam.bossName"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="门店地址">
                <a-input placeholder="请输入" v-model="queryParam.storeAddress"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="店铺分类">
                <j-dict-select-tag v-model="queryParam.mainType" placeholder="请选择"
                                   dictCode="store_main_type"/>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="8">
              <a-form-item
                label="所在城市">
                <selectAddress ref="selectAddress" @cityAllDataLoad="cityAllDataLoad"
                               style="margin: 0 10px;width: 100%;">

                </selectAddress>
              </a-form-item>
            </a-col>


            <a-col :md="8" :sm="8">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="店铺分类">

                <a-select placeholder="请选择店铺分类" style="width:100px;margin-right: 10px;"
                          v-model="storeTypeIdOne"
                          @change="getStoreClassifactionListSecond">
                  <a-select-option value="">
                    请选择
                  </a-select-option>
                  <a-select-option :value="item.id" v-for="(item,index) in storeClassifactionList" :key="index">
                    {{item.typeName}}
                  </a-select-option>
                </a-select>

                <a-select placeholder="请选择店铺分类" style="width:100px;margin-right: 10px;"
                          v-model="storeTypeIdTwo"
                          :disabled="storeClassifactionListSecond.length <= 0" @change="setStoreTypeId">
                  <a-select-option value="">
                    请选择
                  </a-select-option>
                  <a-select-option :value="item.id" v-for="(item,index) in storeClassifactionListSecond" :key="index">
                    {{item.typeName}}
                  </a-select-option>
                </a-select>

              </a-form-item>
            </a-col>


            <a-col :md="8" :sm="8">
              <a-form-item label="状态">
                <a-select v-model="queryParam.status" placeholder="请选择" style="margin-right: 10px;">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option :value="0">停用</a-select-option>
                  <a-select-option :value="1">启用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <!--<a-col :md="8" :sm="8">-->
            <!--<a-form-item label="创建时间">-->
            <!--<a-range-picker-->
            <!--style="width: 100%"-->
            <!--v-model="queryParam.createTime"-->
            <!--format="YYYY-MM-DD"-->
            <!--:placeholder="['开始时间', '结束时间']"-->
            <!--@change="onDateChange"-->
            <!--@ok="onDateOk"-->
            <!--/>-->
            <!--</a-form-item>-->
            <!--</a-col>-->
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
      <!--<a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('福利金收款商家')">导出</a-button>
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
        rowKey="id"
        :scroll="{x:2500}"
        :columns="columns"
        bordered
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status==0">停用</span>
            <span shape="square" v-if="record.status==1">启用</span>
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
    <storeWelfarePaymentsGathering-modal ref="modalForm" @ok="modalFormOk"></storeWelfarePaymentsGathering-modal>
  </a-card>
</template>

<script>
  import StoreWelfarePaymentsGatheringModal from './modules/StoreWelfarePaymentsGatheringModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { filterObj } from '@/utils/util'
  import { httpAction, getAction } from '@/api/manage'
  import selectAddress from '@/components/selectAddress/selectAddress'

  export default {
    name: 'StoreWelfarePaymentsGatheringList',
    mixins: [JeecgListMixin],
    components: {
      StoreWelfarePaymentsGatheringModal,
      selectAddress
    },
    data() {
      return {

        storeTypeIdOne: '',
        storeTypeIdTwo: '',
        storeClassifactionList: [],//一级分类
        storeClassifactionListSecond: [],//二级分类
        description: '福利金收款商家管理页面',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: 'center',
            fixed: 'left',
            customRender: function(t, r, index) {
              return parseInt(index) + 1
            }
          },
          {
            title: '店铺编号',
            align: 'center',
            dataIndex: 'storeManageId'
          },
          {
            title: '店铺账号',
            align: 'center',
            dataIndex: 'username'
          },
          {
            title: '联系人',
            align: 'center',
            dataIndex: 'bossName'
          },
          {
            title: '联系人手机',
            align: 'center',
            dataIndex: 'bossPhone'
          },
          {
            title: '店铺名称',
            align: 'center',
            dataIndex: 'storeName'
          },
          {
            title: '所在城市',
            align: 'center',
            dataIndex: 'areaAddress'
          },
          {
            title: '门店地址',
            align: 'center',
            dataIndex: 'storeAddress'
          },
          {
            title: '店铺分类',
            align: 'center',
            dataIndex: 'storeTypeName'
          },
          {
            title: '状态',
            align: 'center',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' }
          },
          {
            title: '福利金抵扣最低值',
            align: 'center',
            dataIndex: 'storeSmallWelfarePayments',
            customRender: function(value) {
              return value + '%'
            }
          },
          {
            title: '福利金兑换余额比例',
            align: 'center',
            dataIndex: 'subscriptionRatio',
            customRender: function(value) {
              return value + '%'
            }
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
            fixed: 'right',
            width: 100,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/storeWelfarePaymentsGathering/storeWelfarePaymentsGathering/list',
          delete: '/storeWelfarePaymentsGathering/storeWelfarePaymentsGathering/delete',
          deleteBatch: '/storeWelfarePaymentsGathering/storeWelfarePaymentsGathering/deleteBatch',
          exportXlsUrl: 'storeWelfarePaymentsGathering/storeWelfarePaymentsGathering/exportXls',
          importExcelUrl: 'storeWelfarePaymentsGathering/storeWelfarePaymentsGathering/importExcel',
          findByParentId: '/sysArea/sysArea/findByParentId',
          getList: '/sysArea/sysArea/getList',
          queryById: '/sysArea/sysArea/queryById',
          getStoreTypeMap: 'storeType/storeType/getStoreTypeMap'//店铺分类
        }
      }
    },
    computed: {
      importExcelUrl: function() {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
      }
    },

    mounted() {
      this.getStoreClassifactionList()
    },

    methods: {

      //二级分分类选中
      setStoreTypeId(value) {
        this.queryParam.storeTypeId = value
      },

      //获取一级分类
      getStoreClassifactionList() {
        this.storeTypeIdTwo = ''
        getAction(this.url.getStoreTypeMap, { pId: '' }).then(res => {
          if (res.success) {
            this.storeClassifactionList = res.result
          }
        })
      },

      //获取二级分类
      getStoreClassifactionListSecond(value) {
        this.queryParam.storeTypeId = value
        this.storeClassifactionListSecond = []
        if (value) {
          getAction(this.url.getStoreTypeMap, { pId: value }).then(res => {
            if (res.success) {
              this.storeClassifactionListSecond = res.result
            }
          })
        }
      },


      searchReset() {
        if (this.$refs['selectAddress']) {
          this.$refs['selectAddress'].cleanData()
        }

        this.storeTypeIdOne = ''
        this.storeTypeIdTwo = ''
        this.queryParam = {}
        this.loadData(1)
      },

      getQueryParams() {

        var param = Object.assign({}, this.queryParam, this.isorter)
        param.field = this.getQueryField()
        param.pageNo = this.ipagination.current
        param.pageSize = this.ipagination.pageSize
        delete param.createTime
        return filterObj(param)
      },
      onDateChange: function(value, dateString) {
        this.queryParam.createTime_begin = dateString[0]
        this.queryParam.createTime_end = dateString[1]
      },

      async cityAllDataLoad(defaultCity) {
        this.defaultCity = defaultCity
        this.queryParam.areaAddress = ''
        for (let i = 0; i < defaultCity.length; i++) {
          await this.getCityName(defaultCity, i)
        }
      },
      async getCityName(defaultCity, i) {
        await getAction(this.url.queryById, { id: defaultCity[i] }).then((res) => {
          if (res.success) {
            if (i == defaultCity.length - 1) {
              this.queryParam.areaAddress += res.result.name
            } else {
              this.queryParam.areaAddress += res.result.name + ','
            }
          }
        })
      }
    }


  }
</script>
<style scoped>

</style>