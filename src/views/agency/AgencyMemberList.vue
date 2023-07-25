<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="手机号">
              <a-input placeholder="请输入手机号" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="微信昵称">
              <a-input placeholder="请输入微信昵称" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="性别">
              <j-dict-select-tag  v-model="queryParam.sex"  placeholder="请选择性别"
                                  dictCode="sex"/>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="会员类型">
                <j-dict-select-tag  v-model="queryParam.memberType"  placeholder="请选择会员类型"
                                    dictCode="member_type"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="是否开店">
                <!--下拉框-->
                <a-select v-model = "queryParam.isOpenStore" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option value="0">否</a-select-option>
                  <a-select-option value="1">是</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="推广人">
                <a-input placeholder="请输入" v-model="queryParam.promoterName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="归属店铺">
                <a-input placeholder="请输入" v-model="queryParam.storeName"></a-input>
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
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="开通vip时间">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.vipTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange1"
                />
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="8" :sm="8">
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
      <!--<a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
      <!--<a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('会员列表')">导出</a-button>-->

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
    </div>

    <!-- table区域-begin -->
    <div >

      <a-table
        ref="table"
        size="middle"
        :scroll="{x:2500}"
        rowKey="id"
        :columns="columns"
        bordered
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <template slot="headPortrait" slot-scope="text, record, index">
          <img class="clickShowImage" v-if="record.headPortrait != undefined " :preview="'headPortrait' + index" :src="record.headPortrait" alt=""/>
        </template>
        <template slot="ssAddress" slot-scope="text, record, index">
          <img class="clickShowImage" v-if="record.ssAddress != undefined " :preview="'ssAddress' + index" :src="ssAddressView(record.ssAddress)" alt=""/>
        </template>
        <span slot="action" slot-scope="text, record" v-if="record.isPlatform==1">
          <a v-if="record.status==1" @click="showModal(record.id)">停用</a>
          <a v-if="record.status==0" @click="updateStatus(record.id)">启用</a>
        </span>
      </a-table>
    </div>
  </a-card>
</template>

<script>
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import {filterObj} from '@/utils/util';
  import {deleteAction, getAction, downFile} from '@/api/manage'
  import Vue from 'vue'
  import {ACCESS_TOKEN} from "@/store/mutation-types"
  import {putAction} from '@/api/manage'
  export default {
    name: "AgencyMemberList",
    mixins: [JeecgListMixin],
    components: {
    },
    data () {
      return {
        description: '代理会员列表',
        queryParam: {
          createTime: [],
          vipTime: [],
        },
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
            title: '微信昵称',
            align: "center",
            dataIndex: 'nickName'
          },
          {
            title: '性别',
            align: "center",
            dataIndex: 'sex_dictText',
          },
          {
            title: '地区',
            align: "center",
            dataIndex: 'areaAddr'
          },
          {
            title: '会员类型',
            align: "center",
            dataIndex: 'memberType_dictText',
          },
          {
            title: '福利金',
            align: "center",
            dataIndex: 'welfarePayments'
          },
          {
            title: '钱包余额',
            align: "center",
            dataIndex: 'balance'
          },
          {
            title: '可用券',
            align: "center",
            dataIndex: 'discount'
          },
          {
            title: '商品收藏',
            align: "center",
            dataIndex: 'goodsCollection'
          },
          {
            title: '店铺关注',
            align: "center",
            dataIndex: 'attentionStore'
          },
          {
            title: '浏览记录',
            align: "center",
            dataIndex: 'browsingHistory'
          },
          {
            title: '是否开店',
            align: "center",
            dataIndex: 'isOpenStores',
          },
          {
            title: '推广人',
            align: "center",
            dataIndex: 'promoterName'
          },
          {
            title: '归属店铺',
            align: "center",
            dataIndex: 'storeName'
          },
          {
            title: '二维码',
            align: "center",
            dataIndex: 'ssAddress',
            scopedSlots: {customRender: "ssAddress"}
          },
          {
            title: '创建时间',
            align: "center",
            dataIndex: 'createTime'
          },
          {
            title: '开通vip的时间',
            align: "center",
            dataIndex: 'vipTime'
          },
        ],
        url: {
          list: "/memberList/memberList/findAgencyMemberList",
          delete: "/memberList/memberList/delete",
          deleteBatch: "/memberList/memberList/deleteBatch",
          exportXlsUrl: "memberList/memberList/exportXls",
          importExcelUrl: "memberList/memberList/importExcel",
          imgerver: window._CONFIG['domianURL'] + "/sys/common/view",
          updateStatusById: "memberList/memberList/updateStatusById"
        },
        visible: false,
        memberId: "",
        stopRemark: "",
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      ssAddressView: function (ssAddress) {
        return this.url.imgerver + "/" + ssAddress;
      },
      getQueryParams(){
        var param = Object.assign({}, this.queryParam,this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        delete param.createTime; // 时间参数不传递后台
        delete param.vipTime; // 时间参数不传递后台
        return filterObj(param);
      },
      onDateChange: function (value, dateString) {
        this.queryParam.createTime_begin=dateString[0];
        this.queryParam.createTime_end=dateString[1];
      },
      onDateChange1: function (value, dateString) {
        this.queryParam.vipTime_begin=dateString[0];
        this.queryParam.vipTime_end=dateString[1];
      },
      onDateOk(value) {
        console.log(value);
      },
    },
  }
</script>
<style scoped>
  .ant-modal-content{
    height: 40vh;
    overflow: scroll;
  }

</style>