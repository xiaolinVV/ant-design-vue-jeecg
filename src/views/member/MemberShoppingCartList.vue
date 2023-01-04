<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="手机号">
              <a-input placeholder="手机号" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="微信昵称">
              <a-input placeholder="请输入微信昵称" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
          <!--时间选择框-->
          <a-col :md="6" :sm="8">
            <a-form-item label="收藏时间">
              <a-range-picker
                style="width: 210px"
                v-model="queryParam.addTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
                @ok="onDateOk"
              />
            </a-form-item>
          </a-col>

          <template v-if="toggleSearchStatus">

          </template>
          <a-col :md="6" :sm="8" >
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
      <a-button type="primary" icon="download" @click="handleExportXls('购物车商品')">导出</a-button>
    </div>

    <!-- table区域-begin -->
    <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
      <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
      <a style="margin-left: 24px" @click="onClearSelected">清空</a>
    </div>
     <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :scroll="{x:true}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <template slot="headPortrait" slot-scope="text, record, index">
          <img class="clickShowImage" :preview="'headPortrait' + index"  :src="record.headPortrait" alt="" height="25px" style="max-width:80px;font-size: 12px;font-style: italic;">
        </template>
        <template slot="frameStatus" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.frameStatus==0" >下架</span>
            <span shape="square" v-if="record.frameStatus==1" >上架</span>
          </div>
        </template>
        <template slot="delFlag" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.delFlag==0" >否</span>
            <span shape="square" v-if="record.delFlag==1" >是</span>
          </div>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
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

    <!-- table区域-end -->

    <!-- 表单区域 -->
    <memberShoppingCart-modal ref="modalForm" @ok="modalFormOk"></memberShoppingCart-modal>
  </a-card>
</template>

<script>
  import MemberShoppingCartModal from './modules/MemberShoppingCartModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {filterObj} from '@/utils/util';
  export default {
    name: "MemberShoppingCartList",
    mixins:[JeecgListMixin],
    components: {
      MemberShoppingCartModal
    },
    data () {
      return {
        description: '购物车商品管理页面',
        addTime:[],
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title: '头像',
            align:"center",
            dataIndex: 'headPortrait',
            scopedSlots: {customRender: "headPortrait"}
          },
          {
            title: '手机号',
            align:"center",
            dataIndex: 'phone'
          },
          {
            title: '微信昵称',
            align:"center",
            dataIndex: 'nickName'
          },
          {
            title: '商品名称',
            align:"center",
            dataIndex: 'goodName'
          },
          {
            title: '加入时价格',
            align:"center",
            dataIndex: 'addPrice'
          },
          {
            title: '当前价格',
            align:"center",
            dataIndex: 'price'
          },
          {
            title: '降价金额',
            align:"center",
            dataIndex: 'depreciate'
          },
          {
            title: '当前活动',
            align:"center",
            dataIndex: 'activitiesType_dictText',
            sorter:true,
          },
          {
            title: '可用优惠券',
            align:"center",
            dataIndex: 'discountCoupon'
          },
          {
            title: '商品状态',
            align:"center",
            dataIndex: 'frameStatus',
            scopedSlots: {customRender: "frameStatus"}
          },
          {
            title: '是否删除',
            align:"center",
            dataIndex: 'delFlag',
            scopedSlots: {customRender: "delFlag"}
          },
          {
            title: '加入时间',
            align:"center",
            dataIndex: 'addTime'
          },
      ],

          url: {
          list: "/memberShoppingCart/memberShoppingCart/list",
          delete: "/memberShoppingCart/memberShoppingCart/delete",
          deleteBatch: "/memberShoppingCart/memberShoppingCart/deleteBatch",
          exportXlsUrl: "memberShoppingCart/memberShoppingCart/exportXls",
          importExcelUrl: "memberShoppingCart/memberShoppingCart/importExcel",
       },
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    methods: {
      getQueryParams(){
        console.log(this.queryParam.addTime)
        var param = Object.assign({}, this.queryParam,this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        delete param.addTime; // 时间参数不传递后台
        return filterObj(param);
      },
      onDateChange: function (value, dateString) {
         this.queryParam.createTime_begin=dateString[0];
        this.queryParam.createTime_end=dateString[1];
      },
      onDateOk(value) {
        console.log(value);
      },
    }
  }
</script>
<style scoped lang="less">
  .table-operator{
    margin-bottom: 10px;
    button{
      margin-right: 8px;
    }
  }
</style>