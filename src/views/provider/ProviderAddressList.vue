<!--供应商地址库-->
<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <!--<a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="创建年">
              <a-input placeholder="请输入创建年" v-model="queryParam.year"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="创建月">
              <a-input placeholder="请输入创建月" v-model="queryParam.month"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="创建日">
                <a-input placeholder="请输入创建日" v-model="queryParam.day"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="删除状态（0，正常，1已删除）">
                <a-input placeholder="请输入删除状态（0，正常，1已删除）" v-model="queryParam.delFlag"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="供应商id">
                <a-input placeholder="请输入供应商id" v-model="queryParam.sysUserId"></a-input>
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

        </a-row>-->
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <!-- <a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('供应商地址库')">导出</a-button>
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
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <span slot="isDeliver" slot-scope="text, record">
          <a-checkbox @change="onChange(record.id,record.isDeliver,'updataIsDeliverById')"
                      :checked="record.isDeliver == 1">默认</a-checkbox>
        </span>
        <span slot="isReturn" slot-scope="text, record">
          <a-checkbox @change="onChange(record.id,record.isReturn,'updataIsReturnById')"
                      :checked="record.isReturn == 1">默认</a-checkbox>
        </span>
        <span slot="action" slot-scope="text, record">

          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <providerAddress-modal ref="modalForm" @ok="modalFormOk"></providerAddress-modal>
  </a-card>
</template>

<script>
  import ProviderAddressModal from './modules/ProviderAddressModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAction } from '@/api/manage'

  export default {
    name: 'ProviderAddressList',
    mixins: [JeecgListMixin],
    inject: ['rush'],
    components: {
      ProviderAddressModal
    },
    data() {
      return {
        description: '供应商地址库管理页面',
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
            title: '联系人',
            align: 'center',
            dataIndex: 'contactName'
          },
          {
            title: '手机号',
            align: 'center',
            dataIndex: 'contactPhone'
          },
          {
            title: '电话号',
            align: 'center',
            dataIndex: 'contactTelephone'
          },
          {
            title: '所在城市',
            align: 'center',
            dataIndex: 'areaAddress'
          },
          {
            title: '详细地址',
            align: 'center',
            dataIndex: 'detailedAddress'
          },
          {
            title: '是否默认发货地址',
            align: 'center',
            dataIndex: 'isDeliver',
            scopedSlots: { customRender: 'isDeliver' }
          },
          {
            title: '是否默认退货地址',
            align: 'center',
            dataIndex: 'isReturn',
            scopedSlots: { customRender: 'isReturn' }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/providerAddress/providerAddress/list',
          delete: '/providerAddress/providerAddress/delete',
          deleteBatch: '/providerAddress/providerAddress/deleteBatch',
          exportXlsUrl: 'providerAddress/providerAddress/exportXls',
          importExcelUrl: 'providerAddress/providerAddress/importExcel',
          updataIsDeliverById: 'providerAddress/providerAddress/updataIsDeliverById',
          updataIsReturnById: 'providerAddress/providerAddress/updataIsReturnById'
        },
        addressId: '',
        isReturn: '',
        isDeliver: ''
      }
    },
    computed: {
      importExcelUrl: function() {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
      }
    },
    methods: {
      //id  原判断值  请求地址字段
      onChange(id, pd, url) {
        let result = pd == 0 ? 1 : 0
        for (let a = 0; a < this.dataSource.length; a++) {
          if (this.dataSource[a].id == id && url == 'updataIsDeliverById') {
            this.dataSource[a].isDeliver = result
            break
          }
          if (this.dataSource[a].id == id && url == 'updataIsReturnById') {
            this.dataSource[a].isReturn = result
            break
          }
        }
        this.$nextTick(() => {
          let obj
          if (url == 'updataIsDeliverById') {
            obj = {
              id,
              isDeliver: result
            }
          } else {
            obj = {
              id,
              isReturn: result
            }
          }
          //接口接入
          getAction(this.url[url], obj).then((res) => {
            if (res.success) {
              this.$message.success(res.message)
              this.rush()
            } else {
              this.$message.warning(res.message)
              this.rush()
            }
          })
        })

      }
    }
  }
</script>
<style scoped lang="less">

  .table-operator{
    margin-bottom: 10px;
  }
</style>