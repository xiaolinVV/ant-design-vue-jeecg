<!--店铺余额-->
<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="账号">
              <a-input placeholder="请输入" v-model="queryParam.userName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="联系人">
              <a-input placeholder="请输入" v-model="queryParam.bossName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="联系人手机">
              <a-input placeholder="请输入" v-model="queryParam.bossPhone"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="店铺名称">
                <a-input placeholder="请输入" v-model="queryParam.storeName"></a-input>
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
              <a-form-item
                label="所在城市">
                <selectAddress ref="selectAddress" @cityAllDataLoad="cityAllDataLoad"
                               style="margin: 0 10px;width: 100%;">
                </selectAddress>
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
      <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
      <!--<a-button type="primary" icon="download" @click="handleExportXls('店铺余额')">导出</a-button>-->
      <!-- <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
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
        :scroll="{x:1000}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
      </a-table>
    </div>
    <!-- table区域-end -->

  </a-card>
</template>

<script>
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import {filterObj} from '@/utils/util';
  import {getAction, postAction,httpAction} from '@/api/manage'
  import Vue from 'vue'
  import selectAddress from '@/components/selectAddress/selectAddress'
  export default {
    name: "StoreBalanceList",
    mixins: [JeecgListMixin],
    components: {
      selectAddress
    },
    data () {
      return {
        description: '店铺余额',
        storeClassifactionList: [],//一级分类
        storeClassifactionListSecond: [],//二级分类
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            fixed: 'left',
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '账号',
            align: "center",
            dataIndex: 'userName'
          },
          {
            title: '店铺名称',
            align: "center",
            dataIndex: 'storeName'
          },
          {
            title: '城市',
            align: "center",
            dataIndex: 'areaAddress'
          },
          {
            title: '联系人',
            align: "center",
            dataIndex: 'bossName'
          },
          {
            title: '联系人手机',
            align: "center",
            dataIndex: 'bossPhone'
          },
          {
            title: '状态',
            align: "center",
            dataIndex: 'statusName'
          },
          {
            title: '余额',
            align: "center",
            dataIndex: 'balance'
          },
        ],
        url: {
          list: "/storeManage/storeManage/findStoreBalance",
          findByParentId: '/sysArea/sysArea/findByParentId',
          getList: '/sysArea/sysArea/getList',
          queryById: '/sysArea/sysArea/queryById',
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    mounted() {
      this.getStoreClassifactionList()
    },
    methods: {
      getAvatarView: function (mainPicture) {
        return this.url.imgerver + "/" + mainPicture;
      },
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