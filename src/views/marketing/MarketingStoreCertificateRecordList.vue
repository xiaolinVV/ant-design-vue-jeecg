<!--店铺兑换券记录列表-->
<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="手机号">
              <a-input placeholder="" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="昵称">
              <a-input placeholder="" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="券号">
              <a-input placeholder="" v-model="queryParam.qqzixuangu"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="兑换券名称">
                <a-input placeholder="" v-model="queryParam.name"></a-input>
              </a-form-item>
            </a-col>
            <!--<a-col :md="8" :sm="8">
              <a-form-item label="兑换商品">
                <a-input placeholder="" v-model="queryParam.year"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="核销门店">
                <a-input placeholder="" v-model="queryParam.year"></a-input>
              </a-form-item>
            </a-col>-->
            <a-col :md="8" :sm="8">
              <a-form-item label="状态">
                <j-dict-select-tag  v-model="queryParam.status"  placeholder="请选择状态"
                                    dictCode="vouchers_status"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="获取渠道">
                <a-input placeholder="" v-model="queryParam.theChannel"></a-input>
              </a-form-item>
            </a-col>
            <!--<a-col :md="8" :sm="8">
              <a-form-item label="核销人">
                <a-input placeholder="" v-model="queryParam.delName"></a-input>
              </a-form-item>
            </a-col>-->
            <a-col :md="8" :sm="8">
              <a-form-item label="领取时间">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.createTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="使用时间">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.userTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange1"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="赠送时间">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.userTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange2"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="店铺名称">
                <a-input placeholder="" v-model="queryParam.storeName"></a-input>
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
    <!-- <div class="table-operator">
       <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
       <a-button type="primary" icon="download" @click="handleExportXls('兑换券记录')">导出</a-button>
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
        :scroll="{x:3000}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <template slot="headPortrait" slot-scope="text, record, index">
          <img class="clickShowImage" :preview="'headPortrait' + index"  :src="record.headPortrait" alt="">
        </template>
        <template slot="goods" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a @click="showGoodInformation(record.marketingCertificateId)">{{record.goods}}</a>
          </div>
        </template>
        <template slot="stores" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a @click="showStoreInfo(record.marketingCertificateId)">{{record.stores}}</a>
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
    <marketingCertificateRecord-modal ref="modalForm" @ok="modalFormOk"></marketingCertificateRecord-modal>
    <AppMarketingCertificateGoodModal ref="AppMarketingCertificateGoodModal"></AppMarketingCertificateGoodModal>
    <AppMarketingCertificateStoreModal ref="AppMarketingCertificateStoreModal"></AppMarketingCertificateStoreModal>
  </a-card>
</template>

<script>
  import MarketingCertificateRecordModal from './modules/MarketingCertificateRecordModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import {filterObj} from '@/utils/util';
  import {ACCESS_TOKEN} from "@/store/mutation-types"
  import Vue from 'vue'
  import AppMarketingCertificateGoodModal from './modules/AppMarketingCertificateGoodModal'
  import AppMarketingCertificateStoreModal from './modules/AppMarketingCertificateStoreModal'
  export default {
    name: "MarketingStoreCertificateRecordList",
    mixins: [JeecgListMixin],
    components: {
      MarketingCertificateRecordModal,
      AppMarketingCertificateGoodModal,
      AppMarketingCertificateStoreModal
    },
    data () {
      return {
        description: '兑换券记录管理页面',
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
            title: '头像',
            align: "center",
            dataIndex: 'headPortrait',
            scopedSlots: {customRender: "headPortrait"}
          },
          {
            title: '手机号',
            align: "center",
            dataIndex: 'phone'
          },
          {
            title: '昵称',
            align: "center",
            dataIndex: 'nickName'
          },
          {
            title: '券号',
            align: "center",
            dataIndex: 'qqzixuangu'
          },
          {
            title: '兑换券名称',
            align: "center",
            dataIndex: 'name'
          },
          {
            title: '兑换商品',
            align: "center",
            dataIndex: 'goods',
            scopedSlots: {customRender: "goods"}
          },
          {
            title: '核销门店',
            align: "center",
            dataIndex: 'stores',
            scopedSlots: {customRender: "stores"}
          },
          {
            title: '状态',
            align: "center",
            dataIndex: 'status_dictText'
          },
          {
            title: '获取渠道',
            align: "center",
            dataIndex: 'theChannel'
          },
          {
            title: '有效期',
            align: "center",
            dataIndex: 'indate'
          },
          {
            title: '领取时间',
            align: "center",
            dataIndex: 'createTime'
          },
          {
            title: '赠送时间',
            align: "center",
            dataIndex: 'sendTime'
          },
          {
            title: '获赠人',
            align: "center",
            dataIndex: 'giveName'
          },
          {
            title: '使用时间',
            align: "center",
            dataIndex: 'ctime'
          },
          {
            title: '核销人',
            align: "center",
            dataIndex: 'delName'
          },
          {
            title: '店铺名称',
            align: "center",
            dataIndex: 'storeName'
          },
          /*{
           title: '操作',
           dataIndex: 'action',
           align: "center",
           scopedSlots: {customRender: 'action'},
           }*/
        ],
        url: {
          list: "/marketingCertificateRecord/marketingCertificateRecord/findStoreCertificateRecord",
          delete: "/marketingCertificateRecord/marketingCertificateRecord/delete",
          deleteBatch: "/marketingCertificateRecord/marketingCertificateRecord/deleteBatch",
          exportXlsUrl: "marketingCertificateRecord/marketingCertificateRecord/exportXls",
          importExcelUrl: "marketingCertificateRecord/marketingCertificateRecord/importExcel",
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      //适用商品弹窗
      showGoodInformation(id){
        this.$refs.AppMarketingCertificateGoodModal.showModalVisible(id);
      },
      //核销门店
      showStoreInfo(id){
        this.$refs.AppMarketingCertificateStoreModal.showModalVisible(id);
      },
      // /**查询栏时间区间查询*/
      getQueryParams(){
        console.log(this.queryParam.createTime)
        var param = Object.assign({}, this.queryParam,this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        delete param.createTime;
        delete param.userTime;
        return filterObj(param);
      },
      onDateChange: function (value, dateString) {
        this.queryParam.createTime_begin=dateString[0];
        this.queryParam.createTime_end=dateString[1];
      },
      onDateChange1: function (value, dateString) {
        this.queryParam.userTime_begin=dateString[0];
        this.queryParam.userTime_end=dateString[1];
      },
      onDateChange2: function (value, dateString) {
        this.queryParam.useTime_begin1=dateString[0];
        this.queryParam.useTime_end1=dateString[1];
      },
      getAvatarView: function (headPortrait) {
        return this.url.imgerver + "/" + headPortrait;
      },
    }
  }
</script>
<style scoped>
</style>