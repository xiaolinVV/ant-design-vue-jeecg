<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="8" :sm="8">
            <a-form-item label="手机号">
              <a-input placeholder="请输入手机号" v-model="queryParam.iPhone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="微信昵称">
              <a-input placeholder="请输入微信昵称" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="联系人">
              <a-input placeholder="请输入联系人" v-model="queryParam.linkman"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="收货人手机号">
                <a-input placeholder="请输入收货人手机号" v-model="queryParam.phone"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="是否默认">
                <!--下拉框-->
                <a-select v-model="queryParam.isDefault" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option value="0">否</a-select-option>
                  <a-select-option value="1">是</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
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
      <!--      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
      <!--<a-button type="primary" icon="download" @click="handleExportXls('收货地址')">导出</a-button>-->
    </div>
    <!-- table区域-begin -->
    <a-table
      ref="table"
      size="middle"
      rowKey="id"
      bordered
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      :scroll="{x:true}"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      @change="handleTableChange">
      <template slot="isDefault" slot-scope="text, record, index">
        <div class="anty-img-wrap">
          <span shape="square" v-if="record.isDefault==0">否</span>
          <span shape="square" v-if="record.isDefault==1">是</span>
        </div>
      </template>
      <template slot="headPortrait" slot-scope="text, record, index">
        <img class="clickShowImage" :preview="'headPortrait' + index"  :src="record.headPortrait" alt="">
      </template>
    </a-table>

    <!-- table区域-end -->

    <!-- 表单区域 -->
    <memberShippingAddress-modal ref="modalForm" @ok="modalFormOk"></memberShippingAddress-modal>
  </a-card>
</template>

<script>
  import MemberShippingAddressModal from './modules/MemberShippingAddressModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import {filterObj} from '@/utils/util';
  import {deleteAction, getAction, downFile} from '@/api/manage'
  import Vue from 'vue'
  import {ACCESS_TOKEN} from "@/store/mutation-types"
  import {putAction} from '@/api/manage'
  export default {
    name: "MemberShippingAddressList",
    mixins: [JeecgListMixin],
    components: {
      MemberShippingAddressModal
    },
    data () {
      return {
        description: '收货地址管理页面',
        createTime: [],
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
            dataIndex: 'iphone'
          },
          {
            title: '微信昵称',
            align: "center",
            dataIndex: 'nickName'
          },
          {
            title: '联系人',
            align: "center",
            dataIndex: 'linkman'
          },
          {
            title: '收货人手机号',
            align: "center",
            dataIndex: 'phone'
          },
          {
            title: '收货城市',
            align: "center",
            dataIndex: 'areaExplan'
          },
          {
            title: '详细地址',
            align: "center",
            dataIndex: 'areaAddress'
          },
          {
            title: '是否默认',
            align: "center",
            dataIndex: 'isDefault',
            scopedSlots: {customRender: "isDefault"}
          },
          {
            title: '创建时间',
            align: "center",
            dataIndex: 'createTime'
          },
        ],
        url: {
          list: "/memberShippingAddress/memberShippingAddress/list",
          delete: "/memberShippingAddress/memberShippingAddress/delete",
          deleteBatch: "/memberShippingAddress/memberShippingAddress/deleteBatch",
          exportXlsUrl: "memberShippingAddress/memberShippingAddress/exportXls",
          importExcelUrl: "memberShippingAddress/memberShippingAddress/importExcel",
          imgerver: window._CONFIG['domianURL'] + "/sys/common/view",
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      getQueryParams(){
        console.log(this.queryParam.createTime)
        var param = Object.assign({}, this.queryParam, this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        delete param.createTime; // 时间参数不传递后台
        return filterObj(param);
      },
      onDateChange: function (value, dateString) {
        console.log(dateString[0], dateString[1]);
        this.queryParam.createTime_begin = dateString[0];
        this.queryParam.createTime_end = dateString[1];
      },
      onDateOk(value) {
        console.log(value);
      },
    }
  }
</script>
<style scoped lang="less">
  .table-operator {
    margin-bottom: 10px;
    button {
      margin-right: 8px;
    }
  }
</style>